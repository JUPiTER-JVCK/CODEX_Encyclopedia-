# Network Transport — Languages

The BSD sockets API has been ported into every mainstream language. The
interesting comparisons are the *async / event loop* models on top.

## Socket APIs by language
| Language | Sync sockets | Async / event |
|----------|--------------|---------------|
| C | `<sys/socket.h>` | `epoll`/`kqueue`/`io_uring`, libevent, libev, libuv |
| C++ | same as C, Boost.Asio, ASIO | Asio + coroutines, libuv |
| Python | `socket` | `asyncio`, `trio`, `anyio`; `selectors` |
| Go | `net` | goroutines + netpoller (epoll/kqueue under the hood) |
| Rust | `std::net` (sync) | `tokio`, `async-std`, `smol`, `monoio` (io_uring) |
| Java | `java.net.Socket`, NIO | NIO `Selector`, Project Loom virtual threads, Netty |
| Kotlin | same as Java | `kotlinx.coroutines` |
| Node.js | `net`, `dgram` | built on libuv |
| .NET | `System.Net.Sockets` | async/await, `IOCP` under the hood |
| Erlang/Elixir | `gen_tcp`, `gen_udp` | BEAM-native concurrency |
| Ruby | `Socket` | `async` gem, Fiber scheduler |
| Swift | `Network.framework` | Combine, async/await |

## QUIC libraries
| Library | Language | Notes |
|---------|----------|-------|
| quiche | Rust + C ABI | Cloudflare |
| msquic | C | Microsoft, cross-platform |
| quic-go | Go | Pure Go |
| ngtcp2 + nghttp3 | C | OpenSSL/BoringSSL bindings |
| aioquic | Python | Reference-ish |
| s2n-quic | Rust | AWS |

## SCTP
- `lksctp-tools` (Linux), `usrsctp` (userspace), `socket(2)` with `IPPROTO_SCTP`.
