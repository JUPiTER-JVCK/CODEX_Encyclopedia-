---
title: "TCP — Transmission Control Protocol"
layer: 12_Network_Transport
tags: [tcp, transport, reliable, connection-oriented, rfc-9293]
updated: 2026-05-20
---

# TCP — Transmission Control Protocol

> **RFC 9293** (2022, consolidates original RFC 793 + decades of errata and updates)
> IP protocol number **6**.

TCP provides **reliable, ordered, byte-stream** delivery over an unreliable
network. It is the workhorse of the Internet — HTTP, SSH, SMTP, databases, and
most application protocols ride on TCP.

---

## Segment header layout

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Source Port          |       Destination Port        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                        Sequence Number                       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Acknowledgment Number                     |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Data |       |C|E|U|A|P|R|S|F|                              |
| Offset| Rsrvd |W|C|R|C|S|S|Y|I|            Window            |
|  (4b) | (4b)  |R|E|G|K|H|T|N|N|                              |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|           Checksum            |         Urgent Pointer        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Options (variable, 0-40 B)                |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                             Data                             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

- **Data Offset** — header length in 32-bit words (min 5 = 20 B, max 15 = 60 B).
- **Flags**: CWR, ECE (congestion), URG, ACK, PSH, RST, SYN, FIN.
- **Window** — 16-bit; with WSCALE option (RFC 7323) can reach 1 GiB.
- **Checksum** — pseudo-header + segment; mandatory for IPv4, IPv6.

---

## Three-way handshake

```
    Client                          Server
      |                               |
      |---- SYN (seq=x) ------------>|
      |                               |
      |<--- SYN-ACK (seq=y, ack=x+1)-|
      |                               |
      |---- ACK (ack=y+1) ---------->|
      |                               |
      |      === ESTABLISHED ===      |
```

- **SYN cookies** — stateless defense against SYN floods: encode state in the
  initial sequence number so the server needs no TCB until ACK arrives.
- **TCP Fast Open (RFC 7413)** — data in the SYN using a cached cookie;
  saves 1 RTT on repeat connections.

---

## Connection teardown

```
    Client                          Server
      |                               |
      |---- FIN (seq=u) ------------>|   (active close)
      |                               |
      |<--- ACK (ack=u+1) ---------- |
      |                               |   (server may send more data)
      |<--- FIN (seq=v) ------------ |   (passive close)
      |                               |
      |---- ACK (ack=v+1) ---------->|
      |                               |
      |   [TIME-WAIT: 2×MSL]         |
```

**Half-close** — one side sends FIN but continues receiving (`shutdown(SHUT_WR)`).

---

## TCP state machine

```
                              ┌──────────┐
                    (passive) │  LISTEN   │
                    open      └────┬─────┘
                                   │ recv SYN / send SYN+ACK
                              ┌────▼─────┐
            (active)          │ SYN-RCVD  │
             open             └────┬─────┘
   ┌──────────┐                    │ recv ACK
   │ SYN-SENT │────────────────────┤
   └────┬─────┘ recv SYN+ACK      │
        │       / send ACK    ┌────▼──────────┐
        └────────────────────>│  ESTABLISHED   │
                              └───┬───────┬───┘
                   send FIN       │       │ recv FIN
                              ┌───▼────┐ ┌▼────────┐
                              │FIN-WAIT│ │CLOSE-WAIT│
                              │   1    │ └────┬─────┘
                              └───┬────┘      │ send FIN
                   recv FIN+ACK   │      ┌────▼────┐
                              ┌───▼────┐ │ LAST-ACK│
                              │FIN-WAIT│ └────┬────┘
                              │   2    │      │ recv ACK
                              └───┬────┘ ┌────▼────┐
                   recv FIN       │      │  CLOSED  │
                              ┌───▼─────┐└─────────┘
                              │CLOSING  │
                              └───┬─────┘
                                  │ recv ACK
                              ┌───▼──────┐
                              │TIME-WAIT │──▶ (2×MSL timeout) ──▶ CLOSED
                              └──────────┘
```

---

## Congestion control

```
   cwnd
    ^
    │         ╱╲          Slow-start          Congestion avoidance
    │        ╱  ╲         (expo growth)       (linear / AIMD)
    │       ╱    ╲
    │      ╱      ╲ ssthresh
    │     ╱        ╲─────────────────────────
    │    ╱                    ╱      ╱
    │   ╱                   ╱      ╱
    │  ╱                   ╱      ╱ ← loss event
    │ ╱                   ╱      ╱    cwnd halved
    │╱                   ╱      ╱
    └─────────────────────────────────▶ time
```

| Algorithm | RFC / Source | Key idea |
|-----------|-------------|----------|
| Reno / NewReno | 5681 / 6582 | AIMD, 3-dup-ACK fast retransmit |
| CUBIC | 9438 | Cubic function around W_max; Linux/Windows default |
| BBR v1/v2/v3 | Google | Model max bandwidth + min RTT; pacing-based |
| DCTCP | 3168 + 8257 | ECN marks → proportional window cut; datacenter |
| HTCP | 4782 | Binary search around W_max |
| Vegas | Brakmo 1994 | RTT-based (delay signal, not loss) |

---

## Key extensions (RFC quick-ref)

| RFC | Feature | One-liner |
|-----|---------|-----------|
| 7323 | Window Scale + Timestamps | >64 KB windows; RTT measurement; PAWS |
| 2018 / 2883 | SACK / DSACK | Selective acknowledgments |
| 3168 | ECN | Router-marked congestion signals |
| 7413 | TCP Fast Open | Data in SYN (saves 1 RTT) |
| 8684 | Multipath TCP v1 | Multiple subflows, one byte stream |
| 8985 | RACK-TLP | Modern loss detection (replaces dup-ACK) |
| 9293 | Consolidated TCP | Supersedes 793 + errata |

---

## Common gotchas

- **TIME-WAIT accumulation** — port exhaustion on high-rate short-lived connections;
  mitigate with `SO_REUSEADDR`, `tcp_tw_reuse`, or connection pooling.
- **Nagle vs. delayed ACK** — Nagle (RFC 896) coalesces small writes; delayed ACK
  waits 40 ms. Together they can add latency; disable Nagle with `TCP_NODELAY`
  on interactive / RPC workloads.
- **Head-of-line blocking** — one lost segment stalls the entire byte stream
  (QUIC fixes this with per-stream framing).
- **Bufferbloat** — deep buffers + loss-based CC = excessive latency; ECN + AQM
  (CoDel, fq_codel, PIE) or BBR help.
- **Middlebox ossification** — firewalls/NATs may drop packets with unknown TCP
  options (MPTCP, TFO); reason QUIC moved to UDP.
- **RST injection** — censorship / attack vector; mitigated by TLS + QUIC.

---

## Cross-links

- UDP → [udp.md](udp.md)
- QUIC → [quic.md](quic.md)
- TLS (secures TCP) → [../../13_Network_Application/protocols/tls.md](../../13_Network_Application/protocols/tls.md)
- IP (carries TCP) → [../../11_Network_Internet/protocols/ipv4_ipv6.md](../../11_Network_Internet/protocols/ipv4_ipv6.md)
- TCP attacks → [../../../14_Security/topics/INDEX.md](../../../14_Security/topics/INDEX.md)
- Socket I/O models → [../topics/INDEX.md](../topics/INDEX.md)
