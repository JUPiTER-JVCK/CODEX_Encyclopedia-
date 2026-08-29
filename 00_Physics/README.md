# 00 — Physics (Foundations)

> The base layer beneath everything in the codex. Charges, fields, photons,
> quanta, thermodynamics — the rules that semiconductors, transistors, and
> ultimately CPUs are obeying when they compute.

## At a glance

| Field | Value |
|-------|-------|
| Description | Physical laws underlying electronic computation |
| Languages | Math (calculus, linear algebra), MATLAB/Python for sim |
| Medium / Interface | Reality |
| Example | Electron drift in a doped silicon channel under an applied gate voltage |
| Adjacent | ↑ [00b_Devices](../00b_Devices/) |

## What lives here

- **Classical electromagnetism** — Maxwell's equations, fields, waves, transmission lines
- **Solid-state physics** — band theory, doping, p-n junctions, carrier transport
- **Quantum mechanics** (just the parts you need) — tunneling, energy bands, photon emission
- **Thermodynamics & statistical mechanics** — kT, Boltzmann, Johnson-Nyquist noise
- **Optics & photonics** — fiber propagation, photodetectors, lasers
- **Information theory & physical limits** — Landauer limit, Shannon capacity

## Sub-sections

- [references/](references/INDEX.md) — Griffiths, Kittel, Sze, Feynman
- [lessons/](lessons/INDEX.md) — from E&M → semiconductor physics → quantum tunneling
- [languages/](languages/INDEX.md) — math + simulation languages
- [man_pages/](man_pages/INDEX.md) — SPICE, COMSOL, FDTD tools
- [topics/](topics/INDEX.md) — concepts mapped to what they enable in hardware
- [protocols/](protocols/INDEX.md) — N/A here (physics has laws, not protocols) — see units/constants

## Cross-references
- The first place these laws become a component → [00b_Devices](../00b_Devices/)
- Where signals become information → [00c_Analog_Circuits](../00c_Analog_Circuits/)
- RF propagation in air → [16_RF_Wireless](../16_RF_Wireless/topics/INDEX.md)
- Cryptographic randomness from physical sources → [14_Security/topics](../14_Security/topics/INDEX.md)
- Quantum crypto (v1 reference: `~/Documents/Information_Tech/- Security : OSINT/Encryption/quantum/`)

## Layer ladder (per image reference)

This layer is the bottom rung of the *fine-grained* hardware ladder added in v2.1:

```
... Application Software → Operating Systems → Architecture → Microarchitecture
        → Logic → Digital Circuits → Analog Circuits → Devices → PHYSICS  ← you are here
```
