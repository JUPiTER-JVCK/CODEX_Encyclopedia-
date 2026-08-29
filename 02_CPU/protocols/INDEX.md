# CPU — Protocols & Conventions

Not wire protocols — these are the *software contracts* the CPU layer enforces.

## Application Binary Interfaces (ABIs)
| ABI | Platforms | Notes |
|-----|-----------|-------|
| System V AMD64 ABI | Linux, macOS, BSD on x86-64 | `rdi,rsi,rdx,rcx,r8,r9` arg regs |
| Microsoft x64 ABI | Windows on x86-64 | `rcx,rdx,r8,r9`, 32-byte shadow space |
| AAPCS64 | Linux/macOS/Windows on ARM64 | `x0..x7` arg regs |
| AAPCS (32-bit) | 32-bit ARM | `r0..r3` arg regs |
| RISC-V ELF psABI | Linux/RTOS on RISC-V | `a0..a7` arg regs |
| i386 SVR4 ABI | Linux on 32-bit x86 | Stack-based args |
| Windows fastcall / stdcall / cdecl | Win32 | Mixed legacy x86 conventions |

## Exception / interrupt models
- **x86-64** — IDT, vectors 0–31 reserved, IRQs 32+, IST stacks, MCE, NMI, SMI.
- **ARMv8-A** — exception levels (EL0–EL3), synchronous vs asynchronous, VBAR.
- **RISC-V** — `mtvec`/`stvec` trap base, `mcause`/`scause`, delegation.

## Memory consistency models
- **x86 TSO** — Total Store Order, store buffers only.
- **ARMv8 / POWER weak** — explicit `dmb` / `dsb` / `isb` barriers.
- **RISC-V WMO + Ztso** — weak by default; optional TSO extension.

## Binary formats (where ABI meets file format)
- **ELF** — Linux, BSD, most Unix
- **Mach-O** — macOS, iOS
- **PE/COFF** — Windows
- **RISC-V psABI tag sections** — feature compatibility

## Cross-link
- These ABIs are what syscall wrappers in [06_System_Libraries](../../06_System_Libraries/) target.
- Kernel-side exception entry → [05_OS_Kernel/topics](../../05_OS_Kernel/topics/INDEX.md)
