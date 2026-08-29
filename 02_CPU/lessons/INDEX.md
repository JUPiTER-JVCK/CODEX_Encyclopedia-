# CPU — Lessons

## Dedicated lesson modules

| Topic | File |
|-------|------|
| CPU interactive labs | [cpu_labs.md](cpu_labs.md) — Assembly hello world, register inspection, pipeline hazards |

---

1. **Number systems & bit-twiddling** — binary, hex, two's complement, masks, shifts.
2. **Hello, assembly** — write & run "exit 42" in x86-64 and AArch64.
3. **Calling conventions** — System V AMD64, Microsoft x64, AAPCS — pass args, return values.
4. **Disassembly literacy** — read `objdump -d` for a small C program; identify prologue/epilogue.
5. **Caches & locality** — measure cache effects with stride-access microbenchmarks.
6. **Branch prediction & speculation** — write code that defeats the predictor; observe perf counters.
7. **SIMD intro** — SSE/AVX intrinsics or NEON; vectorize a dot product.
8. **Memory model** — atomics, fences, acquire/release; build a lock from CAS.
9. **Implement a tiny RISC-V core** — single-cycle → pipelined in Verilog/Chisel.
10. **Microarch attack & defense** — reproduce Spectre v1 PoC, then mitigations.

## Suggested external courses
- MIT 6.004 *Computation Structures* — RISC-V from gates to OS interface.
- Carnegie Mellon 15-213 *CSAPP* lectures — bridges arch to systems.
- Nand2Tetris Part 1 — build a CPU from logic.
