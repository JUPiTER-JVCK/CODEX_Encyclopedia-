---
title: "Firmware Management Commands"
layer: 03_Firmware_BIOS
section: man_pages
tags: [fwupdmgr, efibootmgr, mokutil, nvram, firmware, uefi, secure-boot, man-section-1, man-section-8]
updated: 2026-05-21
---

# Firmware Management Commands

> Tools for managing UEFI firmware, boot entries, Secure Boot, and firmware
> updates on Linux and macOS.

---

## fwupdmgr — firmware update manager

### Synopsis

```
fwupdmgr [command] [options]
```

### Description

CLI for the Linux Vendor Firmware Service (LVFS). Discovers, downloads, and
applies firmware updates for UEFI BIOS, SSDs, Thunderbolt controllers, TPMs,
and other system components — without rebooting into a vendor updater.

### Key commands

| Command | Purpose |
|---------|---------|
| `get-devices` | List hardware with firmware |
| `get-updates` | Check for available updates |
| `update` | Download and apply all pending updates |
| `install <file>` | Install a local `.cab` firmware file |
| `get-history` | Show previous update history |
| `refresh` | Force refresh metadata from LVFS |
| `security` | Show Host Security ID (HSI) level |
| `get-plugins` | List active firmware plugins |

### HSI security levels

```
  HSI:0  — No protection
  HSI:1  — Basic: UEFI Secure Boot, no SPI write
  HSI:2  — + TPM 2.0, IOMMU (VT-d/AMD-Vi)
  HSI:3  — + SPI protection, encrypted RAM, verified boot
  HSI:4  — + tamper-evident, firmware attestation
```

### Examples

```bash
# Check for firmware updates
sudo fwupdmgr get-updates

# Apply all updates (may require reboot)
sudo fwupdmgr update

# Show firmware versions for all devices
fwupdmgr get-devices --show-all-devices

# Security posture
fwupdmgr security
# Host Security ID: HSI:2 (v1.9.6)
#   ✔ UEFI Secure Boot
#   ✔ TPM v2.0
#   ✔ IOMMU
#   ✘ SPI write protection
```

---

## efibootmgr — UEFI Boot Manager

### Synopsis

```
efibootmgr [-v] [-c] [-d disk] [-p part] [-l loader] [-L label]
efibootmgr -b XXXX -B
efibootmgr -o XXXX,YYYY,ZZZZ
```

### Description

Manages UEFI boot entries stored in NVRAM. Lists, creates, deletes, and
reorders boot options. Essential for dual-boot setups and boot recovery.

### Key Options

| Flag | Purpose |
|------|---------|
| `-v` | Verbose (show file paths) |
| `-c` | Create a new boot entry |
| `-b XXXX` | Select boot entry by hex number |
| `-B` | Delete selected entry |
| `-o XXXX,YYYY` | Set boot order |
| `-n XXXX` | Set next-boot-only entry |
| `-d /dev/sda` | Disk for new entry |
| `-p 1` | Partition number |
| `-l '\EFI\ubuntu\shimx64.efi'` | Loader path (backslash-separated) |
| `-L "Ubuntu"` | Label for the entry |

### Examples

```bash
# List all boot entries
efibootmgr -v
# BootCurrent: 0001
# Timeout: 3 seconds
# BootOrder: 0001,0003,0000
# Boot0000* Windows Boot Manager  HD(1,...)/File(\EFI\Microsoft\Boot\bootmgfw.efi)
# Boot0001* Ubuntu                HD(1,...)/File(\EFI\ubuntu\shimx64.efi)
# Boot0003* UEFI: USB Drive       PciRoot(0x0)/...

# Add a custom entry
sudo efibootmgr -c -d /dev/nvme0n1 -p 1 \
  -l '\EFI\custom\grubx64.efi' -L 'Custom GRUB'

# Change boot order
sudo efibootmgr -o 0001,0000,0003

# One-time boot to USB
sudo efibootmgr -n 0003

# Delete an entry
sudo efibootmgr -b 0004 -B
```

---

## mokutil — Machine Owner Key management

### Synopsis

```
mokutil [--sb-state] [--list-enrolled] [--import key.der]
mokutil [--enable-validation] [--disable-validation]
```

### Description

Manages Machine Owner Keys (MOKs) for UEFI Secure Boot. MOKs are a second
key database (alongside the UEFI db) managed by `shim` — the first-stage
bootloader used by Linux distributions. Needed when installing third-party
kernel modules (NVIDIA, VirtualBox) that require signing.

### Key commands

| Command | Purpose |
|---------|---------|
| `--sb-state` | Show Secure Boot status |
| `--list-enrolled` | List enrolled MOK keys |
| `--import key.der` | Queue a key for enrollment (requires reboot) |
| `--delete key.der` | Queue a key for removal |
| `--enable-validation` | Re-enable Secure Boot validation |
| `--disable-validation` | Disable validation (not recommended) |
| `--export` | Export enrolled keys |

### MOK enrollment flow

```
  1. mokutil --import signing_key.der
     → enters a one-time password

  2. Reboot → shim/MOKManager appears
     → "Enroll MOK" → enter password → confirm

  3. Key is now in MOK database
     → signed kernel modules will load
```

### Examples

```bash
# Check Secure Boot status
mokutil --sb-state
# SecureBoot enabled

# List enrolled keys
mokutil --list-enrolled | grep -A3 'Subject:'

# Import a signing key (for DKMS/NVIDIA modules)
sudo mokutil --import /var/lib/shim-signed/mok/MOK.der
# (enter a one-time password, then reboot)
```

---

## nvram — macOS NVRAM management

### Synopsis

```
nvram [-p] [-d name] [name[=value]]
```

### Description

macOS tool for reading and writing NVRAM (PRAM) variables — the firmware
key-value store that persists across reboots. Includes boot arguments,
startup disk selection, and system integrity settings.

### Key variables

| Variable | Purpose |
|----------|---------|
| `boot-args` | Kernel boot arguments (e.g., `-v` for verbose boot) |
| `SystemAudioVolume` | Startup chime volume |
| `StartupMute` | Suppress startup sound |
| `csr-active-config` | SIP (System Integrity Protection) configuration |
| `AutoBoot` | Boot on lid open / power connect |

### Examples

```bash
# Print all NVRAM variables
nvram -p

# Enable verbose boot
sudo nvram boot-args="-v"

# Reset boot-args
sudo nvram -d boot-args

# Check SIP status (read csr-active-config)
nvram csr-active-config
# csr-active-config    %00%00%00%00   ← SIP fully enabled

# Reset NVRAM (all variables to defaults)
# Hold Cmd+Opt+P+R at boot (Apple Silicon: different procedure)
```

---

## Cross-links

- UEFI boot flow → [../topics/INDEX.md](../topics/INDEX.md)
- Device drivers → [../../04_Device_Drivers/man_pages/INDEX.md](../../04_Device_Drivers/man_pages/INDEX.md)
- Security (Secure Boot) → [../../14_Security/topics/INDEX.md](../../14_Security/topics/INDEX.md)
