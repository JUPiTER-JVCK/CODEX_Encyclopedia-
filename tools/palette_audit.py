#!/usr/bin/env python3
"""Check the macOS reader's palettes against the schemes they claim to be.

THIRD_PARTY.md says these palettes reproduce published colour values. That was
originally asserted and wrong: the first version of Palettes.swift invented
five Nord greys, and review caught it. Prose cannot enforce itself, so this
does.

Codex needs 26 tokens per scheme — a nine-step surface/overlay ramp plus text
and fourteen accents. Most schemes publish fewer than that, so some values are
necessarily *derived*: interpolated between published steps to fill the ramp.
That is legitimate; silently claiming otherwise is not.

So each palette declares how many derived values it is allowed, and this fails
if the real count differs in either direction — too many means a new invention
slipped in, too few means the declaration is stale and the honest number is
better than a conservative one.

    python3 tools/palette_audit.py            # check
    python3 tools/palette_audit.py --list     # show every derived value
    python3 tools/palette_audit.py --self-test
"""

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(ROOT, "Codex_macOS", "Sources", "Codex", "Palettes.swift")

# Colours each project actually publishes, from its own palette definition.
UPSTREAM = {
    "mocha": """11111b 181825 1e1e2e 313244 45475a 585b70 6c7086 7f849c 9399b2
                cdd6f4 a6adc8 bac2de 89b4fa b4befe 74c7ec 89dceb 94e2d5 a6e3a1
                f9e2af fab387 f38ba8 eba0ac cba6f7 f5c2e7 f2cdcd f5e0dc""",
    "macchiato": """181926 1e2030 24273a 363a4f 494d64 5b6078 6e738d 8087a2
                939ab7 cad3f5 a5adcb b8c0e0 8aadf4 b7bdf8 7dc4e4 91d7e3 8bd5ca
                a6da95 eed49f f5a97f ed8796 ee99a0 c6a0f6 f5bde6 f0c6c6 f4dbd6""",
    "frappe": """232634 292c3c 303446 414559 51576d 626880 737994 838ba7
                949cbb c6d0f5 a5adce b5bfe2 8caaee babbf1 85c1dc 99d1db 81c8be
                a6d189 e5c890 ef9f76 e78284 ea999c ca9ee6 f4b8e4 eebebe f2d5cf""",
    "latte": """dce0e8 e6e9ef eff1f5 ccd0da bcc0cc acb0be 9ca0b0 8c8fa1 7c7f93
                4c4f69 6c6f85 5c5f77 1e66f5 7287fd 209fb5 04a5e5 179299 40a02b
                df8e1d fe640b d20f39 e64553 8839ef ea76cb dd7878 dc8a78""",
    # Nord publishes exactly sixteen: nord0-15.
    "nord": """2e3440 3b4252 434c5e 4c566a d8dee9 e5e9f0 eceff4 8fbcbb 88c0d0
                81a1c1 5e81ac bf616a d08770 ebcb8b a3be8c b48ead""",
    "gruvbox-dark": """1d2021 282828 32302f 3c3836 504945 665c54 7c6f64 928374
                fbf1c7 ebdbb2 d5c4a1 bdae93 a89984 fb4934 b8bb26 fabd2f 83a598
                d3869b 8ec07c fe8019 cc241d 98971a d79921 458588 b16286 689d6a
                d65d0e""",
    "gruvbox-light": """f9f5d7 fbf1c7 f2e5bc ebdbb2 d5c4a1 bdae93 a89984 928374
                282828 3c3836 504945 665c54 7c6f64 9d0006 79740e b57614 076678
                8f3f71 427b58 af3a03 cc241d 98971a d79921 458588 b16286 689d6a
                d65d0e""",
    # Solarized shares its eight accents between the light and dark variants by
    # design; only the eight monotones swap roles.
    "solarized-dark": """002b36 073642 586e75 657b83 839496 93a1a1 eee8d5 fdf6e3
                b58900 cb4b16 dc322f d33682 6c71c4 268bd2 2aa198 859900""",
    "solarized-light": """002b36 073642 586e75 657b83 839496 93a1a1 eee8d5
                fdf6e3 b58900 cb4b16 dc322f d33682 6c71c4 268bd2 2aa198 859900""",
    "tokyo-night": """1a1b26 16161e 1f2335 24283b 292e42 3b4261 414868 565f89
                a9b1d6 c0caf5 7aa2f7 7dcfff 2ac3de bb9af7 9ece6a 73daca e0af68
                ff9e64 f7768e db4b4b ff007c ffc777""",
    "dracula": """282a36 44475a f8f8f2 6272a4 8be9fd 50fa7b ffb86c ff79c6 bd93f9
                ff5555 f1fa8c 21222c 191a21""",
    "rose-pine": """191724 1f1d2e 26233a 6e6a86 908caa e0def4 eb6f92 f6c177
                ebbcba 31748f 9ccfd8 c4a7e7 21202e 403d52 524f67""",
    "rose-pine-moon": """232136 2a273f 393552 6e6a86 908caa e0def4 eb6f92 f6c177
                ea9a97 3e8fb0 9ccfd8 c4a7e7 2a283e 44415a 56526e""",
    "rose-pine-dawn": """faf4ed fffaf3 f2e9e1 9893a5 797593 575279 b4637a ea9d34
                d7827e 286983 56949f 907aa9 f4ede8 dfdad9 cecacd""",
}
UPSTREAM = {k: set(v.split()) for k, v in UPSTREAM.items()}

# How many values each palette is allowed to derive. Every one of these is a
# surface or overlay step filling the nine-slot ramp, except where noted.
ALLOWED = {
    "mocha": 0, "macchiato": 0, "frappe": 0, "latte": 0,
    "gruvbox-light": 0,
    "gruvbox-dark": 1,
    "tokyo-night": 3,
    "solarized-light": 3,
    "solarized-dark": 4,
    "nord": 5,
    "rose-pine-moon": 5,
    "rose-pine-dawn": 5,
    "rose-pine": 6,
    "dracula": 9,
}

BLOCK = re.compile(
    r'id:\s*"(?P<id>[\w-]+)".*?rosewater:\s*Color\(hex:\s*"#[0-9a-f]{6}"\)\)',
    re.S,
)


def palettes(source: str) -> "list[tuple[str, list[str]]]":
    """Every palette in the file, as (id, [hex values in declaration order])."""
    found = []
    for m in BLOCK.finditer(source):
        pid = m.group("id")
        if pid.endswith("-oled"):
            continue  # generated, not declared
        found.append((pid, re.findall(r"#([0-9a-f]{6})", m.group(0))))
    return found


def audit(source: str) -> "tuple[list[str], list[tuple[str, list[str]]]]":
    faults, detail = [], []
    seen = set()
    for pid, values in palettes(source):
        seen.add(pid)
        if pid not in UPSTREAM:
            faults.append(f"NO UPSTREAM  {pid}  (add its published colours here)")
            continue
        derived = sorted({v for v in values if v not in UPSTREAM[pid]})
        detail.append((pid, derived))
        allowed = ALLOWED.get(pid)
        if allowed is None:
            faults.append(f"UNDECLARED   {pid}  ({len(derived)} derived, none allowed for)")
        elif len(derived) != allowed:
            direction = "more" if len(derived) > allowed else "fewer"
            faults.append(
                f"COUNT DRIFT  {pid}  declares {allowed} derived, found "
                f"{len(derived)} ({direction}): {' '.join(derived)}"
            )
    for pid in UPSTREAM:
        if pid not in seen:
            faults.append(f"MISSING      {pid}  is declared upstream but absent from the source")
    return faults, detail


def self_test() -> int:
    """Prove the check can fail, on a copy with one value altered."""
    with open(SOURCE, encoding="utf-8") as fh:
        source = fh.read()
    clean, _ = audit(source)
    if clean:
        print("self-test inconclusive: the real source already has faults")
        for f in clean:
            print("  " + f)
        return 1

    # Swap a published Nord value for one nobody published.
    broken = source.replace('blue: Color(hex: "#81a1c1")',
                            'blue: Color(hex: "#123456")', 1)
    if broken == source:
        print("self-test could not plant a fault — the anchor moved")
        return 1
    faults, _ = audit(broken)
    if not any("nord" in f for f in faults):
        print("self-test FAILED: a planted invented colour went unnoticed")
        return 1

    print("self-test passed: clean tree reports 0 faults, planted fault is caught")
    return 0


def main() -> int:
    if "--self-test" in sys.argv:
        return self_test()

    with open(SOURCE, encoding="utf-8") as fh:
        source = fh.read()
    faults, detail = audit(source)
    total_values = sum(len(v) for _, v in palettes(source))
    total_derived = sum(len(d) for _, d in detail)

    if "--list" in sys.argv:
        for pid, derived in sorted(detail, key=lambda x: -len(x[1])):
            mark = " ".join("#" + d for d in derived) if derived else "—"
            print(f"  {pid:<17} {len(derived):>2}  {mark}")
        print()

    print(f"{'palettes':<16}{len(detail):>6}")
    print(f"{'colour values':<16}{total_values:>6}")
    print(f"{'derived':<16}{total_derived:>6}")
    print(f"{'fidelity faults':<16}{len(faults):>6}")
    print()

    if faults:
        for f in faults:
            print("  " + f)
        print()
        print("every derived value must be declared in ALLOWED, above")
        return 1

    pct = (total_derived * 100.0 / total_values) if total_values else 0
    print(f"every palette matches its upstream scheme "
          f"({total_derived}/{total_values} derived, {pct:.0f}%)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
