# Network Application — Protocols (the big table)

## Dedicated protocol references

| Protocol | File |
|----------|------|
| HTTP (1.1 / 2 / 3) | [http.md](http.md) — versions, framing, methods, caching, security headers |
| TLS (1.2 / 1.3) | [tls.md](tls.md) — handshake diagrams, cipher suites, certificates, ACME |
| DNS | [dns.md](dns.md) — resolution flow, records, DNSSEC, encrypted DNS |
| SSH | [ssh.md](ssh.md) — protocol layers, key exchange, auth methods, port forwarding, hardening |
| DHCP | [dhcp.md](dhcp.md) — DORA process, DHCPv6, relay, snooping, options table |
| MQTT | [mqtt.md](mqtt.md) — pub/sub architecture, QoS levels, MQTT 5.0, LWT, retained messages |
| OAuth 2.0 | [oauth2.md](oauth2.md) — authorization code + PKCE flow, tokens, OIDC, security BCP |

---

## Web / HTTP family
| Protocol | RFC(s) | Notes |
|----------|--------|-------|
| HTTP/1.1 | 9112 + 9110/9111 | Text, headers, keep-alive |
| HTTP/2 | 9113 | Binary, multiplexed |
| HTTP/3 | 9114 | Over QUIC |
| WebSocket | 6455 | Upgrade-based bidirectional |
| WebTransport | drafts | Over HTTP/3 |
| Server-Sent Events | (W3C / WHATWG) | One-way streaming |
| HPACK / QPACK | 7541 / 9204 | Header compression |
| HTTP caching | 9111 | Cache-Control semantics |

## RPC / APIs
| Protocol | Owner | Notes |
|----------|-------|-------|
| gRPC | CNCF | HTTP/2 + protobuf |
| JSON-RPC 2.0 | jsonrpc.org | Spec |
| GraphQL | GraphQL Foundation | Schema + query language |
| OData | OASIS | RESTful conventions |
| SOAP / WS-* | W3C / OASIS | Legacy XML RPC |
| Cap'n Proto / Thrift / Avro | various | IDL-based |

## TLS / crypto transport
| Protocol | RFC | Notes |
|----------|-----|-------|
| TLS 1.3 | 8446 | Current |
| TLS 1.2 | 5246 | Still widely deployed |
| DTLS 1.2 / 1.3 | 6347 / 9147 | TLS over UDP |
| ALPN | 7301 | App-layer protocol negotiation |
| ESNI / ECH | drafts | Encrypted ClientHello |
| ACME | 8555 | Cert issuance protocol |
| CT (Certificate Transparency) | 9162 | Auditable cert logs |

## DNS
| Protocol | RFC | Notes |
|----------|-----|-------|
| DNS | 1034 / 1035 | Foundational |
| DNSSEC | 4033–4035 | Signed records |
| DoH | 8484 | DNS over HTTPS |
| DoT | 7858 | DNS over TLS |
| DoQ | 9250 | DNS over QUIC |
| EDNS(0) | 6891 | Extension mechanism |
| SVCB / HTTPS | 9460 | Service binding records |

## Auth / identity
| Protocol | RFC / Spec | Notes |
|----------|------------|-------|
| OAuth 2.0 | 6749 + 9700 (BCP) | Authorization framework |
| OAuth 2.1 | drafts | Consolidates 2.0 BCP |
| OIDC | OpenID | Identity layer on OAuth |
| SAML 2.0 | OASIS | Enterprise SSO |
| WebAuthn / FIDO2 | W3C / FIDO | Passkeys |
| JWT | 7519 | JSON token |
| JOSE | 7515–7520 | JWS/JWE/JWK/JWA |
| Kerberos v5 | 4120 | Ticket-based |
| LDAP v3 | 4511 | Directory access |
| SASL | 4422 | Auth framework |

## Mail
| Protocol | RFC | Notes |
|----------|-----|-------|
| SMTP | 5321 | Transport |
| Submission | 6409 | Port 587 |
| IMAP4rev2 | 9051 | Retrieval |
| POP3 | 1939 | Retrieval (legacy) |
| JMAP | 8620+ | Modern mail/contacts/cal API |
| SPF | 7208 | Sender Policy Framework |
| DKIM | 6376 | Signed mail |
| DMARC | 7489 | Alignment policy |
| ARC | 8617 | Forwarding chain |
| MTA-STS | 8461 | TLS policy discovery |
| TLS-RPT | 8460 | Reporting |

## File transfer
| Protocol | RFC | Notes |
|----------|-----|-------|
| FTP | 959 | Active/passive |
| FTPS | 4217 | FTP over TLS |
| SFTP | (SSH spec) | Distinct from FTPS |
| WebDAV | 4918 | HTTP-based |
| NFS v4.x | 7530 | Network filesystem |
| SMB 3 | MS-SMB2 | Microsoft FS |
| rsync | (de facto) | Delta sync |

## Real-time / media
| Protocol | RFC | Notes |
|----------|-----|-------|
| RTP / RTCP | 3550 | Media transport |
| SIP | 3261 | Signaling |
| RTSP | 7826 | Streaming control |
| SDP | 8866 | Session description |
| SRTP | 3711 | Secure RTP |
| WebRTC | (W3C bundle) | ICE + DTLS-SRTP + SCTP |
| HLS | 8216 | Apple HTTP streaming |
| DASH | ISO 23009 | MPEG DASH |

## IoT / messaging
| Protocol | Spec | Notes |
|----------|------|-------|
| MQTT 5.0 | OASIS | Pub/sub |
| AMQP 0.9.1 | RabbitMQ | Brokered |
| AMQP 1.0 | OASIS | Different model |
| CoAP | RFC 7252 | UDP REST-ish for IoT |
| NATS | (de facto) | High-throughput pub/sub |
| Kafka protocol | (de facto) | Log-based |

## Management / time
| Protocol | RFC | Notes |
|----------|-----|-------|
| SNMP v3 | 3411–3418 | With security |
| NETCONF | 6241 | XML config |
| RESTCONF | 8040 | HTTP analog |
| gNMI / gNOI | OpenConfig | gRPC-based |
| syslog | 5424 | Structured logging |
| NTP v4 | 5905 | Time sync |
| NTS | 8915 | NTP authentication |
| PTPv2 | IEEE 1588 | Precision time |
| BMC / Redfish | DMTF | Out-of-band mgmt (cross-link [03_Firmware_BIOS](../../../03_Firmware_BIOS/)) |
