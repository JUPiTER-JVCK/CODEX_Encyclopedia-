# System Libraries — Manual Pages

## Dedicated man page references

| Topic | File |
|-------|------|
| Linker & binary inspection | [linker_commands.md](linker_commands.md) — ld, ldd, ldconfig, nm, objdump, readelf, strings |
| Debugging | [debug_commands.md](debug_commands.md) — gdb, lldb, valgrind, addr2line |

---

## Linker / loader
| Command | Purpose |
|---------|---------|
| `ld` | GNU linker |
| `lld` | LLVM linker |
| `mold` | Modern fast linker |
| `gold` | GNU gold linker (legacy) |
| `link.exe` | MSVC linker |
| `ld.so` / `ld-linux.so` | Dynamic linker (Linux) |
| `dyld` | Dynamic linker (macOS) |
| `ldd` | Print dynamic dependencies (Linux) |
| `otool -L` | macOS equivalent of `ldd` |
| `dumpbin /dependents` | Windows equivalent |
| `ldconfig` | Update Linux dynamic linker cache |
| `pkg-config` | Library compile/link flags lookup |

## Inspection
| Command | Purpose |
|---------|---------|
| `nm` | List symbols |
| `objdump -T` / `-t` | Dynamic / all symbols |
| `readelf -d` / `-s` / `-h` | ELF dynamic / symbol / header info |
| `otool -hv` / `-tv` | Mach-O header/disasm |
| `dumpbin /headers` / `/exports` | PE inspection |
| `c++filt` | Demangle C++ symbols |
| `strings` | Printable strings in a binary |

## Trace / debug
| Command | Purpose |
|---------|---------|
| `ltrace` | Library call tracing |
| `strace -e %file` | Syscall trace filtered |
| `valgrind` | Memory checker, leak detector |
| `gdb` / `lldb` | Source-level debug |

## Loader knobs (env vars / man 8)
- `LD_LIBRARY_PATH`, `LD_PRELOAD`, `LD_DEBUG`, `LD_BIND_NOW` (Linux)
- `DYLD_LIBRARY_PATH`, `DYLD_INSERT_LIBRARIES` (macOS; restricted under SIP)
- `_NT_SYMBOL_PATH`, `PATH` (Windows)

See also `man 8 ld-linux.so`, `man 1 dyld`.
