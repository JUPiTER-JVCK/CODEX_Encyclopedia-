---
title: "Network Data Link — Interactive Labs"
layer: 10_Network_DataLink
section: lessons
tags: [lesson, network, datalink, vlan, stp, arp, lab, quiz, hands-on]
updated: 2026-05-21
---

# Network Data Link — Interactive Labs

---

## Module 1: VLAN Configuration

### Objective

Create VLANs on a Linux bridge, assign ports, and verify traffic isolation.

### Prerequisites

- Linux system with iproute2
- Two network namespaces (simulating hosts)

### Lab Steps

1. Create namespaces and veth pairs:
```bash
sudo ip netns add host1
sudo ip netns add host2
sudo ip link add veth1 type veth peer name veth1br
sudo ip link add veth2 type veth peer name veth2br
sudo ip link set veth1 netns host1
sudo ip link set veth2 netns host2
```

2. Create bridge with VLAN filtering:
```bash
sudo ip link add br0 type bridge vlan_filtering 1
sudo ip link set veth1br master br0
sudo ip link set veth2br master br0
sudo ip link set br0 up
sudo ip link set veth1br up
sudo ip link set veth2br up
```

3. Assign VLANs:
```bash
# host1 on VLAN 10, host2 on VLAN 20
sudo bridge vlan add dev veth1br vid 10 pvid untagged
sudo bridge vlan add dev veth2br vid 20 pvid untagged
sudo bridge vlan del dev veth1br vid 1
sudo bridge vlan del dev veth2br vid 1
```

4. Test isolation:
```bash
sudo ip netns exec host1 ip addr add 10.0.0.1/24 dev veth1
sudo ip netns exec host2 ip addr add 10.0.0.2/24 dev veth2
sudo ip netns exec host1 ip link set veth1 up
sudo ip netns exec host2 ip link set veth2 up
sudo ip netns exec host1 ping -c 2 10.0.0.2  # Should FAIL (different VLANs)
```

### Knowledge Check

**Q1**: What is a PVID (Port VLAN ID)?

> **A1**: The VLAN assigned to untagged frames arriving on a port. If a
> frame has no 802.1Q tag, the switch assigns the PVID before forwarding.

**Q2**: What is a trunk port vs an access port?

> **A2**: Access port carries one VLAN (untagged). Trunk port carries
> multiple VLANs (tagged with 802.1Q headers). Inter-switch links are
> typically trunks.

---

## Module 2: ARP Cache Observation

### Objective

Observe ARP request/reply process, understand cache aging, and detect
ARP spoofing indicators.

### Lab Steps

1. Clear and observe ARP:
```bash
sudo ip neigh flush dev eth0
ping -c 1 192.168.1.1
ip neigh show dev eth0
# 192.168.1.1 lladdr aa:bb:cc:dd:ee:ff REACHABLE
```

2. Capture ARP with tcpdump:
```bash
sudo tcpdump -i eth0 -nn arp
# ARP, Request who-has 192.168.1.1 tell 192.168.1.50
# ARP, Reply 192.168.1.1 is-at aa:bb:cc:dd:ee:ff
```

3. Watch state transitions:
```bash
watch -n 1 'ip neigh show dev eth0'
# States: REACHABLE → STALE → DELAY → PROBE → FAILED
```

### Review Flashcards

| Term | Definition |
|------|-----------|
| VLAN | Virtual LAN — logical network segment on shared switch |
| 802.1Q | VLAN tagging standard (4-byte tag in Ethernet frame) |
| STP | Spanning Tree Protocol — prevents L2 loops |
| ARP | Address Resolution Protocol — IP → MAC mapping |
| FDB | Forwarding Database — switch MAC address table |
| Trunk | Port carrying multiple tagged VLANs |
| PVID | Default VLAN for untagged frames on a port |

### Challenge

> Build a network with 3 VLANs (management, data, voice) on a Linux
> bridge. Add a router namespace that has interfaces on all 3 VLANs.
> Verify inter-VLAN routing works through the router but direct L2
> communication between VLANs is blocked.

---

## Cross-links

- Data link commands → [../man_pages/datalink_commands.md](../man_pages/datalink_commands.md)
- Internet layer labs → [../../11_Network_Internet/lessons/internet_labs.md](../../11_Network_Internet/lessons/internet_labs.md)
