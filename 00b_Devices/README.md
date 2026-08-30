# 00b — Devices

> Where physics becomes a part you can solder. Diodes, BJTs, MOSFETs,
> passives. The atomic units of every analog and digital circuit above.

## At a glance

| Field | Value |
|-------|-------|
| Description | Discrete and integrated electronic components |
| Languages | SPICE (model cards), Verilog-A (behavioral) |
| Medium / Interface | Datasheet parameters, I-V curves, equivalent models |
| Example | A power MOSFET switches 30 A under PWM gate drive |
| Adjacent | ↓ [00_Physics](../00_Physics/), ↑ [00c_Analog_Circuits](../00c_Analog_Circuits/) |

## What lives here

- **Passives** — resistors, capacitors, inductors, transformers, crystals
- **Diodes** — rectifier, Schottky, Zener, LED, varactor, PIN, TVS
- **Transistors** — BJT (NPN/PNP), JFET, MOSFET (enhancement / depletion, NMOS/PMOS), IGBT
- **Optoelectronics** — LEDs, laser diodes, photodiodes, phototransistors, optocouplers
- **Magnetics** — chokes, common-mode chokes, ferrite beads
- **Power devices** — power MOSFETs, IGBTs, GaN, SiC HEMTs
- **Sensors** — Hall, thermistors (NTC/PTC), RTDs, thermocouples, strain gauges
- **MEMS** — accelerometers, gyros, microphones

## Sub-sections

- [references/](references/INDEX.md) — Sedra-Smith, Razavi, datasheets
- [lessons/](lessons/INDEX.md) — model a diode → bias a BJT → MOSFET small-signal
- [languages/](languages/INDEX.md) — SPICE model formats, Verilog-A
- [man_pages/](man_pages/INDEX.md) — `ngspice`, KiCad, datasheet tools
- [topics/](topics/INDEX.md) — characteristics, packaging, derating, SOA
- [protocols/](protocols/INDEX.md) — JEDEC packaging & part numbering

## Cross-references
- Physical mechanism behind every device → [00_Physics](../00_Physics/)
- How devices combine into circuits → [00c_Analog_Circuits](../00c_Analog_Circuits/), [00d_Digital_Circuits](../00d_Digital_Circuits/)
- IC integration on a board → [01_Circuit_Board](../01_Circuit_Board/)
