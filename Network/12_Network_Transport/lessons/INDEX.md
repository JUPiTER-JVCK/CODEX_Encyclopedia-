
## Dedicated Lesson Modules

| File | Covers |
|------|--------|
| [Network Transport — Interactive Labs](./transport_labs.md) | TCP handshake capture, congestion window, UDP load test |

# Network Transport — Lessons

1. **BSD sockets** — TCP echo server in C / Python / Go / Rust.
2. **Non-blocking I/O** — `select`, `poll`, `epoll` (Linux), `kqueue` (BSD/macOS), IOCP (Win).
3. **Modern async** — `io_uring`, `tokio`, asyncio: same echo server, different paradigm.
4. **Three-way handshake observed** — capture with Wireshark; SYN, SYN-ACK, ACK.
5. **TCP teardown** — FIN, TIME_WAIT, half-close.
6. **Congestion control comparison** — `iperf3` runs with `sysctl net.ipv4.tcp_congestion_control` flipped between cubic and bbr.
7. **Nagle vs delayed ACK** — interactive write patterns; the 200ms surprise.
8. **TCP_FASTOPEN** — enable, observe SYN cookies.
9. **TLS-on-TCP socket** — `openssl s_client`/`s_server`; compare overhead to plain TCP.
10. **QUIC server** — `quic-go`, `msquic`, or `quiche`: HTTP/3 hello.
11. **UDP reliability** — write a simple ACK/retransmit protocol; learn why TCP exists.
12. **SCTP basics** — `socket(AF_INET, SOCK_STREAM, IPPROTO_SCTP)` on Linux.

## Suggested external
- Beej's Guide to Network Programming (free, classic)
- *High Performance Browser Networking* online
