# Firmware / BIOS — Lessons

## Dedicated lesson modules

| Topic | File |
|-------|------|
| Firmware interactive labs | [firmware_labs.md](firmware_labs.md) — UEFI shell, fwupdmgr, Secure Boot enrollment |

---

1. **Bare-metal "hello"** — Cortex-M (e.g. STM32 Blue Pill) blink LED with no RTOS.
2. **Read your firmware** — `flashrom -r dump.bin` on a supported board; explore with `binwalk` / UEFITool.
3. **Build coreboot** — pick a supported board, build image, flash, observe console.
4. **Write a UEFI app** — EDK II "HelloWorld.efi"; load from UEFI shell.
5. **Boot flow study** — trace reset vector → BIOS/UEFI → bootloader → kernel for x86-64 and ARM.
6. **U-Boot on QEMU** — boot a Linux kernel from U-Boot in `qemu-system-arm`.
7. **ACPI table walk** — dump tables with `acpidump`, decode with `iasl -d`.
8. **Measured boot lab** — read TPM PCRs (`tpm2_pcrread`), understand the chain.
9. **Secure Boot / MOK** — enroll your own key, sign a kernel, boot it.
10. **BMC exploration** — read OpenBMC source; understand Redfish endpoints.

## Suggested external
- osdev.org "Bare Bones" tutorial
- Coreboot lab series (3mdeb)
- Stephen Wood's Cortex-M / RTOS series
