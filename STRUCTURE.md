# STRUCTURE — Codex v2.0 Conventions

## File & folder naming

- All folders and files lowercase except numeric layer prefix (`05_OS_Kernel/`).
- Words joined with underscores: `system_calls.md`, not `system-calls.md`.
- Layer folders prefixed with two-digit number for sort order.
- Each sub-section has an `INDEX.md` as its entry point.

## Frontmatter

Every content note starts with YAML frontmatter:

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

Required keys: `title`, `layer`, `section`, `tags`, `updated`.
Optional keys: `related`, `source`, `confidence`.

## Cross-links

- Use relative markdown links: `../../05_OS_Kernel/topics/syscalls.md`.
- Don't duplicate content across layers — link to the canonical home.
- Protocols live in the layer that owns them on the wire (TCP in `12_Network_Transport/protocols/`, not in `05_OS_Kernel/`).

## Sub-section conventions

| Sub-section    | INDEX.md format                                                       |
|----------------|-----------------------------------------------------------------------|
| `references/`  | Bulleted list grouped by Books / Papers / Datasheets / Online        |
| `lessons/`     | Numbered ladder beginner → advanced, with prereqs                    |
| `languages/`   | Table: language · use at this layer · canonical compiler/runtime     |
| `man_pages/`   | Table: command · section · one-line purpose                          |
| `topics/`      | Bulleted list with one-line gloss; each item links to a `.md` note   |
| `protocols/`   | Table: protocol · spec/RFC · layer · status                          |

## Status & lifecycle

- `draft` → `stable` → `archived`. Optional `status:` key in frontmatter.
- Archived notes move to `_archive/` inside the sub-section folder.
- Never overwrite — if a topic gets a major rewrite, version with `.v2.md`.

## Timestamps

ISO 8601 UTC dates in frontmatter `updated:` field (`YYYY-MM-DD`).

## Tags

Lowercase, kebab-case for multi-word: `tags: [tcp, three-way-handshake, layer-4]`.
Reserved tag prefixes:
- `layer-NN` — explicit layer pin
- `proto-` — protocol name
- `lang-` — programming language
- `tool-` — specific CLI/utility
