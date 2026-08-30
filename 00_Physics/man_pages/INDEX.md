# Physics — Tools

| Tool | Purpose |
|------|---------|
| `ngspice` | Open-source SPICE circuit simulator |
| `xyce` | Sandia parallel SPICE-class simulator |
| `gnucap` | GNU Circuit Analysis Package |
| `qucs-s` | Qt-based SPICE GUI |
| `meep` | Open FDTD electromagnetics (MIT) |
| `lumerical` (commercial) | Photonics FDTD |
| `comsol` (commercial) | Multiphysics FEM |
| `gmsh` | Mesher used by many FEM codes |
| `elmer` | Open-source multiphysics FEM |
| `python3 -c "import sympy"` | Symbolic math |
| `qiskit` / `cirq` / `pennylane` | Quantum SDK CLIs |
| `units` | Unit conversion (GNU) |
| `octave` | Open MATLAB-compatible |

## Physical constants quick-ref
| Symbol | Name | Value |
|--------|------|-------|
| `c` | Speed of light | 2.998 × 10⁸ m/s |
| `e` | Elementary charge | 1.602 × 10⁻¹⁹ C |
| `h` | Planck | 6.626 × 10⁻³⁴ J·s |
| `ħ = h/2π` | Reduced Planck | 1.055 × 10⁻³⁴ J·s |
| `k` | Boltzmann | 1.381 × 10⁻²³ J/K |
| `kT @ 300 K` | Thermal energy | 4.14 × 10⁻²¹ J ≈ 25.85 meV |
| `kT/q @ 300 K` | Thermal voltage Vₜ | 25.85 mV |
| `ε₀` | Vacuum permittivity | 8.854 × 10⁻¹² F/m |
| `μ₀` | Vacuum permeability | 1.257 × 10⁻⁶ H/m |
| `Z₀ = √(μ₀/ε₀)` | Free-space impedance | 376.7 Ω |

Reference for `units` command: `echo "1 eV" | units -t "J"` → `1.602e-19`.
