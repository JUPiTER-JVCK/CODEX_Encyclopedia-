# 18 — Embedded Systems (Cross-cutting)

> The discipline of building **constrained, deterministic, hardware-bound
> compute**. Spans layers 00 (physics) through 08 (apps) — embedded systems
> engineers wear every hat in the codex. Mirrors the *Embedded Systems
> Engineering Roadmap v1.2.3* (Meysam Parvizi) supplied as image 4.

## At a glance

| Field | Value |
|-------|-------|
| Spans | All of 00–13, plus all of 14 (security) and 16 (RF) for IoT |
| Description | Hardware-software co-design for deterministic, often resource-limited devices |
| Languages | **C, C++, Python, Rust, Assembly** (user emphasized Python & Rust) |
| Industries | Automotive, aerospace, consumer electronics, telecom, healthcare, robotics, agriculture |

## What lives here

### Hardware (image 4 right column)
- **Electronics** — math/calc, circuits, electronics fundamentals, digital design, computer architecture
- **Test equipment** — multimeter, logic / protocol analyzer, oscilloscope
- **Prototyping skills** — breadboarding, hardware design, PCB design + EMC, soldering / rework
- **FPGA development**

### Software (image 4 left column)
- **Programming languages** — **C** (required), **C++**, **Assembly** (required), **Python**, **Rust** *(user-circled)*
- **Programming fundamentals** — algorithms & DS, design patterns, state machines, memory management
- **Operating systems**:
  - **Embedded Linux** — Linux kernel, device drivers, U-Boot, Buildroot/Yocto, threading, IPC, Qt
  - **RTOS** — basics, FreeRTOS, Zephyr, QNX, µC/OS, RT-Thread
- **Microcontrollers** — GPIO, ADC/DAC, timers/counters, PWM, watchdog, interrupts, DMA, clock mgmt, power mgmt, bootloader/DFU
- **Build system** — Compilers/GCC, Make/CMake, Bash, Docker
- **Debugging** — JTAG/SWD, GDB, OpenOCD
- **Version control** — Git (SVN legacy)
- **SDLC** — Agile/SCRUM, V-Model
- **Testing** — TDD/unit, CI/CD, SIL/HIL, standards/certs
- **Embedded security**, **Embedded GUI**, **IoT**, **Edge AI**, **AUTOSAR**

### Interfaces & protocols (image 4 middle column)
- **Basic** — UART (req), I2C (req), SPI (req)
- **High-speed** — Ethernet (req), USB, PCIe
- **Wireless** — Bluetooth (req), Wi-Fi (req), LoRa, Zigbee, Thread, Matter, UWB
- **Industrial** — Modbus (req), Profinet, EtherCAT, MQTT, CoAP → see [19_Industrial_Protocols](../19_Industrial_Protocols/)
- **Automotive** — CAN (req), LIN, MOST, FlexRay → see [19_Industrial_Protocols](../19_Industrial_Protocols/)
- **Network** — TCP/IP, UDP → cross-link [11](../Network/11_Network_Internet/) + [12](../Network/12_Network_Transport/)
- **Cellular** — GSM/LTE, LTE-M / 5G, NB-IoT → cross-link [16](../16_RF_Wireless/)

### Cross-cutting topics
- **Memory technologies & file systems**, **hardware simulation/emulation**
- **Sensors & actuators**, **DSP**, **control theory**

### Soft skills (image 4 green box)
- Communication, problem solving & critical thinking, teamwork, organization, self-driven, adaptable & patient

## Sub-sections

- [references/](references/INDEX.md) — including `embedded_systems_full_roadmap_book.pdf` (v1)
- [lessons/](lessons/INDEX.md) — ordered roadmap-style study path
- [languages/](languages/INDEX.md) — emphasis on C / Python / Rust
- [man_pages/](man_pages/INDEX.md) — toolchain, debug, build, RTOS CLIs
- [topics/](topics/INDEX.md) — exhaustive index of the roadmap topics
- [protocols/](protocols/INDEX.md) — protocols index pointing into layer 19 + 13 + 09–13

## Cross-references
- Physics & devices substrate → [00_Physics](../00_Physics/), [00b_Devices](../00b_Devices/)
- Bare-metal / RTOS firmware → [03_Firmware_BIOS](../03_Firmware_BIOS/)
- Drivers → [04_Device_Drivers](../04_Device_Drivers/)
- Industrial bus protocols → [19_Industrial_Protocols](../19_Industrial_Protocols/)
- RF & wireless → [16_RF_Wireless](../16_RF_Wireless/)
- Algorithmic foundations → [17_Algorithms_DSA](../17_Algorithms_DSA/)
- Embedded security → [14_Security/topics](../14_Security/topics/INDEX.md)
- Edge AI → [15_AI_ML/topics](../15_AI_ML/topics/INDEX.md)

## Anchor reference
- `references/embedded_systems_full_roadmap_book.pdf` — placeholder for the
  Embedded Systems Roadmap book. Original by Meysam Parvizi (CC BY-SA 4.0)
  at [github.com/m3y54m/Embedded-Engineering-Roadmap](https://github.com/m3y54m/Embedded-Engineering-Roadmap)
- Image source: roadmap by Meysam Parvizi, CC BY-SA 4.0
  (`https://github.com/m3y54m/Embedded-Engineering-Roadmap`)
