# LAYERS — Master Table

> **v2.1** extends the original PDF model with finer-grained foundational
> layers (00 series) and three new cross-cutting bands (17–19) covering
> algorithms, embedded systems, and industrial protocols.
>
> Original PDF: `~/Documents/Information_Tech/- System/computer_layers.pdf`
> Image references in [`_assets/`](_assets/).

## Physical Foundations (new in v2.1)

Per the *"Application Software → ... → Devices → Physics"* ladder image,
v2.1 adds the foundational layers beneath the original "Circuit Board" row:

| # | Layer | Description | Languages | Medium / Interface | Example |
|---|-------|-------------|-----------|--------------------|---------|
| 00 | [Physics](00_Physics/) | EM, semiconductor, quantum, thermodynamics underlying computation | Math, MATLAB/Python sim | Reality | Electron drift in a doped Si channel under V_GS |
| 00b | [Devices](00b_Devices/) | Discrete + integrated components: diodes, BJTs, MOSFETs, passives | SPICE, Verilog-A | Datasheet IV/CV curves | A power MOSFET switches 30 A under PWM gate drive |
| 00c | [Analog Circuits](00c_Analog_Circuits/) | Continuous-valued circuits: amps, filters, ADC/DAC, regulators | SPICE, MATLAB, Verilog-AMS | V / I waveforms | Op-amp INA conditions a thermistor for ADC |
| 00d | [Digital Circuits](00d_Digital_Circuits/) | Logic gates, flip-flops, ALUs, FSMs, RTL | Verilog, SystemVerilog, VHDL, Chisel | Boolean signals + clocks | 32-bit ALU executes ADD in 1 cycle |

## Compute Stack (unchanged from v2.0)

| # | Layer | Description | Languages | Medium / Interface | Example Communication |
|---|-------|-------------|-----------|--------------------|-----------------------|
| 01 | [Circuit Board](01_Circuit_Board/) | Physical hardware connecting CPU, RAM, I/O | N/A (HDLs: Verilog, VHDL) | Electrical signals, buses (PCIe, DDR, SPI, I²C) | CPU fetches data from RAM via buses |
| 02 | [CPU](02_CPU/) | Executes machine instructions and computations | Machine code, Assembly (x86, ARM, RISC-V) | ISA, electrical signals, microcode | Executes BIOS instructions at startup |
| 03 | [Firmware / BIOS](03_Firmware_BIOS/) | Initializes hardware and loads the OS | Assembly, C | Firmware routines, hardware I/O, UEFI services | Loads OS from disk via bootloader |
| 04 | [Device Drivers](04_Device_Drivers/) | Controls hardware, interfaces hardware to OS | C, C++ (Rust on Linux) | OS driver APIs, hardware buses, IRQs | Disk driver reads data from disk |
| 05 | [OS Kernel](05_OS_Kernel/) | Manages resources, security, hardware | C, Assembly (Rust in Linux) | System calls, hardware via drivers | File open request handled via kernel calls |
| 06 | [System Libraries](06_System_Libraries/) | Reusable code offering high-level APIs | C, C++ | Function calls, system calls (libc, libstdc++) | `printf()` uses OS write calls |
| 07 | [Runtime Environment](07_Runtime_Environment/) | Platform for application execution | C/C++, Java, Python, Go, .NET | OS services, runtime APIs (JVM, CPython, V8) | JVM executes Java bytecode using OS calls |
| 08 | [User Applications](08_User_Applications/) | End-user software for specific tasks | C++, Java, Python, JS, Swift, Kotlin | UI, library/system calls | Media player uses OS + drivers to output A/V |

## Network Stack (OSI-aligned)

> **v2.2 layout:** these five layers live inside `Codex_v2/Network/` as a
> named band. The other 18 layers stay flat at the top level.

| # | Layer | OSI | Description | Protocols | Example |
|---|-------|-----|-------------|-----------|---------|
| 09 | [Network Physical](Network/09_Network_Physical/) | L1 | Bits over a medium — copper, fiber, RF | 802.3 PHY, 802.11 PHY, DOCSIS | NIC encodes bits onto Cat6 |
| 10 | [Network Data Link](Network/10_Network_DataLink/) | L2 | Frames between adjacent nodes | Ethernet, Wi-Fi MAC, ARP, VLAN, STP | Switch forwards frame by MAC |
| 11 | [Network Internet](Network/11_Network_Internet/) | L3 | Packet routing between networks | IPv4, IPv6, ICMP, OSPF, BGP | Router selects path to dest IP |
| 12 | [Network Transport](Network/12_Network_Transport/) | L4 | End-to-end delivery, reliability, flow | TCP, UDP, QUIC, SCTP | TCP three-way handshake |
| 13 | [Network Application](Network/13_Network_Application/) | L5-7 | App-level protocols, sessions, data | HTTP, DNS, TLS, SSH, SMTP, IMAP | Browser issues `GET / HTTP/2` |

## Cross-Cutting Layers

| # | Layer | Spans | What it covers |
|---|-------|-------|----------------|
| 14 | [Security](14_Security/) | All layers | OSINT, pentesting, malware, crypto, IR, compliance |
| 15 | [AI / ML](15_AI_ML/) | 07–08 (mostly) | Models, training, prompts, agents, tooling |
| 16 | [RF / Wireless](16_RF_Wireless/) | 01, 09, 10 | RF fundamentals, SDR, Wi-Fi, Bluetooth, cellular |
| **17** | **[Algorithms & DSA](17_Algorithms_DSA/)** *(new v2.1)* | 02 → 08, 15 | LeetCode-style patterns, complexity, interview prep |
| **18** | **[Embedded Systems](18_Embedded_Systems/)** *(new v2.1)* | 00 → 13, 14, 16 | Roadmap-aligned (Parvizi v1.2.3): MCU, RTOS, build, debug, certs |
| **19** | **[Industrial Protocols](19_Industrial_Protocols/)** *(new v2.1)* | 09 → 13 + OT/auto | Modbus, PROFINET, EtherCAT, BACnet, DALI, CAN, LIN, FlexRay, UDS, J1939 |

## Full Layer Adjacencies (v2.1)

```
USER WORLD
   ▲
   │  syscall / library call
   │
 08 User Applications  ◄──────────►  17 Algorithms & DSA
   │
 07 Runtime Environment (JVM / CPython / V8 / .NET CLR)
   │
 06 System Libraries (libc, libstdc++)
   │
 05 OS Kernel  ◄────────────►  13 Network Application
   │                                │
 04 Device Drivers                 12 Network Transport
   │                                │
 03 Firmware / BIOS                11 Network Internet
   │                                │
 02 CPU                            10 Network Data Link
   │                                │
 01 Circuit Board ─────────────────  9 Network Physical
   │
 00d Digital Circuits (logic gates, flip-flops, RTL)
   │
 00c Analog Circuits (op-amps, filters, ADC/DAC, regulators)
   │
 00b Devices (diodes, BJTs, MOSFETs, passives)
   │
 00 Physics (EM, solid-state, quantum, thermo)
   ▼
ELECTRONS / PHOTONS / RF
```

Cross-cutting layers (14 Security, 15 AI/ML, 16 RF/Wireless, 17 Algorithms,
18 Embedded Systems, 19 Industrial Protocols) intersect this stack at the
points listed in each layer's README.

## Source images (in `_assets/`)

- `computer_layers_ladder.png` — the 9-layer ladder (drove the v2.1 expansion)
- `logic_gates_explained.png` — referenced from [00d/topics/logic_gates.md](00d_Digital_Circuits/topics/logic_gates.md)
- `dslogic_decoder_list.png` — referenced from [01/protocols/embedded_bus_protocols_lookup.md](01_Circuit_Board/protocols/embedded_bus_protocols_lookup.md)
- `embedded_systems_roadmap.png` — referenced from [18/README.md](18_Embedded_Systems/README.md)

## Anchor PDFs

- `17_Algorithms_DSA/references/100_leetcode_problems.pdf` — user-supplied list
- `18_Embedded_Systems/references/embedded_systems_full_roadmap_book.pdf` — from v1
- Original PDF: `~/Documents/Information_Tech/- System/computer_layers.pdf` (drove v2.0)
