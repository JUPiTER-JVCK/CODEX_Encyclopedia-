---
title: "LoRaWAN — Protocol"
layer: 16_RF_Wireless
section: protocols
tags: [protocol, lorawan, lora, lpwan, iot, otaa, adr, class-a]
updated: 2026-05-21
---

# LoRaWAN — Protocol

---

## Overview

LoRaWAN is a MAC-layer protocol for Low-Power Wide-Area Networks (LPWAN).
It uses LoRa (Chirp Spread Spectrum) as the physical layer. End-devices
communicate with gateways over LoRa; gateways forward to a Network Server
over IP.

```
  LoRaWAN architecture:
  
  [End Device]──LoRa────▶[Gateway 1]──IP──┐
        │                                  ▼
        │ LoRa           ┌──────────────────┐   ┌──────────────┐
        └──────────────▶ │  Network Server  │──▶│ App Server   │
        │                └──────────────────┘   └──────────────┘
        │ LoRa
        └──────────────▶[Gateway 2]──IP──┘
  
  Key: any gateway that receives the frame forwards it.
  Network Server deduplicates and routes to application.
```

---

## Device Classes

| Class | Wake pattern | Downlink latency | Use case |
|-------|-------------|-----------------|----------|
| A | After TX (2 receive windows) | Next uplink | Battery sensors (most common) |
| B | Scheduled beacon slots | Precise schedule | Actuators needing timed delivery |
| C | Always listening | Very low (~1s) | Mains-powered, low-latency control |

### Class A Timing

```
  Class A uplink + 2 receive windows:
  
  ─────[TX]────────────────[RX1]──────────[RX2]──────────────────▶ time
             ↑                  ↑               ↑
          RECEIVE_DELAY1   RECEIVE_DELAY1  RECEIVE_DELAY2
             (1s)            (1s)            (2s)
  
  Network Server responds in RX1 (preferred) or RX2 (fallback).
  RX2 uses a fixed frequency/DR (usually SF12, 869.525 MHz EU).
```

---

## Join Procedures

### OTAA — Over-The-Air Activation (Recommended)

```
  Device                    Network Server
     │                             │
     │──── Join Request ──────────▸│  (DevEUI, JoinEUI, DevNonce)
     │◂─── Join Accept ────────────│  (AppNonce, NetID, DevAddr, DLSettings)
     │                             │
     │  Both derive NwkSKey, AppSKey from secrets + nonces
     │══════ Session established ══│
```

### ABP — Activation By Personalization

Device pre-programmed with DevAddr, NwkSKey, AppSKey. No join procedure.
Less secure (fixed keys, counter restart risk). Used for testing.

---

## Adaptive Data Rate (ADR)

Network server adjusts Spreading Factor and TX power per device based
on observed SNR:

```
  High SNR (good signal) → lower SF → faster, shorter airtime
  Low SNR (poor signal)  → higher SF → slower, more robust

  SF7  → 5.5 kbps  → range ~2 km   (urban)
  SF9  → 1.76 kbps → range ~5 km
  SF12 → 293 bps   → range ~15 km  (rural, LoS)
```

---

## Regional Parameters

| Region | Uplink freq | Max TX | Duty cycle |
|--------|------------|--------|-----------|
| EU868 | 868.1–868.5 MHz | 14 dBm | 1% (regulatory) |
| US915 | 902–928 MHz | 30 dBm | No duty cycle (frequency hopping) |
| AU915 | 915–928 MHz | 30 dBm | No duty cycle |
| AS923 | 923.2–923.4 MHz | 16 dBm | 1% |
| IN865 | 865.1–865.5 MHz | 14 dBm | None |

---

## LoRaWAN Frame Format

```
  LoRaWAN uplink MAC frame:
  ┌────────┬────────┬──────────┬────────┬──────────┬────────────┐
  │MHDR(1B)│DevAddr │FCtrl(1B) │FCnt(2B)│FOpts(≤15)│FPort + Frm │
  │MType+  │(4B)    │ADR,ACK,  │Frame   │MAC cmds  │Payload     │
  │Major   │        │FOptsLen  │counter │(optional)│(encrypted) │
  └────────┴────────┴──────────┴────────┴──────────┴────────────┘
  
  MType values:
  000 = Join Request    100 = Unconfirmed uplink
  001 = Join Accept     101 = Unconfirmed downlink
  010 = (reserved)      110 = Confirmed uplink
  011 = (reserved)      111 = Confirmed downlink
```

---

## Security

- **Network session key (NwkSKey)**: protects MAC layer integrity (MIC)
- **Application session key (AppSKey)**: encrypts application payload (AES-128 CTR)
- Frame counter prevents replay attacks; counter reset (reboot) = security issue
- LoRaWAN 1.1 separates NwkSKey into FNwkSIntKey + SNwkSIntKey + NwkSEncKey

---

## Key Terms

| Term | Definition |
|------|-----------|
| LoRa | Physical layer — Chirp Spread Spectrum modulation |
| LoRaWAN | MAC protocol for LoRa networks (LoRa Alliance specification) |
| SF | Spreading Factor (7–12) — trade-off between rate and range |
| BW | Bandwidth (125/250/500 kHz) — wider = faster, less range |
| CR | Coding Rate (4/5–4/8) — FEC overhead |
| ADR | Adaptive Data Rate — NS tunes SF/power per device |
| OTAA | Over-the-Air Activation — dynamic key exchange per join |
| ABP | Activation By Personalization — static pre-programmed session |
| DevEUI | 64-bit globally unique device identifier |
| JoinEUI | 64-bit join server identifier (was AppEUI in 1.0) |
| NwkSKey | Network session key — integrity protection |
| AppSKey | Application session key — payload encryption |

---

## See Also

- RF lab exercises → [../lessons/rf_labs.md](../lessons/rf_labs.md)
- RF tools → [../man_pages/rf_tools.md](../man_pages/rf_tools.md)
- Industrial MQTT (similar pub/sub pattern) → [../../19_Industrial_Protocols/protocols/INDEX.md](../../19_Industrial_Protocols/protocols/INDEX.md)
