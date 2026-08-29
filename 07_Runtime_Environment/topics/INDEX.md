
## Dedicated Topic Deep Dives

| File | Covers |
|------|--------|
| [Container Internals](./container_internals.md) | Namespaces, cgroups v2, overlayfs, seccomp |

# Runtime Environment — Topics

## Execution models
- **Interpretation** — bytecode walk (CPython, MRI Ruby).
- **JIT** — tiered (V8 Ignition→TurboFan, JVM C1→C2/Graal), tracing JITs (PyPy, LuaJIT).
- **AOT** — GraalVM Native Image, .NET NativeAOT, Dart AOT, Go.
- **Hybrid** — JS engines mix interp + multiple JIT tiers.

## Garbage collection
- **Tracing GCs** — mark-sweep, mark-compact, copying, generational.
- **Modern collectors** — G1, ZGC, Shenandoah (JVM); GC concurrent in V8; CPython refcount + cycle collector; Go concurrent tricolor.
- **Reference counting** — CPython, Swift ARC, Objective-C ARC.
- **Manual / RAII** — C++, Rust ownership model (no GC).

## Concurrency / parallelism
- **Threads** — OS threads exposed by JVM, .NET, native runtimes.
- **GIL** — CPython's Global Interpreter Lock; PEP 703 (no-GIL) progress.
- **Goroutines / fibers** — Go scheduler, Loom (Java virtual threads), Kotlin coroutines.
- **Actor model** — BEAM processes, Akka.
- **Event loops** — libuv (Node), asyncio (Python), Tokio (Rust).

## Containers & images
- **Image format** — OCI image spec (layers, manifests, configs).
- **Runtime** — runc/crun execute OCI runtime spec configs.
- **Linux primitives used** — namespaces, cgroups, seccomp, capabilities, MAC.
- **Storage drivers** — overlay2, btrfs, zfs.
- **Networking** — bridge, host, macvlan, CNI plugins.
- **Rootless containers** — user namespaces.

## Kubernetes / orchestration
- **Workload kinds** — Pod, Deployment, StatefulSet, DaemonSet, Job, CronJob.
- **Service mesh** — Istio, Linkerd; sidecar vs ambient.
- **Storage** — PV/PVC, CSI drivers.
- **Networking** — Service, Ingress, NetworkPolicy, CNI.
- **Operators / CRDs** — extending the API.

## VMs / hypervisors as runtime
- **Type 1 / Type 2** hypervisors.
- **Paravirtualization** vs full virt; **virtio**.
- **microVMs** — Firecracker, Cloud Hypervisor.

## WebAssembly
- **Module structure** — sections, imports/exports, memory, tables.
- **WASI** — POSIX-ish system interface; WASI 0.2 components.
- **Component model** — interface types, world definitions.
- **Embedding** — wasmtime, V8, JVM (Chicory, Wasmer).

## Security cross-link
- Sandbox escapes, container CVEs → [14_Security/topics](../../14_Security/topics/INDEX.md)
- Wasm capability model & isolation → [14_Security/topics](../../14_Security/topics/INDEX.md)
