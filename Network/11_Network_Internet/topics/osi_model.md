---
title: "The OSI Model — 7-Layer Reference Ladder"
layer: 11_Network_Internet
tags: [osi, layers, networking, reference-model, tcp-ip]
updated: 2026-05-20
---

# The OSI Model — 7-Layer Reference Ladder

> ISO/IEC 7498-1 (1984). A conceptual framework for understanding how
> protocols interact. The TCP/IP model (4–5 layers) is what the Internet
> actually uses, but OSI terminology is universal.

---

## OSI vs. TCP/IP mapping

```
  OSI Model                          TCP/IP Model           Codex Layer
  ─────────                          ────────────           ──────────
  ┌─────────────────────┐
  │  7  Application     │
  ├─────────────────────┤            ┌──────────────┐
  │  6  Presentation    │            │  Application │       13_Network_Application
  ├─────────────────────┤            │              │
  │  5  Session         │            └──────┬───────┘
  ├─────────────────────┤                   │
  │  4  Transport       │            ┌──────┴───────┐       12_Network_Transport
  ├─────────────────────┤            │  Transport   │
  │  3  Network         │            ├──────────────┤       11_Network_Internet
  ├─────────────────────┤            │  Internet    │
  │  2  Data Link       │            ├──────────────┤       10_Network_DataLink
  ├─────────────────────┤            │  Link /      │
  │  1  Physical        │            │  Network     │       09_Network_Physical
  └─────────────────────┘            │  Access      │
                                     └──────────────┘
```

---

## Layer-by-layer summary

```
  Layer 7 — Application
  ┌──────────────────────────────────────────────────────────┐
  │  HTTP, DNS, SMTP, FTP, SSH, MQTT, gRPC, LDAP            │
  │  User-facing protocols; data semantics                   │
  │  PDU: Message / Data                                     │
  └──────────────────────────────────────────────────────────┘
                              │
  Layer 6 — Presentation      │ (merged into Application in TCP/IP)
  ┌──────────────────────────────────────────────────────────┐
  │  Encoding: JSON, XML, ASN.1, protobuf, Avro             │
  │  Encryption: TLS record layer                            │
  │  Compression: gzip, brotli, zstd                         │
  └──────────────────────────────────────────────────────────┘
                              │
  Layer 5 — Session           │ (merged into Application in TCP/IP)
  ┌──────────────────────────────────────────────────────────┐
  │  Session mgmt: RPC sessions, NetBIOS, SOCKS             │
  │  Checkpointing, restart, dialog control                  │
  └──────────────────────────────────────────────────────────┘
                              │
  Layer 4 — Transport
  ┌──────────────────────────────────────────────────────────┐
  │  TCP, UDP, QUIC, SCTP, DCCP                              │
  │  Segmentation, reliability, flow/congestion control      │
  │  PDU: Segment (TCP) / Datagram (UDP)                     │
  │  Addressing: Port numbers (0–65535)                      │
  └──────────────────────────────────────────────────────────┘
                              │
  Layer 3 — Network
  ┌──────────────────────────────────────────────────────────┐
  │  IPv4, IPv6, ICMP, IGMP, IPsec, BGP, OSPF               │
  │  Routing, logical addressing, fragmentation              │
  │  PDU: Packet                                             │
  │  Addressing: IP addresses                                │
  └──────────────────────────────────────────────────────────┘
                              │
  Layer 2 — Data Link
  ┌──────────────────────────────────────────────────────────┐
  │  Ethernet, Wi-Fi (802.11), PPP, VLAN (802.1Q), ARP      │
  │  Framing, MAC addressing, error detection, flow control  │
  │  PDU: Frame                                              │
  │  Addressing: MAC addresses (48-bit)                      │
  └──────────────────────────────────────────────────────────┘
                              │
  Layer 1 — Physical
  ┌──────────────────────────────────────────────────────────┐
  │  Copper (Cat5e/6/6a), Fiber (SMF/MMF), Radio (Wi-Fi/5G) │
  │  Bit encoding, signaling, connectors, pinouts            │
  │  PDU: Bit / Symbol                                       │
  │  Standards: 802.3 PHY, 802.11 PHY, DSL, DOCSIS           │
  └──────────────────────────────────────────────────────────┘
```

---

## Encapsulation (packet nesting)

```
  Application data
       │
       ▼
  ┌─────────────────────────────────────────────────┐
  │ HTTP Request: GET /index.html HTTP/1.1          │  L7
  └─────────────────────────────────────────────────┘
       │ wrapped in
       ▼
  ┌──────┬──────────────────────────────────────────┐
  │ TCP  │ HTTP payload                              │  L4
  │ Hdr  │                                           │
  └──────┴──────────────────────────────────────────┘
       │ wrapped in
       ▼
  ┌──────┬──────┬──────────────────────────────────┐
  │  IP  │ TCP  │ HTTP payload                      │  L3
  │ Hdr  │ Hdr  │                                   │
  └──────┴──────┴──────────────────────────────────┘
       │ wrapped in
       ▼
  ┌──────┬──────┬──────┬───────────────────┬──────┐
  │ Eth  │  IP  │ TCP  │ HTTP payload      │ FCS  │  L2
  │ Hdr  │ Hdr  │ Hdr  │                   │      │
  └──────┴──────┴──────┴───────────────────┴──────┘
       │ transmitted as
       ▼
  101010110001110101001...                           L1 (bits on wire)
```

---

## PDU names by layer

| Layer | PDU name | Example size |
|-------|----------|-------------|
| 7–5 | Data / Message | Variable |
| 4 | Segment (TCP) / Datagram (UDP) | ≤ MSS (typically 1460 B) |
| 3 | Packet | ≤ MTU (typically 1500 B) |
| 2 | Frame | 64–1518 B (Ethernet) |
| 1 | Bit / Symbol | — |

---

## Cross-links

- Physical layer → [../../09_Network_Physical/protocols/INDEX.md](../../09_Network_Physical/protocols/INDEX.md)
- Data Link → [../../10_Network_DataLink/protocols/ethernet.md](../../10_Network_DataLink/protocols/ethernet.md)
- IP → [../protocols/ipv4_ipv6.md](../protocols/ipv4_ipv6.md)
- Transport → [../../12_Network_Transport/protocols/INDEX.md](../../12_Network_Transport/protocols/INDEX.md)
- Application → [../../13_Network_Application/protocols/INDEX.md](../../13_Network_Application/protocols/INDEX.md)
