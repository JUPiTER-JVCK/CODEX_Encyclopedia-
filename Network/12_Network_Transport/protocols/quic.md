---
title: "QUIC — Quick UDP Internet Connections"
layer: 12_Network_Transport
tags: [quic, transport, http3, rfc-9000, rfc-9001, multiplexed]
updated: 2026-05-20
---

# QUIC — Quick UDP Internet Connections

> **RFC 9000** (2021) — QUIC transport protocol v1
> **RFC 9001** — Using TLS 1.3 to secure QUIC
> **RFC 9002** — Loss detection & congestion control
> Runs over **UDP port 443** (typically).

QUIC is a **multiplexed, encrypted, connection-oriented** transport built on
UDP. It integrates TLS 1.3 into the transport handshake, eliminates TCP's
head-of-line blocking via independent streams, and supports connection
migration across network changes.

---

## Why QUIC over TCP?

```
  TCP + TLS 1.3                        QUIC
  ─────────────                        ────
  1 RTT  TCP handshake                 1 RTT  QUIC handshake
  1 RTT  TLS handshake                        (transport + crypto combined)
  ─────────────────                    ──────────────────────────────
  2 RTT  total (1 RTT w/ TFO+0-RTT)   1 RTT  total (0-RTT on resumption)

  Lost segment → entire stream stalls  Lost packet → only affected stream stalls
  Middlebox ossification               Encrypted transport headers
  No connection migration              Connection ID survives IP change
```

---

## Packet structure

### Long header (handshake / 0-RTT)

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+
|1|1| Type (2b) |  Fixed Bit = 1, Long Header Form = 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                         Version (32)                         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| DCID Len (8)  |      Destination Connection ID (0..160)      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| SCID Len (8)  |        Source Connection ID (0..160)         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Type-Specific Fields ...                   |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

### Short header (post-handshake, 1-RTT data)

```
+-+-+-+-+-+-+-+-+
|0|1|S|R|R|K|P P|  Fixed Bit = 1, Short Header = 0
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                 Destination Connection ID (*)                |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                      Packet Number (8-32)                    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Protected Payload (*)                     |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

- **Connection ID** — not tied to IP:port; enables migration.
- **Packet Number** — never reused; monotonically increasing (no ambiguity
  like TCP retransmits).
- **Header protection** — packet number + first byte partially encrypted to
  resist ossification.

---

## Handshake timeline

```
    Client                                     Server
      │                                           │
      │─── Initial[0]: CRYPTO(ClientHello) ──────▶│
      │                                           │
      │◀── Initial[0]: CRYPTO(ServerHello) ───────│
      │◀── Handshake[0]: CRYPTO(Encrypted Ext, ──│
      │                   Certificate, Verify,    │
      │                   Finished)               │
      │                                           │
      │─── Handshake[0]: CRYPTO(Finished) ───────▶│
      │─── 1-RTT[0]: STREAM(application data) ──▶│
      │                                           │
      │        === HANDSHAKE COMPLETE ===          │
```

**0-RTT resumption**: client sends early data with a pre-shared key from a
previous session. Server may reject (replay risk).

---

## Stream multiplexing

```
  ┌────────────────────────────────────────────┐
  │              QUIC Connection               │
  │  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
  │  │ Stream 0 │ │ Stream 4 │ │ Stream 8 │   │
  │  │ (bidi)   │ │ (bidi)   │ │ (bidi)   │   │
  │  └──────────┘ └──────────┘ └──────────┘   │
  │  ┌──────────┐ ┌──────────┐                │
  │  │ Stream 2 │ │ Stream 6 │  (uni)         │
  │  └──────────┘ └──────────┘                │
  └────────────────────────────────────────────┘

  Stream IDs:
    Client-initiated bidi:  0, 4, 8, 12, ...
    Server-initiated bidi:  1, 5, 9, 13, ...
    Client-initiated uni:   2, 6, 10, 14, ...
    Server-initiated uni:   3, 7, 11, 15, ...
```

- Each stream has **independent flow control** (per-stream + per-connection).
- Lost frame on stream 4 does **not** block stream 0 (unlike TCP).
- Streams can be **reset** mid-flight (`RESET_STREAM` frame).

---

## Flow control

Two levels:
1. **Per-stream** — `MAX_STREAM_DATA` frames advertise how many bytes the
   receiver will accept on that stream.
2. **Per-connection** — `MAX_DATA` frames cap aggregate data across all streams.

No window scaling hacks — credit-based from the start.

---

## Loss detection & congestion control (RFC 9002)

- **Packet-number-based** — no retransmission ambiguity (unlike TCP seq reuse).
- **ACK frames** carry up to 256 ACK ranges (like unlimited SACK).
- **PTO (Probe Timeout)** — replaces TCP's RTO; sends probe instead of
  retransmitting blindly.
- Default CC is **NewReno**; implementations commonly use **CUBIC** or **BBR**.

---

## Connection migration

```
    Client (Wi-Fi: 10.0.0.5)              Server
      │                                      │
      │─── [CID=0xAB12] data ──────────────▶│
      │                                      │
    (client switches to cellular: 192.168.1.7)
      │                                      │
      │─── [CID=0xAB12] PATH_CHALLENGE ────▶│
      │◀── [CID=0xAB12] PATH_RESPONSE ──────│
      │                                      │
      │─── [CID=0xAB12] data (new path) ───▶│
```

Connection ID is **not** tied to the 4-tuple → survives IP changes.
`PATH_CHALLENGE` / `PATH_RESPONSE` validate the new path.

---

## QUIC ecosystem RFCs

| RFC | Title |
|-----|-------|
| 9000 | QUIC Transport v1 |
| 9001 | Using TLS 1.3 to Secure QUIC |
| 9002 | Loss Detection & Congestion Control |
| 9114 | HTTP/3 (application mapping) |
| 9221 | Unreliable Datagram Extension |
| 9298 | Proxying UDP in HTTP (MASQUE) |
| 9369 | QUIC Version 2 (v2) |
| 9443 | QUIC Multipath |

---

## Implementations

| Library | Language | Notes |
|---------|----------|-------|
| quiche | Rust (C API) | Cloudflare; used in curl |
| ngtcp2 | C | Underlying lib for curl QUIC |
| msquic | C | Microsoft; Windows kernel + userspace |
| quinn | Rust | Async, tokio-native |
| quic-go | Go | Used by Caddy, Traefik |
| aioquic | Python | asyncio-based |
| s2n-quic | Rust | AWS |
| picoquic | C | Research / reference |
| lsquic | C | LiteSpeed |

---

## Common gotchas

- **UDP blocking** — some enterprise firewalls block non-53/non-123 UDP;
  QUIC falls back to TCP (HTTP/2) via Alt-Svc timeout.
- **0-RTT replay** — early data can be replayed; servers must make 0-RTT
  handlers idempotent or reject early data for non-safe requests.
- **Amplification limit** — server must not send >3× bytes received before
  address validation (anti-amplification).
- **Stateless reset** — if server loses state, it sends a reset token; client
  must handle gracefully.
- **PMTU discovery** — QUIC does its own DPLPMTUD; no IP fragmentation
  (DF always set on IPv4).

---

## Cross-links

- TCP (predecessor) → [tcp.md](tcp.md)
- UDP (carrier) → [udp.md](udp.md)
- HTTP/3 (over QUIC) → [../../13_Network_Application/protocols/http.md](../../13_Network_Application/protocols/http.md)
- TLS 1.3 (integrated) → [../../13_Network_Application/protocols/tls.md](../../13_Network_Application/protocols/tls.md)
- IP layer → [../../11_Network_Internet/protocols/ipv4_ipv6.md](../../11_Network_Internet/protocols/ipv4_ipv6.md)
