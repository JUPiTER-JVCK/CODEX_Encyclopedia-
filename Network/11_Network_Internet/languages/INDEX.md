# Network Internet — Languages

## Packet / routing libraries
| Library | Language | Notes |
|---------|----------|-------|
| Scapy | Python | Craft & dissect IP/ICMP/etc. |
| dpkt | Python | Fast parsing |
| gopacket | Go | Live + offline packet processing |
| pnet | Rust | Cross-platform packet libs |
| netaddr / ipaddress | Python | Address arithmetic |
| iproute2 (Linux) | C | The reference CLI implementation |
| libnl | C | Netlink in C |

## Routing daemons (open source)
| Daemon | Languages | Notes |
|--------|-----------|-------|
| FRRouting | C | Fork of Quagga; OSPF/IS-IS/BGP/PIM/EVPN |
| BIRD | C | Lightweight, BGP-focused; widely used at IXPs |
| GoBGP | Go | BGP only; embeddable |
| ExaBGP | Python | Programmable BGP "speaker" |
| OpenBGPD | C | OpenBSD-grown |

## SDN / programmable
| Tool | Language |
|------|----------|
| ONOS / OpenDaylight | Java |
| Faucet | Python |
| P4 programs | P4 |
| eBPF/XDP | C → BPF |

## Config DSLs / APIs
- NETCONF / YANG, RESTCONF, gNMI/gNOI
- Ansible / SaltStack network modules
