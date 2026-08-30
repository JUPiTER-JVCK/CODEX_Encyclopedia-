---
title: "BGP — Border Gateway Protocol"
layer: 11_Network_Internet
tags: [bgp, routing, egp, path-vector, rfc-4271, internet]
updated: 2026-05-20
---

# BGP — Border Gateway Protocol (v4)

> **RFC 4271** (2006) — BGP-4 specification.
> **RFC 4760** — Multiprotocol Extensions (MP-BGP).
> TCP port **179**. The only EGP in production — it literally runs the Internet.

BGP is a **path-vector** routing protocol that exchanges reachability
information between **Autonomous Systems (ASes)**. Every Internet route
decision flows through BGP.

---

## BGP message types

```
  ┌──────────────────────────────────────────────┐
  │              BGP Message Header              │
  ├──────────┬───────────┬───────────────────────┤
  │ Marker   │  Length   │  Type                 │
  │ (16 B,   │  (2 B)   │  (1 B)                │
  │  all 1s) │          │  1=OPEN               │
  │          │          │  2=UPDATE             │
  │          │          │  3=NOTIFICATION       │
  │          │          │  4=KEEPALIVE          │
  │          │          │  5=ROUTE-REFRESH      │
  └──────────┴───────────┴───────────────────────┘
```

---

## Session establishment

```
    Router A (AS 64500)           Router B (AS 64501)
         │                              │
         │──── TCP SYN (port 179) ─────▶│
         │◀─── TCP SYN-ACK ────────────│
         │──── TCP ACK ────────────────▶│
         │                              │
         │──── OPEN (AS, Hold, RID) ───▶│
         │◀─── OPEN (AS, Hold, RID) ────│
         │                              │
         │──── KEEPALIVE ──────────────▶│
         │◀─── KEEPALIVE ──────────────│
         │                              │
         │     === ESTABLISHED ===      │
         │                              │
         │──── UPDATE (NLRI + attrs) ──▶│
         │◀─── UPDATE ─────────────────│
```

**Hold Timer** — default 90 s (keepalive every 30 s). If no message within
hold time → session torn down.

---

## BGP state machine

```
  ┌────────┐  start   ┌─────────┐  TCP up  ┌───────────┐
  │  Idle  │─────────▶│ Connect │─────────▶│ OpenSent  │
  └────────┘          └─────────┘          └─────┬─────┘
       ▲                   │                     │ recv OPEN
       │              TCP fail                   ▼
       │                   │              ┌─────────────┐
       │                   ▼              │ OpenConfirm │
       │              ┌─────────┐        └──────┬──────┘
       └──────────────│ Active  │               │ recv KEEPALIVE
                      └─────────┘               ▼
                                         ┌──────────────┐
                                         │ Established  │
                                         └──────────────┘
```

---

## UPDATE message structure

```
  ┌──────────────────────────────────────────────┐
  │  Withdrawn Routes Length (2 B)               │
  ├──────────────────────────────────────────────┤
  │  Withdrawn Routes (variable)                 │
  │    prefix-length + prefix (packed)           │
  ├──────────────────────────────────────────────┤
  │  Total Path Attribute Length (2 B)           │
  ├──────────────────────────────────────────────┤
  │  Path Attributes (variable)                  │
  │    ORIGIN, AS_PATH, NEXT_HOP, MED,          │
  │    LOCAL_PREF, COMMUNITIES, ...              │
  ├──────────────────────────────────────────────┤
  │  NLRI — Network Layer Reachability Info      │
  │    prefix-length + prefix (packed)           │
  └──────────────────────────────────────────────┘
```

---

## Path attributes (key ones)

| Attribute | Type | Purpose |
|-----------|------|---------|
| ORIGIN | Well-known mandatory | IGP / EGP / Incomplete |
| AS_PATH | Well-known mandatory | Ordered list of ASes traversed |
| NEXT_HOP | Well-known mandatory | IP of next router |
| LOCAL_PREF | Well-known discretionary | iBGP preference (higher = preferred) |
| MED | Optional non-transitive | Suggest entry point to neighbor AS |
| COMMUNITY | Optional transitive | 32-bit tag for policy (RFC 1997) |
| LARGE_COMMUNITY | Optional transitive | AS:Value1:Value2 (RFC 8092) |
| EXTENDED_COMMUNITY | Optional transitive | RT, SOO for VPNs (RFC 4360) |
| ORIGINATOR_ID | Optional non-transitive | Route reflector loop prevention |
| CLUSTER_LIST | Optional non-transitive | Route reflector cluster path |
| MP_REACH_NLRI | Optional non-transitive | Multi-protocol: IPv6, VPNv4, EVPN |

---

## Best path selection (decision process)

```
  1. Highest LOCAL_PREF
  2. Shortest AS_PATH
  3. Lowest ORIGIN type (IGP < EGP < Incomplete)
  4. Lowest MED (from same neighbor AS)
  5. eBGP over iBGP
  6. Lowest IGP metric to NEXT_HOP
  7. Oldest route (stability)
  8. Lowest Router ID
  9. Lowest neighbor IP (tiebreaker)
```

---

## iBGP vs. eBGP

| Aspect | iBGP | eBGP |
|--------|------|------|
| Peers | Same AS | Different ASes |
| AS_PATH | Not prepended | Prepended with local AS |
| NEXT_HOP | Usually unchanged | Changed to peering IP |
| TTL | Multihop default (255) | 1 (GTSM: RFC 5082) |
| Full mesh | Required (or use RR / confederation) | N/A |
| LOCAL_PREF | Carried | Not sent across AS boundary |

**Route Reflectors** (RFC 4456) — eliminate iBGP full-mesh requirement.
**Confederations** (RFC 5065) — split AS into sub-ASes.

---

## Security

| Mechanism | RFC | Purpose |
|-----------|-----|---------|
| MD5 TCP auth | 2385 | Legacy session protection (weak) |
| TCP-AO | 5925 | Stronger TCP authentication |
| RPKI + ROV | 6480/6811 | Validate prefix origin AS (ROA) |
| BGPsec | 8205 | Cryptographic AS_PATH validation |
| ASPA | drafts | Provider authorization |
| IRR / RADB | — | Prefix filter databases |
| Max-prefix limits | — | Prevent route leaks from crashing sessions |

**Route leaks** and **hijacks** remain the primary BGP threat vectors.
RPKI adoption is accelerating but far from universal.

---

## MP-BGP address families

| AFI/SAFI | Use |
|----------|-----|
| IPv4 Unicast (1/1) | Classic Internet routing |
| IPv6 Unicast (2/1) | IPv6 routing |
| VPNv4 (1/128) | MPLS L3VPN |
| VPNv6 (2/128) | IPv6 L3VPN |
| L2VPN EVPN (25/70) | VXLAN/EVPN fabrics |
| FlowSpec (1/133) | Traffic filtering rules via BGP |
| Link-State (16388/71) | BGP-LS (export IGP topology to controllers) |

---

## Common gotchas

- **iBGP full mesh** — N routers = N(N-1)/2 sessions; use route reflectors.
- **NEXT_HOP reachability** — iBGP next-hop must be reachable via IGP; use
  `next-hop-self` or redistribute.
- **AS_PATH loop detection** — eBGP rejects routes containing own AS; `allowas-in`
  overrides (use carefully).
- **Route flap damping** (RFC 2439) — historically over-aggressive; modern
  guidance (RFC 7196) softens parameters.
- **Convergence time** — MRAI timer (30 s for eBGP) limits update rate; BFD +
  fast-fallover for sub-second detection.
- **Maximum prefix** — protect against full-table leak crashing a session.

---

## Cross-links

- IP (what BGP routes) → [ipv4_ipv6.md](ipv4_ipv6.md)
- Routing security (RPKI) → [../../../14_Security/protocols/INDEX.md](../../../14_Security/protocols/INDEX.md)
- Data link / EVPN → [../../10_Network_DataLink/protocols/INDEX.md](../../10_Network_DataLink/protocols/INDEX.md)
- MPLS (label transport for VPN) → [../../10_Network_DataLink/protocols/INDEX.md](../../10_Network_DataLink/protocols/INDEX.md)
- TCP (BGP transport) → [../../12_Network_Transport/protocols/tcp.md](../../12_Network_Transport/protocols/tcp.md)
