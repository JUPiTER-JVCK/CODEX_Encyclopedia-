---
title: "Linker & Binary Inspection Commands"
layer: 06_System_Libraries
section: man_pages
tags: [ld, ldd, ldconfig, nm, objdump, readelf, strings, pkg-config, linker, elf, man-section-1]
updated: 2026-05-21
---

# Linker & Binary Inspection Commands

> Tools for linking, loading, and inspecting ELF binaries and shared libraries.

---

## ld — the GNU linker

### Synopsis

```
ld [options] objfile…
```

### Description

Combines object files and libraries into an executable or shared library.
Usually invoked indirectly via `gcc`/`clang` (which adds CRT startup objects
and default libraries).

### Key Options

| Flag | Purpose |
|------|---------|
| `-o output` | Output filename |
| `-l<lib>` | Link against `lib<lib>.so` / `lib<lib>.a` |
| `-L <dir>` | Add library search path |
| `-shared` | Create a shared library (`.so`) |
| `-static` | Force static linking |
| `-T <script>` | Use a custom linker script |
| `--as-needed` | Only link libraries that resolve undefined symbols |
| `-rpath <dir>` | Embed runtime library search path |
| `--version-script=ver` | Symbol visibility / versioning |
| `-Map=output.map` | Generate a link map |

### Linker script basics

```
  ENTRY(_start)
  SECTIONS {
      . = 0x08048000;         /* Load address */
      .text : { *(.text) }    /* Code */
      .rodata : { *(.rodata) } /* Read-only data */
      .data : { *(.data) }    /* Initialized data */
      .bss : { *(.bss) }      /* Uninitialized data (zeroed) */
  }
```

### Examples

```bash
# Link two objects into an executable
ld -o hello hello.o -lc -dynamic-linker /lib64/ld-linux-x86-64.so.2

# Create a shared library with version script
gcc -shared -Wl,--version-script=lib.ver -o libfoo.so.1.0 foo.o
```

---

## ldd — print shared library dependencies

### Synopsis

```
ldd [options] binary
```

### Description

Shows which shared libraries an ELF binary needs and where the dynamic
linker (`ld-linux.so`) resolves them.

> **Security note**: `ldd` executes the dynamic linker on the binary. For
> untrusted binaries, use `objdump -p` or `readelf -d` instead.

### Examples

```bash
ldd /usr/bin/curl
#   linux-vdso.so.1 (0x00007ffd...)
#   libcurl.so.4 => /usr/lib/x86_64-linux-gnu/libcurl.so.4 (0x00007f...)
#   libz.so.1 => /lib/x86_64-linux-gnu/libz.so.1 (0x00007f...)
#   libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f...)
#   /lib64/ld-linux-x86-64.so.2 (0x00007f...)

# Check for missing dependencies
ldd ./myapp | grep "not found"
```

---

## ldconfig — configure dynamic linker cache

### Synopsis

```
ldconfig [-v] [-N] [-X] [-p] [dir…]
```

### Description

Rebuilds `/etc/ld.so.cache` — the runtime linker's fast lookup table. Run
after installing new shared libraries.

### Examples

```bash
# Rebuild the cache (after adding a .so to /usr/local/lib)
sudo ldconfig -v

# Print the current cache
ldconfig -p | grep libssl
#   libssl.so.3 (libc6,x86-64) => /usr/lib/x86_64-linux-gnu/libssl.so.3

# Scan a specific directory
sudo ldconfig /opt/mylibs/lib
```

---

## pkg-config — query installed library metadata

### Synopsis

```
pkg-config [--cflags] [--libs] [--modversion] package…
```

### Description

Reads `.pc` files to emit compiler/linker flags for a library. The standard
way to discover include paths and link flags in build systems.

### Examples

```bash
# Compiler flags for OpenSSL
pkg-config --cflags openssl
# -I/usr/include/openssl

# Linker flags
pkg-config --libs openssl
# -lssl -lcrypto

# Version check
pkg-config --modversion libcurl
# 7.88.1

# Use in a gcc command
gcc -o myapp myapp.c $(pkg-config --cflags --libs libpng zlib)
```

---

## nm — list symbols from object files

### Synopsis

```
nm [-g] [-C] [-D] [-u] [-A] file…
```

### Description

Lists symbols (functions, variables) in an object file, archive, or shared
library. Shows name, address, and type code.

### Symbol types

| Code | Meaning |
|------|---------|
| `T` / `t` | Text (code) section — global / local |
| `D` / `d` | Data section — global / local |
| `B` / `b` | BSS (uninitialized) — global / local |
| `U` | Undefined (needs linking) |
| `W` / `w` | Weak symbol |
| `R` / `r` | Read-only data |
| `A` | Absolute (not relocated) |

### Key Options

| Flag | Purpose |
|------|---------|
| `-g` | External (global) symbols only |
| `-u` | Undefined symbols only |
| `-C` | Demangle C++ names |
| `-D` | Dynamic symbols (shared library exports) |
| `-A` | Print filename with each symbol |
| `--size-sort` | Sort by size |

### Examples

```bash
# Find undefined symbols (what this .o needs)
nm -u mymodule.o

# Exported functions from a shared library (demangled C++)
nm -gDC libmylib.so | grep ' T '

# Largest symbols by size
nm --size-sort -r myapp | head -20
```

---

## objdump — display ELF information and disassembly

### Synopsis

```
objdump [-d] [-x] [-t] [-h] [-s] [-r] file
```

### Description

Multi-purpose tool for examining ELF files: section headers, symbol tables,
relocations, and disassembled machine code.

### Key Options

| Flag | Purpose |
|------|---------|
| `-d` | Disassemble executable sections |
| `-D` | Disassemble all sections |
| `-S` | Intermix source with disassembly (needs `-g` debug info) |
| `-t` | Symbol table |
| `-h` | Section headers |
| `-x` | All headers |
| `-r` | Relocation entries |
| `-j .text` | Only a specific section |

### Examples

```bash
# Disassemble with source (compiled with -g)
objdump -dS myapp | less

# Section headers (sizes, VMA, LMA)
objdump -h myapp

# Just the .rodata section (string literals, constants)
objdump -s -j .rodata myapp
```

---

## readelf — display ELF file details

### Synopsis

```
readelf [-a] [-h] [-l] [-S] [-s] [-d] [-r] [-n] file
```

### Description

ELF-specific inspection (doesn't do disassembly like `objdump`). Preferred
for examining headers, segments, sections, and dynamic linking metadata.

### Key Options

| Flag | Purpose |
|------|---------|
| `-h` | ELF header (magic, class, endian, entry point) |
| `-l` | Program headers (segments for loading) |
| `-S` | Section headers |
| `-s` | Symbol table |
| `-d` | Dynamic section (NEEDED, SONAME, RPATH) |
| `-r` | Relocations |
| `-n` | Notes (build-id, GNU properties) |
| `-a` | All of the above |
| `--dyn-syms` | Dynamic symbol table |

### ELF structure overview

```
  ┌─────────────────────┐
  │ ELF Header          │  Magic, class (32/64), endian, type, entry
  ├─────────────────────┤
  │ Program Headers     │  Segments: LOAD, INTERP, DYNAMIC, NOTE, GNU_STACK
  │ (for the loader)    │  → readelf -l
  ├─────────────────────┤
  │ .text               │  Executable code
  │ .rodata             │  Read-only data (string literals, jump tables)
  │ .data               │  Initialized globals
  │ .bss                │  Zero-initialized globals (no bytes on disk)
  │ .symtab / .strtab   │  Symbol + string tables (stripped in release)
  │ .dynsym / .dynstr   │  Dynamic symbols (always present in .so)
  │ .rel.dyn / .rela.plt│  Relocations
  │ .got / .plt         │  Global Offset Table / Procedure Linkage Table
  │ .debug_*            │  DWARF debug info (if compiled with -g)
  ├─────────────────────┤
  │ Section Headers     │  Directory of all sections
  │ (for tools)         │  → readelf -S
  └─────────────────────┘
```

### Examples

```bash
# What shared libraries does this binary need?
readelf -d myapp | grep NEEDED
#  0x0000000000000001 (NEEDED)  Shared library: [libc.so.6]

# Entry point and architecture
readelf -h /bin/ls | head -12

# Check for stack canary / NX / PIE
readelf -l myapp | grep GNU_STACK
readelf -h myapp | grep 'Type:'
```

---

## c++filt — demangle C++ symbols

### Synopsis

```
c++filt [options] [symbol…]
```

### Examples

```bash
echo '_ZN5MyApp7processEi' | c++filt
# MyApp::process(int)

nm mylib.so | c++filt | grep MyApp
```

---

## strings — print printable strings from binary

### Synopsis

```
strings [-n min_len] [-a] file
```

### Description

Scans a binary for sequences of printable characters (default ≥ 4). Quick
way to find embedded messages, file paths, URLs, version strings.

### Examples

```bash
# Find URLs embedded in a binary
strings /usr/bin/curl | grep 'http'

# Look for version strings
strings myapp | grep -i 'version\|v[0-9]'

# Minimum length 8
strings -n 8 firmware.bin
```

---

## Cross-links

- Debug commands → [debug_commands.md](debug_commands.md)
- OS Kernel tracing → [../../05_OS_Kernel/man_pages/tracing_commands.md](../../05_OS_Kernel/man_pages/tracing_commands.md)
- C language profile → [../../08_User_Applications/languages/c.md](../../08_User_Applications/languages/c.md)
- CPU / assembly → [../../02_CPU/languages/INDEX.md](../../02_CPU/languages/INDEX.md)
