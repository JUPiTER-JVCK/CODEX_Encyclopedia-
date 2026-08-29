
## Dedicated Lesson Modules

| File | Covers |
|------|--------|
| [Network Data Link — Interactive Labs](./datalink_labs.md) | VLAN config, ARP cache observation, STP |

# Network Data Link — Lessons

1. **Read an Ethernet frame** — capture with `tcpdump -e`; decode preamble/SFD, MAC, EtherType, FCS.
2. **Trace an ARP exchange** — `arping`, then full `who-has` and `is-at` in Wireshark.
3. **Build a Linux bridge** — `ip link add br0 type bridge`, attach two veth pairs.
4. **VLAN lab** — create `eth0.10` and `eth0.20`; trunk and access port semantics.
5. **STP convergence** — make a triangle of bridges; observe blocking ports; cut a link.
6. **LACP bond** — `bonding` driver in mode 4; verify with `ip -d link`.
7. **Wi-Fi mgmt frames** — capture beacons, probe requests, deauth.
8. **VXLAN overlay** — two hosts, VXLAN tunnel, ping over it; inspect outer/inner frames.
9. **EVPN/MP-BGP** — read FRR or sonic configs; understand RT/RD.
10. **L2 attack lab** — ARP spoof, MAC flood, VLAN hop, DHCP starvation — all in an isolated VM.

## Suggested external
- David Mahler's networking YouTube series
- Wireshark sample captures: `https://wiki.wireshark.org/SampleCaptures`
