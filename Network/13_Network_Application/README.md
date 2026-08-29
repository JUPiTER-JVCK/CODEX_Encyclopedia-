# 13 — Network Application (OSI L5–L7)

> Application-level protocols: HTTP/2/3, DNS, TLS, SSH, mail, file transfer,
> messaging. The protocols that user-facing software actually speaks on the
> wire.

## At a glance

| Field | Value |
|-------|-------|
| OSI layers | 5 (Session), 6 (Presentation), 7 (Application) |
| Description | App-level protocols, sessions, encoding |
| Protocols | HTTP/1.1/2/3, gRPC, DNS, TLS, SSH, SMTP, IMAP, FTP, MQTT, AMQP, WebSocket |
| Medium | TCP / UDP / QUIC |
| Example | Browser issues `GET / HTTP/2` over TLS over TCP |
| Adjacent | ↓ [12_Network_Transport](../12_Network_Transport/), ↑ [08_User_Applications](../../08_User_Applications/) |

## What lives here

- **Web** — HTTP/1.1, HTTP/2, HTTP/3, WebSocket, WebTransport
- **APIs** — REST, gRPC, GraphQL, JSON-RPC, SOAP (legacy), tRPC
- **DNS / DoH / DoT / DoQ**
- **TLS 1.2 / 1.3, mTLS, certificate ecosystems (ACME / Let's Encrypt)**
- **SSH** — interactive, SFTP, scp, port forwarding
- **Mail** — SMTP, IMAP, POP3, JMAP; SPF/DKIM/DMARC/ARC; MTA-STS
- **File transfer** — FTP/FTPS, SFTP, rsync, WebDAV
- **Real-time** — RTP, RTCP, SIP, RTSP, WebRTC (DTLS-SRTP, SCTP-over-DTLS data channels)
- **IoT / messaging** — MQTT, AMQP, CoAP, NATS, Kafka protocol
- **Auth / identity** — OAuth 2.x, OIDC, SAML, Kerberos, LDAP, WebAuthn
- **Directory / DBs over wire** — LDAP, NFS, SMB, AFP, RDP, VNC
- **Network management** — SNMP, NETCONF, gNMI, syslog
- **Time** — NTP, PTP

## Sub-sections

- [references/](references/INDEX.md) — RFCs, RFC index, IANA registries
- [lessons/](lessons/INDEX.md) — build an HTTP server → HTTPS → HTTP/3 → mTLS
- [languages/](languages/INDEX.md) — server frameworks, client libs
- [man_pages/](man_pages/INDEX.md) — `curl`, `dig`, `ssh`, `openssl s_client`
- [topics/](topics/INDEX.md) — HTTP semantics, DNS, TLS, mail auth, OAuth
- [protocols/](protocols/INDEX.md) — exhaustive L7 protocol table

## Cross-references
- Where these run from → [08_User_Applications](../../08_User_Applications/)
- Transport beneath → [12_Network_Transport](../12_Network_Transport/)
- TLS / certs / OAuth attacks → [14_Security/topics](../../14_Security/topics/INDEX.md)
