# Runtime Environment — Manual Pages

## Dedicated man page references

| Topic | File |
|-------|------|
| Container management | [container_commands.md](container_commands.md) — docker, podman, systemd-nspawn, crictl |
| Virtual machine management | [vm_commands.md](vm_commands.md) — qemu-system, virsh, VBoxManage |

---

## Language runtimes (CLI launchers)
| Command | Runtime |
|---------|---------|
| `java`, `javac`, `jar`, `jdeps`, `jcmd`, `jstack`, `jmap`, `jstat` | JVM toolchain |
| `dotnet` | .NET CLI |
| `node`, `npx`, `deno`, `bun` | JavaScript runtimes |
| `python` / `python3`, `pip`, `pipx`, `uv`, `poetry` | CPython ecosystem |
| `ruby`, `gem`, `bundle`, `rake` | Ruby |
| `go`, `go run`, `go test`, `go tool pprof` | Go |
| `cargo`, `rustc`, `rustup` | Rust |
| `swift` | Swift |
| `erl`, `iex`, `mix`, `rebar3` | BEAM languages |
| `php`, `composer` | PHP |
| `perl`, `cpan` | Perl |

## Wasm
| Command | Purpose |
|---------|---------|
| `wasmtime` | Wasmtime CLI runtime |
| `wasmer` | Wasmer CLI runtime |
| `wasm-tools` | wasm utilities (validate, dump, component) |
| `wasm-pack` | Rust → npm wasm packaging |

## Containers
| Command | Purpose |
|---------|---------|
| `docker` | Docker CLI |
| `podman` | Daemonless container CLI |
| `nerdctl` | containerd CLI |
| `ctr` | containerd low-level CLI |
| `runc` / `crun` | OCI runtime executors |
| `buildah`, `buildkit`, `kaniko` | Image builders |
| `skopeo` | Inspect / copy / sign images |
| `dive` | Inspect image layers |
| `slim` (DockerSlim) | Minimize images |

## Orchestrators
| Command | Purpose |
|---------|---------|
| `kubectl` | Kubernetes client |
| `helm` | K8s package manager |
| `kustomize` | K8s manifest overlay |
| `kind` | Local K8s (in Docker) |
| `minikube` | Local K8s VM |
| `k3s`, `k3d` | Lightweight K8s |
| `nomad` | HashiCorp scheduler |

## Hypervisors
| Command | Purpose |
|---------|---------|
| `qemu-system-*` | QEMU |
| `virsh`, `virt-install`, `virt-manager` | libvirt |
| `firecracker`, `cloud-hypervisor` | microVMs |
| `bhyve` | FreeBSD hypervisor |
