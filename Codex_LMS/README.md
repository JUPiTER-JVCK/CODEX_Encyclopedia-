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

**Every one of the 43 topics has something to manipulate.** Four reusable
primitives cover most of them, driven by per-topic data rather than a new
component each time:

| Primitive | Shape |
|---|---|
| `StepThrough` | a process one phase at a time, with state per step |
| `CompareGrid` | hold one dimension still and read it down every row |
| `TreeExplorer` | expand a nested structure, inspect one node |
| `TruthTableBuilder` | pick an expression, read every case |

Topics whose subject has a shape of its own get a bespoke widget: gate
simulator, base converter, bitwise visualiser, CPU cycle stepper, chmod
calculator, subnet calculator, code tracer, box-model visualiser, a signed
32-bit clock walking into its sign bit, a vim mode machine, shell expansion
order, a call stack, the event loop, a pipeline composer, a value inspector,
a query builder, a topology explorer, a VLAN lab and a phishing inspector.

`simulator: true` on a topic means it renders a component that **holds
state** — a static diagram is an illustration, not a simulator. Both halves
of that are enforced by `test/smoke.mjs`; see *Testing*.

## Layout

```
Codex_LMS/
├── index.html              ← Vite entry, fonts, pre-paint background
├── vite.config.js
├── package.json
├── public/favicon.svg
├── src/
│   ├── main.jsx            ← React root
│   ├── CoreApp.jsx         ← the whole app: phases, topics, widgets
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

Two further guards run alongside it:

- **Flag consistency.** A topic's `simulator: true` must agree with whether
  it renders a component that holds state. Read from source, because the
  failure is a stale literal rather than a rendering fault.
- **Keyboard operability.** `onClick` may only sit on a `<button>`, a
  component, or an element carrying `role="button"` with `tabIndex` and a key
  handler. Three widgets shipped as clickable `<div>`s before review caught
  it — invisible to Tab, deaf to Enter, and not announced as controls. The
  sweep also Tabs to a real control and presses Enter, so the check proves
  operability rather than just markup.
- **Render sweep.** All 43 topics are opened in reference mode and each must
  mount a widget with no page error. This is the only check that proves the
  components render rather than merely compile — and it earned its keep
  immediately, catching seven topics whose "widget" was a static diagram with
  no state, which the flag check alone had waved through.

It expects a server already running (`npm run preview`) and takes the URL as
its first argument, defaulting to `http://localhost:4173/`:

```sh
npm run smoke:local
```

That wraps the whole dance: it starts the preview server, waits for it to
actually listen, runs the test, and kills the server on the way out. `PORT`
and `TIMEOUT` override the defaults (4173, 30s).

The wait is the point. `npm run preview &` returns as soon as the process
starts, not when it is listening, so without it the test races startup and
fails against a perfectly good build. The wait is also *bounded* — an
unbounded `until curl` hangs forever on a port conflict, giving no clue why.
On timeout the script prints the server's output and exits non-zero.

Two failure modes it refuses rather than reports green: a server already on
the port (the test would pass against whatever *that* is serving), and a
server that binds but 404s, which is what `vite preview` does when `dist/` is
missing or stale. Cleanup kills the whole process group — `npm run preview`
forks vite as a child, so killing only npm leaves vite holding the port, and
the next run would smoke-test the stale bundle and pass.

CI runs the same script, so the two cannot drift.

To point the test at a server you are already running, call it directly:

```sh
npm run smoke -- http://localhost:4173/
```

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
- **Not verified: how any of this sounds.** The checks prove every control is
  focusable and operable; they cannot prove a screen reader announces it
  sensibly. `aria-pressed` / `aria-expanded` are set where they apply, but
  nobody has listened to the result.
- The bundle is ~530 KB (166 KB gzipped) in one chunk. All content is inlined
  as JSX, so there is nothing to code-split without restructuring the phases
  into lazy routes. The 33 widgets added for full topic coverage cost about
  18 KB gzipped between them, because most share four implementations.
