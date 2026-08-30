---
title: "Network Internet Layer — Interactive Labs"
layer: 11_Network_Internet
section: lessons
tags: [lesson, network, internet, subnetting, traceroute, bgp, lab, quiz, hands-on]
updated: 2026-05-21
---

# Network Internet Layer — Interactive Labs

---

## Module 1: Subnetting Drill

### Objective

Master IPv4 subnetting: calculate network/broadcast addresses, usable
hosts, and CIDR notation by hand.

### Exercises

```
  Given: 192.168.10.0/26

  Step 1: Subnet mask from /26
    /26 = 11111111.11111111.11111111.11000000 = 255.255.255.192

  Step 2: Block size = 256 - 192 = 64

  Step 3: Subnets (starting at .0, step by 64):
    192.168.10.0/26    Network: .0    Broadcast: .63    Hosts: .1-.62 (62)
    192.168.10.64/26   Network: .64   Broadcast: .127   Hosts: .65-.126
    192.168.10.128/26  Network: .128  Broadcast: .191   Hosts: .129-.190
    192.168.10.192/26  Network: .192  Broadcast: .255   Hosts: .193-.254
```

### Practice problems

**P1**: What subnet does 10.0.5.130/20 belong to?

> /20 mask: 255.255.240.0 → block size in 3rd octet = 16
> 5 / 16 = 0 remainder 5 → subnet starts at 10.0.0.0
> Network: 10.0.0.0/20, Broadcast: 10.0.15.255, Host range: 10.0.0.1–10.0.15.254

**P2**: How many /28 subnets fit in a /24?

> /24 has 256 addresses, /28 has 16 addresses → 256/16 = **16 subnets**

**P3**: What is the CIDR for a network that needs 500 hosts?

> 500 hosts needs 512 addresses (2^9) → /23 (gives 510 usable hosts)

---

## Module 2: Traceroute Analysis

### Objective

Use traceroute and mtr to map network paths, identify bottlenecks,
and understand asymmetric routing.

### Lab Steps

1. Run traceroute to multiple destinations:
```bash
traceroute -n 8.8.8.8
mtr --report -c 20 cloudflare.com
mtr --report -c 20 aws.amazon.com
```

2. Analyze the output — identify:
   - Your gateway (hop 1)
   - ISP network (hops 2-4 typically)
   - Peering points (where ISP hands off to backbone)
   - Destination network

3. Compare forward and reverse paths:
```bash
# Forward path
mtr --report 8.8.8.8
# Reverse path (from remote end) — use Looking Glass servers
```

### Knowledge Check

**Q1**: Why do some hops show `* * *`?

> **A1**: The router at that hop is configured to not respond to TTL-expired
> packets (ICMP rate-limiting or firewall rule). The packet still passes
> through — it just doesn't announce itself.

**Q2**: If hop 5 shows 50ms but hop 6 shows 10ms, is hop 5 slow?

> **A2**: Not necessarily. Traceroute measures round-trip to each hop.
> The router at hop 5 might deprioritize ICMP responses (slow control
> plane) while forwarding data packets at full speed.

---

## Module 3: BGP Simulation

### Objective

Run a simple BGP session between two routers using FRRouting (FRR) in
network namespaces.

### Lab Steps

1. Create two router namespaces:
```bash
sudo ip netns add r1
sudo ip netns add r2
sudo ip link add veth-r1 type veth peer name veth-r2
sudo ip link set veth-r1 netns r1
sudo ip link set veth-r2 netns r2
sudo ip netns exec r1 ip addr add 10.0.0.1/30 dev veth-r1
sudo ip netns exec r2 ip addr add 10.0.0.2/30 dev veth-r2
sudo ip netns exec r1 ip link set veth-r1 up
sudo ip netns exec r2 ip link set veth-r2 up
```

2. Configure FRR on each (simplified):
```
# R1 (AS 65001) announces 192.168.1.0/24
router bgp 65001
  neighbor 10.0.0.2 remote-as 65002
  address-family ipv4 unicast
    network 192.168.1.0/24

# R2 (AS 65002) announces 172.16.0.0/16
router bgp 65002
  neighbor 10.0.0.1 remote-as 65001
  address-family ipv4 unicast
    network 172.16.0.0/16
```

3. Verify BGP session:
```bash
vtysh -c "show bgp summary"
vtysh -c "show bgp ipv4 unicast"
```

### Review Flashcards

| Term | Definition |
|------|-----------|
| CIDR | Classless Inter-Domain Routing — /prefix notation |
| Subnet mask | Bitmask separating network and host portions |
| Broadcast address | Last address in a subnet — all host bits = 1 |
| TTL | Time To Live — decremented at each hop, prevents loops |
| BGP | Border Gateway Protocol — inter-AS routing (the Internet glue) |
| AS | Autonomous System — independently administered network |
| Peering | Direct connection between two ASes |
| Looking Glass | Public web tool to view routes from remote networks |

### Challenge

> Set up a 3-router BGP topology (triangle) with FRR. Configure
> AS-path prepending on one link to influence traffic flow. Verify
> with `show bgp` that the preferred path changes when you prepend.

---

## Cross-links

- IP commands → [../man_pages/ip_commands.md](../man_pages/ip_commands.md)
- Transport labs → [../../12_Network_Transport/lessons/transport_labs.md](../../12_Network_Transport/lessons/transport_labs.md)
- BGP protocol → [../protocols/INDEX.md](../protocols/INDEX.md)
