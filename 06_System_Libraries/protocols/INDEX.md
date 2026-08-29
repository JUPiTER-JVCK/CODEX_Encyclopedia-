# System Libraries — Protocols & Standards

| Standard | What it pins |
|----------|--------------|
| ISO C (C11/C17/C23) | C language + standard library API |
| ISO C++ (C++17/20/23) | C++ language + STL |
| POSIX.1-2017 | Portable Unix API surface (pthreads, signals, files) |
| System V ABI | ELF format + per-arch calling conventions |
| Itanium C++ ABI | C++ name mangling, vtables, RTTI (used by GCC/Clang) |
| MSVC C++ ABI | Microsoft's separate C++ ABI |
| DWARF v5 | Debug info format |
| LSB | Distro-portable Linux binary contract (historical) |
| Filesystem Hierarchy Standard (FHS) | `/usr/lib`, `/lib64`, ... layout |

## Library formats
- **ELF** — Linux/BSD shared objects (`.so`)
- **Mach-O** — macOS dylibs (`.dylib`), bundles, frameworks
- **PE/COFF** — Windows DLLs (`.dll`)
- **Static archives** — `.a` (Unix), `.lib` (Windows)

## Package/build metadata
- **pkg-config (`.pc`)** — compile/link flag manifests
- **CMake config-file packages** — `Foo-config.cmake`
- **Autotools (`.la`)** — libtool archives (legacy)

## Cross-link
- ABIs live in [02_CPU/protocols](../../02_CPU/protocols/INDEX.md)
- Syscall surface in [05_OS_Kernel/protocols](../../05_OS_Kernel/protocols/INDEX.md)
