---
title: "MOSFET Cross-Section and Operation"
layer: 00b_Devices
tags: [mosfet, transistor, nmos, pmos, cmos, cross-section, semiconductor]
updated: 2026-05-20
---

# MOSFET Cross-Section and Operation

---

## N-channel MOSFET (NMOS) cross-section

```
                          Gate (G)
                            │
                     ┌──────┴──────┐
                     │  Metal/Poly │
                     │   Gate      │
                     └──────┬──────┘
                     ┌──────┴──────┐
                     │   SiO₂      │  ← Gate oxide (1-5 nm in modern)
                     │  (insulator)│
        ─────────────┴─────────────┴─────────────
       │  n⁺   │                       │  n⁺   │
  Source│ (heavy│     P-type body       │(heavy │Drain
  (S)  │  dope)│     (substrate)       │ dope) │(D)
       │       │                       │       │
       └───────┴───────────────────────┴───────┘
        ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
                   P-type substrate
                         │
                       Body (B)
```

**Operation:**
- **V_GS < V_th** → OFF (no channel, no current between S and D)
- **V_GS > V_th** → ON (inversion layer forms under the gate, electrons
  flow from Source to Drain through the channel)
- The gate is **insulated** (oxide) → essentially zero DC gate current
  (capacitive control)

---

## PMOS cross-section (complementary)

```
                          Gate (G)
                            │
                     ┌──────┴──────┐
                     │   Gate      │
                     └──────┬──────┘
                     ┌──────┴──────┐
                     │   SiO₂      │
        ─────────────┴─────────────┴─────────────
       │  p⁺   │                       │  p⁺   │
  Source│       │     N-type body       │       │Drain
  (S)  │       │     (n-well)          │       │(D)
       └───────┴───────────────────────┴───────┘
        ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
                   P-type substrate
```

- PMOS turns ON when **V_GS < V_th** (negative threshold).
- Holes carry current (slower than electrons → PMOS is ~2× wider for matched drive).

---

## CMOS Inverter

```
                    V_DD
                     │
               ┌─────┴─────┐
               │   PMOS     │
          ─────┤            ├──┬── Output (Y = NOT A)
               │            │  │
               └─────┬─────┘  │
  Input (A) ─────────┤        │
               ┌─────┴─────┐  │
               │   NMOS     │  │
          ─────┤            ├──┘
               │            │
               └─────┬─────┘
                     │
                    GND

  Truth table:
  ┌───┬───┐
  │ A │ Y │
  ├───┼───┤
  │ 0 │ 1 │  PMOS ON, NMOS OFF → Y pulled to V_DD
  │ 1 │ 0 │  PMOS OFF, NMOS ON → Y pulled to GND
  └───┴───┘

  Key: NO static power (one transistor always OFF → no DC path V_DD to GND)
  Power only during switching: P = α · C_L · V_DD² · f
```

---

## CMOS NAND gate (2-input)

```
                    V_DD
                 ┌───┴───┐
                 │ PMOS-A │
            ─────┤        ├──┐
  A ─────────────┤        │  │
                 └───┬───┘  │
                     │      ├── Y = NOT(A AND B)
                 ┌───┴───┐  │
                 │ PMOS-B │  │
            ─────┤        ├──┘
  B ─────────────┤        │
                 └───┬───┘
                     │
                 ┌───┴───┐
                 │ NMOS-A │
  A ─────────────┤        │
                 └───┬───┘
                 ┌───┴───┐
                 │ NMOS-B │
  B ─────────────┤        │
                 └───┬───┘
                     │
                    GND

  PMOS in parallel (pull-up), NMOS in series (pull-down)
  Only when BOTH A=1 AND B=1 → both NMOS on → Y=0
```

---

## Key MOSFET parameters

| Parameter | Symbol | Meaning |
|-----------|--------|---------|
| Threshold voltage | V_th | Gate voltage to turn on (~0.3–0.7V) |
| Oxide thickness | t_ox | Thinner → stronger gate control |
| Channel length | L | Shorter → faster, more leakage |
| Channel width | W | Wider → more current |
| Transconductance | g_m | ΔI_D / ΔV_GS (gain) |
| On-resistance | R_DS(on) | Resistance when fully on |
| Gate capacitance | C_GS | Determines switching speed |

---

## Technology scaling

```
  Node name:  180nm → 130nm → 90nm → 65nm → 45nm → 28nm → 14nm → 7nm → 5nm → 3nm
  Year:       1999    2001    2004   2006   2008   2011   2014   2018  2020  2023

  Transistor type evolution:
  Planar MOSFET ──────────────────▶ FinFET (22/14nm+) ──────▶ GAA/Nanosheet (3nm+)

  FinFET (3D):
       ┌───┐
  Gate │   │ Gate     ← gate wraps around a thin "fin" of silicon
  ─────┤   ├─────     ← 3-sided gate → better electrostatic control
       │Fin│          ← reduced leakage vs. planar
  ─────┤   ├─────
       └───┘

  GAA/Nanosheet:
  Gate ═══════════
       ┌─────────┐
       │Nanosheet│    ← gate wraps ALL sides (4-sided)
       └─────────┘    ← even better control at 3nm and below
  Gate ═══════════
```

---

## Cross-links

- Digital circuits (gates built from MOSFETs) → [../../00d_Digital_Circuits/topics/logic_gates.md](../../00d_Digital_Circuits/topics/logic_gates.md)
- Analog circuits (op-amps use MOSFETs) → [../../00c_Analog_Circuits/topics/INDEX.md](../../00c_Analog_Circuits/topics/INDEX.md)
- Physics (semiconductor physics) → [../../00_Physics/topics/INDEX.md](../../00_Physics/topics/INDEX.md)
- CPU (billions of MOSFETs) → [../../02_CPU/topics/cpu_pipeline.md](../../02_CPU/topics/cpu_pipeline.md)
