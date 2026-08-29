# Codex_macOS — Native SwiftUI App

A real macOS app that browses the Codex knowledge base. No Terminal,
no Python, no Textual — pure SwiftUI rendering the same markdown tree
straight on the GPU.

## What you get

- **3-column NavigationSplitView**: sidebar tree · tabbed viewer · outline TOC
- **Catppuccin Mocha theme** — matches the TUI's styles.tcss
- **Custom markdown renderer** with headings, code blocks (language tag),
  unordered/ordered lists, pipe tables, blockquotes, horizontal rules,
  and inline bold/italic/code/link styling
- **⌘P command palette** — fuzzy-matched file picker across the whole codex
- **Tabbed viewer** with hover-close (⌘W closes the active tab)
- **Outline TOC** auto-extracted from the current file's headings
- **Status bar** showing relative path, byte size, keybinding hints
- **Bookmarks + recents** persisted to `~/Library/Application Support/Codex/state.json`
- **Portable bundle** — records the absolute project path at build time,
  so the `.app` works after being moved to `/Applications`
- **Auto-discovers project root** via `CODEX_ROOT` env var, the bundled
  `project_path` resource, or by walking up from the executable

## One-time prereq

```sh
sudo xcodebuild -license accept     # if you haven't accepted Xcode's licence
xcode-select --install              # if Command Line Tools aren't installed
```

## Build & run

```sh
cd Codex_macOS
./package_app.sh --run              # build release, bundle, open
./package_app.sh                    # build release, bundle (no auto-open)
./package_app.sh --debug            # faster debug build
./package_app.sh --install          # also copy to /Applications
./package_app.sh --icon             # regenerate AppIcon.icns from scratch
```

The output bundle lands at `../Codex.app` (project root), replacing the
prior bash-launcher version. Double-click in Finder, or `open ../Codex.app`.

## Layout

```
Codex_macOS/
├── Package.swift                  ← SwiftPM manifest (macOS 13+)
├── Info.plist                     ← bundle metadata, copied into .app
├── package_app.sh                 ← build + bundle + sign + install
├── README.md
└── Sources/Codex/
    ├── CodexApp.swift             ← @main App, AppState, ContentView
    ├── CodexTree.swift            ← filesystem → CodexNode tree (mirrors tree_model.py)
    ├── Markdown.swift             ← block parser + SwiftUI renderer
    ├── Views.swift                ← Sidebar, TabBar, Outline, Status, Palette
    ├── Theme.swift                ← Catppuccin Mocha colors
    └── Util.swift                 ← fuzzy match + bookmarks persistence
```

## Keyboard shortcuts

| Shortcut    | Action                                  |
|-------------|-----------------------------------------|
| `⌘P`        | Open command palette (fuzzy file picker)|
| `⌘W`        | Close active tab                         |
| `⌘0`        | Open project README                      |
| `⌘R`        | Reload sidebar tree                      |
| `↑ / ↓`     | Move selection in palette                |
| `⏎`         | Open selected file in palette            |
| `⎋`         | Dismiss palette                          |

## Architecture notes

- **`@main CodexApp`** owns a single `AppState` `ObservableObject`. SwiftUI
  re-renders only the views that depend on the published properties that
  changed (open tabs, selected file, palette visibility).

- **`CodexTree`** is a direct Swift port of `codex_tui/tree_model.py`. The
  band definitions, subsection order, and the pretty-print logic are
  intentionally identical so the sidebar matches the TUI sidebar 1:1.

- **`MarkdownParser`** is a hand-rolled block-level parser. It skips YAML
  frontmatter, then walks line-by-line emitting `MDBlock` cases. Inline
  styling within each block is handed off to Apple's `AttributedString
  (markdown:)` initializer (which understands `**bold**`, `*italic*`,
  `` `code` ``, and `[text](url)`).

- **Project-root discovery** tries, in order: (1) `$CODEX_ROOT`, (2) the
  bundled `project_path` resource written by `package_app.sh`, (3) walking
  up six levels looking for a directory containing both `README.md` and
  `STRUCTURE.md`, (4) the current working directory.

- **Ad-hoc code signing** (`codesign -s -`) is enough for the app to launch
  on the local machine. Distribution would require a real Developer ID and
  notarization, neither of which this build script attempts.

## What's not (yet) included

These features exist in the Textual TUI but haven't been ported:

- Full-text content search across all .md files (`⌘F` slot is open)
- Split-pane viewer (`⌘\`)
- Theme switcher (`⌘T` — currently Mocha only)
- Click-to-follow relative `[link](path.md)` opens
- `★/·` pin gutter in the sidebar (bookmark model is wired up; UI pending)

Each would be additive work in `Views.swift` and `AppState`.
