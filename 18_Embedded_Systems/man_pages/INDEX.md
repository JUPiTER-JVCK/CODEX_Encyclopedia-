# Embedded Systems — Tools

## Dedicated man page references

| Topic | File |
|-------|------|
| Embedded tools | [embedded_tools.md](embedded_tools.md) — openocd, probe-rs, esptool, mpremote, minicom |

---

## Cross-compilers
| Tool | Targets |
|------|---------|
| `arm-none-eabi-gcc` | ARM Cortex-M/R bare-metal |
| `arm-linux-gnueabihf-gcc` | ARM Cortex-A Linux |
| `aarch64-linux-gnu-gcc` | 64-bit ARM Linux |
| `riscv64-unknown-elf-gcc` | RISC-V bare-metal |
| `xtensa-esp32-elf-gcc` | ESP32 (Xtensa) |
| `rustup target add thumbv7em-none-eabihf` | Rust ARM Cortex-M4F |
| `clang --target=...` | LLVM cross |

## Flashing / programming
| Tool | Probe |
|------|-------|
| `st-flash`, `st-info` | ST-Link |
| `openocd` | Universal (J-Link, ST-Link, CMSIS-DAP, FT2232) |
| `pyocd` | Python alt to OpenOCD |
| `probe-rs`, `cargo flash`, `cargo embed` | Rust-native |
| `JLinkExe`, `JLinkGDBServer` | Segger J-Link |
| `dfu-util` | USB-DFU |
| `esptool.py`, `idf.py` | Espressif |
| `bossac` | Atmel SAM |
| `nrfjprog`, `nrfutil` | Nordic |
| `picotool` | Raspberry Pi RP2040 |

## Debugging
| Tool | Purpose |
|------|---------|
| `gdb` / `arm-none-eabi-gdb` | Source-level debug |
| `gdb-multiarch` | Multi-arch GDB |
| `lldb` | LLVM debugger |
| `screen /dev/tty.usbserial-XXX 115200` | Serial console (macOS) |
| `minicom` / `picocom` | Serial console (Linux/macOS) |
| `tio` | Modern serial terminal |
| `pyserial-miniterm` (`python -m serial.tools.miniterm`) | Python serial |
| Logic analyzer SW: PulseView (`sigrok-cli`), Saleae Logic, DSView | Capture & decode |

## RTOS / OS
| Tool | Purpose |
|------|---------|
| `west` | Zephyr meta-tool |
| `idf.py` | ESP-IDF build/flash/monitor |
| `cargo embed` | Rust+probe-rs flash+console |
| `runqemu` | Yocto QEMU launcher |
| `bitbake`, `devtool` | Yocto/OE recipe build |
| `buildroot` (`make menuconfig`) | Buildroot |

## Simulation / emulation
| Tool | Purpose |
|------|---------|
| `qemu-system-*` | CPU/board emulation |
| Renode | Multi-MCU sim (Antmicro) |
| Wokwi (web) | Online ESP/Arduino sim |
| Tinkercad Circuits | Beginner circuit + Arduino sim |
| ngspice/LTspice (cross-link [00b/00c]) | Analog/mixed sim |

## Testing
| Tool | Purpose |
|------|---------|
| Unity / CMock | C unit test |
| Ceedling | Build glue for Unity/CMock |
| GoogleTest / GoogleMock | C++ unit test |
| Catch2 | Modern C++ test |
| pytest + pyserial / pyvisa | Host-side hardware tests |
| robot framework | Acceptance tests |
| LDRA, Polyspace, Coverity | Static analysis (commercial) |
| cppcheck, clang-tidy, scan-build | Static analysis (open) |

## Build / dev
| Tool | Purpose |
|------|---------|
| `make` / `cmake --build` | Build |
| `ninja` | Faster build backend |
| `ccache` | Cache compiled objects |
| `bear` | Generate `compile_commands.json` |
| `clangd` (LSP) | Editor IntelliSense |
