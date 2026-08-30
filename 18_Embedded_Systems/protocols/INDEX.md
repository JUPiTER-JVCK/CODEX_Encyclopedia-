---
title: "Embedded Systems — Protocol Reference"
layer: 18_Embedded_Systems
section: protocols
tags: [protocols, index, reference]
updated: 2026-06-07
---

# Embedded Systems — Protocol Reference

> On-chip and on-board buses: I²C, SPI, UART, CAN.

## Dedicated Protocol References

| File | Covers |
|------|--------|
| [I2C and SPI](./i2c_spi.md) | Timing, addressing, modes, QSPI |
| [UART](./uart.md) | Framing, baud rate, RS-232/422/485 |

----|--------------------|
| UART (RS-232 / RS-485 / TTL serial) | [01](../../01_Circuit_Board/protocols/INDEX.md), [10_DataLink](../../Network/10_Network_DataLink/protocols/INDEX.md) |
| I²C | [01_Circuit_Board](../../01_Circuit_Board/protocols/INDEX.md) |
| SPI | [01_Circuit_Board](../../01_Circuit_Board/protocols/INDEX.md) |

## High-speed
| Protocol | Owning codex layer |
|----------|--------------------|
| Ethernet (PHY) | [09_Network_Physical](../../Network/09_Network_Physical/protocols/INDEX.md) |
| Ethernet (MAC) | [10_Network_DataLink](../../Network/10_Network_DataLink/protocols/INDEX.md) |
| USB | [01_Circuit_Board/protocols](../../01_Circuit_Board/protocols/INDEX.md) |
| PCIe | [01_Circuit_Board/protocols](../../01_Circuit_Board/protocols/INDEX.md) |

## Wireless
| Protocol | Owning codex layer |
|----------|--------------------|
| Bluetooth / BLE | [16_RF_Wireless](../../16_RF_Wireless/protocols/INDEX.md) |
| Wi-Fi (802.11) | [16_RF_Wireless](../../16_RF_Wireless/protocols/INDEX.md) |
| LoRa / LoRaWAN | [16_RF_Wireless](../../16_RF_Wireless/protocols/INDEX.md) |
| Zigbee (802.15.4) | [16_RF_Wireless](../../16_RF_Wireless/protocols/INDEX.md) |
| Thread (IPv6 over 802.15.4) | [16](../../16_RF_Wireless/protocols/INDEX.md) + [11_Internet](../../Network/11_Network_Internet/protocols/INDEX.md) |
| Matter (over Thread / Wi-Fi / Ethernet) | [08_User_Applications/protocols](../../08_User_Applications/protocols/INDEX.md) |
| UWB | [16_RF_Wireless](../../16_RF_Wireless/protocols/INDEX.md) |

## Industrial (own layer — most relevant to embedded)
| Protocol | Owning codex layer |
|----------|--------------------|
| Modbus RTU / TCP | [19_Industrial_Protocols](../../19_Industrial_Protocols/protocols/INDEX.md) |
| Profinet | [19](../../19_Industrial_Protocols/protocols/INDEX.md) |
| EtherCAT | [19](../../19_Industrial_Protocols/protocols/INDEX.md) |
| EtherNet/IP, CC-Link IE, Sercos III, POWERLINK | [19](../../19_Industrial_Protocols/protocols/INDEX.md) |
| MQTT (3.1.1 / 5.0) | [13_Network_Application](../../Network/13_Network_Application/protocols/INDEX.md) |
| CoAP | [13_Network_Application](../../Network/13_Network_Application/protocols/INDEX.md) |
| OPC UA | [19](../../19_Industrial_Protocols/protocols/INDEX.md) |
| HART / WirelessHART | [19](../../19_Industrial_Protocols/protocols/INDEX.md) |
| BACnet | [19](../../19_Industrial_Protocols/protocols/INDEX.md) |

## Automotive (in 19)
| Protocol | Owning codex layer |
|----------|--------------------|
| CAN / CAN-FD / CAN-XL | [19](../../19_Industrial_Protocols/protocols/INDEX.md) |
| LIN | [19](../../19_Industrial_Protocols/protocols/INDEX.md) |
| FlexRay | [19](../../19_Industrial_Protocols/protocols/INDEX.md) |
| MOST | [19](../../19_Industrial_Protocols/protocols/INDEX.md) |
| Automotive Ethernet (100BASE-T1, 1000BASE-T1) | [09](../../Network/09_Network_Physical/protocols/INDEX.md) |
| AUTOSAR PDU | [19](../../19_Industrial_Protocols/protocols/INDEX.md) |
| SOME/IP | [19](../../19_Industrial_Protocols/protocols/INDEX.md) |
| UDS (ISO 14229), KWP2000, J1939 | [19](../../19_Industrial_Protocols/protocols/INDEX.md) |

## Network
| Protocol | Owning codex layer |
|----------|--------------------|
| TCP, UDP, QUIC | [12_Network_Transport](../../Network/12_Network_Transport/protocols/INDEX.md) |
| IP, ICMP, IPv6 | [11_Network_Internet](../../Network/11_Network_Internet/protocols/INDEX.md) |

## Cellular
| Protocol | Owning codex layer |
|----------|--------------------|
| GSM / LTE | [16_RF_Wireless](../../16_RF_Wireless/protocols/INDEX.md) |
| 5G NR | [16](../../16_RF_Wireless/protocols/INDEX.md) |
| LTE-M, NB-IoT | [16](../../16_RF_Wireless/protocols/INDEX.md) |

## Debug
| Protocol | Owning codex layer |
|----------|--------------------|
| JTAG (IEEE 1149.1) | [01](../../01_Circuit_Board/protocols/INDEX.md) + [00d](../../00d_Digital_Circuits/protocols/INDEX.md) |
| SWD (ARM 2-wire JTAG) | [01](../../01_Circuit_Board/protocols/INDEX.md) |
| SWO / ITM | [02_CPU](../../02_CPU/protocols/INDEX.md) |
| ETM / ETB | [02_CPU](../../02_CPU/) |

## See also
- The mega "logic analyzer decoder" list (DSLogic / sigrok) → [01/protocols/embedded_bus_protocols_lookup.md](../../01_Circuit_Board/protocols/embedded_bus_protocols_lookup.md)
