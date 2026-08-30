# System Libraries — Languages

The libraries themselves are mostly C / C++. The interesting layer is the
*binding* tooling that exposes them to everything else.

## Implementation languages
| Language | Examples |
|----------|----------|
| C | glibc, musl, OpenSSL, zlib, sqlite |
| C++ | libstdc++, libc++, Boost, ICU, gRPC |
| Rust | rustls, ring, sled (newer, gaining ground) |
| Assembly | crypto fast paths (AES-NI), memcpy/memset |

## Compilers / toolchains
| Tool | Notes |
|------|-------|
| GCC | GNU C/C++ compiler; default on most Linux |
| Clang / LLVM | macOS default; alt on Linux/Windows |
| MSVC | Microsoft Visual C++; Windows native |
| ICC / ICX | Intel C/C++ compilers |
| TinyCC | Fast, small C compiler |
| Cosmopolitan libc | Single binary, multi-OS |

## FFI / binding generators
| Tool | Target | Notes |
|------|--------|-------|
| SWIG | Many | Wraps C/C++ for Python, Ruby, Java, ... |
| `bindgen` | Rust | Generates Rust FFI from C headers |
| `cgo` | Go | Built-in C interop |
| `ctypes`, `cffi` | Python | Two flavors of C-call FFI |
| `node-gyp`, NAPI | Node.js | Native addons |
| JNI / JNA | Java | C interop |
| P/Invoke | .NET | C interop |

## Related
- The C standard library is what compilers emit calls to → [02_CPU/protocols](../../02_CPU/protocols/INDEX.md) ABIs
- Runtimes link libc → [07_Runtime_Environment/languages](../../07_Runtime_Environment/languages/INDEX.md)
