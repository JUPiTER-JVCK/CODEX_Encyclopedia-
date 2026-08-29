# Security — Protocols & Specs

Security-specific protocols & data formats. Protocols are listed here only when
their primary purpose is security; otherwise they live in their owning layer's
folder.

## Dedicated protocol references

| Protocol | File |
|----------|------|
| IPsec (ESP / AH / IKEv2) | [tls_ipsec.md](tls_ipsec.md) — modes, ESP format, IKEv2 exchange, vs. WireGuard |

---

## Authentication / authorization
| Protocol | RFC / Spec | Purpose |
|----------|------------|---------|
| OAuth 2.0 / 2.1 | RFC 6749 + 9700 BCP | Delegated authorization |
| OIDC | OpenID Foundation | Identity on OAuth 2 |
| SAML 2.0 | OASIS | Enterprise SSO |
| Kerberos v5 | RFC 4120 | Ticket-based auth |
| WebAuthn / FIDO2 / CTAP2 | W3C / FIDO | Passkeys, hardware tokens |
| TOTP / HOTP | RFC 6238 / 4226 | One-time passwords |
| SCIM 2.0 | RFC 7644 | Identity provisioning |
| SPIFFE / SPIRE | CNCF | Workload identity (SVIDs) |

## Cryptographic transport
| Protocol | RFC / Spec |
|----------|------------|
| TLS 1.3 | 8446 |
| DTLS 1.3 | 9147 |
| IPsec (AH/ESP/IKEv2) | 4302/4303/7296 |
| WireGuard | (live spec) |
| SSH-2 | 4251–4254 |
| MACsec | IEEE 802.1AE |
| Noise Protocol Framework | noiseprotocol.org |

## PKI / certificates
| Spec | Purpose |
|------|---------|
| X.509 v3 | RFC 5280 |
| ACME | RFC 8555 |
| Certificate Transparency | RFC 9162 |
| OCSP | RFC 6960 |
| CAA | RFC 8659 |
| CRL | RFC 5280 |

## Sharing detections & intel
| Spec | Purpose |
|------|---------|
| STIX 2.1 | Structured Threat Information |
| TAXII 2.1 | TI exchange transport |
| MISP format | MISP-native sharing |
| CycloneDX, SPDX | SBOM formats |
| in-toto, SLSA provenance | Supply-chain attestations |
| Sigstore (cosign / Rekor / Fulcio) | Signing artifacts |
| OpenC2 | Command & control for response |

## Vulnerability & weakness
| Spec | Purpose |
|------|---------|
| CVE (MITRE / CVE.org) | Vulnerability IDs |
| CWE | Weakness taxonomy |
| CVSS v3.1 / v4.0 | Severity scoring |
| EPSS | Exploit Prediction Scoring System |
| CSAF / VEX | Coordinated advisory format |
| OVAL, OSV | Machine-readable vuln data |

## Logging & event formats
| Spec | Purpose |
|------|---------|
| syslog | RFC 5424 |
| CEF | ArcSight Common Event Format |
| LEEF | IBM QRadar |
| OCSF | Open Cybersecurity Schema Framework |
| ECS | Elastic Common Schema |
| Sysmon schema | Microsoft Sysmon events |

## Crypto primitives (informational refs)
- **NIST FIPS 197** — AES
- **NIST FIPS 180-4** — SHA-2; **FIPS 202** — SHA-3
- **NIST SP 800-38D** — GCM
- **NIST SP 800-56A/B/C** — key establishment
- **NIST SP 800-208** — stateful hash sigs (XMSS/LMS)
- **NIST FIPS 203/204/205** — ML-KEM, ML-DSA, SLH-DSA (PQC)
