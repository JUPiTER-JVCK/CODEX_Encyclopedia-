---
title: "Tracing & Debugging Commands"
layer: 05_OS_Kernel
section: man_pages
tags: [strace, ltrace, perf, bpftrace, bcc, ftrace, dmesg, sysctl, tracing, debugging, man-section-1, man-section-8]
updated: 2026-05-21
---

# Tracing & Debugging Commands

> Kernel and userspace tracing, performance counters, and runtime tuning.
> Essential for understanding what a program or the kernel is actually doing.

---

## strace — trace system calls

### Synopsis

```
strace [-e trace=set] [-p pid] [-o file] [-f] [-c] [-T] command [args…]
```

### Description

Intercepts and records system calls made by a process, showing the call name,
arguments, and return value. Uses `ptrace(2)` — adds overhead but requires
no kernel modules.

### Key Options

| Flag | Purpose |
|------|---------|
| `-e trace=open,read,write` | Filter to specific syscalls |
| `-e trace=network` | Only network-related syscalls |
| `-e trace=file` | Only file-related syscalls |
| `-e trace=process` | fork, exec, exit, wait |
| `-f` | Follow child processes (forks) |
| `-p <pid>` | Attach to a running process |
| `-c` | Summary: count, time, errors per syscall |
| `-T` | Show time spent in each syscall |
| `-t` / `-tt` / `-ttt` | Timestamps (s / µs / epoch) |
| `-o trace.log` | Write output to file |
| `-y` | Print file descriptor paths |
| `-e signal=none` | Suppress signal delivery messages |

### Examples

```bash
# What files does a command open?
strace -e trace=openat,access ls /tmp 2>&1 | head

# Attach to a running server, follow forks, save to file
strace -f -o /tmp/nginx.trace -p $(pgrep -o nginx)

# Summary: where does this command spend time?
strace -c -S time curl -so /dev/null https://example.com
# % time     seconds  usecs/call     calls    errors syscall
# ------ ----------- ----------- --------- --------- --------
#  45.23    0.012345         123       100           read
#  30.12    0.008234          82       100           write
#   ...

# Show file descriptor paths
strace -yy -e trace=read,write -p 1234
```

---

## ltrace — trace library calls

### Synopsis

```
ltrace [-e fn_name] [-p pid] [-o file] [-c] command [args…]
```

### Description

Like `strace` but for shared library calls (`libc`, `libssl`, etc.) instead
of syscalls. Shows function names, arguments, and return values.

### Examples

```bash
# Trace malloc/free calls
ltrace -e malloc+free ./myapp

# Trace all libssl calls
ltrace -e '@libssl.so*' ./myapp

# Summary of library call counts
ltrace -c ./myapp
```

---

## perf — performance counters and profiling

### Synopsis

```
perf stat [-e event] command
perf record [-g] [-F freq] command
perf report [--stdio]
perf top [-e event]
perf trace [command]
```

### Description

Linux's primary profiling tool. Uses hardware performance counters (PMU) and
software tracepoints. Low overhead compared to `strace`.

### Key subcommands

| Subcommand | Purpose |
|------------|---------|
| `perf stat` | Count events (cycles, instructions, cache misses, branches) |
| `perf record` | Sample-based profiling → `perf.data` |
| `perf report` | Analyze `perf.data` (interactive or `--stdio`) |
| `perf top` | Live sampling (like `top` for functions) |
| `perf trace` | Low-overhead `strace` replacement |
| `perf annotate` | Source/assembly annotated with samples |
| `perf sched` | Scheduler analysis |
| `perf mem` | Memory access profiling |

### Common events (`perf list` for full list)

```
  cycles                  instructions            cache-references
  cache-misses            branch-instructions     branch-misses
  L1-dcache-load-misses   LLC-load-misses         page-faults
  context-switches        cpu-migrations          task-clock
```

### Examples

```bash
# Quick stat: IPC, cache miss rate, branch prediction
perf stat -e cycles,instructions,cache-misses,branch-misses ./myapp
# Performance counter stats for './myapp':
#    1,234,567,890  cycles
#    2,345,678,901  instructions  #  1.90 IPC
#          456,789  cache-misses  #  2.34% of cache refs
#           12,345  branch-misses #  0.56% of branches

# Record call-graph samples at 99 Hz
perf record -g -F 99 -- ./myapp
perf report --stdio

# Live top-down function hotspots
sudo perf top -e cycles

# Low-overhead syscall trace (replaces strace for profiling)
perf trace -- curl -so /dev/null https://example.com
```

---

## bpftrace — high-level eBPF tracing

### Synopsis

```
bpftrace -e 'program'
bpftrace script.bt
```

### Description

AWK-like scripting language for eBPF. Attaches to kprobes, uprobes,
tracepoints, USDT probes. Runs in-kernel — minimal overhead.

### Probe types

| Probe | Syntax | Example |
|-------|--------|---------|
| Tracepoint | `tracepoint:category:name` | `tracepoint:syscalls:sys_enter_openat` |
| Kprobe | `kprobe:func` | `kprobe:tcp_sendmsg` |
| Kretprobe | `kretprobe:func` | `kretprobe:vfs_read` |
| Uprobe | `uprobe:path:func` | `uprobe:/usr/bin/python3:_PyEval_EvalFrameDefault` |
| USDT | `usdt:path:probe` | `usdt:/usr/sbin/mysqld:query__start` |
| Profile | `profile:hz:freq` | `profile:hz:99` |
| Interval | `interval:s:N` | `interval:s:5` |

### Examples

```bash
# Histogram of read() sizes
sudo bpftrace -e 'tracepoint:syscalls:sys_exit_read /args->ret > 0/ {
    @bytes = hist(args->ret);
}'

# Top 10 syscalls by count (5 second sample)
sudo bpftrace -e 'tracepoint:raw_syscalls:sys_enter { @[comm] = count(); }
    interval:s:5 { print(@, 10); clear(@); }'

# Latency of disk I/O
sudo bpftrace -e 'kprobe:blk_account_io_start { @start[arg0] = nsecs; }
    kprobe:blk_account_io_done /@start[arg0]/ {
    @usecs = hist((nsecs - @start[arg0]) / 1000);
    delete(@start[arg0]); }'
```

---

## bcc-tools — eBPF tool suite

### Description

Pre-built eBPF tools from the BCC project. Each tool is a focused
single-purpose tracer.

### Essential tools

| Tool | Purpose |
|------|---------|
| `execsnoop` | Trace new process executions |
| `opensnoop` | Trace file opens |
| `biolatency` | Block I/O latency histogram |
| `tcplife` | TCP session lifetimes (src, dst, bytes, duration) |
| `tcpconnect` | Trace outbound TCP connections |
| `tcpretrans` | Trace TCP retransmissions |
| `runqlat` | CPU scheduler run-queue latency |
| `cachestat` | Page cache hit/miss ratio |
| `ext4slower` | Slow ext4 filesystem operations |
| `funccount` | Count function calls (`funccount 'tcp_*'`) |
| `profile` | CPU profiling via stack sampling |
| `trace` | Ad-hoc function tracing with printf |

### Examples

```bash
# What processes are being launched?
sudo execsnoop

# Slow disk I/O (>10ms)
sudo biolatency -m

# TCP connections: who, where, how long, how much
sudo tcplife

# Page cache hit rate
sudo cachestat 1
```

---

## dmesg — kernel ring buffer

### Synopsis

```
dmesg [-T] [-l level] [-f facility] [-w] [--color=always]
```

### Description

Reads the kernel log ring buffer (`/dev/kmsg`). Shows boot messages, hardware
detection, driver errors, OOM kills, filesystem warnings.

### Key Options

| Flag | Purpose |
|------|---------|
| `-T` | Human-readable timestamps |
| `-H` | Human-readable + pager (color, reltime) |
| `-w` | Follow (like `tail -f`) |
| `-l err,warn` | Filter by log level |
| `-f kern` | Filter by facility |
| `--since '5 minutes ago'` | Time filter (systemd) |
| `-C` | Clear the ring buffer (root) |

### Examples

```bash
# Colored, human timestamps, follow
dmesg -TH -w

# Only errors and warnings
dmesg -T -l err,warn

# Hardware detection at boot
dmesg | grep -i 'usb\|pci\|ata\|nvme'

# Check for OOM kills
dmesg -T | grep -i 'oom\|killed process'
```

---

## sysctl — kernel parameter tuning

### Synopsis

```
sysctl [-a] [-w] [-p file] key[=value]
```

### Description

Reads and writes kernel parameters at runtime via `/proc/sys/`. Changes are
volatile unless written to `/etc/sysctl.conf` or `/etc/sysctl.d/*.conf`.

### Essential parameters

| Key | Default | Purpose |
|-----|---------|---------|
| `vm.swappiness` | 60 | Preference for swapping (0 = avoid, 100 = aggressive) |
| `vm.overcommit_memory` | 0 | 0 = heuristic, 1 = always, 2 = strict |
| `vm.dirty_ratio` | 20 | % of RAM for dirty pages before sync |
| `net.core.somaxconn` | 4096 | Max listen queue backlog |
| `net.ipv4.tcp_tw_reuse` | 2 | Reuse TIME_WAIT sockets |
| `net.ipv4.ip_forward` | 0 | Enable IP forwarding (routing) |
| `kernel.pid_max` | 32768 | Maximum PID value |
| `fs.file-max` | varies | System-wide file descriptor limit |
| `fs.inotify.max_user_watches` | 8192 | inotify watch limit (increase for IDEs) |

### Examples

```bash
# List all parameters
sysctl -a | wc -l   # typically 1000+

# Read a specific parameter
sysctl vm.swappiness

# Set at runtime
sudo sysctl -w vm.swappiness=10

# Apply from config file
sudo sysctl -p /etc/sysctl.d/99-custom.conf

# Persistent: write to /etc/sysctl.d/
echo "fs.inotify.max_user_watches=524288" | sudo tee /etc/sysctl.d/60-inotify.conf
sudo sysctl --system
```

---

## Cross-links

- Process commands → [process_commands.md](process_commands.md)
- Memory commands → [memory_commands.md](memory_commands.md)
- CPU pipeline → [../../02_CPU/topics/cpu_pipeline.md](../../02_CPU/topics/cpu_pipeline.md)
- Security (eBPF, seccomp) → [../../14_Security/topics/INDEX.md](../../14_Security/topics/INDEX.md)
