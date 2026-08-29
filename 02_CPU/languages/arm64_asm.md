---
title: AArch64 (ARM64) Assembly — language profile
layer: 02_CPU
section: languages
tags: [arm64, aarch64, armv8, asm]
updated: 2026-05-20
---

# AArch64 (ARM64) Assembly — language profile

> Modern 64-bit ARM (ARMv8-A and up). Powers Apple Silicon, modern phones,
> AWS Graviton, Ampere Altra, Raspberry Pi 4/5. Clean RISC ISA with
> three-operand form.

## Registers

| Reg | 64-bit | 32-bit | Role (AAPCS64) |
|-----|--------|--------|----------------|
| 0–7 | `x0`–`x7` | `w0`–`w7` | Argument / return value |
| 8 | `x8` | `w8` | Indirect result location / syscall number (Linux) |
| 9–15 | `x9`–`x15` | `w9`–`w15` | Caller-saved temporaries |
| 16, 17 | `x16` (`ip0`), `x17` (`ip1`) | | Intra-procedure-call scratch |
| 18 | `x18` | | Platform reg (reserved on macOS/iOS/Windows) |
| 19–28 | `x19`–`x28` | `w19`–`w28` | Callee-saved |
| 29 | `x29` (`fp`) | | Frame pointer |
| 30 | `x30` (`lr`) | | Link register (return address) |
| 31 | `sp` / `xzr` (zero) | `wsp` / `wzr` | Stack pointer **or** zero register depending on instr |
| — | `pc` | | Program counter (not directly writable as a GPR) |
| — | `v0`–`v31` | | SIMD/FP (NEON / SVE / SVE2) |

## Key instructions

| Instr | Effect |
|-------|--------|
| `mov xd, xn` / `mov xd, #imm` | Copy / load immediate (12-bit + shift) |
| `movz xd, #imm, lsl #16` / `movk xd, #imm, lsl #32` | Build 64-bit constants in 16-bit chunks |
| `add / sub / mul / udiv / sdiv` | Three-operand arithmetic |
| `and / orr / eor / mvn / bic` | Bitwise |
| `lsl / lsr / asr / ror` | Shifts |
| `cmp xn, xm` / `cmn xn, xm` | Compare (signed/unsigned) |
| `tst xn, xm` | `and` flags only |
| `b.cond label` (eq, ne, lt, gt, hi, lo, ...) | Conditional branch |
| `cbz / cbnz xn, label` | Compare-and-branch zero/non-zero |
| `tbz / tbnz xn, #bit, label` | Test-bit-and-branch |
| `b label` / `bl label` | Branch / branch+link (call) |
| `ret` (= `ret x30`) | Return |
| `ldr / str` | Load / store register |
| `ldp / stp x0, x1, [sp, #16]!` | Load/store pair with pre/post-index |
| `ldur / stur` | Unscaled offset load/store |
| `adrp x0, sym` + `add x0, x0, :lo12:sym` | Compute address of symbol (PC-relative) |
| `svc #0` | Supervisor call (Linux syscall) |
| `dmb / dsb / isb` | Memory / data sync / instruction sync barriers |
| NEON: `add v0.4s, v1.4s, v2.4s` | 4×32-bit add |
| SVE: `add z0.s, z1.s, z2.s` | Scalable vector add |

## Addressing modes

```
[xn]                    ; base only
[xn, #imm]              ; base + signed offset
[xn, xm]                ; base + index
[xn, xm, lsl #2]        ; base + index shifted
[xn, #imm]!             ; pre-index (writeback)
[xn], #imm              ; post-index (writeback)
[xn, xm, sxtw #2]       ; signed-extend word index
```

## AAPCS64 calling convention

- **Args (int/ptr)**: `x0`–`x7`, then stack (aligned to 8 bytes)
- **Args (FP/SIMD)**: `v0`–`v7`
- **Return**: `x0` (and `x1` for 128-bit); `v0` for FP
- **Caller-saved**: `x0`–`x18`, `v0`–`v7`, `v16`–`v31`
- **Callee-saved**: `x19`–`x28`, `x29` (fp), `x30` (lr) **must** be saved, `v8`–`v15` (low 64 bits only)
- **Stack** 16-byte aligned on entry
- **Apple ARM64 ABI** subset differs (variadic args entirely on stack; `x18` reserved)

## Linux syscall ABI

- **Number** in `x8`
- **Args**: `x0`–`x5`
- **Trap**: `svc #0`
- **Return**: `x0` (negative = `-errno`)
- **Clobbers**: `x0`–`x18` semantically

## "Hello, world" (Linux AAPCS64)

```gas
        .globl  _start
        .data
msg:    .ascii  "hello\n"
len  =  . - msg

        .text
_start:
        // write(1, msg, len)
        mov     x0, #1
        adrp    x1, msg
        add     x1, x1, :lo12:msg
        mov     x2, #len
        mov     x8, #64          // __NR_write
        svc     #0

        // exit(0)
        mov     x0, #0
        mov     x8, #93          // __NR_exit
        svc     #0
```

## "Hello, world" (macOS ARM64)

macOS uses a different syscall convention (`svc #0x80`) and Mach-O format.
Easier to call libc:

```gas
        .globl  _main
        .extern _puts

_main:
        adrp    x0, msg@PAGE
        add     x0, x0, msg@PAGEOFF
        bl      _puts
        mov     w0, #0
        ret

        .section __TEXT,__cstring,cstring_literals
msg:    .asciz  "hello"
```

Build: `clang hello.s -o hello && ./hello`.

## Toolchain

| Tool | Use |
|------|-----|
| `as` (GNU) / `clang -c` | Assemble |
| `ld` / `lld` | Link |
| `objdump -d` | Disassemble |
| `llvm-objdump -d --triple=aarch64` | LLVM disasm |
| `gcc -S -masm=...` / `clang -S` | Compile to asm |
| `gdb` (with `set disassemble-next-line on`) | Debug |
| `qemu-user-aarch64 ./app` | Run AArch64 binary on x86 host |
| `qemu-system-aarch64` | Full system emulator |

## Patterns

- **Build large constants** with `mov` + `movk` sequences (NOT a single 64-bit immediate).
- **Use `adrp` + `add :lo12:`** to address symbols PC-relatively (PIC).
- **Branch range**: conditional `b.cond` = ±1 MB; `b`/`bl` = ±128 MB; longer needs trampoline / `br xN`.
- **Function prologue/epilogue** with `stp x29, x30, [sp, #-16]!` / `ldp x29, x30, [sp], #16`.
- **`ret` returns to `lr`** (`x30`); save it if your function calls anything.
- **NEON for SIMD**; 128-bit lanes (`.16b`, `.8h`, `.4s`, `.2d`).
- **SVE/SVE2** are scalable — vector length determined at runtime.

## Common gotchas

- **Three different syscall ABIs**: Linux/AArch64, Apple (libc), Windows (`svc #0` + slightly different numbering).
- **`sp` is reg 31 only as SP** — same encoding doubles as `xzr` (zero) depending on instruction. Carefully.
- **Writes to `wN` zero-extend** into `xN`, like x86's `eax → rax`.
- **Apple ARM64**: tagged pointers (top byte ignored), pointer authentication (`paci*`/`auti*`) — strip when comparing.
- **W^X**: on Apple Silicon, code pages must be either writable or executable, not both. Use `pthread_jit_write_protect_np()` for JITs.
- **Alignment faults** on some loads/stores in older cores; modern ARMv8 cores handle unaligned data.

## See also
- x86-64 → [x86_64_asm.md](x86_64_asm.md)
- RISC-V → [riscv_asm.md](riscv_asm.md)
- ABI / calling conventions → [02_CPU/protocols](../protocols/INDEX.md)
