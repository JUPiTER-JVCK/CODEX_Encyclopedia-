---
title: "OS Kernel — Interactive Labs"
layer: 05_OS_Kernel
section: lessons
tags: [lesson, kernel, linux, build, syscall, ebpf, namespace, lab, quiz, hands-on]
updated: 2026-05-21
---

# OS Kernel — Interactive Labs

---

## Module 1: Build & Boot a Linux Kernel

### Objective

Build the Linux kernel from source, boot it under QEMU, and verify
with dmesg. Understand the kernel build system.

### Prerequisites

- Linux host with `build-essential flex bison libelf-dev libssl-dev bc`
- QEMU installed, ~2 GB disk space for source

### Lab Steps

1. Fetch and extract:
```bash
wget https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-6.9.tar.xz
tar xf linux-6.9.tar.xz && cd linux-6.9
```

2. Configure:
```bash
make defconfig          # default config for your arch
# Or: make menuconfig   # interactive TUI configuration
```

3. Build:
```bash
make -j$(nproc)         # parallel build
# Output: arch/x86/boot/bzImage (compressed kernel)
```

4. Boot in QEMU (using host filesystem as root):
```bash
qemu-system-x86_64 -kernel arch/x86/boot/bzImage \
  -append "console=ttyS0 root=/dev/sda rw" \
  -nographic -m 1G
```

5. Verify:
```bash
uname -r     # should show 6.9.0
dmesg | head -20
```

### Kernel build artifacts

```
  linux-6.9/
  ├── .config                 ← kernel configuration
  ├── vmlinux                 ← uncompressed kernel (debug)
  ├── arch/x86/boot/
  │   └── bzImage             ← compressed bootable kernel
  ├── modules/                ← built kernel modules (.ko)
  └── System.map              ← symbol → address mapping
```

### Knowledge Check

**Q1**: What is the difference between `vmlinux` and `bzImage`?

> **A1**: `vmlinux` is the raw uncompressed kernel ELF binary (useful for
> debugging with GDB). `bzImage` is the compressed, bootable image with
> a decompressor stub — what the bootloader actually loads.

**Q2**: What does `make defconfig` do?

> **A2**: Creates a `.config` file with the architecture's default options.
> It enables common drivers and features but skips exotic hardware. For
> production, distributions use heavily customized configs.

---

## Module 2: Custom Syscall

### Objective

Add a custom system call to the Linux kernel, rebuild, and call it
from userspace.

### Lab Steps

1. Add syscall entry to the table:
```bash
# arch/x86/entry/syscalls/syscall_64.tbl — add at end:
# 451  common  hello_syscall  sys_hello_syscall
```

2. Implement the syscall:
```c
// kernel/hello_syscall.c
#include <linux/kernel.h>
#include <linux/syscalls.h>

SYSCALL_DEFINE1(hello_syscall, int, num) {
    pr_info("hello_syscall called with arg: %d\n", num);
    return num * 2;
}
```

3. Add to build system:
```makefile
# kernel/Makefile — add:
obj-y += hello_syscall.o
```

4. Rebuild and boot, then test from userspace:
```c
// test_syscall.c
#include <stdio.h>
#include <unistd.h>
#include <sys/syscall.h>
#define SYS_hello 451

int main() {
    long ret = syscall(SYS_hello, 21);
    printf("Syscall returned: %ld\n", ret);  // Expected: 42
    return 0;
}
```

### Knowledge Check

**Q1**: Why can't you just add a function to the kernel and call it from userspace?

> **A1**: User and kernel run in different privilege levels (rings 0 vs 3)
> with separate address spaces. Syscalls are the controlled interface:
> they validate arguments, switch privilege, and return safely.

---

## Module 3: eBPF Tracing

### Objective

Write an eBPF program that traces system calls in real time, using
`bpftrace` for rapid prototyping.

### Lab Steps

1. Trace all `open` syscalls:
```bash
sudo bpftrace -e 'tracepoint:syscalls:sys_enter_openat {
    printf("%s opened %s\n", comm, str(args->filename));
}'
```

2. Count syscalls by process:
```bash
sudo bpftrace -e 'tracepoint:raw_syscalls:sys_enter {
    @[comm] = count();
}'
# Ctrl+C to see results
```

3. Latency histogram for read syscalls:
```bash
sudo bpftrace -e '
tracepoint:syscalls:sys_enter_read { @start[tid] = nsecs; }
tracepoint:syscalls:sys_exit_read /@start[tid]/ {
    @usecs = hist((nsecs - @start[tid]) / 1000);
    delete(@start[tid]);
}'
```

---

## Module 4: Container from Namespaces

### Objective

Build a minimal container by hand using Linux namespaces, understanding
what Docker/Podman do under the hood.

### Lab Steps

1. Create isolated namespaces:
```bash
# New PID + mount + UTS + network namespace
sudo unshare --pid --fork --mount-proc --uts --net bash

# Inside the new namespace:
hostname container-lab    # isolated hostname
ps aux                    # only see processes in this namespace
ip link                   # only loopback (no host network)
```

2. Add a filesystem:
```bash
# On host, prepare a root filesystem:
sudo debootstrap bookworm /tmp/container-root

# Enter with pivot_root:
sudo unshare --pid --fork --mount-proc --uts --net \
  chroot /tmp/container-root /bin/bash
```

3. Add networking:
```bash
# On host: create veth pair
sudo ip link add veth-host type veth peer name veth-container
sudo ip link set veth-container netns <PID>
# Inside namespace:
ip addr add 10.0.0.2/24 dev veth-container
ip link set veth-container up
```

### Review Flashcards

| Term | Definition |
|------|-----------|
| vmlinux | Uncompressed kernel ELF binary |
| bzImage | Compressed bootable kernel image |
| .config | Kernel build configuration file |
| System call | Controlled kernel entry point from userspace |
| eBPF | In-kernel virtual machine for safe tracing/filtering |
| bpftrace | High-level eBPF tracing language |
| Namespace | Kernel isolation primitive (PID, net, mount, UTS, user, IPC) |
| cgroup | Resource limiting (CPU, memory, I/O) for process groups |
| unshare | Create new namespaces for a process |

### Challenge

> Combine namespaces + cgroups to build a container that is:
> - PID-isolated (can't see host processes)
> - Network-isolated (own IP address via veth)
> - Memory-limited to 128 MB via cgroup v2
> - Has its own root filesystem
> Document each step. Compare to `docker run` — what's different?

---

## Cross-links

- Kernel tools → [../man_pages/process_commands.md](../man_pages/process_commands.md)
- Container commands → [../../07_Runtime_Environment/man_pages/container_commands.md](../../07_Runtime_Environment/man_pages/container_commands.md)
- Driver labs → [../../04_Device_Drivers/lessons/driver_labs.md](../../04_Device_Drivers/lessons/driver_labs.md)
