# Network Internet — Protocols

## Dedicated protocol references

| Protocol | File |
|----------|------|
| IPv4 / IPv6 | [ipv4_ipv6.md](ipv4_ipv6.md) — header layouts, addressing, ICMP, PMTUD |
| BGP | [bgp.md](bgp.md) — path attributes, best-path selection, MP-BGP, security |
| OSPF | [ospf.md](ospf.md) — packet types, neighbor state machine, area design, LSA types, SPF algorithm |

---

## Internet Protocol family
| Protocol | RFC | Purpose |
|----------|-----|---------|
| IPv4 | 791 | Internet Protocol v4 |
| IPv6 | 8200 | Internet Protocol v6 |
| ICMP (IPv4) | 792 | Diagnostics & error messages |
| ICMPv6 | 4443 | Diagnostics + NDP + MLD |
| IGMP v1/v2/v3 | 1112 / 2236 / 3376 | IPv4 multicast group mgmt |
| MLD v1/v2 | 2710 / 3810 | IPv6 multicast listener |

## Routing protocols
| Protocol | RFC | Type | Use |
|----------|-----|------|-----|
| RIP v2 | 2453 | IGP, distance-vector | Legacy / small nets |
| OSPFv2 | 2328 | IGP, link-state | IPv4 enterprise |
| OSPFv3 | 5340 | IGP, link-state | IPv6 (and v4 via AF) |
| IS-IS | ISO 10589 / RFC 5302 | IGP, link-state | Large ISPs |
| EIGRP | 7868 | IGP, hybrid | Cisco-centric |
| BGP-4 | 4271 | EGP, path-vector | Internet, large enterprise |
| MP-BGP | 4760 | EGP extension | Multi-AF (IPv6, EVPN, VPNv4) |
| BFD | 5880 | Bidirectional Forwarding Detection | Fast fault detection |

## Routing security & policy
| Protocol | RFC | Purpose |
|----------|-----|---------|
| RPKI | 6480 | Resource PKI for prefix origin validation |
| BGPsec | 8205 | AS path crypto validation |
| ROA | 6482 | Route Origin Authorization records |
| ASPA | drafts | Autonomous System Provider Authorization (in progress) |

## Tunneling
| Protocol | RFC | Purpose |
|----------|-----|---------|
| GRE | 2784 / 7676 | Generic Routing Encapsulation |
| IP-in-IP (IPIP) | 2003 | Encapsulate IP in IP |
| 6in4 | 4213 | IPv6 in IPv4 |
| 6to4 | 3056 | Auto IPv6 over IPv4 (deprecated) |
| Teredo | 4380 | IPv6 through NAT (deprecated) |
| L2TPv3 | 3931 | L2 tunneling |

## VPN
| Protocol | RFC | Purpose |
|----------|-----|---------|
| IPsec AH | 4302 | Authentication Header |
| IPsec ESP | 4303 | Encapsulating Security Payload |
| IKEv2 | 7296 | Key exchange |
| WireGuard | (draft / live impl) | Modern minimal VPN |
| OpenVPN | (de facto) | TLS-based VPN |

## NAT-related
| Protocol | RFC | Purpose |
|----------|-----|---------|
| NAT64 | 6146 | IPv6 → IPv4 translation |
| DNS64 | 6147 | Synthesize AAAA from A |
| 464XLAT | 6877 | Hybrid for IPv6-only clients |
| CGN | 6888 | Carrier-grade NAT considerations |
| NAT-PMP | 6886 | Apple's NAT port-mapping |
| PCP | 6887 | Successor to NAT-PMP/UPnP IGD |

## Multicast routing
| Protocol | RFC | Purpose |
|----------|-----|---------|
| PIM-SM | 7761 | Sparse Mode |
| PIM-DM | 3973 | Dense Mode (rare today) |
| PIM-SSM | 4607 | Source-Specific Multicast |
| MSDP | 3618 | Multicast Source Discovery |
