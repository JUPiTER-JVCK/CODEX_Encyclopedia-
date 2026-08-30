# Device Drivers — Languages

| Language | OS | Notes |
|----------|----|----|
| C (kernel dialect) | Linux, BSD, Windows (with KMDF/WDM), macOS (XNU) | The default — strict subset, no libc |
| C++ (restricted) | Windows KMDF, macOS IOKit (legacy) | No exceptions, no STL in many contexts |
| Rust | Linux (Rust-for-Linux), Windows (experimental) | `no_std`, async limited; growing fast |
| Swift | macOS / iOS (DriverKit) | User-space drivers via `*.dext` bundles |
| Objective-C / C++ | macOS IOKit (legacy kexts) | Mostly being replaced by DriverKit |
| Python | Userspace via libusb, pyudev | Prototyping, not actual kernel drivers |

## Kernel C dialect notes
- No standard library — use kernel APIs (`kmalloc`, `printk`, `copy_to_user`).
- No floating point (without explicit `kernel_fpu_begin`/`end`).
- Strict locking discipline — sleep vs atomic contexts.
- GPL symbol export (`EXPORT_SYMBOL_GPL`) gates a large API surface.

## Build systems
- Linux: out-of-tree Makefile or DKMS
- Windows: WDK + Visual Studio + `inf2cat`/`signtool`
- macOS: Xcode + DriverKit SDK

## Related
- Kernel internals → [05_OS_Kernel/languages](../../05_OS_Kernel/languages/INDEX.md)
- Bus protocols → [01_Circuit_Board/protocols](../../01_Circuit_Board/protocols/INDEX.md)
