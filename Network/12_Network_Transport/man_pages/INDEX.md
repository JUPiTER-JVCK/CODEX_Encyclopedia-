# Network Transport — Manual Pages

## Dedicated man page references

| Topic | File |
|-------|------|
| Transport layer tools | [transport_tools.md](transport_tools.md) — ss, netstat, nc, socat, iperf3, tcpdump |

---

## Socket / connection inspection
| Command | Purpose |
|---------|---------|
| `ss -tnp` | Listening + established TCP, with PIDs |
| `ss -unp` | UDP sockets |
| `ss -ltp` | Listening TCP only |
| `ss -i` | Per-socket info (cwnd, rtt, retrans) |
| `netstat -tunap` | Legacy equivalent |
| `lsof -i` | Open network files |
| `fuser -n tcp 443` | Which PIDs own a port |

## Active testing
| Command | Purpose |
|---------|---------|
| `nc` / `ncat` | TCP/UDP client+server swiss army knife |
| `socat` | Proxy/relay between addresses |
| `iperf3` | Throughput tests (TCP/UDP) |
| `tcpkali` | Stress test client |
| `wrk` / `wrk2` / `vegeta` | HTTP/TCP load test |

## Capture & analysis
| Command | Purpose |
|---------|---------|
| `tcpdump -i eth0 tcp port 443` | Live capture |
| `tshark -Y "tcp.analysis.retransmission"` | Filter retransmits |
| `wireshark` / `tshark -z conv,tcp` | Conversation summaries |
| `tcptrace` | Per-connection analysis from PCAP |
| `mtr --tcp` | Path probe via TCP SYN |

## Tuning
| Command | Purpose |
|---------|---------|
| `sysctl net.ipv4.tcp_congestion_control` | View/set CC algorithm |
| `sysctl net.core.rmem_max` etc | Socket buffer sizes |
| `sysctl net.ipv4.tcp_fastopen` | TFO mode |
| `ethtool -K eth0 gso on` | Offloads (GRO/GSO/TSO/LRO) |
| `tc qdisc` | Queueing disciplines (fq, fq_codel, cake) |

## QUIC / HTTP/3
| Command | Purpose |
|---------|---------|
| `curl --http3` | HTTP/3 request (build-dependent) |
| `quiche-client`, `quic-go` examples | QUIC clients/servers |
| `chrome://flags` (Chrome) | Toggle QUIC versions |

## Windows
- `Get-NetTCPConnection`, `Get-NetUDPEndpoint`
- `netsh interface tcp show global`
- `Test-NetConnection -Port 443`

## macOS
- `nettop`, `netstat -an`, `lsof -i`, `tcpdump`
