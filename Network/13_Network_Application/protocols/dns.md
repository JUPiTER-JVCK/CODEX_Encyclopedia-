---
title: "DNS — Domain Name System"
layer: 13_Network_Application
tags: [dns, naming, resolution, rfc-1034, rfc-1035, dnssec, doh, dot]
updated: 2026-05-20
---

# DNS — Domain Name System

> **RFC 1034 / 1035** (1987) — foundational specification.
> **UDP port 53** (primary), **TCP port 53** (large responses, zone transfers).
> Encrypted: **DoT** (853), **DoH** (443), **DoQ** (853/UDP).

DNS maps **domain names → IP addresses** (and much more: MX, TXT, SRV, CNAME,
HTTPS records). It's a globally distributed, hierarchical, eventually-consistent
database.

---

## Resolution flow

```
  Application          Stub Resolver        Recursive Resolver      Authoritative
  (browser)            (OS / libc)          (ISP / 8.8.8.8)        Name Servers
      │                    │                      │                      │
      │─ gethostbyname ──▶│                      │                      │
      │  "example.com"    │                      │                      │
      │                    │── query ────────────▶│                      │
      │                    │                      │── query (.) ────────▶│ Root
      │                    │                      │◀── referral (.com) ──│
      │                    │                      │                      │
      │                    │                      │── query (.com) ─────▶│ TLD
      │                    │                      │◀── referral ─────────│
      │                    │                      │                      │
      │                    │                      │── query ────────────▶│ Auth
      │                    │                      │◀── answer ──────────│
      │                    │                      │                      │
      │                    │◀── answer ──────────│                      │
      │◀── IP address ────│                      │                      │
```

**Caching** at every level; TTL controls expiry. Recursive resolvers cache
aggressively (typical: 5 min – 24 hr).

---

## Message format

```
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                      ID                         |   Transaction ID
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |QR|   Opcode  |AA|TC|RD|RA|   Z    |   RCODE    |   Flags
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                    QDCOUNT                       |   # Questions
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                    ANCOUNT                       |   # Answers
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                    NSCOUNT                       |   # Authority
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |                    ARCOUNT                       |   # Additional
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
  |               Question Section                   |
  |               Answer Section                     |
  |               Authority Section                  |
  |               Additional Section                 |
  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
```

- **TC** (Truncated) — response too large for UDP; retry over TCP.
- **RD** (Recursion Desired) / **RA** (Recursion Available).
- **EDNS(0)** (RFC 6891) — extends message size beyond 512 B, carries
  options (DNSSEC OK flag, Client Subnet, cookies).

---

## Record types

| Type | Value | Purpose |
|------|-------|---------|
| A | 1 | IPv4 address |
| AAAA | 28 | IPv6 address |
| CNAME | 5 | Canonical name alias |
| MX | 15 | Mail exchange |
| NS | 2 | Authoritative nameserver |
| SOA | 6 | Start of Authority (zone metadata) |
| TXT | 16 | Arbitrary text (SPF, DKIM, DMARC, ACME) |
| SRV | 33 | Service locator (host:port:priority:weight) |
| PTR | 12 | Reverse lookup (IP → name) |
| CAA | 257 | Certificate Authority Authorization |
| HTTPS / SVCB | 65 / 64 | Service binding (AliasMode + ServiceMode) |
| DNSKEY | 48 | DNSSEC public key |
| DS | 43 | Delegation signer (DNSSEC chain) |
| RRSIG | 46 | DNSSEC signature |
| NSEC / NSEC3 | 47 / 50 | Authenticated denial of existence |
| TLSA | 52 | DANE: TLS cert pinning via DNS |

---

## DNSSEC (RFC 4033–4035)

```
  Root Zone (signed)
    │  DS record for .com
    ▼
  .com Zone (signed)
    │  DS record for example.com
    ▼
  example.com Zone (signed)
    │  RRSIG over A record
    ▼
  A = 93.184.216.34 + RRSIG (verifiable)
```

**Chain of trust** from root → TLD → domain. Validators check RRSIG against
DNSKEY, DNSKEY against parent DS.

**NSEC / NSEC3** — prove a name *doesn't* exist (authenticated denial).
NSEC3 hashes names to prevent zone enumeration.

---

## Encrypted DNS

| Protocol | RFC | Port | Transport |
|----------|-----|------|-----------|
| DNS over TLS (DoT) | 7858 | 853 | TCP + TLS |
| DNS over HTTPS (DoH) | 8484 | 443 | HTTP/2 + TLS |
| DNS over QUIC (DoQ) | 9250 | 853 | QUIC |
| Oblivious DoH (ODoH) | 9230 | 443 | DoH + relay |

**Trade-offs**: DoH blends with web traffic (hard to block/monitor); DoT is
easier for network operators to identify; DoQ offers lowest latency.

---

## DNS hierarchy

```
                     . (root)
                   ╱    │    ╲
                 com   org   net   uk   ...
               ╱   ╲
          example  google
           │
          www
```

13 root server identities (A–M), served by ~1,700 anycast instances worldwide.

---

## Common gotchas

- **TTL = 0** — valid but hammers authoritative servers; avoid.
- **CNAME at apex** — RFC-illegal (conflicts with SOA/NS); workarounds: ALIAS
  (provider-specific), HTTPS record, flattening.
- **Negative caching** — SOA MINIMUM field = max negative TTL (RFC 2308).
- **Glue records** — NS records that point to names within the zone need
  A/AAAA glue in the parent; missing glue = unresolvable.
- **DNS rebinding** — attacker's DNS returns private IPs to bypass same-origin;
  browsers + resolvers add mitigations.
- **Amplification** — open resolvers + spoofed source → DDoS; mitigate with
  Response Rate Limiting (RRL) and BCP 38.
- **Happy Eyeballs (RFC 8305)** — dual-stack clients race A + AAAA lookups;
  connect to whichever responds first.

---

## CLI tools

```
dig example.com A +short          # query A record
dig example.com ANY +dnssec       # all records + DNSSEC
dig @8.8.8.8 example.com MX      # explicit resolver
nslookup example.com              # legacy
host example.com                  # simple lookup
drill example.com DNSKEY          # LDNS tool (DNSSEC-aware)
dog example.com                   # modern Rust alternative
```

---

## Cross-links

- HTTP (uses DNS resolution) → [http.md](http.md)
- TLS (CAA, DANE, SNI) → [tls.md](tls.md)
- UDP (DNS transport) → [../../12_Network_Transport/protocols/udp.md](../../12_Network_Transport/protocols/udp.md)
- Security (DNS attacks) → [../../../14_Security/topics/INDEX.md](../../../14_Security/topics/INDEX.md)
- DHCP (assigns DNS servers) → [../../10_Network_DataLink/protocols/INDEX.md](../../10_Network_DataLink/protocols/INDEX.md)
