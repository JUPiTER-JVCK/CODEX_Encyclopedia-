# Physics — Laws, Units, Constants

Physics has *laws*, not protocols. This section collects the standard formal
statements you'll cross-reference everywhere.

## SI base units
| Quantity | Unit | Symbol |
|----------|------|--------|
| Time | second | s |
| Length | metre | m |
| Mass | kilogram | kg |
| Electric current | ampere | A |
| Temperature | kelvin | K |
| Amount of substance | mole | mol |
| Luminous intensity | candela | cd |

## SI derived units (selected)
| Quantity | Unit | Equivalent |
|----------|------|------------|
| Force | newton (N) | kg·m/s² |
| Energy | joule (J) | N·m |
| Power | watt (W) | J/s |
| Charge | coulomb (C) | A·s |
| Voltage | volt (V) | J/C |
| Resistance | ohm (Ω) | V/A |
| Capacitance | farad (F) | C/V |
| Inductance | henry (H) | V·s/A |
| Frequency | hertz (Hz) | 1/s |
| Magnetic flux | weber (Wb) | V·s |
| Magnetic flux density | tesla (T) | Wb/m² |

## Key laws
- **Ohm's law** — `V = IR`
- **Joule heating** — `P = I²R = V²/R`
- **Kirchhoff's current law (KCL)** — Σ I = 0 at a node
- **Kirchhoff's voltage law (KVL)** — Σ V = 0 around a loop
- **Capacitor I-V** — `I = C dV/dt`
- **Inductor I-V** — `V = L dI/dt`
- **Maxwell's equations** (vacuum, differential form):
  - ∇·E = ρ/ε₀
  - ∇·B = 0
  - ∇×E = −∂B/∂t
  - ∇×B = μ₀ε₀ ∂E/∂t + μ₀ J
- **Lorentz force** — `F = q(E + v×B)`
- **Planck-Einstein** — `E = hν`
- **Schrödinger (time-dependent)** — `iħ ∂Ψ/∂t = ĤΨ`

## Standards bodies
- **BIPM** — Bureau International des Poids et Mesures (SI custodian)
- **NIST** — US measurement standards
- **CODATA** — fundamental constants

See [man_pages/](../man_pages/INDEX.md) for numeric constants.
