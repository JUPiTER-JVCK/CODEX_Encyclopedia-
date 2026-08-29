---
title: "RF & Wireless Tools Reference"
layer: 16_RF_Wireless
section: man_pages
tags: [gnuradio, hackrf, rtl-sdr, kismet, airmon-ng, sdr, wireless, man-section-1]
updated: 2026-05-21
---

# RF & Wireless Tools Reference

> Practical reference for software-defined radio, Wi-Fi analysis,
> Bluetooth scanning, and RF capture tools.

---

## GNU Radio --- signal processing framework

### Synopsis

```
gnuradio-companion          # GUI flowgraph editor
grcc flowgraph.grc          # compile .grc to Python
python3 flowgraph.py        # run compiled flowgraph
```

### Description

Open-source toolkit for signal processing and SDR. Build radio systems as
flowgraphs connecting signal processing blocks. Supports RTL-SDR, HackRF,
USRP, LimeSDR, BladeRF, and many more.

### Flowgraph architecture

```
  ┌──────────┐    ┌────────────┐    ┌──────────┐    ┌──────────┐
  │  Source   │───▸│  Filter    │───▸│ Demod    │───▸│  Sink    │
  │ (SDR hw) │    │ (low pass) │    │ (FM/AM/  │    │ (audio/  │
  │ or file  │    │ (band pass)│    │  PSK/QAM)│    │  file/   │
  └──────────┘    └────────────┘    └──────────┘    │  network)│
                                                     └──────────┘
  
  Block types:
    Sources:     osmocom_source, file_source, signal_source
    Filters:     low_pass_filter, band_pass_filter, fir_filter
    Resamplers:  rational_resampler, pfb_arb_resampler
    Demod:       wbfm_receive, nbfm_receive, psk_demod, qam_demod
    Sinks:       audio_sink, file_sink, qt_gui_sink, zmq_pub_sink
    Math:        multiply, add, complex_to_mag, fft
```

### Examples

```bash
# Open the visual editor
gnuradio-companion

# Compile and run a flowgraph
grcc my_receiver.grc
python3 my_receiver.py

# FM radio receiver (command line with Python)
python3 -c "
from gnuradio import gr, blocks, analog, audio, osmosdr
# ... build flowgraph programmatically
"
```

---

## hackrf_transfer --- HackRF One capture/transmit

### Synopsis

```
hackrf_transfer -r outfile [-f freq_hz] [-s sample_rate] [-g gain]
hackrf_transfer -t infile [-f freq_hz] [-s sample_rate] [-x tx_gain]
hackrf_info
hackrf_sweep -f start:stop [-w bin_width]
```

### Description

Capture and transmit raw IQ samples with the HackRF One SDR (1 MHz - 6 GHz,
8-bit, 20 MHz bandwidth). Half-duplex: can receive or transmit, not both
simultaneously.

### HackRF specs

```
  Frequency range:   1 MHz — 6 GHz
  Sample rate:       2 — 20 Msps
  Resolution:        8-bit (I/Q)
  Bandwidth:         up to 20 MHz
  Duplex:            half (RX or TX)
  Interface:         USB 2.0 High Speed
  
  File format: raw interleaved 8-bit signed I/Q
    [I0][Q0][I1][Q1][I2][Q2]...
    1 second at 20 Msps = 40 MB
```

### Key Options

| Flag | Purpose |
|------|---------|
| `-r FILE` | Receive (capture to file) |
| `-t FILE` | Transmit (play from file) |
| `-f HZ` | Center frequency |
| `-s HZ` | Sample rate (default 10M) |
| `-g DB` | RX IF gain (0-40, step 8) |
| `-l DB` | RX LNA gain (0-40, step 8) |
| `-x DB` | TX VGA gain (0-47, step 1) |
| `-a 1` | Enable antenna power |
| `-n SAMPLES` | Number of samples to capture |

### Examples

```bash
# Device info
hackrf_info
# Serial number: 0000000000000000abcd
# Firmware Version: 2024.02.1
# Part ID: 0xa000cb3c 0x005f474d

# Capture FM radio (100.1 MHz, 2M samples/sec)
hackrf_transfer -r fm_capture.iq -f 100100000 -s 2000000 -g 20 -l 16

# Spectrum sweep (100 MHz - 1 GHz)
hackrf_sweep -f 100:1000 -w 100000 > sweep.csv

# Transmit a pre-recorded signal
hackrf_transfer -t signal.iq -f 433920000 -s 2000000 -x 30
```

---

## rtl_sdr / rtl_fm --- RTL-SDR tools

### Synopsis

```
rtl_fm [-f freq] [-M mode] [-s sample_rate] [-g gain] [-l squelch] - | play
rtl_power -f start:stop:step [-i interval] [-e duration] outfile.csv
rtl_433 [-f freq] [-R protocol] [-F json]
rtl_test [-t] [-s sample_rate]
```

### Description

Command-line tools for the ubiquitous RTL-SDR dongle ($10-30 USB receiver).
`rtl_fm` demodulates FM/AM/SSB in real time. `rtl_power` does wideband
spectrum scanning. `rtl_433` decodes 200+ ISM-band protocols.

### RTL-SDR specs

```
  Frequency range:   24 MHz — 1.7 GHz (typical)
  Sample rate:       up to 2.4 Msps (stable), 3.2 Msps (max)
  Resolution:        8-bit
  Interface:         USB 2.0
  Cost:              $10-30 (RTL2832U + R820T2)
  
  Limitations:
    - Receive only (no transmit)
    - Limited dynamic range (8-bit ADC)
    - Frequency drift without TCXO
    - No wideband (2.4 MHz max stable)
```

### Examples

```bash
# Listen to FM radio (piped to audio player)
rtl_fm -f 100.1e6 -M wbfm -s 200000 -r 48000 - | aplay -r 48000 -f S16_LE

# Decode ISM sensors (433 MHz weather stations, doorbells, etc.)
rtl_433 -f 433.92e6 -F json
# {"time":"2026-05-21 10:30:00", "model":"Acurite-Tower",
#  "id":12345, "temperature_C":22.5, "humidity":45}

# Spectrum scan (FM band)
rtl_power -f 88M:108M:25k -i 10 -e 1m fm_band.csv

# ADS-B aircraft tracking
dump1090 --interactive
# Hex    Flight   Altitude  Speed   Lat       Lon
# ABCDEF UAL123   35000     450     37.7749   -122.4194

# Test dongle
rtl_test -t
```

---

## kismet --- wireless network detector

### Synopsis

```
kismet [-c source] [--override datasource]
kismet_cap_linux_wifi --source wlan0
```

### Description

Wireless sniffer, network detector, and intrusion detection system. Captures
802.11 (Wi-Fi), Bluetooth, and other wireless protocols. Runs as a server
with a web UI.

### Architecture

```
  Capture sources              Kismet server          Web UI
  ┌────────────────┐          ┌──────────────┐       ┌───────────┐
  │ wlan0 (monitor)│─────────▸│              │       │ Browser   │
  │ hci0 (BT)      │─────────▸│  Detection   │◂─────▸│ :2501     │
  │ rtlsdr         │─────────▸│  Logging     │       │           │
  │ remote cap     │─────────▸│  Alerting    │       │           │
  └────────────────┘          │              │       └───────────┘
                              │  .kismet DB  │
                              └──────────────┘
  
  Output: SQLite database (.kismet) containing:
    - Detected networks (SSIDs, BSSIDs, encryption)
    - Clients and associations
    - GPS coordinates (if GPS connected)
    - Packet captures (optional PCAP)
    - Alerts (rogue AP, deauth flood, etc.)
```

### Examples

```bash
# Start kismet with Wi-Fi source
sudo kismet -c wlan0

# Access web UI
# http://localhost:2501

# Multiple sources
sudo kismet -c wlan0 -c hci0

# Headless / no web UI
sudo kismet -c wlan0 --no-httpd

# Export to PCAP
kismetdb_to_pcap --in results.kismet --out capture.pcap
```

---

## bluetoothctl --- Bluetooth management

### Synopsis

```
bluetoothctl
  power on|off
  scan on|off
  devices
  pair MAC
  connect MAC
  info MAC
  trust MAC
```

### Description

Interactive and scriptable CLI for BlueZ (Linux Bluetooth stack). Manages
adapters, scans for devices, pairs, connects, and queries GATT services.

### Bluetooth discovery flow

```
  bluetoothctl
    │
    ├── power on         Activate adapter
    │
    ├── scan on          Start discovery
    │     │
    │     ├── [NEW] Device AA:BB:CC:DD:EE:FF  "AirPods Pro"
    │     ├── [NEW] Device 11:22:33:44:55:66  "Keyboard"
    │     └── [CHG] Device AA:BB:CC:DD:EE:FF  RSSI: -45
    │
    ├── pair AA:BB:CC:DD:EE:FF
    │     └── PIN or confirmation prompt
    │
    ├── trust AA:BB:CC:DD:EE:FF
    │     └── Auto-connect in future
    │
    └── connect AA:BB:CC:DD:EE:FF
          └── Connected (audio profile, HID, etc.)
```

### Examples

```bash
# Interactive session
bluetoothctl
[bluetooth]# power on
[bluetooth]# scan on
[bluetooth]# pair AA:BB:CC:DD:EE:FF
[bluetooth]# connect AA:BB:CC:DD:EE:FF
[bluetooth]# info AA:BB:CC:DD:EE:FF

# Scripted (non-interactive)
bluetoothctl -- power on
bluetoothctl -- scan on &
sleep 10
bluetoothctl -- devices
bluetoothctl -- connect AA:BB:CC:DD:EE:FF

# Show adapter info
bluetoothctl -- show

# List GATT services
bluetoothctl -- menu gatt
[bluetooth]# list-attributes AA:BB:CC:DD:EE:FF
```

---

## Cross-links

- Wi-Fi security -> [../../14_Security/man_pages/security_tools.md](../../14_Security/man_pages/security_tools.md)
- Network physical layer -> [../../Network/09_Network_Physical/topics/INDEX.md](../../Network/09_Network_Physical/topics/INDEX.md)
- Embedded systems -> [../../18_Embedded_Systems/man_pages/embedded_tools.md](../../18_Embedded_Systems/man_pages/embedded_tools.md)
- Device drivers -> [../../04_Device_Drivers/man_pages/device_commands.md](../../04_Device_Drivers/man_pages/device_commands.md)
