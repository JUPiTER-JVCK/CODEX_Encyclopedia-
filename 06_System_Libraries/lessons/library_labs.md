---
title: "System Libraries — Interactive Labs"
layer: 06_System_Libraries
section: lessons
tags: [lesson, library, shared, dlopen, abi, linker, lab, quiz, hands-on]
updated: 2026-05-21
---

# System Libraries — Interactive Labs

---

## Module 1: Creating a Shared Library

### Objective

Build a shared library (.so), link against it, understand soname
versioning, and use `ldd` to inspect dependencies.

### Prerequisites

- Linux with `gcc`, `readelf`, `ldd`

### Lab Steps

1. Write library code (`mathlib.c`):
```c
// mathlib.c
int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }
```

2. Write header (`mathlib.h`):
```c
#ifndef MATHLIB_H
#define MATHLIB_H
int add(int a, int b);
int mul(int a, int b);
#endif
```

3. Build shared library:
```bash
gcc -shared -fPIC -Wl,-soname,libmathlib.so.1 \
    mathlib.c -o libmathlib.so.1.0.0

# Create soname symlink and linker symlink
ln -s libmathlib.so.1.0.0 libmathlib.so.1    # soname
ln -s libmathlib.so.1 libmathlib.so           # linker name
```

4. Build a program using it:
```c
// main.c
#include <stdio.h>
#include "mathlib.h"
int main() {
    printf("3 + 4 = %d\n", add(3, 4));
    printf("3 * 4 = %d\n", mul(3, 4));
    return 0;
}
```

```bash
gcc main.c -L. -lmathlib -o main
LD_LIBRARY_PATH=. ./main
```

5. Inspect:
```bash
ldd main                  # shows libmathlib.so.1 dependency
readelf -d main | grep NEEDED
nm -D libmathlib.so.1.0.0 # exported symbols
```

### Library naming convention

```
  libmathlib.so.1.0.0     ← real file (major.minor.patch)
  libmathlib.so.1         ← soname symlink (ABI version)
  libmathlib.so           ← linker symlink (used by -lmathlib)
  
  At link time:  gcc looks for libmathlib.so
  At run time:   ld.so looks for libmathlib.so.1 (soname embedded in binary)
  On upgrade:    replace .so.1.0.0 with .so.1.1.0, soname stays .so.1
                 → existing binaries work without recompile
```

### Knowledge Check

**Q1**: What does `-fPIC` do?

> **A1**: Generate Position-Independent Code. Shared libraries can be loaded
> at any memory address; PIC uses relative addressing so the code works
> regardless of where it's mapped. Required for shared libraries on x86-64.

**Q2**: What happens if you change a function signature in the library but keep the same soname?

> **A2**: ABI breakage. Programs compiled against the old interface will
> crash or produce wrong results at runtime. This is why you bump the
> soname major version when the ABI changes.

---

## Module 2: Runtime Loading with dlopen

### Objective

Load a shared library at runtime using `dlopen`/`dlsym`, enabling
plugin architectures.

### Lab Steps

1. Load the library dynamically:
```c
// plugin_loader.c
#include <stdio.h>
#include <dlfcn.h>

int main() {
    void *handle = dlopen("./libmathlib.so", RTLD_LAZY);
    if (!handle) { fprintf(stderr, "%s\n", dlerror()); return 1; }

    // Lookup symbol by name
    int (*add_func)(int, int) = dlsym(handle, "add");
    if (!add_func) { fprintf(stderr, "%s\n", dlerror()); return 1; }

    printf("Dynamic call: 10 + 20 = %d\n", add_func(10, 20));

    dlclose(handle);
    return 0;
}
```

2. Compile (note: no `-lmathlib` needed):
```bash
gcc plugin_loader.c -ldl -o plugin_loader
./plugin_loader
```

3. Experiment: create a second library with the same symbol name but
   different behavior → swap "plugins" at runtime

### Knowledge Check

**Q1**: What is the difference between `RTLD_LAZY` and `RTLD_NOW`?

> **A1**: `RTLD_LAZY` resolves symbols on first use (faster startup).
> `RTLD_NOW` resolves all symbols immediately at `dlopen` time (fails
> fast if symbols are missing, useful for debugging).

---

## Module 3: Symbol Visibility & ABI Versioning

### Objective

Control which symbols are exported from a shared library using visibility
attributes, and understand ABI versioning.

### Lab Steps

1. Add visibility control:
```c
// mathlib.c with visibility
#define EXPORT __attribute__((visibility("default")))
#define HIDDEN __attribute__((visibility("hidden")))

EXPORT int add(int a, int b) { return a + b; }
EXPORT int mul(int a, int b) { return a * b; }
HIDDEN int internal_helper(int x) { return x * x; } // not exported
```

2. Compile with hidden default:
```bash
gcc -shared -fPIC -fvisibility=hidden \
    -Wl,-soname,libmathlib.so.1 mathlib.c -o libmathlib.so.1.0.0
```

3. Verify:
```bash
nm -D libmathlib.so.1.0.0
# Only add and mul should appear (internal_helper is hidden)
```

### Review Flashcards

| Term | Definition |
|------|-----------|
| Shared library (.so) | Code loaded at runtime, shared across processes |
| Static library (.a) | Linked into the binary at compile time |
| PIC | Position-Independent Code — required for shared libs |
| soname | ABI version identifier embedded in the binary |
| dlopen/dlsym | Runtime library loading and symbol lookup |
| RTLD_LAZY | Resolve symbols on first use |
| Symbol visibility | Control which functions are exported (default/hidden) |
| ABI | Application Binary Interface — calling convention + layout |
| ldconfig | Update the dynamic linker cache (/etc/ld.so.cache) |

### Challenge

> Build a plugin system: a main application that loads `.so` files from
> a `plugins/` directory using `dlopen`. Each plugin exports a standard
> interface: `const char* plugin_name()` and `int plugin_run(int arg)`.
> The main app discovers and calls all plugins. Add a new plugin without
> recompiling the main app.

---

## Cross-links

- Linker tools → [../man_pages/linker_commands.md](../man_pages/linker_commands.md)
- Debug tools → [../man_pages/debug_commands.md](../man_pages/debug_commands.md)
- Runtime environment → [../../07_Runtime_Environment/lessons/runtime_labs.md](../../07_Runtime_Environment/lessons/runtime_labs.md)
