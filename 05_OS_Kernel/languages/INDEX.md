# OS Kernel — Languages

| Language | Use in kernel | Examples |
|----------|--------------|----------|
| C | Dominant. Kernel-specific dialect, no libc. | Linux, XNU (BSD half), NT, BSDs |
| Assembly | Entry/exit stubs, context switch, mode transitions | All kernels (arch/-specific dirs) |
| Rust | Growing presence in Linux; experimental in Windows | Linux drivers (`rust/`), Redox OS |
| C++ | XNU IOKit (kernel), parts of NT, Fuchsia (Zircon) | Macros restricted in IOKit |
| Swift | Apple's Secure Enclave (SEPOS, partially) | Apple-internal |
| Ada / SPARK | High-assurance kernels (Muen, some defense) | Niche |
| Haskell | Verified kernel research (House), seL4 spec | Academic |

## Linux kernel C dialect
- Pre-C89 + GCC extensions: statement expressions, typeof, attribute, designated init.
- `kmalloc/kfree`, `printk`, `copy_to/from_user`.
- Strict typing: `__user`, `__rcu`, `__iomem` sparse annotations.
- Locking primitives: `spin_lock`, `mutex`, `rwsem`, RCU.

## Build & verify
- **Linux** — Kbuild Makefiles, Kconfig, sparse, smatch, coccinelle.
- **XNU** — Xcode + KEXT tools (limited going forward).
- **NT** — WDK + Visual Studio + Driver Verifier.
- **seL4** — proof-carrying via Isabelle/HOL.

## Related
- Drivers use the same dialect → [04_Device_Drivers/languages](../../04_Device_Drivers/languages/INDEX.md)
- libc bridges to userland → [06_System_Libraries/languages](../../06_System_Libraries/languages/INDEX.md)
