# 06 — System Libraries

> The packaged services userland code links against: libc, libm, libstdc++,
> threading, crypto, networking. The "high-level wrappers around syscalls"
> that most C/C++ programs touch every line.

## At a glance

| Field | Value |
|-------|-------|
| Description | Reusable code offering high-level APIs |
| Languages | C, C++ (with bindings for everything) |
| Medium / Interface | Function calls; many wrap [05_OS_Kernel](../05_OS_Kernel/) syscalls |
| Example | `printf()` ultimately calls the `write()` syscall |
| Adjacent layers | ↓ [05_OS_Kernel](../05_OS_Kernel/), ↑ [07_Runtime_Environment](../07_Runtime_Environment/) |

## What lives here

- **libc** — glibc, musl, bionic, dietlibc, ucLibc, Microsoft UCRT, Apple `libSystem`
- **libm** — math functions
- **libstdc++ / libc++ / MSVC STL** — C++ standard libraries
- **Threading** — pthreads, Win32 threads, C++11 `<thread>`
- **Crypto** — OpenSSL/LibreSSL, BoringSSL, mbedTLS, libsodium, Schannel, CommonCrypto
- **Network** — getaddrinfo stack, c-ares, libcurl, libevent, libuv
- **Compression** — zlib, zstd, lz4, brotli, xz/lzma
- **JSON/XML/YAML** — libxml2, jansson, yaml-cpp
- **Linker & loader** — `ld.so` / `dyld` / `ntdll`/loader; ELF/Mach-O/PE

## Sub-sections

- [references/](references/INDEX.md) — glibc/musl manuals, MSDN, Apple docs
- [lessons/](lessons/INDEX.md) — write your own tiny libc, hook with LD_PRELOAD
- [languages/](languages/INDEX.md) — C/C++ + binding generators
- [man_pages/](man_pages/INDEX.md) — `ldd`, `nm`, `ldconfig`, `dyld`, `pkg-config`
- [topics/](topics/INDEX.md) — ABI, ld.so, name mangling, locales
- [protocols/](protocols/INDEX.md) — libc API standards, linker scripts

## Cross-references
- Syscalls the wrappers call → [05_OS_Kernel/protocols](../05_OS_Kernel/protocols/INDEX.md)
- Runtimes layered above libc → [07_Runtime_Environment](../07_Runtime_Environment/)
- LD_PRELOAD attacks / library hijacking → [14_Security/topics](../14_Security/topics/INDEX.md)
