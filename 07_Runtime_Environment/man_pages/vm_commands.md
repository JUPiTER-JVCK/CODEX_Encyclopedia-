---
title: "Virtual Machine Management Commands"
layer: 07_Runtime_Environment
section: man_pages
tags: [qemu, virsh, libvirt, vboxmanage, virtualbox, kvm, vm, man-section-1, man-section-8]
updated: 2026-05-21
---

# Virtual Machine Management Commands

> Tools for creating, running, and managing virtual machines on Linux
> using KVM/QEMU, libvirt, and VirtualBox.

---

## qemu-system --- QEMU full-system emulator

### Synopsis

```
qemu-system-x86_64 [machine-opts] [cpu-opts] [memory-opts] [drive-opts]
                    [network-opts] [display-opts] [misc-opts]
qemu-system-aarch64 ...
qemu-img create|convert|info|resize ...
```

### Description

Full-system emulator and virtualizer. When combined with KVM (`-enable-kvm`),
runs guest code natively on the host CPU at near-bare-metal speed. Supports
x86_64, ARM, RISC-V, MIPS, and more. Each `qemu-system-<arch>` binary
emulates a complete machine for that architecture.

### Virtualization stack

```
  Guest OS (Linux, Windows, etc.)
  ─────────────────────────────────
  Virtual hardware (QEMU)
    ├── vCPUs ──────▸ KVM module ──▸ hardware VT-x/AMD-V
    ├── RAM ────────▸ KVM memslots ──▸ EPT/NPT page tables
    ├── Disk ───────▸ virtio-blk / virtio-scsi
    │                   └── backed by qcow2, raw, NVMe
    ├── Network ────▸ virtio-net
    │                   └── tap, bridge, user-mode NAT
    ├── Display ────▸ virtio-gpu, VGA, SPICE, VNC
    └── USB/PCI ────▸ pass-through (VFIO) or emulated
  ─────────────────────────────────
  Host OS + KVM module
  ─────────────────────────────────
  Hardware (CPU with VT-x/AMD-V + IOMMU)
```

### Key Options

| Flag | Purpose |
|------|---------|
| `-enable-kvm` | Use KVM hardware virtualization |
| `-machine q35` | Modern PCIe chipset (vs. legacy `pc`) |
| `-cpu host` | Pass-through host CPU features |
| `-smp 4,cores=4` | Virtual CPU count |
| `-m 4G` | RAM size |
| `-drive file=disk.qcow2,format=qcow2,if=virtio` | Disk |
| `-cdrom image.iso` | CD/DVD image |
| `-boot d` | Boot from CD |
| `-nic user,hostfwd=tcp::2222-:22` | NAT with port forward |
| `-nic tap,ifname=tap0,script=no` | TAP networking |
| `-device vfio-pci,host=01:00.0` | PCI pass-through |
| `-nographic` | Serial console only (no GUI) |
| `-vnc :1` | VNC display on port 5901 |
| `-spice port=5930,disable-ticketing=on` | SPICE display |
| `-monitor stdio` | QEMU monitor on stdin |
| `-bios /path/to/OVMF.fd` | UEFI firmware |
| `-snapshot` | Discard disk writes on exit |

### qemu-img --- disk image tool

| Command | Purpose |
|---------|---------|
| `create -f qcow2 disk.qcow2 40G` | Create sparse disk image |
| `info disk.qcow2` | Show image format, size, snapshots |
| `convert -f raw -O qcow2 in.raw out.qcow2` | Format conversion |
| `resize disk.qcow2 +20G` | Grow a disk image |
| `snapshot -c snap1 disk.qcow2` | Create internal snapshot |
| `snapshot -l disk.qcow2` | List snapshots |

### Image formats

```
  raw       No metadata, exact disk size, fastest I/O
  qcow2     Copy-on-write, sparse, snapshots, compression, encryption
  vmdk      VMware format (QEMU can read/convert)
  vdi       VirtualBox format
  vhdx      Hyper-V format
```

### Examples

```bash
# Create a disk and install from ISO
qemu-img create -f qcow2 ubuntu.qcow2 40G
qemu-system-x86_64 -enable-kvm -machine q35 -cpu host \
  -smp 4 -m 4G \
  -drive file=ubuntu.qcow2,format=qcow2,if=virtio \
  -cdrom ubuntu-24.04-server.iso -boot d \
  -nic user,hostfwd=tcp::2222-:22

# Boot an existing image (headless, SSH access)
qemu-system-x86_64 -enable-kvm -machine q35 -cpu host \
  -smp 4 -m 4G \
  -drive file=ubuntu.qcow2,format=qcow2,if=virtio \
  -nic user,hostfwd=tcp::2222-:22 \
  -nographic

# SSH into the guest
ssh -p 2222 user@localhost

# UEFI boot with OVMF
qemu-system-x86_64 -enable-kvm -machine q35 \
  -bios /usr/share/OVMF/OVMF_CODE.fd \
  -drive file=disk.qcow2,format=qcow2,if=virtio \
  -smp 4 -m 4G

# ARM64 emulation (cross-arch)
qemu-system-aarch64 -machine virt -cpu cortex-a72 \
  -smp 2 -m 2G \
  -bios /usr/share/AAVMF/AAVMF_CODE.fd \
  -drive file=arm-disk.qcow2,format=qcow2,if=virtio \
  -nographic
```

---

## virsh --- libvirt management CLI

### Synopsis

```
virsh [connect URI] command [args...]
virsh list [--all]
virsh start|shutdown|reboot|destroy domain
virsh console domain
virsh edit domain
```

### Description

Command-line interface to libvirt --- the virtualization management library
that abstracts QEMU/KVM, Xen, LXC, and other hypervisors behind a uniform
API. Manages domains (VMs), storage pools, networks, and snapshots.

### libvirt architecture

```
  Management tools
  ┌──────────┐  ┌──────────┐  ┌──────────────┐
  │  virsh   │  │ virt-mgr │  │ Cockpit/oVirt│
  └────┬─────┘  └────┬─────┘  └──────┬───────┘
       │              │               │
       └──────────────┼───────────────┘
                      │
               libvirt API (C / Python / Go)
                      │
               libvirtd / virtqemud
                      │
        ┌─────────────┼─────────────┐
        │             │             │
    QEMU/KVM        Xen          LXC
```

### Key commands

| Command | Purpose |
|---------|---------|
| `list --all` | List all domains (running + stopped) |
| `start <dom>` | Start a domain |
| `shutdown <dom>` | Graceful ACPI shutdown |
| `destroy <dom>` | Force stop (like pulling power) |
| `reboot <dom>` | Reboot |
| `console <dom>` | Serial console (Ctrl+] to exit) |
| `vncdisplay <dom>` | Show VNC port |
| `edit <dom>` | Edit domain XML |
| `dumpxml <dom>` | Dump full XML definition |
| `define <file.xml>` | Define a new domain from XML |
| `undefine <dom>` | Remove domain definition |
| `snapshot-create-as <dom> <name>` | Create snapshot |
| `snapshot-list <dom>` | List snapshots |
| `snapshot-revert <dom> <name>` | Revert to snapshot |

### Domain lifecycle

```
  XML definition
       │
       ▼
    defined ──── virsh define / virt-install
       │
  virsh start
       │
       ▼
    running ──── virsh suspend ──▸ paused
       │                              │
       │         virsh resume ◂───────┘
       │
  virsh shutdown (ACPI) / virsh destroy (force)
       │
       ▼
    shut off ──── virsh undefine ──▸ removed
```

### virt-install --- create new VMs

```bash
# Create a new VM with virt-install
virt-install \
  --name ubuntu-server \
  --vcpus 4 --memory 4096 \
  --disk size=40,format=qcow2 \
  --cdrom ubuntu-24.04-server.iso \
  --os-variant ubuntu24.04 \
  --network bridge=br0 \
  --graphics vnc,listen=0.0.0.0
```

### Examples

```bash
# List all VMs
virsh list --all
#  Id   Name             State
# --------------------------------
#  1    ubuntu-server    running
#  -    windows-11       shut off

# Start and connect
virsh start ubuntu-server
virsh console ubuntu-server

# Create a snapshot
virsh snapshot-create-as ubuntu-server clean-install \
  --description "Fresh install, no config"

# Live migration
virsh migrate --live ubuntu-server \
  qemu+ssh://remote-host/system

# Show domain resource usage
virsh domstats ubuntu-server

# Network management
virsh net-list --all
virsh net-edit default
```

---

## VBoxManage --- VirtualBox command-line interface

### Synopsis

```
VBoxManage list vms|runningvms|hostonlyifs|bridgedifs
VBoxManage createvm --name <name> --ostype <type> --register
VBoxManage modifyvm <vm> [--cpus N] [--memory MB] [--nic1 nat|bridged]
VBoxManage startvm <vm> [--type headless|gui]
VBoxManage controlvm <vm> pause|resume|reset|poweroff|savestate
VBoxManage snapshot <vm> take|restore|delete|list <name>
```

### Description

Full-featured CLI for Oracle VirtualBox. Can do everything the GUI does:
create VMs, modify hardware settings, manage snapshots, configure networking,
attach storage, and control running VMs. Works on Linux, macOS, and Windows.

### VirtualBox architecture

```
  VBoxManage / VirtualBox GUI
         │
         ▼
  VBoxSVC (service process)
         │
         ▼
  VBoxHeadless / VBoxSDL  (VM process per guest)
         │
         ├── VT-x/AMD-V (hardware virt)
         ├── Virtual NIC (NAT / bridged / host-only / internal)
         ├── Virtual disk (VDI / VMDK / VHD)
         └── Guest Additions (shared folders, clipboard, drag-drop)
```

### Key subcommands

| Subcommand | Purpose |
|------------|---------|
| `list vms` | List all registered VMs |
| `createvm` | Create a new VM definition |
| `modifyvm` | Change VM settings (CPU, RAM, network, etc.) |
| `storagectl` | Add a storage controller (SATA, NVMe, IDE) |
| `storageattach` | Attach disk/ISO to controller |
| `startvm` | Start a VM (headless or GUI) |
| `controlvm` | Runtime control (pause, reset, poweroff) |
| `snapshot` | Snapshot management |
| `clonevm` | Clone a VM |
| `export/import` | OVA/OVF appliance |
| `guestcontrol` | Run commands inside guest (needs Guest Additions) |
| `metrics query` | Performance data |

### Network modes

```
  NAT (default)
    Guest ──NAT──▸ Host ──▸ Internet
    Guest gets 10.0.2.x, host unreachable from guest
    Port forwarding: VBoxManage modifyvm vm --natpf1 "ssh,tcp,,2222,,22"

  Bridged
    Guest ──bridge──▸ same LAN as host
    Guest gets real IP from DHCP

  Host-Only
    Guest ◂──▸ Host (private network)
    No internet access

  Internal
    Guest ◂──▸ Guest (isolated)
    No host access
```

### Examples

```bash
# Create a VM from scratch
VBoxManage createvm --name "Ubuntu" --ostype Ubuntu_64 --register
VBoxManage modifyvm "Ubuntu" --cpus 4 --memory 4096 --vram 128
VBoxManage modifyvm "Ubuntu" --nic1 nat --natpf1 "ssh,tcp,,2222,,22"

# Add storage
VBoxManage storagectl "Ubuntu" --name "SATA" --add sata --portcount 2
VBoxManage createmedium disk --filename Ubuntu.vdi --size 40000 --format VDI
VBoxManage storageattach "Ubuntu" --storagectl "SATA" --port 0 \
  --type hdd --medium Ubuntu.vdi
VBoxManage storageattach "Ubuntu" --storagectl "SATA" --port 1 \
  --type dvddrive --medium ubuntu-24.04.iso

# Start headless
VBoxManage startvm "Ubuntu" --type headless

# Take a snapshot
VBoxManage snapshot "Ubuntu" take "clean-install"

# Restore snapshot
VBoxManage snapshot "Ubuntu" restore "clean-install"

# Run a command in the guest (needs Guest Additions)
VBoxManage guestcontrol "Ubuntu" run --exe /bin/ls \
  --username user --password pass -- ls /home/

# Export as OVA
VBoxManage export "Ubuntu" -o Ubuntu.ova

# Power off
VBoxManage controlvm "Ubuntu" poweroff
```

---

## Cross-links

- Container tools -> [container_commands.md](container_commands.md)
- CPU virtualization flags -> [../../02_CPU/man_pages/cpu_inspection.md](../../02_CPU/man_pages/cpu_inspection.md)
- Kernel namespaces -> [../../05_OS_Kernel/man_pages/INDEX.md](../../05_OS_Kernel/man_pages/INDEX.md)
- Firmware (OVMF / UEFI) -> [../../03_Firmware_BIOS/man_pages/firmware_tools.md](../../03_Firmware_BIOS/man_pages/firmware_tools.md)
