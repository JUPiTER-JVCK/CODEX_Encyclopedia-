# Runtime Environment — Lessons

## Dedicated lesson modules

| Topic | File |
|-------|------|
| Runtime interactive labs | [runtime_labs.md](runtime_labs.md) — Container from scratch, OCI image, systemd unit |

---

1. **GC observed** — log GC events in JVM (`-Xlog:gc*`), CPython (`gc.set_debug`), V8 (`--trace-gc`).
2. **JIT warm-up** — write a hot loop; measure tiered compilation effects (JVM, V8).
3. **Profile a runtime** — async-profiler (JVM), `py-spy` (CPython), `0x` (Node), `pprof` (Go).
4. **Native interop** — JNI hello, .NET P/Invoke, Python `ctypes`, Go `cgo`.
5. **Threading models** — JVM threads, GIL & asyncio, V8 single-thread + workers, BEAM processes.
6. **Container 101** — build an image, push to a registry, run via runc and via Docker.
7. **Kubernetes basics** — deployment, service, ingress; apply, get, describe, logs.
8. **Init container & sidecar** — pattern walk-through with a logging sidecar.
9. **Wasm sandbox** — compile Rust → wasm32-wasi; run under wasmtime.
10. **Embedding a runtime** — embed V8 in a C++ app, or wasmtime in Rust.

## Suggested external
- "The Garbage Collection Handbook" companion talks.
- KubeCon talks (CNCF) — Kubernetes deep dives.
- Mozilla Servo / V8 internals talks.
