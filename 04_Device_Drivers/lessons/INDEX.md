# Device Drivers — Lessons

## Dedicated lesson modules

| Topic | File |
|-------|------|
| Driver interactive labs | [driver_labs.md](driver_labs.md) — Linux char device, udev rules, Device Tree overlay |

---

1. **Kernel module hello-world** — load/unload, dmesg, params (`module_param`).
2. **Character driver** — register a `cdev`, implement `open/read/write/release`.
3. **ioctl design** — define commands, structs, copy_to/from_user.
4. **Sysfs & debugfs** — expose attributes; the right place for what.
5. **Interrupt handler** — request_irq, top-half vs bottom-half (tasklet/workqueue).
6. **DMA basics** — coherent vs streaming mappings, IOMMU awareness.
7. **PCI driver** — `pci_driver` boilerplate, BAR mapping, MSI/MSI-X.
8. **USB driver** — `usb_driver`, URBs, endpoint types.
9. **Network driver** — `net_device`, NAPI, ring buffers.
10. **Userspace driver** — UIO or VFIO for direct device access.
11. **Rust-for-Linux driver** — port a small module from C to Rust.
12. **Windows KMDF intro** — sample driver, INF file, install.

## Suggested external
- LWN.net article series — "Driver porting", "An updated kernel API"
- Greg Kroah-Hartman talks (FOSDEM/LPC)
- The Eudyptula Challenge (archived but invaluable)
