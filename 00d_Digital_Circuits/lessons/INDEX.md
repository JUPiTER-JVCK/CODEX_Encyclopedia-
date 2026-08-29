# Digital Circuits — Lessons

## Dedicated lesson modules

| Topic | File |
|-------|------|
| Digital interactive labs | [digital_labs.md](digital_labs.md) — Truth tables, flip-flop timing, counter, FPGA hello |

---

1. **Truth tables → Karnaugh maps → minimal SOP/POS** — minimize a 3- and 4-var function.
2. **Logic gates on a breadboard** — 74HC00 (NAND), 74HC02 (NOR), 74HC04 (NOT) wiring.
3. **Build any gate from NAND** — prove functional completeness experimentally.
4. **Multiplexer / demultiplexer / decoder** — 4:1 mux from gates, 2-to-4 decoder.
5. **Ripple-carry adder** — 1-bit full adder → 4-bit; observe carry delay.
6. **Carry-lookahead adder** — speed up vs ripple; tradeoffs.
7. **Latches vs flip-flops** — SR, D, JK, T; level- vs edge-triggered.
8. **Counters & shift registers** — 4-bit synchronous counter, serial-to-parallel shifter.
9. **FSM design** — sequence detector (Moore + Mealy); state diagram → table → logic.
10. **Memory cells** — SRAM 6T, DRAM 1T1C concept walkthrough.
11. **Verilog hello** — write & sim a counter in Icarus + GTKWave.
12. **FPGA blink** — Tang Nano / Lattice iCE40: blink LED via yosys/nextpnr open flow.
13. **Pipelined data path** — 3-stage pipeline for a simple ALU op.
14. **Clock domain crossing** — 2-FF synchronizer, async FIFO concept.
15. **Mini-CPU project** — single-cycle 8- or 16-bit; then pipelined; then add hazards/forwarding.

## Suggested external
- Nand2Tetris Part 1 (free)
- HDLBits Verilog problems
- Ben Eater's 6502 / 8-bit CPU series
