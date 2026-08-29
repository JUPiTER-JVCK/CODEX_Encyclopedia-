---
title: "HTTP — HyperText Transfer Protocol (1.1 / 2 / 3)"
layer: 13_Network_Application
tags: [http, http2, http3, web, rfc-9110, rfc-9113, rfc-9114]
updated: 2026-05-20
---

# HTTP — HyperText Transfer Protocol

> **RFC 9110** (2022) — HTTP Semantics (methods, status codes, headers)
> **RFC 9112** — HTTP/1.1 message syntax
> **RFC 9113** — HTTP/2
> **RFC 9114** — HTTP/3 (over QUIC)

HTTP is the **request-response** protocol of the Web — and increasingly of
APIs, microservices, gRPC, and real-time streaming.

---

## Version evolution

```
  HTTP/1.0 (1996)     HTTP/1.1 (1997→2022)    HTTP/2 (2015→2022)    HTTP/3 (2022)
  ────────────────    ────────────────────    ──────────────────    ──────────────
  One request per     Persistent connections  Binary framing        Over QUIC (UDP)
  TCP connection      Pipelining (broken)     Multiplexed streams   No TCP HOL blocking
  No Host header      Chunked encoding        Header compression    Built-in TLS 1.3
                      Conditional requests    Server push           0-RTT connection
                      Content negotiation     Stream priority       Connection migration
```

---

## HTTP/1.1 request / response

```
  GET /index.html HTTP/1.1          HTTP/1.1 200 OK
  Host: example.com                 Content-Type: text/html
  Accept: text/html                 Content-Length: 1234
  Connection: keep-alive            Cache-Control: max-age=3600
                                    
                                    <!DOCTYPE html>...
```

---

## HTTP/2 binary framing

```
  ┌─────────────────────────────┐
  │   TCP Connection            │
  │  ┌───────────────────────┐  │
  │  │  HTTP/2 Session       │  │
  │  │  ┌─────┐ ┌─────┐     │  │
  │  │  │Strm 1│ │Strm 3│    │  │    Streams are multiplexed
  │  │  │ req  │ │ req  │    │  │    over a single TCP connection
  │  │  │ resp │ │ resp │    │  │
  │  │  └─────┘ └─────┘     │  │
  │  │  ┌─────┐              │  │
  │  │  │Strm 5│ (push)      │  │
  │  │  └─────┘              │  │
  │  └───────────────────────┘  │
  └─────────────────────────────┘
```

**Frame format:**
```
 +-----------------------------------------------+
 |                 Length (24)                     |
 +---------------+---------------+---------------+
 |   Type (8)    |   Flags (8)   |
 +-+-------------+---------------+------+--------+
 |R|                 Stream ID (31)               |
 +-+----------------------------------------------+
 |                 Frame Payload (*)              |
 +------------------------------------------------+
```

Frame types: DATA, HEADERS, PRIORITY, RST_STREAM, SETTINGS, PUSH_PROMISE,
PING, GOAWAY, WINDOW_UPDATE, CONTINUATION.

**HPACK** (RFC 7541) — header compression using static + dynamic tables +
Huffman encoding. Eliminates repeated header overhead.

---

## HTTP/3 over QUIC

```
  ┌─────────────────────────────┐
  │   QUIC Connection (UDP)     │
  │  ┌───────────────────────┐  │
  │  │  HTTP/3 Session       │  │
  │  │  ┌─────┐ ┌─────┐     │  │    Each stream is independent —
  │  │  │Strm 0│ │Strm 4│    │  │    loss on one doesn't block others
  │  │  │ req  │ │ req  │    │  │
  │  │  │ resp │ │ resp │    │  │
  │  │  └─────┘ └─────┘     │  │
  │  └───────────────────────┘  │
  └─────────────────────────────┘
```

- **QPACK** (RFC 9204) — header compression adapted for QUIC's out-of-order
  delivery (replaces HPACK).
- **No server push in practice** — Chrome removed support (2022).
- **Alt-Svc** header advertises HTTP/3 availability; clients upgrade from H2.

---

## Methods

| Method | Safe | Idempotent | Body | Purpose |
|--------|------|------------|------|---------|
| GET | ✓ | ✓ | No | Retrieve |
| HEAD | ✓ | ✓ | No | Headers only |
| POST | ✗ | ✗ | Yes | Create / submit |
| PUT | ✗ | ✓ | Yes | Replace |
| PATCH | ✗ | ✗ | Yes | Partial update |
| DELETE | ✗ | ✓ | Optional | Remove |
| OPTIONS | ✓ | ✓ | Optional | Capabilities / CORS preflight |
| CONNECT | ✗ | ✗ | N/A | Tunnel (TLS proxy) |

---

## Status codes (groups)

| Range | Meaning | Key codes |
|-------|---------|-----------|
| 1xx | Informational | 100 Continue, 101 Switching Protocols, 103 Early Hints |
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirection | 301 Permanent, 302 Found, 304 Not Modified, 307/308 Temp/Perm |
| 4xx | Client error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests |
| 5xx | Server error | 500 Internal, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout |

---

## Caching (RFC 9111)

```
  Client ──▶ Cache ──▶ Origin Server
              │
              │ Cache-Control: max-age=3600
              │ ETag: "abc123"
              │
              │ (on revalidation)
              │──▶ If-None-Match: "abc123"
              │◀── 304 Not Modified
```

Key headers: `Cache-Control`, `ETag`, `Last-Modified`, `Vary`, `Age`.

---

## Security headers

| Header | Purpose |
|--------|---------|
| Strict-Transport-Security (HSTS) | Force HTTPS |
| Content-Security-Policy (CSP) | XSS / injection mitigation |
| X-Content-Type-Options: nosniff | Prevent MIME sniffing |
| X-Frame-Options / frame-ancestors | Clickjacking defense |
| Permissions-Policy | Feature restrictions |
| Cross-Origin-Resource-Policy | Isolate resources |

---

## Common gotchas

- **HTTP/2 TCP HOL blocking** — single TCP loss stalls all streams; HTTP/3 fixes this.
- **HPACK bomb** — malicious dynamic table can consume server memory; limit table size.
- **HTTP/1.1 pipelining** — specified but broken in practice (proxy reordering);
  nobody uses it — H2 supersedes.
- **Content-Length mismatch** — HTTP request smuggling attacks exploit
  CL / Transfer-Encoding disagreement between proxy and origin.
- **CORS preflight** — `OPTIONS` request adds latency for cross-origin API calls;
  cache with `Access-Control-Max-Age`.
- **103 Early Hints** — underused; lets server push `Link: rel=preload` before
  the final response.

---

## Cross-links

- TLS (secures HTTP) → [tls.md](tls.md)
- DNS (resolves hostnames) → [dns.md](dns.md)
- QUIC (carries HTTP/3) → [../../12_Network_Transport/protocols/quic.md](../../12_Network_Transport/protocols/quic.md)
- TCP (carries HTTP/1.1, HTTP/2) → [../../12_Network_Transport/protocols/tcp.md](../../12_Network_Transport/protocols/tcp.md)
- WebSocket → [INDEX.md](INDEX.md)
