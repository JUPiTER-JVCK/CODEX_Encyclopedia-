---
title: "UEFI Boot Flow"
layer: 03_Firmware_BIOS
section: topics
tags: [topic, uefi, bios, boot, secure-boot, gpt, pei, dxe]
updated: 2026-05-21
---

# UEFI Boot Flow

---

## Overview

UEFI (Unified Extensible Firmware Interface) replaced legacy BIOS. It provides
a richer pre-OS environment with a standardized API, a driver model, network
stack, and Secure Boot. The PI (Platform Initialization) specification defines
the boot phases.

---

## Boot Phases

```
  Power-on → SEC → PEI → DXE → BDS → TSL → RT → AL
  
  ┌─────────────────────────────────────────────────────────────┐
  │ SEC  Security Phase                                         │
  │  • CPU in real mode, cache-as-RAM (CAR) trick for stack     │
  │  • Minimal — verify PEI code, set up initial trust          │
  │  • Hardware: locate & validate PEI Foundation               │
  └───────────────────────────┬─────────────────────────────────┘
                              ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ PEI  Pre-EFI Initialization                                 │
  │  • PEIMs (small modules) initialize CPU, chipset, DRAM      │
  │  • First real memory available after DRAM init              │
  │  • Produces HOBs (Hand-Off Blocks) for DXE                  │
  │  • Discovers and validates DXE Core image                   │
  └───────────────────────────┬─────────────────────────────────┘
                              ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ DXE  Driver Execution Environment                           │
  │  • DXE Core loads DXE drivers (storage, NIC, GPU…)         │
  │  • UEFI Boot Services & Runtime Services established        │
  │  • Rich environment: PCIe enumeration, ACPI tables, SMBIOS  │
  │  • DXE dispatcher runs drivers in dependency order          │
  └───────────────────────────┬─────────────────────────────────┘
                              ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ BDS  Boot Device Select                                     │
  │  • UEFI Boot Manager: tries Boot#### entries in order       │
  │  • Loads EFI application from ESP (EFI System Partition)    │
  │  • Fallback: \EFI\BOOT\BOOTX64.EFI (removable media)       │
  └───────────────────────────┬─────────────────────────────────┘
                              ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ TSL  Transient System Load (OS loader)                      │
  │  • GRUB or Windows Boot Manager running as UEFI app         │
  │  • Calls ExitBootServices() → Boot Services torn down       │
  └───────────────────────────┬─────────────────────────────────┘
                              ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ RT   Runtime (OS running)                                   │
  │  • Only Runtime Services remain (GetTime, SetVariable…)    │
  │  • OS accesses EFI Runtime Services via virtual mapping     │
  └─────────────────────────────────────────────────────────────┘
```

---

## GUID Partition Table (GPT)

UEFI requires GPT (or MBR with protective MBR for compatibility):

```
  GPT disk layout:
  LBA 0:   Protective MBR (legacy compatibility)
  LBA 1:   Primary GPT Header
  LBA 2-33: Partition Entry Array (128 entries × 128 bytes)
  LBA 34 – (last-34): Data partitions
  LBA (last-33) – (last): Secondary Partition Entry Array
  LBA last: Secondary GPT Header (backup)

  Required partition:
  EFI System Partition (ESP):
    Type GUID: C12A7328-F81F-11D2-BA4B-00A0C93EC93B
    Format: FAT32
    Mount: /boot/efi (Linux) or \EFI\ (Windows)
    Contents: \EFI\<distro>\grubx64.efi, shimx64.efi, etc.
```

---

## Secure Boot Chain

```
  Secure Boot key hierarchy:
  
  Platform Key (PK)          — OEM/platform owner (root of trust)
       │
  Key Exchange Keys (KEK)   — OS vendor keys (Microsoft, distro)
       │
  ┌────┴─────────────────────────────────┐
  │ db (Signature Database)             │  Allowed signatures
  │ dbx (Forbidden Signature Database)  │  Revoked signatures
  └─────────────────────────────────────┘
  
  Boot sequence with Secure Boot ON:
  
  UEFI firmware → verify shimx64.efi signature (vs db)
                → shim verifies grubx64.efi (vs embedded cert)
                → GRUB verifies kernel (vs MOK database)
                → Kernel runs
  
  Any verification failure → boot halted (or fallback to Setup)
```

### MOK — Machine Owner Key

Allows users to enroll their own keys (e.g., for self-compiled kernels
or proprietary drivers like NVIDIA) without disabling Secure Boot:

```bash
sudo mokutil --import my_key.der   # Enroll key (prompts for MOK password)
# Reboot → MokManager (blue screen) → enroll → continue
sudo mokutil --list-enrolled       # Verify enrollment
```

---

## EFI Variables

UEFI stores persistent configuration in non-volatile NVRAM:

```bash
# List EFI variables (Linux)
ls /sys/firmware/efi/efivars/
efibootmgr -v                       # Boot entries
efivar -l                           # All variables

# Read a variable
cat /sys/firmware/efi/efivars/BootOrder-8be4df61-...

# UEFI shell variable access:
> dmpstore -all           # Dump all NVRAM variables
> set BootOrder           # Show boot order
```

---

## ACPI and SMBIOS

| Table | Purpose |
|-------|---------|
| ACPI (RSDP → RSDT/XSDT) | Power management, device enumeration |
| DSDT/SSDT | AML bytecode for device methods |
| MADT | Interrupt controller topology (APICs) |
| SMBIOS (DMI) | Hardware inventory (CPU, RAM, chassis info) |

```bash
# Read SMBIOS on Linux
sudo dmidecode -t bios
sudo dmidecode -t memory

# ACPI tables
sudo cat /sys/firmware/acpi/tables/DSDT | iasl -d -
```

---

## Key Terms

| Term | Definition |
|------|-----------|
| UEFI | Unified Extensible Firmware Interface — replaces legacy BIOS |
| PI | Platform Initialization — Intel/TianoCore boot phase spec |
| PEI | Pre-EFI Initialization — DRAM init phase |
| DXE | Driver Execution Environment — rich driver environment |
| BDS | Boot Device Select — boot manager phase |
| ESP | EFI System Partition — FAT32 partition holding bootloaders |
| GPT | GUID Partition Table — UEFI partition scheme |
| HOB | Hand-Off Block — data passed from PEI to DXE |
| Secure Boot | Chain of trust: PK → KEK → db → shim → GRUB → kernel |
| MOK | Machine Owner Key — user-enrolled Secure Boot key |

---

## See Also

- Firmware lab exercises → [../lessons/firmware_labs.md](../lessons/firmware_labs.md)
- Firmware tools → [../man_pages/firmware_tools.md](../man_pages/firmware_tools.md)
- Device driver model → [../../04_Device_Drivers/topics/driver_model.md](../../04_Device_Drivers/topics/driver_model.md)
