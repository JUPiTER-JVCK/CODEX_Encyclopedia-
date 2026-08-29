---
title: "Application Layer Protocol Tools"
layer: 13_Network_Application
section: man_pages
tags: [curl, openssl, dig, mosquitto, http, tls, dns, mqtt, man-section-1]
updated: 2026-05-21
---

# Application Layer Protocol Tools

> Deep-dive reference for tools that speak application-layer protocols:
> HTTP, TLS, DNS, and MQTT.

---

## curl --- transfer data with URLs

### Synopsis

```
curl [options] URL [URL...]
```

### Description

Command-line tool for transferring data using HTTP, HTTPS, FTP, SFTP, SCP,
LDAP, MQTT, and dozens more protocols. Supports authentication, cookies,
proxies, client certificates, HTTP/2, HTTP/3 (QUIC), and WebSocket.

### Key Options

| Flag | Purpose |
|------|---------|
| `-o FILE` | Write output to file |
| `-O` | Save with remote filename |
| `-L` | Follow redirects |
| `-v` | Verbose (show headers + TLS handshake) |
| `-s` | Silent (no progress bar) |
| `-f` | Fail on HTTP errors (exit code != 0) |
| `-X METHOD` | HTTP method (GET, POST, PUT, DELETE, PATCH) |
| `-H "Header: value"` | Custom header |
| `-d 'data'` | POST body (`-d @file` from file) |
| `-F 'file=@path'` | Multipart form upload |
| `-u user:pass` | Basic auth |
| `-b cookies.txt` / `-c cookies.txt` | Send / save cookies |
| `-k` | Skip TLS verification (insecure) |
| `--cert cert.pem --key key.pem` | Client certificate |
| `-x proxy:port` | HTTP/SOCKS proxy |
| `--http2` / `--http3` | Force protocol version |
| `-w FORMAT` | Write-out format (timing, status code) |
| `--retry N` | Retry on failure |
| `--compressed` | Accept gzip/br/zstd |

### Timing breakdown

```
  curl -w "\n  DNS:    %{time_namelookup}s\n  \
  Connect: %{time_connect}s\n  \
  TLS:     %{time_appconnect}s\n  \
  TTFB:    %{time_starttransfer}s\n  \
  Total:   %{time_total}s\n" \
  -o /dev/null -s https://example.com

  DNS:       0.004s    ← name resolution
  Connect:   0.012s    ← TCP handshake complete
  TLS:       0.045s    ← TLS handshake complete
  TTFB:      0.089s    ← first byte received
  Total:     0.092s    ← transfer complete

  Timeline:
  |--DNS--|--TCP--|---TLS---|---Wait---|--Transfer--|
  0     0.004  0.012     0.045       0.089        0.092
```

### Examples

```bash
# GET with headers
curl -v https://api.example.com/users

# POST JSON
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name": "Alice", "email": "alice@example.com"}'

# Download with progress
curl -L -O https://releases.example.com/app-v2.tar.gz

# Upload multipart form
curl -F "file=@report.pdf" -F "title=Q4 Report" https://upload.example.com

# Timing analysis
curl -w "@curl-format.txt" -o /dev/null -s https://example.com

# HTTP/2 with verbose TLS info
curl --http2 -v https://example.com 2>&1 | grep -i 'ALPN\|SSL\|HTTP/2'

# WebSocket
curl --include -H "Connection: Upgrade" -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: $(openssl rand -base64 16)" \
  -H "Sec-WebSocket-Version: 13" https://ws.example.com
```

---

## openssl s_client --- TLS connection tool

### Synopsis

```
openssl s_client [-connect host:port] [-servername SNI] [-showcerts]
                 [-verify depth] [-CAfile file] [-cert file] [-key file]
openssl x509 -in cert.pem -noout -text|-dates|-subject|-issuer
openssl req -new -x509 -nodes -keyout key.pem -out cert.pem -days 365
```

### Description

Diagnostic tool for establishing TLS connections, inspecting certificate
chains, testing cipher suites, and debugging handshake problems.

### TLS handshake visualization

```
  Client                                 Server
  ──────                                 ──────
  ClientHello ──────────────────────────▸
    TLS version, cipher suites,
    SNI, ALPN, random
                                         ServerHello
                                  ◂──── Certificate
                                         ServerKeyExchange
                                         ServerHelloDone
  ClientKeyExchange ────────────────────▸
  ChangeCipherSpec ─────────────────────▸
  Finished (encrypted) ─────────────────▸
                                  ◂──── ChangeCipherSpec
                                  ◂──── Finished (encrypted)
  ═══════════════════════════════════════
  Application Data (encrypted)
  
  TLS 1.3 (simplified — 1-RTT):
  ClientHello + KeyShare ───────────────▸
                                  ◂──── ServerHello + KeyShare
                                  ◂──── EncryptedExtensions
                                  ◂──── Certificate + Verify
                                  ◂──── Finished
  Finished ─────────────────────────────▸
  ═══════════════════════════════════════
```

### Examples

```bash
# Connect and show certificate chain
openssl s_client -connect example.com:443 -servername example.com -showcerts

# Check certificate expiry
echo | openssl s_client -connect example.com:443 2>/dev/null | \
  openssl x509 -noout -dates
# notBefore=Jan  1 00:00:00 2024 GMT
# notAfter=Dec 31 23:59:59 2024 GMT

# Test specific TLS version
openssl s_client -connect example.com:443 -tls1_3

# Check supported ciphers
openssl s_client -connect example.com:443 -cipher 'ECDHE+AESGCM'

# Decode a certificate file
openssl x509 -in cert.pem -noout -text

# Generate self-signed cert
openssl req -new -x509 -nodes \
  -keyout server.key -out server.crt \
  -days 365 -subj "/CN=localhost"

# Verify a certificate chain
openssl verify -CAfile ca-bundle.crt server.crt
```

---

## dig --- DNS lookup utility

### Synopsis

```
dig [@server] name [type] [+options]
dig +trace name
dig -x IP_ADDR    # reverse lookup
```

### Description

DNS lookup tool from BIND. Queries DNS servers and displays the raw DNS
response including question, answer, authority, and additional sections.
The standard tool for DNS debugging.

### DNS query flow

```
  dig example.com A
       │
       ▼
  Recursive resolver (e.g., 1.1.1.1)
       │
       ├── Root (.) → "Ask .com NS"
       │
       ├── .com TLD → "Ask ns1.example.com"
       │
       └── ns1.example.com → "93.184.216.34"
             │
             ▼
  ;; ANSWER SECTION:
  example.com.    86400   IN  A   93.184.216.34
```

### Key Options

| Option | Purpose |
|--------|---------|
| `@8.8.8.8` | Query specific server |
| `+short` | Terse output (just the answer) |
| `+trace` | Iterative from root |
| `+dnssec` | Request DNSSEC records |
| `+tcp` | Use TCP instead of UDP |
| `+noall +answer` | Only show answer section |
| `-x IP` | Reverse (PTR) lookup |
| `+stats` | Show query time, server used |
| `+multi` | Multiline SOA output |

### Record types

| Type | Purpose |
|------|---------|
| `A` / `AAAA` | IPv4 / IPv6 address |
| `CNAME` | Alias |
| `MX` | Mail exchange |
| `NS` | Name server |
| `TXT` | Text records (SPF, DKIM, etc.) |
| `SOA` | Start of Authority |
| `SRV` | Service locator |
| `PTR` | Reverse DNS |
| `CAA` | Certificate Authority Authorization |

### Examples

```bash
# Standard query
dig example.com A
# ;; QUESTION SECTION:
# ;example.com.            IN  A
# ;; ANSWER SECTION:
# example.com.    86400    IN  A   93.184.216.34
# ;; Query time: 12 msec

# Short output
dig +short example.com AAAA
# 2606:2800:220:1:248:1893:25c8:1946

# Trace from root
dig +trace example.com

# All records
dig example.com ANY +noall +answer

# MX records
dig example.com MX +short
# 10 mail.example.com.

# Reverse lookup
dig -x 8.8.8.8 +short
# dns.google.

# Check DNSSEC
dig +dnssec example.com

# Query specific nameserver
dig @1.1.1.1 example.com A +stats
```

---

## mosquitto_pub / mosquitto_sub --- MQTT client tools

### Synopsis

```
mosquitto_pub -h host -t topic -m message [options]
mosquitto_sub -h host -t topic [options]
```

### Description

Command-line MQTT clients from the Eclipse Mosquitto project. Publish
messages to topics and subscribe to receive messages. Essential for
IoT prototyping and debugging.

### MQTT publish/subscribe model

```
  Publisher                    Broker                   Subscriber
  ─────────                   ──────                   ──────────
  mosquitto_pub               mosquitto                mosquitto_sub
  -t "sensors/temp"           (port 1883)              -t "sensors/#"
  -m "22.5"                                            
       │                                                    │
       └── PUBLISH ─────────▸ │                             │
           topic: sensors/temp│                             │
           payload: 22.5     │── match subscriptions ──▸   │
           QoS: 0            │                         PUBLISH
                              │                        topic: sensors/temp
                              │                        payload: 22.5
  
  QoS levels:
    0 — At most once  (fire and forget)
    1 — At least once (ACK, may duplicate)
    2 — Exactly once  (4-step handshake)
  
  Topic wildcards:
    +   single level   sensors/+/temp  → sensors/room1/temp ✓
    #   multi level    sensors/#       → sensors/room1/temp ✓
                                        → sensors/room1/humidity ✓
```

### Key Options

| Flag | Purpose |
|------|---------|
| `-h HOST` | Broker hostname |
| `-p PORT` | Port (default 1883, TLS 8883) |
| `-t TOPIC` | Topic string |
| `-m MESSAGE` | Message payload |
| `-f FILE` | Payload from file |
| `-q 0\|1\|2` | QoS level |
| `-r` | Retain flag |
| `-u USER -P PASS` | Authentication |
| `--cafile ca.crt` | TLS CA certificate |
| `-d` | Debug (show MQTT packets) |
| `-C N` | Disconnect after N messages (sub) |
| `-W N` | Timeout in seconds (sub) |

### Examples

```bash
# Subscribe to all sensor topics
mosquitto_sub -h broker.example.com -t "sensors/#" -v

# Publish a temperature reading
mosquitto_pub -h broker.example.com -t "sensors/room1/temp" -m "22.5"

# Retained message (new subscribers get last value)
mosquitto_pub -h broker -t "status/device1" -m "online" -r

# QoS 1 with auth
mosquitto_pub -h broker -t "alerts/fire" -m "ALARM" -q 1 \
  -u sensor_user -P secret

# TLS connection
mosquitto_sub -h broker -p 8883 \
  --cafile ca.crt -t "secure/#"

# JSON payload
mosquitto_pub -h broker -t "data/sensor1" \
  -m '{"temp": 22.5, "humidity": 45, "ts": 1716307200}'
```

---

## Cross-links

- Transport layer tools -> [../../12_Network_Transport/man_pages/transport_tools.md](../../12_Network_Transport/man_pages/transport_tools.md)
- HTTP protocol -> [../protocols/INDEX.md](../protocols/INDEX.md)
- TLS protocol -> [../protocols/INDEX.md](../protocols/INDEX.md)
- DNS protocol -> [../protocols/INDEX.md](../protocols/INDEX.md)
- MQTT protocol -> [../protocols/INDEX.md](../protocols/INDEX.md)
