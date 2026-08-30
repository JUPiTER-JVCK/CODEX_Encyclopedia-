---
title: "Network Physical Layer — Interactive Labs"
layer: 09_Network_Physical
section: lessons
tags: [lesson, network, physical, cable, ethtool, wifi, lab, quiz, hands-on]
updated: 2026-05-21
---

# Network Physical Layer — Interactive Labs

---

## Module 1: Cable Testing & Identification

### Objective

Identify cable types, use a cable tester to verify continuity and
pin mapping, and understand Cat5e/Cat6/Cat6a differences.

### Prerequisites

- Network cable tester (basic or Fluke-style)
- Cat5e and Cat6 patch cables, RJ45 crimper (optional)
- Ethernet switch with link LEDs

### Lab Steps

1. Identify cables by markings: look for "Cat5e", "Cat6", "Cat6a" printed on sheath
2. Test continuity with cable tester — verify all 8 wires pass
3. Check wiring standard (T568A vs T568B):

```
  T568B (most common):               Pin assignments:
  Pin 1: White/Orange                 Pair 2: Pins 1,2 (TX on 100M)
  Pin 2: Orange                       Pair 3: Pins 3,6 (RX on 100M)
  Pin 3: White/Green                  Pair 1: Pins 4,5
  Pin 4: Blue                         Pair 4: Pins 7,8
  Pin 5: White/Blue                   
  Pin 6: Green                        Gigabit uses ALL 4 pairs
  Pin 7: White/Brown                  bidirectionally
  Pin 8: Brown
```

4. Test link speed: connect cable between two devices, check negotiated speed

### Knowledge Check

**Q1**: What is the maximum length for a Cat6 Ethernet run?

> **A1**: 100 meters (328 feet) for 1 Gbps. For 10 Gbps (10GBASE-T),
> Cat6 is limited to 55 meters; Cat6a supports full 100 meters at 10G.

**Q2**: What is a crossover cable and when is it needed?

> **A2**: A crossover cable swaps TX and RX pairs (pins 1,2 ↔ 3,6).
> Modern NICs have Auto-MDI/MDIX and auto-detect, making crossover
> cables largely unnecessary today.

---

## Module 2: ethtool Interface Diagnostics

### Objective

Use `ethtool` to inspect link speed, duplex, driver info, and optical
transceiver diagnostics.

### Lab Steps

1. Check link status:
```bash
ethtool eth0
# Settings for eth0:
#   Speed: 1000Mb/s
#   Duplex: Full
#   Auto-negotiation: on
#   Link detected: yes
```

2. Check driver and firmware:
```bash
ethtool -i eth0
# driver: igc
# version: 6.8.0-41-generic
# firmware-version: 3.25
```

3. View NIC statistics:
```bash
ethtool -S eth0 | grep -E 'rx_errors|tx_errors|crc'
```

4. Force speed/duplex (troubleshooting):
```bash
sudo ethtool -s eth0 speed 100 duplex full autoneg off
```

### Knowledge Check

**Q1**: What does "duplex mismatch" cause?

> **A1**: One end at full-duplex, other at half-duplex. Results in late
> collisions, CRC errors, and severely degraded throughput (often 10-30%
> of expected). Fix by ensuring both ends auto-negotiate or match settings.

---

## Module 3: Wi-Fi Signal Survey

### Objective

Survey Wi-Fi signal strength, channel usage, and interference using
command-line tools.

### Lab Steps

1. Scan available networks:
```bash
# Linux
sudo iw dev wlan0 scan | grep -E 'SSID|signal|freq'

# macOS
/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -s
```

2. Monitor signal strength:
```bash
# Linux TUI
wavemon

# Continuous watch
watch -n 1 'iw dev wlan0 link'
```

3. Identify channel congestion — look for overlapping channels in 2.4 GHz:

```
  2.4 GHz channels (20 MHz width):
  Ch 1   Ch 6   Ch 11     ← non-overlapping
  ╔═══╗  ╔═══╗  ╔═══╗
  ║   ║  ║   ║  ║   ║
  2412  2437  2462 MHz
  
  5 GHz: many non-overlapping channels (36-165)
  6 GHz (Wi-Fi 6E): 59 additional 20 MHz channels
```

### Review Flashcards

| Term | Definition |
|------|-----------|
| Cat5e | Up to 1 Gbps, 100m, 100 MHz bandwidth |
| Cat6 | Up to 10 Gbps (55m), 250 MHz bandwidth |
| Cat6a | Up to 10 Gbps (100m), 500 MHz bandwidth |
| Auto-MDI/MDIX | Auto-detects straight/crossover, swaps internally |
| SFP/SFP+ | Small Form-factor Pluggable transceiver (1G/10G) |
| PoE | Power over Ethernet — up to 90W (802.3bt) |
| RSSI | Received Signal Strength Indicator (dBm) |
| SNR | Signal-to-Noise Ratio (higher = better) |

### Challenge

> Create a Wi-Fi heatmap of your home/office. Walk around with a laptop
> running `iw dev wlan0 link` every few meters. Record RSSI values,
> plot them on a floor plan. Identify dead spots and optimal AP placement.

---

## Cross-links

- Data link labs → [../../10_Network_DataLink/lessons/datalink_labs.md](../../10_Network_DataLink/lessons/datalink_labs.md)
- RF wireless tools → [../../../16_RF_Wireless/man_pages/rf_tools.md](../../../16_RF_Wireless/man_pages/rf_tools.md)
