---
title: "Firmware & BIOS — Interactive Labs"
layer: 03_Firmware_BIOS
section: lessons
tags: [lesson, firmware, uefi, secure-boot, fwupdmgr, lab, quiz, hands-on]
updated: 2026-05-21
---

# Firmware & BIOS — Interactive Labs

---

## Module 1: UEFI Shell Exploration

### Objective

Boot into the UEFI Shell, navigate the firmware environment, inspect
EFI variables, and understand the pre-OS boot environment.

### Prerequisites

- x86-64 system with UEFI firmware (or QEMU + OVMF)
- USB drive with UEFI Shell (or built-in firmware shell)

### Lab Steps

1. Enter UEFI Shell (press F2/Del at boot → select "UEFI Shell", or boot QEMU with OVMF)

```bash
# QEMU approach (no real hardware needed):
qemu-system-x86_64 -enable-kvm -bios /usr/share/OVMF/OVMF_CODE.fd \
  -m 512M -nographic
# This drops you into the UEFI Shell
```

2. Explore the shell:
```
Shell> ver                    # UEFI shell version
Shell> map -r                 # List mapped filesystems and block devices
Shell> fs0:                   # Switch to first filesystem
FS0:\> ls                     # List EFI files
FS0:\> ls EFI\ubuntu\         # See bootloader files
Shell> bcfg boot dump         # Show boot entries
Shell> dmpstore               # Dump NVRAM variables
Shell> memmap                 # Memory map (used by OS bootloader)
```

3. Examine the boot entry:
```
Shell> bcfg boot dump
# 01. Boot0001 "Ubuntu" HD(1,GPT,...)/File(\EFI\ubuntu\shimx64.efi)
# 02. Boot0000 "Windows" HD(1,GPT,...)/File(\EFI\Microsoft\Boot\bootmgfw.efi)
```

### Knowledge Check

**Q1**: What is the EFI System Partition (ESP)?

> **A1**: A FAT32 partition (typically 512 MB, type EF00) mounted at
> /boot/efi on Linux. Contains bootloader binaries (.efi files),
> firmware update capsules, and boot configuration. Every UEFI OS
> installs its bootloader here.

**Q2**: What is the difference between Legacy BIOS and UEFI boot?

> **A2**: Legacy BIOS reads the first 512 bytes (MBR) and jumps to the
> bootloader code there. UEFI reads the GPT partition table, finds the
> ESP, and loads a .efi binary directly — supporting Secure Boot,
> large disks (>2TB), and a richer pre-boot environment.

---

## Module 2: Firmware Updates with fwupdmgr

### Objective

Check firmware versions, view the security posture (HSI), and safely
apply firmware updates via the Linux Vendor Firmware Service.

### Prerequisites

- Linux system with `fwupd` installed
- Internet access (for LVFS metadata)

### Lab Steps

1. List devices with firmware:
```bash
fwupdmgr get-devices
# System Firmware:
#   Current version: 1.23.0
#   Vendor: Dell Inc.
#   Update State: Success
# NVMe SSD:
#   Current version: 2.1
```

2. Check for updates:
```bash
fwupdmgr get-updates
# System Firmware has update available: 1.24.0
```

3. Check security posture:
```bash
fwupdmgr security
# Host Security ID: HSI:2
#   ✔ UEFI Secure Boot
#   ✔ TPM 2.0
#   ✔ IOMMU
#   ✘ SPI write protection
```

4. View update history:
```bash
fwupdmgr get-history
```

### Knowledge Check

**Q1**: What does HSI:3 require beyond HSI:2?

> **A1**: HSI:3 adds SPI flash write protection, encrypted RAM (TME/SME),
> and verified boot chain. HSI:2 requires Secure Boot + TPM 2.0 + IOMMU.

**Q2**: Why does firmware update sometimes require a reboot?

> **A2**: UEFI firmware updates use the UpdateCapsule mechanism: the update
> is staged to the ESP, and the firmware applies it during the next boot
> cycle before handing off to the OS. The firmware can only be written
> from the firmware environment itself, not from the running OS.

---

## Module 3: Secure Boot Key Enrollment

### Objective

Understand the Secure Boot chain of trust, check its status, and enroll
a Machine Owner Key for third-party kernel modules.

### Secure Boot chain

```
  Platform Key (PK)
  └── owned by hardware vendor
      │
      ▼
  Key Exchange Key (KEK)
  └── allows modifying db/dbx
      │
      ▼
  Signature Database (db)
  ├── Microsoft Windows Production PCA
  ├── Microsoft UEFI CA (for 3rd-party)
  └── Canonical (Ubuntu shim)
      │
      ▼
  shim (first-stage bootloader, signed by Microsoft UEFI CA)
  └── has embedded Canonical key + MOK database
      │
      ▼
  GRUB (signed by Canonical key or MOK)
  └── loads kernel
      │
      ▼
  vmlinuz (signed by Canonical key or MOK)
  └── loads modules
      │
      ▼
  Kernel modules (NVIDIA, VirtualBox, etc.)
  └── must be signed by MOK key
      └── mokutil --import → reboot → MOKManager enrollment
```

### Lab Steps

1. Check Secure Boot status:
```bash
mokutil --sb-state
# SecureBoot enabled
```

2. List enrolled keys:
```bash
mokutil --list-enrolled | grep -A3 'Subject:'
```

3. (If needed) Import a signing key:
```bash
sudo mokutil --import /var/lib/shim-signed/mok/MOK.der
# Enter a one-time password
# Reboot → MOKManager → "Enroll MOK" → enter password → confirm
```

### Review Flashcards

| Term | Definition |
|------|-----------|
| UEFI | Unified Extensible Firmware Interface — modern BIOS replacement |
| ESP | EFI System Partition — FAT32, holds bootloaders |
| GPT | GUID Partition Table — replaces MBR, supports >2TB |
| Secure Boot | Firmware verifies digital signatures before executing boot code |
| PK/KEK/db | Platform Key / Key Exchange Key / Signature Database |
| MOK | Machine Owner Key — user-managed key for Secure Boot |
| shim | Microsoft-signed first-stage bootloader for Linux |
| HSI | Host Security ID — fwupd security posture rating |
| NVRAM | Non-volatile RAM storing firmware variables |

### Challenge

> Set up QEMU with OVMF, install Ubuntu, enable Secure Boot, install
> the NVIDIA driver (which requires MOK enrollment). Document each step
> and verify the driver loads after enrollment with `lsmod | grep nvidia`.

---

## Cross-links

- Firmware tools → [../man_pages/firmware_tools.md](../man_pages/firmware_tools.md)
- Device driver labs → [../../04_Device_Drivers/lessons/driver_labs.md](../../04_Device_Drivers/lessons/driver_labs.md)
- CPU labs → [../../02_CPU/lessons/cpu_labs.md](../../02_CPU/lessons/cpu_labs.md)
