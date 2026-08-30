# 09 — Network Physical (OSI L1)

> Bits on the medium. Copper twisted pair, fiber strands, coax, RF in the air.
> Modulation, line coding, signal levels, connectors, distance limits.

## At a glance

| Field | Value |
|-------|-------|
| OSI layer | 1 (Physical) |
| Description | Encoding bits onto a physical medium |
| Protocols | 802.3 PHY (Ethernet), 802.11 PHY (Wi-Fi), DOCSIS, GPON, SONET/SDH |
| Medium | Copper (Cat5e/6/6a/7/8), MMF/SMF fiber, coax, free-space RF/optics |
| Example | NIC encodes bits onto Cat6 with 1000BASE-T 4D-PAM5 |
| Adjacent | ↓ [01_Circuit_Board](../../01_Circuit_Board/), ↑ [10_Network_DataLink](../10_Network_DataLink/) |

## What lives here

- **Wired** — 10/100/1000/2.5G/5G/10G/25G/40G/100G/400G/800G Ethernet PHYs
- **Fiber** — SR/LR/ER/ZR optics, transceiver form factors (SFP/SFP+/QSFP/OSFP)
- **Wireless** — see [16_RF_Wireless](../../16_RF_Wireless/) for RF specifics
- **Access tech** — DSL, DOCSIS (cable), GPON / XGS-PON / 10G-EPON, 5G NR PHY
- **Backbone** — SONET/SDH, OTN, DWDM
- **Encoding / modulation** — Manchester, 4B/5B, 8B/10B, 64B/66B, PAM4, QAM, OFDM

## Sub-sections

- [references/](references/INDEX.md) — IEEE 802 standards, ITU-T G-series
- [lessons/](lessons/INDEX.md) — cable test, fiber inspection, spectrum basics
- [languages/](languages/INDEX.md) — not really a language layer
- [man_pages/](man_pages/INDEX.md) — `ethtool`, `iwlist`, `iperf3`
- [topics/](topics/INDEX.md) — cabling, modulation, PMD/PCS, autoneg
- [protocols/](protocols/INDEX.md) — PHY standards table

## Cross-references
- Wire-level RF / antennas → [16_RF_Wireless](../../16_RF_Wireless/)
- MAC/Ethernet framing → [10_Network_DataLink](../10_Network_DataLink/)
- NIC drivers → [04_Device_Drivers](../../04_Device_Drivers/)
