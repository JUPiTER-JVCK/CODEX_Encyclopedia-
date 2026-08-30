# 03 — Firmware / BIOS

> The first software the CPU runs. Initializes RAM, enumerates buses, sets up
> the platform, and hands control to a bootloader and ultimately the OS.

## At a glance

| Field | Value |
|-------|-------|
| Description | Initializes hardware and loads the OS |
| Languages | Assembly, C (some Rust, e.g. oreboot) |
| Medium / Interface | Firmware routines, hardware I/O, UEFI services, ACPI |
| Example | Loads OS from disk via bootloader |
| Adjacent layers | ↓ [02_CPU](../02_CPU/), ↑ [05_OS_Kernel](../05_OS_Kernel/) |

## What lives here

- Legacy BIOS, UEFI, Open Firmware, coreboot, U-Boot
- Bootloaders: GRUB2, systemd-boot, Windows Boot Manager, iBoot, rEFInd
- Platform firmware: ME (Intel), PSP (AMD), BMC (IPMI/Redfish, OpenBMC)
- Embedded firmware: RTOS, bare-metal Cortex-M, ESP-IDF
- TPM 2.0 measured boot, Secure Boot chain
- ACPI tables, Device Tree Blobs (DTB)

## Sub-sections

- [references/](references/INDEX.md) — UEFI spec, coreboot docs, ACPI
- [lessons/](lessons/INDEX.md) — from blink-an-LED to a UEFI app
- [languages/](languages/INDEX.md) — freestanding C, asm, ACPI Source Language
- [man_pages/](man_pages/INDEX.md) — `efibootmgr`, `mokutil`, `bootctl`, `flashrom`
- [topics/](topics/INDEX.md) — boot flow, ACPI, measured boot, BMC
- [protocols/](protocols/INDEX.md) — UEFI, ACPI, SMBIOS, ELF/PE boot, TPM

## Cross-references

- Bootloader → kernel handoff → [05_OS_Kernel/topics](../05_OS_Kernel/topics/INDEX.md)
- TPM & attestation → [14_Security/topics](../14_Security/topics/INDEX.md)
- IPMI/Redfish remote management → [13_Network_Application/protocols](../Network/13_Network_Application/protocols/INDEX.md)
