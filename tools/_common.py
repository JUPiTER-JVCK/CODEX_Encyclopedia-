"""Shared tree walk for the audits in this directory.

Every audit answers a question about the same set of files: the markdown the
repository actually ships. Each one used to carry its own copy of SKIP_DIRS
and its own `os.walk` loop — four identical constants across six walk sites.
There is now exactly one `os.walk` in the whole of tools/, in this file.

That duplication stopped being harmless once `stats_audit.py` arrived. It
checks that the counts printed in README.md match reality, so it has to count
the *same* set the other audits count. A second, subtly different walk would
not report drift, it would invent it: a README number that matches every
audit but not the checker asserting it.

One definition, five consumers.
"""

from __future__ import annotations

import os
from typing import Iterator

# Dependencies, build output, and version control: everything here either is
# not ours or is regenerated, and both would swamp the real counts —
# node_modules alone carries 50 markdown files against the codex's 277.
#
# This is *audit* scope, and it is deliberately not the macOS app's
# CodexTree.nonContentDirs. That set also prunes codex_tui, Codex_macOS,
# Codex_LMS and tools, because the app shows the codex and those are not it.
# The audits do the opposite: README.md files inside Codex_LMS/ and
# Codex_macOS/ are authored documentation and are checked like any other.
# Do not "sync" the two — they answer different questions, and copying the
# app's set here would silently drop authored files from every count.
SKIP_DIRS = {".git", "node_modules", "dist", ".build", "Codex.app"}


def walk_markdown(root: str) -> Iterator[tuple[str, str]]:
    """Yield (absolute path, path relative to root) for each shipped .md file.

    Relative paths are what every audit prints, and they are what a person
    then pastes into an editor, so they are produced here rather than
    recomputed at each call site.
    """
    for dirpath, _, filenames in walk_dirs(root):
        for name in sorted(filenames):
            if name.endswith(".md"):
                path = os.path.join(dirpath, name)
                yield path, os.path.relpath(path, root)


def walk_dirs(root: str) -> Iterator[tuple[str, list[str], list[str]]]:
    """Yield (dirpath, subdirectory names, filenames) for each kept directory.

    The same prune as walk_markdown, for the one audit that asks a question
    about directories rather than files: diagram_audit finds layer folders by
    shape, testing whether a directory holding a README.md also holds the
    six codex sub-sections.
    """
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        yield dirpath, dirnames, filenames


def repo_root() -> str:
    """The repository root, derived from this file's location."""
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
