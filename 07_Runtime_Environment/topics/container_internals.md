---
title: "Container Internals"
layer: 07_Runtime_Environment
section: topics
tags: [topic, container, namespaces, cgroups, overlayfs, seccomp, linux]
updated: 2026-05-21
---

# Container Internals

---

## Overview

Linux containers are not a single kernel feature — they are a composition
of several independent kernel mechanisms: **namespaces** (isolation),
**cgroups** (resource limits), **overlayfs** (layered filesystem), and
**seccomp/capabilities** (security policy).

```
  Container = PID namespace
            + Net namespace
            + Mount namespace
            + UTS namespace      ← hostname isolation
            + IPC namespace
            + User namespace (optional)
            + cgroup v2
            + overlayfs rootfs
            + seccomp filter
            + capability drop
```

---

## Namespaces

Linux namespaces partition global kernel resources so each container
sees its own isolated view:

| Namespace | Isolates | Kernel version |
|-----------|----------|----------------|
| Mount (mnt) | Filesystem tree | 2.4.19 |
| UTS | Hostname, NIS domain | 2.6.19 |
| IPC | SysV IPC, POSIX MQ | 2.6.19 |
| PID | Process IDs | 2.6.24 |
| Network (net) | Interfaces, routes, iptables | 2.6.24 |
| User | UIDs, GIDs, capabilities | 3.8 |
| Cgroup | cgroup root | 4.6 |
| Time | Boot/monotonic clocks | 5.6 |

```bash
# Inspect namespaces of a running container:
pid=$(docker inspect --format '{{.State.Pid}}' mycontainer)
ls -la /proc/$pid/ns/
# lrwxrwxrwx 1 root root 0 net -> net:[4026532345]
# lrwxrwxrwx 1 root root 0 pid -> pid:[4026532347]
# ...

# Enter a container's namespace manually:
nsenter -t $pid --net --pid -- ip a
nsenter -t $pid --all -- bash

# Create namespaces (unshare):
sudo unshare --pid --fork --mount-proc bash
# Now running in a new PID namespace: ps aux shows only 2 processes
```

---

## cgroups v2

Control groups limit and account for resource usage:

```
  cgroup v2 hierarchy (unified):
  
  /sys/fs/cgroup/
  ├── system.slice/
  │   └── docker-<id>.scope/
  │       ├── memory.max          → 512M
  │       ├── memory.current      → 234M (live reading)
  │       ├── cpu.max             → 100000 500000 (100ms/500ms = 20%)
  │       ├── cpu.stat            → usage_usec, throttled_usec
  │       └── pids.max            → 100
  └── user.slice/
```

```bash
# Set memory limit for a cgroup:
echo "536870912" > /sys/fs/cgroup/mycontainer/memory.max  # 512 MiB

# List containers' cgroup stats:
systemd-cgls
systemd-cgtop

# Docker-managed cgroups:
docker stats mycontainer  # Reads from /sys/fs/cgroup/...
```

### OOM (Out-Of-Memory) Killer

When a container exceeds its memory limit, the kernel OOM killer
terminates the most memory-consuming process. In containers, this
typically kills the main process (PID 1), stopping the container.

---

## overlayfs — Layered Filesystem

Container images are stacked layers. overlayfs merges them at mount time:

```
  overlayfs layer stack (alpine-based nginx image):
  
  upperdir (writable layer — container-specific)  ← writes go here
  ──────────────────────────────────────────────
  overlay:
  layer 4: nginx config files (delta)
  layer 3: nginx binary + libs
  layer 2: Alpine base packages
  layer 1: Alpine root filesystem
  ──────────────────────────────────────────────
  merged view:  /  (what the container sees)
  
  Read: kernel walks layers top-down; returns first match
  Write: copy-up — file copied to upperdir before modification
  Delete: whiteout file (.wh.filename) marks deletion in upperdir

# Manual overlayfs mount:
sudo mount -t overlay overlay \
    -o lowerdir=/layer1:/layer2:/layer3,\
       upperdir=/container-rw,\
       workdir=/work \
    /merged
```

---

## Capabilities

Linux capabilities split root privileges into ~40 fine-grained tokens.
Containers drop most capabilities, keeping only what the app needs:

```
  Default Docker capabilities (kept):
  CAP_CHOWN, CAP_DAC_OVERRIDE, CAP_FSETID, CAP_FOWNER,
  CAP_MKNOD, CAP_NET_RAW, CAP_SETGID, CAP_SETUID,
  CAP_SETFCAP, CAP_SETPCAP, CAP_NET_BIND_SERVICE,
  CAP_SYS_CHROOT, CAP_KILL, CAP_AUDIT_WRITE

  Dropped by default (dangerous):
  CAP_SYS_ADMIN    — mount, ioctl, perf, etc. (huge attack surface)
  CAP_SYS_PTRACE   — ptrace any process
  CAP_NET_ADMIN    — configure network interfaces
  CAP_SYS_MODULE   — load kernel modules
```

```bash
# Run with no capabilities (most restrictive):
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE nginx

# Inspect capabilities:
capsh --print
cat /proc/self/status | grep Cap
capsh --decode=<hex_value>
```

---

## seccomp — Syscall Filtering

Docker's default seccomp profile blocks ~44 dangerous syscalls:

```
  Default blocked (examples):
  keyctl, ptrace, add_key, request_key  — key management
  reboot                                 — reboot host
  setns                                  — switch namespaces
  clone with CLONE_NEWUSER               — user namespace creation
  mount, umount2                         — filesystem ops
  perf_event_open                        — performance counters
  pivot_root, chroot                     — root change
  
  Custom seccomp profile (JSON):
  {
    "defaultAction": "SCMP_ACT_ERRNO",
    "syscalls": [
      { "names": ["read","write","open","close","stat"],
        "action": "SCMP_ACT_ALLOW" }
    ]
  }
```

```bash
# Run with custom seccomp:
docker run --security-opt seccomp=./my.json alpine sh

# Run without seccomp (not recommended):
docker run --security-opt seccomp=unconfined alpine sh
```

---

## Container from Scratch (Demo)

```bash
# Build a minimal container manually (no Docker):
mkdir -p /tmp/croot/bin /tmp/croot/lib /tmp/croot/lib64

# Copy busybox as static shell:
cp $(which busybox) /tmp/croot/bin/sh

# Unshare + chroot = basic container:
sudo unshare --pid --fork --mount-proc \
    chroot /tmp/croot /bin/sh -c "ps aux"
# Shows: only 2 processes (sh + ps) — PID namespace isolated
```

---

## Key Terms

| Term | Definition |
|------|-----------|
| Namespace | Kernel mechanism isolating a global resource per group of processes |
| cgroup | Control group — limits/accounts CPU, memory, pids, I/O |
| overlayfs | Stackable filesystem — merges read-only layers + writable layer |
| upperdir | Writable layer in overlayfs (container writes land here) |
| Copy-up | File copied to upperdir before first write (overlayfs) |
| Whiteout | overlayfs deletion marker (.wh.filename) |
| Capability | Fine-grained privilege token (split from root) |
| seccomp | Kernel syscall filter — allowlist/denylist per process |
| nsenter | Enter a running process's namespaces |
| unshare | Create new namespaces and exec a process inside them |

---

## See Also

- Runtime lab exercises → [../lessons/runtime_labs.md](../lessons/runtime_labs.md)
- Container tools → [../man_pages/container_commands.md](../man_pages/container_commands.md)
- OCI runtime spec → [../protocols/oci_runtime.md](../protocols/oci_runtime.md)
- Security labs → [../../14_Security/lessons/security_labs.md](../../14_Security/lessons/security_labs.md)
