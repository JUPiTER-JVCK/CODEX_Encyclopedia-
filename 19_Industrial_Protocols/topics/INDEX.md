# Industrial & Automotive Protocols — Topics

## Modbus
- **Variants** — Modbus RTU (RS-485/232), Modbus ASCII, Modbus TCP (port 502), Modbus over UDP
- **Function codes** — 01 Read Coils, 03 Read Holding Regs, 06 Write Single Reg, 16 Write Multiple, etc.
- **Exception codes** — 01 Illegal Function, 02 Illegal Address, 03 Illegal Value, 04 Slave Device Failure
- **Holding/Input registers, coils, discrete inputs** — 4 address spaces
- **Modbus security** — TLS extension (RFC?-equiv), role-based access (newer)

## PROFIBUS / PROFINET
- **PROFIBUS DP/PA** — legacy RS-485 / IS-friendly
- **PROFINET IO** — RT, IRT, TSN profiles
- **GSD / GSDML** — device description files
- **MRP, MRPD** — media redundancy
- **DCP** — Discovery & Configuration Protocol

## EtherCAT
- **Master + slaves on shared ring/line topology**
- **Distributed clocks (DC)** — sub-µs sync
- **CoE (CANopen over EtherCAT)** — object dictionary
- **EoE, SoE, FoE** — Ethernet/Servo/File over EtherCAT
- **ESI XML** — device description

## EtherNet/IP, DeviceNet, ControlNet (ODVA)
- **CIP (Common Industrial Protocol)** common app layer
- **EtherNet/IP** = CIP over TCP+UDP
- **DeviceNet** = CIP over CAN (rare new installs)
- **ControlNet** = CIP over coax (legacy)

## CANopen
- Object dictionary + PDOs + SDOs + heartbeat
- Sits on top of CAN 2.0

## POWERLINK, Sercos III, CC-Link IE
- Industrial Ethernet alternatives, motion-control focus

## OPC UA
- **Address space** — nodes, references, types
- **Services** — discovery, browse, read/write, subscribe, method call
- **Information models** — companion specs (e.g., for robotics, energy, packaging)
- **Security modes** — None, Sign, SignAndEncrypt
- **PubSub** — newer, broker-less (UDP / MQTT / AMQP)

## Building automation
- **BACnet** — over IP / MS-TP (RS-485) / Ethernet / ARCnet; objects + services + COV subscription
- **KNX** — TP1 / IP / RF; group addresses
- **LonWorks** — neuron chips, deprecated but installed base
- **DALI** — 9600 baud Manchester-coded, 16-bit forward / 8-bit backward frames
- **DMX512** — 250 kbaud, up to 512 channels, RS-485
- **M-Bus** — meter bus (heat, water, electric); IEC 13757

## Process automation
- **HART** — analog 4-20 mA loop + 1200 baud Bell 202 superimposed
- **WirelessHART** — 2.4 GHz mesh
- **Foundation Fieldbus H1** — 31.25 kbps; H2 ≈ HSE (Ethernet)
- **ISA100.11a** — wireless industrial

## Energy / utility
- **IEC 61850** — substation automation; GOOSE (L2 multicast), SV (Sampled Values), MMS (TCP)
- **DNP3** — SCADA in utilities (North America)
- **IEC 60870-5-101/-104** — SCADA in utilities (Europe)
- **OpenADR** — demand response

## Automotive — vehicle networks
- **CAN 2.0A (11-bit ID), 2.0B (29-bit)** — up to 1 Mb/s
- **CAN-FD** — flexible data rate; up to 8 Mb/s data phase, 64 B payload
- **CAN-XL** — up to 10 Mb/s, 2048 B payload
- **LIN** — single-wire 1-19.2 kbaud; cheap subnet under CAN
- **FlexRay** — dual-channel 10 Mb/s, static + dynamic slots, time-triggered
- **MOST** — multimedia infotainment ring (legacy)
- **Automotive Ethernet** — 100BASE-T1 / 1000BASE-T1 / 2.5/5/10GBASE-T1
- **SOME/IP** — service-oriented in-vehicle middleware
- **DDS** — used for autonomy stacks (ROS 2 default)
- **TSN (Time-Sensitive Networking)** — automotive + industrial Ethernet QoS

## Automotive — diagnostics
- **OBD-II (ISO 15765-4)** — emissions, mandatory
- **UDS (ISO 14229)** — generic diag services (0x10–0x3E)
- **KWP2000 (ISO 14230)** — predecessor
- **J1939** — heavy-duty (trucks, ag, marine); 29-bit IDs with PGN
- **DoIP (ISO 13400)** — diagnostics over IP

## AUTOSAR (cross-link [18](../../18_Embedded_Systems/))
- **Classic Platform** vs **Adaptive Platform** (POSIX-based)
- **PDU, I-PDU, N-PDU**
- **COM stack**, **PduR**, **CanIf**, **CanTp**, **DCM**, **DEM**

## ICS / OT security (cross-link [14](../../14_Security/))
- **Purdue Reference Model** — IT/OT zones
- **NERC CIP** — US utility regs
- **ISA/IEC 62443** — industrial cybersecurity standard family
- **IDS for OT** — Claroty, Dragos, Nozomi, Tenable.OT
- **Notable incidents** — Stuxnet (2010), Industroyer (2016), Triton/Trisis (2017), Colonial Pipeline (2021), Industroyer2 (2022), Frostygoop (2024)
