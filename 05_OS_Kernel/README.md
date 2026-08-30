# 05 — OS Kernel

> The traffic cop. Schedules processes, manages memory, mediates hardware
> through drivers, enforces privilege boundaries, and exposes the syscall
> interface that everything above depends on.

## At a glance

| Field | Value |
|-------|-------|
| Description | Manages resources, security, hardware |
| Languages | C, Assembly (Rust in Linux; Rust + Swift in Apple SEPOS) |
| Medium / Interface | System calls, hardware via drivers |
| Example | File-open request handled via kernel calls |
| Adjacent layers | ↓ [04_Device_Drivers](../04_Device_Drivers/), ↑ [06_System_Libraries](../06_System_Libraries/) |

## What lives here

- **Linux** — monolithic, modular; LTS releases, distros
- **BSDs** — FreeBSD, OpenBSD, NetBSD, Dragonfly
- **macOS / iOS** — XNU (Mach + BSD), Darwin
- **Windows** — NT kernel (hybrid), Hyper-V hypervisor
- **Microkernels & hybrids** — seL4, MINIX 3, Fuchsia (Zircon), QNX
- **Hypervisors** — KVM, Xen, Hyper-V, VMware ESXi, bhyve
- **Containers' kernel side** — namespaces, cgroups, seccomp, capabilities

## Sub-sections

- [references/](references/INDEX.md) — Linux/XNU/NT internals books
- [lessons/](lessons/INDEX.md) — syscalls, scheduler, VFS, networking
- [languages/](languages/INDEX.md) — kernel-grade C, Rust, asm
- [man_pages/](man_pages/INDEX.md) — `strace`, `bpftrace`, `sysctl`, `lsns`
- [topics/](topics/INDEX.md) — scheduler, MM, FS, IPC, namespaces
- [protocols/](protocols/INDEX.md) — syscall ABIs, POSIX, /proc, netlink

## Cross-references
- Bootloader → kernel handoff → [03_Firmware_BIOS/topics](../03_Firmware_BIOS/topics/INDEX.md)
- libc syscall wrappers → [06_System_Libraries](../06_System_Libraries/)
- Container/VM isolation → [14_Security/topics](../14_Security/topics/INDEX.md)
- Network stack lives inside the kernel → [09–13](../Network/09_Network_Physical/)
