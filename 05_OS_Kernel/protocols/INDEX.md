---
title: "OS Kernel — Protocol Reference"
layer: 05_OS_Kernel
section: protocols
tags: [protocols, index, reference]
updated: 2026-06-07
---

# OS Kernel — Protocol Reference

> POSIX & syscall ABI standards governing the kernel/user-space boundary.

## Dedicated Protocol References

| File | Covers |
|------|--------|
| [POSIX Syscalls](./posix_syscalls.md) | Categories, calling convention, error handling |

|-------|--------------|
| POSIX (IEEE 1003.1) | Open Group / IEEE | API surface for portable Unix code |
| SUSv4 / SUSv5 | Open Group | Single Unix Specification |
| LSB (Linux Standard Base) | LF | Distro ABI compatibility (largely historical now) |
| FHS (Filesystem Hierarchy Standard) | LF | `/usr`, `/etc`, `/var`, ... layout |
| systemd interfaces | freedesktop | DBus APIs, unit file syntax |

## Linux syscall ABIs (arch-specific)
- **x86-64** — `syscall` instruction, numbers in `<asm/unistd_64.h>`.
- **i386** — `int 0x80` (legacy) or `sysenter`.
- **AArch64** — `svc #0`, numbers in `<asm-generic/unistd.h>`.
- **RISC-V** — `ecall`, numbers in `<asm-generic/unistd.h>`.

## Kernel ↔ userspace interfaces
| Interface | Purpose |
|-----------|---------|
| syscall ABI | Direct kernel entry |
| `/proc` | Process & kernel state as files |
| `/sys` (sysfs) | Device & subsystem attributes |
| `/dev` (devtmpfs) | Device nodes |
| `debugfs` | Ad-hoc kernel debugging exports |
| `configfs` | Config-via-FS for subsystems |
| netlink | Bidirectional kernel/user msg (RTNL, NFNL, GENL) |
| ioctl | Per-device commands over fd |
| sysctl / `/proc/sys` | Tunables |
| eventfd / signalfd / timerfd | fd-based event signaling |

## Internal protocols
- **VFS operations** — `super_operations`, `inode_operations`, `file_operations`
- **netlink families** — NETLINK_ROUTE, NETLINK_NETFILTER, NETLINK_GENERIC
- **virtio** — paravirtualized device protocol (kernel ↔ hypervisor)
- **9P** — Plan 9 file protocol, used by virtio-9p

## Cross-link
- ABIs the kernel must honor → [02_CPU/protocols](../../02_CPU/protocols/INDEX.md)
- libc as the syscall wrapper layer → [06_System_Libraries/protocols](../../06_System_Libraries/protocols/INDEX.md)
