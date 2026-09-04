# CODEX Encyclopedia

> A layered reference covering the full computing stack from **physics** to
> **applications**, plus cross-cutting domains (Security, AI/ML, RF,
> Algorithms, Embedded Systems, Industrial Protocols) — and two apps for
> reading and learning it.

**Version 3.2** · see [CHANGELOG.md](CHANGELOG.md)

## What's in here

Three components, each usable on its own:

| Component | What it is | Language |
|-----------|-----------|----------|
| **The codex** | 266 markdown notes across 23 layer folders — the reference itself | Markdown |
| **[`Codex_macOS/`](Codex_macOS/README.md)** | Native macOS reader for the codex | SwiftUI |
| **[`Codex_LMS/`](Codex_LMS/README.md)** | CORE — a seven-phase interactive curriculum | React + Vite |

The codex is a **reference**, organized by where a thing sits in the stack.
CORE is a **course**, organized by the order you'd learn things in. They
overlap in subject matter and are deliberately separate in structure.

## The layer model

23 layers in four bands. [LAYERS.md](LAYERS.md) has the full table with
languages, interfaces, and example flows per layer.

```
                                          ┌─ 14 Security
 08 User Applications ◄──── 17 Algorithms │  15 AI / ML
 07 Runtime Environment                   │  16 RF / Wireless
 06 System Libraries                      │  18 Embedded Systems
 05 OS Kernel ◄──────── 13 Network App    │  19 Industrial Protocols
 04 Device Drivers      12 Transport      └─ (cross-cutting: they
 03 Firmware / BIOS     11 Internet          intersect the stack at
 02 CPU                 10 Data Link         many points at once)
 01 Circuit Board ───── 09 Physical
 00d Digital Circuits
 00c Analog Circuits
 00b Devices
 00 Physics
```

Every layer folder holds the same six sub-sections:

| Sub-section | What lives here |
|-------------|-----------------|
| `references/` | Books, papers, datasheets, vendor docs |
| `lessons/` | Tutorials, walkthroughs, lab notes |
| `languages/` | Languages used at this layer, with a lookup table |
| `man_pages/` | CLI tools and system utilities |
| `topics/` | Concept notes — the "what is this and why" entries |
| `protocols/` | Protocols, specs, standards, RFCs |

Each has an `INDEX.md` as its entry point. Start at
[LAYERS.md](LAYERS.md) for the map, then drill into any layer's `README.md`.

## Running the macOS reader

Requires macOS 13+ and the Xcode command-line tools.

```sh
# One-time
sudo xcodebuild -license accept
xcode-select --install

# Build and launch (produces ./Codex.app)
./Codex_macOS/package_app.sh --run
```

Other modes: `--debug` (faster build), `--install` (also copy to
`/Applications`), `--icon` (regenerate the AppIcon), or no flag to build
without launching.

The app finds the codex by checking, in order: the `$CODEX_ROOT` environment
variable, the `project_path` resource recorded in the bundle at build time,
a walk up from the executable looking for `README.md` + `STRUCTURE.md`, then
the working directory. So the `.app` keeps working after you move it.

Full feature list and source layout: [`Codex_macOS/README.md`](Codex_macOS/README.md).

## Running CORE

Requires Node 18+.

```sh
cd Codex_LMS
npm install
npm run dev
```

Seven phases, 43 topics, 222 chapters, with interactive simulators (logic
gates, subnet calculator, CPU cycle stepper, chmod calculator, and more), a
glossary, a live code playground, and spaced review. Progress persists to
`localStorage`.

Details: [`Codex_LMS/README.md`](Codex_LMS/README.md).

## Repository layout

```
CODEX_Encyclopedia-/
├── README.md              ← this file
├── LAYERS.md              ← master layer table
├── STRUCTURE.md           ← conventions: naming, frontmatter, cross-links
├── CHANGELOG.md           ← version history
├── _assets/               ← reference images
│
├── 00_Physics/            ─┐
├── 00b_Devices/            │  Foundations
├── 00c_Analog_Circuits/    │
├── 00d_Digital_Circuits/  ─┘
│
├── 01_Circuit_Board/      ─┐
├── 02_CPU/                 │
├── 03_Firmware_BIOS/       │
├── 04_Device_Drivers/      │  Compute stack
├── 05_OS_Kernel/           │
├── 06_System_Libraries/    │
├── 07_Runtime_Environment/ │
├── 08_User_Applications/  ─┘
│
├── Network/               ─┐
│   ├── 09_Network_Physical/│
│   ├── 10_Network_DataLink/│  Network stack (OSI-aligned)
│   ├── 11_Network_Internet/│
│   ├── 12_Network_Transport/
│   └── 13_Network_Application/
│                          ─┘
├── 14_Security/           ─┐
├── 15_AI_ML/               │
├── 16_RF_Wireless/         │  Cross-cutting
├── 17_Algorithms_DSA/      │
├── 18_Embedded_Systems/    │
├── 19_Industrial_Protocols/
│                          ─┘
├── Codex_macOS/            ← SwiftUI reader source
├── Codex_LMS/              ← React curriculum source
└── tools/                  ← maintenance scripts (link audit)
```

Anything added at the root that isn't a layer must also be registered in
`CodexTree.nonContentDirs`, or the macOS app treats it as one. See
[STRUCTURE.md](STRUCTURE.md#repository-layout).

## Anchor materials

- `17_Algorithms_DSA/references/100_leetcode_problems.pdf` — the source for
  [`topics/100_must_do.md`](17_Algorithms_DSA/topics/100_must_do.md)
- `18_Embedded_Systems/references/embedded_systems_full_roadmap_book.pdf` —
  see *Known gaps* below
- `00d_Digital_Circuits/topics/logic_gates.md` — full truth-table reference
- `01_Circuit_Board/protocols/embedded_bus_protocols_lookup.md` — the
  DSLogic/sigrok decoder catalog, ~150 decoders mapped to owning layers

## Conventions

See [STRUCTURE.md](STRUCTURE.md). In brief:

- Markdown only, UTF-8, LF endings
- `lowercase_with_underscores.md` filenames; layer folders keep their numeric prefix
- Every note opens with YAML frontmatter (`title`, `layer`, `section`, `tags`, `updated`)
- Link rather than duplicate — each protocol lives in the layer that owns it on the wire
- Images live in `_assets/`, referenced relatively

## Known gaps

Honest inventory of what isn't here yet:

- **The Python TUI is not in this repository.** `requirements.txt` remains at
  the root and older changelog entries describe a Textual-based browser, but
  no `codex_tui/` source is present. Use the macOS app, or any markdown
  reader, until it lands.
- **The four reference images are missing** from `_assets/` — see
  [`_assets/README.md`](_assets/README.md) for the expected filenames. Every
  image has a markdown text equivalent, so nothing is lost but the pictures.
  No note actually embeds one today, which is why the tree audits clean.
- **`embedded_systems_full_roadmap_book.pdf` is a placeholder** — an 8 KB,
  10-page generated stub, not Parvizi's actual roadmap book. The real source
  is [github.com/m3y54m/Embedded-Engineering-Roadmap](https://github.com/m3y54m/Embedded-Engineering-Roadmap)
  (CC BY-SA 4.0).
- **The macOS app has not been compiled** since its last changes — there is
  no Swift toolchain in the environment they were written in. Run
  `./Codex_macOS/package_app.sh --debug` before trusting a build. Remaining
  smaller defects are listed in
  [`Codex_macOS/README.md`](Codex_macOS/README.md#known-issues).

## Verification

Three GitHub Actions workflows gate every pull request:

| Workflow | Runs | Catches |
|----------|------|---------|
| `swift.yml` | `swift build` (debug + release) on macOS | The macOS app not compiling |
| `docs.yml` | `link_audit.py`, `table_audit.py` | Broken links, missing H1s, malformed tables |
| `lms.yml` | `npm ci`, build, audit, Playwright smoke | CORE not building, or losing progress on reload |

All three run locally too:

```sh
python3 tools/link_audit.py
python3 tools/table_audit.py
cd Codex_LMS && npm ci && npm run build
cd Codex_macOS && swift build          # macOS only
```

The audits resolve every relative link against the file containing it,
skipping code spans so syntax examples aren't counted, and exit non-zero on a
breakage. Currently:

- 274 markdown files
- 1006 internal links, 0 broken
- Every file carries an H1, every pipe table well-formed
