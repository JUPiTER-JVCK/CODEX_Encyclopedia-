# 00d — Digital Circuits

> Once a signal is interpreted as 0 or 1, this is the layer that combines and
> stores it. Logic gates, flip-flops, registers, ALUs, FSMs, and the RTL that
> describes them — the building blocks of every CPU above.

## At a glance

| Field | Value |
|-------|-------|
| Description | Discrete two-valued logic and sequential storage |
| Languages | Verilog, SystemVerilog, VHDL, Chisel, Amaranth |
| Medium / Interface | Boolean signals on wires; clocked synchronous design |
| Example | A 32-bit ALU executes ADD via carry-lookahead in 1 clock cycle |
| Adjacent | ↓ [00c_Analog_Circuits](../00c_Analog_Circuits/), ↑ [02_CPU](../02_CPU/) |

## What lives here

- **Number systems** — binary, hex, octal, two's complement, BCD, gray code, IEEE 754 float
- **Logic gates** — YES/NO, AND/OR/XOR/NAND/NOR/XNOR (see [topics/logic_gates.md](topics/logic_gates.md))
- **Combinational logic** — multiplexers, decoders, encoders, comparators, adders
- **Sequential logic** — latches, flip-flops (D, T, JK, SR), registers, counters, shift registers
- **FSM** — Moore vs Mealy state machines
- **Memory** — SRAM, DRAM cells, register files, FIFOs, CAMs
- **Arithmetic** — ripple-carry / carry-lookahead / Wallace tree / Booth multiplier
- **HDL design** — RTL coding, synthesis, place & route, timing closure
- **Clock domain crossing**, **metastability**, **setup/hold**

## Sub-sections
- [references/](references/INDEX.md)
- [lessons/](lessons/INDEX.md)
- [languages/](languages/INDEX.md)
- [man_pages/](man_pages/INDEX.md)
- [topics/](topics/INDEX.md) — including **[logic_gates.md](topics/logic_gates.md)** (full truth tables)
- [protocols/](protocols/INDEX.md)

## Cross-references
- Devices used to build gates → [00b_Devices](../00b_Devices/) (CMOS)
- Sampling boundary into the digital domain → [00c_Analog_Circuits](../00c_Analog_Circuits/)
- Microarchitecture built from these blocks → [02_CPU/topics](../02_CPU/topics/INDEX.md)
- Bus protocols at the digital wire level → [01_Circuit_Board/protocols](../01_Circuit_Board/protocols/INDEX.md)
