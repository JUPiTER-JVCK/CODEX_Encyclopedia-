# Device Drivers — Protocols & APIs

Not wire protocols — driver↔OS contracts and stable userspace ABIs.

## Linux subsystem APIs
| Subsystem | Driver registration | User interface |
|-----------|--------------------|-----------------|
| Character | `cdev_add` / `register_chrdev` | `/dev/*`, ioctl |
| Block | `add_disk`, `blk_mq_*` | `/dev/sd*`, syscalls |
| Network | `register_netdev` | sockets, netlink |
| USB | `usb_register` | `/dev/bus/usb`, sysfs |
| PCI | `pci_register_driver` | sysfs, /proc/bus/pci |
| Platform | `platform_driver_register` | DT/ACPI matched |
| Input | `input_register_device` | `/dev/input/event*` |
| DRM/KMS | `drm_dev_register` | `/dev/dri/*` |
| V4L2 | `video_register_device` | `/dev/video*` |
| ALSA | `snd_card_register` | `/dev/snd/*` |

## Driver-to-OS frameworks
| Framework | OS | Status |
|-----------|----|----|
| WDM (Windows Driver Model) | Windows | Legacy |
| KMDF (Kernel-Mode Driver Framework) | Windows | Active |
| UMDF (User-Mode Driver Framework) | Windows | Active |
| IOKit | macOS (kexts) | Deprecated |
| DriverKit | macOS / iOS | Active |
| newbus | FreeBSD | Active |
| autoconf | NetBSD / OpenBSD | Active |

## Userspace I/O APIs
- **VFIO** — IOMMU-protected device passthrough (KVM, DPDK)
- **UIO** — simple userspace I/O for memory-mapped devices
- **libusb** — cross-platform USB access
- **DPDK PMD** — poll-mode NIC drivers in userspace
- **SPDK** — NVMe poll-mode in userspace

## Conventions
- **ioctl numbering** — Linux `_IOR/_IOW/_IOWR` macros, magic numbers
- **netlink** — generic netlink families for config/events
- **sysfs / debugfs** — attribute conventions: one value per file
- **udev rules** — `KERNEL==`, `SUBSYSTEM==`, `ATTRS{vendor}==`
