---
title: "Runtime Environment — Interactive Labs"
layer: 07_Runtime_Environment
section: lessons
tags: [lesson, container, oci, systemd, runtime, lab, quiz, hands-on]
updated: 2026-05-21
---

# Runtime Environment — Interactive Labs

---

## Module 1: Container from Scratch

### Objective

Build a minimal OCI container image manually (no Dockerfile), understanding
layers, manifests, and the runtime interface.

### Prerequisites

- Linux with `podman` or `docker`, `jq`, `tar`

### Lab Steps

1. Create a minimal root filesystem:
```bash
mkdir -p myimage/rootfs
# Copy a static binary (no dynamic dependencies)
cp $(which busybox) myimage/rootfs/
cd myimage/rootfs
# Create symlinks for common commands
for cmd in sh ls cat echo mkdir; do
    ln -s busybox $cmd
done
cd ..
```

2. Create the OCI image config:
```bash
# Create a tarball of the rootfs layer
tar -C rootfs -cf layer.tar .

# Calculate the layer digest
DIGEST=$(sha256sum layer.tar | awk '{print $1}')
```

3. Import as a container image:
```bash
# Simpler approach: use buildah or import
cat layer.tar | podman import - myimage:latest

# Test it
podman run --rm myimage:latest /sh -c "echo Hello from scratch container"
```

4. Inspect the image:
```bash
podman inspect myimage:latest | jq '.[0].RootFS'
podman history myimage:latest
# IMAGE        CREATED         SIZE    COMMENT
# abc123       2 seconds ago   1.1MB   Imported from -
```

### OCI image structure

```
  OCI Image Layout:
  ├── blobs/
  │   └── sha256/
  │       ├── abc123...  (image manifest JSON)
  │       ├── def456...  (config JSON: env, cmd, entrypoint)
  │       └── ghi789...  (layer tar.gz: filesystem diff)
  ├── index.json         (points to manifest)
  └── oci-layout         (version marker)
  
  Container = Image + writable layer + config (pid, net, mounts)
```

### Knowledge Check

**Q1**: What is a container layer?

> **A1**: A tar archive of filesystem changes (added/modified/deleted files).
> Layers are stacked using an overlay filesystem. The bottom layers are
> read-only; a writable layer is added on top at runtime.

**Q2**: Why use a static binary (busybox) instead of a dynamically linked one?

> **A2**: A static binary has no library dependencies — it works in an
> empty rootfs. Dynamically linked binaries need libc and other .so files
> present in the container filesystem.

---

## Module 2: Dockerfile Multi-Stage Build

### Objective

Build an optimized production container using multi-stage builds,
reducing image size from ~1 GB to ~10 MB.

### Lab Steps

1. Create a Go application:
```go
// main.go
package main
import (
    "fmt"
    "net/http"
)
func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello from container!\n")
    })
    fmt.Println("Listening on :8080")
    http.ListenAndServe(":8080", nil)
}
```

2. Single-stage (large):
```dockerfile
FROM golang:1.22
WORKDIR /app
COPY main.go .
RUN go build -o server main.go
CMD ["./server"]
# Result: ~800 MB image (includes entire Go toolchain)
```

3. Multi-stage (small):
```dockerfile
# Stage 1: Build
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY main.go .
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o server main.go

# Stage 2: Runtime (scratch = empty base)
FROM scratch
COPY --from=builder /app/server /server
EXPOSE 8080
ENTRYPOINT ["/server"]
# Result: ~6 MB image (just the binary)
```

4. Build and compare:
```bash
docker build -t app-large -f Dockerfile.single .
docker build -t app-small -f Dockerfile.multi .
docker images | grep app-
# app-large   latest   ...   830MB
# app-small   latest   ...   6.2MB
```

### Knowledge Check

**Q1**: What is `scratch` as a base image?

> **A1**: A completely empty filesystem — no shell, no libc, nothing.
> Only works with statically compiled binaries. Produces the smallest
> possible container images.

---

## Module 3: systemd Service Unit

### Objective

Write a systemd service unit to manage a long-running application,
with restart policies, resource limits, and logging.

### Lab Steps

1. Create a service file: `/etc/systemd/system/myapp.service`:
```ini
[Unit]
Description=My Application Server
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=myapp
Group=myapp
WorkingDirectory=/opt/myapp
ExecStart=/opt/myapp/server --port 8080
Restart=on-failure
RestartSec=5
# Resource limits
MemoryMax=256M
CPUQuota=200%
# Security hardening
NoNewPrivileges=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/var/lib/myapp

[Install]
WantedBy=multi-user.target
```

2. Enable and manage:
```bash
sudo systemctl daemon-reload
sudo systemctl enable myapp
sudo systemctl start myapp
sudo systemctl status myapp
journalctl -u myapp -f     # follow logs
```

3. Test restart behavior:
```bash
# Kill the process — systemd should restart it
sudo kill $(pidof server)
systemctl status myapp      # should show "activating (auto-restart)"
```

### Review Flashcards

| Term | Definition |
|------|-----------|
| OCI | Open Container Initiative — image + runtime standards |
| Layer | Filesystem diff stored as tar archive |
| scratch | Empty base image for statically compiled binaries |
| Multi-stage build | Use build tools in stage 1, copy artifact to minimal stage 2 |
| overlayfs | Union filesystem stacking read-only layers + writable top |
| systemd unit | Config file describing a service, timer, mount, etc. |
| cgroup | Kernel mechanism for resource limits (CPU, memory, I/O) |
| ExecStart | Command systemd runs to start the service |
| journalctl | Read systemd journal logs |

### Challenge

> Create a `docker-compose.yml` with three services: a web app,
> a PostgreSQL database, and a Redis cache. Configure health checks,
> restart policies, named volumes for data persistence, and a custom
> bridge network. Verify the app can reach both database and cache
> by hostname.

---

## Cross-links

- Container commands → [../man_pages/container_commands.md](../man_pages/container_commands.md)
- VM commands → [../man_pages/vm_commands.md](../man_pages/vm_commands.md)
- Kernel namespaces → [../../05_OS_Kernel/lessons/kernel_labs.md](../../05_OS_Kernel/lessons/kernel_labs.md)
