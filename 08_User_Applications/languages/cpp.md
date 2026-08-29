---
title: C++ — language profile
layer: 08_User_Applications
section: languages
tags: [cpp, gcc, clang, msvc, cmake, conan, vcpkg]
updated: 2026-05-20
---

# C++ — language profile

> The big multi-paradigm language. Modern C++ (11/14/17/20/23/26) feels almost
> like a different language than C++98 — embrace it. For systems work pair with
> the [C profile](c.md); compilers/toolchain are the same family.

## Compilers

| Compiler | Notes |
|----------|-------|
| `g++` (GCC) | Linux default; `-std=c++23` |
| `clang++` (LLVM) | macOS default; `libc++` stdlib |
| `cl.exe` (MSVC) | Windows; `/std:c++latest` |
| Intel ICX / ICC | HPC use cases |

Common flags (same family as C, plus):

| Flag | Meaning |
|------|---------|
| `-std=c++17/20/23/26` | Language standard |
| `-stdlib=libc++` (clang) | Use libc++ instead of libstdc++ |
| `-fmodules-ts` / `-std=c++20` | Modules (still flaky in practice) |
| `-fcoroutines` | Enable coroutines |
| `-fno-exceptions -fno-rtti` | Embedded-friendly subset |
| `-Wnon-virtual-dtor -Wold-style-cast -Woverloaded-virtual -Wshadow` | Useful warnings |
| `-Wsign-conversion` | Catch implicit signed/unsigned |

## Build

| Tool | Use |
|------|-----|
| `cmake` + `ninja` | The de-facto choice; `cmake -B build -G Ninja && cmake --build build` |
| `meson` | Cleaner alt |
| `bazel` / `buck2` | Monorepo |
| `xmake` | Lua-scripted, lightweight |
| `b2` (Boost.Build) | Legacy Boost shops |

## Package managers

| Tool | Use |
|------|-----|
| `vcpkg` | Microsoft; `vcpkg install fmt:x64-linux` |
| `conan` | Python-based; lockfiles + binary cache |
| `Hunter` | CMake-based fetcher |
| System packages (`apt`, `brew`) | Simple, but version-pinned to distro |
| `find_package` (CMake) | Discovery of installed libs |
| FetchContent (CMake) | Pull source from git at configure |

## Standard library (modern picks)

| Header | When |
|--------|------|
| `<vector>` `<array>` `<string>` `<string_view>` | Sequence containers + views |
| `<unordered_map>` `<map>` `<set>` `<unordered_set>` | Associative |
| `<algorithm>` `<numeric>` `<ranges>` | STL algorithms (C++20: views) |
| `<memory>` | `unique_ptr`, `shared_ptr`, `weak_ptr`, `make_unique`, `make_shared` |
| `<optional>` `<variant>` `<expected>` (C++23) | Sum / option types |
| `<chrono>` | Time with units |
| `<filesystem>` | Paths, dir ops |
| `<thread>` `<mutex>` `<condition_variable>` `<atomic>` `<future>` | Concurrency |
| `<format>` (C++20) / `<print>` (C++23) | Replace `printf` |
| `<concepts>` (C++20) | Type constraints |
| `<coroutine>` (C++20) | Coroutine machinery |
| `<span>` (C++20) | Non-owning array view |
| `<bit>` (C++20) | Bit manipulation |
| `<stop_token>` `<jthread>` (C++20) | Cancellable threads |

## Common libraries

| Lib | Use |
|-----|-----|
| `fmt` | The library `std::format` is based on |
| `spdlog` | Logging |
| `Catch2`, `GoogleTest`, `doctest` | Testing |
| `Google Benchmark` | Microbenchmarks |
| `Boost` | Vast — Asio (networking), Spirit (parsing), etc. |
| `Asio` (also standalone) | Async I/O |
| `Eigen` | Linear algebra |
| `nlohmann/json`, `simdjson`, `RapidJSON` | JSON |
| `protobuf`, `flatbuffers`, `cap'n proto` | Binary serialization |
| `Qt`, `wxWidgets`, `GTKmm` | GUI |
| `SDL`, `SFML` | Game / multimedia |
| `Crow`, `cpp-httplib`, `Drogon`, `Pistache` | HTTP servers |
| `Dear ImGui`, `Slint` | Immediate-mode UIs |
| `OpenCV` | Computer vision |
| `range-v3` | Pre-C++20 ranges; still useful |

## Tooling

| Tool | Use |
|------|-----|
| `clang-format` | Format (`.clang-format`) |
| `clang-tidy` | Lint + modernize |
| `clangd` | LSP for editors |
| `include-what-you-use` (IWYU) | Header hygiene |
| `cppcheck` | Lint |
| `compdb` / `compile_commands.json` | Tooling DB |
| `bear -- make` | Generate `compile_commands.json` |
| `ccache` / `sccache` | Compile cache |
| `mold` / `lld` | Fast linkers |
| `xrepo` (xmake) | Package registry |

## Idioms

- **RAII**: tie resource lifetimes to object lifetimes. `unique_ptr` is your default; `shared_ptr` only when ownership is genuinely shared.
- **Rule of 0 / 3 / 5**: prefer rule-of-zero (compiler-generated specials). If you write one of `dtor / copy ctor / copy assign / move ctor / move assign`, write the others.
- **`constexpr` everything you can** — compile-time eval, modern build perf.
- **`auto` for unutterable types**; explicit types at API boundaries.
- **`enum class`** over plain enum.
- **`std::string_view`** for read-only string params.
- **Range-based for** (`for (const auto& x : c)`) over indexed loops.
- **`std::span<T>`** for non-owning pointer+length.
- **Move semantics**: pass-by-value + `std::move` for sinks; rvalue refs `T&&` for forwarding.
- **`override` + `final`** on virtual methods.

## Common gotchas

- **Dangling references** — returning ref/pointer to local, lambda capturing by ref escaping the scope.
- **`std::vector::operator[]` no bounds check**; `.at()` throws.
- **`shared_ptr` cycles** — break with `weak_ptr`.
- **Two-phase name lookup** in templates — qualify dependent names with `typename` / `template`.
- **`auto&&` is a forwarding reference**, not always an rvalue ref.
- **Initialization lists**: `vector<int> v(5, 0)` vs `vector<int> v{5, 0}`.
- **ADL (Argument-Dependent Lookup)** can pull in unexpected overloads.
- **`std::endl` flushes** — usually you want `"\n"`.
- **Static initialization order fiasco** — avoid global non-trivial objects across TUs.
- **Multiple inheritance / virtual inheritance** — usually a smell.

## Cross-references
- Drivers in C++ (limited subset) → [04_Device_Drivers/languages](../../04_Device_Drivers/languages/INDEX.md)
- Embedded C++ subset → [18_Embedded_Systems/languages](../../18_Embedded_Systems/languages/INDEX.md)
- C profile → [c.md](c.md)
