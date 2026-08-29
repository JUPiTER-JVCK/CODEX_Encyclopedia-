# RF / Wireless — Manual Pages / Tools

## Dedicated man page references

| Topic | File |
|-------|------|
| RF & wireless tools | [rf_tools.md](rf_tools.md) — gnuradio, hackrf, rtl_sdr, kismet, bluetoothctl |

---

## SDR receivers (GUI + CLI)
| Tool | Purpose |
|------|---------|
| `gqrx` | Popular Qt SDR receiver |
| `SDR++` | Modern cross-platform receiver |
| `SDRangel` | Multi-receiver, multi-protocol |
| `cubicsdr` | Simple cross-platform |
| `gnuradio-companion` (`grc`) | Visual flowgraph editor |
| `osmocom_fft` | Quick spectrum view |

## RTL-SDR utilities
| Command | Purpose |
|---------|---------|
| `rtl_fm` | FM/AM/SSB demod |
| `rtl_tcp` | Stream IQ over network |
| `rtl_test` | Sample-rate / gain tests |
| `rtl_power` | Spectrum scan / heatmap |
| `rtl_433` | Decode 433 MHz ISM (weather sensors, doorbells) |
| `rtl_ais` | AIS marine receiver |
| `dump1090` | ADS-B aircraft |

## HackRF
| Command | Purpose |
|---------|---------|
| `hackrf_info` | Device info |
| `hackrf_transfer -r out.iq -f 100e6` | Capture IQ |
| `hackrf_sweep` | Spectrum sweep |
| `hackrf_spiflash` | Firmware mgmt |

## BladeRF / LimeSDR / USRP
| Command | Purpose |
|---------|---------|
| `bladeRF-cli` | BladeRF interactive tool |
| `LimeSuite`, `LimeUtil` | LimeSDR |
| `uhd_find_devices`, `uhd_usrp_probe` | USRP devices |
| `rx_samples_to_file` | USRP IQ capture |

## Wi-Fi
| Command | Purpose |
|---------|---------|
| `iw` | Modern wireless config |
| `iwconfig` (legacy) | Older wireless config |
| `wpa_supplicant` | Client connection |
| `hostapd` | AP daemon |
| `wavemon` | Live signal/quality TUI |
| `kismet` | Sniffer + WIDS |
| `aircrack-ng` suite | `airmon-ng`, `airodump-ng`, `aireplay-ng`, `aircrack-ng` |
| `hcxdumptool`, `hcxpcapngtool` | Modern WPA capture |
| `wifite` | Automated Wi-Fi audit |
| `bettercap` | L2/L7 wireless attacks |

## Bluetooth
| Command | Purpose |
|---------|---------|
| `bluetoothctl` | BlueZ CLI |
| `hciconfig`, `hcitool`, `hcidump` (legacy) | Older BlueZ |
| `btmon` | Modern BlueZ monitor |
| `gatttool`, `bluetoothd` | GATT operations |
| `nrfutil`, `nrf-connect` | Nordic tooling |

## LoRa / LPWAN
| Tool | Purpose |
|------|---------|
| ChirpStack (`chirpstack`) | LoRaWAN NS |
| LoRaServer (legacy) | Predecessor |
| `lora_pkt_fwd` | UDP packet forwarder for gateways |

## RFID / NFC
| Command | Purpose |
|---------|---------|
| `nfc-list`, `nfc-poll`, `nfc-mfclassic` | libnfc |
| `pm3` (Proxmark client) | Proxmark3 |
| Flipper Zero CLI / app | Hobbyist multi-tool |

## GNSS
| Command | Purpose |
|---------|---------|
| `gpsd` | Daemon |
| `cgps`, `gpsmon` | Clients |
| `ublox-tools` / `u-center` (Windows) | u-blox config |

## Cellular (lab use)
| Tool | Purpose |
|------|---------|
| `srsenb`, `srsue`, `srsepc` | srsRAN suite |
| `osmo-bts`, `osmo-bsc`, etc. | Osmocom |
| `open5gs-mmed`, ... | Open5GS daemons |

## Spectrum & analysis
- `gr_specest`, `inspectrum` (GUI burst inspection), `urh` (Universal Radio Hacker)
