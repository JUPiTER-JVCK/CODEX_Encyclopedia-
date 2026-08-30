---
title: "TLS — Transport Layer Security (1.2 / 1.3)"
layer: 13_Network_Application
tags: [tls, ssl, crypto, rfc-8446, rfc-5246, handshake, certificates]
updated: 2026-05-20
---

# TLS — Transport Layer Security

> **TLS 1.3**: RFC 8446 (2018) — current standard.
> **TLS 1.2**: RFC 5246 (2008) — still widely deployed.
> **DTLS 1.3**: RFC 9147 — TLS semantics over UDP.

TLS provides **confidentiality, integrity, and authentication** for
byte-stream protocols (primarily TCP). It's the "S" in HTTPS and secures
SMTP, IMAP, LDAP, and everything else that wraps a plaintext protocol.

---

## TLS 1.3 handshake (1-RTT)

```
    Client                                      Server
      │                                            │
      │── ClientHello ────────────────────────────▶│
      │   (supported versions, cipher suites,      │
      │    key_share, signature_algorithms,         │
      │    SNI, ALPN, …)                           │
      │                                            │
      │◀──────────────────────────── ServerHello ──│
      │   (selected cipher, key_share)             │
      │◀──── {EncryptedExtensions} ────────────────│
      │◀──── {Certificate} ────────────────────────│
      │◀──── {CertificateVerify} ──────────────────│
      │◀──── {Finished} ──────────────────────────│
      │                                            │
      │── {Finished} ────────────────────────────▶│
      │                                            │
      │   ═══ Application Data (encrypted) ═══    │
```

`{ }` = encrypted with handshake keys.

**Key improvements over TLS 1.2:**
- **1 RTT** (was 2 RTT in TLS 1.2 full handshake).
- **0-RTT resumption** — client sends early data with PSK (replay risk).
- **No RSA key exchange** — only (EC)DHE → forward secrecy always.
- **Removed**: RC4, SHA-1, DES, 3DES, CBC mode, compression, renegotiation,
  static RSA, static DH, custom DHE groups, export ciphers.
- **Encrypted handshake** — certificate, extensions hidden from passive observers.

---

## TLS 1.2 handshake (2-RTT, for comparison)

```
    Client                                      Server
      │                                            │
      │── ClientHello ────────────────────────────▶│
      │◀──────────────────────────── ServerHello ──│
      │◀──── Certificate ─────────────────────────│
      │◀──── ServerKeyExchange (if DHE/ECDHE) ────│
      │◀──── ServerHelloDone ─────────────────────│
      │                                            │
      │── ClientKeyExchange ──────────────────────▶│
      │── ChangeCipherSpec ───────────────────────▶│
      │── Finished ───────────────────────────────▶│
      │                                            │
      │◀──── ChangeCipherSpec ────────────────────│
      │◀──── Finished ───────────────────────────│
      │                                            │
      │   ═══ Application Data ═══                │
```

---

## Record protocol

```
 +---+---+---+---+---+---+---+---+---+---+---+
 | Content Type | Legacy Version | Length    |
 |    (1 B)     |    (2 B)       |  (2 B)   |
 +---+---+---+---+---+---+---+---+---+---+---+
 |              Fragment / Ciphertext         |
 |              (≤ 16,384 + 256 B)            |
 +---+---+---+---+---+---+---+---+---+---+---+
```

Content types: 20 (ChangeCipherSpec), 21 (Alert), 22 (Handshake),
23 (Application Data). In TLS 1.3, all post-handshake records are type 23
with inner content type.

---

## Cipher suites (TLS 1.3 — only 5)

| Suite | AEAD | Hash |
|-------|------|------|
| TLS_AES_128_GCM_SHA256 | AES-128-GCM | SHA-256 |
| TLS_AES_256_GCM_SHA384 | AES-256-GCM | SHA-384 |
| TLS_CHACHA20_POLY1305_SHA256 | ChaCha20-Poly1305 | SHA-256 |
| TLS_AES_128_CCM_SHA256 | AES-128-CCM | SHA-256 |
| TLS_AES_128_CCM_8_SHA256 | AES-128-CCM-8 | SHA-256 |

Key exchange is **separate** from the cipher suite (always ECDHE or DHE).
Signature algorithms specified via the `signature_algorithms` extension.

---

## Certificate chain

```
  ┌────────────────────┐
  │   Root CA          │ ← in trust store (OS / browser)
  │   (self-signed)    │
  └────────┬───────────┘
           │ signs
  ┌────────▼───────────┐
  │  Intermediate CA   │ ← sent by server
  └────────┬───────────┘
           │ signs
  ┌────────▼───────────┐
  │  Server (leaf)     │ ← sent by server
  │  CN=example.com    │
  └────────────────────┘
```

- **OCSP / OCSP Stapling** — real-time revocation check; server staples
  signed OCSP response to avoid client-side lookup.
- **CT (RFC 9162)** — Certificate Transparency logs; browsers require SCTs.
- **CAA (RFC 8659)** — DNS record restricting which CAs can issue for a domain.

---

## Key extensions

| Extension | RFC | Purpose |
|-----------|-----|---------|
| SNI (Server Name Indication) | 6066 | Virtual hosting — client sends hostname |
| ALPN | 7301 | Negotiate app protocol (h2, http/1.1) |
| ECH (Encrypted Client Hello) | drafts | Encrypt SNI (privacy) |
| ESNI | — | Predecessor to ECH (deprecated) |
| Pre-Shared Key (PSK) | 8446 | Session resumption + 0-RTT |
| Early Data (0-RTT) | 8446 | Send data before handshake completes |
| Key Share | 8446 | ECDHE/DHE key material in ClientHello |
| Certificate Status (OCSP) | 6066 | Stapled OCSP response |

---

## Post-quantum TLS

NIST PQC standards (2024):
- **ML-KEM** (FIPS 203, Kyber) — key encapsulation; used as hybrid
  `X25519Kyber768` in Chrome/Cloudflare today.
- **ML-DSA** (FIPS 204, Dilithium) — signatures; will replace RSA/ECDSA in
  certificates.
- **SLH-DSA** (FIPS 205, SPHINCS+) — stateless hash-based signatures.

Transition: hybrid key exchange (classical + PQC) during migration period.

---

## Common gotchas

- **0-RTT replay** — early data can be replayed; servers must make handlers
  idempotent or reject (`max_early_data_size = 0`).
- **Mixed content** — HTTP resources on HTTPS page → browser blocks/warns.
- **HSTS preload** — once preloaded, very hard to undo; test with short
  `max-age` first.
- **Certificate pinning** — deprecated by Chrome (2018); use CT + CAA instead.
- **Downgrade attacks** — TLS 1.3 includes a downgrade sentinel in
  ServerHello.random to detect forced TLS 1.2 fallback.
- **SNI leaks** — without ECH, the destination hostname is visible to passive
  observers on the wire.
- **Client certificate auth** — in TLS 1.3, post-handshake auth lets server
  request client cert after initial handshake.

---

## ACME (RFC 8555) — Automated Certificate Management

```
  Client (certbot)                    ACME Server (Let's Encrypt)
      │                                      │
      │── POST /newOrder ───────────────────▶│
      │◀── 201 (order URL, authorization URLs)│
      │                                      │
      │── GET /authz (challenge) ───────────▶│
      │◀── DNS-01 or HTTP-01 challenge ──────│
      │                                      │
      │   (place DNS record or .well-known)  │
      │                                      │
      │── POST /challenge (respond) ────────▶│
      │◀── 200 (valid) ─────────────────────│
      │                                      │
      │── POST /finalize (CSR) ─────────────▶│
      │◀── 200 (certificate URL) ───────────│
      │                                      │
      │── GET /cert ────────────────────────▶│
      │◀── PEM certificate chain ───────────│
```

---

## Cross-links

- HTTP (secured by TLS) → [http.md](http.md)
- QUIC (integrates TLS 1.3) → [../../12_Network_Transport/protocols/quic.md](../../12_Network_Transport/protocols/quic.md)
- TCP (carries TLS) → [../../12_Network_Transport/protocols/tcp.md](../../12_Network_Transport/protocols/tcp.md)
- PKI / crypto → [../../../14_Security/protocols/INDEX.md](../../../14_Security/protocols/INDEX.md)
- DNS (CAA, DANE, DoT, DoH) → [dns.md](dns.md)
