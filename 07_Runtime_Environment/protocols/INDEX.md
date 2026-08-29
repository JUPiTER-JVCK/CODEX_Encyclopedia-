---
title: "Runtime Environment — Protocol Reference"
layer: 07_Runtime_Environment
section: protocols
tags: [protocols, index, reference]
updated: 2026-06-07
---

# Runtime Environment — Protocol Reference

> OCI image/runtime/distribution specifications and adjacent runtime standards.

## Dedicated Protocol References

| File | Covers |
|------|--------|
| [OCI Runtime/Image/Distribution Specs](./oci_runtime.md) | Container lifecycle, image format, registry API |

|--------------|
| JVMS | JVM bytecode, class file format |
| ECMA-335 (CLI) | .NET intermediate language, metadata, type system |
| ECMA-262 (ECMAScript) | JavaScript language |
| WebAssembly Core | wasm bytecode, validation, execution |
| WASI 0.2 | WebAssembly system interface (component model) |
| PEP 484 / 561 | Python type hints / stub distribution |

## Container & orchestration
| Spec | Owner | Pins |
|------|-------|------|
| OCI Image Spec | OCI | Image layout & manifest |
| OCI Runtime Spec | OCI | Container runtime config |
| OCI Distribution Spec | OCI | Registry HTTP API |
| CRI | Kubernetes | Container Runtime Interface (kubelet ↔ runtime) |
| CNI | CNCF | Container Network Interface |
| CSI | CNCF | Container Storage Interface |
| SMI | (Service Mesh Interface) | Cross-mesh policy / traffic |
| OCI Artifacts | OCI | Non-image content via registry |

## Native-interop ABIs
| ABI | Runtime | Notes |
|-----|---------|-------|
| JNI | JVM | Java ↔ C/C++ |
| Project Panama (FFI/FFM) | JVM | Modern foreign linker API |
| P/Invoke | .NET | C interop |
| ctypes / cffi | Python | C interop |
| N-API / NAPI | Node.js | Stable ABI for native addons |
| cgo | Go | C interop |
| Swift–C / Swift–Objective-C | Swift | Apple interop |

## RPC / wire protocols (often runtime-bundled)
- **gRPC** (HTTP/2 + protobuf)
- **JSON-RPC**, **MessagePack-RPC**
- **Thrift**, **Cap'n Proto**
- **GraphQL over HTTP/WS**

## Cross-link
- HTTP/gRPC wire details → [13_Network_Application/protocols](../../Network/13_Network_Application/protocols/INDEX.md)
