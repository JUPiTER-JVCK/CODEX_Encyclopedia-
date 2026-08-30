---
title: "UDP — User Datagram Protocol"
layer: 12_Network_Transport
tags: [udp, transport, connectionless, rfc-768]
updated: 2026-05-20
---

# UDP — User Datagram Protocol

> **RFC 768** (1980) — 3 pages, one of the shortest RFCs ever.
> IP protocol number **17**.

UDP provides **connectionless, unreliable, message-preserving** datagram
delivery. No handshake, no ACKs, no ordering, no congestion control —
application decides what (if anything) to layer on top.

---

## Datagram header

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Source Port          |       Destination Port        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|            Length             |           Checksum            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                           Payload                            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

- **Header** is exactly **8 bytes** (vs. TCP's minimum 20).
- **Length** includes header + payload; min 8 (empty datagram).
- **Checksum** — optional in IPv4 (0 = not computed), **mandatory in IPv6**.
  Covers a pseudo-header (src/dst IP, proto, length).

---

## Why UDP?

| Property | Consequence |
|----------|-------------|
| No connection setup | Zero RTT overhead |
| No ACK / retransmit | Lower latency; app handles reliability |
| Message boundaries | Datagram = application message (no framing needed) |
| No congestion control | App or outer protocol (QUIC, DCCP) must manage |
| No head-of-line blocking | Lost packet doesn't stall other streams |

---

## Major protocols built on UDP

| Protocol | Port(s) | Notes |
|----------|---------|-------|
| DNS | 53 | Queries + small responses |
| NTP | 123 | Time sync |
| DHCP | 67/68 | Address assignment |
| QUIC | 443 | HTTP/3 + general transport |
| RTP/RTCP | dynamic | Voice, video, conferencing |
| TFTP | 69 | Simple file transfer |
| WireGuard | 51820 | VPN |
| SNMP | 161/162 | Management |
| syslog | 514 | Logging |
| mDNS | 5353 | Multicast DNS (Bonjour/Avahi) |
| STUN/TURN | 3478+ | NAT traversal |
| SIP (often) | 5060 | VoIP signaling |

---

## Performance: kernel offloads

```
   Application
       │ sendmsg()
       ▼
   ┌──────────┐   GSO (Generic Segmentation Offload)
   │  Socket   │──▶ Kernel splits super-sized UDP into MTU chunks
   └──────────┘    before NIC, or NIC does USO (hardware)
       │
       ▼
   ┌──────────┐   GRO (Generic Receive Offload)
   │   NIC    │──▶ Coalesce multiple small UDP datagrams into one
   └──────────┘    large buffer for fewer syscalls
```

- **`sendmmsg` / `recvmmsg`** — batch multiple datagrams per syscall.
- **`io_uring`** — async submission/completion (Linux 5.6+).
- **`SO_REUSEPORT`** — kernel-level load-balance across sockets (RSS-aware).
- **`UDP_GRO` / `UDP_SEGMENT`** — Linux 4.18+ socket options.

---

## UDP-Lite (RFC 3828)

IP protocol number **136**. Allows partial checksum coverage — only the first
*N* bytes are checksummed. Useful for codecs that tolerate bit errors in
payload but need a correct header (e.g., voice).

---

## Amplification attacks

UDP has no handshake → easy to **spoof source addresses**. Attackers send small
requests with a victim's IP to servers that return large responses:

| Reflector | Amplification factor |
|-----------|---------------------|
| memcached | up to 51,000× |
| DNS (open resolver) | 28–54× |
| NTP (monlist) | 556× |
| SSDP/UPnP | 30× |
| CLDAP | 56–70× |

**Mitigations**: BCP 38 (ingress filtering), rate limiting, response rate
limiting (DNS RRL), disabling unnecessary UDP services.

---

## Common gotchas

- **MTU / fragmentation** — UDP datagrams > path MTU get IP-fragmented; one
  lost fragment drops the entire datagram. Keep ≤ 1472 B (Ethernet) or do
  PMTUD.
- **No flow control** — fast sender can overwhelm a slow receiver; dropped at
  socket buffer → silent loss.
- **Firewall state timeouts** — UDP "connections" in stateful firewalls have
  short timeouts (30–120 s); long-lived UDP flows need keepalives.
- **Checksum optional (IPv4)** — disabling it risks silent corruption; always
  enable.
- **Port 0** — reserved; sending to/from it is undefined behavior on many OSes.

---

## Cross-links

- TCP → [tcp.md](tcp.md)
- QUIC (over UDP) → [quic.md](quic.md)
- DNS (major UDP consumer) → [../../13_Network_Application/protocols/dns.md](../../13_Network_Application/protocols/dns.md)
- Amplification / DDoS → [../../../14_Security/topics/INDEX.md](../../../14_Security/topics/INDEX.md)
- IP layer → [../../11_Network_Internet/protocols/ipv4_ipv6.md](../../11_Network_Internet/protocols/ipv4_ipv6.md)
