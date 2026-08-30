# Circuit Board — Manual Pages

Hardware enumeration & inspection tools — mostly Linux, with macOS equivalents.

| Command | Section | Purpose |
|---------|---------|---------|
| `lspci` | 8 | List PCI/PCIe devices and their drivers |
| `lsusb` | 8 | List USB devices and topology |
| `lshw` | 1 | Comprehensive hardware listing (CPU, memory, buses) |
| `dmidecode` | 8 | Dump SMBIOS/DMI tables: motherboard, RAM SPD, BIOS info |
| `hwinfo` | 8 | openSUSE-style hardware probe |
| `dmesg` | 1 | Kernel ring buffer — boot-time hardware messages |
| `lsblk` | 8 | List block devices and partitions |
| `lscpu` | 1 | CPU architecture details (cores, cache, flags) |
| `lsmem` | 1 | Memory range information |
| `i2cdetect` | 8 | Scan for devices on I²C bus (i2c-tools) |
| `spi-tools` | 1 | Userspace SPI access via `/dev/spidev*` |
| `system_profiler` | 8 | macOS — equivalent to `lshw` (`SPHardwareDataType`) |
| `ioreg` | 8 | macOS — IORegistry tree of attached devices |

## SBC / embedded
| Command | Purpose |
|---------|---------|
| `gpio` (WiringPi) | Raspberry Pi GPIO control (deprecated; use `pinctrl`) |
| `pinctrl` | RPi GPIO control (modern) |
| `vcgencmd` | Raspberry Pi VideoCore GPU/temp/voltage queries |
