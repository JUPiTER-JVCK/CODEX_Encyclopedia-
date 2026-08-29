---
title: "Process Management Commands"
layer: 05_OS_Kernel
section: man_pages
tags: [ps, top, htop, kill, nice, renice, pidstat, pstree, chrt, taskset, man-section-1, man-section-8]
updated: 2026-05-21
---

# Process Management Commands

> Man sections 1 (user commands) and 8 (admin commands).
> These tools inspect, prioritize, and signal processes on a Unix/Linux system.

---

## ps — report process status

### Synopsis

```
ps [options]
```

### Description

Displays a snapshot of current processes. Supports both BSD-style (`aux`) and
POSIX-style (`-ef`) option sets — mixing them silently changes behavior.

### Key Options

| Flag | Style | Purpose |
|------|-------|---------|
| `aux` | BSD | All users, with CPU/MEM %, TTY, stat, start, command |
| `-e` / `-A` | POSIX | Select all processes |
| `-f` | POSIX | Full format (UID, PID, PPID, C, STIME, CMD) |
| `-o pid,user,%cpu,%mem,cmd` | POSIX | Custom output columns |
| `--sort=-%mem` | GNU | Sort descending by memory |
| `--forest` | GNU | Show process tree (ASCII art) |
| `-p <pid>` | POSIX | Show only the given PID |
| `-C <name>` | POSIX | Select by command name |

### Process states (`STAT` column)

```
  S = sleeping (interruptible)     R = running / runnable
  D = uninterruptible sleep (I/O)  Z = zombie (defunct)
  T = stopped (signal / debugger)  I = idle kernel thread (Linux 4.14+)

  Modifiers:
  < = high priority   N = low priority   s = session leader
  l = multi-threaded  + = foreground process group
```

### Examples

```bash
# Top 5 memory hogs
ps aux --sort=-%mem | head -6

# Process tree for a specific PID
ps --forest -p $(pgrep -d, nginx)

# Custom columns: PID, nice, scheduling class, command
ps -eo pid,ni,cls,comm --sort=-ni | head -20

# Find zombie processes
ps aux | awk '$8 ~ /Z/'
```

### See Also

- top(1), htop(1), pstree(1), kill(1)
- [../topics/INDEX.md](../topics/INDEX.md) — Process scheduling concepts

---

## top — live process monitor

### Synopsis

```
top [-d delay] [-p pid] [-u user] [-b]
```

### Description

Real-time, full-screen view of system processes sorted by CPU usage. Press
interactive keys to change sort, filter, toggle fields.

### Key interactive commands

| Key | Action |
|-----|--------|
| `1` | Toggle per-CPU view |
| `M` | Sort by memory |
| `P` | Sort by CPU (default) |
| `T` | Sort by cumulative time |
| `k` | Kill a process (enter PID + signal) |
| `r` | Renice a process |
| `f` | Field manager — add/remove/reorder columns |
| `c` | Toggle full command line |
| `H` | Toggle threads |
| `V` | Forest (tree) mode |
| `W` | Write config to `~/.toprc` |

### Header anatomy

```
  top - 14:23:01 up 42 days,  3:12,  2 users,  load average: 1.23, 0.98, 0.87
  Tasks: 312 total,   2 running, 310 sleeping,   0 stopped,   0 zombie
  %Cpu(s):  5.2 us,  1.1 sy,  0.0 ni, 93.2 id,  0.3 wa,  0.0 hi,  0.2 si
  MiB Mem:  32048.0 total,  12340.2 free,   8420.1 used,  11287.7 buff/cache
  MiB Swap:   8192.0 total,   8192.0 free,      0.0 used.  22180.3 avail Mem

     us = user       sy = system     ni = nice'd      id = idle
     wa = I/O wait   hi = hw IRQ     si = sw IRQ      st = steal (VM)
```

### Examples

```bash
# Batch mode, 1 iteration, sorted by memory (for scripting)
top -bn1 -o %MEM | head -20

# Monitor a specific user
top -u www-data

# Refresh every 0.5 s for a specific PID
top -d 0.5 -p 1234
```

---

## htop / btop — enhanced process viewers

### Synopsis

```
htop [-d delay] [-u user] [-p pid1,pid2,…] [-t]
btop [--utf-force] [-t]
```

### Description

`htop` — ncurses-based interactive process viewer with mouse support, tree
view, and process filtering. Color-coded CPU/memory bars.

`btop` — modern C++ replacement with GPU monitoring, network I/O, and disk
activity in a single dashboard. Uses box-drawing characters.

### htop key bindings

| Key | Action |
|-----|--------|
| `F1` / `?` | Help |
| `F2` | Setup (columns, colors, meters) |
| `F3` | Search process name |
| `F4` | Filter (incremental) |
| `F5` | Tree view |
| `F6` | Sort by column |
| `F9` | Kill — choose signal |
| `F10` | Quit |
| `Space` | Tag a process |
| `U` | Un-tag all |
| `u` | Show only a specific user |
| `l` | Open files (`lsof -p PID`) |
| `s` | Strace attach |

### Examples

```bash
# Tree mode, filter for "python"
htop -t --filter=python

# btop with forced UTF-8 for SSH sessions
btop --utf-force
```

---

## pidstat — per-process statistics over time

### Synopsis

```
pidstat [options] [interval [count]]
```

### Description

Part of `sysstat`. Reports CPU, memory, I/O, context switches, and stack
usage for individual processes or threads at regular intervals.

### Key Options

| Flag | Purpose |
|------|---------|
| `-u` | CPU usage (default) |
| `-r` | Memory (RSS, VSZ, %MEM) |
| `-d` | I/O statistics (kB_rd/s, kB_wr/s) |
| `-w` | Context switches (cswch/s, nvcswch/s) |
| `-t` | Show threads |
| `-p <pid>` | Monitor specific PID |
| `-C <name>` | Filter by command name regex |

### Examples

```bash
# CPU and I/O for PID 5678, every 2 s, 10 samples
pidstat -u -d -p 5678 2 10

# Context switches for all Python processes
pidstat -w -C python 1
```

---

## pstree — display process tree

### Synopsis

```
pstree [-p] [-u] [-a] [-h] [pid|user]
```

### Description

Shows running processes as a tree. Merges identical branches by default
(`─3*[worker]`). Highlights the current process with `-h`.

### Examples

```bash
# Full tree with PIDs
pstree -p

# Tree for user "deploy" with command-line args
pstree -a deploy

# Compact tree for PID 1 (init/systemd)
pstree -c 1
```

```
  systemd─┬─sshd───sshd───bash───pstree
          ├─nginx───4*[nginx]
          ├─postgres───6*[postgres]
          └─systemd-journal
```

---

## nice / renice — adjust scheduling priority

### Synopsis

```
nice [-n adjustment] command [args…]
renice [-n priority] [-p pid] [-u user] [-g pgrp]
```

### Description

`nice` launches a command with a modified niceness. `renice` changes the
niceness of a running process. Niceness ranges from **-20** (highest priority)
to **19** (lowest). Only root can set negative niceness.

```
  Priority scale:
  -20 ────────── 0 ────────── 19
  highest        default      lowest
  (more CPU)                  (less CPU)
```

### Examples

```bash
# Start a backup at lowest priority
nice -n 19 tar czf /backup/home.tar.gz /home

# Boost a running build
sudo renice -n -5 -p $(pgrep make)

# Lower priority for all processes owned by "batch"
sudo renice -n 10 -u batch
```

---

## chrt — set real-time scheduling attributes

### Synopsis

```
chrt [options] priority command [args…]
chrt [options] -p [priority] pid
```

### Description

Sets or queries the real-time scheduling class and priority of a process.
Linux scheduling classes:

| Class | Policy | Notes |
|-------|--------|-------|
| SCHED_OTHER / SCHED_NORMAL | `--other` | Default CFS (niceness-based) |
| SCHED_FIFO | `--fifo` | RT first-in-first-out (priority 1–99) |
| SCHED_RR | `--rr` | RT round-robin (priority 1–99) |
| SCHED_BATCH | `--batch` | Non-interactive batch |
| SCHED_IDLE | `--idle` | Ultra-low priority |
| SCHED_DEADLINE | `--deadline` | EDF with runtime/deadline/period |

### Examples

```bash
# Run a latency-sensitive process with FIFO priority 50
sudo chrt --fifo 50 ./audio_engine

# Query current scheduling of PID
chrt -p 1234

# Set SCHED_DEADLINE (runtime 5ms, deadline 10ms, period 10ms)
sudo chrt --deadline --sched-runtime 5000000 \
  --sched-deadline 10000000 --sched-period 10000000 0 ./rt_task
```

---

## taskset — set CPU affinity

### Synopsis

```
taskset [options] mask command [args…]
taskset [options] -p [mask] pid
```

### Description

Binds a process to specific CPUs. The mask is a hex bitmask or a list.
`-c` uses the human-friendly list form.

### Examples

```bash
# Pin to CPUs 0 and 1
taskset -c 0,1 ./worker

# Pin a running process to CPU 3
taskset -p -c 3 $(pgrep worker)

# Query affinity
taskset -p 1234
# pid 1234's current affinity mask: f  (CPUs 0-3)
```

---

## kill / pkill / killall — send signals

### Synopsis

```
kill [-signal] pid…
pkill [-signal] [-f] pattern
killall [-signal] name
```

### Description

Sends a signal to one or more processes. Default signal is `SIGTERM` (15).

### Common signals

| Signal | Number | Default action | Use |
|--------|--------|----------------|-----|
| `SIGHUP` | 1 | Terminate | Reload config (convention) |
| `SIGINT` | 2 | Terminate | Ctrl+C |
| `SIGQUIT` | 3 | Core dump | Ctrl+\ |
| `SIGKILL` | 9 | Terminate (uncatchable) | Force kill |
| `SIGTERM` | 15 | Terminate | Graceful shutdown |
| `SIGSTOP` | 19 | Stop (uncatchable) | Pause |
| `SIGCONT` | 18 | Continue | Resume paused process |
| `SIGUSR1` | 10 | User-defined | App-specific (e.g., log rotate) |
| `SIGUSR2` | 12 | User-defined | App-specific |

### Examples

```bash
# Graceful stop
kill 1234

# Force kill
kill -9 1234

# Kill all matching a regex
pkill -f "python.*worker"

# Send SIGHUP to all nginx workers
killall -HUP nginx

# List available signals
kill -l
```

---

## Cross-links

- Memory commands → [memory_commands.md](memory_commands.md)
- Tracing / debugging → [tracing_commands.md](tracing_commands.md)
- OS Kernel topics → [../topics/INDEX.md](../topics/INDEX.md)
- CPU pipeline (scheduling context) → [../../02_CPU/topics/cpu_pipeline.md](../../02_CPU/topics/cpu_pipeline.md)
