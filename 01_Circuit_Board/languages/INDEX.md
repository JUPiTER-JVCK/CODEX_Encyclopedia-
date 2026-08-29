# Circuit Board — Languages

No "programming" languages in the conventional sense at this layer — you describe
hardware behavior with HDLs and design tools.

| Language | Type | Use at this layer | Toolchain |
|----------|------|-------------------|-----------|
| Verilog | HDL | RTL design for FPGAs/ASICs | Icarus, Verilator, Vivado, Quartus |
| SystemVerilog | HDL + verification | RTL + testbenches, assertions | VCS, Questa, Verilator |
| VHDL | HDL | RTL design, common in defense/aerospace | GHDL, Vivado, Quartus |
| Chisel | HDL DSL (Scala) | Generator-based RTL (RISC-V chips) | sbt, FIRRTL |
| Migen / nMigen / Amaranth | HDL DSL (Python) | Higher-level FPGA design | yosys, nextpnr |
| SPICE | Analog sim | Transistor-level circuit simulation | ngspice, LTspice |
| KiCad S-expressions | Schematic/PCB | File format, rarely hand-written | KiCad GUI |
| Gerber (RS-274X) | PCB output | Fabrication interchange format | KiCad/Altium export |

## Related
- HDL ↔ CPU instructions → [02_CPU/languages](../../02_CPU/languages/INDEX.md)
- Embedded C for SBCs → [03_Firmware_BIOS/languages](../../03_Firmware_BIOS/languages/INDEX.md)
