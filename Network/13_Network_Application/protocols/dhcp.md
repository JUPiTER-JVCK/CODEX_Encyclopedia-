---
title: "DHCP — Dynamic Host Configuration Protocol"
layer: 13_Network_Application
tags: [dhcp, dhcpv6, addressing, rfc-2131, rfc-8415, network-boot]
updated: 2026-05-21
---

# DHCP — Dynamic Host Configuration Protocol

> **DHCPv4**: RFC 2131 (1997) + RFC 2132 (options).
> **DHCPv6**: RFC 8415 (2018, consolidated).
> Ports: client **68** / server **67** (v4); client **546** / server **547** (v6).

DHCP automates IP address assignment, subnet mask, gateway, DNS servers,
and dozens of other network parameters. Nearly every device on a LAN gets
its address from DHCP.

---

## DORA — DHCPv4 lease process

```
  Client (0.0.0.0)                    Server (e.g., 10.0.0.1)
       │                                    │
   ①   │── DHCPDISCOVER (broadcast) ───────▶│   "Anyone have an IP for me?"
       │   src=0.0.0.0 dst=255.255.255.255  │
       │                                    │
   ②   │◀── DHCPOFFER ────────────────────── │   "Here's 10.0.0.50, lease 1hr"
       │   (may be broadcast or unicast)    │
       │                                    │
   ③   │── DHCPREQUEST (broadcast) ────────▶│   "I'll take 10.0.0.50"
       │   (also tells other servers)       │
       │                                    │
   ④   │◀── DHCPACK ─────────────────────── │   "Confirmed. You're 10.0.0.50"
       │                                    │
       │   ═══ Client configures interface ═══
       │                                    │
       │   At T1 (50% of lease):            │
   ⑤   │── DHCPREQUEST (unicast) ──────────▶│   "Renew my lease"
       │◀── DHCPACK ─────────────────────── │   "Renewed"
       │                                    │
       │   At T2 (87.5% of lease):          │
   ⑥   │── DHCPREQUEST (broadcast) ────────▶│   "Rebind (any server)"
```

---

## DHCPv4 message format

```
 ┌───────┬───────┬───────┬──────────────────┐
 │  op   │ htype │ hlen  │     hops         │  (1B each)
 ├───────┴───────┴───────┴──────────────────┤
 │              xid (Transaction ID)         │  (4B)
 ├──────────────────┬───────────────────────┤
 │     secs         │        flags          │  (2B each)
 ├──────────────────┴───────────────────────┤
 │              ciaddr (client IP)           │  (4B, if known)
 ├──────────────────────────────────────────┤
 │              yiaddr (your IP)             │  (4B, offered)
 ├──────────────────────────────────────────┤
 │              siaddr (server IP)           │  (4B)
 ├──────────────────────────────────────────┤
 │              giaddr (relay agent IP)      │  (4B)
 ├──────────────────────────────────────────┤
 │              chaddr (client MAC, 16B)     │
 ├──────────────────────────────────────────┤
 │              sname (server hostname, 64B) │
 ├──────────────────────────────────────────┤
 │              file (boot filename, 128B)   │
 ├──────────────────────────────────────────┤
 │  Magic Cookie: 99.130.83.99              │
 ├──────────────────────────────────────────┤
 │              Options (variable)           │
 └──────────────────────────────────────────┘
```

---

## Key DHCP options (v4)

| Option | Code | Purpose |
|--------|------|---------|
| Subnet Mask | 1 | /24, /16, etc. |
| Router | 3 | Default gateway |
| DNS Server | 6 | Recursive resolver(s) |
| Domain Name | 15 | Search domain |
| Lease Time | 51 | Seconds |
| DHCP Message Type | 53 | DISCOVER/OFFER/REQUEST/ACK/NAK/RELEASE |
| Server Identifier | 54 | Server's IP |
| Requested IP | 50 | Client's preference |
| Client Identifier | 61 | MAC or DUID |
| Vendor Class | 60 | Vendor-specific info |
| TFTP Server / Bootfile | 66/67 | PXE / network boot |
| Option 82 | 82 | Relay Agent Information (circuit ID, remote ID) |
| Classless Static Routes | 121 | CIDR routes (supersedes option 33) |

---

## DHCP relay

```
  Client (VLAN 10)          Relay Agent (Router)         DHCP Server
       │                          │                          │
       │── DISCOVER (broadcast)──▶│                          │
       │                          │── DISCOVER (unicast) ───▶│
       │                          │   giaddr = router's IP   │
       │                          │   + Option 82            │
       │                          │                          │
       │                          │◀── OFFER (unicast) ──────│
       │◀── OFFER ────────────────│                          │
```

- `ip helper-address <server>` (Cisco) / `dhcp-relay` (Juniper).
- **Option 82** — relay inserts circuit/port info; server uses for policy
  (e.g., assign from the right pool based on switch port).

---

## DHCPv6

Two modes:

| Mode | Provides | Used with |
|------|----------|-----------|
| **Stateful** | Full address + options | Managed flag (M) in RA |
| **Stateless** (info-request) | DNS, NTP, etc. (no address) | SLAAC for addressing |

DHCPv6-PD (Prefix Delegation) — ISP delegates a /48 or /56 to a CPE router
which sub-delegates /64s to internal segments.

DHCPv6 uses **DUID** (DHCP Unique Identifier) instead of MAC for client ID.

---

## DHCP snooping (security)

```
  ┌──────────────────────────────────────────┐
  │              Switch                       │
  │                                           │
  │  Untrusted ports      Trusted port        │
  │  (clients)            (to DHCP server)    │
  │  ┌───┐ ┌───┐         ┌───┐               │
  │  │PC1│ │PC2│         │Svr│               │
  │  └─┬─┘ └─┬─┘         └─┬─┘               │
  │    │      │              │                │
  │  Block DHCPOFFER     Allow all DHCP       │
  │  Block DHCPACK       messages             │
  │  from these ports                         │
  └──────────────────────────────────────────┘

  Builds a binding table: MAC ↔ IP ↔ port ↔ VLAN
  Used by: Dynamic ARP Inspection, IP Source Guard
```

---

## Common gotchas

- **Rogue DHCP server** — any device can answer DISCOVER; snooping + 802.1X
  prevent unauthorized servers.
- **Scope exhaustion** — all IPs leased; clients get DHCPNAK. Monitor with
  SNMP / alerts. Shorten lease time or expand pool.
- **Relay without Option 82** — server can't distinguish subnets if multiple
  scopes share the same relay agent IP. Use shared-network config.
- **Lease persistence** — clients remember their lease across reboots and
  REQUEST the same IP; server should honor if still available.
- **Windows vs Linux client ID** — Windows sends hardware type + MAC as
  option 61; Linux often sends just MAC. Can cause duplicate leases.
- **PXE boot order** — options 66/67 vs option 43 vs ProxyDHCP; vendor
  interop can be painful.

---

## Cross-links

- DNS (DHCP assigns DNS servers) → [dns.md](dns.md)
- IP addressing → [../../11_Network_Internet/protocols/ipv4_ipv6.md](../../11_Network_Internet/protocols/ipv4_ipv6.md)
- Ethernet / ARP → [../../10_Network_DataLink/protocols/ethernet.md](../../10_Network_DataLink/protocols/ethernet.md)
- Security (snooping, rogue servers) → [../../../14_Security/topics/INDEX.md](../../../14_Security/topics/INDEX.md)
- Firmware (PXE boot) → [../../../03_Firmware_BIOS/topics/INDEX.md](../../../03_Firmware_BIOS/topics/INDEX.md)
