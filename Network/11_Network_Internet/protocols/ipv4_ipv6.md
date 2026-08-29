---
title: "IP — Internet Protocol (v4 & v6)"
layer: 11_Network_Internet
tags: [ip, ipv4, ipv6, rfc-791, rfc-8200, routing, addressing]
updated: 2026-05-20
---

# IP — Internet Protocol (v4 & v6)

> **IPv4**: RFC 791 (1981) — IP protocol number field is the next-header.
> **IPv6**: RFC 8200 (2017, obsoletes 2460) — 128-bit addressing, simplified header.

IP provides **best-effort, connectionless** packet delivery across
heterogeneous networks. It handles addressing, fragmentation (v4),
and next-hop routing.

---

## IPv4 header

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|Version|  IHL  |Type of Service|          Total Length         |
|  (4)  |  (4)  |  (DSCP + ECN) |                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Identification        |Flags|    Fragment Offset      |
|                               |DF|MF|                         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Time to Live |    Protocol   |        Header Checksum        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                       Source Address                          |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Destination Address                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Options (if IHL > 5)                       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

- **IHL** — header length in 32-bit words; min 5 (20 B), max 15 (60 B).
- **DSCP** (6 bits) — Differentiated Services; **ECN** (2 bits) — congestion.
- **TTL** — hop limit; decremented at each router; packet dropped at 0.
- **Protocol** — 6 = TCP, 17 = UDP, 1 = ICMP, 50 = ESP, 47 = GRE, etc.
- **Header Checksum** — recomputed at every hop (TTL changes).
- **Fragmentation** — router or sender splits; receiver reassembles.
  DF (Don't Fragment) flag enables Path MTU Discovery.

---

## IPv6 header

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|Version| Traffic Class |           Flow Label                  |
|  (4)  |    (8)        |            (20)                       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Payload Length        |  Next Header  |   Hop Limit   |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                                                               +
|                       Source Address                          |
+                         (128 bits)                            +
|                                                               |
+                                                               +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                                                               +
|                    Destination Address                        |
+                         (128 bits)                            +
|                                                               |
+                                                               +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

**Fixed 40-byte header** — no IHL, no checksum, no fragmentation fields.

Key differences from IPv4:
| Aspect | IPv4 | IPv6 |
|--------|------|------|
| Address size | 32 bits | 128 bits |
| Header size | 20–60 B (variable) | 40 B (fixed) |
| Header checksum | Yes (every hop) | No (removed — L4 handles it) |
| Fragmentation | Routers or sender | **Sender only** (min MTU 1280) |
| Broadcast | Yes | No (replaced by multicast) |
| ARP | Yes | Replaced by **NDP** (ICMPv6) |
| NAT | Ubiquitous | Designed to avoid |
| IPsec | Optional | Mandatory to implement |
| Extension headers | Options field | Chain of next-header EHs |

---

## IPv6 extension headers

```
  IPv6 Header           Ext Header 1        Ext Header 2        Payload
  ┌──────────┐          ┌──────────┐        ┌──────────┐       ┌────────┐
  │Next=43   │─────────▶│Next=44   │───────▶│Next=6    │──────▶│  TCP   │
  │(Routing) │          │(Fragment)│        │(TCP)     │       │        │
  └──────────┘          └──────────┘        └──────────┘       └────────┘
```

| Next-Header | Extension |
|-------------|-----------|
| 0 | Hop-by-Hop Options |
| 43 | Routing |
| 44 | Fragment |
| 50 | ESP (IPsec) |
| 51 | AH (IPsec) |
| 60 | Destination Options |
| 135 | Mobility |

---

## IPv4 address classes & CIDR

```
  Class A:  0.0.0.0   – 127.255.255.255   /8   (huge blocks, legacy)
  Class B:  128.0.0.0 – 191.255.255.255   /16
  Class C:  192.0.0.0 – 223.255.255.255   /24
  Class D:  224.0.0.0 – 239.255.255.255   (multicast)

  CIDR replaced classful routing (RFC 4632).
  Private (RFC 1918): 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
  CGNAT (RFC 6598):   100.64.0.0/10
  Loopback:           127.0.0.0/8
  Link-local:         169.254.0.0/16
```

---

## IPv6 address types

```
  ::1/128                Loopback
  fe80::/10              Link-local (auto-configured)
  fc00::/7               Unique Local (ULA, ~RFC 1918 equivalent)
  2000::/3               Global Unicast (GUA, routable)
  ff00::/8               Multicast
  ::ffff:0:0/96          IPv4-mapped (e.g., ::ffff:192.0.2.1)
```

**SLAAC** (RFC 4862) — stateless address auto-configuration using NDP Router
Advertisements + interface ID (EUI-64 or privacy extensions RFC 8981).

---

## ICMP / ICMPv6

| Type (v4) | Message | Use |
|-----------|---------|-----|
| 0/8 | Echo Reply/Request | `ping` |
| 3 | Destination Unreachable | PMTUD, port closed |
| 11 | Time Exceeded | `traceroute` (TTL=0) |
| 5 | Redirect | Router suggests better next hop |

ICMPv6 adds: **NDP** (Neighbor Solicitation / Advertisement, Router
Solicitation / Advertisement), **MLD** (multicast listener).

---

## Path MTU Discovery

```
  Sender                Router              Destination
    │                     │                     │
    │── 1500 B, DF=1 ───▶│                     │
    │                     │ link MTU = 1400     │
    │◀── ICMP "Frag       │                     │
    │    Needed" (mtu=1400)                     │
    │                     │                     │
    │── 1400 B, DF=1 ───▶│──── 1400 B ────────▶│
```

**PLPMTUD** (RFC 8899) — probe-based; doesn't rely on ICMP (which may be
filtered).

---

## Common gotchas

- **IPv4 exhaustion** — IANA pool depleted 2011; RIRs exhausted by 2019.
  CGN + IPv6 transition is ongoing.
- **ICMP black holes** — firewalls dropping ICMP break PMTUD → TCP MSS
  clamping workaround.
- **Extension header filtering** — some ISPs/firewalls drop IPv6 packets with
  extension headers → deployment pain.
- **IPv4-mapped addresses** — `::ffff:1.2.3.4` in dual-stack sockets can
  confuse ACLs; use `IPV6_V6ONLY` socket option.
- **TTL/Hop Limit = 1** — link-local protocols (OSPF, BFD, BGP TTL Security)
  rely on this for neighbor validation.

---

## Cross-links

- TCP (carried by IP) → [../../12_Network_Transport/protocols/tcp.md](../../12_Network_Transport/protocols/tcp.md)
- UDP → [../../12_Network_Transport/protocols/udp.md](../../12_Network_Transport/protocols/udp.md)
- BGP (routes IP prefixes) → [bgp.md](bgp.md)
- IPsec → [../../../14_Security/protocols/INDEX.md](../../../14_Security/protocols/INDEX.md)
- Ethernet (carries IP) → [../../10_Network_DataLink/protocols/INDEX.md](../../10_Network_DataLink/protocols/INDEX.md)
