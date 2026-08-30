# Digital Circuits — Topics

## Number systems
- **Binary, octal, decimal, hexadecimal** — base conversions; migrated from
  the v1 number-systems notes
- **Signed representations** — sign-magnitude, 1's complement, **two's complement** (standard), excess/biased
- **BCD**, **gray code** (rotary encoders, low-glitch counters)
- **Fixed-point**, **block floating-point**
- **IEEE 754** — single/double/half precision, bfloat16
- **Posit numbers** (modern alt)

## Combinational logic
- **Gates** — see [logic_gates.md](logic_gates.md) for full truth tables
- **Adders** — half, full, ripple-carry, carry-lookahead, carry-skip, carry-select, Kogge-Stone, Brent-Kung
- **Subtractors** — via two's complement + adder
- **Multipliers** — array, Wallace tree, Dadda, Booth-encoded
- **Comparators**, **encoders**, **decoders** (binary, priority), **multiplexers** / **demultiplexers**
- **Shifters / barrel shifters**
- **ALU** — composition of adder + logic + shifter + control

## Sequential logic
- **Latches vs flip-flops** — level- vs edge-triggered
- **Flip-flop flavors** — D, T, JK, SR
- **Registers, register files**
- **Counters** — async (ripple), sync; up/down; modulo-N
- **Shift registers** — SISO, SIPO, PISO, PIPO; LFSRs for pseudo-random / CRC

## Memory cells
- **SRAM (6T cell)** — fast, expensive
- **DRAM (1T1C)** — dense, needs refresh
- **NVM** — ROM, EPROM, EEPROM, NOR/NAND flash, MRAM, ReRAM, FeRAM, PCM
- **CAM / TCAM** — content-addressable (routing TCAMs)
- **FIFO** — sync / async (with Gray-coded pointers for CDC)

## State machines
- **Moore vs Mealy**
- **One-hot vs binary encoding**
- **State minimization**
- **Statecharts / hierarchical FSMs**

## RTL & synthesis
- **RTL coding style** — flip-flop inference, blocking vs non-blocking
- **Always blocks** — combinational, sequential, latch (usually unintended)
- **Synthesis** — RTL → gate netlist mapped to standard-cell library
- **Place & route** — floorplan, placement, clock tree, routing, timing closure
- **Static Timing Analysis (STA)** — setup, hold, recovery, removal
- **Clock skew, jitter, uncertainty**
- **Clock gating, power gating, multi-Vt, multi-voltage**

## Clock domain crossing & metastability
- **Metastability** — what it is, MTBF formulas
- **2-FF synchronizer** — for single bit signals
- **Async FIFO** — with Gray-code pointers
- **Handshake-based CDC**

## Test & debug
- **Functional sim** vs **gate-level sim** vs **formal verification**
- **JTAG boundary scan (IEEE 1149.1)** — cross-link [01](../../01_Circuit_Board/protocols/INDEX.md)
- **Scan chains, ATPG, BIST**
- **Coverage** — line, branch, FSM, toggle, functional, assertion

## FPGA vs ASIC vs CPLD
- **CPLD** — small, instant-on, EEPROM-based
- **FPGA** — LUT + flip-flop + DSP block + BRAM + SerDes
- **ASIC** — full-custom or standard-cell; NRE vs unit cost tradeoff
- **Structured ASIC** / **eFPGA** — middle ground

## Cross-link
- Built from devices → [00b_Devices](../../00b_Devices/) (CMOS)
- Microarch above → [02_CPU/topics](../../02_CPU/topics/INDEX.md)
- Embedded firmware on FPGA soft cores → [03_Firmware_BIOS](../../03_Firmware_BIOS/)
