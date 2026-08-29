
## Dedicated Topic Deep Dives

| File | Covers |
|------|--------|
| [Virtual Memory](./virtual_memory.md) | Page tables, TLB, mmap, huge pages, ASLR |

# OS Kernel — Topics

## Process & scheduling
- **Process / thread model** — `task_struct`, fork/clone/exec, exit/wait.
- **Schedulers** — CFS, EEVDF (Linux), Mach scheduler (XNU), Windows scheduler.
- **Realtime classes** — SCHED_FIFO, SCHED_RR, SCHED_DEADLINE; PREEMPT_RT.
- **Context switching** — kernel/user stack swap, FPU lazy save.

## Memory management
- **Virtual memory** — page tables, TLB, demand paging, COW, swap.
- **Allocators** — buddy, slab/slub/slob, vmalloc, kmalloc.
- **Memory cgroups & OOM** — limits, reclaim, oom_score.
- **HugePages / Transparent HugePages**, **memory compaction**.

## Filesystems
- **VFS abstractions** — superblock, inode, dentry, file.
- **Common FS** — ext4, xfs, btrfs, zfs, apfs, ntfs, refs.
- **Network FS** — NFS, SMB/CIFS, 9P.
- **Pseudo FS** — procfs, sysfs, debugfs, tmpfs, cgroupfs.
- **FUSE** — userspace filesystems.

## IPC
- **Pipes & FIFOs**, **Unix domain sockets**, **POSIX/SysV shared memory / semaphores / msg queues**.
- **eventfd, signalfd, timerfd**, **futex** (Linux).
- **Mach ports** (XNU), **ALPC** (Windows).

## Network stack inside the kernel
- **Socket layer** → protocol families → IP/TCP/UDP → netdev → driver.
- **NAPI, XDP, eBPF/XDP**, **TC (traffic control)**.

## Security / isolation
- **Privilege rings, capabilities, ACLs**.
- **LSMs** — SELinux, AppArmor, Smack, Yama, Landlock.
- **seccomp-BPF**, **seccomp_unotify**.
- **Namespaces** — pid, mnt, net, uts, ipc, user, cgroup, time.
- **Cgroups v1 & v2** — cpu, memory, io, pids, devices.

## Virtualization
- **KVM** — `/dev/kvm`, VM exits, virtio.
- **Hyper-V**, **VMware ESXi**, **Xen** (PV / HVM).
- **Containers** — runc, crun, containerd, CRI-O.

## Boot & init
- **Bootloader → kernel handoff** (zImage, vmlinuz, EFI stub).
- **initramfs / initrd**.
- **init systems** — systemd, OpenRC, launchd, SMF, Windows Service Manager.

## Observability
- **ftrace, kprobes, uprobes, tracepoints, USDT**.
- **eBPF programs & maps** — kprobe, uprobe, tracepoint, perf_event, XDP, TC.

## Security cross-link
- Rootkits, LKM injection, eBPF abuse → [14_Security/topics](../../14_Security/topics/INDEX.md)
