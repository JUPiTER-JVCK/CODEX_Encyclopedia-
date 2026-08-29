# Network Internet — Topics

## Dedicated topic files

| Topic | File |
|-------|------|
| OSI Model | [osi_model.md](osi_model.md) — 7-layer ladder, TCP/IP mapping, encapsulation diagrams, PDU names |

---

## IPv4
- **Header** — 20 bytes minimum: VER/IHL, DSCP/ECN, total length, ID/flags/frag-offset, TTL, proto, checksum, src/dst, options.
- **Addressing** — classful (historical), CIDR, VLSM.
- **Private space** — RFC 1918 (10/8, 172.16/12, 192.168/16); CGNAT 100.64/10.
- **Special** — loopback 127/8, link-local 169.254/16, multicast 224/4.
- **Fragmentation** — IPv4 fragments on routers; reassembly at dest.

## IPv6
- **Header** — fixed 40 bytes + extension headers.
- **Address types** — global unicast, ULA (fc00::/7), link-local (fe80::/10), multicast (ff00::/8).
- **SLAAC** vs **DHCPv6** vs **DHCPv6-PD**.
- **EUI-64**, **privacy addresses** (RFC 4941).
- **Flow label**, **traffic class** (DSCP/ECN).
- **No router fragmentation** — PMTUD mandatory.

## ICMP
- **ICMPv4** — echo, dest-unreachable, time-exceeded, redirect, frag-needed.
- **ICMPv6** — additionally carries NDP, MLD, "Packet Too Big".
- **Don't filter PMTUD ICMP** — breaks paths.

## Routing
- **Longest-prefix match**, **FIB vs RIB**.
- **Static routes**, **default route**.
- **IGPs**: OSPFv2/v3, IS-IS, EIGRP (Cisco), RIP (legacy).
- **EGP**: BGP-4 (eBGP / iBGP), route reflectors, confederations.
- **BGP attributes** — AS_PATH, NEXT_HOP, LOCAL_PREF, MED, communities.
- **Policy routing / source routing** (ip rule).
- **ECMP** — equal-cost multi-path.

## NAT
- **SNAT / DNAT / Masquerade** (Linux conntrack).
- **PAT / PNAT** (port translation).
- **Stateful vs stateless** NAT.
- **CGN (RFC 6888)** — shared address space pitfalls.
- **NAT64 / DNS64** — IPv6-only to IPv4 services.
- **Hairpinning / NAT loopback**.

## MTU & PMTUD
- **Path MTU Discovery** (RFC 1191 / 8201).
- **TCP MSS clamping** as workaround.
- **Black holes** — silently dropped "Frag Needed".

## QoS
- **DSCP** (RFC 2474) — DiffServ code points.
- **ECN** (RFC 3168), **L4S** (RFC 9331/9332).
- **AQM** — fq_codel, CAKE, PIE.

## VPN / tunneling
- **IPsec** — AH vs ESP, transport vs tunnel mode, IKEv2.
- **WireGuard** — Noise-IK based, in-kernel since Linux 5.6.
- **OpenVPN** — TLS-based, TCP/UDP, userspace.
- **GRE / IP-in-IP / 6in4 / 6to4 / Teredo**.

## Multicast
- **IGMPv2/v3** (IPv4), **MLDv1/v2** (IPv6).
- **PIM-SM / DM / SSM**.
- **MSDP**, **Anycast RP**.

## Security cross-link
- BGP hijacks / RPKI → [14_Security/topics](../../../14_Security/topics/INDEX.md)
- IPsec/WireGuard crypto → [14_Security/topics](../../../14_Security/topics/INDEX.md)
- DDoS at L3/L4 → [14_Security/topics](../../../14_Security/topics/INDEX.md)
