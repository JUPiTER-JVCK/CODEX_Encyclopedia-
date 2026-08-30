---
title: "Network Application Layer — Interactive Labs"
layer: 13_Network_Application
section: lessons
tags: [lesson, network, application, dns, tls, http2, lab, quiz, hands-on]
updated: 2026-05-21
---

# Network Application Layer — Interactive Labs

---

## Module 1: DNS Resolution Trace

### Objective

Trace a DNS query from root servers to authoritative answer using
`dig +trace`, understanding the hierarchical delegation model.

### Lab Steps

1. Trace resolution:
```bash
dig +trace example.com A
# .                  NS   a.root-servers.net.  (root)
# com.               NS   a.gtld-servers.net.  (TLD)
# example.com.       NS   ns1.example.com.     (authoritative)
# example.com.  86400 IN A  93.184.216.34      (answer)
```

2. Query each level manually:
```bash
dig @a.root-servers.net com. NS          # Root → TLD
dig @a.gtld-servers.net example.com. NS  # TLD → Auth
dig @ns1.example.com example.com. A      # Auth → Answer
```

3. Measure resolution time:
```bash
dig example.com A +stats
# ;; Query time: 12 msec
```

### Knowledge Check

**Q1**: Why does `dig +trace` start at the root?

> **A1**: It simulates iterative resolution from scratch. Normally your
> recursive resolver caches intermediate results, but +trace bypasses
> the cache to show the full delegation chain.

**Q2**: What is a glue record?

> **A2**: When a nameserver is within the zone it serves (ns1.example.com
> for example.com), the parent zone must include an A/AAAA record for
> the NS to avoid a circular dependency. This is the "glue" record.

---

## Module 2: TLS Handshake Decode

### Objective

Capture and analyze a TLS 1.3 handshake, identifying key exchange,
cipher negotiation, and certificate verification.

### Lab Steps

1. Capture with key logging:
```bash
# Enable TLS key logging for Wireshark
export SSLKEYLOGFILE=/tmp/tls-keys.log
curl -v https://example.com 2>&1 | grep -E 'TLS|SSL|ALPN'
```

2. Analyze with openssl:
```bash
echo | openssl s_client -connect example.com:443 -servername example.com 2>&1 | \
  grep -E 'Protocol|Cipher|Verify'
# Protocol  : TLSv1.3
# Cipher    : TLS_AES_256_GCM_SHA384
# Verify return code: 0 (ok)
```

3. Decode certificate:
```bash
echo | openssl s_client -connect example.com:443 2>/dev/null | \
  openssl x509 -noout -text | grep -A2 'Subject:\|Issuer:\|Not After'
```

### Knowledge Check

**Q1**: How does TLS 1.3 achieve 1-RTT handshakes?

> **A1**: The client sends its key share in the ClientHello (first message).
> The server responds with its key share, encrypted extensions, certificate,
> and Finished — all in one flight. Both sides can derive the session key
> after one round trip.

**Q2**: What is ALPN?

> **A2**: Application-Layer Protocol Negotiation — a TLS extension where
> client and server agree on the application protocol (h2, http/1.1)
> during the handshake, avoiding an extra round trip.

---

## Module 3: HTTP/2 Framing

### Objective

Observe HTTP/2 multiplexing, stream prioritization, and header
compression using curl and nghttp.

### Lab Steps

1. HTTP/2 request with curl:
```bash
curl -v --http2 https://example.com 2>&1 | grep -E 'Using HTTP|ALPN|stream'
# * Using HTTP version 2
# * ALPN: server accepted h2
```

2. Multiple concurrent streams with nghttp:
```bash
nghttp -v https://example.com/ https://example.com/style.css
# [  0.050] recv SETTINGS frame
# [  0.050] send HEADERS frame (stream_id=1)
# [  0.050] send HEADERS frame (stream_id=3)  ← multiplexed!
# [  0.120] recv DATA frame (stream_id=1)
# [  0.125] recv DATA frame (stream_id=3)
```

3. Compare HTTP/1.1 vs HTTP/2 loading:
```bash
# HTTP/1.1 (sequential)
time curl --http1.1 -s -o /dev/null https://example.com

# HTTP/2 (multiplexed)
time curl --http2 -s -o /dev/null https://example.com
```

### Review Flashcards

| Term | Definition |
|------|-----------|
| Iterative DNS | Resolver queries each level (root → TLD → auth) |
| Recursive DNS | Resolver does all work, returns final answer |
| Glue record | A record for NS that's in its own zone |
| TLS 1.3 | 1-RTT handshake, forward secrecy mandatory, no RSA key exchange |
| ALPN | TLS extension for protocol negotiation (h2, h3) |
| HTTP/2 stream | Logical request/response within a single TCP connection |
| HPACK | HTTP/2 header compression algorithm |
| Server push | HTTP/2: server sends resources before client requests them |

### Challenge

> Set up a local HTTPS server with nginx, configure HTTP/2, and use
> browser dev tools to observe stream multiplexing. Load a page with
> 20 small images. Compare the waterfall chart between HTTP/1.1 (6
> parallel connections) and HTTP/2 (single multiplexed connection).

---

## Cross-links

- Application protocol tools → [../man_pages/app_protocol_tools.md](../man_pages/app_protocol_tools.md)
- TLS protocol → [../protocols/INDEX.md](../protocols/INDEX.md)
- Transport labs → [../../12_Network_Transport/lessons/transport_labs.md](../../12_Network_Transport/lessons/transport_labs.md)
