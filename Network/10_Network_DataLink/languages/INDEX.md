# Network Data Link — Languages

L2 is about frame formats, not programming languages. The relevant "languages"
are the **packet libraries** that let code parse / craft L2 frames.

| Library | Language | Notes |
|---------|----------|-------|
| Scapy | Python | Most ergonomic for crafting/replaying frames |
| dpkt | Python | Fast read-only parsing |
| pyshark | Python | Wireshark wrapper |
| libpnet | Rust | Cross-platform raw packet |
| gopacket | Go | Comprehensive parsing & live capture |
| libpcap | C | The base capture library on Unix |
| Npcap / WinPcap | C (Win) | Windows packet capture |
| PF_PACKET | Linux kernel | Raw L2 sockets |
| AF_XDP | Linux kernel | High-perf zero-copy capture |
| eBPF/XDP | C (compiled to BPF) | Programmable in-kernel L2/L3 |

## Switching dataplanes
- **Linux bridge / nftables / tc** — kernel software dataplane
- **Open vSwitch (OVS)** — production-grade SDN-friendly bridge
- **DPDK** — userspace fast path (poll-mode drivers)
- **VPP (FD.io)** — vectorized packet processing
- **eBPF/XDP** — programmable kernel-bypass-ish
- **P4** — declarative dataplane language for programmable switches/NICs

## Config languages
- Cisco IOS / NX-OS CLI, Junos CLI/JSON, FRR (Quagga-derived), SONiC YANG
- NETCONF/RESTCONF/gNMI for programmatic config
