---
title: "Industrial Protocols — Protocol Reference"
layer: 19_Industrial_Protocols
section: protocols
tags: [protocols, index, reference]
updated: 2026-06-07
---

# Industrial Protocols — Protocol Reference

> Fieldbus, SCADA, and OT-network protocols: Modbus, OPC UA, PROFINET, DNP3.

## Dedicated Protocol References

| File | Covers |
|------|--------|
| [Modbus](./modbus.md) | RTU/ASCII/TCP, function codes, register model |
| [OPC UA](./opc_ua.md) | Information model, security, PubSub, TSN |

----|------|-------|
| Modbus RTU | Modbus Org (MAP V1.1b3) | RS-485, 1 master / N slaves |
| Modbus ASCII | same | ASCII variant |
| Modbus TCP | same | Port 502 |
| Modbus Secure | RFC 8907-style (TLS) | TLS port 802 |
| PROFIBUS DP | IEC 61158-3-3 / -6-3 | RS-485 |
| PROFIBUS PA | IEC 61158 / IEC 61784 CP3/2 | IS bus |
| AS-i | IEC 62026-2 | Sensor/actuator bus |
| INTERBUS | IEC 61158 CPF6 | Legacy ring |
| DeviceNet | ODVA CIP over CAN | |
| ControlNet | ODVA CIP over coax (legacy) | |
| Foundation Fieldbus H1 | IEC 61158 CPF1 | 31.25 kbps |

## Industrial Ethernet
| Protocol | Owner | Notes |
|----------|-------|-------|
| PROFINET (RT / IRT / TSN) | PI | RT non-IP, IRT real-time, TSN convergent |
| EtherNet/IP | ODVA | CIP over TCP/UDP |
| EtherCAT | ETG | On-the-fly addressing |
| POWERLINK | EPSG | Slot-based |
| Sercos III | IGS | Motion-control |
| CC-Link IE | CLPA | Mitsubishi-led |
| Modbus TCP | Modbus Org | Simple TCP/502 |
| OPC UA (TSN / FieldX) | OPC Foundation | Field-level OPC UA |

## CANopen / CAN-based
| Protocol | Notes |
|----------|-------|
| CANopen (CiA 301) | Object dict + PDO/SDO |
| CANopen-FD (CiA 1301) | CAN-FD-based |
| SAE J1939 | Heavy-duty vehicle |
| ISOBUS (ISO 11783) | Agriculture |
| NMEA 2000 | Marine |

## Building automation
| Protocol | Spec |
|----------|------|
| BACnet | ASHRAE 135 / ISO 16484-5 |
| BACnet/IP | ASHRAE 135 Annex J |
| BACnet/SC (Secure Connect) | newer over WebSocket+TLS |
| KNX | ISO/IEC 14543-3 |
| LonWorks | ISO/IEC 14908 |
| DALI | IEC 62386 |
| DALI-2 / D4i | DiiA cert |
| DMX512 | ANSI E1.11 |
| RDM (over DMX) | ANSI E1.20 |
| sACN (E1.31) | DMX over IP |
| Art-Net 4 | Artistic Licence |
| M-Bus | EN 13757-2/-3 |
| OPC DA / AE / HDA (Classic) | Microsoft COM/DCOM legacy |

## Process
| Protocol | Spec |
|----------|------|
| HART | FieldComm |
| WirelessHART | IEC 62591 |
| ISA100.11a | IEC 62734 |
| Foundation Fieldbus H1/H2 | IEC 61158 |

## Energy / utility
| Protocol | Spec |
|----------|------|
| IEC 61850 MMS / GOOSE / SV | IEC 61850 |
| DNP3 | IEEE 1815 |
| IEC 60870-5-101 (serial), -104 (TCP) | IEC |
| OpenADR 2.0/3.0 | OpenADR Alliance |

## Semantic / interop
| Protocol | Spec |
|----------|------|
| OPC UA (Binary / HTTPS) | IEC 62541 |
| OPC UA PubSub | IEC 62541-14 |
| MTConnect | ANSI MTC1.4 |
| Sparkplug B | Eclipse Sparkplug WG |

## Automotive — physical / link
| Protocol | Spec |
|----------|------|
| CAN 2.0A/B | ISO 11898-1, -2 |
| CAN-FD | ISO 11898-1:2015 |
| CAN-XL | ISO 11898-1 update |
| LIN | ISO 17987 |
| FlexRay | ISO 17458 |
| MOST 25 / 50 / 150 | MOST Coop. |
| 100/1000/2.5G/5G/10GBASE-T1 | IEEE 802.3 |
| 10BASE-T1S | IEEE 802.3cg |

## Automotive — middleware / app
| Protocol | Spec |
|----------|------|
| SOME/IP, SOME/IP-SD | AUTOSAR |
| DDS-RTPS | OMG |
| TSN (802.1Qbv/Qci/Qbu) | IEEE |

## Automotive — diagnostics
| Protocol | Spec |
|----------|------|
| OBD-II | ISO 15765 / SAE J1979 |
| UDS | ISO 14229 |
| KWP2000 | ISO 14230 |
| J1939 | SAE J1939 family |
| ISO 15765-2 (ISO-TP) | CAN transport |
| DoIP | ISO 13400 |
| XCP | ASAM XCP |

## Cybersecurity standards (cross-link [14](../../14_Security/))
| Standard | Scope |
|----------|-------|
| ISA/IEC 62443 | Industrial cybersecurity |
| ISO/SAE 21434 | Automotive cybersec |
| UN R155 / R156 | UNECE vehicle cybersec & SUMS |
| NERC CIP | US bulk electric |
| NIST SP 800-82 | ICS security guide |
