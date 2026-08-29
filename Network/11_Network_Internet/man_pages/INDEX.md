# Network Internet — Manual Pages

## Dedicated man page references

| Topic | File |
|-------|------|
| IP & routing commands | [ip_commands.md](ip_commands.md) — ip addr/route, traceroute, mtr, ping, nmap |

---

## Addresses & routes
| Command | Purpose |
|---------|---------|
| `ip addr` | Show/assign IP addresses |
| `ip route` | Show/manage routing table |
| `ip -6 route` | IPv6 routing |
| `ip rule` | Policy routing (multiple tables) |
| `ipcalc` | Subnet math |
| `sipcalc` | More detailed subnet calc |
| `route -n` | Legacy routing display |

## Diagnostics
| Command | Purpose |
|---------|---------|
| `ping` / `ping6` | ICMP/ICMPv6 echo |
| `traceroute` / `traceroute6` / `tracepath` | Path discovery |
| `mtr` | Continuous traceroute + stats |
| `nmap -sn` | Host discovery (sweep) |
| `hping3` | Crafted ICMP/TCP/UDP probes |
| `arping -I eth0` | L2 reachability (cross-layer) |

## Firewall / NAT
| Command | Purpose |
|---------|---------|
| `iptables` / `ip6tables` | Legacy Linux firewall |
| `nft` (nftables) | Modern Linux firewall |
| `ipset` | Sets of IPs/ports for nft/iptables |
| `pf` (pfctl) | OpenBSD/macOS packet filter |
| `firewalld` | RHEL/Fedora firewall front-end |
| `ufw` | Ubuntu uncomplicated firewall |
| `conntrack` | View/modify conntrack table |

## Routing daemons
| Command | Purpose |
|---------|---------|
| `vtysh` | FRR unified CLI |
| `birdc` | BIRD client |
| `gobgp` | GoBGP CLI |
| `bgpq4` | Build prefix-lists from RIR data |

## VPN
| Command | Purpose |
|---------|---------|
| `wg` / `wg-quick` | WireGuard config |
| `swanctl` / `ipsec` | strongSwan |
| `ipsec` (Libreswan) | IKEv2/IKEv1 |
| `openvpn` | OpenVPN |

## macOS
- `route`, `netstat -rn`, `scutil --proxy`, `networksetup -setdnsservers`

## Windows
- `Get-NetIPAddress`, `Get-NetRoute`, `New-NetIPAddress`
- `route print`, `tracert`, `pathping`, `Get-NetIPInterface`
