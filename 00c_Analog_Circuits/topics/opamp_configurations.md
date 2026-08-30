---
title: "Op-Amp Configurations — Reference Diagrams"
layer: 00c_Analog_Circuits
tags: [opamp, analog, inverting, non-inverting, buffer, differential, filter]
updated: 2026-05-20
---

# Op-Amp Configurations — Reference Diagrams

> The ideal op-amp: infinite gain, infinite input impedance, zero output
> impedance, infinite bandwidth. Real op-amps approximate these.

---

## Ideal op-amp symbol

```
         V+
          │
     ┌────┴────┐
  +  │         │
  ───┤    ╲    ├─── Vout
  ───┤    ╱    │
  -  │         │
     └────┬────┘
          │
         V-

  Rules (ideal):
  1. No current into inputs (I+ = I- = 0)
  2. V+ = V- (virtual short with negative feedback)
```

---

## 1. Inverting amplifier

```
           Rf
     ┌────┤├────┐
     │          │
     │   ┌──┐  │
  Vin──R1──┤- ╲ │
           │   ╲├──── Vout
           │   ╱│
      GND──┤+ ╱ │
           └──┘
```

**Gain:** `Vout = -(Rf / R1) × Vin`

- Input impedance ≈ R1 (virtual ground at inverting input).
- Phase inverted (180°).

---

## 2. Non-inverting amplifier

```
                Rf
          ┌────┤├────┐
          │          │
          │   ┌──┐   │
          ├───┤- ╲   │
          │   │   ╲──┴── Vout
     R1   │   │   ╱
  GND──┤├─┘   │+ ╱
              └──┘
               │
             Vin
```

**Gain:** `Vout = (1 + Rf/R1) × Vin`

- Very high input impedance (signal goes to non-inverting input).
- No phase inversion.
- Gain ≥ 1 always.

---

## 3. Voltage follower (unity-gain buffer)

```
           ┌──────────┐
           │   ┌──┐   │
           └───┤- ╲   │
               │   ╲──┴── Vout = Vin
         Vin───┤+ ╱
               └──┘
```

**Gain:** `Vout = Vin` (gain = 1)

- Impedance transformer: high-Z input, low-Z output.
- Use: buffer between high-impedance source and low-impedance load.

---

## 4. Summing amplifier (inverting)

```
            Rf
      ┌────┤├────┐
      │          │
  V1──R1──┐     │
           │ ┌──┐│
  V2──R2──┤─┤- ╲││
           │ │   ╲├── Vout
  V3──R3──┘ │   ╱│
        GND─┤+ ╱ │
             └──┘
```

**Output:** `Vout = -Rf × (V1/R1 + V2/R2 + V3/R3)`

If R1 = R2 = R3 = R: `Vout = -(Rf/R) × (V1 + V2 + V3)`

- Used in audio mixing, DAC R-2R ladders.

---

## 5. Differential amplifier

```
              Rf
         ┌───┤├───┐
         │         │
  V1──R1─┤  ┌──┐  │
         └──┤- ╲  │
            │   ╲─┴── Vout
  V2──R2─┬──┤+ ╱
         │  └──┘
         R3
         │
        GND
```

**Output (when R1=R2=R, Rf=R3=Rg):** `Vout = (Rg/R) × (V2 - V1)`

- Rejects common-mode signals (CMRR).
- Foundation of instrumentation amplifiers.

---

## 6. Instrumentation amplifier (3 op-amp)

```
               R
  V1 ──┤+ A1 ├─┬──R──┤- A3 ├─── Vout
        └─┬──┘ │     │     │
          │    Rg     R     │
          │    │      │     │
  V2 ──┤+ A2 ├─┘  GND┤+ A3 ├
        └─┬──┘         └──┘
          │
         R

  Gain = (1 + 2R/Rg) × (Rf/R1)
  (single-resistor gain set via Rg)
```

- Very high CMRR and input impedance.
- Used for sensor signal conditioning (strain gauges, thermocouples, biomedical).

---

## 7. Integrator

```
            C
      ┌────┤┤────┐
      │          │
  Vin──R──┤- ╲  │
          │   ╲──┘── Vout = -(1/RC) ∫ Vin dt
     GND──┤+ ╱
          └──┘
```

---

## 8. Differentiator

```
            R
      ┌────┤├────┐
      │          │
  Vin──C──┤- ╲  │
          │   ╲──┘── Vout = -RC × dVin/dt
     GND──┤+ ╱
          └──┘
```

---

## Active filters (1st-order)

### Low-pass (inverting)

```
          R2 ── C
      ┌──┤├──┤┤──┐    (R2 ∥ C in feedback)
      │           │
  Vin──R1──┤- ╲  │
           │   ╲──┘── Vout
      GND──┤+ ╱        Cutoff: fc = 1/(2π R2 C)
           └──┘         DC gain: -R2/R1
```

### High-pass (inverting)

```
           R2
      ┌───┤├───┐
      │         │
  Vin──C──R1──┤- ╲ │
              │   ╲─┘── Vout
         GND──┤+ ╱      Cutoff: fc = 1/(2π R1 C)
              └──┘       HF gain: -R2/R1
```

---

## Real op-amp non-idealities

| Parameter | Ideal | Real (typical) |
|-----------|-------|----------------|
| Open-loop gain | ∞ | 10⁵ – 10⁶ (100–120 dB) |
| Input impedance | ∞ | 10⁶ – 10¹² Ω |
| Output impedance | 0 | 10 – 100 Ω |
| Bandwidth (GBW) | ∞ | 1 – 100 MHz |
| Input offset voltage | 0 | 0.1 – 10 mV |
| Input bias current | 0 | pA – nA (CMOS), nA – µA (BJT) |
| Slew rate | ∞ | 0.5 – 100 V/µs |
| CMRR | ∞ | 80 – 120 dB |
| PSRR | ∞ | 80 – 100 dB |

---

## Cross-links

- MOSFET (op-amp building block) → [../../00b_Devices/topics/mosfet_cross_section.md](../../00b_Devices/topics/mosfet_cross_section.md)
- Digital circuits → [../../00d_Digital_Circuits/topics/logic_gates.md](../../00d_Digital_Circuits/topics/logic_gates.md)
- ADC/DAC → [INDEX.md](INDEX.md)
- Embedded analog → [../../18_Embedded_Systems/topics/INDEX.md](../../18_Embedded_Systems/topics/INDEX.md)
