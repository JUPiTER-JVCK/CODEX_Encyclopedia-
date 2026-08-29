# 11 — Network Internet (OSI L3)

> Packets routed between networks. IP addressing, routing protocols, ICMP,
> tunnels — the layer that makes the internet *internetworked*.

## At a glance

| Field | Value |
|-------|-------|
| OSI layer | 3 (Network) |
| Description | Packet routing between hosts on different networks |
| Protocols | IPv4, IPv6, ICMP, ICMPv6, IGMP, MLD, OSPF, IS-IS, BGP |
| Medium | L2 frames carrying IP packets |
| Example | Router picks the next hop for a packet by longest-prefix match |
| Adjacent | ↓ [10_Network_DataLink](../10_Network_DataLink/), ↑ [12_Network_Transport](../12_Network_Transport/) |

## What lives here

- **IP** — IPv4, IPv6, addressing, subnetting, fragmentation
- **ICMP / ICMPv6** — diagnostics, errors, Neighbor Discovery
- **Routing protocols** — interior (OSPF, IS-IS, EIGRP, RIP), exterior (BGP)
- **Tunnels** — GRE, IPIP, IPv6-in-IPv4 (6in4, 6to4), L2TPv3
- **VPN tech (L3)** — IPsec (IKEv2 + ESP/AH), WireGuard, OpenVPN
- **Multicast** — IGMPv2/v3, MLD, PIM-SM/DM/SSM
- **NAT** — SNAT, DNAT, NAT64, CGNAT, hairpinning
- **QoS** — DiffServ (DSCP), MPLS EXP, RED/WRED, ECN

## Sub-sections

- [references/](references/INDEX.md) — TCP/IP Illustrated, RFCs
- [lessons/](lessons/INDEX.md) — subnetting, BGP lab, IPsec setup
- [languages/](languages/INDEX.md) — IP libs, routing daemons
- [man_pages/](man_pages/INDEX.md) — `ip route`, `traceroute`, `mtr`, `ipset`
- [topics/](topics/INDEX.md) — IPv4/v6, routing, NAT, MTU/PMTUD, ECN
- [protocols/](protocols/INDEX.md) — IP, ICMP, routing, VPNs

## Cross-references
- L2 framing beneath → [10_Network_DataLink](../10_Network_DataLink/)
- L4 above (TCP/UDP) → [12_Network_Transport](../12_Network_Transport/)
- IPsec, route hijack, BGP security → [14_Security/topics](../../14_Security/topics/INDEX.md)
