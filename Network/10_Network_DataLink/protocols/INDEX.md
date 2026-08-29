# Network Data Link — Protocols

## Dedicated protocol references

| Protocol | File |
|----------|------|
| Ethernet (802.3) | [ethernet.md](ethernet.md) — frame format, VLANs, MAC, ARP, STP, speed evolution |

---

## Framing & addressing
| Protocol | Spec | Purpose |
|----------|------|---------|
| Ethernet II / 802.3 | IEEE 802.3 | Standard frame format |
| ARP | RFC 826 | IPv4 ↔ MAC resolution |
| RARP | RFC 903 | MAC → IPv4 (legacy) |
| IPv6 NDP | RFC 4861 | Neighbor discovery (also covers RA/RS) |
| LLDP | IEEE 802.1AB | Link-layer neighbor discovery |
| CDP | Cisco | Cisco proprietary neighbor discovery |

## VLAN / overlay
| Protocol | Spec | Purpose |
|----------|------|---------|
| 802.1Q | IEEE 802.1Q | VLAN tagging (4-byte tag) |
| 802.1ad (QinQ) | IEEE 802.1ad | Provider stacked tags |
| VXLAN | RFC 7348 | L2-over-UDP, VNI = 24 bits |
| Geneve | RFC 8926 | Extensible L2-over-UDP |
| NVGRE | RFC 7637 | L2 over GRE (legacy) |
| EVPN | RFC 7432 | MP-BGP control plane for overlays |

## Loop prevention / redundancy
| Protocol | Spec | Purpose |
|----------|------|---------|
| STP | 802.1D | Spanning Tree (legacy) |
| RSTP | 802.1w | Rapid STP |
| MSTP | 802.1s | Multiple STP instances |
| LACP | 802.1AX (was 802.3ad) | Link aggregation |
| TRILL | RFC 6325 | Multipath bridging |
| SPB | 802.1aq | Shortest Path Bridging |

## Authentication / security
| Protocol | Spec | Purpose |
|----------|------|---------|
| 802.1X | IEEE 802.1X | Port-based NAC (EAPOL) |
| EAP | RFC 3748 | Extensible Auth (PEAP, TLS, TTLS, MSCHAPv2, FAST) |
| MACsec | 802.1AE | Layer-2 frame encryption + integrity |
| PAE / MKA | 802.1X | MACsec key agreement |

## Wi-Fi MAC (802.11)
- Beacon, Probe Req/Resp, Authentication, Association/Reassociation
- RTS/CTS, ACK, Block ACK
- Power Save (PS-Poll, TWT)
- PMF (802.11w)

## PPP & related (still found on WAN links)
| Protocol | Spec | Purpose |
|----------|------|---------|
| PPP | RFC 1661 | Point-to-Point Protocol |
| PPPoE | RFC 2516 | PPP over Ethernet (DSL CPE) |
| PPPoA | RFC 2364 | PPP over ATM (legacy DSL) |
| L2TP | RFC 3931 | L2 tunneling (often L2TP/IPsec) |

## MPLS (label-switched between L2 & L3)
| Protocol | Spec |
|----------|------|
| MPLS | RFC 3031 |
| LDP | RFC 5036 |
| RSVP-TE | RFC 3209 |
| Segment Routing (SR-MPLS) | RFC 8660 |
