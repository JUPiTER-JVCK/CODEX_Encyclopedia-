
## Dedicated Lesson Modules

| File | Covers |
|------|--------|
| [RF & Wireless — Interactive Labs](./rf_labs.md) | SDR FM, Wi-Fi capture, Bluetooth scan, LoRa hello |

# RF / Wireless — Lessons

## SDR fundamentals
1. **SDR starter kit** — RTL-SDR + antenna; install `gqrx`/`SDR++`; tune FM band.
2. **GNU Radio Companion (GRC)** — build "tune → demodulate → audio sink" flowgraph.
3. **IQ basics** — what complex baseband means; visualize in time/freq/IQ plots.
4. **Modulation tour** — receive AM, FM, SSB, CW, PSK31, FT8 in turn.
5. **Decode ADS-B (1090 MHz)** — `dump1090`; visualize aircraft on a map.
6. **POCSAG / FLEX paging** — `multimon-ng` (where legal to monitor).
7. **AIS (ship transponders)** — `rtl_ais`; OpenCPN integration.

## Wi-Fi
8. **Monitor mode + capture** — `iw dev wlanX set type monitor`; tcpdump beacons.
9. **WPA handshake capture** — `hcxdumptool` + `hcxpcapngtool` (lawful network only).
10. **PMKID extraction** — concept walkthrough.
11. **Channel sweep** — `wavemon`, `kismet` heatmap.

## Bluetooth / BLE
12. **BLE scan** — `bluetoothctl`, `bettercap` BLE module.
13. **GATT explore** — `nrfconnect` on phone; read characteristics of a fitness sensor.
14. **Audio (Auracast)** — Bluetooth LE Audio basics.

## LoRa / LPWAN
15. **LoRa point-to-point** — two RFM95 modules on Arduinos / RPi.
16. **TTN (The Things Network)** — register a node; OTAA join; send a sensor value.

## NFC / RFID
17. **Read MIFARE card** — `nfc-poll`, `mfoc`, `mfcuk` (only your own cards).
18. **Emulate Tag** — Proxmark3 / Flipper Zero hello.

## GNSS
19. **GPS receiver** — u-blox + `gpsd` + `cgps`; sat constellations.
20. **GNSS spoofing/jamming awareness** — defensive only.

## Amateur radio
21. **Get licensed** — Technician → General → Extra (US).
22. **First contact** — VHF FM repeater, then HF SSB, then digital (FT8).
23. **Build a dipole** — 1/2-wave for 20m or 40m; SWR analyzer.
24. **APRS + Packet** — TNC software + Direwolf.

## Cellular
25. **OsmoBTS / SrsRAN / Open5GS lab** — private 4G/5G in a lab, lawful & RF-shielded.
26. **IMSI catchers — concept only** — understand detection, never deploy on open air.

## RF safety / regs
27. **Read ITU & FCC band plans** for your region.
28. **Antenna safety** — power density, height, lightning protection.
