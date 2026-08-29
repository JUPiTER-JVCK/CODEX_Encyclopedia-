---
title: "Network Transport — Interactive Labs"
layer: 12_Network_Transport
section: lessons
tags: [lesson, network, transport, tcp, udp, congestion, lab, quiz, hands-on]
updated: 2026-05-21
---

# Network Transport — Interactive Labs

---

## Module 1: TCP Handshake Capture

### Objective

Capture and analyze a TCP 3-way handshake with tcpdump, identifying
SYN, SYN-ACK, ACK packets and their sequence numbers.

### Lab Steps

1. Start capture:
```bash
sudo tcpdump -i eth0 -nn 'tcp port 80 and host example.com' -w handshake.pcap &
```

2. Trigger a connection:
```bash
curl -s -o /dev/null http://example.com
```

3. Analyze:
```bash
tcpdump -r handshake.pcap -nn
# 10:00:00.001 IP client.54321 > server.80: Flags [S], seq 1000, win 65535
# 10:00:00.010 IP server.80 > client.54321: Flags [S.], seq 2000, ack 1001, win 65535
# 10:00:00.011 IP client.54321 > server.80: Flags [.], ack 2001, win 65535
```

```
  3-Way Handshake:
  Client                        Server
    │                              │
    │──── SYN (seq=1000) ─────────▸│    "I want to connect"
    │                              │
    │◂─── SYN+ACK (seq=2000,      │    "OK, I accept"
    │      ack=1001) ──────────────│
    │                              │
    │──── ACK (ack=2001) ─────────▸│    "Got it, let's go"
    │                              │
    │═══════ DATA TRANSFER ════════│
```

### Knowledge Check

**Q1**: Why does the ACK number equal seq+1 (not just seq)?

> **A1**: The ACK field means "I've received all bytes up to this number."
> The SYN flag consumes one sequence number, so acknowledging SYN seq=1000
> means sending ack=1001 ("I expect byte 1001 next").

**Q2**: What is a SYN flood attack?

> **A2**: Sending many SYN packets without completing the handshake.
> The server allocates resources for each half-open connection, exhausting
> memory. Mitigated with SYN cookies (stateless response until ACK arrives).

---

## Module 2: Congestion Window Observation

### Objective

Observe TCP congestion control (slow start, congestion avoidance) using
`ss -i` during a large transfer.

### Lab Steps

1. Start an iperf3 server on a remote host:
```bash
iperf3 -s
```

2. Monitor cwnd during transfer:
```bash
# In one terminal: start transfer
iperf3 -c server -t 30

# In another terminal: watch cwnd
watch -n 0.5 "ss -ti dst server | grep -oP 'cwnd:\K[0-9]+'"
```

3. Observe slow start:
```
  cwnd (segments)
  100 ┤                        ┌────────── congestion avoidance
      │                       ╱            (linear growth)
   80 ┤                     ╱╱
      │                   ╱╱
   60 ┤                 ╱╱
      │               ╱╱
   40 ┤             ╱╱
      │           ╱╱   ← ssthresh (slow start → CA transition)
   20 ┤         ╱╱
      │       ╱╱
   10 ┤    ╱╱╱    slow start (exponential)
      │  ╱╱╱
    1 ┤╱╱
      ┼──┬──┬──┬──┬──┬──┬──┬──▸ RTTs
      0  1  2  3  4  5  6  7
```

4. Introduce packet loss (with tc netem) and observe cwnd collapse + recovery

### Knowledge Check

**Q1**: What is the difference between slow start and congestion avoidance?

> **A1**: Slow start doubles cwnd every RTT (exponential growth) until
> ssthresh. Congestion avoidance increases cwnd by ~1 segment per RTT
> (linear/additive increase). After loss, cwnd is typically halved.

---

## Module 3: UDP Load Test & Jitter

### Objective

Measure UDP throughput, packet loss, and jitter using iperf3 to
understand unreliable transport characteristics.

### Lab Steps

1. UDP test at 100 Mbps:
```bash
# Server
iperf3 -s

# Client
iperf3 -c server -u -b 100M -t 10
# [ ID] Interval    Transfer   Bitrate     Jitter   Lost/Total
# [  5] 0.00-10.00  119 MBytes  100 Mbits/s 0.15ms  23/85431 (0.027%)
```

2. Increase rate beyond link capacity — observe loss increase:
```bash
iperf3 -c server -u -b 1G -t 10
# Lost: 45% (buffer overflow)
```

3. Add jitter with netem and measure:
```bash
sudo tc qdisc add dev eth0 root netem delay 10ms 5ms
iperf3 -c server -u -b 50M -t 10
# Jitter will show ~5ms variation
```

### Review Flashcards

| Term | Definition |
|------|-----------|
| SYN | TCP flag: synchronize sequence numbers (start connection) |
| cwnd | Congestion window: sender-side limit on in-flight data |
| ssthresh | Slow-start threshold: transition point to congestion avoidance |
| RTT | Round-Trip Time: time for packet + ACK to return |
| Jitter | Variation in packet delay (important for real-time) |
| MSS | Maximum Segment Size: largest payload per TCP segment |
| Flow control | Receiver-side limit (rwnd) preventing buffer overflow |
| Congestion control | Sender-side algorithm avoiding network overload |

### Challenge

> Compare TCP congestion control algorithms: run iperf3 with `cubic`
> (default) vs `bbr`. Change with:
> `sysctl net.ipv4.tcp_congestion_control=bbr`
> Measure throughput on a high-latency link (add 100ms with netem).
> Which algorithm performs better? Why?

---

## Cross-links

- Transport tools → [../man_pages/transport_tools.md](../man_pages/transport_tools.md)
- TCP protocol → [../protocols/INDEX.md](../protocols/INDEX.md)
- Application labs → [../../13_Network_Application/lessons/application_labs.md](../../13_Network_Application/lessons/application_labs.md)
