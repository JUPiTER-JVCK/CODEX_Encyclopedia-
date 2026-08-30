---
title: "Digital Circuits — Interactive Labs"
layer: 00d_Digital_Circuits
section: lessons
tags: [lesson, digital, logic, flip-flop, counter, fpga, lab, quiz, hands-on]
updated: 2026-05-21
---

# Digital Circuits — Interactive Labs

---

## Module 1: Truth Table Verification

### Objective

Build basic logic gates from discrete ICs, verify truth tables with LEDs,
and derive a combinational function.

### Prerequisites

- 74HC00 (quad NAND), 74HC08 (quad AND), 74HC32 (quad OR), 74HC04 (hex NOT)
- LEDs + 220 Ω resistors, breadboard, 5V supply
- Logic probe or multimeter

### Lab Steps

1. Wire a 74HC08 AND gate: connect two inputs to switches (or jumper wires)
2. Connect output through LED + resistor to GND
3. Test all input combinations, record in truth table:

```
  AND gate (74HC08)        OR gate (74HC32)        NAND (74HC00)
  A  B  │  Y               A  B  │  Y              A  B  │  Y
  ──────┼────              ──────┼────             ──────┼────
  0  0  │  0               0  0  │  0              0  0  │  1
  0  1  │  0               0  1  │  1              0  1  │  1
  1  0  │  0               1  0  │  1              1  0  │  1
  1  1  │  1               1  1  │  1              1  1  │  0
```

4. Build a combinational function: Y = (A AND B) OR (NOT A AND C)
5. Verify all 8 input combinations (3 inputs → 2³ = 8 rows)

### Knowledge Check

**Q1**: How many NAND gates do you need to build an AND gate?

> **A1**: Two — one NAND gate followed by a NOT (another NAND with
> inputs tied together). NAND is universal: any logic function can
> be built from NAND gates alone.

**Q2**: What is the output of XOR when both inputs are the same?

> **A2**: 0. XOR outputs 1 only when inputs differ. (A ⊕ B)

---

## Module 2: D Flip-Flop and Timing

### Objective

Observe edge-triggered behavior, setup/hold times, and build a
toggle flip-flop (T-FF) from a D-FF.

### Prerequisites

- 74HC74 (dual D flip-flop with preset/clear)
- Clock source: 1 Hz (555 timer or Arduino PWM)
- LEDs, oscilloscope (recommended)

### D Flip-Flop timing

```
  CLK  ──┐  ┌──┐  ┌──┐  ┌──┐  ┌──
         └──┘  └──┘  └──┘  └──┘
                ↑      ↑      ↑
  D    ─────┐       ┌────────┐
            └───────┘        └─────
  
  Q    ─────────┐       ┌────────┐
                └───────┘        └─
  
  Q captures D at the rising edge of CLK.
  
  Setup time (t_su): D must be stable BEFORE the clock edge
  Hold time (t_h):   D must remain stable AFTER the clock edge
  
  If violated → metastability (Q oscillates unpredictably)
```

### Lab Steps

1. Connect D input to a switch, CLK to 1 Hz clock
2. Observe: Q only changes on rising clock edges
3. Toggle switch between clocks — Q updates only at next edge
4. Build a T flip-flop: connect Q̅ back to D
5. Observe: Q toggles (divides clock frequency by 2)

### Knowledge Check

**Q1**: If you cascade 4 T flip-flops, what frequency division do you get?

> **A1**: Each T-FF divides by 2, so 4 stages = ÷16. A 16 MHz clock
> becomes 1 MHz after 4 stages. This is a ripple counter.

**Q2**: What is metastability?

> **A2**: When setup/hold times are violated, the flip-flop may enter
> an unstable intermediate state between 0 and 1. The output can
> oscillate or settle to an unpredictable value. This is a critical
> concern when crossing clock domains.

---

## Module 3: 4-Bit Binary Counter

### Objective

Build a 4-bit ripple counter, observe the binary counting sequence,
and decode specific states.

### Prerequisites

- 74HC393 (dual 4-bit binary counter) or 4× 74HC74
- 4 LEDs + resistors, clock source

### Counter operation

```
  CLK  ─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─
        └┘ └┘ └┘ └┘ └┘ └┘ └┘ └┘ └┘ └┘ └┘ └┘ └┘ └┘ └┘ └┘
  
  Q3 Q2 Q1 Q0  │ Decimal │ LEDs
  ─────────────┼─────────┼──────
   0  0  0  0  │    0    │ ○○○○
   0  0  0  1  │    1    │ ○○○●
   0  0  1  0  │    2    │ ○○●○
   0  0  1  1  │    3    │ ○○●●
   0  1  0  0  │    4    │ ○●○○
   ...         │         │
   1  1  1  1  │   15    │ ●●●●
   0  0  0  0  │    0    │ ○○○○  ← wraps around
```

### Lab Steps

1. Connect 74HC393 clock input to 1 Hz source
2. Connect Q0–Q3 to LEDs — observe binary counting
3. Speed up clock to observe counting visually
4. Add a NAND gate to decode state 1010 (decimal 10):
   - Feed Q3, NOT-Q2, Q1, NOT-Q0 into an AND gate
   - Output goes HIGH only at count = 10

### Knowledge Check

**Q1**: How many states does an N-bit counter have?

> **A1**: 2^N states. A 4-bit counter counts 0–15 (16 states).
> An 8-bit counter counts 0–255 (256 states).

**Q2**: What is the difference between a ripple counter and a synchronous counter?

> **A2**: In a ripple counter, each flip-flop clocks the next, causing
> cumulative propagation delay (glitches at high speeds). A synchronous
> counter clocks all flip-flops simultaneously — faster and glitch-free
> but uses more logic.

---

## Module 4: FPGA "Hello World"

### Objective

Implement a blinking LED on an FPGA using Verilog/VHDL, understanding
the synthesis-place-route flow.

### Prerequisites

- FPGA development board (Lattice iCE40, Xilinx Artix, or Intel MAX10)
- Toolchain: `yosys` + `nextpnr` + `icestorm` (open-source for iCE40)
  or Vivado (Xilinx) / Quartus (Intel)

### FPGA design flow

```
  1. Write HDL
     └── blink.v (Verilog) or blink.vhdl

  2. Synthesis (yosys / Vivado)
     └── RTL → gate-level netlist

  3. Place & Route (nextpnr / Vivado)
     └── Map gates to FPGA resources, route connections

  4. Bitstream generation
     └── Binary file for FPGA configuration

  5. Program FPGA
     └── iceprog / vivado / openFPGALoader
```

### Verilog blink example

```verilog
module blink (
    input  wire clk,    // 12 MHz on iCE40-UP5K
    output reg  led
);
    reg [23:0] counter = 0;  // 24-bit counter

    always @(posedge clk) begin
        counter <= counter + 1;
        led <= counter[23];   // MSB toggles every 2^23 / 12MHz ≈ 0.7s
    end
endmodule
```

### Build steps (iCE40 open-source flow)

```bash
# Synthesize
yosys -p "read_verilog blink.v; synth_ice40 -top blink -json blink.json"

# Place and route
nextpnr-ice40 --up5k --package sg48 --json blink.json \
  --pcf pins.pcf --asc blink.asc

# Generate bitstream
icepack blink.asc blink.bin

# Program the FPGA
iceprog blink.bin
```

### Review Flashcards

| Term | Definition |
|------|-----------|
| Truth table | Input/output mapping for combinational logic |
| NAND universal | Any function can be built from NAND gates alone |
| Setup time | Time data must be stable before clock edge |
| Hold time | Time data must be stable after clock edge |
| Metastability | Undefined output when timing is violated |
| Ripple counter | Cascaded flip-flops, each clocking the next |
| Synchronous counter | All flip-flops share the same clock |
| RTL | Register Transfer Level — abstraction of digital design |
| LUT | Look-Up Table — FPGA primitive implementing logic |
| Bitstream | Binary config file that programs the FPGA |

### Challenge

> Extend the FPGA blink to a 4-bit binary counter displayed on 4 LEDs.
> Add a push button to reset the counter to 0. Implement debouncing
> for the button (require stable input for 20 ms before acting).

---

## Cross-links

- Analog circuits → [../../00c_Analog_Circuits/lessons/analog_labs.md](../../00c_Analog_Circuits/lessons/analog_labs.md)
- CPU architecture → [../../02_CPU/lessons/cpu_labs.md](../../02_CPU/lessons/cpu_labs.md)
- Circuit board layout → [../../01_Circuit_Board/lessons/pcb_labs.md](../../01_Circuit_Board/lessons/pcb_labs.md)
