# Industrial & Automotive Protocols — Languages

## Implementation languages
| Language | Use |
|----------|-----|
| C | Most field-bus stacks (OpenSAFETY, EtherCAT SOEM, lwIP, FreeMODBUS, libsocketcan) |
| C++ | Higher-level (OPC UA open62541 has both; CANoe APIs) |
| Python | Tooling & clients: `pymodbus`, `python-can`, `python-snap7` (Siemens S7), `bacpypes`, `python-opcua`, `cantools`, `udsoncan` |
| Rust | Newer stacks: `socketcan` crate, OPC UA in Rust, EtherCAT efforts |
| Go | `goburrow/modbus`, `gosnmp` |

## PLC languages (IEC 61131-3)
| Lang | Notes |
|------|-------|
| Ladder Diagram (LD) | Visual, relay-logic style |
| Function Block Diagram (FBD) | Block-and-wire |
| Structured Text (ST) | Pascal-like, expressive |
| Sequential Function Chart (SFC) | State-machine-like |
| Instruction List (IL) | Assembly-like (deprecated in 3rd ed.) |

PLC IDEs: CODESYS, TIA Portal (Siemens), TwinCAT (Beckhoff), Studio 5000 (Rockwell).

## Vehicle / automotive DSLs & ecosystems
| Language / tool | Use |
|-----------------|-----|
| Vector CANoe / CANalyzer (CAPL) | Industry-standard CAN/LIN/FlexRay simulation |
| CANdb++ / DBC files | CAN message database |
| ARXML | AUTOSAR XML (BSW config, ECU extract) |
| FIBEX | Field-bus exchange XML |
| ODX (ISO 22901) | Open Diagnostic data eXchange (UDS DBs) |
| dSPACE ControlDesk + Simulink | HIL test |

## OPC UA address-space modeling
- NodeSet XML (UA 1.04+)
- Companion specs (FDI, AutomationML)

## Useful Python libs (pip install ...)
| lib | Purpose |
|-----|---------|
| `pymodbus` | Modbus RTU/TCP/UDP master & slave |
| `python-can` | Cross-platform CAN |
| `cantools` | DBC parsing + decode |
| `udsoncan` | UDS client |
| `python-opcua` (deprecated → `asyncua`) | OPC UA |
| `bacpypes3` | BACnet |
| `python-snap7` | Siemens S7 PLC |
| `pylogix` | Allen-Bradley CIP / EtherNet-IP |
| `socketcan` | Linux socketCAN bindings |
| `pyprofibus` | PROFIBUS (limited support) |

## Cross-link
- App-layer messaging protocols → [13_Network_Application/languages](../../Network/13_Network_Application/languages/INDEX.md)
- L2 framing under industrial Ethernet → [10_Network_DataLink](../../Network/10_Network_DataLink/)
