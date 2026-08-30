# Network Transport — Protocols

## Dedicated protocol references

| Protocol | File |
|----------|------|
| TCP | [tcp.md](tcp.md) — segment header, state machine, congestion control, ASCII diagrams |
| UDP | [udp.md](udp.md) — datagram format, offloads, amplification attacks |
| QUIC | [quic.md](quic.md) — packet structure, handshake, stream multiplexing, migration |

---

## Core transport protocols
| Protocol | RFC(s) | IP proto # | Properties |
|----------|--------|-----------|------------|
| TCP | 9293 (consolidated; supersedes 793) | 6 | Connection, ordered, reliable, congestion-controlled |
| UDP | 768 | 17 | Connectionless, unordered, unreliable |
| QUIC | 9000, 9001, 9002 | 17 (over UDP) | Multiplexed streams, built-in TLS 1.3, conn migration |
| SCTP | 4960 | 132 | Message-oriented, multi-stream, multi-homed |
| DCCP | 4340 | 33 | UDP-like with congestion control (niche) |
| UDP-Lite | 3828 | 136 | UDP with partial checksum coverage |

## TCP extensions
| RFC | Feature |
|-----|---------|
| 1323 / 7323 | Window scaling, TS, PAWS |
| 2018 / 2883 | SACK / DSACK |
| 3168 | ECN |
| 5681 | Standard congestion control (Reno) |
| 9438 | CUBIC |
| 7413 | TCP Fast Open |
| 7414 | RFC roadmap |
| 8684 | Multipath TCP (MPTCP v1) |
| 8985 | RACK-TLP loss detection |

## QUIC ecosystem
| RFC | Title |
|-----|-------|
| 9000 | QUIC v1 transport |
| 9001 | Using TLS to secure QUIC |
| 9002 | QUIC loss detection & congestion control |
| 9114 | HTTP/3 |
| 9221 | Unreliable Datagram Extension |
| 9298 | MASQUE / CONNECT-UDP |
| 9484 | QUIC version 2 (v2) |

## SCTP extensions
| RFC | Feature |
|-----|---------|
| 3758 | PR-SCTP (partial reliability) |
| 5061 | Dynamic Address Reconfiguration |
| 8260 | Stream Schedulers |

## ECN / L4S
| RFC | Title |
|-----|-------|
| 3168 | Explicit Congestion Notification |
| 8311 | Updates for L4S experimentation |
| 9331 | L4S architecture |
| 9332 | DualQ Coupled AQM |

## Sockets / shim protocols
- **Berkeley sockets** — de-facto API
- **SOCKS5 (RFC 1928)** — proxy protocol
- **PROXY protocol v1/v2** (HAProxy) — preserve client info through L4 LB

## NAT traversal / signaling
| Protocol | RFC | Purpose |
|----------|-----|---------|
| STUN | 8489 | NAT discovery |
| TURN | 8656 | Relayed transport |
| ICE | 8445 | Combined STUN/TURN candidate gathering |
