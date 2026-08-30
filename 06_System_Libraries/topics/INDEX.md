
## Dedicated Topic Deep Dives

| File | Covers |
|------|--------|
| [libc Variants](./libc_variants.md) | glibc, musl, Bionic, uClibc, newlib |

# System Libraries — Topics

## libc anatomy
- **Headers** — `stdio.h`, `stdlib.h`, `string.h`, `unistd.h`, `pthread.h`, ...
- **Syscall wrappers** — `read()` / `open()` / `mmap()` thin shims.
- **stdio FILE streams** — buffering modes (line/full/unbuffered).
- **malloc implementations** — ptmalloc (glibc), mimalloc, jemalloc, tcmalloc, hoard.
- **Locales & ICU** — UTF-8 vs wide chars; `iconv`.

## Linking & loading
- **Static vs dynamic linking** — tradeoffs.
- **Dynamic linker** — `ld.so` / `dyld` / NT loader; relocation, PLT, GOT.
- **Lazy binding** — first call triggers symbol resolution.
- **RPATH / RUNPATH** — embedded library search paths.
- **Symbol versioning** — GLIBC_2.x, version scripts.
- **Visibility** — default vs hidden vs protected.

## ABIs
- **C ABI** — calling conventions per platform (see [02_CPU/protocols](../../02_CPU/protocols/INDEX.md)).
- **C++ ABI** — Itanium ABI (Linux/macOS/Clang), MSVC ABI; mangling, vtables, RTTI.
- **Stable ABIs** — what changes break consumers; symbol versioning as mitigation.

## Threading
- **pthreads** — POSIX threads model, attributes, cancellation.
- **C11 `<threads.h>`**, **C++11 `<thread>`/`<atomic>`/`<mutex>`**.
- **Futexes** (Linux), **WaitOnAddress** (Windows).
- **TLS** — thread-local storage; per-arch implementation.

## Crypto libraries
- **OpenSSL** / **LibreSSL** / **BoringSSL** — TLS + primitives.
- **libsodium** — opinionated NaCl-derived API.
- **mbedTLS** — embedded-friendly.
- **CommonCrypto** (Apple), **Schannel/CNG** (Windows).

## Networking helpers
- **Resolver** — `getaddrinfo`, `/etc/nsswitch.conf`, NSS modules.
- **libcurl** — multi-protocol client.
- **libuv / libevent / libev** — event loops (used by Node, etc.).

## Compression
- **zlib** (deflate), **zstd**, **lz4**, **xz/lzma**, **brotli**.
