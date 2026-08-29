
## Dedicated Lesson Modules

| File | Covers |
|------|--------|
| [Embedded Systems — Interactive Labs](./embedded_labs.md) | Bare-metal blink, FreeRTOS tasks, UART, I2C sensor |

# Embedded Systems — Lessons (roadmap-aligned)

Ordered to mirror the *Embedded Systems Engineering Roadmap* image. Each step
links to where deeper material lives in the codex.

## Phase 1 — Hardware foundations
1. **Basic math & calculus** — diff/integral, vectors, complex
2. **Electric circuits** — KCL, KVL, RC/RL/RLC → [00c_Analog_Circuits](../../00c_Analog_Circuits/)
3. **Electronics fundamentals** — diodes, BJTs, MOSFETs → [00b_Devices](../../00b_Devices/)
4. **Digital design** — gates, flip-flops, FSM, RTL → [00d_Digital_Circuits](../../00d_Digital_Circuits/)
5. **Computer architecture** — ISA, pipeline, cache → [02_CPU](../../02_CPU/)
6. **Lab tools** — multimeter, oscilloscope, logic analyzer, function generator
7. **Breadboarding + first PCB** — KiCad project, fab order, soldering practice

## Phase 2 — Programming foundations
8. **C** *(required)* — pointers, structs, bit-ops, build, link, debug
9. **Assembly** *(required)* — ARM Thumb or RISC-V; tiny boot code
10. **C++** *(recommended)* — RAII, templates, no-exceptions subset for embedded
11. **Python** *(user-circled)* — scripting, automation, embedded host tools
12. **Rust** *(user-circled)* — `no_std`, embedded HAL crates, Embassy or RTIC
13. **Algorithms & data structures** → [17_Algorithms_DSA](../../17_Algorithms_DSA/)
14. **Design patterns** for embedded — state, observer, singleton (careful), policy
15. **State machines** — Moore vs Mealy; QM / Boost.SML / hand-rolled
16. **Memory management** — stack vs heap, custom allocators, alignment, MPU/MMU

## Phase 3 — Microcontroller hands-on
17. **GPIO** — blink LED, button input with debounce
18. **ADC / DAC** — read a pot, generate a waveform
19. **Timers & counters** — periodic ISR, input capture, output compare
20. **PWM** — motor speed control, LED dimming
21. **Watchdog** — independent + window
22. **Interrupts** — vector tables, priority/preemption, NVIC config
23. **DMA** — memory↔peripheral; circular vs single-shot
24. **Clock management** — PLLs, prescalers, clock tree
25. **Power management** — sleep, stop, standby modes; wake sources
26. **Bootloader / DFU** — A/B partitions, USB-DFU, OTA

## Phase 4 — Build & debug
27. **GCC / Clang for embedded** — cross-compile, linker scripts, sections
28. **Make / CMake** — out-of-source builds
29. **Bash scripting** — flash, log, test harness
30. **Docker** — reproducible build images
31. **JTAG / SWD** — pinout, target probe, openocd
32. **GDB** — source-level debug, watchpoints, remote
33. **OpenOCD / J-Link / ST-Link / pyOCD** — probe driver

## Phase 5 — OS & RTOS
34. **OS fundamentals** — scheduling, IPC, virtual memory → [05_OS_Kernel](../../05_OS_Kernel/)
35. **RTOS basics** — tasks, priorities, mutexes, queues, ISR-safe APIs
36. **FreeRTOS** — port + tickless idle + heap_4 + queue lab
37. **Zephyr** — devicetree, Kconfig, west, drivers
38. **QNX / VxWorks / µC/OS / RT-Thread** — survey
39. **Embedded Linux** — kernel + driver + U-Boot + Buildroot/Yocto → [04](../../04_Device_Drivers/) + [05](../../05_OS_Kernel/)
40. **Threading & IPC on Linux** — pthreads, fifos, shm, msgq, signals

## Phase 6 — Interfaces & protocols
41. **UART** — bring up at 115200 8N1; getchar/putchar
42. **I²C** — read a sensor (e.g., BME280); handle ACK/NAK
43. **SPI** — SD card or display
44. **USB** — CDC ACM + HID enumeration
45. **Ethernet + lwIP** — TCP echo server
46. **PCIe** — concept only on MCU; do on SBC
47. **CAN / LIN / FlexRay** → [19_Industrial_Protocols](../../19_Industrial_Protocols/)
48. **Modbus RTU / TCP**, **Profinet**, **EtherCAT** → [19](../../19_Industrial_Protocols/)
49. **MQTT, CoAP** for IoT → [13](../../Network/13_Network_Application/protocols/INDEX.md)
50. **BT / BLE, Wi-Fi, LoRa, Zigbee, Thread, Matter, UWB** → [16](../../16_RF_Wireless/)
51. **Cellular: GSM/LTE, LTE-M, NB-IoT** → [16](../../16_RF_Wireless/)

## Phase 7 — Quality & process
52. **SVN / Git** *(prefer Git)* — feature branches, PR review
53. **SDLC** — Agile/SCRUM, V-Model (regulated industries)
54. **Compilers / GCC** internals enough to read disasm
55. **TDD & unit testing** — Unity, CMock, GoogleTest, Catch2; embedded testbenches
56. **CI/CD pipelines** — GitHub Actions / GitLab CI for cross-compile + sim
57. **SIL / HIL** — software/hardware in the loop
58. **Standards & certifications** — IEC 61508 (functional safety), ISO 26262 (automotive), DO-178C (aviation), IEC 62304 (medical), MISRA C

## Phase 8 — Advanced topics
59. **Embedded security** → [14_Security/topics](../../14_Security/topics/INDEX.md) (firmware/BMC/JTAG/BYOVD)
60. **Embedded GUI** — LVGL, TouchGFX, Qt for MCU, Slint
61. **IoT** — cloud connectivity, secure provisioning, fleet management
62. **Edge AI** → [15_AI_ML](../../15_AI_ML/) (TFLite Micro, CMSIS-NN, microTVM, executorch)
63. **AUTOSAR** (Classic + Adaptive) — automotive ECU software architecture
64. **Memory technologies & file systems** — NOR/NAND/eMMC, LittleFS, FAT, ext4
65. **Hardware sim/emulation** — Renode, QEMU, Wokwi, Tinkercad
66. **Sensors & actuators** — MEMS, motors (BLDC/PMSM), valves
67. **DSP** — FIR/IIR, FFT, fixed-point arithmetic, CMSIS-DSP
68. **Control theory** — PID, state-space, model-predictive control

## Phase 9 — Soft skills
69. **Communication** — write specs, design reviews, postmortems
70. **Problem solving & critical thinking** — root-cause, 5-whys, fishbone
71. **Teamwork & collaboration**
72. **Organizational & time management**
73. **Self-driven & independent**
74. **Adaptability & patience** (embedded debugs are long)

## Industry focus tracks (pick one)
- Automotive · Consumer electronics · Telecom · Healthcare · Robotics · Aerospace · Agriculture
