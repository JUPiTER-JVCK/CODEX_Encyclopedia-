---
title: "CPU Pipeline — Stages, Hazards, and Microarchitecture"
layer: 02_CPU
tags: [pipeline, cpu, fetch, decode, execute, hazards, superscalar, ooo]
updated: 2026-05-20
---

# CPU Pipeline — Stages, Hazards, and Microarchitecture

---

## Classic 5-stage RISC pipeline

```
  Clock cycle:  1    2    3    4    5    6    7    8
  ──────────────────────────────────────────────────
  Instr 1:     IF   ID   EX   MEM  WB
  Instr 2:          IF   ID   EX   MEM  WB
  Instr 3:               IF   ID   EX   MEM  WB
  Instr 4:                    IF   ID   EX   MEM  WB

  IF  = Instruction Fetch     (read from I-cache / memory)
  ID  = Instruction Decode    (read registers, decode opcode)
  EX  = Execute               (ALU operation, address calc)
  MEM = Memory Access         (load/store from D-cache)
  WB  = Write Back            (result → register file)
```

**Throughput**: ideally 1 instruction per cycle (IPC = 1) once the pipeline
is full. **Latency** per instruction is still 5 cycles.

---

## Pipeline hazards

### Data hazards

```
  ADD  R1, R2, R3       ; R1 = R2 + R3      (WB in cycle 5)
  SUB  R4, R1, R5       ; needs R1           (ID in cycle 3 — R1 not ready!)

  Solutions:
  ┌─────────────────────────────────────────────┐
  │ Forwarding / Bypassing                      │
  │   EX stage of ADD → EX stage of SUB        │
  │   (hardware shortcut, no stall)             │
  ├─────────────────────────────────────────────┤
  │ Pipeline stall (bubble)                     │
  │   Insert NOP cycle(s) until data ready      │
  ├─────────────────────────────────────────────┤
  │ Compiler scheduling                         │
  │   Reorder independent instructions to fill  │
  │   the gap (software approach)               │
  └─────────────────────────────────────────────┘
```

### Control hazards (branches)

```
  BEQ  R1, R2, target   ; branch decision in EX (cycle 3)
  ???                    ; what to fetch in cycle 2?

  Solutions:
  ┌─────────────────────────────────────────────┐
  │ Branch prediction                            │
  │   Static: assume not taken / always taken   │
  │   Dynamic: BHT, 2-bit saturating counters   │
  │   Modern: TAGE, perceptron, neural          │
  ├─────────────────────────────────────────────┤
  │ Branch delay slot (MIPS)                     │
  │   Instruction after branch always executes  │
  ├─────────────────────────────────────────────┤
  │ Speculative execution                        │
  │   Execute predicted path; flush if wrong    │
  │   (Spectre exploits this!)                  │
  └─────────────────────────────────────────────┘
```

### Structural hazards

Single-ported memory used by both IF and MEM → conflict. Solution: separate
I-cache and D-cache (Harvard architecture at cache level).

---

## Modern superscalar pipeline (simplified)

```
                    ┌─────────────────────────────────────────┐
                    │           Front End                      │
  ┌──────┐  ┌──────┴──────┐  ┌──────────┐  ┌──────────────┐ │
  │Fetch │──│   Decode    │──│ Rename /  │──│  Dispatch /  │ │
  │(16B+ │  │(up to 6-wide│  │ Allocate  │  │ Issue Queue  │ │
  │/cycle)│  │ decode)     │  │(RAT→PRF)  │  │              │ │
  └──────┘  └─────────────┘  └──────────┘  └──────┬───────┘ │
                    └─────────────────────────────────────────┘
                                                    │
                    ┌───────────────────────────────┼─────────┐
                    │           Back End (OoO)       │         │
                    │  ┌─────┐ ┌─────┐ ┌─────┐ ┌───▼──┐     │
                    │  │ALU 0│ │ALU 1│ │ FPU │ │Load/ │     │
                    │  │     │ │     │ │     │ │Store │     │
                    │  └──┬──┘ └──┬──┘ └──┬──┘ └──┬───┘     │
                    │     └───────┴───────┴───────┘          │
                    │                    │                     │
                    │              ┌─────▼──────┐             │
                    │              │  Reorder   │             │
                    │              │  Buffer    │             │
                    │              │  (ROB)     │             │
                    │              └─────┬──────┘             │
                    │                    │ retire (in-order)   │
                    └────────────────────┼────────────────────┘
                                        ▼
                                  Architectural
                                  Register File
```

**Key concepts:**
- **Register Renaming** — eliminates WAR/WAW hazards; physical register file
  (PRF) is larger than architectural registers.
- **Reorder Buffer (ROB)** — tracks in-flight instructions; retires in
  program order (precise exceptions).
- **Issue width** — modern x86 cores: 6–8 wide; Apple M-series: 8+ wide.
- **Pipeline depth** — Intel Skylake ~14–19 stages; Apple Firestorm ~16.

---

## Cache hierarchy

```
  ┌──────────┐   1 cycle     ┌──────────┐   4-5 cycles   ┌──────────┐
  │  CPU     │──────────────▶│  L1      │───────────────▶│  L2      │
  │  Core    │               │  32-64KB │                │ 256KB-1MB│
  └──────────┘               │  I + D   │                └────┬─────┘
                             └──────────┘                     │
                                                         10-30 cycles
                                                              │
                                                         ┌────▼─────┐
                                                         │   L3     │
                                                         │  8-64MB  │
                                                         │ (shared) │
                                                         └────┬─────┘
                                                              │
                                                        100+ cycles
                                                              │
                                                         ┌────▼─────┐
                                                         │   DRAM   │
                                                         │(main mem)│
                                                         └──────────┘
```

| Level | Size | Latency | Associativity |
|-------|------|---------|---------------|
| L1-I | 32–64 KB | 1–4 cycles | 4–8 way |
| L1-D | 32–64 KB | 1–4 cycles | 4–12 way |
| L2 | 256 KB – 2 MB | 4–14 cycles | 8–16 way |
| L3 | 8–64 MB | 10–40 cycles | 12–20 way |
| DRAM | 8–128 GB | 100–300 cycles | — |

---

## Branch prediction accuracy

Modern predictors (TAGE + loop detector + indirect predictor) achieve
**>97% accuracy** on typical workloads. Each misprediction costs
~15–20 cycles (pipeline flush).

---

## Speculative execution side channels

```
  Spectre v1 (bounds check bypass):
    if (x < array_len)          ← branch predicted "taken"
        val = array[x];         ← speculative read (out-of-bounds)
        leak = probe[val * 64]; ← cache side channel
        // flush: val discarded, but cache state persists
```

Mitigations: serializing instructions (`lfence`), retpoline (indirect branches),
Speculative Store Bypass Disable (SSBD), hardware fixes in newer silicon.

---

## Cross-links

- x86-64 assembly → [../languages/x86_64_asm.md](../languages/x86_64_asm.md)
- ARM64 assembly → [../languages/arm64_asm.md](../languages/arm64_asm.md)
- OS scheduling → [../../05_OS_Kernel/topics/INDEX.md](../../05_OS_Kernel/topics/INDEX.md)
- Firmware boot → [../../03_Firmware_BIOS/topics/INDEX.md](../../03_Firmware_BIOS/topics/INDEX.md)
- Security (Spectre) → [../../14_Security/topics/INDEX.md](../../14_Security/topics/INDEX.md)
