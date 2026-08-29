# OS Kernel — Lessons

## Dedicated lesson modules

| Topic | File |
|-------|------|
| Kernel interactive labs | [kernel_labs.md](kernel_labs.md) — Build & boot, custom syscall, eBPF, namespace container |

---

1. **Build a kernel** — fetch Linux source, `make defconfig && make -j$(nproc)`, boot under QEMU.
2. **Add a custom syscall** — register, implement, call from userspace.
3. **Trace boot** — `dmesg`, `printk` placement, kernel command line.
4. **Process & scheduler** — read `task_struct`, write a small CFS / EEVDF probe with bpftrace.
5. **Memory management** — page tables, slab allocators (`/proc/slabinfo`), OOM behavior.
6. **VFS & filesystems** — write a minimal FUSE filesystem; understand the inode/dentry cache.
7. **Networking subsystem** — packet path: NIC → IRQ → softirq → protocol → socket → app.
8. **Namespaces & cgroups** — build a container by hand with `unshare`, `nsenter`, `cgcreate`.
9. **seccomp & capabilities** — sandbox a binary with `seccomp-bpf` filter.
10. **eBPF program** — XDP packet counter, kprobe latency histogram, USDT trace.
11. **Hypervisor 101** — KVM/QEMU: launch a VM, understand `vcpu`, virtio.
12. **Microkernel touch** — boot seL4 / MINIX 3 in QEMU; observe IPC.

## Suggested external
- OSTEP labs (xv6) — write parts of a teaching OS.
- Linux Kernel Newbies — `https://kernelnewbies.org/`
- Brendan Gregg's BPF performance tools series.
