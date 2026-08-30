
## Dedicated Lesson Modules

| File | Covers |
|------|--------|
| [Network Application — Interactive Labs](./application_labs.md) | DNS trace, TLS decode, HTTP/2 framing |

# Network Application — Lessons

1. **HTTP/1.1 by hand** — `telnet` (or `nc`) to port 80; type `GET / HTTP/1.1\r\nHost: ...\r\n\r\n`.
2. **HTTP/2 server** — nginx or h2o; verify with `curl --http2`.
3. **HTTP/3 server** — quiche/caddy/H2O; verify with `curl --http3`.
4. **TLS handshake** — `openssl s_client -connect host:443 -tls1_3`; read the certs.
5. **ACME / Let's Encrypt** — issue a cert via `certbot` or `acme.sh`; auto-renew.
6. **mTLS** — issue client cert + private CA; nginx `ssl_verify_client on`.
7. **DNS zone** — author a zone file; sign with DNSSEC; serve with BIND/Knot.
8. **DoH/DoT clients** — `dnscrypt-proxy`, `cloudflared`, `stubby`.
9. **OAuth 2.1 flow** — implement Authorization Code + PKCE end-to-end.
10. **WebSocket** — chat server (gorilla/ws, ws (npm), websockets (py)).
11. **gRPC** — define a .proto, generate code, call from two languages.
12. **MQTT** — Mosquitto broker, paho client, QoS levels.
13. **SMTP triad** — set up SPF + DKIM + DMARC for a domain; test with mail-tester.com.
14. **SSH cheats** — port forwarding (`-L`, `-R`, `-D`), ProxyJump, certs not keys.
15. **WebRTC data channel** — STUN/TURN + SCTP-over-DTLS hello.

## Suggested external
- web.dev "Performance" track
- Cloudflare Learning Center
- HTTP/3 explained (Daniel Stenberg, free)
