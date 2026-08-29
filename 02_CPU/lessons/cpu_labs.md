---
title: "CPU — Interactive Labs"
layer: 02_CPU
section: lessons
tags: [lesson, cpu, assembly, registers, pipeline, lab, quiz, hands-on]
updated: 2026-05-21
---

# CPU — Interactive Labs

---

## Module 1: Assembly Hello World (x86-64)

### Objective

Write, assemble, and link a minimal "Hello, World" in x86-64 assembly
to understand registers, syscalls, and the instruction cycle.

### Prerequisites

- Linux x86-64 system (or WSL)
- `nasm` assembler, `ld` linker

### Lab Steps

1. Create `hello.asm`:

```nasm
; hello.asm — Linux x86-64 syscall ABI
section .data
    msg db "Hello, World!", 10    ; string + newline
    len equ $ - msg               ; length = current pos - start

section .text
    global _start

_start:
    mov rax, 1          ; syscall number: write
    mov rdi, 1          ; fd: stdout
    mov rsi, msg        ; buffer address
    mov rdx, len        ; byte count
    syscall             ; invoke kernel

    mov rax, 60         ; syscall number: exit
    xor rdi, rdi        ; exit code 0
    syscall
```

2. Assemble and link:
```bash
nasm -f elf64 hello.asm -o hello.o
ld hello.o -o hello
./hello
```

3. Inspect with `objdump`:
```bash
objdump -d hello     # disassemble
readelf -h hello     # ELF header
```

### x86-64 register map

```
  64-bit    32-bit    16-bit   8-bit     Purpose
  ────────  ────────  ──────   ─────     ───────
  rax       eax       ax       al        Return value / syscall #
  rbx       ebx       bx       bl        Callee-saved
  rcx       ecx       cx       cl        4th arg (syscall) / counter
  rdx       edx       dx       dl        3rd arg
  rsi       esi       si       sil       2nd arg (source index)
  rdi       edi       di       dil       1st arg (dest index)
  rbp       ebp       bp       bpl       Base pointer (callee-saved)
  rsp       esp       sp       spl       Stack pointer
  r8–r15    r8d–r15d  r8w–r15w r8b–r15b  Additional GP registers
```

### Knowledge Check

**Q1**: What does `syscall` do at the hardware level?

> **A1**: Triggers a privilege level transition from user mode (ring 3)
> to kernel mode (ring 0) via the SYSCALL instruction. The kernel reads
> the syscall number from RAX and arguments from RDI, RSI, RDX, R10, R8, R9.

**Q2**: Why `xor rdi, rdi` instead of `mov rdi, 0`?

> **A2**: `xor reg, reg` is a common optimization — it encodes in fewer
> bytes (3 vs 7) and modern CPUs recognize it as a zeroing idiom,
> breaking dependency chains.

---

## Module 2: Register Inspection with GDB

### Objective

Use GDB to single-step through assembly, inspect registers and memory
at each instruction, and visualize the fetch-decode-execute cycle.

### Lab Steps

1. Compile with debug info:
```bash
nasm -f elf64 -g -F dwarf hello.asm -o hello.o
ld hello.o -o hello
```

2. Debug session:
```bash
gdb ./hello
(gdb) break _start
(gdb) run
(gdb) info registers       # show all registers
(gdb) stepi                # single instruction step
(gdb) info registers rax rdi rsi rdx  # watch syscall args fill in
(gdb) x/s &msg             # examine string in memory
(gdb) stepi                # execute syscall → "Hello, World!"
```

3. At each `stepi`, note which register changed and why

### Knowledge Check

**Q1**: What is RIP?

> **A1**: The instruction pointer (program counter on x86-64). It holds
> the address of the next instruction to execute. You cannot write to it
> directly — it's updated by the CPU (sequential), branches, calls, and returns.

**Q2**: What is the difference between `stepi` and `step` in GDB?

> **A2**: `stepi` steps one machine instruction. `step` steps one source
> line (useful in C/C++ but requires debug symbols from a high-level compiler).

---

## Module 3: Pipeline Hazard Demo

### Objective

Demonstrate data hazards and branch prediction effects by writing code
that triggers pipeline stalls, then measuring with `perf stat`.

### Lab Steps

1. Create two versions of a loop:

```c
// no_hazard.c — independent operations
#include <stdint.h>
int main() {
    volatile uint64_t a = 0, b = 0, c = 0, d = 0;
    for (int i = 0; i < 100000000; i++) {
        a += 1; b += 2; c += 3; d += 4;  // independent
    }
    return 0;
}

// hazard.c — dependent operations (data hazard)
#include <stdint.h>
int main() {
    volatile uint64_t a = 0;
    for (int i = 0; i < 100000000; i++) {
        a += 1; a += 2; a += 3; a += 4;  // each depends on previous
    }
    return 0;
}
```

2. Compile and measure:
```bash
gcc -O0 no_hazard.c -o no_hazard
gcc -O0 hazard.c -o hazard
perf stat ./no_hazard
perf stat ./hazard
```

3. Compare IPC (instructions per cycle) — the hazard version should
   have lower IPC due to pipeline stalls

### Review Flashcards

| Term | Definition |
|------|-----------|
| ISA | Instruction Set Architecture — the CPU's "API" |
| Register | Fast storage inside the CPU (ns access) |
| Syscall | Controlled transition from user to kernel mode |
| Pipeline | Overlapping fetch/decode/execute/memory/writeback |
| Data hazard | Instruction needs result of previous instruction |
| Branch prediction | CPU guesses branch direction to avoid stalls |
| IPC | Instructions Per Cycle — higher = better utilization |
| Out-of-order execution | CPU reorders instructions to fill pipeline |

### Challenge

> Write a simple function in C, compile with `gcc -S -O2` to see the
> assembly output. Find: function prologue, register allocation,
> loop unrolling, and SIMD vectorization. Compare `-O0` vs `-O2` assembly.

---

## Cross-links

- CPU inspection tools → [../man_pages/cpu_inspection.md](../man_pages/cpu_inspection.md)
- x86-64 assembly → [../languages/x86_64_asm.md](../languages/x86_64_asm.md)
- Firmware labs → [../../03_Firmware_BIOS/lessons/firmware_labs.md](../../03_Firmware_BIOS/lessons/firmware_labs.md)
