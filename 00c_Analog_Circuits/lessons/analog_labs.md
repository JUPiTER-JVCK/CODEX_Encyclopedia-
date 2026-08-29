---
title: "Analog Circuits — Interactive Labs"
layer: 00c_Analog_Circuits
section: lessons
tags: [lesson, opamp, filter, adc, analog, lab, quiz, hands-on]
updated: 2026-05-21
---

# Analog Circuits — Interactive Labs

---

## Module 1: Op-Amp Inverting Amplifier

### Objective

Build an inverting amplifier with a target gain of -10, measure the
actual gain, and understand virtual ground and feedback.

### Prerequisites

- Op-amp IC (LM741 or TL072)
- Resistors: 1 kΩ (R_in), 10 kΩ (R_f)
- Dual supply: ±12V (or single supply with virtual ground)
- Signal generator (1 kHz sine, 100 mV p-p)
- Oscilloscope (2 channels)

### Circuit

```
           R_f (10kΩ)
     ┌────/\/\/────┐
     │              │
     │    ┌───┐     │
  Vin ──/\/\/──┤ - │     │
       R_in    │   ├─────┴──── Vout
      (1kΩ)   ┤ + │
              └─┬─┘
                │
              GND
  
  Gain = -R_f / R_in = -10kΩ / 1kΩ = -10
  
  Input: 100 mV p-p @ 1 kHz
  Expected output: 1V p-p, inverted (180° phase shift)
```

### Lab Steps

1. Build the circuit on a breadboard
2. Connect Ch1 to input, Ch2 to output on oscilloscope
3. Apply 100 mV p-p sine wave at 1 kHz
4. Measure output amplitude — should be ~1V p-p
5. Verify 180° phase inversion
6. Increase input until output clips at ±(V_supply - 1V) — this is saturation
7. Sweep frequency from 100 Hz to 1 MHz — find the -3 dB bandwidth

### Knowledge Check

**Q1**: If R_f = 47 kΩ and R_in = 4.7 kΩ, what is the gain?

> **A1**: Gain = -R_f/R_in = -47k/4.7k = -10 (same gain, different impedance)

**Q2**: What is the "virtual ground" at the inverting input?

> **A2**: Due to negative feedback and very high open-loop gain, the op-amp
> drives its output to keep both inputs at the same voltage. Since the
> non-inverting input is at GND, the inverting input is also ≈ 0V — the
> "virtual ground."

**Q3**: What happens if you remove R_f (open the feedback loop)?

> **A3**: The op-amp operates in open-loop with gain ~100,000+. Any tiny
> input difference saturates the output to +V_supply or -V_supply. This
> is comparator behavior.

---

## Module 2: Active Low-Pass Filter

### Objective

Build a first-order active low-pass filter, measure the frequency
response, and identify the -3 dB cutoff frequency.

### Prerequisites

- Op-amp (TL072), R = 10 kΩ, C = 10 nF
- Signal generator, oscilloscope

### Circuit

```
           R_f (10kΩ)     C (10nF)
     ┌────/\/\/────┬───||───┐
     │              │         │
     │    ┌───┐     │         │
  Vin ──/\/\/──┤ - │         │
       R_in    │   ├─────────┴── Vout
      (10kΩ)  ┤ + │
              └─┬─┘
                │
              GND
  
  f_cutoff = 1 / (2π × R_f × C) = 1 / (2π × 10k × 10n) ≈ 1.59 kHz
  DC gain = -R_f / R_in = -1 (unity, inverted)
  Roll-off: -20 dB/decade above f_cutoff
```

### Lab Steps

1. Build the circuit
2. Apply 100 mV sine wave, sweep frequency: 10 Hz → 100 kHz
3. At each frequency, record V_out amplitude
4. Calculate gain in dB: 20 × log₁₀(V_out / V_in)
5. Plot gain (dB) vs frequency (log scale) — Bode plot

```
  Gain (dB)
    0 ┬─────────────╲
      │              ╲
   -3 ┤ · · · · · · · ╲· · · · · · · ← cutoff (f_c ≈ 1.59 kHz)
      │                 ╲
  -20 ┤                   ╲  -20 dB/decade
      │                     ╲
  -40 ┤                       ╲
      ┼──────┬──────┬──────┬──────▸ f (Hz)
      10    100    1k    10k   100k
```

### Knowledge Check

**Q1**: How would you change the cutoff frequency to 500 Hz?

> **A1**: Increase R_f × C. For example, R_f = 33 kΩ, C = 10 nF gives
> f_c = 1/(2π×33k×10n) ≈ 482 Hz. Or keep R_f = 10 kΩ and use C = 33 nF.

**Q2**: What is the roll-off rate of a second-order filter?

> **A2**: -40 dB/decade (vs. -20 dB/decade for first-order). Each
> additional RC stage adds another -20 dB/decade.

---

## Module 3: ADC Sampling & Aliasing

### Objective

Demonstrate Nyquist sampling by digitizing a sine wave at different
sample rates and observing aliasing.

### Prerequisites

- Arduino (10-bit ADC, ~9.6 kHz max sampling)
- Signal generator (sine wave, 100 Hz - 10 kHz)
- Serial plotter or Python + matplotlib

### Lab Steps

1. Feed a 1 kHz sine wave (0–3.3V) into Arduino analog pin A0
2. Sample at different rates by adjusting delay between reads:

```cpp
// Arduino sketch
void setup() { Serial.begin(115200); }
void loop() {
    Serial.println(analogRead(A0));
    delayMicroseconds(50);  // ~20 kHz sampling → OK for 1 kHz
}
```

3. Plot the output — should see clean 1 kHz sine
4. Increase input frequency to 4 kHz, keep 9.6 kHz sampling
5. Increase to 5 kHz (above Nyquist = fs/2 = 4.8 kHz)
6. Observe aliasing: the captured signal appears at a false lower frequency

```
  Nyquist theorem:
    f_sample ≥ 2 × f_signal     (minimum to avoid aliasing)
  
  Example:
    f_sample = 9.6 kHz → max signal = 4.8 kHz
    Input 5 kHz at 9.6 kHz sample rate:
      alias = |f_sample - f_signal| = |9600 - 5000| = 4600 Hz
      → You see 4.6 kHz instead of 5 kHz!
```

### Knowledge Check

**Q1**: Audio CDs sample at 44.1 kHz. What is the maximum frequency they can capture?

> **A1**: 44.1 / 2 = 22.05 kHz (just above human hearing range of ~20 kHz)

**Q2**: What is an anti-aliasing filter and where does it go?

> **A2**: A low-pass filter placed before the ADC that removes frequencies
> above f_sample/2, preventing them from aliasing into the passband.

### Review Flashcards

| Term | Definition |
|------|-----------|
| Inverting amplifier | Gain = -R_f / R_in, 180° phase shift |
| Virtual ground | Inverting input held at ~0V by negative feedback |
| Cutoff frequency | f_c = 1/(2πRC) — where gain drops 3 dB |
| Bode plot | Gain (dB) vs frequency (log) graph |
| Nyquist rate | Minimum sample rate = 2 × max signal frequency |
| Aliasing | False low-frequency artifact from undersampling |
| Quantization | ADC resolution — 10-bit = 1024 levels |

### Challenge

> Build a second-order Sallen-Key low-pass filter (two RC stages + op-amp).
> Measure its frequency response and compare the roll-off slope to the
> first-order filter from Module 2. Does it achieve -40 dB/decade?

---

## Cross-links

- Physics fundamentals → [../../00_Physics/lessons/physics_labs.md](../../00_Physics/lessons/physics_labs.md)
- Digital circuits → [../../00d_Digital_Circuits/lessons/digital_labs.md](../../00d_Digital_Circuits/lessons/digital_labs.md)
- Device labs → [../../00b_Devices/lessons/device_labs.md](../../00b_Devices/lessons/device_labs.md)
