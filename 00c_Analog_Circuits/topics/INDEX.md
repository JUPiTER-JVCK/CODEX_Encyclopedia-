# Analog Circuits — Topics

## Dedicated topic files

| Topic | File |
|-------|------|
| Op-Amp Configurations | [opamp_configurations.md](opamp_configurations.md) — inverting, non-inverting, buffer, summing, differential, instrumentation, integrator, filters |

---

## Op-amps
- **Ideal op-amp rules** — infinite gain, infinite Z_in, zero Z_out
- **Real-world** — finite GBW, slew rate, input offset, input bias/offset current, CMRR, PSRR
- **Standard configurations** — inverting, non-inverting, buffer, summer, differential, integrator, differentiator, transimpedance
- **Stability** — phase margin, gain margin, dominant-pole compensation
- **Instrumentation amps**, **chopper amps**, **autozero**
- **Rail-to-rail input/output**

## Filters
- **Topologies** — Butterworth, Chebyshev (I/II), Bessel, elliptic
- **Realizations** — passive RC/LC, Sallen-Key, MFB, state-variable, biquad, switched-capacitor
- **Notch / band-stop**
- **Filter design from spec** — order from atten + transition; pole-zero placement

## Voltage / current references
- **Bandgap reference** — Vbe + ΔVbe; temp coefficient
- **Zener-based**, **XFET**, **floating-gate**
- **Precision spec** — initial accuracy, TC (ppm/°C), drift, noise

## Power management
- **Linear regulators (LDO)** — dropout, PSRR, transient response, stability with output cap
- **Switching converters**:
  - **Topology**: buck, boost, buck-boost, SEPIC, Ćuk, flyback, forward, push-pull, half/full bridge
  - **Mode**: CCM vs DCM, PWM vs PFM
  - **Control**: voltage-mode, current-mode, COT, hysteretic
  - **Loop compensation** — Type II/III, transfer functions, bode plots
- **Charge pumps**
- **Energy harvesting** — TEG, PV, vibration, RF
- **Battery management** — Li-ion charging stages (CC/CV), gas gauges, protection

## Oscillators & PLLs
- **Crystal oscillators** — Pierce, Colpitts, Hartley
- **RC oscillators** — relaxation, ring
- **VCO** — varactor-tuned LC, ring
- **PLL** — phase detector, charge pump, loop filter, divider
- **Frequency synthesis** — integer-N, fractional-N
- **Jitter & phase noise**

## Data converters
- **ADC architectures**:
  - **Flash** — fast, low res, high power
  - **SAR** — balanced, 8–18 bit
  - **Pipeline** — high speed, medium res
  - **ΣΔ (Sigma-Delta)** — high res, oversampling
  - **Dual-slope integrating** — high accuracy, slow (DMMs)
- **DAC architectures** — R-2R ladder, current-steering, segmented, ΣΔ
- **Key specs** — INL, DNL, SNR, SFDR, ENOB, THD, settling time
- **Sampling theory** — Nyquist, aliasing, oversampling, dithering, decimation

## Signal conditioning
- **Wheatstone bridge** — strain, RTDs
- **Current sense** — high-side vs low-side, shunt + amp
- **Thermocouple** — cold-junction compensation, linearization
- **Capacitive touch** — self / mutual cap
- **Photodiode** — transimpedance amp, dark current

## Audio
- **Class A / AB / B / D** amps
- **THD, IMD, SNR, dynamic range**
- **Codec ICs** — combined ADC+DAC

## RF analog (cross-link)
- **LNA**, **mixer**, **PA**, **VCO**, **filter**, **balun** → [16_RF_Wireless/topics](../../16_RF_Wireless/topics/INDEX.md)

## Mixed-signal layout pitfalls
- **Ground plane partitioning** (when not to split)
- **Star vs Kelvin connections**
- **Bypassing** — bulk + HF caps, where to place
- **Return-current paths** — under high-speed traces
- **Crosstalk** — guard rings/traces

## Cross-link
- Components → [00b_Devices](../../00b_Devices/)
- The other side of A/D boundary → [00d_Digital_Circuits](../../00d_Digital_Circuits/)
