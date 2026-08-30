---
title: "Debugging Commands"
layer: 06_System_Libraries
section: man_pages
tags: [gdb, lldb, valgrind, addr2line, debugger, memory-checker, man-section-1]
updated: 2026-05-21
---

# Debugging Commands

> Debuggers and memory checkers for native code.

---

## gdb — the GNU Debugger

### Synopsis

```
gdb [-q] [-ex cmd] [executable] [core|pid]
gdb -p <pid>
```

### Description

Source-level debugger for C, C++, Rust, Go, Fortran, and other compiled
languages. Supports breakpoints, watchpoints, stack inspection, memory
examination, reverse debugging, and Python scripting.

### Essential commands

| Command | Short | Purpose |
|---------|-------|---------|
| `run [args]` | `r` | Start the program |
| `break main` | `b main` | Set breakpoint |
| `break file.c:42` | `b file.c:42` | Breakpoint at line |
| `continue` | `c` | Resume execution |
| `next` | `n` | Step over (source line) |
| `step` | `s` | Step into |
| `finish` | `fin` | Run until current function returns |
| `print expr` | `p expr` | Evaluate expression |
| `display expr` | | Auto-print after every stop |
| `backtrace` | `bt` | Stack trace |
| `frame N` | `f N` | Select stack frame |
| `info locals` | | Local variables |
| `info registers` | `i r` | CPU registers |
| `x/16xb addr` | | Examine 16 hex bytes at address |
| `watch *addr` | | Hardware watchpoint (break on write) |
| `thread apply all bt` | | Backtrace all threads |
| `set follow-fork-mode child` | | Debug the child after fork |
| `record` | | Enable reverse debugging |
| `reverse-continue` | `rc` | Run backward |

### TUI mode

```
  ┌──────────────────────────────────────────┐
  │ (gdb) layout src                         │
  ├──────────────────────────────────────────┤
  │   38 │ int main(int argc, char **argv) { │  ← Source window
  │   39 │     int x = parse(argv[1]);       │
  │ B+>40│     process(x);                   │  ← Breakpoint + current line
  │   41 │     return 0;                     │
  ├──────────────────────────────────────────┤
  │ (gdb) _                                  │  ← Command window
  └──────────────────────────────────────────┘

  layout split   — source + assembly
  layout regs    — source + registers
  Ctrl-x a       — toggle TUI on/off
```

### Examples

```bash
# Debug a core dump
gdb ./myapp core.12345
(gdb) bt          # where did it crash?
(gdb) frame 3     # go to the interesting frame
(gdb) info locals  # see local variables

# Attach to a running process
sudo gdb -p $(pgrep myserver)
(gdb) thread apply all bt   # what are all threads doing?

# Conditional breakpoint
(gdb) break parser.c:120 if len > 1024

# Examine memory: 32 bytes as hex + ASCII
(gdb) x/32xb buffer

# Run with arguments, stop at main
gdb -q -ex 'break main' -ex 'run --config test.conf' ./myapp

# Python scripting (automate debugging)
(gdb) python
> import gdb
> for bp in gdb.breakpoints():
>     print(bp.location, bp.hit_count)
> end
```

---

## lldb — LLVM Debugger

### Synopsis

```
lldb [executable] [-p pid] [-c core]
```

### Description

Default debugger on macOS / Xcode. Similar capabilities to GDB with a
different command syntax. Also supports Python scripting.

### GDB → LLDB command mapping

| GDB | LLDB | Purpose |
|-----|------|---------|
| `break main` | `b main` | Breakpoint |
| `run` | `r` / `process launch` | Start |
| `next` | `n` | Step over |
| `step` | `s` | Step into |
| `continue` | `c` | Resume |
| `backtrace` | `bt` | Stack trace |
| `print x` | `p x` / `expr x` | Evaluate |
| `info locals` | `frame variable` | Local vars |
| `info registers` | `register read` | Registers |
| `x/16xb addr` | `memory read -c 16 addr` | Examine memory |
| `thread apply all bt` | `thread backtrace all` | All threads |
| `watch *addr` | `watchpoint set expression addr` | Watchpoint |

### Examples

```bash
# Debug a crash on macOS
lldb ./myapp
(lldb) r
# ... crash ...
(lldb) bt
(lldb) frame select 2
(lldb) frame variable

# Attach to a running process
lldb -p 1234
```

---

## valgrind — memory error detector & profiler

### Synopsis

```
valgrind [--tool=name] [--leak-check=full] program [args…]
```

### Description

Dynamic binary instrumentation framework. Default tool (`memcheck`) detects:
- Use of uninitialized memory
- Read/write after free (use-after-free)
- Read/write beyond allocation (buffer overflow)
- Memory leaks (unreachable allocations at exit)
- Double free
- Mismatched malloc/free vs new/delete

Runs the program ~10–50× slower (no recompilation needed).

### Key Tools

| Tool | Purpose |
|------|---------|
| `memcheck` | Memory errors + leaks (default) |
| `callgrind` | Call-graph profiling (use with `kcachegrind`) |
| `cachegrind` | Cache + branch prediction simulation |
| `massif` | Heap profiler over time (use with `ms_print`) |
| `helgrind` | Thread error detector (data races, lock order) |
| `drd` | Another thread error detector |

### Key Options (memcheck)

| Flag | Purpose |
|------|---------|
| `--leak-check=full` | Detailed leak report |
| `--show-leak-kinds=all` | Include reachable, possible |
| `--track-origins=yes` | Show where uninit values originated |
| `--suppressions=file.supp` | Suppress known false positives |
| `--gen-suppressions=all` | Generate suppression entries |
| `--vgdb=yes` | Enable GDB attachment to valgrind |

### Examples

```bash
# Full leak check
valgrind --leak-check=full --show-leak-kinds=all ./myapp
# ==12345== HEAP SUMMARY:
# ==12345==   in use at exit: 1,024 bytes in 2 blocks
# ==12345==   total heap usage: 100 allocs, 98 frees, 50,000 bytes allocated
# ==12345== LEAK SUMMARY:
# ==12345==   definitely lost: 512 bytes in 1 blocks
# ==12345==   indirectly lost: 512 bytes in 1 blocks

# Callgrind profiling → visualize with kcachegrind
valgrind --tool=callgrind ./myapp
kcachegrind callgrind.out.12345

# Heap profiling over time
valgrind --tool=massif ./myapp
ms_print massif.out.12345

# Thread race detection
valgrind --tool=helgrind ./my_threaded_app
```

---

## addr2line — map addresses to source locations

### Synopsis

```
addr2line [-e executable] [-f] [-C] address…
```

### Description

Translates instruction addresses (from crash logs, stack traces) into
source file + line number. Requires debug symbols (`-g`).

### Examples

```bash
# From a crash address
addr2line -e ./myapp -f 0x400a23
# process_request
# /home/user/src/server.c:142

# Demangle C++ + show function names
addr2line -e ./myapp -fC 0x400b10 0x400c45

# Pipe from a stack trace
grep '0x[0-9a-f]' crash.log | xargs addr2line -e ./myapp -fC
```

---

## Cross-links

- Linker & binary inspection → [linker_commands.md](linker_commands.md)
- OS Kernel tracing → [../../05_OS_Kernel/man_pages/tracing_commands.md](../../05_OS_Kernel/man_pages/tracing_commands.md)
- C language profile → [../../08_User_Applications/languages/c.md](../../08_User_Applications/languages/c.md)
- Rust language profile → [../../08_User_Applications/languages/rust.md](../../08_User_Applications/languages/rust.md)
