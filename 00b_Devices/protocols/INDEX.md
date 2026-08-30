# Devices — Standards & Conventions

## Packaging
| Standard | Owner | Scope |
|----------|-------|-------|
| JEDEC JEP95 | JEDEC | Package outline drawings (TO, SOIC, QFN, BGA, etc.) |
| JEDEC JESD22 | JEDEC | Component reliability test methods |
| JEDEC JESD625 | JEDEC | ESD handling |
| IPC-A-610 | IPC | Acceptability of electronic assemblies |
| IPC-7351 | IPC | Land pattern naming |
| IPC J-STD-001 | IPC | Soldering requirements |
| IPC J-STD-020 | IPC | Moisture Sensitivity Level (MSL) |
| AEC-Q100/101/200 | AEC | Automotive qualification (IC / discrete / passive) |

## Compact device models
| Model | Used for |
|-------|----------|
| BSIM4 / BSIM6 | Bulk MOSFET |
| BSIM-CMG | FinFET / GAAFET |
| PSP | MOSFET (industry alt) |
| EKV | MOSFET (analog-friendly) |
| VBIC | BJT |
| HICUM | BJT (high-frequency) |
| MEXTRAM | BJT |

## Standardized part numbering / marking
- **1N4148**, **2N2222**, **2SC1815** — JIS / EIA part conventions
- **JEDEC JEP30** — part marking

## Reliability metrics
- **MTBF / MTTF** — mean time between/to failure
- **FIT** — Failures In Time (1 FIT = 1 failure per 10⁹ device-hours)
- **MSL** — Moisture Sensitivity Level (1 = unlimited, 6 = mandatory bake before use)
- **HALT / HASS** — Highly Accelerated Life / Stress Testing
- **AEC-Q grades** — Grade 0 (–40 to +150 °C) to Grade 3 (–40 to +85 °C)

## Cross-link
- Wire-level bus protocols → [01_Circuit_Board/protocols](../../01_Circuit_Board/protocols/INDEX.md)
- IC enumeration by the OS → [04_Device_Drivers](../../04_Device_Drivers/)
