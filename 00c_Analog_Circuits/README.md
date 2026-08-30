# 00c — Analog Circuits

> Continuous-valued signals shaped, amplified, filtered, converted. The world
> is analog; digital is a convention enforced by clean voltage thresholds.

## At a glance

| Field | Value |
|-------|-------|
| Description | Circuits whose signals are continuous in voltage/current and time |
| Languages | SPICE, MATLAB/Simulink, Verilog-AMS |
| Medium / Interface | Voltage / current / charge waveforms |
| Example | An op-amp instrumentation amplifier conditions a thermistor for an ADC |
| Adjacent | ↓ [00b_Devices](../00b_Devices/), ↑ [00d_Digital_Circuits](../00d_Digital_Circuits/), [01_Circuit_Board](../01_Circuit_Board/) |

## What lives here
- **Amplifiers** — op-amp configurations, instrumentation amps, audio, RF LNAs / PAs
- **Filters** — passive (RC/LC), active (Sallen-Key, MFB), switched-capacitor
- **Oscillators & PLLs** — Pierce, Colpitts, VCO + PLL synthesis
- **Voltage / current references** — bandgap, Zener, Vbe-based
- **Regulators** — LDO, switching (buck/boost/buck-boost/flyback/forward)
- **ADC / DAC** — flash, SAR, ΣΔ, pipeline, R-2R, current-steering
- **Comparators, sample-and-hold, mixers, modulators/demodulators**
- **Sensor interfaces** — Wheatstone bridge, current sense, capacitive touch

## Sub-sections
- [references/](references/INDEX.md)
- [lessons/](lessons/INDEX.md)
- [languages/](languages/INDEX.md)
- [man_pages/](man_pages/INDEX.md)
- [topics/](topics/INDEX.md)
- [protocols/](protocols/INDEX.md)

## Cross-references
- Where the analog signal eventually becomes a 0/1 → [00d_Digital_Circuits](../00d_Digital_Circuits/)
- RF analog front-ends → [16_RF_Wireless](../16_RF_Wireless/)
- DSP after digitization → [00d](../00d_Digital_Circuits/topics/INDEX.md) + [02_CPU](../02_CPU/topics/INDEX.md) SIMD
