---
title: "RF & Wireless — Interactive Labs"
layer: 16_RF_Wireless
section: lessons
tags: [lesson, rf, sdr, wifi, bluetooth, lora, lab, quiz, hands-on]
updated: 2026-05-21
---

# RF & Wireless — Interactive Labs

---

## Module 1: SDR FM Radio Receiver

### Objective

Use an RTL-SDR dongle with GNU Radio to receive and demodulate FM
broadcast radio, understanding the baseband signal processing chain.

### Prerequisites

- RTL-SDR USB dongle (RTL2832U chipset)
- GNU Radio 3.10+ installed
- Antenna (even a short wire helps)

### Lab Steps

1. Verify SDR is detected:
```bash
rtl_test -t
# Found 1 device(s):
#   0:  Generic RTL2832U, Serial: 00000001
# Supported gain values (29): 0.0 1.0 1.5 ...
```

2. Record raw IQ samples:
```bash
# Tune to an FM station at 98.5 MHz, sample at 2 MSPS for 10 seconds
rtl_sdr -f 98.5e6 -s 2e6 -n 20000000 fm_capture.bin
# -f = center frequency (Hz)
# -s = sample rate (samples/second)
# -n = number of samples
```

3. Demodulate with rtl_fm:
```bash
# Pipe directly to audio playback (requires sox)
rtl_fm -f 98.5e6 -M wbfm -s 200000 -r 48000 - | aplay -r 48000 -f S16_LE
# -M wbfm = wide-band FM demodulation
# -s 200000 = 200 kHz bandwidth (FM station bandwidth)
# -r 48000 = resample to 48 kHz audio
```

4. GNU Radio flowgraph for FM (Python/GRC):
```python
# Equivalent signal processing chain:
# RTL-SDR Source (2 MSPS, complex float)
#   → Low Pass Filter (cutoff 100 kHz, to select one FM station)
#   → WBFM Receive (audio demodulation)
#   → Rational Resampler (200k → 48k)
#   → Audio Sink (48 kHz)
```

5. Visualize spectrum with gqrx or GNU Radio:
```bash
# Install gqrx (GUI spectrum analyzer + FM receiver)
sudo apt install gqrx-sdr
gqrx
# Set input: RTL-SDR, sample rate 2 MSPS
# Tune to FM band (87.5–108 MHz)
# Observe: FM stations appear as tall peaks ~200 kHz wide
```

```
  FM broadcast signal structure (200 kHz channel):
  
  ─────────────────────────────────────────────────────────
  │ Pilot 19 kHz │ L+R audio │ L-R (38 kHz DSB) │ RDS │
  ─────────────────────────────────────────────────────────
  0             19k          38k                 57k    76k Hz
  
  WBFM demodulator:
  IQ samples → Quadrature Demodulator → Emphasis Filter → Audio
```

### Knowledge Check

**Q1**: What is IQ data and why does SDR use complex samples?

> **A1**: IQ (In-phase/Quadrature) samples represent a signal as a complex
> number: I = real part (cosine component), Q = imaginary part (sine
> component). Complex sampling captures both amplitude and phase, enabling
> the receiver to distinguish signals above AND below the center frequency,
> effectively doubling usable bandwidth vs a real-valued sample.

**Q2**: What is the Nyquist sampling theorem's role in SDR?

> **A2**: Nyquist states you must sample at ≥ 2× the signal bandwidth to
> reconstruct it without aliasing. For a 2 MSPS sample rate, you can
> capture signals with up to 2 MHz bandwidth. A 200 kHz FM station fits
> easily within this window and can be extracted with a low-pass filter.

---

## Module 2: Wi-Fi Packet Capture

### Objective

Capture 802.11 management frames in monitor mode, decode beacon frames,
and understand the Wi-Fi association process.

### Lab Steps

1. Enable monitor mode:
```bash
sudo ip link set wlan0 down
sudo iw dev wlan0 set type monitor
sudo ip link set wlan0 up
iw dev wlan0 info | grep type  # should show "monitor"

# Or using airmon-ng:
sudo airmon-ng start wlan0
# Creates wlan0mon interface
```

2. Capture beacon frames:
```bash
sudo tcpdump -i wlan0mon -w beacons.pcap 'type mgt subtype beacon'
# Wait 10 seconds, then Ctrl-C
# Beacons are broadcast every ~102ms by each AP
```

3. Parse beacon content:
```bash
# Read with tcpdump
sudo tcpdump -r beacons.pcap -v 2>/dev/null | head -40
# Shows: BSSID, SSID, capabilities, supported rates, channel

# Or with tshark (Wireshark CLI):
tshark -r beacons.pcap -T fields \
  -e wlan.sa \
  -e wlan_mgt.ssid \
  -e wlan_mgt.ds.current_channel \
  -e wlan_mgt.rsn.version \
  2>/dev/null | sort -u | head -20
```

4. Watch the association process:
```bash
# Capture all management frames (auth, assoc req/resp, deauth)
sudo tcpdump -i wlan0mon -w assoc.pcap 'type mgt'
# Connect a device to Wi-Fi while capturing
# Then analyze:
tshark -r assoc.pcap -T fields -e frame.time_relative \
  -e wlan.fc.type_subtype -e wlan.sa -e wlan.da 2>/dev/null
```

```
  802.11 Association flow:
  Client                    AP (BSSID)
    │                          │
    │◂── Beacon (SSID, caps) ──│  every ~102ms
    │                          │
    │─── Probe Request ───────▸│  (optional)
    │◂── Probe Response ───────│
    │                          │
    │─── Auth Request ────────▸│
    │◂── Auth Response ────────│
    │                          │
    │─── Association Request ─▸│  (SSID, RSN info)
    │◂── Association Response ─│  (AID assigned)
    │                          │
    │══ 4-way EAPOL Handshake ═│  (WPA2/3 key derivation)
    │══════ DATA TRANSFER ═════│
```

### Knowledge Check

**Q1**: What is the 4-way handshake in WPA2 and what does it accomplish?

> **A1**: The 4-way handshake derives the Pairwise Transient Key (PTK) used
> to encrypt unicast traffic. Both sides contribute random nonces (ANonce,
> SNonce) to derive the PTK from the Pairwise Master Key (PMK). This
> ensures the PTK is unique per session (forward secrecy) even if the
> passphrase never changes.

---

## Module 3: Bluetooth Scan and LoRa Hello

### Objective

Scan BLE advertisements, decode device information, and transmit a
basic LoRa packet.

### Lab Steps

1. BLE passive scan:
```bash
sudo hciconfig hci0 up
sudo btmgmt power on

# Scan for LE devices
sudo btmgmt find --le --passive
# or
sudo hcitool lescan --passive
# Outputs: MAC address, device name, RSSI

# Continuous scan with bluetoothctl:
bluetoothctl
[bluetooth]# scan on
[bluetooth]# devices
```

2. Read BLE advertisement data:
```bash
# Using blesuite or bleak (Python):
pip install bleak

python3 - << 'EOF'
import asyncio
from bleak import BleakScanner

async def scan():
    devices = await BleakScanner.discover(timeout=5.0, return_adv=True)
    for addr, (device, adv) in devices.items():
        print(f"{addr}: {device.name or 'Unknown'}")
        print(f"  RSSI: {adv.rssi} dBm")
        print(f"  Services: {adv.service_uuids}")
        if adv.manufacturer_data:
            print(f"  Manufacturer: {dict(adv.manufacturer_data)}")

asyncio.run(scan())
EOF
```

3. LoRa hello world (MicroPython on ESP32 + SX1276):
```python
# MicroPython on ESP32 with SX1276 LoRa module
from machine import SPI, Pin
from sx1276 import SX1276  # Community MicroPython driver

spi = SPI(1, baudrate=5000000, sck=Pin(18), mosi=Pin(23), miso=Pin(19))
lora = SX1276(spi,
              cs=Pin(5),
              reset=Pin(14),
              dio0=Pin(26),
              freq=915.0,      # 915 MHz (US); use 868.1 for EU
              spreading_factor=7,
              bandwidth=125000,
              coding_rate=5,
              preamble=8,
              tx_power=17)

lora.init()

# Transmit
lora.send(b"Hello LoRa!")
print("Sent: Hello LoRa!")

# Receive (blocking, 5 second timeout)
data = lora.receive(timeout=5000)
if data:
    print(f"Received: {data}")
```

4. LoRa link budget calculation:
```
  Link budget example (LoRaWAN Class A):
  ┌──────────────────────────────────────────────────┐
  │ TX power:          +20 dBm  (100 mW)             │
  │ TX antenna gain:   +2  dBi                       │
  │ Cable/connector:   -1  dB                        │
  │ Free space path:   -140 dB  (10 km, 915 MHz)     │
  │ RX antenna gain:   +2  dBi                       │
  │ RX sensitivity:    -137 dBm (SF12, 125 kHz BW)   │
  │ ─────────────────────────────────────────────    │
  │ Received signal:   -117 dBm                      │
  │ Sensitivity:       -137 dBm                      │
  │ Link margin:       +20 dB  ✓ (viable)            │
  └──────────────────────────────────────────────────┘
```

### Review Flashcards

| Term | Definition |
|------|-----------|
| IQ data | Complex samples (I=real, Q=imaginary) capturing phase+amplitude |
| SDR | Software Defined Radio — hardware converts RF to IQ; software does rest |
| Monitor mode | 802.11 NIC captures all frames, not just its own BSS |
| Beacon frame | AP broadcast (every ~102ms) announcing SSID, capabilities |
| BLE | Bluetooth Low Energy — 2.4 GHz, low power, advertisement model |
| GATT | Generic Attribute Profile — BLE service/characteristic structure |
| LoRa | Long Range radio modulation (CSS) — km range, very low bitrate |
| LoRaWAN | LoRa MAC layer — class A/B/C, OTAA/ABP, regional bands |
| Spreading factor | LoRa: higher SF = longer range, lower bitrate, more airtime |
| Link budget | Sum of gains/losses — determines if link is viable |

### Challenge

> Build a complete SDR-based weather satellite image receiver. Use
> an RTL-SDR with a V-dipole antenna, tune to NOAA-18 at 137.9125 MHz,
> capture the APT signal as it passes overhead (find the pass time with
> `predict` or heavens-above.com), and decode the image with WXtoImg
> or noaa-apt. Document the signal quality and resulting image.

---

## Cross-links

- RF tools → [../man_pages/rf_tools.md](../man_pages/rf_tools.md)
- Wi-Fi protocol → [../protocols/wifi.md](../protocols/wifi.md)
- Bluetooth protocol → [../protocols/bluetooth.md](../protocols/bluetooth.md)
- LoRaWAN protocol → [../protocols/lorawan.md](../protocols/lorawan.md)
