---
title: "Physics — Interactive Labs"
layer: 00_Physics
section: lessons
tags: [lesson, physics, lab, quiz, rc-circuit, ohm, diode, hands-on]
updated: 2026-05-21
---

# Physics — Interactive Labs

---

## Module 1: Ohm's Law Verification

### Objective

Measure voltage and current across a resistor to verify V = IR
experimentally and understand linearity in ohmic materials.

### Prerequisites

- Breadboard, jumper wires
- 5V DC power supply or USB breakout
- Multimeter (voltage + current modes)
- Resistors: 100 Ω, 220 Ω, 470 Ω, 1 kΩ

### Lab Steps

1. Connect 100 Ω resistor across the 5V supply on a breadboard
2. Measure voltage across the resistor (should read ~5V)
3. Break the circuit and insert the multimeter in series (current mode)
4. Record current: I = V / R = 5V / 100Ω = 50 mA expected
5. Repeat with 220 Ω, 470 Ω, 1 kΩ — record all readings in a table
6. Plot V vs I — verify the line passes through the origin

### Data table

```
  Resistor (Ω)   V_measured (V)   I_measured (mA)   I_calculated (mA)
  ────────────    ──────────────   ───────────────   ─────────────────
       100            5.00              50.0               50.0
       220            5.00              22.7               22.7
       470            5.00              10.6               10.6
      1000            5.00               5.0                5.0
```

### Knowledge Check

**Q1**: If you measure 3.3V across a 330 Ω resistor, what current flows?

> **A1**: I = V/R = 3.3V / 330Ω = 10 mA

**Q2**: A resistor passes 25 mA at 5V. What is its resistance?

> **A2**: R = V/I = 5V / 0.025A = 200 Ω

**Q3**: Why does a light bulb filament not obey Ohm's law at high temperatures?

> **A3**: The filament's resistance increases with temperature (positive
> temperature coefficient), making the V-I relationship nonlinear. Ohm's
> law applies only to materials with constant resistance.

---

## Module 2: RC Circuit Time Constant

### Objective

Build an RC circuit, measure the charging curve, and verify τ = RC.

### Prerequisites

- Oscilloscope (or DSO Nano / Analog Discovery)
- Signal generator (square wave, 100 Hz)
- Capacitor: 1 µF, Resistor: 10 kΩ

### Lab Steps

1. Connect R (10 kΩ) in series with C (1 µF) 
2. Drive the input with a 100 Hz square wave (0–5V)
3. Probe the voltage across the capacitor with the oscilloscope
4. Measure time to reach 63.2% of 5V (= 3.16V) — this is τ

```
  Expected τ = R × C = 10kΩ × 1µF = 10 ms

  Voltage across capacitor:
  V(t) = Vmax × (1 - e^(-t/τ))

  5V ┬─────────────────────────────── 
     │                    ╭──────────
     │                ╭───╯
     │            ╭───╯
  3.16V ┤ · · · ·╭─╯ · · · · · · · · · ← 63.2% = 1τ
     │        ╭──╯
     │    ╭───╯
     │ ╭──╯
  0V ┼─╯──────┬──────┬──────┬──────▸ t
     0      τ=10ms  2τ     3τ    4τ
              63%   86%    95%   98%
```

5. Repeat with different R or C values; verify τ changes proportionally

### Knowledge Check

**Q1**: With R = 4.7 kΩ and C = 10 µF, what is τ?

> **A1**: τ = 4.7kΩ × 10µF = 47 ms

**Q2**: After 5τ, what percentage of the final voltage has the capacitor reached?

> **A2**: 1 - e^(-5) ≈ 99.3% — effectively fully charged.

### Review Flashcards

| Term | Definition |
|------|-----------|
| Time constant (τ) | R × C — time to reach 63.2% of final value |
| Charging curve | V(t) = Vmax(1 - e^(-t/τ)) |
| Discharging curve | V(t) = V₀ × e^(-t/τ) |
| Cutoff frequency | f_c = 1/(2πRC) — where the RC acts as a filter |

---

## Module 3: Diode I-V Curve

### Objective

Trace the I-V characteristic of a silicon diode to understand forward
voltage drop, reverse blocking, and the exponential relationship.

### Prerequisites

- Silicon diode (1N4148 or 1N4007)
- Variable DC supply (0–5V) or potentiometer voltage divider
- Multimeter (V + A), breadboard

### Lab Steps

1. Connect diode in forward bias: anode → supply, cathode → resistor → GND
2. Use a 1 kΩ current-limiting resistor in series
3. Sweep supply voltage from 0V to 2V in 0.1V steps
4. At each step, measure V_diode (across diode) and I (current through resistor)
5. Plot I vs V_diode

```
  I (mA)
  30 ┤                              ╱
     │                            ╱
  20 ┤                          ╱
     │                        ╱
  10 ┤                     ╱╱
     │                  ╱╱
   1 ┤              ╱╱╱
     │          ╱╱╱╱
  0  ┼────────╱───────────────────▸ V_diode
     0    0.3   0.5  0.6  0.7  0.8
                      ↑
               Forward voltage (Vf)
               ~0.6V for silicon
               ~0.3V for Schottky
               ~2.0V for LED
```

### Knowledge Check

**Q1**: Why is there almost no current below 0.5V for a silicon diode?

> **A1**: The diode's depletion region acts as a barrier. Below the
> threshold voltage (~0.6V for Si), the electric field isn't strong enough
> to push significant current through the junction.

**Q2**: What happens if you reverse the diode polarity?

> **A2**: The diode blocks current (reverse bias). Only a tiny leakage
> current (nanoamps) flows until the breakdown voltage is reached.

### Challenge

> Connect an LED (with appropriate current-limiting resistor) and
> measure its forward voltage. Compare: red LED (~1.8V), green (~2.2V),
> blue (~3.0V). Explain why color relates to forward voltage using the
> energy-bandgap relationship: E = hf = hc/λ.

---

## Cross-links

- Electronic devices → [../../00b_Devices/lessons/device_labs.md](../../00b_Devices/lessons/device_labs.md)
- Analog circuits → [../../00c_Analog_Circuits/lessons/analog_labs.md](../../00c_Analog_Circuits/lessons/analog_labs.md)
- Physics topics → [../topics/INDEX.md](../topics/INDEX.md)
