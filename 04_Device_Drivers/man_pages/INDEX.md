# Device Drivers — Manual Pages

## Dedicated man page references

| Topic | File |
|-------|------|
| Device & driver management | [device_commands.md](device_commands.md) — lspci, lsusb, lsblk, modprobe, udevadm, dkms |

---

## Linux
| Command | Section | Purpose |
|---------|---------|---------|
| `lsmod` | 8 | List loaded kernel modules |
| `modinfo` | 8 | Module metadata (author, license, params) |
| `modprobe` | 8 | Load module + dependencies |
| `insmod` | 8 | Load a single module file |
| `rmmod` | 8 | Unload module |
| `depmod` | 8 | Generate module dependency map |
| `udevadm` | 8 | Query/monitor udev events |
| `dmesg` | 1 | Kernel ring buffer — driver bind/unbind |
| `modules-load.d` | 5 | Boot-time module list |
| `dkms` | 8 | Out-of-tree module rebuild on kernel upgrade |
| `ethtool` | 8 | NIC driver knobs (offloads, ring sizes) |
| `nvidia-smi` | 1 | NVIDIA driver/runtime monitor |
| `rocm-smi` | 1 | AMD ROCm equivalent |

## macOS
| Command | Purpose |
|---------|---------|
| `kextstat` | List loaded kernel extensions (deprecated path) |
| `kmutil` | Modern kext / driver extension management |
| `systemextensionsctl` | Manage system extensions (DriverKit) |
| `pluginkit` | List installed extensions |

## Windows
| Command | Purpose |
|---------|---------|
| `pnputil` | Add/remove drivers, list installed |
| `driverquery` | List installed drivers |
| `devcon` (legacy) / `pnputil` | Device control |
| `sc query type=driver` | Service Control Manager view of drivers |
| `verifier` | Driver Verifier — runtime checks |

## Cross-platform
- `libusb` — userspace USB access
- `pyudev` — Python udev bindings
