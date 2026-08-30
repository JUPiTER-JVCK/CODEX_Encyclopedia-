---
title: "IPsec — Internet Protocol Security"
layer: 14_Security
tags: [ipsec, vpn, esp, ah, ikev2, rfc-4301, tunnel, transport]
updated: 2026-05-20
---

# IPsec — Internet Protocol Security

> **RFC 4301** (2005) — Security Architecture for IP.
> **ESP**: RFC 4303 — Encapsulating Security Payload.
> **AH**: RFC 4302 — Authentication Header (rarely used today).
> **IKEv2**: RFC 7296 — Internet Key Exchange v2.

IPsec provides **confidentiality, integrity, and authentication** at the
network layer — securing IP packets regardless of the application above.

---

## Modes

```
  Transport Mode                       Tunnel Mode
  ──────────────                       ───────────
  ┌──────┬──────┬─────────┐           ┌──────┬──────┬──────┬──────┬─────────┐
  │ IP   │ ESP  │ Payload │           │New IP│ ESP  │Orig  │Orig  │ Payload │
  │Header│Header│ (TCP/   │           │Header│Header│  IP  │L4 Hdr│         │
  │(orig)│      │  UDP)   │           │      │      │Header│      │         │
  └──────┴──────┴─────────┘           └──────┴──────┴──────┴──────┴─────────┘
  │←── encrypted ──→│                 │←──── encrypted ────────────→│
  │←── authenticated ──→│             │←──── authenticated ─────────→│

  Host-to-host                        Gateway-to-gateway (VPN tunnels)
  Original IP header preserved        New IP header wraps entire original packet
```

---

## ESP packet format

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ ─┐
|               Security Parameters Index (SPI)                | │
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ │
|                      Sequence Number                         | │ Clear
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ ─┤
|                    IV (if needed by cipher)                   | │
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ │
|                                                               | │
~                    Payload Data (variable)                    ~ │ Encrypted
|                                                               | │
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ │
|         Padding (0-255 bytes)          |  Pad Length | Next Hdr| │
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ ─┤
|         Integrity Check Value (ICV) — variable length         | │ Auth
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ ─┘
```

- **SPI** — identifies the Security Association (SA) at the receiver.
- **Sequence Number** — anti-replay (64-bit extended SN available).
- Modern suites: **AES-GCM** (combined AEAD), **ChaCha20-Poly1305**.

---

## IKEv2 exchange

```
  Initiator                              Responder
      │                                      │
      │── IKE_SA_INIT (proposals, KE, Ni) ──▶│    Exchange 1
      │◀── IKE_SA_INIT (proposal, KE, Nr) ──│    (DH + negotiate)
      │                                      │
      │     {encrypted from here}            │
      │                                      │
      │── IKE_AUTH (IDi, AUTH, SAi2, TSi) ──▶│    Exchange 2
      │◀── IKE_AUTH (IDr, AUTH, SAr2, TSr) ──│    (authenticate + child SA)
      │                                      │
      │     === CHILD SA (ESP) established === │
```

- **2 round-trips** to establish IKE SA + first Child SA.
- Auth methods: PSK, RSA/ECDSA certificates, EAP.
- **CREATE_CHILD_SA** — rekey or create additional SAs.
- **MOBIKE (RFC 4555)** — update IKE endpoints on IP change (mobile VPN).

---

## IPsec vs. WireGuard vs. OpenVPN

| Aspect | IPsec/IKEv2 | WireGuard | OpenVPN |
|--------|-------------|-----------|---------|
| Layer | 3 (IP) | 3 (IP) | 3 (TUN) or 2 (TAP) |
| Protocol | ESP (IP 50) | UDP | UDP or TCP |
| Crypto agility | Many suites | Fixed (ChaCha20, Curve25519) | Via OpenSSL |
| Code size | Large (kernel + IKE daemon) | ~4,000 LoC (kernel) | ~100K LoC (userspace) |
| Performance | Very fast (HW offload) | Fast (simple crypto path) | Moderate (userspace) |
| NAT traversal | UDP/4500 encapsulation | Native (UDP) | Native (UDP) |
| Configuration | Complex | Simple | Moderate |
| Standards | IETF RFCs | Informal spec | De facto |

---

## Common gotchas

- **NAT + ESP** — raw ESP (IP protocol 50) can't pass through NAT; use
  **NAT-T** (UDP/4500 encapsulation, RFC 3947).
- **MTU overhead** — ESP adds 50–73 bytes; tunnel mode adds another 20–40
  (outer IP). Set `tcp-mss-adjust` or clamp MSS.
- **Rekeying** — if rekey fails, traffic black-holes silently until SA expires;
  monitor SA lifetimes.
- **Policy vs. route-based** — policy-based IPsec complicates routing; modern
  deployments use VTI / XFRM interfaces (route-based).
- **Anti-replay window** — too small a window + packet reordering = drops;
  increase to 1024+ on high-speed links.
- **DPD (Dead Peer Detection)** — without it, a dead peer isn't noticed until
  SA lifetime expires.

---

## Cross-links

- IP (secured by IPsec) → [../../Network/11_Network_Internet/protocols/ipv4_ipv6.md](../../Network/11_Network_Internet/protocols/ipv4_ipv6.md)
- TLS (application-layer alternative) → [../../Network/13_Network_Application/protocols/tls.md](../../Network/13_Network_Application/protocols/tls.md)
- WireGuard → [INDEX.md](INDEX.md)
- VPN topic → [../topics/INDEX.md](../topics/INDEX.md)
