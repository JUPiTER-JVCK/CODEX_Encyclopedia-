# Codex v3 — Computing Stack Knowledge Base

> A layered reference codex covering the full stack from **physics** to
> **applications**, plus cross-cutting domains (Security, AI/ML, RF,
> Algorithms, Embedded Systems, Industrial Protocols). Each layer documents
> what it does, the languages used, the medium/interface, example
> communication, and links out to references, lessons, language lookups,
> manual pages, topics, and protocols.

**Current version:** 3.0 (Top-to-bottom SwiftUI redesign — translucent vibrancy sidebar, modern toolbar with breadcrumb & navigation history, Safari-style tabs, three-tab right inspector, Welcome screen with quick-action cards, clickable cross-document links, modern markdown rendering with hover-copy code blocks)
**See:** [CHANGELOG.md](CHANGELOG.md)

## Layout

```
Codex_v2/
├── README.md            ← this index
├── LAYERS.md            ← master table (extended from computer_layers.pdf)
├── STRUCTURE.md         ← conventions: file naming, frontmatter, cross-links
├── CHANGELOG.md         ← v1 → v2 → v2.1 migration notes
├── _assets/             ← reference images (see _assets/README.md)
│
├── 00_Physics/             ─┐
├── 00b_Devices/             │  Physical foundations
├── 00c_Analog_Circuits/     │  (new in v2.1)
├── 00d_Digital_Circuits/   ─┘
│
├── 01_Circuit_Board/       ─┐
├── 02_CPU/                  │
├── 03_Firmware_BIOS/        │  Compute stack
├── 04_Device_Drivers/       │  (from computer_layers.pdf)
├── 05_OS_Kernel/            │
├── 06_System_Libraries/     │
├── 07_Runtime_Environment/  │
├── 08_User_Applications/   ─┘
│
├── Network/                ─┐  Network stack
│   ├── 09_Network_Physical/ │  (OSI-aligned)
│   ├── 10_Network_DataLink/ │  *banded under Network/ since v2.2*
│   ├── 11_Network_Internet/ │
│   ├── 12_Network_Transport/│
│   └── 13_Network_Application/┘
│
├── 14_Security/            ─┐
├── 15_AI_ML/                │  Cross-cutting
├── 16_RF_Wireless/          │  (14–16 from v2.0)
├── 17_Algorithms_DSA/       │  (17–19 new in v2.1)
├── 18_Embedded_Systems/     │
└── 19_Industrial_Protocols/─┘
```

Every layer folder contains the same six sub-sections:

| Sub-section    | What lives here                                                         |
|----------------|-------------------------------------------------------------------------|
| `references/`  | Books, papers, datasheets, links, vendor docs                           |
| `lessons/`     | Tutorials, walkthroughs, exercises, lab notes                           |
| `languages/`   | Programming/markup/HDL languages used at this layer with a lookup table |
| `man_pages/`   | CLI tools, system utilities, manual page references                     |
| `topics/`      | Concept notes — the "what is this and why" entries                      |
| `protocols/`   | Protocols, specs, standards, RFCs that apply at this layer              |

## Anchor materials (in-codex)

- `17_Algorithms_DSA/references/100_leetcode_problems.pdf` — user-supplied LeetCode list
- `18_Embedded_Systems/references/embedded_systems_full_roadmap_book.pdf` — Embedded Systems Engineering Roadmap (from v1 `~/Documents/Information_Tech/- Hardware/`)
- `00d_Digital_Circuits/topics/logic_gates.md` — recreated truth-table reference from the logic-gates image
- `01_Circuit_Board/protocols/embedded_bus_protocols_lookup.md` — DSLogic/sigrok decoder catalog

## How to use

1. Start at [LAYERS.md](LAYERS.md) for the high-level map.
2. Drill into a layer's `README.md` for description, languages, and example flow.
3. Use the sub-section folders for depth — each one has an `INDEX.md`.
4. Cross-references between layers use relative links like `../05_OS_Kernel/topics/syscalls.md`.

## Running the TUI

```sh
pip3 install --user -r Codex_v2/requirements.txt
./Codex_v2/codex
```

Opens a multi-pane terminal browser:
- **Breadcrumb header** showing the current selection path
- **Sidebar tree** grouped by band (Foundations / Compute / Network / Cross-cutting)
  with a `★/·` bookmark gutter
- **Tabbed markdown viewer** (`n` opens current selection in a new tab; `ctrl+w` closes)
- **Outline TOC** of the current file's headings
- **Status bar** with path, size, last-modified
- Full-text **search** (`/` — prefix `r:` for regex)
- **Command palette** (`ctrl+P`) — fuzzy file picker over all docs
- **Bookmarks + recents** persisted to `~/.config/codex_tui/state.json`
- **Click-to-follow** relative `.md` links (open in new tab)
- **Split-pane viewer** (`ctrl+\` toggles side-by-side panes)
- **Theme switcher** (`ctrl+T` cycles Mocha / Latte / high-contrast)
- Press `?` for the full keybinding reference

Run `python3 -m codex_tui` if you prefer module invocation.

### Native macOS app (SwiftUI)

A real macOS **`Codex.app`** ships in the project root — pure SwiftUI,
no Terminal, no Python at runtime. Double-clickable from Finder, the
Dock, Launchpad, or Spotlight. Renders the same markdown tree directly
on the GPU with the Catppuccin Mocha palette.

```sh
# One-time: accept the Xcode license and install CLI tools
sudo xcodebuild -license accept
xcode-select --install

# Build & run (creates ./Codex.app and opens it)
./Codex_macOS/package_app.sh --run

# Other modes
./Codex_macOS/package_app.sh             # build only, no auto-open
./Codex_macOS/package_app.sh --debug     # faster debug build
./Codex_macOS/package_app.sh --install   # also copy to /Applications
./Codex_macOS/package_app.sh --icon      # regenerate the AppIcon.icns
```

Features in the SwiftUI app:

- 3-column NavigationSplitView (sidebar tree · tabbed viewer · outline TOC)
- Custom block-level Markdown renderer (headings, fenced code with
  language tag, lists, pipe tables, blockquotes, rules, inline styling)
- `⌘P` command palette with fuzzy file matching across all docs
- Tabbed viewer with hover-close; `⌘W` closes the active tab
- Status bar with relative path, byte size, and keybinding hints
- Bookmarks + recents persisted to
  `~/Library/Application Support/Codex/state.json`

Bundle layout:

```
Codex.app/
└── Contents/
    ├── Info.plist          ← CFBundle metadata (id: local.codex.swift, v2.6)
    ├── MacOS/Codex         ← Mach-O SwiftUI executable
    └── Resources/
        ├── AppIcon.icns    ← Catppuccin "C" icon (1024px @1x/@2x)
        └── project_path    ← absolute Codex_v2 path for portable launch
```

Source lives in [`Codex_macOS/`](Codex_macOS/README.md) — seven Swift
files (~750 lines), one SwiftPM `Package.swift`, one build script.

Project-root discovery order: `$CODEX_ROOT` env var → bundled
`project_path` resource → walk up from the executable looking for
`README.md` + `STRUCTURE.md` → cwd. So the `.app` keeps working after
being moved to `/Applications`.

## Conventions

See [STRUCTURE.md](STRUCTURE.md). TL;DR:

- Markdown only (`.md`), UTF-8, LF line endings.
- Filenames: `lowercase_with_underscores.md`.
- Each note starts with YAML frontmatter (`title`, `layer`, `tags`, `updated`).
- Prefer linking over duplicating — protocols live in their layer's `protocols/`.
- Images live in `_assets/`; reference with relative paths.
