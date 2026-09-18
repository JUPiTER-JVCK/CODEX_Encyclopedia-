# Runtime Environment — Lessons

## What is in this section

```text
  Dedicated module plus ten numbered lessons across four topic groups.

  ┌─── dedicated module ──────────────────────────────────────────────────────┐
  │  runtime_labs.md — container from scratch, OCI image, systemd unit       │
  └───────────────────────────────────────────────────────────────────────────┘

  ┌─── observability & profiling  (1–3) ──────────────────────────────────────┐
  │  1 GC observed (JVM -Xlog:gc*, CPython gc.set_debug, V8 --trace-gc)      │
  │  2 JIT warm-up — measure tiered compilation effects                      │
  │  3 profile a runtime (async-profiler, py-spy, 0x, pprof)                 │
  └───────────────────────────────────────────────────────────────────────────┘

  ┌─── interop & threading models  (4–5) ─────────────────────────────────────┐
  │  4 native interop — JNI, P/Invoke, Python ctypes, Go cgo                 │
  │  5 threading models — JVM threads, GIL + asyncio, V8 + workers, BEAM    │
  └───────────────────────────────────────────────────────────────────────────┘

  ┌─── containers & orchestration  (6–8) ─────────────────────────────────────┐
  │  6 container 101 — build image, push registry, run via runc / Docker     │
  │  7 Kubernetes basics — deployment, service, ingress, logs                │
  │  8 init container & sidecar pattern                                       │
  └───────────────────────────────────────────────────────────────────────────┘

  ┌─── WebAssembly & embedding  (9–10) ───────────────────────────────────────┐
  │  9 Wasm sandbox — compile Rust → wasm32-wasip1; run under wasmtime       │
  │  10 embed a runtime — V8 in C++, or wasmtime in Rust                     │
  └───────────────────────────────────────────────────────────────────────────┘
```

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
9. **Wasm sandbox** — compile Rust → wasm32-wasip1; run under wasmtime.
10. **Embedding a runtime** — embed V8 in a C++ app, or wasmtime in Rust.

## Suggested external
- "The Garbage Collection Handbook" companion talks.
- KubeCon talks (CNCF) — Kubernetes deep dives.
- Mozilla Servo / V8 internals talks.
