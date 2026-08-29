
## Dedicated Lesson Modules

| File | Covers |
|------|--------|
| [Network Internet — Interactive Labs](./internet_labs.md) | Subnetting drill, traceroute analysis, BGP simulation |

# Network Internet — Lessons

1. **Subnetting drills** — `/24`, `/25`, `/22`, VLSM; do by hand, verify with `ipcalc`.
2. **IPv6 fluency** — link-local, ULA, GUA; SLAAC vs DHCPv6.
3. **Read a routing table** — `ip route show`, `ip -6 route`; understand metric, source, dev.
4. **Static routes & default gateway** — multi-homed host with policy routing.
5. **OSPF lab** — three Linux routers running FRR; areas, LSAs, SPF.
6. **BGP lab** — two ASes, eBGP peering, prefix announce, AS_PATH, communities.
7. **GRE tunnel** — point-to-point GRE between two hosts; encapsulation overhead.
8. **IPsec site-to-site** — strongSwan/Libreswan IKEv2 between two networks.
9. **WireGuard** — set up a hub-and-spoke VPN; routing table changes.
10. **NAT mechanics** — write iptables/nftables rules for SNAT, DNAT, masquerade.
11. **Path MTU discovery** — break it on purpose with ICMP filtering; watch failures.
12. **Multicast** — IGMP join, watch with `tcpdump`; PIM in a small lab.

## Suggested external
- Practical Networking on YouTube — Ed Harmoush
- INE / CBT Nuggets (paid CCNA/CCNP courseware)
- Cloudflare Learning Center
