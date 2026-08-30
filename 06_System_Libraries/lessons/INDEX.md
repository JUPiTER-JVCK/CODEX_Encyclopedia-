# System Libraries — Lessons

## Dedicated lesson modules

| Topic | File |
|-------|------|
| Library interactive labs | [library_labs.md](library_labs.md) — Shared library, symbol visibility, dlopen, ABI versioning |

---

1. **Hello, libc** — write & link a "hello" C program; trace with `strace` to see syscalls.
2. **Static vs dynamic linking** — same binary, two link models; size & startup differences.
3. **`LD_PRELOAD` hook** — intercept `malloc` to log allocations.
4. **Build with musl** — cross-compile a static binary; compare with glibc.
5. **Linker scripts** — read the default GNU ld script; write a minimal one.
6. **Symbol visibility** — `-fvisibility=hidden`, version scripts, ABI hygiene.
7. **C++ name mangling** — `nm`, `c++filt`, mismatched compilers, vtable layout.
8. **Threading primitives** — pthreads mutex/cond, std::atomic; ABA, false sharing.
9. **Locale & i18n** — `setlocale`, `iconv`, UTF-8 handling pitfalls.
10. **Crypto API hands-on** — OpenSSL EVP; pick AEAD (AES-GCM, ChaCha20-Poly1305).
11. **FFI from a higher language** — call a C lib from Python (`ctypes`/`cffi`), Rust, Go.

## Suggested external
- CppCon talks on ABI compatibility (Marshall Clow, Titus Winters)
- "What Every Programmer Should Know About Memory" — Drepper
