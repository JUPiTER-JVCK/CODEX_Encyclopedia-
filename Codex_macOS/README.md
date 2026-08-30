# Codex_macOS — Native SwiftUI Reader

A real macOS app that browses the codex. No Terminal, no Python — pure
SwiftUI rendering the markdown tree straight on the GPU.

## What you get

- **Translucent vibrancy sidebar** (`NSVisualEffectView`, `.sidebar` material)
  grouped into bands, with a pinned section
- **Top toolbar** — sidebar toggle, browser-style back/forward, clickable
  breadcrumb (`Codex › Layer › Section › File`), palette trigger, pin button,
  inspector toggle
- **Safari-style tab strip** with hover-close and smart titles (first H1,
  falling back to the filename)
- **Three-tab inspector** — Outline (the document's TOC), Info (size,
  modified, line count, YAML tags, reveal/copy-path/pin actions), Recents
- **Welcome screen** — hero, stats, quick-action cards, recents, and a
  "browse by band" grid tinted per band
- **Custom markdown renderer** — headings, fenced code with a language pill
  and hover-to-copy, lists, pipe tables, blockquotes, rules, inline images
- **Cross-document links** — `[text](path.md)` opens in a new in-app tab;
  `http(s)` opens in your browser
- **⌘P command palette** — fuzzy file matching across the whole codex
- **Right-click sidebar menu** — Open / Open in New Tab / Pin / Reveal in
  Finder / Copy Path
- **Bookmarks + recents** persisted to
  `~/Library/Application Support/Codex/state.json`
- **Portable bundle** — records the project path at build time, so the `.app`
  keeps working after you move it to `/Applications`

## One-time prerequisites

```sh
sudo xcodebuild -license accept     # if you haven't accepted Xcode's licence
xcode-select --install              # if Command Line Tools aren't installed
```

Requires macOS 13 or later.

## Build and run

```sh
cd Codex_macOS
./package_app.sh --run              # build release, bundle, open
./package_app.sh                    # build and bundle, don't open
./package_app.sh --debug            # faster debug build
./package_app.sh --install          # also copy to /Applications
./package_app.sh --icon             # regenerate AppIcon.icns
```

The bundle lands at `../Codex.app`, at the repository root. It's a build
artifact and is gitignored — regenerate it rather than committing it.

## Layout

```
Codex_macOS/
├── Package.swift          ← SwiftPM manifest (macOS 13+)
├── Info.plist             ← bundle metadata, copied into the .app
├── package_app.sh         ← build · bundle · sign · install
└── Sources/Codex/
    ├── CodexApp.swift     ← @main App, AppState, RootView, menu commands
    ├── Theme.swift        ← Catppuccin palette, font scale, radii, band tints
    ├── VisualEffect.swift ← NSVisualEffectView wrapper for vibrancy
    ├── CodexTree.swift    ← filesystem → CodexNode tree, NodeKind, SF Symbols
    ├── Markdown.swift     ← block parser + renderer, frontmatter, hero/footer
    ├── Sidebar.swift      ← band groups, pinned section, context menu
    ├── Toolbar.swift      ← toolbar, breadcrumb, search trigger
    ├── TabStrip.swift     ← Safari-style horizontal tabs
    ├── Inspector.swift    ← Outline / Info / Recents tabs
    ├── Welcome.swift      ← hero + quick-action / recent / band grids
    ├── Palette.swift      ← command palette with badges and footer hint
    └── Util.swift         ← fuzzy match, bookmarks, history, link resolver
```

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘P` | Command palette |
| `⌘1` | Toggle sidebar |
| `⌘0` | Toggle inspector |
| `⌘W` | Close active tab |
| `⇧⌘W` | Close all tabs |
| `⌘[` / `⌘]` | Back / forward |
| `⌘H` | Open README |
| `⌘R` | Reload tree |
| `⌘D` | Pin / unpin current file |
| `⇧⌘R` | Reveal current file in Finder |
| `↑` / `↓` | Move selection in the palette |
| `⏎` | Open the selected palette result |
| `⎋` | Dismiss the palette |

## Architecture notes

- **`AppState`** is a single `ObservableObject` owning open tabs, selection,
  panel visibility, bookmarks, and navigation history.

- **`CodexTree`** turns the filesystem into a `CodexNode` tree. It knows the
  band groupings, the sub-section ordering, and — in `nonContentDirs` — which
  root directories are apps rather than codex content. **Adding a non-layer
  directory to the repository root means adding it to that set**, or it shows
  up as a phantom layer and its markdown floods the palette.

- **`MarkdownParser`** is a hand-rolled block-level parser. It skips YAML
  frontmatter, then walks line by line emitting `MDBlock` cases. Inline
  styling is handed to Apple's `AttributedString(markdown:)`, which handles
  `**bold**`, `*italic*`, `` `code` ``, and `[text](url)`.

- **`LinkResolver`** resolves a markdown href against the source file's
  directory, then against the project root, and resolves a directory target
  to its `README.md` or `INDEX.md`.

- **Project-root discovery** tries, in order: `$CODEX_ROOT`, the bundled
  `project_path` resource, a six-level walk up looking for a directory with
  both `README.md` and `STRUCTURE.md`, then the working directory.

- **Ad-hoc signing** (`codesign -s -`) is enough to launch locally.
  Distribution would need a Developer ID and notarization, which this script
  does not attempt.

## Known issues

Found by inspection, not yet fixed. None of it has been compiler-verified
against a recent SDK.

**Performance — the markdown pipeline does redundant work.**

- `MarkdownView.blocks` is a computed property that runs the full parser on
  every access, and the render loop reads it once for `count` and again for
  every index. It also calls `frontmatter`, itself computed. A 200-block
  document parses on the order of 400 times per render.
- `RootView.mainPane` calls `String(contentsOf:)` **inside `body`**, so every
  state change re-reads the file synchronously off disk on the main thread.
- `CodexNode.displayTitle()` reads the file to find its H1, and the tab strip
  calls it per render — so every render re-reads every open file.

One cache keyed on path + modification date addresses all three.

**Rendering fidelity.**

- The list parser only matches `- ` / `* ` at column 0, so indented sub-items
  break out of the list and render as loose paragraphs. Roughly 100 lines
  across the codex are affected.

**Smaller.**

- `closeTab` selects `openTabs.last` rather than the adjacent tab.
- `allFiles` is a plain `lazy var`, not `@Published`, so `⌘R` reloads the
  tree without refreshing the palette index in the UI.
- `Bookmarks.touch()` writes `state.json` synchronously on every file open.
- `NavigationHistory` grows without a cap.
- `String(contentsOf:)` is called without an encoding argument in
  `findProjectRoot()` — deprecated on recent SDKs.
- `prettifyLayer` renders `00  Physics` with two spaces but `00b Devices`
  with one; `prettyFilename`'s `"Ip"→"IP"` rule also turns `Ipc` into `IPc`.
- A `Tools` band is declared in `bands` with no corresponding directory.

**Unverified — needs a run on real hardware.**

- The sidebar's vibrancy uses `.behindWindow` blending, but `RootView` paints
  an opaque `Theme.base` across the whole window. If the sidebar reads as
  flat rather than translucent, that's the likely cause.
- Code blocks put `.frame(maxWidth: .infinity)` on `Text` inside a horizontal
  `ScrollView`. Whether that wraps or scrolls depends on how SwiftUI resolves
  `.infinity` against a nil width proposal. The widest fenced line in the
  codex is 116 characters, in
  `08_User_Applications/man_pages/network_tools.md` — check there first.
- The last shipped binary was x86_64-only, with no arm64 slice, so it ran
  under Rosetta on Apple Silicon.
