# Device Drivers — Topics

## What is in this section

```text
  Four groups: what a driver IS, how it talks to hardware, which
  framework it runs in, and how to debug it when it goes wrong.

  ┌─── driver classes ───────────────────────────────────────────────────┐
  │  char · block · network · USB · PCI/PCIe · platform · GPU (DRM/KMS) │
  └──────────────────────────────────────────────────────────────────────┘

  ┌─── hardware access mechanics ────────────────────────────────────────┐
  │  MMIO (ioremap)  │  PIO (inb/outb, x86)  │  DMA (coherent+streaming)│
  │  IOMMU (VT-d · AMD-Vi · SMMU)  │  IRQ (top-half · NAPI · threaded) │
  └──────────────────────────────────────────────────────────────────────┘

  ┌─── frameworks ───────────────────────────────────────────────────────┐
  │  Linux: struct device/bus/driver  │  Windows: WDM → WDF (KMDF|UMDF) │
  │  macOS: IOKit (legacy) → DriverKit│  userspace: VFIO · UIO · DPDK  │
  └──────────────────────────────────────────────────────────────────────┘

  ┌─── debugging & reliability ──────────────────────────────────────────┐
  │  Linux: lockdep · KASAN · KCSAN · kgdb/kdb                          │
  │  Windows: Driver Verifier · WinDbg (KD)                             │
  └──────────────────────────────────────────────────────────────────────┘
```

## Dedicated Topic Deep Dives

| File | Covers |
|------|--------|
| [Linux Driver Model](./driver_model.md) | Bus/device/driver binding, DT/ACPI, udev |

## Driver classes
- **Character drivers** — byte-stream devices (`/dev/tty*`, `/dev/random`)
- **Block drivers** — random-access storage (`/dev/sd*`, `/dev/nvme*`)
- **Network drivers** — packet I/O (`net_device`, NAPI, XDP)
- **USB drivers** — endpoint-based, URB-driven
- **PCI / PCIe drivers** — BAR mapping, MSI/MSI-X, DMA
- **Platform drivers** — Device-Tree / ACPI-described non-discoverable hardware
- **GPU drivers** — DRM/KMS on Linux, WDDM on Windows, IOAccelerator on macOS

## Mechanics
- **MMIO** — memory-mapped I/O regions; `ioremap` / `iounmap`
- **PIO** — port I/O (legacy x86): `inb`/`outb`
- **DMA** — Direct Memory Access; coherent vs streaming; scatter-gather
- **IOMMU** — VT-d, AMD-Vi, SMMU; per-device address spaces
- **Interrupts** — IRQ assignment, MSI/MSI-X, top-half/bottom-half, threaded IRQs
- **Polling vs interrupt** — tradeoffs; NAPI as the hybrid

## Frameworks & models
- **Linux device model** — `struct device`, `struct bus_type`, `struct driver`
- **Windows WDM / KMDF / UMDF** — one legacy model and two sibling frameworks
- **macOS IOKit (legacy) vs DriverKit (current)**
- **Userspace drivers** — VFIO, UIO, libusb, DPDK, SPDK

## Reliability & debugging
- **Lockdep, KASAN, KCSAN** — Linux kernel sanitizers
- **Driver Verifier** — Windows runtime stressor
- **kgdb, kdb** — kernel debugging on Linux
- **WinDbg** — Windows kernel debugging (KD)
- **Panic / oops analysis** — backtrace, decode_stacktrace.sh

## Security cross-link
- Vulnerable drivers (BYOVD) → [14_Security/topics](../../14_Security/topics/INDEX.md)
- Driver signing bypass / rootkits → [14_Security/topics](../../14_Security/topics/INDEX.md)
