#!/usr/bin/env python3
"""Check every markdown pipe table for structural problems.

A GitHub-flavored markdown table needs a header row, a separator row, and
data rows that all agree on column count. Get any of that wrong and the
block renders as literal text instead of a table — silently, which is why
these survive review.

Reports three faults:

  NO HEADER      a separator row with no header line above it
  COL MISMATCH   header and separator disagree on column count
  ROW MISMATCH   a data row disagrees with the separator

Escaped pipes (``\\|``) are not cell separators and are excluded before
counting, as are fenced code blocks.

    python3 tools/table_audit.py

Exit status is 1 if anything is malformed, so this works as a CI gate.
"""

from __future__ import annotations

import argparse
import os
import re
import sys

SKIP_DIRS = {".git", "node_modules", "dist", ".build", "Codex.app"}

# A separator row: pipes and runs of dashes, optionally colon-aligned.
SEPARATOR_RE = re.compile(r"^\s*\|?(\s*:?-{2,}:?\s*\|)*\s*:?-{2,}:?\s*\|?\s*$")


def count_columns(line: str) -> int:
    """Cell count for one table row, ignoring escaped pipes."""
    stripped = line.replace(r"\|", "\0").strip()
    if stripped.startswith("|"):
        stripped = stripped[1:]
    if stripped.endswith("|"):
        stripped = stripped[:-1]
    return len(stripped.split("|"))


def audit_file(path: str) -> list[tuple[int, str, str]]:
    faults: list[tuple[int, str, str]] = []
    lines = open(path, encoding="utf-8").read().split("\n")
    in_fence = False

    for i, line in enumerate(lines):
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence or "|" not in line or not SEPARATOR_RE.match(line):
            continue

        sep_cols = count_columns(line)
        header = lines[i - 1] if i > 0 else ""

        if not header.strip() or "|" not in header:
            faults.append((i + 1, "NO HEADER", f"separator has {sep_cols} columns"))
            continue

        header_cols = count_columns(header)
        if header_cols != sep_cols:
            faults.append((i + 1, "COL MISMATCH",
                           f"header {header_cols}, separator {sep_cols}"))
            continue

        for j in range(i + 1, len(lines)):
            row = lines[j]
            if "|" not in row or not row.strip():
                break
            row_cols = count_columns(row)
            if row_cols != sep_cols:
                faults.append((j + 1, "ROW MISMATCH",
                               f"row {row_cols}, table {sep_cols}"))

    return faults


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default=os.path.dirname(os.path.dirname(
        os.path.abspath(__file__))))
    args = parser.parse_args()

    total_files = 0
    all_faults: list[tuple[str, int, str, str]] = []

    for dirpath, dirnames, filenames in os.walk(args.root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in sorted(filenames):
            if not name.endswith(".md"):
                continue
            path = os.path.join(dirpath, name)
            total_files += 1
            rel = os.path.relpath(path, args.root)
            all_faults.extend((rel, ln, kind, detail)
                              for ln, kind, detail in audit_file(path))

    print(f"markdown files   {total_files}")
    print(f"malformed tables {len(all_faults)}")

    if all_faults:
        print()
        for rel, line, kind, detail in all_faults:
            print(f"  {kind:13s} {rel}:{line}  ({detail})")
        return 1

    print("\nall tables well-formed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
