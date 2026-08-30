# Network Transport — Topics

## TCP fundamentals
- **Three-way handshake** — SYN → SYN-ACK → ACK; SYN cookies under flood.
- **State machine** — LISTEN, SYN-SENT, ESTABLISHED, FIN-WAIT, TIME-WAIT, etc.
- **Sequence/ACK numbers** — byte-level; PAWS protection.
- **Window** — receive (rwnd) + congestion (cwnd); MSS announce.
- **Options** — MSS, WSCALE, SACK, TS, MP_TCP.

## Reliability
- **Retransmission** — RTO computation (Karn, RFC 6298), fast retransmit (3 dup ACKs).
- **SACK / DSACK** — selective + duplicate.
- **Reordering tolerance** — RACK.
- **PRR** — Proportional Rate Reduction during loss.

## Congestion control
- **AIMD baseline** — additive increase, multiplicative decrease.
- **Reno / NewReno** — classic.
- **CUBIC** — Linux/Windows default (BIC successor).
- **BBR / BBRv2 / BBRv3** — bandwidth-RTT model.
- **DCTCP / ABE** — datacenter ECN-aware.
- **HTCP**, **Vegas**, **Westwood+** — historical / niche.

## Flow control & window scaling
- **Receive window** + **WSCALE** option.
- **Silly Window Syndrome** mitigations.

## Fast features
- **TCP Fast Open (RFC 7413)** — data in SYN with cookie.
- **TLS 1.3 0-RTT** — application layer counterpart.
- **Pacing** — fq qdisc + BBR.

## Multipath
- **MPTCP (RFC 8684)** — multiple subflows, single byte-stream.
- **Connection migration** in QUIC.

## UDP
- **No connection / no ACKs.**
- **Datagram boundaries preserved.**
- **Use cases** — DNS, NTP, video/audio (RTP), QUIC, custom protocols.
- **GSO/GRO for UDP** — modern Linux performance.

## QUIC
- **Header** — short vs long, connection ID, packet number.
- **Streams** — bidi/uni, flow control per-stream + per-connection.
- **0-RTT** and resumption.
- **Connection migration** — survives address change.
- **Built-in TLS 1.3** — no separate handshake.
- **Loss recovery (RFC 9002)**.

## SCTP
- **Multi-streaming** — head-of-line blocking per-stream only.
- **Multi-homing** — multiple IPs per association.
- **Partial reliability** (PR-SCTP).
- **Used in WebRTC data channels (over DTLS)**, **Diameter, SIGTRAN**.

## Sockets & I/O models
- **Blocking / non-blocking / multiplexed** (`select`/`poll`/`epoll`/`kqueue`).
- **Async submission** — `io_uring` (Linux), IOCP (Windows), Network.framework (Apple).
- **Zero-copy** — `sendfile`, `splice`, MSG_ZEROCOPY.
- **Offloads** — TSO/GSO/LRO/GRO/RSS/RPS.

## ECN / L4S
- **Classic ECN (RFC 3168)**.
- **L4S (RFC 9331/9332)** — DCTCP-style marking in the open internet.

## Security cross-link
- TCP RST / SYN flood / amplification → [14_Security/topics](../../../14_Security/topics/INDEX.md)
- QUIC's TLS 1.3 → [13_Network_Application/protocols](../../13_Network_Application/protocols/INDEX.md)
