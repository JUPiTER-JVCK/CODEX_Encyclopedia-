---
title: "Transport Layer Tools"
layer: 12_Network_Transport
section: man_pages
tags: [ss, netstat, nc, socat, iperf3, tcpdump, transport, tcp, udp, man-section-1, man-section-8]
updated: 2026-05-21
---

# Transport Layer Tools

> Tools for inspecting sockets, testing connectivity, measuring throughput,
> and capturing transport-layer traffic.

---

## ss --- socket statistics

### Synopsis

```
ss [options] [filter]
```

### Description

The modern replacement for `netstat`. Reads socket information directly from
kernel netlink, making it faster and more detailed. Shows TCP, UDP, UNIX,
RAW, and packet sockets with connection state, timers, and memory info.

### Key Options

| Flag | Purpose |
|------|---------|
| `-t` | TCP sockets |
| `-u` | UDP sockets |
| `-l` | Listening only |
| `-a` | All (listening + established) |
| `-n` | Numeric (no DNS resolution) |
| `-p` | Show process using socket |
| `-e` | Extended info (uid, inode, sk) |
| `-i` | Internal TCP info (cwnd, rtt, retrans) |
| `-m` | Memory usage per socket |
| `-s` | Summary statistics |
| `-4` / `-6` | IPv4 / IPv6 only |
| `-o` | Show timer info |

### State filter

```
ss state FILTER
  established    Connected and active
  syn-sent       SYN sent, awaiting SYN-ACK
  syn-recv       SYN received, sent SYN-ACK
  fin-wait-1     FIN sent, awaiting ACK
  fin-wait-2     FIN ACKed, awaiting peer FIN
  time-wait      Closed, waiting 2×MSL
  close-wait     Peer sent FIN, local not yet closed
  last-ack       Sent FIN in close-wait, awaiting ACK
  listen         Listening for connections
  closing        Both sides sent FIN simultaneously
```

### TCP state diagram (simplified)

```
  Client                          Server
  ──────                          ──────
  CLOSED                          LISTEN
    │ SYN ──────────────────────▸   │
    │                        SYN-RECV
    │ ◂────────────── SYN+ACK       │
  ESTABLISHED                       │
    │ ACK ──────────────────────▸   │
    │                        ESTABLISHED
    │                               │
    │ FIN ──────────────────────▸   │
  FIN-WAIT-1                   CLOSE-WAIT
    │ ◂──────────────────── ACK     │
  FIN-WAIT-2                       │
    │ ◂──────────────────── FIN     │
    │                         LAST-ACK
  TIME-WAIT                        │
    │ ACK ──────────────────────▸   │
    │ (2×MSL timeout)          CLOSED
  CLOSED
```

### Examples

```bash
# All TCP connections with processes
ss -tnp

# Listening TCP ports
ss -tlnp
# State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port  Process
# LISTEN  0       128     0.0.0.0:22          0.0.0.0:*          users:(("sshd",pid=1234,fd=3))
# LISTEN  0       511     0.0.0.0:80          0.0.0.0:*          users:(("nginx",pid=5678,fd=6))

# TCP internal info (congestion window, RTT)
ss -ti dst 8.8.8.8
#   cubic wscale:7,7 rto:204 rtt:8.1/0.5 cwnd:10 send 14.4Mbps

# Connections in TIME-WAIT
ss state time-wait

# Socket memory usage
ss -tm

# Summary
ss -s
# TCP:   45 (estab 12, closed 8, orphaned 0, timewait 8)
```

---

## nc (netcat / ncat) --- network swiss army knife

### Synopsis

```
nc [-lvnz] [-p port] [-w timeout] [-e prog] host port
ncat [--ssl] [--sh-exec cmd] [-l] [-p port] host port
```

### Description

Reads and writes data across TCP/UDP connections. Used for port scanning,
file transfer, banner grabbing, simple chat, and as a building block for
shell scripts. `ncat` (from nmap) adds SSL, access control, and proxying.

### Key Options

| Flag | Purpose |
|------|---------|
| `-l` | Listen mode |
| `-v` | Verbose |
| `-n` | Numeric only (no DNS) |
| `-z` | Zero I/O — scan (connect then close) |
| `-p PORT` | Source port |
| `-w N` | Timeout |
| `-u` | UDP mode |
| `-e /bin/bash` | Execute program on connect (dangerous) |
| `-k` | Keep listening after client disconnects |

### Examples

```bash
# Port scan
nc -zv host 20-25
# Connection to host 22 port [tcp/ssh] succeeded!

# Banner grab
echo "" | nc -w3 host 80

# Simple file transfer
# Receiver:
nc -l -p 9999 > file.tar.gz
# Sender:
nc host 9999 < file.tar.gz

# Chat (bidirectional)
# Side A: nc -l -p 4444
# Side B: nc hostA 4444

# HTTP request by hand
printf "GET / HTTP/1.1\r\nHost: example.com\r\n\r\n" | nc example.com 80

# Listen with ncat + SSL
ncat --ssl -l -p 4443
```

---

## socat --- multipurpose relay

### Synopsis

```
socat [options] address1 address2
```

### Description

Bidirectional data relay between two addresses. Far more powerful than netcat:
supports TCP, UDP, UNIX sockets, SSL, serial ports, PTYs, pipes, exec, and
SOCKS/HTTP proxies. Each "address" is a typed endpoint.

### Address types

| Type | Example | Purpose |
|------|---------|---------|
| `TCP:host:port` | `TCP:example.com:80` | TCP client |
| `TCP-LISTEN:port` | `TCP-LISTEN:8080,fork,reuseaddr` | TCP server |
| `UDP:host:port` | `UDP:dns:53` | UDP |
| `UNIX-CONNECT:path` | `UNIX-CONNECT:/var/run/docker.sock` | UNIX socket |
| `SSL:host:port` | `SSL:example.com:443` | TLS client |
| `EXEC:cmd` | `EXEC:/bin/bash` | Spawn process |
| `STDIO` | `STDIO` | stdin/stdout |
| `FILE:path` | `FILE:/dev/ttyUSB0,b115200` | File or serial |

### Examples

```bash
# TCP port forwarder
socat TCP-LISTEN:8080,fork TCP:backend:80

# Expose a UNIX socket over TCP
socat TCP-LISTEN:2375,fork UNIX-CONNECT:/var/run/docker.sock

# TLS connection (like openssl s_client)
socat - SSL:example.com:443

# Serial port to TCP
socat TCP-LISTEN:9999,fork FILE:/dev/ttyUSB0,b115200,raw

# Bidirectional pipe between two commands
socat EXEC:'ssh remote cat /etc/hosts' STDOUT
```

---

## iperf3 --- network throughput testing

### Synopsis

```
iperf3 -s [-p port]                          # server
iperf3 -c host [-p port] [-t time] [-P N]    # client
iperf3 -c host -u -b 100M                    # UDP test
```

### Description

Measures maximum achievable bandwidth between two endpoints. Tests TCP
throughput, UDP jitter/loss, and supports parallel streams, bidirectional
tests, and JSON output.

### Key Options

| Flag | Purpose |
|------|---------|
| `-s` | Server mode |
| `-c HOST` | Client mode |
| `-p N` | Port (default 5201) |
| `-t N` | Duration in seconds (default 10) |
| `-P N` | Parallel streams |
| `-R` | Reverse direction (server sends) |
| `-u` | UDP mode |
| `-b N` | Target bandwidth (UDP: required; TCP: optional) |
| `-J` | JSON output |
| `-i N` | Report interval |
| `--bidir` | Bidirectional test |

### Examples

```bash
# Server
iperf3 -s

# Basic TCP test
iperf3 -c server.example.com
# [ ID] Interval       Transfer     Bitrate        Retr  Cwnd
# [  5]  0.00-10.00 sec  1.10 GBytes   941 Mbits/sec   0    352 KBytes

# Parallel streams (saturate link)
iperf3 -c server -P 4 -t 30

# UDP test at 500 Mbps
iperf3 -c server -u -b 500M
# [  5]  0.00-10.00 sec   596 MBytes   500 Mbits/sec  0.012 ms  12/76543 (0.016%)

# Bidirectional
iperf3 -c server --bidir

# JSON output for automation
iperf3 -c server -J > result.json
```

---

## tcpdump --- packet capture

### Synopsis

```
tcpdump [-i interface] [-c count] [-w file.pcap] [-r file.pcap]
        [-n] [-v] [-X] [filter-expression]
```

### Description

Captures and displays network packets. The standard packet sniffer on
Linux/macOS. Uses libpcap and BPF filter syntax. Captures can be saved as
PCAP files for analysis in Wireshark.

### Key Options

| Flag | Purpose |
|------|---------|
| `-i eth0` | Capture interface (`-i any` for all) |
| `-c N` | Stop after N packets |
| `-w file.pcap` | Write to file |
| `-r file.pcap` | Read from file |
| `-n` | No DNS resolution |
| `-nn` | No DNS or port name resolution |
| `-v` / `-vv` | Verbose (show TTL, flags, etc.) |
| `-X` | Hex + ASCII dump |
| `-e` | Show link-layer headers |
| `-A` | ASCII dump (for HTTP text) |
| `-s 0` | Full packet (no truncation) |

### BPF filter syntax

```
  Primitives:
    host 192.168.1.1        Packets to/from this IP
    net 10.0.0.0/8          Network
    port 80                 TCP or UDP port
    portrange 8000-9000     Port range
    src host X              Source only
    dst port 443            Destination port only
    
  Protocols:
    tcp, udp, icmp, arp, ip6, vlan
    
  Operators:
    and (&&), or (||), not (!)
    
  TCP flags:
    tcp[tcpflags] & tcp-syn != 0    SYN packets
    tcp[tcpflags] & (tcp-syn|tcp-fin) != 0   SYN or FIN
```

### Examples

```bash
# Capture HTTP traffic
sudo tcpdump -i eth0 -nn tcp port 80 -A

# Capture DNS queries
sudo tcpdump -i eth0 -nn udp port 53

# Save to file for Wireshark
sudo tcpdump -i eth0 -w capture.pcap -c 10000

# TCP SYN packets only (new connections)
sudo tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0'

# Traffic between two hosts
sudo tcpdump -i eth0 host 192.168.1.10 and host 192.168.1.20

# Read and filter a saved capture
tcpdump -r capture.pcap -nn 'tcp port 443 and tcp[tcpflags] & tcp-syn != 0'
```

---

## Cross-links

- Data link layer -> [../../10_Network_DataLink/man_pages/datalink_commands.md](../../10_Network_DataLink/man_pages/datalink_commands.md)
- Internet layer -> [../../11_Network_Internet/man_pages/ip_commands.md](../../11_Network_Internet/man_pages/ip_commands.md)
- Application layer -> [../../13_Network_Application/man_pages/app_protocol_tools.md](../../13_Network_Application/man_pages/app_protocol_tools.md)
- TCP/UDP protocols -> [../protocols/INDEX.md](../protocols/INDEX.md)
