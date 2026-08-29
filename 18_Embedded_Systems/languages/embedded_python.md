---
title: Embedded Python (MicroPython / CircuitPython) — language profile
layer: 18_Embedded_Systems
section: languages
tags: [micropython, circuitpython, embedded, mpremote]
updated: 2026-05-20
---

# Embedded Python — language profile

> Python 3 subset on microcontrollers. **MicroPython** (Damien George, since
> 2013) is the original; **CircuitPython** (Adafruit) is a friendly fork
> focused on beginners and large hardware-driver library. Boards: RP2040,
> RP2350, ESP32 family, STM32F4/L4/H7/G0/G4, nRF52, SAMD21/51, Teensy, ...

## Distributions / where they run

| Variant | Targets | Notes |
|---------|---------|-------|
| MicroPython | ESP32/8266, RP2040/2350, STM32, nRF52, Pyboard, Unix, RISC-V | Reference; fastest evolving |
| CircuitPython | RP2040/2350, SAMD21/51, nRF52, ESP32-S2/S3, STM32 | USB drive UX, ~480 device libs in CP "Bundle" |
| Pycopy | Fork of MicroPython | Less active |
| Pumbaa | MicroPython on Simba RTOS | Niche |
| RT-MicroPython | RT-Thread-based | Niche |

## Flashing

| Board | Tool / steps |
|-------|--------------|
| RP2040 (Pico) | Hold BOOTSEL → drag `.uf2` to USB drive |
| RP2350 (Pico 2) | Same UF2 flow |
| ESP32 / ESP32-S3 / -C3 | `esptool.py --chip esp32 erase_flash` then `esptool.py write_flash 0x1000 firmware.bin` |
| STM32 | `dfu-util -d 0483:df11 -a 0 -D firmware.dfu` or via ST-Link |
| nRF52 | `nrfjprog --program firmware.hex --chiperase --verify --reset` |
| Teensy | Teensy loader app |

CircuitPython exposes a `CIRCUITPY` USB drive — code lives in `code.py`; edit and save to re-run.

## Tooling on the host

| Tool | Use |
|------|-----|
| `mpremote` | The canonical CLI: REPL, file copy, run scripts (`pip install mpremote`) |
| `ampy` (legacy) | Predecessor to mpremote |
| `rshell` | Filesystem mirror + REPL |
| `Thonny` | Beginner IDE with MicroPython/CircuitPython support |
| `mu-editor` | Simple editor for kids/edu |
| `webrepl` (MicroPython on ESP) | Browser REPL over Wi-Fi |
| `esptool.py` | Espressif flasher |
| `picotool` | RP2040/2350 utility |
| `circup` | CircuitPython library installer/upgrader |

### `mpremote` cheat-sheet

```sh
mpremote                          # connect to first serial device, open REPL
mpremote a0                       # connect to /dev/cu.usbserial-XXX (auto)
mpremote ls                       # ls on board
mpremote cp main.py :main.py      # copy host → board
mpremote cp :main.py ./           # board → host
mpremote run script.py            # run on board, print output
mpremote exec "import os; print(os.uname())"
mpremote reset                    # soft reset
mpremote bootloader               # enter DFU/UF2 mode (if supported)
mpremote mip install aioble       # MIP package manager (MicroPython)
mpremote rtc                      # show / set RTC
```

## Stdlib subset

| MicroPython module | When |
|--------------------|------|
| `machine` | The hardware: `Pin`, `ADC`, `PWM`, `I2C`, `SPI`, `UART`, `Timer`, `RTC`, `WDT`, `freq`, `lightsleep`, `deepsleep` |
| `time` | `sleep`, `sleep_ms`, `sleep_us`, `ticks_ms`, `ticks_diff` |
| `os` | `listdir`, `mkdir`, `remove`, `rename`, `stat`, `uname` |
| `gc` | `gc.collect()`, `gc.mem_alloc()`, `gc.mem_free()`, `gc.threshold()` |
| `micropython` | `mem_info()`, `const()`, `viper`, `native`, `schedule` |
| `network` | Wi-Fi STA/AP, LAN, BLE on supported boards |
| `socket` | BSD sockets |
| `ssl` | TLS (often size-limited) |
| `json`, `binascii`, `struct`, `hashlib`, `re`, `urequests`, `uasyncio` | Standard names with `u` prefix (alias to non-`u` in modern MP) |
| `asyncio` | Cooperative scheduling (MicroPython port) |
| `bluetooth` / `aioble` | BLE peripheral / central |
| `framebuf` | Drawing primitives for OLED/EPD |

CircuitPython differs: hardware module is `board` + `digitalio` + `analogio` + `busio` + `pwmio` + `displayio` instead of `machine`.

## Hardware idioms

```python
# Blink (MicroPython on RP2040)
from machine import Pin
import time
led = Pin(25, Pin.OUT)
while True:
    led.toggle()
    time.sleep(0.5)
```

```python
# I²C sensor (MicroPython)
from machine import I2C, Pin
i2c = I2C(0, scl=Pin(9), sda=Pin(8), freq=400_000)
print(i2c.scan())                      # list of 7-bit addresses
i2c.writeto(0x76, b'\xF7')             # request register
data = i2c.readfrom(0x76, 6)
```

```python
# CircuitPython equivalent
import board, busio, digitalio, time
led = digitalio.DigitalInOut(board.LED)
led.direction = digitalio.Direction.OUTPUT
while True:
    led.value = not led.value
    time.sleep(0.5)
```

```python
# Async (MicroPython 1.13+)
import asyncio
from machine import Pin

led = Pin(25, Pin.OUT)

async def blink(period_ms):
    while True:
        led.toggle()
        await asyncio.sleep_ms(period_ms)

async def main():
    await asyncio.gather(blink(250), blink(1000))   # multiple "tasks"

asyncio.run(main())
```

## Performance tools

| Decorator / call | Effect |
|------------------|--------|
| `@micropython.native` | Compile function to native code (still calls into VM for objects) |
| `@micropython.viper` | Stricter typed subset → near-C speed; integer types only |
| `const()` (`from micropython import const`) | Real compile-time constant |
| `gc.collect()` / `gc.threshold()` | Force / configure GC |
| `ptr8 / ptr16 / ptr32` viper types | Raw pointer access for buffers |
| `micropython.schedule(fn, arg)` | Defer a callback to a safe context (good from ISRs) |
| `machine.freq(240_000_000)` | Bump CPU clock (ESP32) |

## Common gotchas

- **No full stdlib** — `random`, `re`, `struct` are subsets; `multiprocessing`, `subprocess`, `threading` mostly absent.
- **Heap fragmentation** — long-running scripts: pre-allocate buffers, avoid string concat in loops, call `gc.collect()` strategically.
- **Floats** are 30-bit on most ports (single precision-ish). For full doubles, use a "DP" build or stick with integers.
- **Filesystem is flash** — limited write cycles; don't log frequently.
- **REPL hangs on tight loop** — Ctrl-C, soft-reboot (Ctrl-D), or DFU/UF2 reflash.
- **`time.sleep` vs `time.sleep_ms`** — pick `sleep_ms`/`sleep_us` for predictable timing on MCUs.
- **ISR callbacks** must be small + allocation-free; use `micropython.schedule` to defer real work.
- **Pin naming** differs per port: GPIO numbers (RP/ESP), letter+number (`PB7` STM32), or board-defined names (`board.D5` in CircuitPython).
- **CircuitPython vs MicroPython** code is *similar* but not interchangeable — different hardware modules, slightly different stdlib subsets.

## Power-saving patterns

```python
# Light sleep (MicroPython)
import machine
machine.lightsleep(60_000)   # ms

# Deep sleep (loses RAM — fresh boot on wake)
machine.deepsleep(60_000)
```

For mains-free designs, also disable peripherals, lower clock, use deep sleep over busy loops.

## See also
- Host Python → [../../08_User_Applications/languages/python.md](../../08_User_Applications/languages/python.md)
- Embedded C → [embedded_c.md](embedded_c.md)
- Embedded Rust → [embedded_rust.md](embedded_rust.md)
- Roadmap-level overview → [../README.md](../README.md)
