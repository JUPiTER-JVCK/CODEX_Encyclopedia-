# Embedded Systems — Topics (roadmap index)

## Embedded Linux specifics
- **Kernel** — pre-built vs custom build; defconfig per board
- **Device drivers** — char/block/net/platform → [04](../../04_Device_Drivers/)
- **U-Boot** — env, scripts, FIT, falcon mode
- **Buildroot vs Yocto vs OpenEmbedded** — when to pick which
- **Threading & parallelism** — pthreads, futexes, RT priorities
- **IPC** — pipes, sockets, shm, msgq, DBus
- **Qt for embedded** — XCB-less, EGLFS

## RTOS specifics
- **Concepts** — task, ISR, mutex, semaphore, queue, event flag, software timer
- **Schedulers** — preemptive priority, round-robin within priority, EDF
- **Memory** — heap_1..heap_5 (FreeRTOS), pool allocators, MPU regions
- **FreeRTOS** — tickless, stream/message buffers, idle hook
- **Zephyr** — kernel objects, devicetree-driven init
- **RT-Thread, NuttX, ThreadX (now Eclipse), µC/OS, QNX, VxWorks, INTEGRITY** — survey
- **Verified kernels** — seL4 (cross-link [05](../../05_OS_Kernel/))

## Microcontroller peripherals
- **GPIO** — modes (PP/OD), pull-ups, ESD
- **ADC** — sampling time, reference, common-mode range
- **DAC** — output impedance, buffering
- **Timers** — basic, advanced (PWM, dead-time), input capture, output compare
- **PWM** — center- vs edge-aligned
- **Watchdog** — independent (IWDG) vs window (WWDG)
- **Interrupts** — vector table, NVIC, priority groups, nested
- **DMA** — circular, double-buffered, M2M/M2P/P2M
- **Clock management** — HSI/HSE/PLL/LSE; tree configuration
- **Power management** — Run/Sleep/Stop/Standby; wake sources
- **Bootloader/DFU** — A/B partitions, secure boot, anti-rollback

## Build system
- **Compilers/GCC** — link sections, `.text`, `.data`, `.bss`, `.rodata`, custom sections
- **Linker scripts** — MEMORY regions, SECTIONS, `KEEP()`, `__attribute__((section(...)))`
- **Make / CMake** — toolchain files, board configs
- **Bash scripting** — flash/log/test harness
- **Docker** — reproducible toolchains

## Debugging
- **JTAG / SWD / cJTAG** — pinout, protocol layer
- **GDB** — `target remote`, breakpoints, watchpoints, ITM trace
- **OpenOCD** — TCL-driven, configs per probe + target
- **Tracing** — ITM/SWO, ETM, ETB, OS-aware trace (Tracealyzer, SystemView)

## Memory & file systems
- **NOR vs NAND flash**, **eMMC**, **SD**, **SPI flash**
- **NVRAM / FRAM** for state
- **File systems** — LittleFS, SPIFFS, FATFS, ext4, JFFS2, UBIFS
- **Wear leveling**, **bad-block management**

## Hardware sim/emulation
- **QEMU** — system mode for SoCs
- **Renode** — multi-MCU + peripherals + network co-simulation
- **Wokwi / Tinkercad** — beginner
- **HIL** — Speedgoat, NI VeriStand, custom rigs

## Standards / certifications
- **MISRA C** — coding rules for safety
- **IEC 61508** — functional safety (general)
- **ISO 26262** (automotive)
- **DO-178C** (aviation software)
- **DO-254** (aviation hardware)
- **IEC 62304** (medical software)
- **EN 50128** (rail software)

## Embedded security (cross-link)
- Secure boot, anti-rollback, key provisioning, fuses
- TPM 2.0 / TEE / Arm TrustZone / RISC-V Keystone
- Side channels (cross-link [02](../../02_CPU/topics/INDEX.md), [14](../../14_Security/topics/INDEX.md))
- BYOVD, BMC exploits → [14](../../14_Security/topics/INDEX.md)

## Embedded GUI
- LVGL, TouchGFX, Qt for MCUs, Slint, NemaGFX, EmWin
- DIY: framebuffer + simple widgets

## IoT
- Provisioning (BLE, Wi-Fi onboarding)
- Cloud — AWS IoT Core, Azure IoT Hub, GCP IoT Core (deprecated → 3rd party)
- Edge↔cloud — MQTT, CoAP, AMQP, OPC UA
- Fleet management — OTA, telemetry, remote debug

## Edge AI
- TFLite Micro, CMSIS-NN, microTVM, executorch, X-CUBE-AI
- Quantization (INT8/INT4), pruning, knowledge distillation
- HW: Arm Cortex-M with helium, Ethos-U NPU, ESP32-S3 (vector ext), Coral Edge TPU

## AUTOSAR
- Classic Platform vs Adaptive Platform
- RTE (Runtime Environment), BSW (Basic Software), SWC (Software Components)
- COM stack, Diagnostic Communication Manager (DCM)

## Sensors & actuators
- IMU (accel + gyro + mag), pressure, temperature/humidity, light, distance (ToF, ultrasonic, lidar)
- Motors — DC, BLDC (FOC), PMSM, stepper, servo
- Actuators — solenoids, relays, valves

## DSP
- FIR / IIR filters, FFT, windowing
- Fixed-point vs floating-point on MCU
- CMSIS-DSP library

## Control theory
- PID — tuning (Ziegler-Nichols, manual)
- State-space, Kalman filter
- Model Predictive Control (MPC)

## Cross-link
- All the layer-by-layer details live in [00–08](../../00_Physics/) of this codex
- Industrial bus protocols → [19_Industrial_Protocols](../../19_Industrial_Protocols/)
- Wireless → [16_RF_Wireless](../../16_RF_Wireless/)
