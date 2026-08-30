# Physics — Topics

Each topic links to what it *enables* one layer up.

## Classical EM
- **Coulomb / Gauss** → capacitor design ([00b_Devices](../../00b_Devices/))
- **Ampère / Faraday** → inductors, transformers
- **Maxwell's equations** → all EM theory (light, radio, transmission lines)
- **Plane waves & polarization** → fiber and RF propagation ([09](../../Network/09_Network_Physical/), [16](../../16_RF_Wireless/))
- **Transmission line theory** — Z₀, reflection coefficient, Smith chart → PCB signal integrity ([01](../../01_Circuit_Board/))

## Solid-state
- **Crystal lattice, Bravais, reciprocal lattice**
- **Band theory** — valence vs conduction; insulators vs semiconductors vs metals
- **Effective mass**, **density of states**
- **Doping** — donors (n-type), acceptors (p-type), Fermi level shifts
- **Carrier transport** — drift (μE), diffusion (D∇n); Einstein relation
- **p-n junction** — depletion region, built-in voltage, depletion capacitance, breakdown
- **MOS capacitor** — accumulation, depletion, inversion → MOSFET ([00b_Devices](../../00b_Devices/))

## Quantum
- **Wave-particle duality, de Broglie**
- **Schrödinger equation** — bound states, tunneling
- **Tunneling** → Zener, FET subthreshold, flash erase
- **Energy bands from periodic potential** (Kronig-Penney intuition)
- **Pauli exclusion** → why bands fill
- **Quantum dots / wells / wires** — confinement → optoelectronics

## Thermodynamics & noise
- **kT energy scale** at room temp ≈ 25.85 meV
- **Boltzmann distribution** — carriers in semiconductors
- **Johnson-Nyquist (thermal) noise** — `Vn² = 4kTRΔf`
- **Shot noise** — `In² = 2qIΔf`
- **1/f flicker noise** — process-dependent
- **Phase noise** — oscillator quality

## Optics / photonics
- **Snell, Fresnel, total internal reflection** → optical fiber
- **Photon energy** `E = hν = hc/λ`
- **Absorption / emission** — direct vs indirect bandgap → why Si LEDs are bad and GaAs LEDs work
- **Lasers** — population inversion, stimulated emission, threshold

## Information & physical limits
- **Landauer's principle** — minimum energy per irreversible bit erase = kT ln 2 ≈ 2.85 × 10⁻²¹ J at 300 K
- **Reversible computing** — Bennett; theoretical zero-energy
- **Shannon channel capacity** — `C = B log₂(1 + S/N)` (cross-link [12](../../Network/12_Network_Transport/))
- **Holevo bound** — quantum information limit

## Cross-link
- All of this feeds upward into → [00b_Devices](../../00b_Devices/)
- RF propagation specifics live in → [16_RF_Wireless/topics](../../16_RF_Wireless/topics/INDEX.md)
- Quantum security implications → [14_Security/topics](../../14_Security/topics/INDEX.md)
