---
title: "Electronic Devices — Interactive Labs"
layer: 00b_Devices
section: lessons
tags: [lesson, mosfet, transistor, led, devices, lab, quiz, hands-on]
updated: 2026-05-21
---

# Electronic Devices — Interactive Labs

---

## Module 1: MOSFET as a Switch

### Objective

Use an N-channel MOSFET to switch a load (LED or motor) on and off
from a microcontroller GPIO pin, understanding V_GS threshold.

### Prerequisites

- N-channel MOSFET (IRLZ44N or 2N7000 for logic-level)
- LED + 220 Ω resistor, or small DC motor
- 5V supply, Arduino/RPi GPIO (3.3V or 5V logic)
- Multimeter

### Circuit

```
  VCC (5V) ───────┬───────────────┐
                  │               │
                 LED            Load
                  │           (motor)
                220Ω             │
                  │               │
                  └───┬───────────┘
                      │
                    Drain
                      │
  GPIO ──── 10kΩ ── Gate    MOSFET (N-ch)
                      │
                   Source
                      │
                    GND
  
  10kΩ gate resistor: limits current from GPIO
  Pull-down (optional): 100kΩ gate-to-GND keeps MOSFET off when GPIO floats
```

### Lab Steps

1. Wire the circuit above with LED + 220 Ω as the load
2. Connect Gate to GND — LED should be OFF (V_GS = 0V)
3. Connect Gate to 3.3V — LED turns ON (V_GS > V_th)
4. Measure V_DS when ON: should be near 0V (millivolts = low R_DS(on))
5. Connect Gate to GPIO pin, toggle with code:

```python
# MicroPython / CircuitPython
import machine, time
gate = machine.Pin(2, machine.Pin.OUT)
while True:
    gate.on()     # MOSFET ON → LED ON
    time.sleep(1)
    gate.off()    # MOSFET OFF → LED OFF
    time.sleep(1)
```

### Knowledge Check

**Q1**: What happens if V_GS is below V_th but above 0V?

> **A1**: The MOSFET is in the subthreshold region — very little current
> flows (nanoamps to microamps). The device is effectively "off" for
> switching purposes.

**Q2**: Why use a MOSFET instead of connecting the load directly to GPIO?

> **A2**: GPIO pins can only source/sink ~20 mA. A MOSFET can switch
> amps of current while the GPIO only needs to charge the gate capacitance
> (essentially zero steady-state current).

**Q3**: What is R_DS(on) and why does it matter?

> **A3**: The drain-source on-resistance when fully enhanced. Lower R_DS(on)
> means less power wasted as heat in the MOSFET. For the IRLZ44N, R_DS(on)
> ≈ 22 mΩ at V_GS = 5V.

---

## Module 2: BJT LED Driver with Current Control

### Objective

Use an NPN transistor (2N2222) to drive an LED with controlled current,
understanding base current, collector current, and β (hFE).

### Prerequisites

- NPN transistor (2N2222 or BC547)
- LED, resistors: 220 Ω, 1 kΩ, 10 kΩ
- 5V supply, multimeter

### Circuit

```
  VCC (5V) ──── 220Ω ──── LED ──── Collector
                                       │
  GPIO ──── 1kΩ ──── Base         2N2222 (NPN)
                       │
                    Emitter
                       │
                     GND
  
  I_C = β × I_B
  β ≈ 100-300 for 2N2222
  
  R_base = (V_GPIO - V_BE) / I_B
  V_BE ≈ 0.7V for silicon BJT
  
  If GPIO = 5V, R_base = 1kΩ:
    I_B = (5V - 0.7V) / 1kΩ = 4.3 mA
    I_C(max) = β × I_B = 100 × 4.3 = 430 mA (saturated)
    Actual I_C limited by LED + 220Ω ≈ 15 mA
```

### Lab Steps

1. Build the circuit with 1 kΩ base resistor
2. Apply 5V to base through R_base — LED lights up
3. Measure I_B (current into base) and I_C (current through LED)
4. Calculate β = I_C / I_B
5. Try different R_base values (10 kΩ, 47 kΩ) — observe LED brightness
6. At some point, I_B is too low to saturate → LED dims

### Knowledge Check

**Q1**: With β = 150 and I_B = 0.1 mA, what is the max I_C?

> **A1**: I_C = β × I_B = 150 × 0.1 mA = 15 mA (if not limited by load)

**Q2**: What is the difference between saturation and active mode?

> **A2**: In saturation, both junctions are forward biased, V_CE ≈ 0.2V,
> and the transistor acts as a closed switch. In active mode, only the
> base-emitter junction is forward biased, and I_C is proportional to I_B.

### Review Flashcards

| Term | Definition |
|------|-----------|
| V_GS(th) | Gate-source threshold voltage for MOSFET turn-on |
| R_DS(on) | Drain-source resistance when MOSFET is fully on |
| β (hFE) | BJT current gain: I_C / I_B |
| V_BE | Base-emitter voltage (~0.7V for silicon BJT) |
| Saturation | BJT fully on: V_CE ≈ 0.2V, acts as closed switch |
| Enhancement mode | MOSFET type that is OFF with V_GS = 0 (most common) |

### Challenge

> Build an H-bridge using 4 MOSFETs (2 N-channel + 2 P-channel) to
> control a DC motor's direction. Drive it from two GPIO pins. Verify
> forward, reverse, and brake modes. Draw the current path for each mode.

---

## Cross-links

- Physics fundamentals → [../../00_Physics/lessons/physics_labs.md](../../00_Physics/lessons/physics_labs.md)
- Analog circuits → [../../00c_Analog_Circuits/lessons/analog_labs.md](../../00c_Analog_Circuits/lessons/analog_labs.md)
- Digital circuits → [../../00d_Digital_Circuits/lessons/digital_labs.md](../../00d_Digital_Circuits/lessons/digital_labs.md)
