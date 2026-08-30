---
title: "Modbus — Protocol"
layer: 19_Industrial_Protocols
section: protocols
tags: [protocol, modbus, modbus-tcp, modbus-rtu, plc, industrial, scada]
updated: 2026-05-21
---

# Modbus — Protocol

---

## Overview

Modbus is a serial communication protocol published by Modicon in 1979.
It is a master/slave (client/server in later terminology) request-response
protocol with no authentication or encryption. Despite its age, it remains
the most widely deployed industrial protocol.

```
  Modbus variants:
  ┌────────────────┬────────────────────────────────────────────────┐
  │ Variant        │ Physical / Transport                           │
  ├────────────────┼────────────────────────────────────────────────┤
  │ Modbus RTU     │ RS-232 or RS-485, binary framing, CRC-16      │
  │ Modbus ASCII   │ RS-232 or RS-485, ASCII framing, LRC          │
  │ Modbus TCP     │ TCP/IP, port 502, no extra CRC (TCP provides)  │
  │ Modbus UDP     │ UDP (rare), used for broadcast scenarios       │
  └────────────────┴────────────────────────────────────────────────┘
```

---

## Data Model

Modbus organizes device data into four tables:

```
  ┌──────────────────────┬────────────┬──────────────────────────────┐
  │ Table                │ Read FC    │ Write FC                     │
  ├──────────────────────┼────────────┼──────────────────────────────┤
  │ Coils                │ FC 01      │ FC 05 (single), FC 0F (multi)│
  │ (1-bit read/write)   │            │                              │
  │ Discrete Inputs      │ FC 02      │ Read-only                    │
  │ (1-bit read-only)    │            │                              │
  │ Holding Registers    │ FC 03      │ FC 06 (single), FC 10 (multi)│
  │ (16-bit read/write)  │            │                              │
  │ Input Registers      │ FC 04      │ Read-only                    │
  │ (16-bit read-only)   │            │                              │
  └──────────────────────┴────────────┴──────────────────────────────┘
  
  Address space: 0–65535 (0x0000–0xFFFF) per table
  Note: Modbus addresses are 0-indexed in PDU; some vendors use 1-indexed
  notation (e.g., "register 40001" = holding register 0)
```

---

## Function Codes

| FC (hex) | Name | Description |
|----------|------|-------------|
| 01 (0x01) | Read Coils | Read 1–2000 coil bits |
| 02 (0x02) | Read Discrete Inputs | Read 1–2000 discrete inputs |
| 03 (0x03) | Read Holding Registers | Read 1–125 holding registers |
| 04 (0x04) | Read Input Registers | Read 1–125 input registers |
| 05 (0x05) | Write Single Coil | Write 0xFF00 (ON) or 0x0000 (OFF) |
| 06 (0x06) | Write Single Register | Write one holding register |
| 0F (0x0F) | Write Multiple Coils | Write 1–1968 coils |
| 10 (0x10) | Write Multiple Registers | Write 1–123 registers |
| 16 (0x16) | Mask Write Register | AND/OR mask applied to register |
| 17 (0x17) | Read/Write Multiple Registers | Combined read + write in one PDU |
| 2B (0x2B) | MEI Transport | Device identification, vendor info |

### Exception Codes

When the slave cannot process a request, it returns a response with the
function code ORed with 0x80 and one exception code byte:

| Code | Meaning |
|------|---------|
| 01 | Illegal Function — FC not supported |
| 02 | Illegal Data Address — register out of range |
| 03 | Illegal Data Value — value not accepted |
| 04 | Slave Device Failure — unrecoverable error |

---

## Modbus TCP Frame

```
  Modbus TCP Application Data Unit (ADU):
  
  ┌──────────┬──────────┬────────┬──────┬────────────────────────┐
  │ Trans ID │ Proto ID │ Length │ Unit │   PDU                  │
  │ (2 bytes)│ (2 bytes)│(2 bytes│(1 B) │ Func code + Data       │
  │ 0x0001   │ 0x0000   │ 0x0006 │ 0x01 │ 0x03  0x00 0x00  0x000A│
  └──────────┴──────────┴────────┴──────┴────────────────────────┘
              Always 0                     FC03  addr=0  count=10
  
  Length field = bytes from Unit ID to end of PDU (inclusive)
  
  Response to FC03 (10 holding registers):
  ┌─────────────────────────────────────────────────────────────────┐
  │ MBAP(7) │ 0x03 │ byte_count=0x14 │ reg0_hi │ reg0_lo │ ... │
  └─────────────────────────────────────────────────────────────────┘
```

---

## Modbus RTU Frame

```
  Modbus RTU ADU (RS-485):
  
  ┌──────────┬──────────┬──────────────────────┬─────────┐
  │ Slave ID │ Function │ Data (variable)       │ CRC-16  │
  │ (1 byte) │ Code (1) │                       │ (2 bytes│
  │ 0x01     │ 0x03     │ 0x00 0x00  0x00 0x0A  │ LE      │
  └──────────┴──────────┴──────────────────────┴─────────┘
  
  Frame delimiters: silence of ≥ 3.5 character times (not bytes!)
  
  CRC-16 polynomial: 0xA001 (reflected 0x8005)
  Calculated over all bytes except CRC itself, little-endian
```

---

## Register Value Conventions

Modbus registers are 16-bit unsigned integers. Multi-word values require
convention (no standard ordering):

| Type | Registers | Byte order convention |
|------|-----------|----------------------|
| INT16 | 1 reg | Direct |
| UINT16 | 1 reg | Direct |
| INT32 | 2 regs | Big-endian word order (high word first) |
| FLOAT32 | 2 regs | Big-endian or little-endian (device-specific) |
| INT64 | 4 regs | Device-specific |
| ASCII string | N regs | Two chars per register |

---

## Security Considerations

- No authentication: any host reaching port 502 can read/write registers
- No encryption: all data in plaintext
- No session concept: stateless request-response
- Mitigations: VLAN/firewall isolation, VPN, Modbus/TLS (rare)

---

## Key Terms

| Term | Definition |
|------|-----------|
| Master / Client | Initiates requests (PLC, SCADA, HMI) |
| Slave / Server | Responds to requests (sensors, drives, I/O modules) |
| Coil | 1-bit read/write data point (digital output) |
| Discrete input | 1-bit read-only data point (digital input) |
| Holding register | 16-bit read/write data point |
| Input register | 16-bit read-only data point |
| PDU | Protocol Data Unit — FC + data (same for all Modbus variants) |
| ADU | Application Data Unit — PDU + framing (variant-specific) |
| RTU | Remote Terminal Unit — binary framing with CRC |
| MBAP | Modbus Application Protocol header (TCP variant) |

---

## See Also

- Industrial lab exercises → [../lessons/industrial_labs.md](../lessons/industrial_labs.md)
- OPC UA protocol → [./opc_ua.md](./opc_ua.md)
- MQTT (via app layer tools) → [../../Network/13_Network_Application/man_pages/app_protocol_tools.md](../../Network/13_Network_Application/man_pages/app_protocol_tools.md)
