# CORE — Codex LMS

A seven-phase computing curriculum delivered as a single-page React app:
Boolean logic up through ethical hacking, with interactive simulators, a
glossary, a visual reference library, a live code playground, and Leitner-box
spaced review.

Sister project to the markdown codex in this repository's layer folders
(`00_Physics/` … `19_Industrial_Protocols/`). The codex is a *reference*
organized by stack layer; CORE is a *course* organized by learning order.

## Running it

```sh
cd Codex_LMS
npm install
npm run dev        # dev server with hot reload
```

Other scripts:

```sh
npm run build      # production bundle into dist/
npm run preview    # serve the built bundle
npm run smoke      # Playwright end-to-end check (see Testing below)
```

## Contents

| Phase | Title | Topics |
|------:|-------|-------:|
| 0 | Logic | 7 |
| 1 | Hardware | 6 |
| 2 | Command Line & Operating Systems | 6 |
| 3 | Programming | 6 |
| 4 | Web Fundamentals | 6 |
| 5 | Networking & Cisco | 6 |
| 6 | Security & Ethical Hacking | 6 |

**43 topics, 222 chapters**, plus the Toolkit (glossary, visual library,
playground) and the Ethload historical guide.

Interactive pieces: GateSimulator, BaseConverter, BitwiseVisualizer,
CPUCycleStepper, MemoryHierarchyVisualizer, FullStackDiagram, BusWidthChart,
SpectrumDiagram, ChmodCalculator, FilesystemTreeDiagram, CodeTracer,
DataStructureDiagram, CompiledSpectrum, BoxModelVisualizer, SubnetCalculator,
OSIStackDiagram, HttpStatusDiagram, AttackLifecycleStepper, HatCards.

## Layout

```
Codex_LMS/
├── index.html              ← Vite entry, fonts, pre-paint background
├── vite.config.js
├── package.json
├── public/favicon.svg
├── src/
│   ├── main.jsx            ← React root
│   ├── CoreApp.jsx         ← the whole app (~4 700 lines)
│   └── storage.js          ← progress persistence adapter
├── test/smoke.mjs          ← Playwright end-to-end check
│
├── anatomy-of-a-program.html   ← standalone companion page
├── roadmap-draft.md            ← curriculum plan (phase order, what's built)
├── merge-architecture-draft.mermaid  ← how the 8 modules became one file
│
└── *.jsx                   ← the pre-merge module sources, superseded by
                              CoreApp.jsx and kept for reference
```

The eight `*-module.jsx` files at the top level plus `toolkit.jsx`,
`knowledge-map.jsx`, `cs-encyclopedia.jsx`, and `ethload-guide.jsx` are the
originals CoreApp.jsx was assembled from. They are **not** part of the build —
nothing imports them. They are kept because they are the only record of the
pre-merge structure.

## Progress persistence

Progress lives under one key, `core-app-progress-v1`, holding `completed`,
`reviewItems` (Leitner box + due date per topic), and `readMode`.

`src/storage.js` picks a backend once at startup:

| Backend | When | Persistence |
|---------|------|-------------|
| `artifact` | `window.storage` exists — running inside a Claude artifact | Host-managed |
| `local` | `localStorage` is writable — an ordinary browser | Per browser profile |
| `memory` | Neither works — private mode, sandboxed iframe, site data blocked | Session only |

The app was originally written directly against `window.storage`, so outside a
Claude artifact it ran fine but silently forgot everything. The adapter keeps
that call shape while making a normal browser the ordinary case.

Both reads and writes stay wrapped in `try`/`catch` at the call site, so a
storage failure costs you progress but never breaks the session.

## Testing

`npm run smoke` drives a real Chromium through the app and asserts that
progress survives a reload:

1. Loads the page, checks the title and that all seven phases render
2. Master hub → Logic phase → *Boolean Algebra Basics*
3. Pages through every chapter to the end
4. Clicks **Mark complete**
5. Reads `core-app-progress-v1` out of `localStorage`
6. Reloads and asserts the value is byte-identical
7. Reports any `pageerror` or `console.error`

It expects a server already running (`npm run preview`) and takes the URL as
its first argument, defaulting to `http://localhost:4173/`:

```sh
npm run preview -- --port 4173 &
until curl -sf -o /dev/null http://localhost:4173/; do sleep 1; done
npm run smoke -- http://localhost:4173/
```

`npm run preview &` returns as soon as the process starts, not when it is
listening, so the wait loop is what stops the smoke test racing startup and
failing against a perfectly good build. CI uses the same loop.

It finds Chromium on its own: whatever `npx playwright install chromium`
put in place, falling back to a pre-provisioned binary at
`/opt/pw-browsers/chromium` or wherever `PLAYWRIGHT_CHROMIUM_PATH` points.
That fallback is what lets it run in sandboxes that can't download browsers.

A JS exception fails the run. A failed subresource does not — the app pulls
fonts from Google Fonts, and a blocked or flaky fetch says nothing about
whether the page works, so those are reported as warnings. A gate that goes
red on a network hiccup is a gate people learn to ignore.

## Notes

- Fonts (Poppins, Lora, JetBrains Mono) load from Google Fonts. Offline, the
  app falls back to system serif/sans/mono and still lays out correctly.
- The bundle is ~466 KB (148 KB gzipped) in one chunk. All content is inlined
  as JSX, so there is nothing to code-split without restructuring the phases
  into lazy routes.
