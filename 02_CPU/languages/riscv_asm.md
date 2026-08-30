---
title: RISC-V Assembly — language profile
layer: 02_CPU
section: languages
tags: [riscv, rv32, rv64, asm]
updated: 2026-05-20
---

# RISC-V Assembly — language profile

> Open, modular, royalty-free ISA. Base integer ISA (`I`) is tiny; everything
> else is an extension you opt into. Names: `RV32I` (32-bit), `RV64I` (64-bit),
> with extensions `M` (mul/div), `A` (atomics), `F`/`D` (float), `C` (compressed
> 16-bit insns), `V` (vector), `B` (bitmanip), `H` (hypervisor), etc. A common
> "general purpose" target is `RV64GC` = `IMAFDC`.

## Registers

| ABI name | Reg | Role |
|----------|-----|------|
| `zero` | `x0` | Hardwired zero |
| `ra` | `x1` | Return address (caller-saved) |
| `sp` | `x2` | Stack pointer (callee-saved) |
| `gp` | `x3` | Global pointer (linker-managed) |
| `tp` | `x4` | Thread pointer |
| `t0`–`t2` | `x5`–`x7` | Temporaries (caller-saved) |
| `s0`/`fp` | `x8` | Frame pointer / saved (callee-saved) |
| `s1` | `x9` | Saved (callee-saved) |
| `a0`–`a7` | `x10`–`x17` | Args / return (`a0`/`a1` for return) |
| `s2`–`s11` | `x18`–`x27` | Saved (callee-saved) |
| `t3`–`t6` | `x28`–`x31` | Temporaries (caller-saved) |
| `pc` | — | Program counter (not a GPR) |
| `f0`–`f31` | | FP regs if F/D extension; `ft0–ft11`, `fs0–fs11`, `fa0–fa7` ABI names |
| CSRs | | Control & status (`mstatus`, `mtvec`, `mcause`, `mepc`, `mhartid`, …) |

## Common instructions

| Instr | Effect |
|-------|--------|
| `li rd, imm` | Pseudo: load immediate (expands to `lui` + `addi`) |
| `la rd, sym` | Pseudo: load symbol address (PC-relative pair) |
| `mv rd, rs` | Pseudo: `addi rd, rs, 0` |
| `add rd, rs1, rs2` / `addi rd, rs, imm12` | Add (reg / imm12 sign-extended) |
| `sub rd, rs1, rs2` | Subtract |
| `mul rd, rs1, rs2` (M ext) | Multiply (low) |
| `mulh / mulhu / mulhsu` | Upper half (signed/unsigned/mixed) |
| `div / divu / rem / remu` (M ext) | Divide / remainder |
| `and / or / xor / not / sll / srl / sra` | Bitwise + shift |
| `slt / sltu / slti / sltiu` | Set-less-than |
| `beq / bne / blt / bge / bltu / bgeu rs1, rs2, label` | Conditional branch (range ±4 KB) |
| `j label` (pseudo `jal x0, label`) | Unconditional jump |
| `jal rd, label` | Jump-and-link (return addr in `rd`; pseudo `jal label` ⇒ `jal ra, label`) |
| `jalr rd, rs, imm` | Indirect jump-and-link |
| `ret` (pseudo `jalr x0, ra, 0`) | Return |
| `lw / lh / lb / ld` (RV64) / `lwu / lhu / lbu` | Loads (signed / unsigned variants) |
| `sw / sh / sb / sd` (RV64) | Stores |
| `lr.w / sc.w` (A) | Load-reserved / store-conditional |
| `amoadd.w / amoswap.w / amoor.w` (A) | Atomic memory ops |
| `fence`, `fence.i` | Memory barriers (`fence iorw,iorw` etc.) |
| `ecall` | Environment call (syscall) |
| `ebreak` | Software breakpoint |
| `csrr / csrw / csrrw / csrrs / csrrc` | CSR read/write |
| Compressed (C ext): `c.li`, `c.mv`, `c.add`, `c.j`, ... | 16-bit encodings |

## Calling convention (RISC-V psABI)

- **Args (int/ptr)**: `a0`–`a7`. Beyond 8 → stack.
- **Args (float, with F/D)**: `fa0`–`fa7`.
- **Return**: `a0` (and `a1` if 128-bit on RV32 or 64-bit pair on RV32).
- **Caller-saved**: `ra`, `t0`–`t6`, `a0`–`a7`, FP `ft*`/`fa*`.
- **Callee-saved**: `sp`, `s0`–`s11`, FP `fs*`.
- **Stack** 16-byte aligned at calls.

## Linux syscall ABI

- **Number** in `a7`
- **Args**: `a0`–`a5`
- **Trap**: `ecall`
- **Return**: `a0` (negative = `-errno`)

## "Hello, world" (Linux, RV64, GNU assembler)

```gas
        .globl  _start
        .data
msg:    .ascii  "hello\n"
len  =  . - msg

        .text
_start:
        # write(1, msg, len)
        li      a0, 1
        la      a1, msg
        li      a2, len
        li      a7, 64           # __NR_write
        ecall

        # exit(0)
        li      a0, 0
        li      a7, 93           # __NR_exit
        ecall
```

Build: `riscv64-linux-gnu-as hello.s -o h.o && riscv64-linux-gnu-ld h.o -o h && qemu-riscv64 ./h`

## Toolchain

| Tool | Use |
|------|-----|
| `riscv64-linux-gnu-gcc` / `riscv64-unknown-elf-gcc` | Cross-compile (Linux / bare-metal) |
| `riscv64-linux-gnu-as` | Assemble |
| `riscv64-linux-gnu-objdump -d` | Disassemble |
| `qemu-riscv64` (user) / `qemu-system-riscv64` | Emulate |
| `spike` | Reference ISA simulator |
| `gdb-multiarch` | Debug (`target remote :1234`) |
| Renode | Multi-MCU sim |

## Privilege levels

| Mode | Use |
|------|-----|
| M (machine) | Highest; only mode required to exist. Boots here. |
| S (supervisor) | OS kernel (Linux). |
| U (user) | Userspace. |
| H (hypervisor) | Optional extension. |

CSRs you'll touch in M-mode: `mstatus`, `mie`, `mip`, `mtvec`, `mcause`, `mepc`, `mhartid`, `medeleg`, `mideleg`. S-mode counterparts: `s*` prefix.

## Patterns

- **`li` with large constants** expands to `lui` + `addi`; for 64-bit constants on RV64 you need additional `slli` + `addi` chains. Prefer loading from a constant pool.
- **`la rd, sym`** is `auipc rd, %pcrel_hi(sym)` + `addi rd, rd, %pcrel_lo(...)`. PC-relative, position-independent.
- **Branch range**: B-type instructions = ±4 KiB. Use `j label` for longer jumps (JAL = ±1 MiB) or trampoline.
- **Atomics**: `lr.w` / `sc.w` for arbitrary primitives; `amo*` for single-op fast paths.
- **Compressed (C) extension**: shaves ~25% off code size. Mostly transparent — assembler picks short form when fits.

## Common gotchas

- **`x0` is hardwired zero** — writes to it are silently discarded; useful as `/dev/null`.
- **Branches don't have delay slots** (unlike MIPS); no shuffling needed.
- **Stack grows downward** (decreasing `sp`).
- **Integer overflow is silent** (defined behavior in spec); use checked sequences if needed.
- **`rdtime`/`rdcycle`/`rdinstret`** are user-mode CSR reads — only available if `Zicntr` extension present.
- **Variable-length encoding (16/32/48/64)** — disassemblers must follow the length encoding bits.
- **`fence`** with proper IORW arguments is mandatory across cores or with devices; weak memory model.

## Extensions worth knowing

| Ext | Purpose |
|-----|---------|
| `M` | Integer mul/div |
| `A` | Atomics |
| `F` / `D` / `Q` | Single / double / quad float |
| `C` | Compressed 16-bit |
| `V` | Vector (RVV 1.0) — variable-length SIMD |
| `B` | Bit manipulation (`Zba` + `Zbb` + `Zbc` + `Zbs`) |
| `H` | Hypervisor |
| `Zicntr` | Cycle / time / instret CSRs |
| `Zicsr` | Standard CSR access |
| `Zifencei` | `fence.i` instr-cache flush |
| `Zicbom` / `Zicboz` | Cache management ops |
| `Zicfilp` / `Zicfiss` | Control-flow integrity (landing pads / shadow stack) |
| `Smaia` / `Ssaia` | Advanced interrupt arch |

## See also
- x86-64 → [x86_64_asm.md](x86_64_asm.md)
- ARM64 → [arm64_asm.md](arm64_asm.md)
- ABIs / calling conventions → [02_CPU/protocols](../protocols/INDEX.md)
