# 16 — RF / Wireless (Cross-cutting)

> Everything that travels through air or vacuum on an electromagnetic carrier:
> Wi-Fi, Bluetooth, cellular, satellite, RFID, NFC, AM/FM, HF/VHF/UHF radio.
> Hardware lives at L1; the protocols intersect L1–L3 of the network stack.

## At a glance

| Field | Value |
|-------|-------|
| Spans | 01 (RF front-end hardware), 09 (PHY), 10 (Wi-Fi MAC) |
| Description | Electromagnetic communication and signaling |
| Languages | GNU Radio (Python/C++), MATLAB, VHDL/Verilog (SDR FPGAs) |
| Subdomains | Wi-Fi, Bluetooth/BLE, cellular, GNSS, satellite, ISM, amateur, mmWave |

## What lives here

- **Wi-Fi** — 2.4 / 5 / 6 / 60 GHz; 802.11 PHY/MAC; WPA2/3
- **Bluetooth Classic + BLE** — 4.x / 5.x / 6.0; mesh; LE Audio (Auracast)
- **Cellular** — 2G/3G/4G/5G (and looking at 6G research); private 5G/LTE
- **GNSS** — GPS, GLONASS, Galileo, BeiDou
- **Satellite** — VSAT, Iridium, Starlink/OneWeb LEO
- **ISM bands** — 433/868/915 MHz; 2.4/5 GHz unlicensed
- **LPWAN** — LoRa/LoRaWAN, Sigfox, NB-IoT, LTE-M
- **RFID / NFC** — LF 125 kHz, HF 13.56 MHz, UHF 860–960 MHz
- **Broadcast** — AM/FM, DAB+, DVB-T/T2, ATSC 1.0/3.0
- **Amateur radio** — HF/VHF/UHF; SSB, CW, FT8, packet, APRS, DMR/D-STAR/Fusion/M17
- **SDR** — RTL-SDR, HackRF, BladeRF, LimeSDR, USRP, Pluto
- **mmWave / 60 GHz**, **THz research**, **free-space optics**

## Sub-sections

- [references/](references/INDEX.md) — Ham radio handbooks, RF textbooks, 3GPP docs
- [lessons/](lessons/INDEX.md) — SDR setup → Wi-Fi capture → LoRa lab
- [languages/](languages/INDEX.md) — GNU Radio, MATLAB, HDLs for SDR
- [man_pages/](man_pages/INDEX.md) — `gqrx`, `rtl_*`, `hackrf_*`, `gnuradio-companion`
- [topics/](topics/INDEX.md) — modulation, channels, antennas, propagation, regs
- [protocols/](protocols/INDEX.md) — wireless protocols & specs

## Cross-references
- PHY-layer concerns shared with → [09_Network_Physical](../Network/09_Network_Physical/)
- Wi-Fi MAC framing → [10_Network_DataLink](../Network/10_Network_DataLink/)
- Antenna PCBs / RF front-ends → [01_Circuit_Board](../01_Circuit_Board/)
- Wireless attacks (deauth, BLE spoofing, replay) → [14_Security/topics](../14_Security/topics/INDEX.md)
