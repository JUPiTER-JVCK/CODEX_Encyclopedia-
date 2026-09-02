# STRUCTURE — Conventions

How this repository is organized and what a new note has to look like to fit.
Current as of v3.2.

## Repository layout

The repository root **is** the codex root. Layer folders sit directly at the
top level; the two apps live in their own directories beside them.

| Path | Contents | Convention |
|------|----------|-----------|
| `NN_Layer_Name/` | A codex layer | Numeric prefix, then `Title_Case` |
| `Network/` | Layers 09–13, banded | Content, but not itself a layer |
| `_assets/` | Reference images | Underscore prefix keeps it out of the layer list |
| `Codex_macOS/` | SwiftUI reader source | Not codex content |
| `Codex_LMS/` | React curriculum source | Not codex content |
| `tools/` | Repository maintenance scripts | Not codex content |

Directories the apps must not treat as codex content are listed in
`CodexTree.nonContentDirs` ([Codex_macOS/Sources/Codex/CodexTree.swift](Codex_macOS/Sources/Codex/CodexTree.swift)).
**Adding a new non-layer directory at the root means adding it there too** —
otherwise it surfaces as a phantom layer in the sidebar and its markdown
floods the command palette.

## File and folder naming

Words are joined with underscores everywhere — `system_calls.md`, never
`system-calls.md`. Capitalization depends on what the thing is:

| Kind | Case | Example |
|------|------|---------|
| Content notes | lowercase | `virtual_memory.md`, `logic_gates.md` |
| Sub-section folders | lowercase | `topics/`, `man_pages/` |
| Layer folders | numeric prefix + `Title_Case` | `05_OS_Kernel/`, `00b_Devices/` |
| Entry-point files | `SCREAMING_CASE` | `INDEX.md`, `README.md` |
| Root documents | `SCREAMING_CASE` | `LAYERS.md`, `STRUCTURE.md` |
| Band and app folders | `Title_Case` | `Network/`, `Codex_macOS/` |

Layer folders take a two-digit prefix for sort order; the foundational layers
below 01 use a letter suffix (`00b_`, `00c_`, `00d_`). Every sub-section
folder has an `INDEX.md` as its entry point.

## Frontmatter

**Content notes** carry YAML frontmatter. **Entry points do not** — `INDEX.md`
and `README.md` are navigation, and their heading plus intro line already say
what they are. Root documents (`LAYERS.md`, `STRUCTURE.md`, `CHANGELOG.md`)
are likewise exempt.

That split is what the tree actually looks like: 110 notes carry frontmatter,
and the 164 files without it are entry points and root documents. A note that
teaches something needs the metadata; a file that lists links does not.

A content note opens like this:

```yaml
---
title: System calls
layer: 05_OS_Kernel
section: topics
tags: [kernel, syscall, ABI, linux, posix]
updated: 2026-05-19
related:
  - ../../06_System_Libraries/topics/libc.md
  - ../protocols/posix.md
---
```

Required: `title`, `layer`, `section`, `tags`, `updated`.
Optional: `related`, `source`, `confidence`, `status`.

Every file carries an H1 heading, frontmatter or not — the macOS app uses
the first H1 for tab titles, falling back to the filename.

## Sub-sections

Each layer folder holds the same six, in this order:

| Sub-section | `INDEX.md` format |
|-------------|-------------------|
| `references/` | Bulleted list grouped by Books / Papers / Datasheets / Online |
| `lessons/` | Numbered ladder, beginner → advanced, with prerequisites |
| `languages/` | Table: language · use at this layer · canonical toolchain |
| `man_pages/` | Table: command · section · one-line purpose |
| `topics/` | Bulleted list with a one-line gloss, each linking to a note |
| `protocols/` | Table: protocol · spec/RFC · layer · status |

## Cross-links

- Relative markdown links only: `../../05_OS_Kernel/topics/syscalls.md`.
- **Link, don't duplicate.** Each subject has one canonical home.
- A protocol lives in the layer that owns it *on the wire* — TCP in
  `Network/12_Network_Transport/protocols/`, not in `05_OS_Kernel/`.
- A link to a directory resolves to its `README.md`, then `INDEX.md`.

Run `python3 tools/link_audit.py` after moving or renaming files — it
resolves every relative link and exits non-zero on a breakage.

## Tags

Lowercase, kebab-case for multi-word: `tags: [tcp, three-way-handshake, layer-4]`.

Reserved prefixes:

| Prefix | Meaning | Example |
|--------|---------|---------|
| `layer-NN` | Explicit layer pin | `layer-12` |
| `proto-` | Protocol name | `proto-quic` |
| `lang-` | Programming language | `lang-rust` |
| `tool-` | Specific CLI or utility | `tool-tcpdump` |

## Status and lifecycle

- `draft` → `stable` → `archived`, via the optional `status:` frontmatter key.
- Archived notes move to `_archive/` inside their sub-section folder.
- Never overwrite a substantial rewrite — version it as `.v2.md`.

## Timestamps

ISO 8601 dates in `updated:` (`YYYY-MM-DD`), UTC.

## Images

- Live in `_assets/`, named `lowercase_with_underscores.ext`. PNG, JPG, SVG.
- Referenced relatively: `![Logic gates](../../_assets/logic_gates_explained.png)`.
- Always pair an image with a text equivalent — an ASCII diagram or a
  markdown table — so the note stands on its own if the image is missing.
  The codex is readable today precisely because this rule was followed.

## Application code

The two apps follow their own ecosystem's conventions rather than these,
which govern markdown. Each carries its own README:

- [`Codex_macOS/README.md`](Codex_macOS/README.md) — Swift sources, build script, known issues
- [`Codex_LMS/README.md`](Codex_LMS/README.md) — Vite harness, storage adapter, smoke test

One rule does cross the boundary: **anything either app hardcodes about the
codex's shape** — directory exclusions, band groupings, sub-section ordering —
is a convention, and changing the tree means updating it. `CodexTree.swift`
holds the macOS app's copy.
