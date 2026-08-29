# Analog Circuits — Standards & Specs

Analog deals with *measurements* more than *protocols*. The "specs" here are
the standardized characterizations and audio/video formats that sit on top of
analog signals.

## Op-amp / amplifier specs (industry-standard parameters)
| Parameter | Unit | Means |
|-----------|------|-------|
| GBW | MHz | Gain-bandwidth product |
| SR | V/μs | Slew rate |
| V_OS | mV / μV | Input offset voltage |
| I_B / I_OS | nA / pA | Input bias / offset current |
| CMRR | dB | Common-mode rejection ratio |
| PSRR | dB | Power-supply rejection ratio |
| THD+N | % or dB | Total harmonic distortion + noise |
| e_n | nV/√Hz | Input voltage noise density |
| i_n | pA/√Hz | Input current noise density |

## Data-converter specs
| Parameter | Unit | Means |
|-----------|------|-------|
| INL / DNL | LSB | Integral / differential nonlinearity |
| SNR | dB | Signal-to-noise ratio |
| SFDR | dBc | Spurious-free dynamic range |
| ENOB | bits | Effective number of bits |
| THD | dB | Total harmonic distortion |
| Settling time | ns | To 0.5 LSB |

## Audio standards (analog domain)
- **dBu, dBV, dBV(A)** — voltage references
- **+4 dBu pro** vs **−10 dBV consumer** line level
- **THX**, **Dolby**, **DSD (1-bit ΣΔ)**, **PCM** (digital but tightly linked to ADC/DAC)

## Power-supply standards / safety
- **ATX 12VO / ATX 3.x** — PC PSU specs (cross-link [01](../../01_Circuit_Board/))
- **USB-PD (USB-IF)** — Power Delivery negotiation
- **Qi (WPC)** — wireless power
- **IEC 60950-1 / 62368-1** — equipment safety
- **EN 55032/55035, FCC Part 15 Subpart B** — EMC
- **80 PLUS** — efficiency certification
- **Energy Star**, **DOE Level VI** — external PSU efficiency

## RF analog (cross-link)
- **Touchstone .sNp** for S-parameter exchange
- **VSWR**, **Return Loss**, **NF**, **IP3/IP2/P1dB** — RF metrics

## Cross-link
- Digital transport of digitized audio/video → [13_Network_Application/protocols](../../Network/13_Network_Application/protocols/INDEX.md)
- Power & signal integrity → [01_Circuit_Board/topics](../../01_Circuit_Board/topics/INDEX.md)
