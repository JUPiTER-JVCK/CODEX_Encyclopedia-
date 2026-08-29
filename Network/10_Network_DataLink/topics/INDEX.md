# Network Data Link — Topics

## Ethernet frame
- **Preamble + SFD** (7 + 1 bytes)
- **Dest MAC (6) + Src MAC (6)**
- **EtherType / length (2)** — 0x0800 IPv4, 0x86DD IPv6, 0x0806 ARP, 0x8100 802.1Q
- **Payload (46–1500)** — MTU; jumbo frames 9000+
- **FCS (4)** — CRC-32
- **IFG** — inter-frame gap

## Addressing
- **MAC address** — 6 bytes; OUI (24) + NIC-assigned (24)
- **Unicast / multicast / broadcast** — LSB of first octet for I/G bit
- **Universally vs locally administered** (U/L bit)
- **Randomized MAC** — privacy in Wi-Fi/BT

## ARP & NDP
- **ARP (IPv4)** — request/reply, gratuitous, proxy, ARP cache aging
- **NDP (IPv6)** — RS/RA, NS/NA, redirect; SLAAC interaction

## Switching
- **MAC learning** — populate fdb from src MAC
- **Flooding** — unknown unicast & broadcast
- **Storm control**, **MAC limit**, **port security**

## VLANs & overlays
- **802.1Q tag** — 4 bytes: TPID + PCP/DEI/VID
- **Native VLAN** vs **access** vs **trunk** ports
- **QinQ (802.1ad)** — provider tagging
- **VXLAN (RFC 7348)**, **Geneve (RFC 8926)** — L2 over UDP/IP
- **EVPN (RFC 7432)** — MP-BGP control plane for overlays
- **NVGRE, STT** — legacy alternatives

## Loop prevention / redundancy
- **STP (802.1D)** → **RSTP (802.1w)** → **MSTP (802.1s)**
- **BPDU**, **root bridge**, **port roles** (root, designated, alt, backup)
- **LACP (802.3ad/802.1AX)** — link aggregation control
- **TRILL**, **SPB (802.1aq)** — modern multipath alternatives
- **MC-LAG / VPC / MLAG** — vendor-specific multi-chassis aggregation

## Neighbor discovery (control plane)
- **LLDP (802.1AB)** — vendor-neutral
- **CDP** — Cisco

## Authentication / NAC
- **802.1X** — EAPOL, RADIUS, supplicant/authenticator/server roles
- **MACsec (802.1AE)** — link-layer encryption

## Wi-Fi MAC specifics
- **Frame classes** — management (beacon, probe, auth, assoc, deauth), control (RTS/CTS, ACK), data
- **4-address frames** (WDS, mesh)
- **PMF (Protected Management Frames)** — 802.11w

## MPLS (between L2 & L3)
- **Label-switched paths**, **LDP**, **RSVP-TE**, **Segment Routing (SR-MPLS)**

## Security cross-link
- ARP/NDP spoofing, DHCP starvation, VLAN hopping, deauth attacks → [14_Security/topics](../../../14_Security/topics/INDEX.md)
