#!/usr/bin/env python3
"""Check that the numbers README.md quotes about itself are still true.

README.md ends with a "Currently:" block — 274 markdown files, 1011 internal
links, 138 section indexes, 102 files carrying a diagram — and opens by
describing the codex as 266 notes across 23 layer folders. Those are load
bearing: they are the first thing a reader uses to decide whether the project
is what it claims to be.

Nothing checked them, so they drifted. The diagram count sat at 101 against a
real 102, and the link count went stale again the moment a Licensing section
added two links to it. Every other convention in this repository is enforced
by a script for exactly this reason, so this is the fifth.

    python3 tools/stats_audit.py

## How it fails matters

A checker built on regexes has a failure mode worse than the drift it
prevents: someone rewords the sentence, the pattern quietly stops matching,
and the audit reports success forever while checking nothing. That has
happened three times in this repository's short history, which is why the
rule here is that a claim which cannot be *found* is as much a fault as a
claim that is wrong:

  STALE       the claim was found and the number disagrees with the tree
  NOT FOUND   the pattern matched nothing — the README was reworded
  AMBIGUOUS   the pattern matched more than once, so there is no single
              claim to check

Only the first is drift. The other two mean this audit has stopped doing its
job, and they fail the build just as loudly.

## Scope

Codex numbers only. The LMS's own claims — seven phases, 43 topics — are
gated by Codex_LMS/test/smoke.mjs, which opens all 43 and asserts each one
renders. Checking them from here would duplicate that, and the two copies
would drift apart.

Exit status is 1 if anything is off, so this works as a CI gate.
"""

from __future__ import annotations

import argparse
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import _common  # noqa: E402
import diagram_audit  # noqa: E402
import link_audit  # noqa: E402
import title_audit  # noqa: E402


def measure(root: str) -> dict[str, int]:
    """The real numbers, taken from the audits that already compute them.

    Deliberately not reimplemented here. If this counted files its own way it
    would eventually disagree with the audits over some edge case, and then it
    would report drift that does not exist — a README number consistent with
    every audit but not with the checker asserting it.
    """
    files = list(_common.walk_markdown(root))

    layer_readmes = diagram_audit.layer_readmes(root)
    layer_dirs = [os.path.dirname(p) for p in layer_readmes]

    # A "note" is markdown that lives inside a layer folder. That excludes the
    # root documents (README, LAYERS, STRUCTURE, CHANGELOG), _assets/, tools/,
    # and both applications — none of which is the reference.
    notes = sum(1 for path, _ in files
                if any(path.startswith(d + os.sep) for d in layer_dirs))

    stats, broken, _, _ = link_audit.audit(root)

    indexes = sum(1 for path, _ in files
                  if os.path.basename(path) == "INDEX.md"
                  and os.path.basename(os.path.dirname(path))
                  in title_audit.CANONICAL)

    diagrams = sum(1 for path, _ in files if diagram_audit.audit_file(path)[1])

    return {
        "files": len(files),
        "notes": notes,
        "layers": len(layer_readmes),
        "links": stats["links"],
        "broken": len(broken),
        "indexes": indexes,
        "diagrams": diagrams,
    }


# (file, key, human label, pattern). The pattern must capture exactly one
# number and must match exactly one place in the file.
CLAIMS = [
    ("README.md", "notes", "markdown notes",
     r"(\d+) markdown notes across \d+ layer folders"),
    ("README.md", "layers", "layer folders (in the codex row)",
     r"\d+ markdown notes across (\d+) layer folders"),
    ("README.md", "layers", "layer folders (in the layer model)",
     r"^(\d+) layers in four bands"),
    ("README.md", "files", "markdown files",
     r"^- (\d+) markdown files$"),
    ("README.md", "links", "internal links",
     r"^- ([\d]+) internal links, \d+ broken$"),
    ("README.md", "broken", "broken links",
     r"^- [\d]+ internal links, (\d+) broken$"),
    ("README.md", "indexes", "section indexes",
     r"^- All (\d+) section indexes titled"),
    ("README.md", "diagrams", "files carrying a diagram",
     r"^- (\d+) files carry a diagram"),
]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default=_common.repo_root())
    args = parser.parse_args()

    real = measure(args.root)
    faults: list[tuple[str, str, str]] = []

    for filename, key, label, pattern in CLAIMS:
        path = os.path.join(args.root, filename)
        try:
            text = open(path, encoding="utf-8").read()
        except OSError as exc:
            faults.append(("NOT FOUND", label, f"{filename}: {exc}"))
            continue

        found = re.findall(pattern, text, re.M)
        if not found:
            faults.append(("NOT FOUND", label,
                           f"{filename} has no match for /{pattern}/ — "
                           "reworded? this audit is no longer checking it"))
            continue
        if len(found) > 1:
            faults.append(("AMBIGUOUS", label,
                           f"{filename} matches /{pattern}/ {len(found)} times"))
            continue

        claimed, actual = int(found[0]), real[key]
        if claimed != actual:
            faults.append(("STALE", label,
                           f"{filename} says {claimed}, tree has {actual}"))

    print(f"claims checked  {len(CLAIMS)}")
    print(f"stat faults     {len(faults)}")

    if faults:
        print()
        for kind, label, detail in faults:
            print(f"  {kind:10s} {label}  ({detail})")
        print("\nupdate README.md, or the claim, so the two agree")
        return 1

    print()
    for key in sorted(real):
        print(f"  {real[key]:6d}  {key}")
    print("\nevery number README quotes about itself is true")
    return 0


if __name__ == "__main__":
    sys.exit(main())
