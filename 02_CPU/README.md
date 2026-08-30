# 02 — CPU

> The instruction executor. Reads opcodes, manipulates registers and memory,
> talks to the rest of the board over buses. Everything in software eventually
> compiles down to what this layer understands: machine code.

## At a glance

| Field | Value |
|-------|-------|
| Description | Executes machine instructions and computations |
| Languages | Machine code, Assembly (x86/x86-64, ARM/AArch64, RISC-V, PowerPC, MIPS) |
| Medium / Interface | Instruction Set Architecture (ISA), microcode, electrical signals |
| Example | Executes BIOS instructions at startup |
| Adjacent layers | ↑ [03_Firmware_BIOS](../03_Firmware_BIOS/), ↓ [01_Circuit_Board](../01_Circuit_Board/) |

## What lives here

- ISA families: x86/x86-64, ARM/AArch64, RISC-V, POWER, MIPS, SPARC, z/Architecture
- Microarchitecture: pipelines, OoO execution, superscalar, SIMD, branch prediction
- Caches (L1/L2/L3), TLBs, MMUs, virtualization extensions
- Privilege rings, protection modes, secure enclaves (SGX, TrustZone, SEV)
- Microcode, control registers, MSRs
- Performance counters (PMU)

## Sub-sections

- [references/](references/INDEX.md) — ISA manuals, microarch papers, Agner Fog
- [lessons/](lessons/INDEX.md) — from "hello assembly" to OoO microarch
- [languages/](languages/INDEX.md) — assembly dialects + ISA-aware C/Rust
- [man_pages/](man_pages/INDEX.md) — `gdb`, `objdump`, `perf`, `nm`, `readelf`
- [topics/](topics/INDEX.md) — pipelines, caches, MMU, vector extensions
- [protocols/](protocols/INDEX.md) — calling conventions, ABIs, exception models

## Cross-references

- Kernel uses privilege rings → [05_OS_Kernel/topics](../05_OS_Kernel/topics/INDEX.md)
- CPU-side crypto (AES-NI, SHA-NI) → [14_Security/topics](../14_Security/topics/INDEX.md)
- Spectre/Meltdown/L1TF side channels → [14_Security/topics](../14_Security/topics/INDEX.md)
- ML inference on CPU vs GPU → [15_AI_ML/topics](../15_AI_ML/topics/INDEX.md)
