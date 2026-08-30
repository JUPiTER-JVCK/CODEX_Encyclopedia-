# 07 — Runtime Environment

> The execution substrate for high-level languages: JVMs, interpreters,
> .NET CLR, JS engines, Go/Rust standard runtimes, container runtimes,
> and the orchestration on top of them.

## At a glance

| Field | Value |
|-------|-------|
| Description | Platform for application execution |
| Languages | C/C++ (host), Java, Python, JS, Go, Ruby, .NET languages, etc. |
| Medium / Interface | OS services + runtime-specific APIs (JNI, FFI, ABI) |
| Example | JVM executes Java bytecode using OS calls |
| Adjacent layers | ↓ [06_System_Libraries](../06_System_Libraries/), ↑ [08_User_Applications](../08_User_Applications/) |

## What lives here

- **JVM** — OpenJDK HotSpot, GraalVM, Eclipse OpenJ9, Azul Zing
- **CLR / .NET runtime** — CoreCLR, Mono, NativeAOT
- **JS engines** — V8, SpiderMonkey, JavaScriptCore, Hermes
- **CPython, PyPy, MicroPython** — Python implementations
- **Ruby (CRuby/MRI), JRuby, TruffleRuby, mruby**
- **Go runtime, Rust runtime (minimal), Node.js, Deno, Bun**
- **Erlang/BEAM** — Erlang/Elixir/Gleam VM
- **Container runtimes** — runc, crun, containerd, CRI-O, Docker, Podman
- **Orchestrators** — Kubernetes, Nomad, ECS
- **VM hypervisors as runtime** — KVM/QEMU, VMware, Hyper-V, Firecracker
- **WebAssembly runtimes** — Wasmtime, Wasmer, WAMR, V8/Wasm

## Sub-sections

- [references/](references/INDEX.md) — JVM spec, ECMAScript, CPython docs
- [lessons/](lessons/INDEX.md) — GC tuning, profiling, native interop
- [languages/](languages/INDEX.md) — managed-vs-native lookup
- [man_pages/](man_pages/INDEX.md) — `java`, `python`, `node`, `docker`, `kubectl`
- [topics/](topics/INDEX.md) — GC, JIT, sandboxing, containers, wasm
- [protocols/](protocols/INDEX.md) — JNI, gRPC, OCI image, CRI, CSI

## Cross-references
- Underlying libs the runtime uses → [06_System_Libraries](../06_System_Libraries/)
- App code that runs on the runtime → [08_User_Applications](../08_User_Applications/)
- Container isolation kernel-side → [05_OS_Kernel/topics](../05_OS_Kernel/topics/INDEX.md)
- ML training/inference runtimes → [15_AI_ML](../15_AI_ML/)
