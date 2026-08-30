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

# Directories holding application code or build output rather than codex
# content. Mirrors CodexTree.nonContentDirs in the macOS app — keep in sync.
SKIP_DIRS = {
    ".git",
    "node_modules",
    "dist",
    ".build",
    "Codex.app",
}

# Images the codex references but does not ship. Documented in
# _assets/README.md; listed here so the audit reports them separately
# instead of failing the build over a known, deliberate gap.
KNOWN_MISSING_IMAGES = {
    "computer_layers_ladder.png",
    "dslogic_decoder_list.png",
    "logic_gates_explained.png",
    "embedded_systems_roadmap.png",
}

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
    found = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        found.extend(
            os.path.join(dirpath, f) for f in filenames if f.endswith(".md")
        )
    return sorted(found)


def audit(root: str) -> tuple[dict, list, list, list]:
    stats = {"files": 0, "links": 0, "images": 0, "external": 0, "anchors": 0}
    broken, missing_images, no_h1 = [], [], []

    for path in markdown_files(root):
        stats["files"] += 1
        raw = open(path, encoding="utf-8").read()
        if not re.search(r"^# ", raw, re.M):
            no_h1.append(os.path.relpath(path, root))

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

                entry = (os.path.relpath(path, root), href)
                if is_image and os.path.basename(target) in KNOWN_MISSING_IMAGES:
                    missing_images.append(entry)
                else:
                    broken.append(entry)

    return stats, broken, missing_images, no_h1


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default=os.path.dirname(os.path.dirname(
        os.path.abspath(__file__))))
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    stats, broken, missing_images, no_h1 = audit(args.root)

    print(f"markdown files   {stats['files']}")
    print(f"internal links   {stats['links']}")
    print(f"images           {stats['images']}")
    print(f"external links   {stats['external']}")
    print(f"anchor links     {stats['anchors']}")
    print(f"files without H1 {len(no_h1)}")

    if missing_images:
        print(f"\nknown-missing images ({len(missing_images)}) "
              f"— see _assets/README.md")
        if args.verbose:
            for src, href in missing_images:
                print(f"  {src}  ->  {href}")

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
