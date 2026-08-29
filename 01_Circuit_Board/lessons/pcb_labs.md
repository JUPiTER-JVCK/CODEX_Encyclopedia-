---
title: "Circuit Board — Interactive Labs"
layer: 01_Circuit_Board
section: lessons
tags: [lesson, pcb, kicad, soldering, signal-integrity, lab, quiz, hands-on]
updated: 2026-05-21
---

# Circuit Board — Interactive Labs

---

## Module 1: KiCad Schematic & Layout

### Objective

Design a simple LED blinker PCB (555 timer circuit) from schematic
capture through layout, learning EDA workflow.

### Prerequisites

- KiCad 8+ installed
- Basic electronics knowledge (resistors, capacitors, 555 timer)

### Lab Steps

1. **New project**: File → New Project → `led_blinker`
2. **Schematic** (Eeschema):
   - Place 555 timer, LED, resistors (R1=1k, R2=10k), capacitor (C1=10µF)
   - Wire the astable circuit
   - Run ERC (Electrical Rules Check) — fix errors
   - Assign footprints (e.g., `Resistor_SMD:R_0805`)
3. **PCB layout** (Pcbnew):
   - Import netlist from schematic
   - Define board outline (Edge.Cuts layer)
   - Place components, route copper traces
   - Run DRC (Design Rules Check)
4. **Generate Gerbers**: File → Fabrication Outputs → Gerbers

```
  KiCad workflow:
  Schematic (.kicad_sch)
       │
       ├── ERC (electrical rules)
       │
       ▼
  Netlist → PCB Layout (.kicad_pcb)
       │
       ├── DRC (design rules)
       │
       ▼
  Gerbers + Drill files → Fabrication (JLCPCB, PCBWay, OSH Park)
```

### Knowledge Check

**Q1**: What is the difference between ERC and DRC?

> **A1**: ERC checks the schematic for electrical errors (unconnected pins,
> conflicting outputs). DRC checks the PCB layout for physical violations
> (trace spacing, drill sizes, clearances to board edge).

**Q2**: What is a footprint?

> **A2**: The physical pad layout for a component on the PCB. A resistor's
> symbol is the same regardless of package, but footprints differ: 0402,
> 0805, 1206 (SMD), or through-hole.

---

## Module 2: Soldering Practice

### Objective

Solder through-hole and SMD components, inspect joints, and rework.

### Prerequisites

- Soldering iron (temperature-controlled, 350°C tip)
- Solder (63/37 leaded or SAC305 lead-free), flux
- Practice PCB or perfboard
- Through-hole components + 0805 SMD components
- Magnifying glass or USB microscope

### Good vs bad solder joints

```
  Good (concave fillet)        Cold joint              Bridge
  ┌───────────┐               ┌───────────┐          ┌───────────┐
  │    ╱╲     │               │   ╱────╲  │          │  ╱────────╲│
  │   ╱  ╲    │               │  ╱      ╲ │          │ ╱  solder  ╲
  │  ╱ pad ╲  │               │ ╱  pad   ╲│          │╱  connects  ╲
  │ ╱───────╲ │               │╱──────────╲│          │  two pads!  │
  │    lead   │               │   lead     │          │   ⚠ SHORT   │
  └───────────┘               └───────────┘          └───────────┘
  Shiny, concave              Dull, lumpy             Excess solder
  Good wetting                Poor wetting            Remove with wick
```

### Lab Steps

1. Tin the soldering iron tip
2. Solder 5 through-hole resistors: touch iron to pad+lead, feed solder
3. Inspect joints with magnifier — should be shiny and concave
4. Practice SMD: apply solder to one pad, place component, reflow
5. Solder the other pad
6. Practice rework: use solder wick or desoldering pump to remove a component

### Review Flashcards

| Term | Definition |
|------|-----------|
| Gerber | Industry-standard PCB fabrication file format |
| Via | Copper-plated hole connecting layers |
| Trace | Copper conductor on a PCB layer |
| Pour / flood | Copper fill (usually GND plane) |
| Annular ring | Copper ring around a drilled hole |
| Reflow | Heating solder paste to attach SMD components |
| Solder wick | Braided copper for removing solder (rework) |

### Challenge

> Design and order a real PCB from JLCPCB or OSH Park. Target: a USB-C
> breakout board with a voltage regulator (3.3V) and status LED.
> Practice the full cycle: schematic → layout → order → solder → test.

---

## Cross-links

- Digital circuits → [../../00d_Digital_Circuits/lessons/digital_labs.md](../../00d_Digital_Circuits/lessons/digital_labs.md)
- CPU architecture → [../../02_CPU/lessons/cpu_labs.md](../../02_CPU/lessons/cpu_labs.md)
- Embedded systems → [../../18_Embedded_Systems/lessons/embedded_labs.md](../../18_Embedded_Systems/lessons/embedded_labs.md)
