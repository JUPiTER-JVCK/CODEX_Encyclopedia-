#!/usr/bin/env python3
"""Check that every section INDEX.md carries a canonical, discoverable title.

Each layer folder holds six sub-sections, each with an INDEX.md as its entry
point. The macOS app shows the first H1 of a file wherever it needs a name, so
these headings are what a reader sees in the command palette, the tab strip and
the recents list — flat lists with no surrounding path to give them context.

That makes four things faults rather than blemishes:

  BAD TITLE      H1 is not "<Layer> — <Section>" with a canonical section name
  BURIED TITLE   content sits above the H1, so the file opens on something else
  FRONTMATTER    an entry point carries YAML frontmatter (STRUCTURE.md exempts
                 INDEX.md and README.md — they are navigation, not notes)
  LAYER DRIFT    one layer folder spells its own name two different ways

All four came from bulk edits that nothing checked, which is why this is a
script and not a convention.

    python3 tools/title_audit.py

Exit status is 1 if anything is off, so this works as a CI gate.
"""

from __future__ import annotations

import argparse
import os
import sys

SKIP_DIRS = {".git", "node_modules", "dist", ".build", "Codex.app"}

# Section folder -> the one name its INDEX.md heading may use. Mirrors
# CodexTree.subsectionOrder / CodexTree.pretty in the macOS app; changing a
# name here means changing it there too.
CANONICAL = {
    "references": "References",
    "lessons": "Lessons",
    "languages": "Languages",
    "man_pages": "Manual Pages",
    "topics": "Topics",
    "protocols": "Protocols",
}

EM_DASH = "—"


def read_lines(path: str) -> list[str]:
    # Split on "\n" rather than splitlines(): this reports line numbers a
    # person then looks up in an editor, and splitlines() also breaks on
    # \v, \f and U+2028, which no editor treats as a line end. Text mode
    # already folds \r\n and \r to \n, so CRLF needs nothing extra.
    with open(path, encoding="utf-8") as fh:
        return fh.read().split("\n")


def audit_file(path: str, section: str) -> list[tuple[str, str]]:
    """Faults for one section INDEX.md, as (kind, detail) pairs."""
    faults: list[tuple[str, str]] = []
    lines = read_lines(path)

    if lines and lines[0].strip() == "---":
        faults.append(("FRONTMATTER", "entry points carry none (STRUCTURE.md)"))

    h1_idx = next((i for i, l in enumerate(lines) if l.startswith("# ")), None)
    if h1_idx is None:
        faults.append(("BAD TITLE", "no H1 at all"))
        return faults

    # The H1 must be the first thing in the file. Frontmatter is the one
    # legitimate thing above it, and this file should not have any -- but
    # report the two faults separately rather than cascading them.
    first = next((i for i, l in enumerate(lines) if l.strip()), 0)
    if h1_idx != first and lines[first].strip() != "---":
        faults.append(("BURIED TITLE",
                       f"H1 on line {h1_idx + 1}, file opens on line {first + 1}"))

    title = lines[h1_idx][2:].strip()
    want_section = CANONICAL[section]
    if EM_DASH not in title:
        faults.append(("BAD TITLE", f"{title!r} is not '<Layer> {EM_DASH} <Section>'"))
        return faults

    layer, _, got_section = title.partition(EM_DASH)
    layer, got_section = layer.strip(), got_section.strip()
    if got_section != want_section:
        faults.append(("BAD TITLE",
                       f"{got_section!r} should be {want_section!r}"))
    if not layer:
        faults.append(("BAD TITLE", "no layer name before the dash"))

    return faults


def layer_name(path: str) -> str | None:
    """The layer name a file's H1 claims, or None if it has no usable H1."""
    for line in read_lines(path):
        if line.startswith("# ") and EM_DASH in line:
            return line[2:].partition(EM_DASH)[0].strip()
    return None


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default=os.path.dirname(os.path.dirname(
        os.path.abspath(__file__))))
    args = parser.parse_args()

    total = 0
    faults: list[tuple[str, str, str]] = []
    # layer folder -> {claimed name: [files]}, to catch a folder spelling
    # itself two ways across its six indexes.
    by_layer: dict[str, dict[str, list[str]]] = {}

    for dirpath, dirnames, filenames in os.walk(args.root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        if "INDEX.md" not in filenames:
            continue
        section = os.path.basename(dirpath)
        if section not in CANONICAL:
            continue

        path = os.path.join(dirpath, "INDEX.md")
        rel = os.path.relpath(path, args.root)
        total += 1
        faults.extend((rel, kind, detail)
                      for kind, detail in audit_file(path, section))

        layer_dir = os.path.dirname(dirpath)
        name = layer_name(path)
        if name:
            by_layer.setdefault(layer_dir, {}).setdefault(name, []).append(rel)

    drift: list[tuple[str, str, str]] = []
    for layer_dir, names in sorted(by_layer.items()):
        if len(names) < 2:
            continue
        # The spelling used by most of the layer's indexes is the right one.
        # Iterate sorted so a tie resolves the same way everywhere: without
        # it the winner falls out of os.walk order, which is filesystem
        # dependent, and a 3-3 split across six indexes would name a
        # different file as the offender on a different machine.
        winner = max(sorted(names), key=lambda n: len(names[n]))
        tied = sum(1 for n in names if len(names[n]) == len(names[winner])) > 1
        for name, files in sorted(names.items()):
            if name == winner:
                continue
            # On a tie neither spelling is the majority, so say so rather
            # than presenting an arbitrary pick as the established one.
            note = ("no majority — this layer is split, pick one"
                    if tied else f"this layer uses {winner!r}")
            for rel in files:
                drift.append((rel, "LAYER DRIFT", f"{name!r} but {note}"))

    faults.extend(drift)
    faults.sort()

    print(f"section indexes  {total}")
    print(f"title faults     {len(faults)}")

    if faults:
        counts: dict[str, int] = {}
        for _, kind, _ in faults:
            counts[kind] = counts.get(kind, 0) + 1
        print()
        for kind in sorted(counts):
            print(f"  {counts[kind]:3d}  {kind}")
        print()
        for rel, kind, detail in faults:
            print(f"  {kind:13s} {rel}  ({detail})")
        return 1

    print("\nevery section index titled canonically")
    return 0


if __name__ == "__main__":
    sys.exit(main())
