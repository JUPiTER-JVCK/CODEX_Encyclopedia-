---
title: "Device & Driver Management Commands"
layer: 04_Device_Drivers
section: man_pages
tags: [lspci, lsusb, lsblk, modprobe, udevadm, dkms, device, driver, man-section-1, man-section-8]
updated: 2026-05-21
---

# Device & Driver Management Commands

> Tools for enumerating hardware, managing kernel modules, and monitoring
> device events on Linux.

---

## lspci --- list PCI devices

### Synopsis

```
lspci [-v] [-vv] [-vvv] [-nn] [-k] [-t] [-s slot] [-d vendor:device]
```

### Description

Reads the PCI configuration space via sysfs (or direct I/O) and lists every
PCI/PCIe device on the system. Shows vendor, device, class, driver in use,
kernel modules, BARs, capabilities, and link speed.

### Key Options

| Flag | Purpose |
|------|---------|
| `-v` / `-vv` / `-vvv` | Increasing verbosity (capabilities, BARs, power) |
| `-nn` | Show numeric vendor:device IDs alongside names |
| `-k` | Show kernel driver and modules for each device |
| `-t` | Tree view (bus topology) |
| `-s [[domain:]bus:]slot[.func]` | Filter by slot |
| `-d [vendor]:[device][:class]` | Filter by ID |
| `-x` / `-xxx` | Hex dump of config space (standard / extended) |

### PCI topology

```
  Root Complex (CPU ↔ PCH)
  ├── Bus 00
  │   ├── 00:00.0 Host Bridge
  │   ├── 00:02.0 VGA Controller ──── [i915]
  │   ├── 00:1f.0 ISA Bridge (LPC/eSPI)
  │   ├── 00:1f.2 Memory Controller
  │   └── 00:1f.3 Audio Device ────── [snd_hda_intel]
  ├── Bus 01 (PCIe x16 slot)
  │   └── 01:00.0 3D Controller ──── [nvidia]
  ├── Bus 02 (PCIe x4)
  │   └── 02:00.0 NVMe SSD ───────── [nvme]
  └── Bus 03 (PCIe x1)
      └── 03:00.0 Ethernet ────────── [r8169]
```

### Examples

```bash
# List all PCI devices with driver info
lspci -k
# 00:02.0 VGA compatible controller: Intel Corporation ...
#   Subsystem: Dell ...
#   Kernel driver in use: i915
#   Kernel modules: i915

# Show numeric IDs (useful for driver matching)
lspci -nn | grep -i net
# 03:00.0 Ethernet controller [0200]: Realtek ... [10ec:8168] (rev 15)

# Tree view of bus topology
lspci -tv

# Deep dive on a specific device
lspci -vvv -s 01:00.0

# PCIe link speed / width
lspci -vv -s 01:00.0 | grep -i lnk
#   LnkCap: Speed 16GT/s (PCIe 4.0), Width x16
#   LnkSta: Speed 16GT/s, Width x16
```

---

## lsusb --- list USB devices

### Synopsis

```
lsusb [-v] [-t] [-s bus:devnum] [-d vendor:product]
```

### Description

Lists USB devices connected to the system. Reads from sysfs and (with `-v`)
decodes full USB descriptors including interfaces, endpoints, and power.

### Key Options

| Flag | Purpose |
|------|---------|
| `-v` | Verbose: full descriptor dump |
| `-t` | Tree view (hub topology) |
| `-s [[bus]:][devnum]` | Filter by bus/device number |
| `-d vendor:product` | Filter by USB ID |
| `-D /dev/bus/usb/BBB/DDD` | Dump from device node |

### USB speed tiers

```
  USB 1.1  Low Speed     1.5 Mbps   (keyboard, mouse)
  USB 1.1  Full Speed      12 Mbps   (audio, HID)
  USB 2.0  High Speed     480 Mbps   (webcam, storage)
  USB 3.0  SuperSpeed       5 Gbps   (Gen 1 — blue port)
  USB 3.1  SuperSpeed+     10 Gbps   (Gen 2)
  USB 3.2  SuperSpeed+     20 Gbps   (Gen 2x2)
  USB4                     40 Gbps   (Thunderbolt 3 compat)
  USB4 v2                  80 Gbps   (asymmetric 120 Gbps)
```

### Examples

```bash
# Quick device list
lsusb
# Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
# Bus 001 Device 003: ID 046d:c52b Logitech Unifying Receiver
# Bus 002 Device 002: ID 0bda:9210 Realtek USB 3.0 Card Reader

# Hub / topology tree
lsusb -t
# /:  Bus 02.Port 1: Dev 1, Class=root_hub, Driver=xhci_hcd/4p, 10000M
#     |__ Port 1: Dev 2, If 0, Class=Mass Storage, Driver=usb-storage, 5000M

# Full descriptors for a device
lsusb -v -d 046d:c52b

# Find device by vendor
lsusb -d 046d:
```

---

## lsblk --- list block devices

### Synopsis

```
lsblk [-f] [-o columns] [-J] [-t] [-p] [device...]
```

### Description

Lists block devices (disks, partitions, LVM, LUKS, loop) in a tree showing
parent/child relationships. Reads from sysfs — no root required for basic use.

### Key Options

| Flag | Purpose |
|------|---------|
| `-f` | Show filesystem type, label, UUID, mountpoint |
| `-o NAME,SIZE,TYPE,...` | Custom columns |
| `-J` | JSON output |
| `-t` | Show topology info (alignment, I/O sizes) |
| `-p` | Print full device paths |
| `-d` | No partitions — disks only |
| `-S` | SCSI devices only |

### Useful column sets

| Columns | Purpose |
|---------|---------|
| `NAME,SIZE,TYPE,MOUNTPOINT` | Quick overview |
| `NAME,FSTYPE,LABEL,UUID,MOUNTPOINTS` | Filesystem map |
| `NAME,ROTA,DISC-GRAN,SCHED,RQ-SIZE` | Storage performance tuning |
| `NAME,MODEL,SERIAL,REV,TRAN` | Hardware identification |

### Block device hierarchy

```
  nvme0n1                   ← physical NVMe SSD
  ├── nvme0n1p1   512M  EFI System         /boot/efi
  ├── nvme0n1p2   1G    ext4 /boot         /boot
  └── nvme0n1p3   475G  LUKS               (encrypted)
      └── cryptroot         LVM2_member
          ├── vg0-root  50G ext4            /
          ├── vg0-home 400G ext4            /home
          └── vg0-swap   8G swap            [SWAP]
  sda                       ← USB drive
  └── sda1        32G   exfat               /mnt/usb
```

### Examples

```bash
# Overview with filesystems
lsblk -f
# NAME          FSTYPE   LABEL  UUID                                 MOUNTPOINTS
# nvme0n1
# ├─nvme0n1p1   vfat     EFI    ABCD-1234                           /boot/efi
# ├─nvme0n1p2   ext4            xxxxxxxx-xxxx-xxxx-xxxx              /boot
# └─nvme0n1p3   crypto_LUKS     xxxxxxxx-xxxx-xxxx-xxxx
#   └─cryptroot LVM2_member     xxxxxxxx-xxxx-xxxx-xxxx
#     ├─vg0-root ext4           xxxxxxxx-xxxx-xxxx-xxxx              /
#     └─vg0-home ext4           xxxxxxxx-xxxx-xxxx-xxxx              /home

# Disk hardware info
lsblk -o NAME,MODEL,SERIAL,SIZE,TRAN,ROTA

# JSON for scripting
lsblk -J -o NAME,SIZE,TYPE,MOUNTPOINT
```

---

## modprobe --- kernel module loader

### Synopsis

```
modprobe [-v] [-n] [-r] [--show-depends] module [param=value ...]
modprobe -r module          # remove
modprobe --show-depends module
```

### Description

Intelligently loads or removes kernel modules, automatically handling
dependencies (unlike `insmod`/`rmmod`). Reads `/lib/modules/$(uname -r)/`
and the dependency map generated by `depmod`.

### Key Options

| Flag | Purpose |
|------|---------|
| `-v` | Verbose — show insmod commands |
| `-n` | Dry run |
| `-r` | Remove module (+ unused dependencies) |
| `--show-depends` | List dependencies without loading |
| `-c` | Dump current config |
| `--first-time` | Fail if module already loaded |
| `-f` | Force load (skip version check) |
| `-b` | Use blacklist rules |

### Module loading flow

```
  modprobe nvidia
    │
    ├── 1. Read /lib/modules/$(uname -r)/modules.dep
    │      → nvidia depends on drm, drm_kms_helper, i2c_algo_bit
    │
    ├── 2. Check /etc/modprobe.d/*.conf for:
    │      - alias rules       (alias pci:v000010DEd* nvidia)
    │      - options           (options nvidia NVreg_PreserveVideoMemoryAllocations=1)
    │      - blacklist         (blacklist nouveau)
    │      - install/remove    (custom commands)
    │
    ├── 3. Load dependencies first:
    │      insmod /lib/modules/.../drm.ko
    │      insmod /lib/modules/.../drm_kms_helper.ko
    │      insmod /lib/modules/.../i2c-algo-bit.ko
    │
    └── 4. Load target module:
           insmod /lib/modules/.../nvidia.ko NVreg_...=1
```

### Related tools

| Command | Purpose |
|---------|---------|
| `lsmod` | List loaded modules (reads `/proc/modules`) |
| `modinfo` | Show module metadata (description, license, params, depends) |
| `insmod` | Load a single `.ko` file (no dependency resolution) |
| `rmmod` | Remove a single module (no dependency cascade) |
| `depmod` | Rebuild `modules.dep` and map files |

### Examples

```bash
# Load a module with a parameter
sudo modprobe snd_hda_intel power_save=1

# Check what would happen (dry run, verbose)
modprobe -nv nvidia

# Remove a module and its unused deps
sudo modprobe -r nouveau

# Show module info
modinfo nvidia
# filename:    /lib/modules/6.x.y/updates/dkms/nvidia.ko
# version:     560.35.03
# license:     NVIDIA
# depends:     drm,drm_kms_helper
# parm:        NVreg_PreserveVideoMemoryAllocations:bool

# List loaded modules (sorted by size)
lsmod | sort -k2 -n -r | head -10
```

### Configuration files

```
  /etc/modprobe.d/
  ├── blacklist.conf        # blacklist nouveau
  ├── nvidia.conf           # options nvidia NVreg_...
  ├── alsa-base.conf        # Audio module options
  └── dkms.conf             # DKMS-managed modules

  /etc/modules-load.d/
  └── my-modules.conf       # Modules to load at boot
```

---

## udevadm --- udev device manager tool

### Synopsis

```
udevadm info [--query=all] --path=SYSPATH | --name=DEVNODE
udevadm monitor [--kernel] [--udev] [--subsystem-match=SUB]
udevadm trigger [--subsystem-match=SUB]
udevadm test SYSPATH
```

### Description

The admin tool for `udev` --- Linux's dynamic device manager. Queries device
properties, monitors hotplug events in real time, triggers re-evaluation of
rules, and tests rule matching. Essential for writing and debugging udev rules.

### Key subcommands

| Subcommand | Purpose |
|------------|---------|
| `info` | Query device attributes and properties |
| `monitor` | Watch kernel uevents and udev rule results live |
| `trigger` | Re-trigger uevents for existing devices |
| `test` | Simulate rule processing (dry run) |
| `settle` | Wait for udev event queue to drain |
| `control` | Runtime control (reload rules, log level) |

### udev rule anatomy

```
  /etc/udev/rules.d/99-my-device.rules
  ┌──────────────────────────────────────────────────────────┐
  │  Match keys (all must match):                            │
  │    SUBSYSTEM=="usb"                                      │
  │    ATTR{idVendor}=="1234"                                │
  │    ATTR{idProduct}=="5678"                               │
  │                                                          │
  │  Assignment keys:                                        │
  │    SYMLINK+="my_device"                                  │
  │    MODE="0666"                                           │
  │    GROUP="plugdev"                                       │
  │    RUN+="/usr/local/bin/on-device-plug.sh"               │
  └──────────────────────────────────────────────────────────┘
  
  Evaluation order:
    /usr/lib/udev/rules.d/   ← distro defaults (lower priority)
    /etc/udev/rules.d/       ← admin overrides (higher priority)
    Files sorted lexically: 10-*.rules < 50-*.rules < 99-*.rules
```

### Examples

```bash
# Show all properties of a device
udevadm info --query=all --name=/dev/sda
# P: /devices/pci0000:00/0000:00:14.0/usb1/1-2/...
# N: sda
# E: DEVTYPE=disk
# E: ID_VENDOR=SanDisk
# E: ID_MODEL=Ultra_Fit
# E: ID_SERIAL=SanDisk_Ultra_Fit_XXXX

# Walk the device tree (useful for writing rules)
udevadm info --attribute-walk --name=/dev/sda | head -40

# Monitor hotplug events live
udevadm monitor --udev --subsystem-match=usb
# UDEV  [1234.567] add    /devices/.../1-2 (usb)
# UDEV  [1234.890] add    /devices/.../1-2:1.0 (usb)

# Test rule matching (dry run)
udevadm test /sys/class/block/sda 2>&1 | tail -20

# Reload rules after editing
sudo udevadm control --reload-rules
sudo udevadm trigger
```

---

## dkms --- Dynamic Kernel Module Support

### Synopsis

```
dkms add [-m module] [-v version]
dkms build [-m module] [-v version] [-k kernelversion]
dkms install [-m module] [-v version] [-k kernelversion]
dkms remove [-m module] [-v version] --all
dkms status
```

### Description

Framework for automatically rebuilding out-of-tree kernel modules when the
kernel is upgraded. Used by NVIDIA drivers, VirtualBox, ZFS, and other
third-party modules that ship source code.

### DKMS lifecycle

```
  1. Source placed in /usr/src/<module>-<version>/
     └── dkms.conf   (build instructions)

  2. dkms add -m nvidia -v 560.35.03
     → registers module with DKMS

  3. dkms build -m nvidia -v 560.35.03
     → compiles .ko for current kernel

  4. dkms install -m nvidia -v 560.35.03
     → copies .ko to /lib/modules/$(uname -r)/updates/dkms/
     → runs depmod

  Kernel upgrade (apt/dnf):
  ┌──────────────────────────────────────────────┐
  │  dpkg trigger → dkms autoinstall             │
  │    → for each registered module:             │
  │        build against new kernel headers      │
  │        install .ko into new module tree      │
  │        sign with MOK key (if Secure Boot)    │
  └──────────────────────────────────────────────┘
```

### Key dkms.conf directives

| Directive | Example | Purpose |
|-----------|---------|---------|
| `PACKAGE_NAME` | `"nvidia"` | Module name |
| `PACKAGE_VERSION` | `"560.35.03"` | Module version |
| `MAKE[0]` | `"make -C src/ KERNELDIR=/lib/modules/${kernelver}/build"` | Build command |
| `CLEAN` | `"make -C src/ clean"` | Clean command |
| `BUILT_MODULE_NAME[0]` | `"nvidia"` | Output `.ko` name |
| `DEST_MODULE_LOCATION[0]` | `"/updates/dkms"` | Install path |
| `AUTOINSTALL` | `"yes"` | Rebuild on kernel upgrade |

### Examples

```bash
# Check DKMS module status
dkms status
# nvidia/560.35.03, 6.8.0-41-generic, x86_64: installed
# virtualbox/7.0.20, 6.8.0-41-generic, x86_64: installed

# Manually rebuild for a specific kernel
sudo dkms build -m nvidia -v 560.35.03 -k 6.9.0-1-generic
sudo dkms install -m nvidia -v 560.35.03 -k 6.9.0-1-generic

# Remove a module
sudo dkms remove nvidia/560.35.03 --all

# Force rebuild of all DKMS modules
sudo dkms autoinstall -k $(uname -r)
```

---

## Cross-links

- Firmware & UEFI tools -> [../../03_Firmware_BIOS/man_pages/firmware_tools.md](../../03_Firmware_BIOS/man_pages/firmware_tools.md)
- Kernel tracing (dmesg) -> [../../05_OS_Kernel/man_pages/tracing_commands.md](../../05_OS_Kernel/man_pages/tracing_commands.md)
- Secure Boot / MOK signing -> [../../03_Firmware_BIOS/man_pages/firmware_tools.md](../../03_Firmware_BIOS/man_pages/firmware_tools.md)
- Driver model concepts -> [../topics/INDEX.md](../topics/INDEX.md)
