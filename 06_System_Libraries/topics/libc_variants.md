---
title: "libc Variants"
layer: 06_System_Libraries
section: topics
tags: [topic, libc, glibc, musl, bionic, uclibc, newlib, embedded]
updated: 2026-05-21
---

# libc Variants

---

## Overview

The C standard library (libc) provides the userspace interface to OS
services: syscall wrappers, stdio, string functions, math, threading,
dynamic linking, and locale support. Different variants make different
trade-offs between size, performance, standards compliance, and portability.

---

## glibc — GNU C Library

The default on most Linux distributions (Debian, Ubuntu, Fedora, Arch).

```
  Key characteristics:
  ┌──────────────────┬──────────────────────────────────────────┐
  │ Standards        │ Full POSIX, ISO C17, many GNU extensions  │
  │ Size (stripped)  │ ~2 MB (libc.so.6 alone)                  │
  │ Performance      │ Highly optimized (SIMD, TLS, etc.)        │
  │ ABI stability    │ Excellent — kernel/userspace contract      │
  │ Dynamic linking  │ ld-linux.so.2 / ld-linux-x86-64.so.2     │
  │ Thread safety    │ Full pthreads + thread-local storage       │
  │ Target           │ Desktop, server Linux                     │
  └──────────────────┴──────────────────────────────────────────┘
```

### glibc Symbol Versioning

```bash
# Libraries use symbol versioning for ABI compatibility:
objdump -T /lib/x86_64-linux-gnu/libc.so.6 | grep "GLIBC_2.17" | head -5
# Each exported symbol is versioned: printf@@GLIBC_2.2.5
# Programs compiled against glibc 2.17 won't run on glibc 2.5

# Check minimum glibc version required by a binary:
objdump -p /bin/ls | grep GLIBC
# Version References: ... GLIBC_2.33, GLIBC_2.17, ...
```

---

## musl — Lightweight libc

Used in Alpine Linux, static-linked binaries, containers.

```
  Key characteristics:
  ┌──────────────────┬──────────────────────────────────────────┐
  │ Standards        │ POSIX, ISO C11 (no GNU extensions)       │
  │ Size (stripped)  │ ~500 KB (musl-libc.so)                   │
  │ Performance      │ Generally good; some hot paths slower     │
  │ ABI stability    │ Stable but NOT compatible with glibc      │
  │ Dynamic linking  │ musl-ld (ld-musl-x86_64.so.1)            │
  │ Thread safety    │ Full pthreads                             │
  │ Target           │ Containers, static bins, Alpine Linux     │
  └──────────────────┴──────────────────────────────────────────┘
```

### Alpine Linux / musl Build

```dockerfile
FROM alpine:3.19
# Alpine uses musl by default — images are tiny (5 MB base)
RUN apk add gcc musl-dev
# Static link for fully portable binary:
RUN gcc -static -o myapp myapp.c
```

```bash
# Cross-compile with musl:
apt install musl-tools
musl-gcc -static -o hello hello.c
ldd hello  # → not a dynamic executable (fully static)
```

---

## Bionic — Android libc

Google's libc for Android, derived from BSD libc:

```
  Key characteristics:
  ┌──────────────────┬──────────────────────────────────────────┐
  │ Standards        │ POSIX + Android extensions               │
  │ Size             │ Optimized for mobile (~700 KB)           │
  │ Performance      │ ARM/x86 optimized                        │
  │ Allocator        │ jemalloc (Android 5+) → scudo (Android 10+)│
  │ No              │ getpwent(), getgrent() (uses Android UID) │
  │ Target           │ Android (all versions)                   │
  └──────────────────┴──────────────────────────────────────────┘
  
  Notable: Bionic's linker is ld.so built into libc.so — the interpreter
  and libc are one binary (unlike glibc where ld-linux.so is separate).
```

---

## uClibc-ng — Micro C Library

Embedded Linux systems with tight size budgets:

```
  Key characteristics:
  ┌──────────────────┬──────────────────────────────────────────┐
  │ Standards        │ POSIX (most), C99                        │
  │ Size             │ ~500 KB or less (highly configurable)    │
  │ Configuration    │ Buildroot/menuconfig — enable/disable     │
  │ Target           │ OpenWrt routers, industrial Buildroot     │
  │ Toolchain        │ arm-linux-uclibcgnueabi-gcc              │
  └──────────────────┴──────────────────────────────────────────┘
```

---

## Newlib — Embedded / Bare-Metal

Used with MCU toolchains (ARM Cortex-M, RISC-V bare-metal):

```
  Key characteristics:
  ┌──────────────────┬──────────────────────────────────────────┐
  │ Standards        │ Partial POSIX, C99                       │
  │ Size             │ Very small — configurable                │
  │ OS dependency    │ None — stubs for syscalls (write, read…) │
  │ Retargetable     │ Yes — implement _write(), _sbrk(), etc.  │
  │ Target           │ Cortex-M, RISC-V bare-metal, RTOS        │
  └──────────────────┴──────────────────────────────────────────┘
```

```c
// Retargeting newlib: implement _write to send to UART
int _write(int fd, char *ptr, int len) {
    for (int i = 0; i < len; i++) {
        uart_send(ptr[i]);
    }
    return len;
}

// Now printf() outputs via UART (no OS needed)
```

---

## Comparison Table

```
  ┌─────────────────┬────────┬────────┬─────────┬────────┬──────────┐
  │ Feature         │ glibc  │ musl   │ Bionic  │ uClibc │ Newlib   │
  ├─────────────────┼────────┼────────┼─────────┼────────┼──────────┤
  │ Size            │ 2 MB   │ 500 KB │ 700 KB  │ <500KB │ Tiny     │
  │ POSIX complete  │ Yes    │ Most   │ Most    │ Partial│ No       │
  │ GNU extensions  │ Yes    │ No     │ No      │ Partial│ No       │
  │ Static linking  │ Yes*   │ Yes    │ No      │ Yes    │ Yes      │
  │ glibc ABI compat│ N/A    │ No     │ No      │ No     │ No       │
  │ Android         │ No     │ No     │ Yes     │ No     │ No       │
  │ Bare-metal      │ No     │ No     │ No      │ No     │ Yes      │
  │ Primary use     │ Desktop│ Alpine │ Android │ OpenWrt│ MCUs     │
  └─────────────────┴────────┴────────┴─────────┴────────┴──────────┘
  * glibc static links with dlopen/NSS limitations
```

---

## ABI Incompatibility

glibc and musl binaries are **not** cross-compatible:

```bash
# glibc binary on musl system (Alpine):
docker run alpine /bin/ls  # Works (Alpine's /bin/ls is musl)
docker run alpine /glibc_binary  # Fails: wrong ELF interpreter

# /lib/ld-musl-x86_64.so.1 ≠ /lib/x86_64-linux-gnu/ld-linux-x86-64.so.2

# Solution: statically link, or use gcompat layer on Alpine:
apk add gcompat  # Provides glibc compatibility layer
```

---

## Key Terms

| Term | Definition |
|------|-----------|
| libc | C standard library — syscall wrappers + stdlib |
| ABI | Application Binary Interface — calling convention + type layout |
| Symbol versioning | Tag exported symbols with library version (glibc) |
| ELF interpreter | Path to dynamic linker embedded in ELF header |
| Retargeting | Providing OS-specific stubs to newlib |
| Allocator | malloc implementation (glibc ptmalloc, musl, jemalloc, scudo) |
| Static linking | All library code in binary — no runtime deps |
| POSIX | Portable OS Interface standard — defines API contracts |

---

## See Also

- Library lab exercises → [../lessons/library_labs.md](../lessons/library_labs.md)
- Linker tools → [../man_pages/linker_commands.md](../man_pages/linker_commands.md)
- Container internals → [../../07_Runtime_Environment/topics/container_internals.md](../../07_Runtime_Environment/topics/container_internals.md)
