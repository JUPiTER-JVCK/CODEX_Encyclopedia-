---
title: "RF & Wireless — Protocol Reference"
layer: 16_RF_Wireless
section: protocols
tags: [protocols, index, reference]
updated: 2026-06-07
---

# RF & Wireless — Protocol Reference

> Wi-Fi, Bluetooth, cellular, LPWAN, GNSS, broadcast, amateur digital.

## Dedicated Protocol References

| File | Covers |
|------|--------|
| [Wi-Fi (802.11)](./wifi.md) | Evolution, OFDM, WPA3, roaming, mesh |
| [Bluetooth / BLE](./bluetooth.md) | GATT, pairing, LE Audio, BT Mesh |
| [LoRaWAN](./lorawan.md) | Classes, OTAA/ABP, ADR, regional params |

## Wi-Fi (802.11)

| Standard | Marketing name | Band | Year |
|----------|----------------|------------|------|
| 802.11a | — | 5 GHz | 1999 |
| 802.11b | — | 2.4 GHz | 1999 |
| 802.11g | — | 2.4 GHz | 2003 |
| 802.11n | Wi-Fi 4 | 2.4 / 5 | 2009 |
| 802.11ac | Wi-Fi 5 | 5 | 2013 |
| 802.11ax | Wi-Fi 6 / 6E | 2.4 / 5 / 6 | 2019/2020 |
| 802.11be | Wi-Fi 7 | 2.4 / 5 / 6 | 2024 |
| 802.11bn | Wi-Fi 8 (in dev) | TBD | future |
| 802.11ad / ay | WiGig | 60 GHz | 2012 / 2021 |

### Wi-Fi security
| Spec | Notes |
|------|-------|
| WEP | Broken |
| WPA / WPA2 | TKIP / AES-CCMP |
| WPA3 | SAE (Dragonfly), 192-bit suite, OWE for open |
| EAP types | TLS, TTLS, PEAP, FAST, AKA' |

## Bluetooth
| Spec | Notes |
|------|-------|
| Core 4.0 | Introduced BLE |
| Core 4.2 | LE Secure Connections |
| Core 5.0 | Long range, 2M PHY |
| Core 5.1 | Direction finding (AoA/AoD) |
| Core 5.2 | LE Audio, LC3, Isochronous channels |
| Core 5.3 / 5.4 | Periodic adv enhancements, channel sounding work |
| Core 6.0 | Channel sounding (2024+) |
| Mesh 1.1 | BT mesh stack |

## Cellular (3GPP)
| Generation | Releases |
|------------|----------|
| 2G GSM/GPRS/EDGE | (pre-3GPP / Rel-99) |
| 3G UMTS / HSPA / HSPA+ | Rel-99 → Rel-7 |
| 4G LTE / LTE-A | Rel-8 → Rel-14 |
| 5G NR (NSA / SA) | Rel-15 → present |
| 5G-Advanced | Rel-18 → 20 |
| 6G research | post-Rel-20 |

## LPWAN / IoT
| Protocol | Owner | Notes |
|----------|-------|-------|
| LoRaWAN | LoRa Alliance | Long-range ISM, ABP/OTAA |
| Sigfox | Sigfox | UNB |
| NB-IoT | 3GPP | Licensed-cellular IoT |
| LTE-M (Cat-M1) | 3GPP | Higher BW IoT |
| Zigbee 3.0 | CSA | 802.15.4 mesh |
| Z-Wave | Silicon Labs | Home automation |
| Thread | Thread Group | IPv6 mesh (802.15.4) |
| Matter | CSA | App-layer over Thread/Wi-Fi/Eth |

## RFID / NFC
| Standard | Notes |
|----------|-------|
| ISO/IEC 18000 series | RFID air interfaces |
| ISO/IEC 14443 (A/B) | HF contactless (MIFARE) |
| ISO/IEC 15693 | HF vicinity cards |
| ISO/IEC 18092 (NFCIP-1) | NFC |
| EPC Gen2 (ISO 18000-6C) | UHF supply chain |

## GNSS
| System | Owner | Bands |
|--------|-------|-------|
| GPS | USA | L1/L2/L5 |
| GLONASS | Russia | L1/L2/L3 |
| Galileo | EU | E1/E5a/E5b/E6 |
| BeiDou | China | B1/B2/B3 |
| QZSS | Japan | L1/L2/L5 + LEX |
| IRNSS / NavIC | India | L5/S |

## Broadcast
| Protocol | Notes |
|----------|-------|
| AM / FM | Analog broadcast |
| HD Radio | iBiquity, US |
| DAB / DAB+ | Eureka 147 |
| DVB-T / T2 | Terrestrial digital TV |
| DVB-S / S2 / S2X | Satellite |
| ATSC 1.0 / 3.0 | US DTV |
| RDS / RBDS | FM data subcarrier |

## Amateur digital
| Mode | Notes |
|------|-------|
| FT8 / FT4 | WSJT-X weak-signal |
| PSK31 | Live keyboard chat |
| Packet (AX.25) | TNCs / KISS |
| APRS | Position reporting |
| D-STAR, DMR, Yaesu Fusion (C4FM), M17 | Digital voice |
| Winlink | HF email via PACTOR / VARA |

## Identifier / framing standards
- **EUI-48 / EUI-64** — MAC addresses (also used by BLE, LoRa devEUI, etc.)
- **ICCID, IMSI, IMEI** — cellular identifiers
- **MMSI** — maritime AIS
- **ICAO 24-bit address** — ADS-B

## Spectrum allocation
- **ITU-R Radio Regulations** — global
- **FCC OET Frequency Allocation Table** — USA
- **CEPT ERC Report 25** — Europe
