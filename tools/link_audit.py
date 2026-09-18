#!/usr/bin/env python3
"""Check every relative markdown link and image in the codex.

Walks the repository, resolves each relative link against the file that
contains it, and reports the ones that do not exist. Inline code spans are
stripped first, so a syntax example like `[text](path.md)` in prose is not
mistaken for a real link.

    python3 tools/link_audit.py            # summary + any breakages
    python3 tools/link_audit.py --verbose  # also list every external link

Exit status is 1 if anything is broken, so this works as a CI gate.
"""

from __future__ import annotations

import argparse
import os
import re
import sys
import urllib.parse

# Run as a script, sys.path[0] is tools/; imported by stats_audit,
# tools/ is already on the path. Either way this resolves.
import _common

# There was a tolerance list here: four image filenames the codex referenced
# but did not ship, excused so the build would not fail over "a known,
# deliberate gap". It was dead code — the codex contains zero `![](...)`
# links, so `stats["images"]` is 0 and the branch reading this never ran. The
# four references were in prose and frontmatter, where this audit could not
# see them at all, and they outlived the tolerance by a year.
#
# `diagram_audit.py` checks those forms now, and the four are drawn rather
# than promised. A broken image link is simply broken here.

# GitHub templates are fragments pasted into a pull request or issue body,
# not documents. An H1 in one renders as a full-width heading on every PR
# that uses it, so they conventionally start at "##". They are still checked
# for links and tables; only the H1 requirement is lifted.
#
# Exactly two things are exempt: that one file, and files inside the issue
# template directory. This was a `startswith` test over both names until
# review pointed out what that also swallowed — `pull_request_template.md.backup.md`
# and `ISSUE_TEMPLATE-old.md` are neither templates nor exempt, but both
# carry the prefix. Hence an equality test and an explicit separator, and
# H1_EXEMPT_CASES below so the boundary is asserted rather than described.
H1_EXEMPT_FILE = os.path.join(".github", "pull_request_template.md")
H1_EXEMPT_DIR = os.path.join(".github", "ISSUE_TEMPLATE") + os.sep


def needs_h1(rel: str) -> bool:
    return rel != H1_EXEMPT_FILE and not rel.startswith(H1_EXEMPT_DIR)


# (path, does it still need an H1). The three True rows next to a template
# name are the regression: each one was exempt before the fix above.
H1_EXEMPT_CASES = [
    (os.path.join(".github", "pull_request_template.md"), False),
    (os.path.join(".github", "ISSUE_TEMPLATE", "bug.md"), False),
    (os.path.join(".github", "ISSUE_TEMPLATE", "feature_request.md"), False),
    (os.path.join(".github", "pull_request_template.md.backup.md"), True),
    (os.path.join(".github", "ISSUE_TEMPLATE-old.md"), True),
    (os.path.join(".github", "pull_request_template.md.orig"), True),
    ("README.md", True),
    (os.path.join("00_Physics", "topics", "energy.md"), True),
]


def self_test() -> int:
    """Assert the H1 exemption covers the templates and nothing adjacent."""
    bad = 0
    for rel, want in H1_EXEMPT_CASES:
        got = needs_h1(rel)
        ok = got == want
        bad += not ok
        print(f"  {'ok  ' if ok else 'FAIL'}  needs_h1={got!s:5s}  {rel}")
    total = len(H1_EXEMPT_CASES)
    print(f"\n{total - bad}/{total} H1 exemption cases pass")
    return 1 if bad else 0


LINK_RE = re.compile(r"(?<!!)\[([^\]]*)\]\(([^)]+)\)")
IMAGE_RE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")
FENCE_RE = re.compile(r"^```", re.M)
CODE_SPAN_RE = re.compile(r"`[^`\n]*`")


def strip_code(text: str) -> str:
    """Blank out fenced blocks and inline spans, preserving line structure."""
    out, fenced = [], False
    for line in text.split("\n"):
        if line.lstrip().startswith("```"):
            fenced = not fenced
            out.append("")
            continue
        out.append("" if fenced else CODE_SPAN_RE.sub("", line))
    return "\n".join(out)


def markdown_files(root: str) -> list[str]:
    return sorted(path for path, _ in _common.walk_markdown(root))


def audit(root: str) -> tuple[dict, list, list]:
    stats = {"files": 0, "links": 0, "images": 0, "external": 0, "anchors": 0}
    broken, no_h1 = [], []

    for path in markdown_files(root):
        stats["files"] += 1
        with open(path, encoding="utf-8") as fh:
            raw = fh.read()
        rel = os.path.relpath(path, root)
        if needs_h1(rel) and not re.search(r"^# ", raw, re.M):
            no_h1.append(rel)

        body = strip_code(raw)
        for regex, is_image in ((LINK_RE, False), (IMAGE_RE, True)):
            for match in regex.finditer(body):
                href = match.group(2).strip().split(" ")[0]

                if href.startswith(("http://", "https://", "mailto:")):
                    stats["external"] += 1
                    continue
                if href.startswith("#"):
                    stats["anchors"] += 1
                    continue

                stats["images" if is_image else "links"] += 1
                target = urllib.parse.unquote(href.split("#")[0])
                if not target:
                    continue

                resolved = os.path.normpath(
                    os.path.join(os.path.dirname(path), target)
                )
                if os.path.exists(resolved):
                    continue

                broken.append((os.path.relpath(path, root), href))

    return stats, broken, no_h1


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default=os.path.dirname(os.path.dirname(
        os.path.abspath(__file__))))
    parser.add_argument("--verbose", action="store_true")
    parser.add_argument("--self-test", action="store_true",
                        help="assert the H1 exemption boundary, then exit")
    args = parser.parse_args()

    if args.self_test:
        return self_test()

    stats, broken, no_h1 = audit(args.root)

    print(f"markdown files   {stats['files']}")
    print(f"internal links   {stats['links']}")
    print(f"images           {stats['images']}")
    print(f"external links   {stats['external']}")
    print(f"anchor links     {stats['anchors']}")
    print(f"files without H1 {len(no_h1)}")

    if no_h1:
        print(f"\nmissing an H1 heading ({len(no_h1)}):")
        for rel in no_h1:
            print(f"  {rel}")

    if broken:
        print(f"\nBROKEN ({len(broken)}):")
        for src, href in broken:
            print(f"  {src}  ->  {href}")
        return 1

    print("\nno broken links")
    return 1 if no_h1 else 0


if __name__ == "__main__":
    sys.exit(main())
