# Digital Circuits — Tools

## Open-source HDL flow
| Command | Purpose |
|---------|---------|
| `iverilog` | Icarus Verilog compiler |
| `vvp` | Icarus Verilog runtime |
| `verilator` | Verilog → C++ converter |
| `ghdl` | VHDL sim |
| `yosys` | Synthesis |
| `nextpnr-ice40` / `-ecp5` / `-gowin` | Place & route |
| `icepack` / `icetime` | iCE40 bitstream / timing |
| `ecppack` | ECP5 bitstream |
| `gtkwave` | Waveform viewer |
| `surfer` | Modern Rust waveform viewer |
| `cocotb-config` | cocotb framework |
| `sby` (SymbiYosys) | Formal verification driver |

## Commercial / vendor
| Tool | Vendor |
|------|--------|
| `vivado` | AMD/Xilinx |
| `quartus_sh` | Intel/Altera |
| `vcs`, `simv` | Synopsys VCS |
| `xrun` (Xcelium) | Cadence |
| `vsim` (ModelSim/QuestaSim) | Siemens EDA |
| `dc_shell` | Synopsys Design Compiler |
| `genus`, `innovus` | Cadence digital implementation |

## Number / bit utilities
| Command | Purpose |
|---------|---------|
| `printf '%b' 255` | Decimal → binary |
| `printf '%x' 255` | Decimal → hex |
| `printf '%d' 0xFF` | Hex → decimal |
| `bc <<< "obase=2; ibase=10; 255"` | Arbitrary base in `bc` |
| `python3 -c "print(bin(255))"` | Python one-liner |

## Lab
- Logic analyzer (Saleae, DSLogic, sigrok-supported devices)
- `sigrok-cli`, PulseView GUI — open-source LA software (see [01/protocols](../../01_Circuit_Board/protocols/INDEX.md) for the decoder list)
- FPGA dev boards — TinyFPGA, iCEBreaker, Tang Nano, ULX3S (open-toolchain friendly)
