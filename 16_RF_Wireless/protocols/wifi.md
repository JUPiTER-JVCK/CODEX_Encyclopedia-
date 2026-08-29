---
title: "Wi-Fi — 802.11 Protocol"
layer: 16_RF_Wireless
section: protocols
tags: [protocol, wifi, 802.11, wpa3, ofdm, mimo, roaming, mesh]
updated: 2026-05-21
---

# Wi-Fi — 802.11 Protocol

---

## Overview

IEEE 802.11 is the family of standards for Wireless LAN (WLAN). Devices
communicate over the 2.4 GHz, 5 GHz, or 6 GHz ISM bands using OFDM
(Orthogonal Frequency-Division Multiplexing) modulation.

```
  802.11 Evolution:
  ┌──────────┬──────┬───────────┬────────────┬────────────────────────┐
  │ Standard │ Year │ Bands     │ Max rate   │ Key features           │
  ├──────────┼──────┼───────────┼────────────┼────────────────────────┤
  │ 802.11b  │ 1999 │ 2.4 GHz   │ 11 Mbps    │ DSSS, first popular   │
  │ 802.11g  │ 2003 │ 2.4 GHz   │ 54 Mbps    │ OFDM                  │
  │ 802.11n  │ 2009 │ 2.4/5 GHz │ 600 Mbps   │ MIMO, 40 MHz ch.      │
  │ 802.11ac │ 2013 │ 5 GHz     │ 6.9 Gbps   │ MU-MIMO, 80/160 MHz   │
  │ 802.11ax │ 2019 │ 2.4/5/6   │ 9.6 Gbps   │ Wi-Fi 6, OFDMA, BSS  │
  │ (Wi-Fi 6)│      │ GHz       │            │ coloring, TWT         │
  │ 802.11be │ 2024 │ 2.4/5/6   │ 46 Gbps    │ Wi-Fi 7, MLO,         │
  │ (Wi-Fi 7)│      │ GHz       │            │ 320 MHz channels      │
  └──────────┴──────┴───────────┴────────────┴────────────────────────┘
```

---

## Frame Types

### Management Frames

| Subtype | Purpose |
|---------|---------|
| Beacon | AP broadcasts SSID, capabilities, timing (every ~102ms) |
| Probe Request/Response | Client discovers nearby APs |
| Authentication | Open system or SAE (WPA3) auth handshake |
| Association Request/Response | Client joins BSS, gets AID |
| Disassociation / Deauthentication | Terminate membership |
| Action | Wide variety: block ACK, spectrum management, etc. |

### Data Frames

Normal data frames carry LLC/SNAP-encapsulated Ethernet payloads.
QoS Data frames add a 2-byte QoS control field for traffic prioritization.

### Control Frames

RTS/CTS, ACK, Block ACK — coordinate medium access.

---

## OFDM and Channel Structure

```
  2.4 GHz channel layout (20 MHz channels):
  
  Ch 1    Ch 2    Ch 3    Ch 4    Ch 5    Ch 6  ...  Ch 11
  ┌───┐   ┌───┐   ┌───┐   ┌───┐   ┌───┐   ┌───┐     ┌───┐
  │   │   │   │   │   │   │   │   │   │   │   │     │   │
  └───┘   └───┘   └───┘   └───┘   └───┘   └───┘     └───┘
  Non-overlapping: 1, 6, 11 (5 MHz spacing, 20 MHz width)
  
  5 GHz U-NII bands: 36, 40, 44, 48 (UNII-1), 52-64 (UNII-2A),
                     100-144 (UNII-2C), 149-177 (UNII-3)
  80 MHz channels: 36+40+44+48 bonded together
  160 MHz channels: two 80 MHz blocks bonded
```

---

## Security: WPA2 and WPA3

### WPA2-Personal (PSK)

```
  PMK derivation from passphrase:
  PMK = PBKDF2(passphrase, SSID, 4096 iterations, 256-bit output)
  
  4-Way Handshake:
  AP                                Client
   │                                    │
   │──── EAPOL-Key (ANonce) ───────────▸│
   │                                    │ PTK = PRF(PMK, ANonce, SNonce,
   │◂─── EAPOL-Key (SNonce, MIC) ───────│          AP_MAC, Client_MAC)
   │                                    │
   │──── EAPOL-Key (GTK, MIC) ─────────▸│
   │                                    │
   │◂─── EAPOL-Key (ACK) ───────────────│
   │══════════ Encrypted data ══════════│
```

### WPA3-Personal (SAE — Simultaneous Authentication of Equals)

- Dragonfly handshake: both parties prove knowledge of password without
  transmitting anything that could be used offline to crack the password.
- Forward secrecy: each session derives a unique PMK even if the password
  is later compromised.
- Prevents KRACK and PMKID offline dictionary attacks.

### WPA3-Enterprise

- 192-bit cryptographic suite (GCMP-256, BIP-GMAC-256)
- 802.1X with EAP (PEAP, EAP-TLS)
- Certificate-based mutual authentication

---

## Roaming (802.11r/k/v)

| Standard | Purpose |
|----------|---------|
| 802.11r | Fast BSS Transition (FT) — pre-authenticate with next AP |
| 802.11k | Neighbor reports — AP tells client about nearby APs |
| 802.11v | BSS Transition Management — AP can suggest roaming |

```
  Without FT (802.11r):         With 802.11r:
  Disassociate old AP           Pre-auth with target AP
  Scan/Probe new AP             ─────────────────────────
  Auth new AP                   Disassociate old AP
  Associate new AP              Associate new AP (< 50ms)
  4-Way Handshake               (skips full handshake)
  ~300-500ms roam gap           ~50ms roam gap
```

---

## Wi-Fi 6 Key Features (802.11ax)

### OFDMA — Orthogonal Frequency-Division Multiple Access

Multiple clients share a single OFDM symbol by using different
sub-carriers (Resource Units). Reduces latency in dense environments.

### BSS Coloring

Adds a 6-bit color code to frames. APs with different colors can
transmit simultaneously without interference (spatial reuse).

### Target Wake Time (TWT)

Devices negotiate specific wake schedules with the AP. IoT devices
sleep almost continuously, only waking to exchange frames — dramatically
extends battery life.

---

## Mesh Networking (802.11s)

```
  Wi-Fi Mesh topology:
  
  Internet
     │
  ┌──▼──┐
  │ GW  │ Gateway node (has WAN)
  └──┬──┘
     │ wireless backhaul
  ┌──▼──┐       ┌─────┐
  │ AP1 ├───────▶ AP2 │  Mesh nodes auto-select
  └──┬──┘       └──┬──┘  best path via HWMP
     │             │       (Hybrid Wireless Mesh Protocol)
  Clients       Clients
```

---

## Key Terms

| Term | Definition |
|------|-----------|
| BSS | Basic Service Set — one AP + associated clients |
| BSSID | MAC address of the AP (uniquely identifies a BSS) |
| SSID | Human-readable network name (up to 32 bytes) |
| IBSS | Independent BSS — ad-hoc, no AP |
| ESS | Extended Service Set — multiple APs, same SSID |
| RSSI | Received Signal Strength Indicator (in dBm) |
| MCS | Modulation and Coding Scheme — indexes rate table |
| MIMO | Multiple Input Multiple Output — spatial multiplexing |
| MU-MIMO | Multi-User MIMO — serves multiple clients simultaneously |
| OFDMA | OFDM Multiple Access — Wi-Fi 6 resource unit scheduling |

---

## See Also

- RF lab exercises → [../lessons/rf_labs.md](../lessons/rf_labs.md)
- RF tools (iw, airmon-ng) → [../man_pages/rf_tools.md](../man_pages/rf_tools.md)
- Network security → [../../14_Security/lessons/security_labs.md](../../14_Security/lessons/security_labs.md)
