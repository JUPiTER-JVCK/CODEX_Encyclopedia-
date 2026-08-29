---
title: "Embedded Systems Tools Reference"
layer: 18_Embedded_Systems
section: man_pages
tags: [openocd, probe-rs, esptool, mpremote, minicom, embedded, flash, debug, man-section-1]
updated: 2026-05-21
---

# Embedded Systems Tools Reference

> Tools for flashing firmware, debugging microcontrollers, serial
> communication, and embedded development workflows.

---

## openocd --- Open On-Chip Debugger

### Synopsis

```
openocd -f interface/PROBE.cfg -f target/TARGET.cfg [-c "commands"]
openocd -f board/BOARD.cfg
```

### Description

Open-source debug adapter server. Connects to microcontrollers via JTAG/SWD
probes (ST-Link, J-Link, CMSIS-DAP, FTDI) and provides a GDB server,
flash programming, and boundary scan. Supports ARM Cortex-M/A/R, RISC-V,
MIPS, and more.

### Architecture

```
  GDB / IDE                    OpenOCD              Hardware
  ┌──────────┐               ┌──────────┐         ┌──────────┐
  │ gdb      │──(port 3333)─▸│          │──JTAG──▸│ MCU      │
  │ VS Code  │               │ telnet   │  /SWD   │ (Cortex- │
  │ CLion    │               │ (4444)   │         │  M4F)    │
  └──────────┘               │          │         └──────────┘
                              │ TCL      │
                              │ (6666)   │         ┌──────────┐
                              └──────────┘         │ Probe    │
                                    │              │ (ST-Link │
                                    └──── USB ────▸│  J-Link) │
                                                   └──────────┘
  
  Config hierarchy:
    interface/*.cfg   — probe type (stlink, jlink, cmsis-dap)
    target/*.cfg      — MCU family (stm32f4x, nrf52, esp32)
    board/*.cfg       — complete board (combines interface + target)
```

### Key commands (telnet/GDB)

| Command | Purpose |
|---------|---------|
| `reset halt` | Reset MCU, halt at entry |
| `flash write_image erase firmware.elf` | Flash firmware |
| `flash verify_image firmware.elf` | Verify flash contents |
| `reset run` | Reset and run |
| `reg` | Show CPU registers |
| `mdw ADDR [count]` | Read memory (word) |
| `mww ADDR VALUE` | Write memory (word) |
| `bp ADDR len hw` | Set hardware breakpoint |
| `targets` | List debug targets |

### Examples

```bash
# Flash an STM32F4 via ST-Link
openocd -f interface/stlink.cfg -f target/stm32f4x.cfg \
  -c "program firmware.elf verify reset exit"

# Start GDB server
openocd -f interface/stlink.cfg -f target/stm32f4x.cfg &
arm-none-eabi-gdb firmware.elf -ex "target remote :3333"

# Flash via J-Link
openocd -f interface/jlink.cfg -f target/nrf52.cfg \
  -c "program firmware.hex verify reset exit"

# Interactive telnet session
# Terminal 1: openocd -f board/st_nucleo_f4.cfg
# Terminal 2: telnet localhost 4444
#   > reset halt
#   > flash write_image erase firmware.bin 0x08000000
#   > reset run
```

---

## probe-rs --- Rust-native debug probe toolkit

### Synopsis

```
probe-rs info
probe-rs run [--chip CHIP] firmware.elf
probe-rs download [--chip CHIP] firmware.elf
probe-rs reset [--chip CHIP]
cargo flash --chip CHIP
cargo embed
```

### Description

Modern Rust-native alternative to OpenOCD. Supports CMSIS-DAP, ST-Link,
J-Link, and ESP-JTAG probes. Tightly integrated with Cargo for Rust
embedded development. Also works with C/C++ ELF binaries.

### Comparison with OpenOCD

```
  Feature            OpenOCD              probe-rs
  ─────────          ───────              ────────
  Language           C                    Rust
  Config             .cfg files           CLI flags / Cargo.toml
  GDB server         ✓ (port 3333)       ✓ (probe-rs gdb)
  Flash              ✓ (TCL commands)     ✓ (single command)
  RTT (real-time)    via separate tool    Built-in (defmt)
  Cargo integration  Manual               cargo flash / cargo embed
  Chip support       Very broad           Growing (ARM, RISC-V, ESP)
```

### Examples

```bash
# List connected probes
probe-rs info

# Flash and run (with defmt logging)
probe-rs run --chip nRF52840_xxAA target/thumbv7em-none-eabihf/release/app

# Just flash
probe-rs download --chip STM32F411CEUx firmware.elf

# Cargo integration (from Rust project)
cargo flash --chip STM32F411CEUx --release

# Cargo embed (flash + RTT console)
cargo embed --chip nRF52840_xxAA
```

---

## esptool --- Espressif flash tool

### Synopsis

```
esptool.py [-p PORT] [-b BAUD] [--chip CHIP] command [args]
esptool.py flash_id
esptool.py write_flash [--flash_size SIZE] ADDR FILE [ADDR FILE ...]
esptool.py read_flash ADDR SIZE FILE
esptool.py erase_flash
```

### Description

Python utility for flashing firmware to Espressif chips (ESP32, ESP32-S2/S3,
ESP32-C3/C6, ESP8266). Communicates over USB-serial with the ROM bootloader.
Also reads chip info, MAC addresses, and flash contents.

### ESP32 flash memory layout

```
  0x00000000 ┌────────────────────────┐
             │ Bootloader (2nd stage) │  0x1000
  0x00008000 ├────────────────────────┤
             │ Partition Table        │
  0x00009000 ├────────────────────────┤
             │ NVS (key-value store)  │
  0x00010000 ├────────────────────────┤
             │ Application (OTA 0)   │  ← main firmware
             │                        │
  0x00110000 ├────────────────────────┤
             │ Application (OTA 1)   │  ← OTA update slot
             │                        │
  0x00210000 ├────────────────────────┤
             │ SPIFFS / LittleFS     │  ← filesystem
  0x00400000 └────────────────────────┘  (4 MB total)
```

### Key commands

| Command | Purpose |
|---------|---------|
| `flash_id` | Read flash chip ID and size |
| `chip_id` | Read chip ID and MAC |
| `write_flash` | Write binary to flash at address |
| `read_flash` | Read flash contents to file |
| `erase_flash` | Erase entire flash |
| `erase_region` | Erase specific region |
| `verify_flash` | Verify flash contents |
| `image_info` | Show firmware image metadata |

### Examples

```bash
# Read chip info
esptool.py --port /dev/ttyUSB0 chip_id
# Chip is ESP32-S3 (revision v0.2)
# MAC: aa:bb:cc:dd:ee:ff

# Flash firmware (ESP-IDF typical)
esptool.py --chip esp32s3 --port /dev/ttyUSB0 -b 460800 \
  write_flash --flash_mode dio --flash_size 4MB \
  0x0 bootloader.bin \
  0x8000 partition-table.bin \
  0x10000 app.bin

# Using idf.py (ESP-IDF wrapper)
idf.py flash monitor    # flash + open serial monitor

# Erase everything
esptool.py --port /dev/ttyUSB0 erase_flash

# Read flash to file (backup)
esptool.py --port /dev/ttyUSB0 read_flash 0 0x400000 flash_dump.bin
```

---

## mpremote --- MicroPython remote control

### Synopsis

```
mpremote [connect PORT] [command ...]
mpremote fs cp local.py :remote.py
mpremote run script.py
mpremote repl
mpremote mip install PACKAGE
```

### Description

Official tool for interacting with MicroPython boards over USB serial.
Transfers files, runs scripts, manages packages, and provides a REPL.

### Key commands

| Command | Purpose |
|---------|---------|
| `connect PORT` | Connect to specific port |
| `repl` | Interactive REPL |
| `run script.py` | Run script on device |
| `fs ls [:]` | List files (`:` = device) |
| `fs cp src dst` | Copy files (`:` prefix = device) |
| `fs rm :file` | Delete file on device |
| `fs mkdir :dir` | Create directory on device |
| `mip install PKG` | Install package from micropython-lib |
| `reset` | Soft reset |
| `bootloader` | Enter bootloader mode |

### Examples

```bash
# Connect and open REPL
mpremote repl
# >>> import machine
# >>> led = machine.Pin(2, machine.Pin.OUT)
# >>> led.on()

# Copy file to device
mpremote fs cp main.py :main.py

# Copy multiple files
mpremote fs cp lib/sensor.py :lib/sensor.py

# Run a script (doesn't save to device)
mpremote run test_sensor.py

# Install a package
mpremote mip install aiohttp

# List files on device
mpremote fs ls :
#  266 boot.py
# 1024 main.py
#    0 lib/
```

---

## minicom / picocom --- serial terminal

### Synopsis

```
minicom [-D /dev/ttyUSB0] [-b 115200]
picocom /dev/ttyUSB0 -b 115200
tio /dev/ttyUSB0 -b 115200
```

### Description

Terminal emulators for serial (UART) connections. Essential for embedded
development: viewing boot logs, accessing REPL/shell, and debugging.

### Serial connection parameters

```
  Common settings:
    Baud rate:   115200 (most common), 9600, 57600, 921600
    Data bits:   8
    Parity:      None
    Stop bits:   1
    Flow control: None (or RTS/CTS for hardware flow control)
    
  Shorthand: 115200 8N1 (baud, data bits, parity, stop bits)
```

### Comparison

| Feature | minicom | picocom | tio |
|---------|---------|---------|-----|
| Config file | Yes (`~/.minirc.*`) | CLI only | `~/.tioconfig` |
| File transfer | Xmodem/Ymodem/Zmodem | None | None |
| Line editor | Yes | No | No |
| Simplicity | Complex | Simple | Simple |
| Exit | `Ctrl-A X` | `Ctrl-A Ctrl-X` | `Ctrl-T Q` |

### Examples

```bash
# minicom
minicom -D /dev/ttyUSB0 -b 115200
# Exit: Ctrl-A, then X

# picocom (simpler)
picocom /dev/ttyUSB0 -b 115200
# Exit: Ctrl-A, then Ctrl-X

# tio (modern, auto-reconnect)
tio /dev/ttyUSB0 -b 115200
# Exit: Ctrl-T, then Q

# macOS (screen as serial terminal)
screen /dev/tty.usbserial-1420 115200
# Exit: Ctrl-A, then K, then Y

# Find serial devices
ls /dev/ttyUSB* /dev/ttyACM* 2>/dev/null    # Linux
ls /dev/tty.usb* 2>/dev/null                 # macOS

# Python serial (quick test)
python3 -m serial.tools.miniterm /dev/ttyUSB0 115200
```

---

## Cross-links

- Device drivers -> [../../04_Device_Drivers/man_pages/device_commands.md](../../04_Device_Drivers/man_pages/device_commands.md)
- RF / wireless tools -> [../../16_RF_Wireless/man_pages/rf_tools.md](../../16_RF_Wireless/man_pages/rf_tools.md)
- Industrial protocols -> [../../19_Industrial_Protocols/man_pages/INDEX.md](../../19_Industrial_Protocols/man_pages/INDEX.md)
- Debugging (GDB) -> [../../06_System_Libraries/man_pages/debug_commands.md](../../06_System_Libraries/man_pages/debug_commands.md)
