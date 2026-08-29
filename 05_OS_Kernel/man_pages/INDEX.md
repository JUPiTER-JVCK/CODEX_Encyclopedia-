# OS Kernel — Manual Pages

## Dedicated man page references

| Topic | File |
|-------|------|
| Process management | [process_commands.md](process_commands.md) — ps, top, htop, kill, nice, chrt, taskset |
| Memory management | [memory_commands.md](memory_commands.md) — free, vmstat, slabtop, smem, pmap |
| Filesystem tools | [filesystem_commands.md](filesystem_commands.md) — mount, df, du, stat, lsof, fuser, inotifywait |
| Tracing & debugging | [tracing_commands.md](tracing_commands.md) — strace, perf, bpftrace, bcc-tools, dmesg, sysctl |

---

## Process / scheduling
| Command | Purpose |
|---------|---------|
| `ps` | Process snapshot |
| `top` / `htop` / `btop` | Live process view |
| `pidstat` | Per-process stats over time |
| `pstree` | Parent/child tree |
| `nice` / `renice` | Adjust niceness |
| `chrt` | Realtime scheduling class |
| `taskset` | CPU affinity |

## Memory
| Command | Purpose |
|---------|---------|
| `free` | Total/used memory |
| `vmstat` | Virtual memory + system activity |
| `slabtop` | Slab allocator usage |
| `smem` | PSS/USS memory accounting |
| `numastat` | NUMA memory stats |
| `pmap` | Process memory map |

## Filesystem / VFS
| Command | Purpose |
|---------|---------|
| `mount` / `umount` | Attach/detach filesystems |
| `df` / `du` | Space usage |
| `stat` | inode info |
| `lsof` | List open files |
| `fuser` | Identify processes using a file |
| `inotifywait` | Watch FS events |

## Tracing / debugging
| Command | Purpose |
|---------|---------|
| `strace` | Trace syscalls |
| `ltrace` | Trace library calls |
| `perf` | Performance counters & sampling |
| `bpftrace` | High-level eBPF tracing language |
| `bcc-tools` | eBPF tool suite (`execsnoop`, `opensnoop`, ...) |
| `ftrace` (via tracefs) | In-kernel function tracer |
| `dmesg` | Kernel ring buffer |
| `sysctl` | Read/write kernel parameters |
| `crash` | Post-mortem vmcore analysis |
| `gdb vmlinux` | Live or vmcore kernel debug |

## Namespaces / cgroups (Linux)
| Command | Purpose |
|---------|---------|
| `lsns` | List namespaces |
| `nsenter` | Enter an existing namespace |
| `unshare` | Run a command in a new namespace |
| `systemd-cgls` / `systemd-cgtop` | Cgroup tree / live view |

## macOS
- `dtrace`, `dtruss`, `sysdiagnose`, `spindump`, `fs_usage`, `vm_stat`

## Windows
- `tasklist`, `wmic process`, `procmon`, `procexp`, `xperf`, `WPA` (Windows Performance Analyzer)
