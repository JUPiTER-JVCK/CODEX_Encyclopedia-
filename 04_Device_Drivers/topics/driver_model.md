---
title: "Linux Driver Model"
layer: 04_Device_Drivers
section: topics
tags: [topic, linux, driver, bus, probe, device-tree, acpi, udev]
updated: 2026-05-21
---

# Linux Driver Model

---

## Overview

The Linux kernel uses a unified device model (introduced in 2.6) where buses,
devices, and drivers are all represented as kobjects in `sysfs`. A driver
binds to a device when the bus matches their identifiers.

```
  Linux driver model hierarchy:
  
  sysfs (/sys)
  └── bus/
      ├── pci/
      │   ├── devices/    (symlinks to /sys/devices/pci..../...)
      │   └── drivers/    (e.g., e1000e, nvme, xhci_hcd)
      ├── usb/
      ├── i2c/
      ├── spi/
      └── platform/
  
  /sys/devices/   (physical device tree, mirrors kernel device tree)
  /sys/class/     (logical grouping: net/, block/, tty/, input/)
```

---

## Bus/Device/Driver Triad

```
  ┌──────────────────────────────────────────────────────────────┐
  │  Bus                                                         │
  │  ┌────────────────┐   ┌──────────────────────────────────┐  │
  │  │    Device      │   │           Driver                 │  │
  │  │ (hardware or   │──▶│ match() → probe() → remove()    │  │
  │  │  firmware-     │   │                                  │  │
  │  │  described)    │   │ Implements: file_ops, net_device │  │
  │  └────────────────┘   │ or other kernel framework API    │  │
  │                       └──────────────────────────────────┘  │
  └──────────────────────────────────────────────────────────────┘
  
  Binding: bus calls driver.match() for each device.
  If match() returns true, bus calls driver.probe().
  probe() initializes hardware and registers the device with a
  kernel subsystem (net, block, input, etc.)
```

---

## Driver Probe Lifecycle

```c
// Simplified PCI driver registration:
static const struct pci_device_id my_ids[] = {
    { PCI_DEVICE(0x8086, 0x1533) },  // Intel I210 NIC
    { 0 }
};

static int my_probe(struct pci_dev *dev, const struct pci_device_id *id) {
    // 1. Enable device
    pci_enable_device(dev);
    // 2. Request MMIO/IO regions
    pci_request_regions(dev, DRV_NAME);
    // 3. Map BAR
    void __iomem *bar = pci_iomap(dev, 0, 0);
    // 4. Request IRQ
    request_irq(dev->irq, my_irq_handler, IRQF_SHARED, DRV_NAME, dev);
    // 5. Register with kernel subsystem (net, block, etc.)
    register_netdev(netdev);
    return 0;
}

static void my_remove(struct pci_dev *dev) {
    unregister_netdev(netdev);
    free_irq(dev->irq, dev);
    pci_iounmap(dev, bar);
    pci_release_regions(dev);
    pci_disable_device(dev);
}

static struct pci_driver my_driver = {
    .name     = "my_nic",
    .id_table = my_ids,
    .probe    = my_probe,
    .remove   = my_remove,
};
module_pci_driver(my_driver);
```

---

## Device Tree (DT) — Embedded Systems

On ARM/RISC-V embedded systems without BIOS/ACPI, hardware topology
is described by a Device Tree Blob (DTB), compiled from DTS source:

```dts
// my_board.dts (simplified)
/ {
    model = "My Board v1.0";
    compatible = "vendor,my-board";

    i2c0: i2c@10030000 {
        compatible = "vendor,i2c-controller";
        reg = <0x10030000 0x1000>;
        #address-cells = <1>;
        #size-cells = <0>;

        bme280@76 {
            compatible = "bosch,bme280";
            reg = <0x76>;        // I2C address
        };
    };

    spi0: spi@10040000 {
        compatible = "vendor,spi-controller";
        reg = <0x10040000 0x1000>;
        cs-gpios = <&gpio 10 0>;

        flash@0 {
            compatible = "jedec,spi-nor";
            reg = <0>;
            spi-max-frequency = <40000000>;
        };
    };
};
```

```bash
# Compile DTS to DTB:
dtc -I dts -O dtb -o my_board.dtb my_board.dts

# Decompile a DTB:
dtc -I dtb -O dts /boot/dtbs/my_board.dtb

# Inspect live DT:
ls /proc/device-tree/
cat /proc/device-tree/i2c@10030000/compatible
```

---

## ACPI — Device Enumeration on x86

```
  ACPI device identification:
  
  \_SB.PCI0.I2C1.SENS   ← ACPI path
        │
        ACPI Method _HID = "BOSC0280"  (Hardware ID)
        ACPI Method _CRS = {I2CSerialBus(0x76, ...), GpioInt(...)}
  
  Driver match:
  struct acpi_device_id bme280_acpi_ids[] = {
      { "BOSC0280", 0 },
      { }
  };
  MODULE_DEVICE_TABLE(acpi, bme280_acpi_ids);
```

---

## udev Rules

When the kernel creates a device, udev receives a uevent and can
rename, set permissions, or run scripts:

```bash
# /etc/udev/rules.d/99-mydevice.rules

# Match by vendor/product ID (USB)
SUBSYSTEM=="usb", ATTR{idVendor}=="0483", ATTR{idProduct}=="374b", \
    MODE="0666", GROUP="plugdev"

# Persistent name for serial port
SUBSYSTEM=="tty", ATTRS{idVendor}=="0403", ATTRS{idProduct}=="6001", \
    ATTRS{serial}=="A12345", SYMLINK+="my_sensor"

# Run script on device add
SUBSYSTEM=="net", ACTION=="add", KERNEL=="eth*", \
    RUN+="/usr/local/bin/setup_eth.sh"

# Reload rules:
sudo udevadm control --reload-rules
sudo udevadm trigger

# Debug matching:
udevadm info -a -n /dev/ttyUSB0
udevadm test $(udevadm info -q path -n /dev/ttyUSB0)
```

---

## sysfs Interface

Drivers can export attributes to userspace via sysfs:

```c
// In driver:
static ssize_t temperature_show(struct device *dev,
                                  struct device_attribute *attr, char *buf) {
    struct my_data *data = dev_get_drvdata(dev);
    return sprintf(buf, "%d\n", data->temperature);
}
DEVICE_ATTR_RO(temperature);

static struct attribute *my_attrs[] = {
    &dev_attr_temperature.attr,
    NULL
};
ATTRIBUTE_GROUPS(my);
// Register: dev->groups = my_groups;
```

```bash
# Read from userspace:
cat /sys/class/hwmon/hwmon0/temp1_input
# 23500  (millidegrees Celsius)
```

---

## Key Terms

| Term | Definition |
|------|-----------|
| Bus | Abstraction: PCI, USB, I2C, SPI, platform |
| Device | Kernel object representing physical or logical hardware |
| Driver | Kernel module that manages a class of devices |
| probe() | Called when device+driver match; initializes hardware |
| remove() | Called on unbind/hotplug remove; tears down driver |
| kobject | Base kernel object — sysfs representation |
| DTS | Device Tree Source — human-readable hardware description |
| DTB | Device Tree Blob — compiled binary version of DTS |
| ACPI | Advanced Configuration and Power Interface — x86 HW description |
| udev | Userspace device manager — processes kernel uevents |

---

## See Also

- Driver lab exercises → [../lessons/driver_labs.md](../lessons/driver_labs.md)
- Device tools (lspci, lsusb) → [../man_pages/device_commands.md](../man_pages/device_commands.md)
- UEFI boot flow → [../../03_Firmware_BIOS/topics/uefi_boot_flow.md](../../03_Firmware_BIOS/topics/uefi_boot_flow.md)
