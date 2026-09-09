"""Shared tree walk for the audits in this directory.

Every audit answers a question about the same set of files: the markdown the
repository actually ships. Each one used to carry its own copy of SKIP_DIRS
and its own `os.walk` loop — four identical constants across six walk sites.

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

# Directories holding application code or build output rather than codex
# content. Everything here either is not ours or is regenerated, and both
# would swamp the real counts: node_modules alone carries 50 markdown files
# against the codex's 277.
#
# Mirrors CodexTree.nonContentDirs in the macOS app — keep the two in sync.
SKIP_DIRS = {".git", "node_modules", "dist", ".build", "Codex.app"}


def walk_markdown(root: str) -> Iterator[tuple[str, str]]:
    """Yield (absolute path, path relative to root) for each shipped .md file.

    Relative paths are what every audit prints, and they are what a person
    then pastes into an editor, so they are produced here rather than
    recomputed at each call site.
    """
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in sorted(filenames):
            if name.endswith(".md"):
                path = os.path.join(dirpath, name)
                yield path, os.path.relpath(path, root)


def repo_root() -> str:
    """The repository root, derived from this file's location."""
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
