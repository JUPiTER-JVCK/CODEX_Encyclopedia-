---
title: "Data Link Layer Commands"
layer: 10_Network_DataLink
section: man_pages
tags: [ip-link, bridge, tc, arp, arping, vlan, datalink, man-section-8]
updated: 2026-05-21
---

# Data Link Layer Commands

> Tools for managing network interfaces, bridges, VLANs, traffic control,
> and ARP/NDP on Linux.

---

## ip link --- interface management

### Synopsis

```
ip link show [dev NAME] [up]
ip link set dev NAME [up|down] [mtu N] [address MAC] [promisc on|off]
ip link add NAME type {bridge|vlan|vxlan|bond|veth|macvlan|...}
ip link delete NAME
```

### Description

The `ip link` subcommand of iproute2 manages Layer 2 interface state: bring
interfaces up/down, set MTU, change MAC address, create virtual interfaces
(bridges, VLANs, bonds, tunnels), and rename devices.

### Key operations

| Command | Purpose |
|---------|---------|
| `ip link show` | List all interfaces with state/MAC/MTU |
| `ip link set dev eth0 up` | Bring interface up |
| `ip link set dev eth0 mtu 9000` | Set jumbo frames |
| `ip link set dev eth0 promisc on` | Promiscuous mode |
| `ip link set dev eth0 address XX:XX:XX:XX:XX:XX` | Change MAC |
| `ip link add br0 type bridge` | Create bridge |
| `ip link set dev eth0 master br0` | Add interface to bridge |
| `ip link add link eth0 name eth0.10 type vlan id 10` | Create 802.1Q VLAN |
| `ip link add vxlan0 type vxlan id 42 ...` | Create VXLAN tunnel |
| `ip link add bond0 type bond mode 802.3ad` | Create LACP bond |

### Interface states

```
  DOWN ──── ip link set up ────▸ UP
    │                              │
    │  ip link set down  ◂─────────┘
    │
    │  NO-CARRIER: cable unplugged, no link partner
    │  LOWERLAYERDOWN: parent interface is down
    │
  State flags in ip link show:
    <BROADCAST,MULTICAST,UP,LOWER_UP>
     │          │         │    │
     │          │         │    └── physical link present
     │          │         └────── admin UP
     │          └──────────────── supports multicast
     └─────────────────────────── supports broadcast
```

### Examples

```bash
# Show all interfaces with details
ip -c link show      # -c for color

# Create a bridge and add ports
sudo ip link add br0 type bridge
sudo ip link set dev eth0 master br0
sudo ip link set dev eth1 master br0
sudo ip link set dev br0 up

# Create a VLAN subinterface
sudo ip link add link eth0 name eth0.100 type vlan id 100
sudo ip addr add 10.0.100.1/24 dev eth0.100
sudo ip link set dev eth0.100 up

# Create a veth pair (for containers/namespaces)
sudo ip link add veth0 type veth peer name veth1
```

---

## bridge --- bridge management

### Synopsis

```
bridge fdb {show|add|del} [dev DEV]
bridge vlan {show|add|del} [dev DEV] [vid VID]
bridge link show
bridge monitor
```

### Description

Advanced bridge control beyond what `ip link` provides. Manages the
forwarding database (FDB/MAC table), per-port VLAN filtering, and STP state.

### Key subcommands

| Command | Purpose |
|---------|---------|
| `bridge fdb show` | MAC forwarding table |
| `bridge fdb add MAC dev DEV master` | Static FDB entry |
| `bridge vlan show` | Per-port VLAN assignments |
| `bridge vlan add dev eth0 vid 10` | Add VLAN to port |
| `bridge vlan add dev eth0 vid 10 pvid untagged` | Native VLAN |
| `bridge link show` | Bridge port states (STP) |
| `bridge monitor` | Watch bridge events live |

### Bridge architecture

```
  Physical ports            Bridge (br0)               Forwarding
  ┌────────┐               ┌──────────────┐
  │  eth0  │──────────────▸│              │
  │  eth1  │──────────────▸│  FDB (MAC    │──▸ Lookup dst MAC
  │  eth2  │──────────────▸│  table)      │    → forward to port
  └────────┘               │              │    → flood if unknown
                           │  VLAN filter │    → drop if filtered
                           │  STP state   │
                           └──────────────┘
  
  FDB entry: MAC → port + VLAN + flags (static/dynamic/offloaded)
```

### Examples

```bash
# Show MAC table
bridge fdb show br br0
# aa:bb:cc:dd:ee:ff dev eth0 master br0 permanent
# 11:22:33:44:55:66 dev eth1 master br0 dynamic

# Enable VLAN filtering on bridge
sudo ip link set dev br0 type bridge vlan_filtering 1

# Assign VLANs to ports
sudo bridge vlan add dev eth0 vid 10 pvid untagged
sudo bridge vlan add dev eth0 vid 20
sudo bridge vlan add dev eth1 vid 20 pvid untagged
```

---

## tc --- traffic control

### Synopsis

```
tc qdisc {add|del|change|show} dev DEV [root|parent ID] [handle ID] QDISC [params]
tc class {add|del|change|show} dev DEV classid ID QDISC [params]
tc filter {add|del|show} dev DEV [parent ID] protocol PROTO FILTER [params]
```

### Description

Configures the Linux kernel's traffic control subsystem: queuing disciplines
(qdiscs), classes (for hierarchical qdiscs), and filters (for classification).
Controls bandwidth, latency, packet loss, and prioritization.

### Traffic control pipeline

```
  Ingress                                              Egress
  ─────────                                            ──────
  Network    ┌─────────┐    Routing     ┌──────────┐   Wire
  ──────────▸│ ingress │──▸ decision ──▸│  egress  │──────▸
             │ qdisc   │               │  qdisc   │
             │ (police)│               │ (shape)  │
             └─────────┘               │          │
                                       │ classes  │
                                       │ filters  │
                                       └──────────┘
  
  Common qdiscs:
    fq_codel — Fair Queue + Controlled Delay (default on many distros)
    cake     — Common Applications Kept Enhanced (bufferbloat fix)
    htb      — Hierarchical Token Bucket (bandwidth allocation)
    tbf      — Token Bucket Filter (simple rate limit)
    netem    — Network Emulator (delay, loss, jitter for testing)
    pfifo    — Simple FIFO
    red      — Random Early Detection
```

### Examples

```bash
# View current qdiscs
tc qdisc show dev eth0

# Add latency + loss (testing)
sudo tc qdisc add dev eth0 root netem delay 100ms 20ms loss 1%

# Remove netem
sudo tc qdisc del dev eth0 root

# Shape bandwidth to 100Mbit with cake
sudo tc qdisc replace dev eth0 root cake bandwidth 100Mbit

# Hierarchical bandwidth allocation with HTB
sudo tc qdisc add dev eth0 root handle 1: htb default 20
sudo tc class add dev eth0 parent 1: classid 1:1 htb rate 100mbit
sudo tc class add dev eth0 parent 1:1 classid 1:10 htb rate 60mbit ceil 100mbit
sudo tc class add dev eth0 parent 1:1 classid 1:20 htb rate 40mbit ceil 100mbit
sudo tc filter add dev eth0 parent 1: protocol ip u32 \
  match ip dport 22 0xffff flowid 1:10
```

---

## arp / ip neigh --- ARP table management

### Synopsis

```
ip neigh show [dev DEV] [nud {reachable|stale|failed|permanent}]
ip neigh add ADDR lladdr MAC dev DEV nud permanent
ip neigh del ADDR dev DEV
arp -a                    # legacy
arping -I eth0 IP_ADDR
```

### Description

View and manipulate the ARP (IPv4) and NDP (IPv6) neighbor cache. `ip neigh`
is the modern replacement for `arp`. `arping` sends ARP requests/replies
directly for debugging.

### Neighbor states

```
  INCOMPLETE ──▸ REACHABLE ──▸ STALE ──▸ DELAY ──▸ PROBE ──▸ FAILED
       │              │          │                     │
       │              │          └── used again? ──▸ DELAY
       │              │                                │
       │              └── timeout (30s default) ───────┘
       │
       └── ARP reply received ──▸ REACHABLE
  
  PERMANENT: static entry (never expires)
  NOARP: interface doesn't use ARP (e.g., loopback)
```

### Examples

```bash
# Show neighbor table with state
ip -c neigh show
# 192.168.1.1 dev eth0 lladdr aa:bb:cc:dd:ee:ff REACHABLE
# 192.168.1.100 dev eth0 lladdr 11:22:33:44:55:66 STALE

# Add a static entry
sudo ip neigh add 192.168.1.254 lladdr 00:11:22:33:44:55 dev eth0 nud permanent

# Flush stale entries
sudo ip neigh flush dev eth0 nud stale

# ARP ping (check L2 reachability)
sudo arping -I eth0 192.168.1.1
# ARPING 192.168.1.1 from 192.168.1.50 eth0
# Unicast reply from 192.168.1.1 [AA:BB:CC:DD:EE:FF] 0.567ms
```

---

## Cross-links

- IP layer tools -> [../../11_Network_Internet/man_pages/ip_commands.md](../../11_Network_Internet/man_pages/ip_commands.md)
- Transport layer -> [../../12_Network_Transport/man_pages/transport_tools.md](../../12_Network_Transport/man_pages/transport_tools.md)
- Ethernet protocol -> [../protocols/INDEX.md](../protocols/INDEX.md)
- Kernel tracing -> [../../../05_OS_Kernel/man_pages/tracing_commands.md](../../../05_OS_Kernel/man_pages/tracing_commands.md)
