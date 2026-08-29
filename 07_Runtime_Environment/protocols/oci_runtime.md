---
title: "OCI — Open Container Initiative Specs"
layer: 07_Runtime_Environment
section: protocols
tags: [protocol, oci, container, runtime-spec, image-spec, distribution-spec, docker]
updated: 2026-05-21
---

# OCI — Open Container Initiative Specs

---

## Overview

The Open Container Initiative (OCI) publishes three interoperability
specifications that define how container images, runtimes, and registries
work — independently of any specific vendor.

```
  OCI specification family:
  
  ┌─────────────────────────────────────────────────────────────┐
  │              OCI Image Spec (image-spec)                    │
  │   Defines how an image is packed, layered, and described    │
  └──────────────────────┬──────────────────────────────────────┘
                         │ image pulled/pushed via
  ┌──────────────────────▼──────────────────────────────────────┐
  │           OCI Distribution Spec (distribution-spec)         │
  │    Registry API: push, pull, tag, catalog (HTTP REST)       │
  └──────────────────────┬──────────────────────────────────────┘
                         │ unpacked and run by
  ┌──────────────────────▼──────────────────────────────────────┐
  │            OCI Runtime Spec (runtime-spec)                  │
  │   Defines container lifecycle and configuration (config.json│
  └─────────────────────────────────────────────────────────────┘
```

---

## OCI Image Spec

### Image Layout

```
  OCI image layout (on disk or in tarball):
  
  image/
  ├── oci-layout          (JSON: {"imageLayoutVersion": "1.0.0"})
  ├── index.json          (Image Index — entry point, lists manifests)
  └── blobs/
      └── sha256/
          ├── <manifest digest>    (Image Manifest JSON)
          ├── <config digest>      (Image Config JSON)
          └── <layer digest ...>   (layer tarballs, gzip or zstd)
```

### Image Index

The top-level `index.json` allows multi-platform images:

```json
{
  "schemaVersion": 2,
  "manifests": [
    {
      "mediaType": "application/vnd.oci.image.manifest.v1+json",
      "digest": "sha256:abc123...",
      "size": 1234,
      "platform": { "os": "linux", "architecture": "amd64" }
    },
    {
      "mediaType": "application/vnd.oci.image.manifest.v1+json",
      "digest": "sha256:def456...",
      "size": 1290,
      "platform": { "os": "linux", "architecture": "arm64" }
    }
  ]
}
```

### Image Manifest

```json
{
  "schemaVersion": 2,
  "mediaType": "application/vnd.oci.image.manifest.v1+json",
  "config": {
    "mediaType": "application/vnd.oci.image.config.v1+json",
    "digest": "sha256:cfg...",
    "size": 7023
  },
  "layers": [
    { "mediaType": "application/vnd.oci.image.layer.v1.tar+gzip",
      "digest": "sha256:layer1...", "size": 32654321 },
    { "mediaType": "application/vnd.oci.image.layer.v1.tar+gzip",
      "digest": "sha256:layer2...", "size": 1234567 }
  ],
  "annotations": { "org.opencontainers.image.title": "myapp" }
}
```

### Image Config

Contains environment variables, entrypoint, working directory, and
the layer diff chain:

```json
{
  "config": {
    "Env": ["PATH=/usr/local/bin:/usr/bin:/bin"],
    "Entrypoint": ["/bin/server"],
    "Cmd": ["--port", "8080"],
    "WorkingDir": "/app",
    "ExposedPorts": { "8080/tcp": {} }
  },
  "rootfs": {
    "type": "layers",
    "diff_ids": ["sha256:uncompressed_layer1...", "sha256:uncompressed_layer2..."]
  },
  "history": [...]
}
```

---

## OCI Runtime Spec

### Container Lifecycle

```
  create  → start  → (running) → stop → delete
     │                               │
     │          kill signal ─────────┘
     │
     │  Hooks: prestart, createRuntime, createContainer,
     │          startContainer, poststart, poststop
```

### config.json Structure

The runtime spec's `config.json` defines the full container environment:

```json
{
  "ociVersion": "1.0.2",
  "process": {
    "args": ["/bin/server"],
    "env": ["HOME=/root"],
    "cwd": "/app",
    "capabilities": { "permitted": ["CAP_NET_BIND_SERVICE"] },
    "rlimits": [{ "type": "RLIMIT_NOFILE", "hard": 1024, "soft": 1024 }]
  },
  "root": { "path": "rootfs", "readonly": false },
  "hostname": "mycontainer",
  "mounts": [
    { "destination": "/proc", "type": "proc", "source": "proc" },
    { "destination": "/tmp", "type": "tmpfs", "source": "tmpfs",
      "options": ["nosuid", "noexec"] }
  ],
  "linux": {
    "namespaces": [
      { "type": "pid" }, { "type": "network" },
      { "type": "mount" }, { "type": "ipc" }, { "type": "uts" }
    ],
    "cgroupsPath": "/sys/fs/cgroup/mycontainer",
    "seccomp": { "defaultAction": "SCMP_ACT_ERRNO", "architectures": ["SCMP_ARCH_X86_64"], "syscalls": [...] },
    "rootfsPropagation": "private"
  }
}
```

---

## OCI Distribution Spec (Registry API)

HTTP REST API for pushing/pulling images:

```
  Pull image:
  GET /v2/<name>/manifests/<reference>      (get manifest by tag or digest)
  GET /v2/<name>/blobs/<digest>             (download a layer blob)

  Push image:
  POST /v2/<name>/blobs/uploads/            (start upload session)
  PATCH /v2/<name>/blobs/uploads/<uuid>     (stream data)
  PUT  /v2/<name>/blobs/uploads/<uuid>?digest=...  (finalize)
  PUT  /v2/<name>/manifests/<reference>     (push manifest)

  Other:
  GET  /v2/                                 (ping — check registry v2 support)
  GET  /v2/_catalog                         (list repositories)
  GET  /v2/<name>/tags/list                 (list tags)
  DELETE /v2/<name>/manifests/<digest>      (delete manifest)
```

---

## Low-Level Runtimes

| Runtime | Notes |
|---------|-------|
| runc | OCI reference implementation (written in Go) |
| crun | OCI runtime in C — faster startup, lower memory |
| kata-containers | OCI-compatible runtime using micro-VMs for isolation |
| gVisor (runsc) | OCI runtime with user-space kernel (ptrace/KVM) |
| youki | OCI runtime in Rust |

---

## Key Terms

| Term | Definition |
|------|-----------|
| OCI | Open Container Initiative — vendor-neutral container standards |
| Image Index | Multi-platform manifest list (OCI image spec) |
| Image Manifest | Per-platform list of config + layer digests |
| Layer | Incremental filesystem change set (tar+gzip/zstd blob) |
| config.json | OCI runtime spec file describing container environment |
| Bundle | Directory with config.json + rootfs — input to OCI runtime |
| runc | Reference OCI runtime implementation |
| CRI | Container Runtime Interface — Kubernetes API to talk to runtimes |
| containerd | High-level container daemon; calls runc via shim |
| Distribution spec | Registry HTTP API for push/pull |

---

## See Also

- Runtime lab exercises → [../lessons/runtime_labs.md](../lessons/runtime_labs.md)
- Container tools → [../man_pages/container_commands.md](../man_pages/container_commands.md)
- Container internals → [../topics/container_internals.md](../topics/container_internals.md)
