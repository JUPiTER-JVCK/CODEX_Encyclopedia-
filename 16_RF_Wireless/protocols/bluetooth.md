---
title: "Bluetooth & BLE — Protocol"
layer: 16_RF_Wireless
section: protocols
tags: [protocol, bluetooth, ble, gatt, mesh, le-audio, pairing]
updated: 2026-05-21
---

# Bluetooth & BLE — Protocol

---

## Overview

Bluetooth operates in the 2.4 GHz ISM band. Classic Bluetooth (BR/EDR)
targets high-throughput audio and data links. Bluetooth Low Energy (BLE)
is optimized for battery-powered sensors with infrequent data transfers.

```
  Bluetooth stack:
  ┌─────────────────────────────────────────────────────────┐
  │                   Application                           │
  ├──────────────────────────┬──────────────────────────────┤
  │     Profiles (HID, A2DP, │  Profiles (GAP, GATT, etc.) │
  │     HFP, RFCOMM…)        │  BLE profiles               │
  ├──────────────────────────┴──────────────────────────────┤
  │ Generic Access Profile (GAP) / GATT                     │
  ├──────────────────────────────────────────────────────────┤
  │ L2CAP (Logical Link Control and Adaptation)             │
  ├──────────────────────────────────────────────────────────┤
  │ HCI (Host-Controller Interface)                         │
  ├────────────────────────────┬────────────────────────────┤
  │ Classic: LMP/BB/RF         │ LE: LL / PHY               │
  └────────────────────────────┴────────────────────────────┘
```

---

## BLE Advertising

BLE devices advertise on three primary channels: 37 (2402 MHz),
38 (2426 MHz), 39 (2480 MHz). These avoid the busiest Wi-Fi overlap.

### Advertisement PDU Types

| PDU Type | Description |
|----------|-------------|
| ADV_IND | Connectable undirected — general advertising |
| ADV_DIRECT_IND | Connectable directed — for known peer |
| ADV_NONCONN_IND | Non-connectable — beacon/sensor broadcast |
| ADV_SCAN_IND | Scannable — allows scan response |
| SCAN_RSP | Extended data in response to SCAN_REQ |

### Extended Advertising (BLE 5.0+)

- Up to 255 bytes per PDU (vs 31 bytes classic)
- Advertising on all 37 secondary channels (not just 3 primary)
- Coded PHY: S=8 coding = 125 kbps but 4× range

---

## GATT — Generic Attribute Profile

```
  GATT hierarchy:
  
  Server (peripheral)
  └─ Service (UUID)
     └─ Characteristic (UUID)
        ├─ Value (readable/writable data)
        ├─ Descriptor: CCCD (enable notify/indicate)
        └─ Descriptor: User Description

  Example: Heart Rate Service (0x180D)
  └─ Heart Rate Measurement (0x2A37)
     ├─ Value: [flags, bpm, rr-interval...]
     └─ CCCD: enable notifications
  └─ Body Sensor Location (0x2A38)
     └─ Value: 0x01 (Chest)
```

### GATT Operations

| Operation | Direction | Description |
|-----------|-----------|-------------|
| Read | Client → Server → Client | Read characteristic value |
| Write | Client → Server | Write, no response |
| Write w/ Response | Client → Server → Client | Confirmed write |
| Notify | Server → Client | Push update (unconfirmed) |
| Indicate | Server → Client → Server | Push update (confirmed ACK) |

---

## Pairing and Bonding

### Pairing Methods

| Method | When used | Security |
|--------|-----------|---------|
| Just Works | No display/keyboard | None — susceptible to MITM |
| Passkey Entry | One has display | MITM-protected |
| Numeric Comparison | Both have display | MITM-protected |
| OOB (Out-of-Band) | NFC, QR code | High |

### Secure Connections (BLE 4.2+)

Uses ECDH (P-256) for key agreement — provides forward secrecy.
Legacy pairing uses TK (Temporary Key) — weaker.

### Bonding

After pairing, devices store the Long-Term Key (LTK) for re-connection
without full pairing ceremony (encrypted channel re-established in 1 RTT).

---

## BLE 5.x / LE Audio

```
  LE Audio vs Classic Audio:
  ┌────────────────────┬──────────────────┬───────────────────┐
  │ Feature            │ Classic (A2DP)   │ LE Audio          │
  ├────────────────────┼──────────────────┼───────────────────┤
  │ Codec              │ SBC, AAC, aptX   │ LC3 (LE-specific) │
  │ Latency            │ 100-200ms        │ 20-40ms           │
  │ Multi-stream       │ No               │ Yes (earbuds)     │
  │ Broadcast          │ No               │ Yes (Auracast)    │
  │ Hearing aids       │ Limited          │ Built-in (TMAP)   │
  └────────────────────┴──────────────────┴───────────────────┘
```

### Auracast (Broadcast Audio)

Allows one source to broadcast audio to unlimited receivers (e.g.,
silent disco, airport departure screens, TV in gym). Receivers need
no pairing — just tune to the broadcast channel.

---

## Bluetooth Mesh (BT Mesh 1.0)

```
  Mesh network topology:
  
  [Provisioner] ─── provisions ──▶ [Node A]
                                       │
                         publish        │  subscribe
                         "room/light"   │  "room/light"
  [Switch]  ─────────────────────────▶ [Light A]
                                         [Light B]
  
  Relay nodes: forward messages beyond radio range
  Friend node: buffers messages for sleeping Low Power Nodes
  LPN: Low Power Node — polls Friend for buffered messages
```

---

## Key Terms

| Term | Definition |
|------|-----------|
| GAP | Generic Access Profile — discovery, connection, security roles |
| GATT | Generic Attribute Profile — data exchange model (server/client) |
| UUID | 16-bit (Bluetooth SIG) or 128-bit identifier for services/chars |
| CCCD | Client Characteristic Configuration Descriptor — enable notify |
| PDU | Protocol Data Unit — BLE packet at Link Layer |
| PHY | Physical layer: LE 1M, LE 2M, LE Coded (125k/500k) |
| LTK | Long-Term Key — stored for bonded re-connection |
| LC3 | Low Complexity Communication Codec — LE Audio standard |
| Piconet | Classic BT: 1 master + up to 7 active slaves |
| Scatternet | Multiple overlapping piconets sharing slaves |

---

## See Also

- RF lab exercises → [../lessons/rf_labs.md](../lessons/rf_labs.md)
- RF tools (bluetoothctl) → [../man_pages/rf_tools.md](../man_pages/rf_tools.md)
- Wi-Fi protocol → [./wifi.md](./wifi.md)
