# Embedded Systems — Languages

The roadmap calls out **C** and **Assembly** as required; the user circled
**Python** and **Rust** on the printed image. Below grouped accordingly.

## Embedded language profiles (man-page-style)

The embedded-specific deltas — `no_std`, freestanding, linker scripts,
flashing, RTOS patterns. Pair each with its host-side baseline.

| Language | Embedded profile | Host baseline |
|----------|------------------|---------------|
| C (freestanding) | [embedded_c.md](embedded_c.md) | [../../08_User_Applications/languages/c.md](../../08_User_Applications/languages/c.md) |
| Rust (`no_std`, Embassy, RTIC) | [embedded_rust.md](embedded_rust.md) | [../../08_User_Applications/languages/rust.md](../../08_User_Applications/languages/rust.md) |
| Python (MicroPython / CircuitPython) | [embedded_python.md](embedded_python.md) | [../../08_User_Applications/languages/python.md](../../08_User_Applications/languages/python.md) |

For low-level assembly (Cortex-M Thumb-2, AArch64, RISC-V), see [02_CPU/languages/](../../02_CPU/languages/INDEX.md).

## Required
| Language | Use |
|----------|-----|
| **C** | The lingua franca. Kernels, RTOS, drivers, firmware, vendor HALs |
| **Assembly** | Boot code, ISRs, context switch, performance-critical inner loops |

## Recommended
| Language | Use |
|----------|-----|
| **C++** | Often as "embedded C++" subset — RAII, templates, no exceptions / no RTTI; Mbed, Arduino, modern STM32 HALs |
| **Python** *(user-circled)* | Host tooling, scripting, test harnesses, prototyping; MicroPython / CircuitPython on chip |
| **Rust** *(user-circled)* | `no_std`, embedded-hal, Embassy (async), RTIC (interrupt-driven); growing fast in safety-critical |

## Niche / specialty
| Language | Use |
|----------|-----|
| Ada / SPARK | High-assurance avionics, defense |
| Go (TinyGo) | Constrained Go for microcontrollers (low adoption but pleasant) |
| JavaScript (Espruino / Moddable XS) | JS on MCUs |
| Lua (NodeMCU) | Light scripting on ESP-class |
| Forth | Open Firmware, niche embedded |

## Embedded Python — the ecosystem
- **MicroPython** — full Python 3 subset on MCUs (ESP32, RP2040, STM32, nRF)
- **CircuitPython** — Adafruit fork; focus on beginners + hardware libs
- **Pyodide** (in WASM) — not embedded but adjacent
- **paho-mqtt, pymodbus, pyserial, python-can** — host-side embedded libs
- **pyOCD** — Python-based debugger / probe driver
- **west** — Zephyr's meta-tool, written in Python

## Embedded Rust — the ecosystem
- **`embedded-hal`** — trait set for portable HALs
- **`cortex-m` / `cortex-m-rt`** — ARM Cortex-M runtime
- **`riscv` / `riscv-rt`** — RISC-V runtime
- **`probe-rs`** — Rust-native debugger + probe driver (alt to openocd)
- **`defmt`** — efficient `printf`-style logging
- **Embassy** — async runtime for embedded
- **RTIC** — interrupt-driven concurrency framework
- **Tock OS** — Rust embedded OS
- **`embedded-hal-async`** — async traits
- **`smoltcp`** — Rust TCP/IP stack

## Toolchains
- `arm-none-eabi-gcc`, `riscv64-unknown-elf-gcc`, `xtensa-esp32-elf-gcc` (vendor cross-tools)
- `clang --target=arm-none-eabi-` (LLVM cross)
- `rustc` with `thumbv7em-none-eabihf`, `riscv32imac-unknown-none-elf`, etc. targets
- Vendor IDEs: STM32CubeIDE, NXP MCUXpresso, IAR Embedded Workbench, Keil µVision, Microchip MPLAB X

## Build systems for embedded
- **Make** — universal
- **CMake** — modern cross-platform; vendor SDKs (ESP-IDF, Zephyr west) often wrap it
- **Bazel / Buck2** — large multi-target shops
- **PlatformIO** — high-level wrapper around vendor toolchains
- **Cargo + cargo-binutils + cargo-flash** — Rust embedded

## Cross-link
- Lower assembly notes → [02_CPU/languages](../../02_CPU/languages/INDEX.md)
- Kernel C dialect → [05_OS_Kernel/languages](../../05_OS_Kernel/languages/INDEX.md)
- Driver C → [04_Device_Drivers/languages](../../04_Device_Drivers/languages/INDEX.md)
