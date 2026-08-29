---
title: "Internet Layer Commands"
layer: 11_Network_Internet
section: man_pages
tags: [ip, traceroute, mtr, ping, nmap, routing, firewall, man-section-1, man-section-8]
updated: 2026-05-21
---

# Internet Layer Commands

> Tools for IP addressing, routing, path diagnostics, and firewalling
> on Linux.

---

## ip addr --- IP address management

### Synopsis

```
ip addr show [dev NAME] [scope SCOPE]
ip addr add ADDR/PREFIX dev NAME [label LABEL]
ip addr del ADDR/PREFIX dev NAME
ip addr flush dev NAME
```

### Description

Shows and configures IPv4/IPv6 addresses on network interfaces. Part of the
iproute2 suite. Replaces `ifconfig`.

### Key operations

| Command | Purpose |
|---------|---------|
| `ip addr show` | List all addresses |
| `ip addr show dev eth0` | Addresses on one interface |
| `ip -4 addr` | IPv4 only |
| `ip -6 addr` | IPv6 only |
| `ip addr add 10.0.0.1/24 dev eth0` | Add address |
| `ip addr del 10.0.0.1/24 dev eth0` | Remove address |
| `ip addr flush dev eth0` | Remove all addresses |

### Examples

```bash
# Show addresses (colored)
ip -c addr show
# 2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
#     inet 192.168.1.50/24 brd 192.168.1.255 scope global dynamic eth0
#        valid_lft 86000sec preferred_lft 86000sec
#     inet6 fe80::1234:5678:abcd:ef01/64 scope link

# Add a secondary address
sudo ip addr add 10.0.0.1/24 dev eth0 label eth0:1
```

---

## ip route --- routing table

### Synopsis

```
ip route show [table TABLE] [default]
ip route add PREFIX via GATEWAY [dev DEV] [metric N] [table TABLE]
ip route del PREFIX
ip route get ADDR
ip rule {show|add|del}
```

### Description

View and manipulate the kernel routing table. Supports multiple routing tables,
policy routing, ECMP, and source-based routing.

### Routing decision flow

```
  Packet arrives
       │
       ▼
  ip rule list        (policy rules — which table to use)
  ┌─────────────────────────────────────┐
  │  0:    from all lookup local        │  ← loopback, broadcast
  │  100:  from 10.0.0.0/8 lookup wan   │  ← custom policy
  │  32766: from all lookup main        │  ← default table
  │  32767: from all lookup default     │  ← fallback
  └─────────────────────────────────────┘
       │
       ▼
  Longest prefix match in selected table
       │
       ▼
  Forward / deliver / drop
```

### Examples

```bash
# Show routing table
ip -c route show
# default via 192.168.1.1 dev eth0 proto dhcp metric 100
# 10.0.0.0/24 dev eth0 proto kernel scope link src 10.0.0.1
# 192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.50

# Add a static route
sudo ip route add 172.16.0.0/16 via 192.168.1.254

# Add default gateway
sudo ip route add default via 192.168.1.1

# Simulate routing lookup
ip route get 8.8.8.8
# 8.8.8.8 via 192.168.1.1 dev eth0 src 192.168.1.50

# ECMP (equal-cost multi-path)
sudo ip route add 10.0.0.0/8 \
  nexthop via 192.168.1.1 weight 1 \
  nexthop via 192.168.2.1 weight 1

# Policy routing: route traffic from 10.x via a separate table
sudo ip rule add from 10.0.0.0/8 table 100
sudo ip route add default via 10.0.0.1 table 100
```

---

## traceroute / tracepath --- path discovery

### Synopsis

```
traceroute [-I|-T|-U] [-n] [-q probes] [-m max_hops] host
tracepath [-n] [-l pktlen] host
mtr [--report] [-c count] [-n] host
```

### Description

Discover the Layer 3 path to a destination by sending packets with
incrementing TTL/hop-limit values. Each router that decrements TTL to 0
responds with ICMP Time Exceeded.

### Method comparison

| Method | Flag | Packets | Pros |
|--------|------|---------|------|
| UDP (default) | `-U` | UDP high ports | Works without root |
| ICMP echo | `-I` | ICMP Echo Request | Best for host-to-host |
| TCP SYN | `-T` | TCP SYN to port 80/443 | Passes most firewalls |

### traceroute vs mtr

```
  traceroute:                      mtr:
    One-shot snapshot                Continuous (like top for routes)
    Sends 3 probes per hop           Shows loss%, avg/best/worst per hop
    Text output, exit                Updates live, can export report
```

### Examples

```bash
# Standard traceroute
traceroute -n 8.8.8.8
#  1  192.168.1.1    0.5 ms   0.4 ms   0.4 ms
#  2  10.0.0.1       2.1 ms   1.9 ms   2.0 ms
#  3  * * *
#  4  72.14.236.73   5.2 ms   5.1 ms   5.3 ms
#  ...
# 10  8.8.8.8        8.4 ms   8.3 ms   8.5 ms

# TCP traceroute (port 443 — passes most firewalls)
sudo traceroute -T -p 443 example.com

# mtr report (10 packets)
mtr --report -c 10 8.8.8.8
# HOST                  Loss%  Snt   Last  Avg  Best  Wrst  StDev
# 1. gateway             0.0%   10    0.5  0.5   0.3   0.8    0.1
# 2. isp-router          0.0%   10    2.1  2.2   1.8   3.1    0.4
# ...

# Path MTU discovery
tracepath 8.8.8.8
```

---

## ping --- ICMP echo

### Synopsis

```
ping [-c count] [-i interval] [-s size] [-W timeout] [-t ttl] host
ping6 host    # or: ping -6 host
```

### Description

Sends ICMP Echo Request packets and measures round-trip time. The most
fundamental network diagnostic tool.

### Key Options

| Flag | Purpose |
|------|---------|
| `-c N` | Send N packets then stop |
| `-i N` | Interval between packets (seconds) |
| `-s N` | Payload size (default 56 bytes → 84 total with headers) |
| `-W N` | Timeout for each reply (seconds) |
| `-t N` | Set TTL |
| `-f` | Flood ping (root, for stress testing) |
| `-D` | Print timestamp before each line |
| `-q` | Quiet — only show summary |

### Examples

```bash
# Basic connectivity test
ping -c 4 8.8.8.8
# PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
# 64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=8.42 ms
# 64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=8.31 ms
# --- 8.8.8.8 ping statistics ---
# 4 packets transmitted, 4 received, 0% packet loss, time 3004ms
# rtt min/avg/max/mdev = 8.31/8.37/8.42/0.045 ms

# Large packet (test MTU / fragmentation)
ping -c 2 -s 1472 -M do 8.8.8.8    # -M do = don't fragment

# Ping with timestamps
ping -D -c 5 example.com
```

---

## nmap --- network mapper

### Synopsis

```
nmap [scan-type] [options] target-spec
```

### Description

Network exploration and security auditing tool. Discovers hosts, scans ports,
detects services/versions, identifies operating systems, and runs NSE scripts.

### Scan types

| Flag | Type | How it works |
|------|------|-------------|
| `-sS` | SYN scan (default, root) | Half-open: SYN → SYN/ACK → RST |
| `-sT` | Connect scan | Full TCP connect() |
| `-sU` | UDP scan | Send UDP, check for ICMP unreachable |
| `-sn` | Ping scan (host discovery) | No port scan, just find live hosts |
| `-sV` | Version detection | Banner grab / probe responses |
| `-O` | OS detection | TCP/IP fingerprinting |
| `-A` | Aggressive | `-sV -O --script=default --traceroute` |
| `-sC` | Script scan | Run default NSE scripts |

### Port states

```
  open       Service listening, accepts connections
  closed     Reachable but no service (RST response)
  filtered   No response (firewall dropping packets)
  open|filtered   Can't determine (UDP common)
  unfiltered      ACK scan: reachable but open/closed unknown
```

### Examples

```bash
# Quick scan of common ports
nmap -sS -T4 192.168.1.0/24

# Full port scan with version detection
nmap -sS -sV -p- -T4 target.com

# Host discovery only (ping sweep)
nmap -sn 192.168.1.0/24

# Scan specific ports with scripts
nmap -sS -sV -sC -p 22,80,443 target.com

# OS detection
sudo nmap -O target.com

# UDP scan (slow — top 100 ports)
sudo nmap -sU --top-ports 100 target.com

# Output formats
nmap -sS -oN scan.txt -oX scan.xml -oG scan.grep target.com
```

---

## Cross-links

- Data link layer -> [../../10_Network_DataLink/man_pages/datalink_commands.md](../../10_Network_DataLink/man_pages/datalink_commands.md)
- Transport layer -> [../../12_Network_Transport/man_pages/transport_tools.md](../../12_Network_Transport/man_pages/transport_tools.md)
- IP protocol -> [../protocols/INDEX.md](../protocols/INDEX.md)
- Security tools -> [../../../14_Security/man_pages/security_tools.md](../../../14_Security/man_pages/security_tools.md)
