---
title: "Ethernet — IEEE 802.3"
layer: 10_Network_DataLink
tags: [ethernet, 802.3, frames, mac, vlan, layer2]
updated: 2026-05-20
---

# Ethernet — IEEE 802.3

> **IEEE 802.3** (ongoing, first edition 1983).
> The dominant wired LAN technology — from 10 Mbps to 800 Gbps.

---

## Ethernet II frame

```
 ┌──────────┬──────────┬──────────┬────────┬─────────────┬──────┐
 │ Preamble │   SFD    │  Dst MAC │Src MAC │ EtherType / │ Data │  FCS
 │  (7 B)   │  (1 B)   │  (6 B)  │ (6 B)  │ Length (2B) │(46-  │ (4 B)
 │ 10101010 │ 10101011 │          │        │             │1500B)│
 └──────────┴──────────┴──────────┴────────┴─────────────┴──────┘
 ←── PHY ──→←───────────────── MAC frame (64–1518 B) ──────────────→
```

- **Preamble + SFD** — clock sync; not counted in frame size.
- **EtherType** ≥ 0x0600 → Ethernet II; < 0x0600 → IEEE 802.3 length field.
- **FCS** — CRC-32 over Dst MAC through Data; hardware-computed.
- **Min frame** = 64 B (forces collision window at 10 Mbps); padding added.
- **Max frame** = 1518 B; **jumbo frames** = 9000+ B (not standardized).

Common EtherTypes:

| EtherType | Protocol |
|-----------|----------|
| 0x0800 | IPv4 |
| 0x0806 | ARP |
| 0x86DD | IPv6 |
| 0x8100 | 802.1Q VLAN tag |
| 0x88A8 | 802.1ad (QinQ) |
| 0x8847/8848 | MPLS unicast/multicast |
| 0x88CC | LLDP |
| 0x88E5 | MACsec (802.1AE) |

---

## 802.1Q VLAN tagging

```
 ┌──────────┬────────┬──────────┬──────────┬────────┬─────┬──────┐
 │ Dst MAC  │Src MAC │ 0x8100   │ TCI      │EtherType│Data │ FCS  │
 │  (6 B)   │ (6 B)  │ (TPID)  │PCP|DEI|VID│ (2 B)  │     │(4 B) │
 │          │        │  (2 B)   │3b |1b|12b│        │     │      │
 └──────────┴────────┴──────────┴──────────┴────────┴─────┴──────┘
                      ←── 4-byte 802.1Q tag ──→
```

- **VID** — 12 bits → 4094 usable VLANs (0 and 4095 reserved).
- **PCP** — Priority Code Point (CoS for QoS).
- **QinQ (802.1ad)** — provider wraps another 0x88A8 tag; "stacked VLANs".

---

## MAC address format

```
  XX:XX:XX:XX:XX:XX    (6 bytes = 48 bits)
  ├──────┤├──────┤
    OUI     NIC-specific
  (vendor)  (unique per NIC)

  Bit 0 of first byte:
    0 = Unicast
    1 = Multicast (including broadcast FF:FF:FF:FF:FF:FF)

  Bit 1 of first byte:
    0 = Globally unique (OUI-assigned)
    1 = Locally administered (LAA)
```

---

## ARP (RFC 826)

```
  Host A (10.0.0.1)                     Host B (10.0.0.2)
      │                                      │
      │── ARP Request (broadcast) ──────────▶│
      │   "Who has 10.0.0.2? Tell 10.0.0.1" │
      │                                      │
      │◀── ARP Reply (unicast) ──────────────│
      │   "10.0.0.2 is at AA:BB:CC:DD:EE:FF" │
```

- **Gratuitous ARP** — announces own IP→MAC (failover, duplicate detection).
- **ARP spoofing** — attacker sends fake replies → MitM; mitigate with DAI,
  static entries, 802.1X, MACsec.

---

## Spanning Tree evolution

```
  STP (802.1D)  →  RSTP (802.1w)  →  MSTP (802.1s)
  30-50s conv.     1-2s convergence   Per-VLAN instances
                                      (maps VLANs to STP instances)
```

Modern data centers replace STP with:
- **MLAG / MC-LAG** — multi-chassis link aggregation
- **VXLAN + EVPN** — routed L3 underlay, no STP needed
- **SPB (802.1aq)** — IS-IS based L2 multipath

---

## Speed evolution

```
  1983    10 Mbps    10BASE5 (thick coax)
  1990    10 Mbps    10BASE-T (UTP)
  1995   100 Mbps    100BASE-TX (Cat5)
  1999     1 Gbps    1000BASE-T (Cat5e)
  2006    10 Gbps    10GBASE-T (Cat6a) / 10GBASE-SR (fiber)
  2010    40 Gbps    40GBASE-SR4
  2017   100 Gbps    100GBASE-SR4 / -LR4
  2022   400 Gbps    400GBASE-DR4 (PAM4)
  2024   800 Gbps    800GBASE-DR8
```

---

## Common gotchas

- **Broadcast storms** — STP failure + loop = network-wide broadcast flood;
  storm control + BPDU guard help.
- **VLAN hopping** — double-tagging attack on native VLANs; mitigate by
  setting native VLAN to unused VID.
- **Jumbo frame mismatch** — one device at MTU 9000, another at 1500 →
  silent drops; must be consistent end-to-end.
- **MAC table overflow** — CAM table exhausted by flood of fake MACs →
  switch falls back to hub mode; port security + 802.1X mitigate.
- **Asymmetric VLANs** — trunk allows VLAN 10 on one side but not the other
  → packets silently dropped.

---

## Cross-links

- IP (rides on Ethernet) → [../../11_Network_Internet/protocols/ipv4_ipv6.md](../../11_Network_Internet/protocols/ipv4_ipv6.md)
- MACsec → [../../../14_Security/protocols/INDEX.md](../../../14_Security/protocols/INDEX.md)
- Physical layer (PHY standards) → [../../09_Network_Physical/protocols/INDEX.md](../../09_Network_Physical/protocols/INDEX.md)
- Wi-Fi (802.11 MAC) → [../../../16_RF_Wireless/protocols/INDEX.md](../../../16_RF_Wireless/protocols/INDEX.md)
