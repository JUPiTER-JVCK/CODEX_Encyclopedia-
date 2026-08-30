# Firmware / BIOS — Manual Pages

## Dedicated man page references

| Topic | File |
|-------|------|
| Firmware management tools | [firmware_tools.md](firmware_tools.md) — fwupdmgr, efibootmgr, mokutil, nvram |

---

| Command | Section | Purpose |
|---------|---------|---------|
| `efibootmgr` | 8 | View/modify UEFI boot entries (Linux) |
| `bootctl` | 1 | systemd-boot install / status |
| `mokutil` | 1 | Machine Owner Key — Secure Boot key enrollment |
| `sbverify` | 1 | Verify a signed EFI binary |
| `sbsign` | 1 | Sign an EFI binary |
| `flashrom` | 8 | Read/write SPI flash chip (BIOS/UEFI) |
| `chipsec` | 1 | Platform security assessment framework |
| `acpidump` | 1 | Dump ACPI tables from memory/sysfs |
| `iasl` | 1 | ACPI Source Language compiler/decompiler |
| `dtc` | 1 | Device Tree Compiler |
| `bless` | 8 | macOS — set the boot volume |
| `nvram` | 8 | macOS — read/write NVRAM variables |
| `csrutil` | 1 | macOS — SIP status & toggle (recovery only) |
| `bcdedit` | (Win) | Boot Configuration Data editor |
| `ipmitool` | 1 | IPMI BMC management |
| `redfishtool` | 1 | Redfish API client |
| `tpm2_pcrread` | 1 | Read TPM 2.0 PCR registers |
| `tpm2_quote` | 1 | TPM remote attestation quote |
| `binwalk` | 1 | Firmware image analysis / extraction |
| `UEFITool` (GUI) | n/a | View/edit UEFI capsule images |

## Sysfs / virtual filesystems
- `/sys/firmware/efi/` — EFI runtime, variables (Linux)
- `/sys/firmware/acpi/tables/` — raw ACPI tables
- `/sys/firmware/dmi/` — SMBIOS via DMI
- `/dev/mem` — physical memory (root-only, restricted)
