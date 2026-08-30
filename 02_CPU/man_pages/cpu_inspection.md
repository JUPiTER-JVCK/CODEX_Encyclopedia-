---
title: "CPU Inspection Commands"
layer: 02_CPU
section: man_pages
tags: [lscpu, cpuid, turbostat, likwid, perf-stat, cpu, microarchitecture, man-section-1, man-section-8]
updated: 2026-05-21
---

# CPU Inspection Commands

> Tools for querying CPU topology, features, performance counters, and
> power/frequency behavior.

---

## lscpu — display CPU architecture information

### Synopsis

```
lscpu [-e] [-p] [-J] [--all]
```

### Description

Reads `/proc/cpuinfo`, sysfs, and CPUID to display a human-readable summary
of CPU topology, caches, ISA extensions, and virtualization capabilities.

### Key Options

| Flag | Purpose |
|------|---------|
| `-e` | Extended table: CPU, NODE, SOCKET, CORE, L1d, L1i, L2, L3 |
| `-p` | Parsable output (for scripting) |
| `-J` | JSON output |
| `--all` | Include offline CPUs |

### Output anatomy

```
Architecture:           x86_64
CPU op-mode(s):         32-bit, 64-bit
Byte Order:             Little Endian
CPU(s):                 16                  ← logical CPUs (threads)
On-line CPU(s) list:    0-15
Thread(s) per core:     2                   ← SMT / Hyper-Threading
Core(s) per socket:     8                   ← physical cores
Socket(s):              1                   ← physical packages
NUMA node(s):           1
Vendor ID:              GenuineIntel
Model name:             12th Gen Intel(R) Core(TM) i7-12700H
Stepping:               3
CPU MHz:                2300.000
CPU max MHz:            4700.0000
CPU min MHz:            400.0000
BogoMIPS:               5376.00
Virtualization:         VT-x
L1d cache:              384 KiB (8 inst)    ← per-core
L1i cache:              256 KiB (8 inst)
L2 cache:               10 MiB (8 inst)
L3 cache:               24 MiB (1 inst)     ← shared across cores
NUMA node0 CPU(s):      0-15
Flags:                  fpu vme ... avx2 avx512f ... tme
```

### Topology diagram

```
  Socket 0
  ┌──────────────────────────────────────────┐
  │  Core 0          Core 1         ...      │
  │  ┌─────────┐     ┌─────────┐            │
  │  │ Thread 0│     │ Thread 2│             │
  │  │ Thread 1│     │ Thread 3│    (SMT)    │
  │  │ L1d 48K │     │ L1d 48K │             │
  │  │ L1i 32K │     │ L1i 32K │             │
  │  └────┬────┘     └────┬────┘             │
  │       └──── L2 1.25 MB ────┘             │
  │                                          │
  │  ┌──────────── L3 24 MB ────────────┐    │
  │  │  shared across all cores         │    │
  │  └─────────────────────────────────┘    │
  └──────────────────────────────────────────┘
```

### Examples

```bash
# Extended topology table
lscpu -e
# CPU NODE SOCKET CORE L1d:L1i:L2:L3 ONLINE
#   0    0      0    0  0:0:0:0        yes
#   1    0      0    0  0:0:0:0        yes   ← same core, different thread
#   2    0      0    1  1:1:1:0        yes

# JSON (for parsing)
lscpu -J | jq '.lscpu[] | select(.field == "Model name:") | .data'
```

---

## cpuid — dump CPUID instruction results

### Synopsis

```
cpuid [-1] [-r] [-f file]
```

### Description

Executes the x86 `CPUID` instruction and decodes every leaf. Shows feature
flags, cache descriptors, brand string, topology IDs, and vendor extensions.

### Examples

```bash
# Full decoded dump
cpuid | less

# Raw hex output (for comparison)
cpuid -r | head -40

# Check for a specific feature
cpuid | grep -i 'avx-512\|avx2\|aes-ni\|sha'
```

---

## turbostat — report CPU frequency and power

### Synopsis

```
turbostat [-i interval] [-c cpu_list] [command]
```

### Description

Intel-specific tool (works on AMD too with limited fields). Shows per-core
frequency, C-state residency, temperature, and power consumption. Reads
MSRs — requires root.

### Key columns

| Column | Meaning |
|--------|---------|
| `Avg_MHz` | Actual average frequency during interval |
| `Busy%` | Fraction of time not in idle C-state |
| `Bzy_MHz` | Frequency while busy (turbo) |
| `TSC_MHz` | Time Stamp Counter frequency (base) |
| `CPU%c1`–`CPU%c7` | C-state residency percentages |
| `PkgWatt` | Package power consumption |
| `CorWatt` | Core power |
| `Tmp` | Temperature (°C) |

### Examples

```bash
# Default: all CPUs, 5-second interval
sudo turbostat -i 5

# Run a command and measure its power/frequency
sudo turbostat -- make -j16

# Specific CPUs
sudo turbostat -c 0,4,8 -i 2
```

---

## likwid — lightweight performance tools

### Synopsis

```
likwid-topology
likwid-perfctr -C <cpus> -g <group> <command>
likwid-pin -c <cpus> <command>
```

### Description

Suite of CLI tools for CPU topology, hardware counter measurement, and
thread pinning. Supports Intel, AMD, and ARM.

### Key tools

| Tool | Purpose |
|------|---------|
| `likwid-topology` | Cache/NUMA topology (graphical ASCII) |
| `likwid-perfctr` | Hardware performance counter measurement |
| `likwid-pin` | Pin threads to cores |
| `likwid-bench` | Low-level memory bandwidth benchmarks |
| `likwid-powermeter` | Power consumption |
| `likwid-mpirun` | Hybrid MPI+thread pinning |

### Performance groups (likwid-perfctr)

| Group | Measures |
|-------|----------|
| `FLOPS_DP` | Double-precision FLOP/s |
| `FLOPS_SP` | Single-precision FLOP/s |
| `MEM` | Memory bandwidth (read/write) |
| `L2CACHE` | L2 hit/miss rates |
| `L3CACHE` | L3 hit/miss rates |
| `BRANCH` | Branch prediction accuracy |
| `ENERGY` | Power consumption |

### Examples

```bash
# ASCII topology diagram
likwid-topology -g

# Measure memory bandwidth
likwid-perfctr -C 0-7 -g MEM -- ./my_benchmark

# Pin to specific cores
likwid-pin -c 0,2,4,6 -- ./parallel_app
```

---

## perf stat — hardware counter summary

### Synopsis

```
perf stat [-e events] [-r repeats] [-d] command [args…]
```

### Description

Quick one-shot hardware counter measurement. Shows cycles, instructions,
IPC, cache misses, branch mispredictions, and more.

### Key Options

| Flag | Purpose |
|------|---------|
| `-e cycles,instructions` | Specific events |
| `-d` | Detailed: add L1/LLC/TLB counters |
| `-dd` | More detailed |
| `-ddd` | Maximum detail |
| `-r 5` | Repeat 5 times, show mean ± stddev |
| `-a` | System-wide (all CPUs) |
| `-p <pid>` | Attach to running process |

### Examples

```bash
# Quick IPC check
perf stat ./my_program
#  1,234,567,890  cycles
#  2,345,678,901  instructions  #  1.90 insn per cycle
#     12,345,678  cache-misses  #  4.56% of all cache refs
#      1,234,567  branch-misses #  0.89% of all branches
#    0.543212345  seconds time elapsed

# Detailed with 3 repetitions
perf stat -ddd -r 3 ./benchmark

# System-wide for 10 seconds
perf stat -a sleep 10
```

---

## Cross-links

- CPU pipeline concepts → [../topics/cpu_pipeline.md](../topics/cpu_pipeline.md)
- OS Kernel tracing → [../../05_OS_Kernel/man_pages/tracing_commands.md](../../05_OS_Kernel/man_pages/tracing_commands.md)
- x86-64 assembly → [../languages/x86_64_asm.md](../languages/x86_64_asm.md)
- ARM64 assembly → [../languages/arm64_asm.md](../languages/arm64_asm.md)
