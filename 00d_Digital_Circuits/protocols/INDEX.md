# Digital Circuits — Standards & Specs

## HDL & exchange formats
| Standard | Body | Scope |
|----------|------|-------|
| IEEE 1364 | IEEE | Verilog HDL |
| IEEE 1800 | IEEE | SystemVerilog |
| IEEE 1076 | IEEE | VHDL |
| IEEE 1666 | IEEE | SystemC |
| IEEE 1850 | IEEE | PSL (Property Spec Language) |
| IEEE 1685 | IEEE | IP-XACT (IP packaging) |
| IEEE 1801 | IEEE | UPF (low-power intent) |
| Liberty (.lib) | Synopsys | Standard-cell timing/power |
| LEF / DEF | Cadence | Library / design exchange |
| GDSII | Calma | Layout interchange (fab format) |
| OASIS | SEMI | GDSII successor |

## Test / debug
| Standard | Scope |
|----------|-------|
| IEEE 1149.1 | JTAG boundary scan |
| IEEE 1149.4 | Mixed-signal boundary scan |
| IEEE 1149.6 | AC-coupled boundary scan |
| IEEE 1149.7 | cJTAG (compact) |
| IEEE 1500 | Embedded core test |
| IEEE 1687 | iJTAG (internal JTAG) |
| IEEE 1450 | STIL (Standard Test Interface Language) |

## On-chip / SoC interconnect
| Spec | Owner | Scope |
|------|-------|-------|
| AMBA AXI / AHB / APB / ACE / CHI | Arm | Bus protocols for SoCs |
| Wishbone | OpenCores | Open SoC bus |
| TileLink | SiFive | Cache-coherent fabric (RISC-V) |
| OCP | Accellera | Open Core Protocol |
| Avalon | Intel/Altera | FPGA interconnect |
| AXI-Stream | Arm | Streaming variant |
| NoC standards | various | Network-on-Chip |

## Memory interfaces (digital-side specs)
| Spec | Scope |
|------|-------|
| JEDEC JESD79-x | DDR / DDR2 / DDR3 / DDR4 / DDR5 |
| JEDEC JESD209-x | LPDDR family |
| JEDEC JESD230 | GDDR5 |
| JEDEC JESD235 | HBM / HBM2 / HBM3 |
| ONFI | Open NAND Flash Interface |
| eMMC (JESD84) | Embedded MultiMediaCard |

## Cross-link
- Wire-level PCB-side bus protocols → [01_Circuit_Board/protocols](../../01_Circuit_Board/protocols/INDEX.md)
- The big "logic analyzer decoder" catalog → [01/protocols/embedded_bus_protocols_lookup.md](../../01_Circuit_Board/protocols/embedded_bus_protocols_lookup.md)
