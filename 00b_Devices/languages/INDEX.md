# Devices — Languages

| Language / format | Use |
|-------------------|-----|
| SPICE model cards | `.MODEL`, `.SUBCKT` describing device IV behavior |
| Verilog-A | Behavioral analog modeling for compact device models |
| Verilog-AMS | Mixed analog-digital |
| BSIM4 / BSIM-CMG | Industry-standard MOSFET models |
| PSP, EKV | Alternative compact MOSFET models |
| IBIS | I/O Buffer Information Spec — signal-integrity simulation |
| Touchstone (.sNp) | RF S-parameter file format |
| Spice deck (.cir, .sp, .net) | SPICE netlist format |
| KiCad symbol/footprint | Schematic + PCB device representation |
| LTspice .asy / .lib | LTspice symbol + model library |
| JEDEC JEP30 | Part marking & ID standard |

## Datasheet "languages"
- **Parameter tables** — V, I, t, C, R, dB values with min/typ/max + conditions
- **I-V / C-V / S-parameter curves**
- **Thermal data** — R_θJA, R_θJC, P_D, SOA (Safe Operating Area)
- **Reliability** — MTBF, MTTF, FIT, mean lifetime under conditions
- **Package drawings** — body dimensions, lead pitch, recommended land pattern
