---
title: "Device Drivers — Interactive Labs"
layer: 04_Device_Drivers
section: lessons
tags: [lesson, driver, linux, char-device, udev, device-tree, lab, quiz, hands-on]
updated: 2026-05-21
---

# Device Drivers — Interactive Labs

---

## Module 1: Linux Character Device Driver

### Objective

Write a minimal Linux kernel module that registers a character device,
compile it out-of-tree, load it, and interact via `/dev/`.

### Prerequisites

- Linux system with kernel headers: `sudo apt install linux-headers-$(uname -r)`
- `build-essential`, `make`

### Lab Steps

1. Create `hello_dev.c`:

```c
#include <linux/module.h>
#include <linux/fs.h>
#include <linux/uaccess.h>

#define DEVICE_NAME "hello_dev"
static int major;
static char msg[256] = "Hello from kernel!\n";

static ssize_t dev_read(struct file *f, char __user *buf, size_t len, loff_t *off) {
    return simple_read_from_buffer(buf, len, off, msg, strlen(msg));
}

static struct file_operations fops = {
    .owner = THIS_MODULE,
    .read = dev_read,
};

static int __init hello_init(void) {
    major = register_chrdev(0, DEVICE_NAME, &fops);
    pr_info("hello_dev: registered with major %d\n", major);
    return 0;
}

static void __exit hello_exit(void) {
    unregister_chrdev(major, DEVICE_NAME);
    pr_info("hello_dev: unregistered\n");
}

module_init(hello_init);
module_exit(hello_exit);
MODULE_LICENSE("GPL");
```

2. Create `Makefile`:
```makefile
obj-m += hello_dev.o
all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules
clean:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean
```

3. Build, load, test:
```bash
make
sudo insmod hello_dev.ko
dmesg | tail -1    # See major number
sudo mknod /dev/hello_dev c <MAJOR> 0
sudo chmod 666 /dev/hello_dev
cat /dev/hello_dev  # "Hello from kernel!"
sudo rmmod hello_dev
```

### Knowledge Check

**Q1**: What is the difference between a character device and a block device?

> **A1**: Character devices transfer data byte-by-byte (serial ports, terminals).
> Block devices transfer data in fixed-size blocks and support random access
> (disks, SSDs). Block devices go through the kernel's block I/O layer with
> caching; character devices are accessed directly via read/write.

**Q2**: Why do we use `copy_to_user` / `simple_read_from_buffer` instead of `memcpy`?

> **A2**: Kernel and user address spaces are separate. Direct pointer access
> would bypass memory protection. `copy_to_user` checks that the user
> pointer is valid and handles page faults safely.

---

## Module 2: udev Rules

### Objective

Write custom udev rules to automatically set permissions, create symlinks,
and run scripts when specific USB devices are plugged in.

### Lab Steps

1. Find device attributes:
```bash
# Plug in a USB device, then:
udevadm info --query=all --name=/dev/sdb
# or:
udevadm info --attribute-walk --name=/dev/sdb | head -40
```

2. Create a udev rule: `/etc/udev/rules.d/99-my-usb.rules`:
```
# When SanDisk USB drive is plugged in:
# - Create symlink /dev/my_usb_drive
# - Set permissions to allow plugdev group
SUBSYSTEM=="block", ATTR{idVendor}=="0781", ATTR{idProduct}=="5583", \
  SYMLINK+="my_usb_drive", MODE="0660", GROUP="plugdev"
```

3. Reload and test:
```bash
sudo udevadm control --reload-rules
sudo udevadm trigger
ls -la /dev/my_usb_drive    # should be a symlink
```

4. Add a script trigger:
```
# Run a script when device appears:
SUBSYSTEM=="usb", ATTR{idVendor}=="0781", ACTION=="add", \
  RUN+="/usr/local/bin/usb-backup.sh"
```

### Knowledge Check

**Q1**: Why use `99-` prefix for custom rules?

> **A1**: udev processes rules in lexical order. Higher numbers run later,
> allowing custom rules to override distro defaults (which use `50-` or `60-`).

---

## Module 3: Device Tree Overlay (ARM/embedded)

### Objective

Write a Device Tree overlay to enable an I2C sensor on a Raspberry Pi,
understanding how DT describes hardware to the kernel.

### Device Tree concept

```
  / (root)
  ├── cpus
  │   └── cpu@0 { compatible = "arm,cortex-a72"; }
  ├── memory@0 { reg = <0x0 0x40000000>; }  ← 1 GB
  ├── soc
  │   ├── i2c@7e804000 {
  │   │   compatible = "brcm,bcm2835-i2c";
  │   │   reg = <0x7e804000 0x1000>;
  │   │   status = "okay";
  │   │   #address-cells = <1>;
  │   │   #size-cells = <0>;
  │   │   
  │   │   bme280@76 {                    ← I2C device at addr 0x76
  │   │       compatible = "bosch,bme280";
  │   │       reg = <0x76>;
  │   │   };
  │   │ }
  │   └── spi@7e204000 { ... }
  └── leds { ... }
```

### Lab Steps

1. Create overlay `bme280-overlay.dts`:
```dts
/dts-v1/;
/plugin/;

/ {
    fragment@0 {
        target = <&i2c1>;
        __overlay__ {
            status = "okay";
            bme280@76 {
                compatible = "bosch,bme280";
                reg = <0x76>;
            };
        };
    };
};
```

2. Compile and apply:
```bash
dtc -@ -I dts -O dtb -o bme280.dtbo bme280-overlay.dts
sudo cp bme280.dtbo /boot/overlays/
# Add to /boot/config.txt: dtoverlay=bme280
sudo reboot
```

3. Verify:
```bash
dmesg | grep bme280
ls /sys/bus/i2c/devices/1-0076/
cat /sys/bus/iio/devices/iio\:device0/in_temp_input
```

### Review Flashcards

| Term | Definition |
|------|-----------|
| Character device | Byte-stream device (/dev/ttyS0, /dev/null) |
| Block device | Random-access block device (/dev/sda, /dev/nvme0n1) |
| Major/minor number | Major = driver, minor = specific device instance |
| udev | Dynamic device manager — creates /dev/ entries |
| Device Tree | Data structure describing hardware to the kernel |
| DT overlay | Partial DT that modifies the base at runtime |
| `compatible` | DT property that matches device to driver |

### Challenge

> Write a kernel module that creates a `/proc/myinfo` file showing
> custom system information. Use `proc_create` and `seq_file` interface.
> Display CPU model, kernel version, and uptime.

---

## Cross-links

- Device management tools → [../man_pages/device_commands.md](../man_pages/device_commands.md)
- Kernel labs → [../../05_OS_Kernel/lessons/kernel_labs.md](../../05_OS_Kernel/lessons/kernel_labs.md)
- Firmware labs → [../../03_Firmware_BIOS/lessons/firmware_labs.md](../../03_Firmware_BIOS/lessons/firmware_labs.md)
