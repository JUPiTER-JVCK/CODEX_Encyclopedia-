# 04 — Device Drivers

> The translation layer between hardware quirks and OS-uniform APIs. Drivers
> let the kernel speak to the wildly varied stuff on the board without each
> subsystem reinventing the wheel.

## At a glance

| Field | Value |
|-------|-------|
| Description | Controls hardware; interfaces hardware to OS |
| Languages | C (dominant), C++, Rust (Linux), Swift (DriverKit) |
| Medium / Interface | OS driver APIs, hardware buses, IRQs, MMIO, DMA |
| Example | Disk driver reads data from disk |
| Adjacent layers | ↓ [01_Circuit_Board](../01_Circuit_Board/), ↑ [05_OS_Kernel](../05_OS_Kernel/) |

## What lives here

- **Linux drivers** — character, block, network, USB, PCI, platform; in-tree & DKMS
- **Windows drivers** — KMDF, UMDF, WDM; signed driver requirement
- **macOS / iOS** — IOKit (legacy), DriverKit (`*.dext`), kexts (deprecated)
- **BSD drivers** — newbus (FreeBSD), autoconf (OpenBSD/NetBSD)
- **Firmware blobs** — `linux-firmware`, vendor microcode
- **Userspace drivers** — VFIO, UIO, libusb, DPDK PMDs, SPDK

## Sub-sections

- [references/](references/INDEX.md) — LDD3, Windows Driver Kit docs
- [lessons/](lessons/INDEX.md) — write a char driver → write a PCI driver
- [languages/](languages/INDEX.md) — kernel C, Rust-for-Linux, DriverKit Swift
- [man_pages/](man_pages/INDEX.md) — `modprobe`, `lsmod`, `udevadm`, `kextstat`
- [topics/](topics/INDEX.md) — interrupts, DMA, MMIO, driver models
- [protocols/](protocols/INDEX.md) — driver↔kernel ABIs, ioctl conventions

## Cross-references
- Bus enumeration → [01_Circuit_Board/topics](../01_Circuit_Board/topics/INDEX.md)
- Kernel module loading → [05_OS_Kernel/topics](../05_OS_Kernel/topics/INDEX.md)
- Driver-shipped vulns → [14_Security/topics](../14_Security/topics/INDEX.md)
