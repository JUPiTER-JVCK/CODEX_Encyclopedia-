# 10 — Network Data Link (OSI L2)

> Frames between adjacent nodes on the same logical segment. MAC addresses,
> switching, VLANs, and the framing that turns a raw bit pipe into something
> packets can ride on.

## At a glance

| Field | Value |
|-------|-------|
| OSI layer | 2 (Data Link) — split into LLC + MAC sublayers |
| Description | Framing, addressing, and forwarding between adjacent nodes |
| Protocols | Ethernet (802.3), Wi-Fi MAC (802.11), ARP, VLAN (802.1Q), STP, LACP |
| Medium | Whatever L1 provides — copper, fiber, RF |
| Example | A switch forwards a frame to the port matching the dest MAC |
| Adjacent | ↓ [09_Network_Physical](../09_Network_Physical/), ↑ [11_Network_Internet](../11_Network_Internet/) |

## What lives here

- Ethernet framing & switching
- ARP / NDP (resolving L3 ↔ L2)
- VLANs (802.1Q), QinQ (802.1ad), VXLAN/Geneve (overlay)
- Spanning Tree (STP/RSTP/MSTP) and modern alternatives (TRILL, SPB)
- Link aggregation (LACP, 802.3ad)
- LLDP, CDP (neighbor discovery)
- 802.1X port-based authentication
- Wi-Fi MAC frames (mgmt, control, data)
- PPP, MPLS (label switching — sits between L2 and L3)

## Sub-sections

- [references/](references/INDEX.md) — 802 standards, networking textbooks
- [lessons/](lessons/INDEX.md) — packet capture, VLAN lab, bridge build
- [languages/](languages/INDEX.md) — frame parsers, raw socket libs
- [man_pages/](man_pages/INDEX.md) — `ip link`, `bridge`, `tcpdump`, `arp`
- [topics/](topics/INDEX.md) — switching, ARP, VLANs, STP, EVPN
- [protocols/](protocols/INDEX.md) — table of L2 protocols & RFCs

## Cross-references
- PHY beneath → [09_Network_Physical](../09_Network_Physical/)
- L3 above → [11_Network_Internet](../11_Network_Internet/)
- L2 attacks (ARP spoof, VLAN hop) → [14_Security/topics](../../14_Security/topics/INDEX.md)
