# 12 — Network Transport (OSI L4)

> End-to-end delivery. Sockets, ports, reliability, congestion control, flow
> control. The handshake-and-window machinery that turns IP packets into
> usable byte streams or messages.

## At a glance

| Field | Value |
|-------|-------|
| OSI layer | 4 (Transport) |
| Description | End-to-end byte streams or datagrams, with optional reliability/order |
| Protocols | TCP, UDP, QUIC, SCTP, DCCP |
| Medium | IP packets |
| Example | TCP three-way handshake establishes a connection |
| Adjacent | ↓ [11_Network_Internet](../11_Network_Internet/), ↑ [13_Network_Application](../13_Network_Application/) |

## What lives here

- **TCP** — connection-oriented, ordered, reliable, congestion-controlled
- **UDP** — connectionless, unordered, unreliable, lightweight
- **QUIC** — UDP-based, multiplexed streams, built-in TLS 1.3, modern
- **SCTP** — message-oriented, multi-stream, multi-homed (signaling, WebRTC)
- **DCCP** — congestion-controlled UDP variant (niche)
- **Sockets API** — BSD sockets, Winsock, modern alternatives (io_uring, kqueue, IOCP)
- **Congestion control** — Reno, CUBIC, BBR, BBRv2/v3, DCTCP

## Sub-sections

- [references/](references/INDEX.md) — TCP/IP Illustrated v1+v2, QUIC docs
- [lessons/](lessons/INDEX.md) — socket programming → tune TCP → QUIC server
- [languages/](languages/INDEX.md) — socket APIs across languages
- [man_pages/](man_pages/INDEX.md) — `ss`, `netstat`, `nc`, `socat`, `iperf3`
- [topics/](topics/INDEX.md) — handshake, cwnd, sack, TFO, MPTCP, BBR
- [protocols/](protocols/INDEX.md) — TCP/UDP/QUIC/SCTP RFC table

## Cross-references
- IP packets beneath → [11_Network_Internet](../11_Network_Internet/)
- App protocols above → [13_Network_Application](../13_Network_Application/)
- TLS rides on TCP (and is part of QUIC) → [13_Network_Application/protocols](../13_Network_Application/protocols/INDEX.md)
- Socket-level kernel internals → [05_OS_Kernel/topics](../../05_OS_Kernel/topics/INDEX.md)
