# Circuit Board — Topics

Concept notes. One file per topic as the codex grows; this index gives the map.

## Board-level
- **Motherboard layout** — sockets, slots, headers, power planes.
- **Chipsets** — Intel PCH, AMD chipsets, ARM SoC platform controllers.
- **Form factors** — ATX, microATX, ITX, NUC, server boards, SBCs.
- **Single Board Computers** — Raspberry Pi family, BeagleBone, Jetson, Pine64.

## Buses & interconnect
- **Parallel buses** — DDR memory, legacy PCI.
- **Serial buses** — PCIe, USB, SATA, NVMe, Thunderbolt, SPI, I²C, UART, CAN, JTAG.
- **Bus topologies** — point-to-point, multi-drop, bussed, fabric.
- **Bus arbitration & clocking** — synchronous vs source-synchronous vs embedded clock.

## Subsystems
- **Memory subsystem** — DIMMs, ECC, channels, ranks, SPD/JEDEC profile, XMP/EXPO.
- **Power delivery (VRM)** — multi-phase regulators, PMIC, sequencing.
- **Clock generation** — PLLs, crystal oscillators, jitter.
- **Cooling & thermal** — heat sinks, heat pipes, vapor chambers, thermal interface material.

## Manufacturing & assembly
- **PCB stackup** — layer count, dielectric, impedance control.
- **Soldering** — reflow, wave, hand soldering, SMD vs through-hole.
- **Inspection** — AOI, X-ray (for BGA), in-circuit test.

## Hardware security (cross-link)
- See [14_Security/topics](../../14_Security/topics/) for: chip-off attacks, JTAG debug abuse, glitching/fault injection, hardware implants, supply-chain.
