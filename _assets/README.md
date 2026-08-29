# `_assets/` — Reference Images

Drop image files here that are referenced from the codex markdown. The files
listed below are referenced but not yet present — when you have the original
files, place them here with these exact filenames (or update the links).

## Expected files

| Filename | What it shows | Referenced from |
|----------|---------------|-----------------|
| `computer_layers_ladder.png` | The 9-layer ladder (App → OS → Architecture → Microarch → Logic → Digital → Analog → Devices → Physics) | [00_Physics/README.md](../00_Physics/README.md), [LAYERS.md](../LAYERS.md) |
| `dslogic_decoder_list.png` | DSLogic/sigrok protocol decoder catalog (base + upper-layer tables) | [01_Circuit_Board/protocols/embedded_bus_protocols_lookup.md](../01_Circuit_Board/protocols/embedded_bus_protocols_lookup.md) |
| `logic_gates_explained.png` | The 8 logic gates with truth tables (YES, NO, AND, OR, XOR, NAND, NOR, XNOR) | [00d_Digital_Circuits/topics/logic_gates.md](../00d_Digital_Circuits/topics/logic_gates.md) |
| `embedded_systems_roadmap.png` | Embedded Systems Engineering Roadmap v1.2.3 (Meysam Parvizi, CC BY-SA 4.0) | [18_Embedded_Systems/README.md](../18_Embedded_Systems/README.md), [LAYERS.md](../LAYERS.md) |

## Optional — additional images

Any other images you want to reference from the codex live here, ideally with
the naming convention `lowercase_with_underscores.ext`. PNG, JPG, and SVG are
all fine.

## How to add images

1. Save the file here under one of the names above (or your own).
2. Reference from any markdown file with a relative path:
   - From layer root: `![Logic gates](logic_gates_explained.png)`
   - From a sub-section: `![Logic gates](../../_assets/logic_gates_explained.png)`
3. If you rename, update [README.md](../README.md), [LAYERS.md](../LAYERS.md),
   and the cross-link from any topic that references the image.

## Notes
- The codex's markdown content already includes text equivalents of each image
  (ASCII / markdown tables) — the actual image files are decorative
  reinforcements, not the source of truth.
- For PDFs (LeetCode list, Embedded Systems Roadmap book) the files live in
  the relevant layer's `references/` folder, not here.
