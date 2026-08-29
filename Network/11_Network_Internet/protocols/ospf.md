---
title: "OSPF — Open Shortest Path First"
layer: 11_Network_Internet
tags: [ospf, routing, igp, link-state, rfc-2328, rfc-5340, spf, dijkstra]
updated: 2026-05-21
---

# OSPF — Open Shortest Path First

> **OSPFv2**: RFC 2328 (1998) — IPv4.
> **OSPFv3**: RFC 5340 (2008) — IPv6 (and IPv4 via address families, RFC 5838).
> IP protocol number **89** (directly over IP, not TCP/UDP).

OSPF is a **link-state IGP** that builds a complete topology map of its area,
runs Dijkstra's SPF algorithm to compute shortest paths, and converges in
seconds. It's the most widely deployed IGP in enterprise networks.

---

## How OSPF works (high-level)

```
  1. Discover neighbors          (Hello packets)
  2. Form adjacencies            (2-Way → ExStart → Exchange → Loading → Full)
  3. Exchange LSAs               (Link-State Advertisements — the topology database)
  4. Build LSDB                  (Link-State Database — identical within an area)
  5. Run SPF (Dijkstra)          (compute shortest-path tree rooted at self)
  6. Install routes              (best next-hop per destination into RIB/FIB)
```

---

## Packet types

| Type | Name | Purpose |
|------|------|---------|
| 1 | Hello | Neighbor discovery, keepalive, DR/BDR election |
| 2 | Database Description (DBD) | Summary of LSDB during adjacency formation |
| 3 | Link-State Request (LSR) | Request specific LSAs from neighbor |
| 4 | Link-State Update (LSU) | Carry one or more LSAs |
| 5 | Link-State Ack (LSAck) | Acknowledge received LSAs |

All OSPF packets share a common header:

```
 ┌──────────┬──────────┬──────────────────────┐
 │ Version  │  Type    │    Packet Length      │
 │  (1 B)   │  (1 B)   │      (2 B)           │
 ├──────────┴──────────┴──────────────────────┤
 │              Router ID (4 B)                │
 ├─────────────────────────────────────────────┤
 │              Area ID (4 B)                  │
 ├──────────────────────┬──────────────────────┤
 │    Checksum (2 B)    │   Auth Type (2 B)    │
 ├──────────────────────┴──────────────────────┤
 │         Authentication Data (8 B)           │
 └─────────────────────────────────────────────┘
```

---

## Neighbor state machine

```
  Down ──▶ Init ──▶ 2-Way ──▶ ExStart ──▶ Exchange ──▶ Loading ──▶ Full
   │         │        │
   │         │        └── (non-DR/BDR on broadcast: stop at 2-Way)
   │         │
   │         └── recv Hello with own RID in neighbor list
   │
   └── recv Hello from unknown neighbor
```

- **Hello interval**: 10 s (broadcast/P2P), 30 s (NBMA). **Dead interval**: 4× Hello.
- **DR/BDR election**: on broadcast/NBMA segments; reduces adjacency count from
  N(N-1)/2 to N (everyone peers with DR + BDR only).

---

## Area design

```
                    ┌──────────────────────┐
                    │     Area 0           │
                    │   (Backbone)         │
                    │                      │
                    │  ABR──────────ABR    │
                    └──┬───────────┬───────┘
                       │           │
              ┌────────▼──┐  ┌────▼────────┐
              │  Area 1   │  │  Area 2     │
              │ (normal)  │  │ (stub)      │
              │           │  │ no ext LSAs │
              └───────────┘  └─────────────┘
```

| Area type | External LSAs? | Default route? | Use |
|-----------|---------------|----------------|-----|
| Normal | Yes | No | Standard |
| Stub | No | Yes (from ABR) | Reduce LSDB in leaf areas |
| Totally Stubby | No (+ no inter-area) | Yes | Maximum LSDB reduction |
| NSSA | No (Type-7 instead) | Configurable | Stub with local redistribution |

- **ABR** (Area Border Router) — connects area to backbone.
- **ASBR** (AS Boundary Router) — redistributes external routes into OSPF.
- **Virtual link** — extends backbone through a transit area (design smell).

---

## LSA types

| Type | Name | Scope | Originated by |
|------|------|-------|---------------|
| 1 | Router LSA | Area | Every router |
| 2 | Network LSA | Area | DR on broadcast segment |
| 3 | Summary LSA (Network) | Area | ABR (inter-area prefixes) |
| 4 | Summary LSA (ASBR) | Area | ABR (ASBR reachability) |
| 5 | AS-External LSA | Domain | ASBR (external routes) |
| 7 | NSSA External LSA | NSSA area | ASBR in NSSA |

---

## SPF algorithm (Dijkstra)

```
  Input:  LSDB (all Type-1 and Type-2 LSAs in the area)
  Output: Shortest-Path Tree rooted at this router

  1. Initialize: self = root, cost = 0, all others = ∞
  2. For current node, examine all neighbors via their LSAs
  3. Update tentative cost if new path is shorter
  4. Move cheapest tentative node to confirmed set
  5. Repeat until all nodes confirmed
  6. For each destination prefix, install next-hop from the tree
```

**Incremental SPF (iSPF)** — modern implementations only recompute the
affected subtree, not the entire graph.

**SPF throttle** — rate-limit SPF runs during instability (initial delay +
hold + max-wait).

---

## OSPF cost & metrics

```
  Default cost = Reference BW / Interface BW

  Cisco default reference: 100 Mbps → cost of 100M/BW
    10 Gbps  → cost 1     (auto-cost reference-bandwidth 10000 needed)
    1 Gbps   → cost 1     (same with default 100M ref — bad!)
    100 Mbps → cost 1
    10 Mbps  → cost 10

  ⚠️  All links ≥ reference BW get cost 1.
      Always set `auto-cost reference-bandwidth` to match your fastest link.
```

---

## Authentication

| Method | Security | Notes |
|--------|----------|-------|
| Null (Type 0) | None | Default |
| Simple password (Type 1) | Cleartext | Don't use |
| MD5 (Type 2) | HMAC-MD5 | Legacy but common |
| SHA-256 / SHA-384 / SHA-512 | HMAC (RFC 7474) | Modern, recommended |
| IPsec AH (OSPFv3) | Strong | Native to v3 |

---

## Common gotchas

- **Mismatched Hello/Dead timers** — neighbors won't form; #1 troubleshooting step.
- **Mismatched area ID** — same result; silent.
- **MTU mismatch** — DBD exchange hangs at ExStart/Exchange; `ip ospf mtu-ignore`
  as workaround (fix the MTU properly).
- **DR election on P2P** — wasteful; use `ip ospf network point-to-point`.
- **Cost = 1 for all fast links** — set reference bandwidth explicitly.
- **Forwarding address 0.0.0.0** — Type-5 LSA traffic goes to ASBR instead of
  the actual next-hop; can cause suboptimal routing.
- **LSDB size in large flat designs** — use areas to partition the SPF domain.

---

## Cross-links

- BGP (eBGP for inter-AS, OSPF for intra-AS) → [bgp.md](bgp.md)
- IP (OSPF routes IP prefixes) → [ipv4_ipv6.md](ipv4_ipv6.md)
- IS-IS (alternative link-state IGP) → [INDEX.md](INDEX.md)
- BFD (fast failure detection) → [INDEX.md](INDEX.md)
- Security (OSPF auth) → [../../../14_Security/protocols/INDEX.md](../../../14_Security/protocols/INDEX.md)
