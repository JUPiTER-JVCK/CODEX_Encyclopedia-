---
title: C — language profile
layer: 08_User_Applications
section: languages
tags: [c, gcc, clang, make, cmake, gdb, valgrind]
updated: 2026-05-20
---

# C — language profile

> The portable assembly. Used everywhere from kernels (cross-link
> [05_OS_Kernel](../../05_OS_Kernel/)) to embedded firmware
> ([03_Firmware_BIOS](../../03_Firmware_BIOS/)) to scripting glue. C standard
> editions: C89/90, C99, C11, C17, C23.

## Compilers

| Command | Notes |
|---------|-------|
| `gcc` / `clang` | Default flags: `-Wall -Wextra -Wpedantic -std=c17 -O2 -g` |
| `tcc` | Tiny C Compiler — fast |
| `cc` | Symlink to system default |
| `cl.exe` | MSVC on Windows |

### Useful gcc/clang flags

| Flag | Meaning |
|------|---------|
| `-std=c99 / c11 / c17 / c23` | Language standard |
| `-O0 / -O1 / -O2 / -O3 / -Os / -Oz / -Ofast` | Optimization |
| `-g` / `-g3` | Debug info (DWARF) |
| `-Wall -Wextra -Wpedantic` | Warnings (use them) |
| `-Werror` | Warnings as errors |
| `-fsanitize=address` (ASan) | Memory error detection |
| `-fsanitize=undefined` (UBSan) | Undefined behavior detection |
| `-fsanitize=thread` (TSan) | Race detection |
| `-fsanitize=memory` (MSan, clang only) | Uninit memory reads |
| `-fno-omit-frame-pointer` | Better stack traces |
| `-march=native` | Use host CPU features (not portable) |
| `-mcpu=cortex-m4` `-mfpu=fpv4-sp-d16` | Cross-compile flags |
| `-I path` `-L path` `-l name` | Include / lib search / link |
| `-D NAME=VAL` | Preprocessor define |
| `-E` | Stop after preprocessing |
| `-S` | Emit assembly |
| `-c` | Compile to .o (no link) |
| `-MMD -MP` | Generate dependency `.d` files |
| `-static` | Static link |
| `-shared -fPIC` | Build shared library |
| `-flto` | Link-time optimization |
| `-ffreestanding` | No hosted libc (for kernels/firmware) |

## Build systems

| Tool | Use |
|------|-----|
| `make` | Universal, terse, error-prone for new projects |
| `cmake` | Modern; cross-platform; use `cmake --build build` |
| `ninja` | Fast backend for cmake |
| `meson` | Clean modern alt to autotools/cmake |
| `bazel`/`buck2` | Monorepo scale |
| autotools (`./configure && make`) | Legacy systems |
| `gnumake`-specific features | `:=`, `?=`, pattern rules, `$(call ...)` |

Minimal Makefile:
```make
CC      := clang
CFLAGS  := -std=c17 -Wall -Wextra -Wpedantic -O2 -g
SRC     := $(wildcard src/*.c)
OBJ     := $(SRC:.c=.o)

bin/app: $(OBJ)
	@mkdir -p bin
	$(CC) $(CFLAGS) -o $@ $^

clean:
	rm -rf $(OBJ) bin

.PHONY: clean
```

Minimal CMake:
```cmake
cmake_minimum_required(VERSION 3.20)
project(app C)
set(CMAKE_C_STANDARD 17)
add_compile_options(-Wall -Wextra -Wpedantic)
add_executable(app src/main.c)
```

## Linker / static / shared libs

| Command | Purpose |
|---------|---------|
| `ld` / `lld` / `mold` | Linkers (mold = fastest) |
| `ar rcs libfoo.a foo.o bar.o` | Build static lib |
| `gcc -shared -fPIC -o libfoo.so foo.c` | Build shared lib (Linux) |
| `nm libfoo.a` | List symbols |
| `objdump -d a.out` | Disassemble |
| `objdump -t` / `-T` | Symbol tables |
| `readelf -a` | ELF metadata |
| `ldd ./app` | Show shared lib deps (Linux) |
| `otool -L ./app` | macOS equivalent of ldd |
| `install_name_tool` | macOS dylib path patching |
| `strip` | Remove symbols (shrink binary) |
| `objcopy` | Copy/transform object files |
| `addr2line` | Map runtime address → source line |

## Debugging

| Tool | Use |
|------|-----|
| `gdb ./app` | GNU debugger. `break`, `run`, `next`, `step`, `print`, `bt`, `watch`, `info threads` |
| `lldb ./app` | LLVM debugger (macOS default) |
| `gdbserver :1234 ./app` + remote gdb | Remote debug |
| `rr record / replay` | Reversible debugger (Linux) |
| `strace -f -e file ./app` | Trace syscalls |
| `ltrace ./app` | Trace library calls |

## Memory / sanitizers

| Tool | Use |
|------|-----|
| AddressSanitizer (`-fsanitize=address`) | Use-after-free, buffer overflow |
| MemorySanitizer (clang) | Uninitialized reads |
| LeakSanitizer (`-fsanitize=leak` or part of ASan) | Memory leaks |
| ThreadSanitizer (`-fsanitize=thread`) | Data races |
| UndefinedBehaviorSanitizer (`-fsanitize=undefined`) | UB |
| `valgrind --tool=memcheck ./app` | Heavyweight memory checker |
| `valgrind --tool=callgrind` | Call-graph profiling |
| `valgrind --tool=helgrind` | Race detection |
| Electric Fence | Page-protect malloc |
| jemalloc / tcmalloc / mimalloc | Better allocators |

## Static analysis

| Tool | Use |
|------|-----|
| `clang-tidy` | Modern linter |
| `clang --analyze` | Built-in static analyzer |
| `cppcheck` | Standalone |
| `scan-build` | Wrapper around clang static analyzer |
| `splint` | Legacy |
| `coverity`, `polyspace`, `klocwork` | Commercial high-assurance |
| `infer` | Facebook's analyzer |

## Standard library essentials

| Header | When |
|--------|------|
| `<stdio.h>` | I/O (`printf`, `fprintf`, `fopen`, `fread`, `fwrite`, `snprintf`) |
| `<stdlib.h>` | `malloc`/`free`, `atoi`/`strtol`, `qsort`, `bsearch`, `exit`, `getenv` |
| `<string.h>` | `memcpy`/`memmove`/`memset`/`memcmp`, `strlen`/`strcmp`/`strncmp`, `strchr` |
| `<stdint.h>` | Sized integers (`uint8_t`, `int32_t`, `intptr_t`, `SIZE_MAX`) |
| `<stddef.h>` | `size_t`, `ptrdiff_t`, `NULL`, `offsetof` |
| `<stdbool.h>` | `bool`, `true`, `false` |
| `<inttypes.h>` | `PRId64`, `SCNd64` format macros |
| `<errno.h>` | `errno`, `EINTR`, `EAGAIN` etc. |
| `<unistd.h>` (POSIX) | `read`, `write`, `close`, `fork`, `getpid`, `sleep` |
| `<fcntl.h>` (POSIX) | `open`, `O_RDONLY`/`O_WRONLY`/`O_CREAT` flags |
| `<sys/types.h>` `<sys/stat.h>` | `stat()`, file modes |
| `<sys/mman.h>` | `mmap`/`munmap` |
| `<pthread.h>` (POSIX) | Threads |
| `<signal.h>` | Signals (`sigaction` preferred over `signal`) |
| `<time.h>` | `time`, `clock_gettime`, `strftime` |
| `<math.h>` | `sin`, `sqrt`, `pow`, etc. — link with `-lm` |
| `<assert.h>` | `assert` (disable with `-DNDEBUG`) |
| `<setjmp.h>` | Non-local exits (rarely the right answer) |
| `<stdarg.h>` | Variadic functions |
| `<threads.h>` (C11) | Standardized threads (limited support) |
| `<stdatomic.h>` (C11) | Atomics |

## Patterns

- **Always check return values** of `malloc`, `fopen`, `read`, `write`, etc.
- **Pair allocations** with frees in the same scope when possible; use cleanup functions for early returns.
- **Use sized types** (`uint32_t`) at boundaries; `int`/`unsigned` for local arithmetic that doesn't overflow.
- **Bound your strings** — `snprintf` over `sprintf`, `strncpy` carefully (it doesn't null-terminate on truncation; prefer `strlcpy` on BSD/macOS or write your own).
- **`const`-correctness** — propagate constness through function signatures.
- **`static` for file-local linkage** — limits symbol visibility.
- **Header guards** — `#pragma once` (widely supported) or `#ifndef FOO_H` triplet.
- **Forward declarations** in headers; full definitions in `.c`.
- **One translation unit (`.c`) per logical module**.

## Common gotchas

- **Undefined behavior**: signed overflow, null deref, OOB access, strict aliasing, uninitialized reads, `realloc(NULL, n)` is fine but `free(NULL)` is too.
- **Strict aliasing**: don't punt through incompatible pointer types; use `memcpy` for type-punning or `-fno-strict-aliasing`.
- **`sizeof(array)` decays** to `sizeof(pointer)` when passed to a function.
- **Implicit declarations** (pre-C99): missing `#include` of a function declaration → ABI mismatch.
- **`size_t` is unsigned** — `for (size_t i = n; i >= 0; i--)` loops forever.
- **Sequence points**: `a[i] = i++;` is UB.
- **`fprintf(stderr, ...)`** vs `printf` — buffering and ordering matter.
- **Forgetting `va_end`** in variadic functions.
- **Integer promotion** of `char` / `short` to `int` in expressions.

## Defensive idioms

```c
#define ARRAY_SIZE(a) (sizeof(a) / sizeof((a)[0]))

#define UNUSED(x) ((void)(x))

#define ATTR_PRINTF(fmt_idx, va_idx) \
    __attribute__((format(printf, fmt_idx, va_idx)))

#define LIKELY(x)   __builtin_expect(!!(x), 1)
#define UNLIKELY(x) __builtin_expect(!!(x), 0)

/* Cleanup attribute (GCC/Clang) */
#define AUTO_FREE __attribute__((cleanup(free_ptr)))
static inline void free_ptr(void *p) { free(*(void **)p); }
```

## Cross-references
- Kernel C dialect → [05_OS_Kernel/languages](../../05_OS_Kernel/languages/INDEX.md)
- Embedded C (no-libc, freestanding, MISRA) → [18_Embedded_Systems/languages/embedded_c.md](../../18_Embedded_Systems/languages/embedded_c.md)
- ABIs / calling conventions → [02_CPU/protocols](../../02_CPU/protocols/INDEX.md)
- System libraries (libc) → [06_System_Libraries](../../06_System_Libraries/)
