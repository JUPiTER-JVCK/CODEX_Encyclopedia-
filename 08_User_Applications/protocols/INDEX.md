# User Applications — Protocols & App-Level Standards

## Inter-app & integration
| Protocol / spec | Purpose |
|----------------|---------|
| Clipboard formats | Per-OS: NSPasteboard types, Win32 CF_*, X11 selections |
| Drag-and-drop | UTI (Apple), MIME (web/X11), CF_* (Win) |
| MIME types | RFC 6838 + IANA registry |
| URL schemes | Custom + reserved (mailto:, tel:, sms:, app deep links) |
| OpenSearch | Browser search engine plugins |
| Web Share API | W3C cross-app share |

## Document & data interchange
| Format | Owner | Notes |
|--------|-------|-------|
| PDF (ISO 32000) | ISO | Portable Document Format |
| OOXML (ISO/IEC 29500) | Microsoft / ISO | docx, xlsx, pptx |
| ODF (ISO/IEC 26300) | OASIS | LibreOffice native |
| EPUB | W3C | Reflowable books |
| Markdown / CommonMark | community | Plain-text formatting |
| CSV (RFC 4180) | IETF | Tabular plain-text |
| iCalendar (RFC 5545) | IETF | Calendar events |
| vCard (RFC 6350) | IETF | Contacts |

## App-bundle / signing standards
- **Apple notarization & Gatekeeper**
- **Authenticode** (Windows)
- **Android Signing Scheme v1–v4**
- **Sigstore / cosign** for OCI artifacts and binaries

## App identity / auth (often used by apps)
- **OAuth 2.0 / 2.1**, **OIDC**, **PKCE** (RFC 7636), **SAML 2.0**
- **WebAuthn / FIDO2** — passkeys
- **App Attest / Play Integrity** — device attestation for app authenticity

## Cross-link
- The actual wire protocols apps speak → [13_Network_Application/protocols](../../Network/13_Network_Application/protocols/INDEX.md)
- LLM/agent app integration → [15_AI_ML/protocols](../../15_AI_ML/protocols/INDEX.md)
