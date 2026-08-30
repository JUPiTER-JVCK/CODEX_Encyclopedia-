# Industrial & Automotive Protocols — Tools

## Modbus
| Tool | Purpose |
|------|---------|
| `modpoll` | CLI client (TCP / RTU) |
| `mbpoll` | Open alt |
| `pymodbus.server` / `.client` | Python lib |
| QModMaster | GUI master |
| Diagslave | Test slave |

## CAN (SocketCAN on Linux)
| Tool | Purpose |
|------|---------|
| `ip link set can0 up type can bitrate 500000` | Bring up CAN iface |
| `candump can0` | Live monitor |
| `cansend can0 123#DEADBEEF` | Send frame |
| `cangen` | Random traffic generator |
| `canbusload` | Bus load monitor |
| `canfdtest` | CAN-FD echo test |
| `slcand` | Serial line CAN (CANable/USBtin) |
| `cantools` | DBC decode/encode CLI |
| `kayak` | Java GUI |
| `caringcaribou` | CAN security testing |

## CAN (other OS)
- Vector tools (CANalyzer, CANoe, CANalyzer.HW)
- PEAK PCAN-View / PCAN-Explorer
- Kvaser CanKing
- Wireshark with CAN dissector

## EtherCAT
| Tool | Purpose |
|------|---------|
| SOEM (Simple Open EtherCAT Master) | Open C/C++ master |
| IgH EtherCAT master | Linux kernel master |
| TwinCAT 3 | Beckhoff IDE+runtime |
| EtherCAT Explorer | Vendor diagnostic |

## OPC UA
| Tool | Purpose |
|------|---------|
| UaExpert | Reference GUI client (Unified Automation) |
| open62541 examples | Open server/client |
| Prosys OPC UA Simulation Server | Free server for testing |

## BACnet
| Tool | Purpose |
|------|---------|
| Yabe (Yet Another BACnet Explorer) | Free Windows GUI |
| BACnet Stack (Steve Karg) | Open C reference |
| `bacpypes` apps | Python CLIs |

## DALI / DMX
- Lunatone DALI USB tools
- ENTTEC DMX USB Pro + various controller apps
- ola (Open Lighting Architecture) — DMX/RDM stack
- QLC+ — open lighting controller

## Vehicle diagnostics
| Tool | Purpose |
|------|---------|
| ELM327 USB / Bluetooth | OBD-II adapter |
| `obd` (Python) | OBD-II library |
| ScanTool / Torque Pro | App-level OBD |
| ODB Auto Doctor | Multi-platform diag |
| Vector vFlash / CANape | Pro-grade flash/diag |

## Wireshark dissectors (built-in)
- Modbus, EtherCAT, EtherNet/IP, CIP, PROFINET, BACnet, OPC UA, DNP3, IEC 61850 (MMS/GOOSE/SV), HART-IP, CAN/CAN-FD, J1939

## Capture hardware
- Logic analyzers with industrial protocol decoders (Saleae, DSLogic — see [01/protocols/embedded_bus_protocols_lookup.md](../../01_Circuit_Board/protocols/embedded_bus_protocols_lookup.md))
- Industrial Ethernet TAPs / mirror ports
- CAN sniffer: CANable, Kvaser USBcan, PEAK PCAN-USB, Vector VN1610
