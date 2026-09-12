#!/usr/bin/env python3
"""Check the ASCII diagrams that carry most of this codex's illustration.

The codex has no images — `_assets/` is empty — so every diagram is drawn with
box characters inside a fenced code block. That works everywhere the codex is
read (GitHub, any markdown viewer, the macOS app's code-block renderer) and
stays reviewable in a diff, which an image does not.

It has exactly one failure mode, and it is silent: box characters outside a
fence render in a proportional font, where the columns no longer line up and
the drawing collapses into noise. Nothing about the source looks wrong.

Reports three faults:

  UNFENCED       box characters in prose, outside any code block
  TOO WIDE       a diagram line past the column limit, which wraps or scrolls
  NO DIAGRAM     a layer README with no diagram at all

Inline code spans are stripped before the unfenced check: `-3*[worker]` in
prose is a mention, not a drawing. `link_audit.py` strips the same way.

    python3 tools/diagram_audit.py

Exit status is 1 if anything is off, so this works as a CI gate.
"""

from __future__ import annotations

import argparse
import os
import re
import sys

# Run as a script, sys.path[0] is tools/; imported by stats_audit,
# tools/ is already on the path. Either way this resolves.
import _common

# A fence opens with three or more backticks and closes only on a run at
# least as long. A shorter run inside is content -- which is how this repo's
# own STRUCTURE.md shows a ```text block inside a ````-fenced example.
FENCE_RE = re.compile(r"^\s*(`{3,})")

# Box drawing, block elements and the arrows the existing diagrams use.
BOX = set("─│┌┐└┘├┤┬┴┼━┃┏┓┗┛┣┫┳┻╋╔╗╚╝═║╠╣╦╩╬╭╮╰╯▶◀◄►▲▼")

# Widest existing diagram line is 86 columns; p99 is 77. 90 leaves room
# without letting a new diagram grow past what a narrow pane can show.
MAX_WIDTH = 90

CODE_SPAN_RE = re.compile(r"`[^`\n]*`")

# A layer folder is one holding a README plus at least one sub-section.
SUBSECTIONS = {"references", "lessons", "languages", "man_pages", "topics",
               "protocols"}


def classify(lines: list[str]) -> tuple[list[int], list[int]]:
    """Line numbers (1-based) of fenced diagram lines, and of unfenced ones.

    Unfenced detection strips inline code spans first, so a box character
    quoted inside backticks is a mention rather than a broken drawing.
    """
    fenced_hits, loose_hits = [], []
    fence_len = 0
    for i, raw in enumerate(lines, start=1):
        m = FENCE_RE.match(raw)
        if m:
            run = len(m.group(1))
            if not fence_len:
                fence_len = run
                continue
            if run >= fence_len and raw[m.end():].strip() == "":
                fence_len = 0
                continue
        if fence_len:
            if BOX & set(raw):
                fenced_hits.append(i)
        elif BOX & set(CODE_SPAN_RE.sub("", raw)):
            loose_hits.append(i)
    return fenced_hits, loose_hits


def audit_file(path: str) -> tuple[list[tuple[int, str, str]], bool]:
    """Faults in one file, and whether it contains a fenced diagram."""
    with open(path, encoding="utf-8") as fh:
        lines = fh.read().split("\n")

    fenced, loose = classify(lines)
    faults = [(ln, "UNFENCED", "box characters outside a code block")
              for ln in loose]
    faults += [(ln, "TOO WIDE",
                f"{len(lines[ln - 1])} columns, limit {MAX_WIDTH}")
               for ln in fenced if len(lines[ln - 1]) > MAX_WIDTH]
    return faults, bool(fenced)


def layer_readmes(root: str) -> list[str]:
    """Every layer folder's README.md, found by shape rather than by name."""
    found = []
    for dirpath, dirnames, filenames in _common.walk_dirs(root):
        if "README.md" in filenames and SUBSECTIONS & set(dirnames):
            found.append(os.path.join(dirpath, "README.md"))
    return sorted(found)


# Fence handling has been wrong twice: first by toggling on any run of three
# backticks (which broke on a ````-fenced example containing ```text), then by
# treating a run with an info string as a close. Both were found by review
# rather than by running anything, so the cases live here now.
FENCE_CASES = [
    (
        "info string cannot close a fence",
        ["```", "┌───┐", "```text", "│ x │", "└───┘", "```"],
        [2, 4, 5], [],
    ),
    (
        "a longer fence nests a shorter one",
        ["````", "```text", "│ x │", "```", "````"],
        [3], [],
    ),
    (
        "a shorter run cannot close a longer fence",
        ["````", "```", "│ x │", "````"],
        [3], [],
    ),
    (
        "box characters in prose are unfenced",
        ["not fenced ─── at all"],
        [], [1],
    ),
    (
        "an inline code span is a mention, not a drawing",
        ["prose with `─3*[worker]` inside it"],
        [], [],
    ),
    (
        "trailing whitespace still closes",
        ["```", "│ x │", "```   "],
        [2], [],
    ),
]


def self_test() -> int:
    """Assert the fence rules directly. `python3 tools/diagram_audit.py --self-test`."""
    failed = 0
    for name, doc, want_fenced, want_loose in FENCE_CASES:
        fenced, loose = classify(doc)
        ok = fenced == want_fenced and loose == want_loose
        print(f"  {'ok  ' if ok else 'FAIL'} {name}")
        if not ok:
            print(f"       fenced {fenced} want {want_fenced}")
            print(f"       loose  {loose} want {want_loose}")
            failed += 1
    print(f"\n{len(FENCE_CASES) - failed}/{len(FENCE_CASES)} fence cases pass")
    return 1 if failed else 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default=os.path.dirname(os.path.dirname(
        os.path.abspath(__file__))))
    parser.add_argument("--self-test", action="store_true",
                        help="check the fence rules against known cases and exit")
    args = parser.parse_args()

    if args.self_test:
        return self_test()

    faults: list[tuple[str, int, str, str]] = []
    files = diagrams = 0

    for path, rel in _common.walk_markdown(args.root):
        files += 1
        file_faults, has = audit_file(path)
        diagrams += has
        faults.extend((rel, ln, kind, detail)
                      for ln, kind, detail in file_faults)

    layers = layer_readmes(args.root)
    for path in layers:
        rel = os.path.relpath(path, args.root)
        _, has = audit_file(path)
        if not has:
            faults.append((rel, 1, "NO DIAGRAM",
                           "a layer overview should show where the layer sits"))

    faults.sort()

    print(f"markdown files   {files}")
    print(f"with a diagram   {diagrams}")
    print(f"layer READMEs    {len(layers)}")
    print(f"diagram faults   {len(faults)}")

    if faults:
        counts: dict[str, int] = {}
        for _, _, kind, _ in faults:
            counts[kind] = counts.get(kind, 0) + 1
        print()
        for kind in sorted(counts):
            print(f"  {counts[kind]:3d}  {kind}")
        print()
        for rel, line, kind, detail in faults:
            print(f"  {kind:11s} {rel}:{line}  ({detail})")
        return 1

    print("\nevery diagram fenced, sized, and where it is needed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
