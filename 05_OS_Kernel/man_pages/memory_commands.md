---
title: "Memory Management Commands"
layer: 05_OS_Kernel
section: man_pages
tags: [free, vmstat, slabtop, smem, pmap, numastat, memory, man-section-1, man-section-8]
updated: 2026-05-21
---

# Memory Management Commands

> Tools for inspecting physical memory, virtual memory, swap, NUMA topology,
> and per-process memory maps on Linux/Unix systems.

---

## free — display memory usage

### Synopsis

```
free [-b|-k|-m|-g|-h] [-s interval] [-c count] [-t] [-w]
```

### Description

Shows total, used, free, shared, buff/cache, and available memory.
**Available** (not "free") is the real indicator of how much memory a new
process can use without swapping.

### Key Options

| Flag | Purpose |
|------|---------|
| `-h` | Human-readable (GiB/MiB) |
| `-w` | Wide mode — separates buffers and cache columns |
| `-s 2` | Repeat every 2 seconds |
| `-c 5` | Stop after 5 iterations |
| `-t` | Show totals row (RAM + swap) |

### Output anatomy

```
               total        used        free      shared  buff/cache   available
Mem:            31Gi       8.2Gi       12Gi       420Mi       11Gi        22Gi
Swap:          8.0Gi          0B       8.0Gi

  total     = physical RAM installed
  used      = total - free - buffers - cache
  free      = completely unused
  buff/cache = kernel buffers + page cache (reclaimable under pressure)
  available = estimated memory available for new allocations without swapping
```

### Examples

```bash
# Human-readable, wide
free -hw

# Watch every 2 seconds, 10 times
free -hs 2 -c 10
```

---

## vmstat — virtual memory statistics

### Synopsis

```
vmstat [options] [interval [count]]
```

### Description

Reports process, memory, swap, I/O, system, and CPU activity. The first line
is an average since boot; subsequent lines are per-interval.

### Output columns

```
  procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
   r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st

  r  = runnable processes           b  = blocked (uninterruptible)
  swpd = swap used                  si/so = swap in/out (pages/s)
  bi/bo = block I/O in/out          in = interrupts/s
  cs = context switches/s           us/sy/id/wa/st = CPU %
```

### Key Options

| Flag | Purpose |
|------|---------|
| `-a` | Active/inactive memory instead of buff/cache |
| `-s` | Memory event counter summary |
| `-d` | Disk statistics |
| `-p <partition>` | Per-partition I/O |
| `-w` | Wide output |
| `-S M` | Display in MiB |

### Examples

```bash
# Every 1 s, 20 samples, wide
vmstat -w 1 20

# Disk statistics
vmstat -d

# Memory event counters
vmstat -s
```

---

## slabtop — kernel slab allocator stats

### Synopsis

```
slabtop [-d delay] [-s {a|b|c|l|n|o|p|s|u}] [-o]
```

### Description

Displays the kernel's slab cache usage in real-time. Slabs are fixed-size
pools for frequently allocated kernel objects (inodes, dentries, task_struct,
etc.).

### Examples

```bash
# Sort by cache size, one-shot
slabtop -o -s c | head -20

# Live, sorted by number of objects
slabtop -s o
```

```
  Active / Total Objects (% used)    : 1523456 / 1678234 (90.8%)
  Active / Total Slabs (% used)      : 42345 / 42345 (100.0%)

  OBJS    ACTIVE  USE OBJ SIZE  SLABS OBJ/SLAB CACHE SIZE  NAME
  456789  432100  94%    0.19K  11337       40     45348K   dentry
  234567  230000  98%    0.10K   6015       39     24060K   buffer_head
  123456  120000  97%    1.06K   4115       30    131680K   ext4_inode_cache
```

---

## smem — memory reporting with PSS/USS

### Synopsis

```
smem [-p] [-u] [-k|-m|-g] [-s field] [-r] [-t]
```

### Description

Reports memory using **PSS** (Proportional Set Size) and **USS** (Unique Set
Size), which account for shared library pages proportionally. More accurate
than RSS for multi-process applications.

```
  ┌─────────────────────────────────────┐
  │ VSZ (virtual)                       │  Full address space (inc. unmapped)
  │  ┌──────────────────────────┐       │
  │  │ RSS (resident)           │       │  Pages in physical RAM
  │  │  ┌───────────────┐       │       │
  │  │  │ PSS            │       │       │  RSS, shared pages / N sharers
  │  │  │  ┌────────┐    │       │       │
  │  │  │  │ USS    │    │       │       │  Truly private pages
  │  │  │  └────────┘    │       │       │
  │  │  └───────────────┘       │       │
  │  └──────────────────────────┘       │
  └─────────────────────────────────────┘
```

### Examples

```bash
# Per-process PSS, sorted descending, human-readable
smem -k -s pss -r

# Per-user summary
smem -u -k -s pss

# Per-mapping (libraries) for a specific PID
smem -m -p -P "^python"
```

---

## numastat — NUMA memory statistics

### Synopsis

```
numastat [-c] [-m] [-n] [-p pid] [-s node] [-z]
```

### Description

Reports NUMA hit/miss/foreign statistics per node. Critical for HPC and
database workloads where cross-node memory access adds latency.

### Examples

```bash
# Per-node summary
numastat

# Per-process NUMA allocation
numastat -p $(pgrep postgres)

# Compact per-node memory info (like /proc/meminfo per node)
numastat -m -c
```

---

## pmap — process memory map

### Synopsis

```
pmap [-x|-X|-XX] pid…
```

### Description

Displays the memory map of a process — every mapped region with address,
size, permissions, and backing file (or `[anon]`, `[heap]`, `[stack]`).

### Key Options

| Flag | Purpose |
|------|---------|
| `-x` | Extended: RSS, Dirty, Mode, Mapping |
| `-X` | Extra-extended (kernel smaps data) |
| `-XX` | All available fields from `/proc/PID/smaps` |

### Examples

```bash
# Extended map for PID 1234
pmap -x 1234

# Full smaps detail
pmap -XX 1234 | head -40
```

```
  Address           Kbytes     RSS   Dirty Mode  Mapping
  00005600a0000000      48      48       0 r-x-- myapp
  00005600a200d000       4       4       4 r---- myapp
  00005600a200e000       4       4       4 rw--- myapp
  00005600a3400000    1280    1156    1156 rw---   [ anon ]    ← heap
  00007f8a40000000  131072    8192    8192 rw---   [ anon ]    ← mmap
  00007ffd5e600000     132      24      24 rw---   [ stack ]
```

---

## Cross-links

- Process commands → [process_commands.md](process_commands.md)
- Filesystem commands → [filesystem_commands.md](filesystem_commands.md)
- Tracing commands → [tracing_commands.md](tracing_commands.md)
- Virtual memory concepts → [../topics/INDEX.md](../topics/INDEX.md)
