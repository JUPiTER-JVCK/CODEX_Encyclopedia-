---
title: "Container Management Commands"
layer: 07_Runtime_Environment
section: man_pages
tags: [docker, podman, systemd-nspawn, crictl, container, oci, man-section-1, man-section-8]
updated: 2026-05-21
---

# Container Management Commands

> Tools for building, running, and managing OCI containers and system
> containers on Linux.

---

## docker --- container platform CLI

### Synopsis

```
docker [options] command [args...]
docker run [options] image [command]
docker build [options] PATH
docker compose [up|down|logs|ps|...]
```

### Description

Client CLI for the Docker Engine (dockerd). Manages the full container
lifecycle: build images from Dockerfiles, run containers, manage networks
and volumes, push/pull from registries.

### Architecture

```
  docker CLI  ──(REST API)──▸  dockerd (daemon)
                                  │
                                  ├── containerd (image + container mgmt)
                                  │       │
                                  │       └── runc / crun (OCI runtime)
                                  │             │
                                  │             └── namespaces + cgroups
                                  │                   = isolated process
                                  │
                                  ├── BuildKit (image builds)
                                  │
                                  ├── networking (bridge, overlay, macvlan)
                                  │
                                  └── volumes (bind, named, tmpfs)
```

### Key commands

| Command | Purpose |
|---------|---------|
| `run` | Create + start a container |
| `exec` | Run command in running container |
| `build` | Build image from Dockerfile |
| `pull` / `push` | Registry operations |
| `images` / `rmi` | List / remove images |
| `ps` / `ps -a` | List running / all containers |
| `logs` | Container stdout/stderr |
| `inspect` | JSON metadata for container/image |
| `network ls/create/connect` | Manage networks |
| `volume ls/create/rm` | Manage volumes |
| `compose up/down` | Multi-container orchestration |
| `system prune` | Clean unused resources |

### Essential `docker run` flags

| Flag | Purpose |
|------|---------|
| `-d` | Detached (background) |
| `-it` | Interactive + TTY |
| `--rm` | Auto-remove on exit |
| `--name foo` | Container name |
| `-p 8080:80` | Port mapping (host:container) |
| `-v /host:/container` | Bind mount |
| `-v vol:/container` | Named volume |
| `-e KEY=VAL` | Environment variable |
| `--network net` | Attach to network |
| `--cpus 2` | CPU limit |
| `--memory 512m` | Memory limit |
| `--restart unless-stopped` | Restart policy |
| `--privileged` | Full host access (dangerous) |

### Dockerfile anatomy

```dockerfile
  # Build stage
  FROM golang:1.22-alpine AS builder
  WORKDIR /app
  COPY go.mod go.sum ./
  RUN go mod download
  COPY . .
  RUN CGO_ENABLED=0 go build -o /server .

  # Runtime stage (multi-stage → small image)
  FROM alpine:3.20
  RUN apk add --no-cache ca-certificates
  COPY --from=builder /server /server
  EXPOSE 8080
  USER 1000:1000
  ENTRYPOINT ["/server"]
```

### Examples

```bash
# Run a container interactively
docker run --rm -it ubuntu:24.04 bash

# Run a web server in background
docker run -d --name web -p 8080:80 nginx:alpine

# Build an image
docker build -t myapp:latest .

# Multi-container with Compose
docker compose up -d
docker compose logs -f
docker compose down -v    # also remove volumes

# Inspect container networking
docker inspect web --format '{{.NetworkSettings.IPAddress}}'

# Resource usage
docker stats

# Clean up everything unused
docker system prune -a --volumes
```

---

## podman --- daemonless container engine

### Synopsis

```
podman [options] command [args...]
podman run [options] image [command]
podman build [options] PATH
podman pod create [options]
```

### Description

Drop-in replacement for Docker with no central daemon. Each container runs
as a child process of the podman command. Supports rootless containers out
of the box. Uses the same OCI image format and is largely CLI-compatible
with Docker.

### Key differences from Docker

| Feature | Docker | Podman |
|---------|--------|--------|
| Daemon | `dockerd` (root) | None (fork/exec) |
| Rootless | Requires config | Default |
| Socket | `/var/run/docker.sock` | Per-user socket |
| Compose | `docker compose` | `podman-compose` or `podman compose` |
| Pods | Not native | First-class (K8s-style) |
| Systemd | External | `podman generate systemd` |
| Build | BuildKit | Buildah (integrated) |

### Podman pod architecture

```
  Pod (shared network namespace)
  ┌──────────────────────────────────────┐
  │  Infra container (pause)             │
  │    owns: net namespace, port maps    │
  │                                      │
  │  ┌────────────┐  ┌────────────┐     │
  │  │ Container A │  │ Container B │     │
  │  │ (app)       │  │ (sidecar)   │     │
  │  │ localhost:  │  │ localhost:  │     │
  │  │   :8080     │  │   :9090     │     │
  │  └────────────┘  └────────────┘     │
  └──────────────────────────────────────┘
  Containers in a pod share localhost,
  like Kubernetes pod networking.
```

### Examples

```bash
# Rootless container (no sudo)
podman run --rm -it fedora:40 bash

# Create a pod with two containers
podman pod create --name mypod -p 8080:80
podman run -d --pod mypod --name web nginx:alpine
podman run -d --pod mypod --name cache redis:alpine

# Generate systemd unit
podman generate systemd --name web --new > ~/.config/systemd/user/web.service
systemctl --user enable --now web.service

# Kubernetes YAML from a pod
podman generate kube mypod > pod.yaml

# Play Kubernetes YAML
podman play kube pod.yaml
```

---

## systemd-nspawn --- lightweight system container

### Synopsis

```
systemd-nspawn [-D directory] [-b] [--network-veth] [command]
machinectl [start|stop|login|list] machine
```

### Description

Boots or runs commands inside an OS directory tree (like a chroot on steroids).
Uses Linux namespaces for isolation but focuses on full OS containers (with
init/systemd inside) rather than application containers. Part of systemd.

### Comparison

```
  chroot          systemd-nspawn       Docker/Podman
  ────────        ──────────────       ─────────────
  Filesystem      Filesystem +         Filesystem +
  isolation       PID, mount, net,     PID, mount, net,
  only            IPC, UTS, user       IPC, UTS, user,
                  namespaces           cgroups v2,
                                       seccomp, AppArmor
                  
                  Boots full OS        App-centric
                  (systemd inside)     (single process)
```

### Key Options

| Flag | Purpose |
|------|---------|
| `-D /path` | Root directory of the OS tree |
| `-b` | Boot: run init (systemd) inside |
| `--network-veth` | Virtual ethernet pair (isolated networking) |
| `--bind=/host:/container` | Bind mount |
| `-M name` | Machine name |
| `--ephemeral` | Discard changes on exit |
| `-U` | Use user namespaces (rootless) |

### Examples

```bash
# Bootstrap a minimal Debian tree
sudo debootstrap bookworm /var/lib/machines/bookworm

# Boot it as a system container
sudo systemd-nspawn -bD /var/lib/machines/bookworm

# Ephemeral (changes discarded)
sudo systemd-nspawn --ephemeral -bD /var/lib/machines/bookworm

# With isolated networking
sudo systemd-nspawn -bD /var/lib/machines/bookworm --network-veth

# Manage via machinectl
machinectl list
machinectl login bookworm
machinectl poweroff bookworm
```

---

## crictl --- CRI-compatible container runtime CLI

### Synopsis

```
crictl [global-options] command [options] [args...]
crictl pods [--name name] [--state ready]
crictl ps [-a] [-o json]
crictl logs container-id
```

### Description

Debug CLI for any Container Runtime Interface (CRI) implementation ---
containerd, CRI-O, or other CRI-compatible runtimes. Used to inspect and
troubleshoot Kubernetes node-level container state without kubectl.

### CRI architecture

```
  kubelet
    │
    └── CRI gRPC ──▸ containerd (or CRI-O)
                          │
                          ├── image pull / unpack
                          ├── create sandbox (pod)
                          │     └── pause container
                          └── create container
                                └── runc / crun (OCI runtime)
  
  crictl ──(CRI gRPC)──▸ same runtime socket
    speaks the same API as kubelet
```

### Key commands

| Command | Purpose |
|---------|---------|
| `pods` | List pods (sandboxes) |
| `ps` | List containers |
| `images` | List images |
| `logs <id>` | Container logs |
| `inspect <id>` | Container details (JSON) |
| `exec -it <id> sh` | Exec into container |
| `stats` | Resource usage |
| `pull <image>` | Pull image via CRI |
| `runp pod.json` | Create a pod sandbox |
| `create <pod-id> container.json pod.json` | Create container |

### Configuration

```yaml
# /etc/crictl.yaml
runtime-endpoint: unix:///run/containerd/containerd.sock
image-endpoint: unix:///run/containerd/containerd.sock
timeout: 10
debug: false
```

### Examples

```bash
# List all pods on this node
crictl pods
# POD ID        CREATED     STATE  NAME                   NAMESPACE
# abc123def456  2 hours ago Ready  coredns-xxxxxxxxxx-xx  kube-system

# List containers (including stopped)
crictl ps -a

# Get container logs
crictl logs --tail 50 abc123def456

# Exec into a container
crictl exec -it abc123def456 sh

# Inspect pod details
crictl inspectp abc123def456 | jq '.status.network'

# Pull an image
crictl pull registry.k8s.io/pause:3.10
```

---

## Cross-links

- VM management -> [vm_commands.md](vm_commands.md)
- Container internals -> [../topics/INDEX.md](../topics/INDEX.md)
- OCI runtime spec -> [../protocols/INDEX.md](../protocols/INDEX.md)
- Namespace/cgroup tools -> [../../05_OS_Kernel/man_pages/tracing_commands.md](../../05_OS_Kernel/man_pages/tracing_commands.md)
