---
title: "SSH — Secure Shell Protocol"
layer: 13_Network_Application
tags: [ssh, remote-access, rfc-4251, rfc-4253, tunneling, sftp]
updated: 2026-05-21
---

# SSH — Secure Shell Protocol

> **RFC 4251** (2006) — Architecture.
> **RFC 4252** — User Authentication.
> **RFC 4253** — Transport Layer Protocol.
> **RFC 4254** — Connection Protocol.
> TCP port **22**.

SSH provides **encrypted remote shell access, file transfer, and port
forwarding**. It replaced telnet, rlogin, and rsh — and remains the
primary management protocol for every Unix/Linux system.

---

## Protocol layers

```
  ┌─────────────────────────────────────────────┐
  │         SSH Connection Protocol              │  RFC 4254
  │  (channels: session, forwarding, subsystem)  │
  ├─────────────────────────────────────────────┤
  │         SSH User Authentication              │  RFC 4252
  │  (publickey, password, keyboard-interactive, │
  │   gssapi-with-mic, hostbased)                │
  ├─────────────────────────────────────────────┤
  │         SSH Transport Layer                  │  RFC 4253
  │  (key exchange, encryption, MAC, compression)│
  ├─────────────────────────────────────────────┤
  │               TCP (port 22)                  │
  └─────────────────────────────────────────────┘
```

---

## Key exchange (transport layer)

```
  Client                                    Server
    │                                          │
    │──── "SSH-2.0-OpenSSH_9.7" ──────────────▶│   Protocol version
    │◀──── "SSH-2.0-OpenSSH_9.7" ─────────────│   exchange
    │                                          │
    │──── SSH_MSG_KEXINIT ────────────────────▶│   Algorithm
    │◀──── SSH_MSG_KEXINIT ───────────────────│   negotiation
    │                                          │
    │──── SSH_MSG_KEX_ECDH_INIT ─────────────▶│   Key exchange
    │◀──── SSH_MSG_KEX_ECDH_REPLY ────────────│   (e.g., curve25519)
    │      (host key + signature + pub key)    │
    │                                          │
    │     [derive session keys]                │
    │                                          │
    │──── SSH_MSG_NEWKEYS ───────────────────▶│   Switch to
    │◀──── SSH_MSG_NEWKEYS ──────────────────│   encrypted channel
    │                                          │
    │   ═══ Encrypted from here ═══           │
```

**Host key verification**: client checks server's public key against
`~/.ssh/known_hosts`. First connection: TOFU (Trust On First Use).

---

## Authentication methods

| Method | How it works | Security |
|--------|-------------|----------|
| `publickey` | Client proves possession of private key | Best (use Ed25519 or ECDSA) |
| `password` | Cleartext password (over encrypted channel) | OK but brute-forceable |
| `keyboard-interactive` | Challenge-response (PAM, 2FA, OTP) | Good with 2FA |
| `gssapi-with-mic` | Kerberos / GSSAPI | Enterprise SSO |
| `hostbased` | Trust the client host | Rare (weak) |
| `none` | No auth | Disabled in practice |
| Certificate | CA-signed host/user certs (OpenSSH) | Excellent at scale |

---

## Channel multiplexing

```
  ┌──────────────── SSH Connection ─────────────────┐
  │                                                  │
  │  Channel 0: session (interactive shell)          │
  │  Channel 1: session (exec: "ls -la")            │
  │  Channel 2: direct-tcpip (local port forward)   │
  │  Channel 3: forwarded-tcpip (remote forward)    │
  │  Channel 4: subsystem (sftp)                    │
  │                                                  │
  └──────────────────────────────────────────────────┘

  All channels multiplexed over a single TCP connection.
  Each channel has independent flow control (window size).
```

---

## Port forwarding (tunneling)

### Local forward (`-L`)

```
  Client:8080 ──▶ SSH Tunnel ──▶ Server ──▶ target:80

  ssh -L 8080:target:80 user@server
  Browser → localhost:8080 → (encrypted) → server → target:80
```

### Remote forward (`-R`)

```
  Server:9090 ──▶ SSH Tunnel ──▶ Client ──▶ localhost:3000

  ssh -R 9090:localhost:3000 user@server
  External → server:9090 → (encrypted) → client → localhost:3000
```

### Dynamic SOCKS proxy (`-D`)

```
  ssh -D 1080 user@server
  App → SOCKS5 localhost:1080 → (encrypted) → server → anywhere
```

---

## Key types & recommendations

| Algorithm | Key size | Status |
|-----------|----------|--------|
| Ed25519 | 256-bit | **Recommended** (fast, small, strong) |
| ECDSA (P-256/384/521) | 256-521 bit | Good |
| RSA | 3072+ bit | Legacy; 4096 for longevity |
| DSA | 1024 bit | **Deprecated** (weak) |
| sk-ed25519 | — | FIDO2/U2F hardware key |
| sk-ecdsa | — | FIDO2/U2F hardware key |

---

## OpenSSH hardening

```
# /etc/ssh/sshd_config essentials

PermitRootLogin no                    # or "prohibit-password"
PasswordAuthentication no             # keys only
PubkeyAuthentication yes
AuthenticationMethods publickey       # or "publickey,keyboard-interactive" for 2FA
MaxAuthTries 3
LoginGraceTime 30
AllowUsers deploy admin               # whitelist
X11Forwarding no
AllowTcpForwarding yes                # disable if not needed
ClientAliveInterval 300
ClientAliveCountMax 2

# Modern crypto only
KexAlgorithms sntrup761x25519-sha512@openssh.com,curve25519-sha256
HostKeyAlgorithms ssh-ed25519,ssh-ed25519-cert-v01@openssh.com
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com
```

---

## SSH agent & agent forwarding

```
  ┌──────────┐  ssh-add   ┌──────────┐  SSH   ┌──────────┐
  │ Private  │───────────▶│ ssh-agent│───────▶│  Server  │
  │ Key file │            │ (memory) │        │          │
  └──────────┘            └──────────┘        └──────────┘

  Agent forwarding (-A): server can request signatures from
  the client's agent → hop to a third host without copying keys.
  ⚠️  Risk: compromised server can use your agent. Use ProxyJump instead.
```

**ProxyJump** (`-J`): safer alternative to agent forwarding for bastion hosts:
```
ssh -J bastion user@target
```

---

## SFTP & SCP

| Protocol | Based on | Mode | Status |
|----------|----------|------|--------|
| SFTP | SSH subsystem | Interactive + scriptable | **Recommended** |
| SCP | SSH exec + rcp | Simple copy | Deprecated (OpenSSH 9.0+) |
| rsync over SSH | SSH transport | Delta sync | Common for backups |

---

## Common gotchas

- **`known_hosts` MITM warning** — server key changed (or it's an attack).
  Don't blindly remove the old key.
- **Agent forwarding risk** — root on the intermediate server can hijack your
  agent. Use `ProxyJump` or `ProxyCommand` instead.
- **SSH key sprawl** — unmanaged `authorized_keys` across hundreds of servers.
  Use SSH certificates (CA-signed) for scale.
- **Idle timeout** — firewalls / NAT drop idle TCP; use `ServerAliveInterval`.
- **Slow login** — often DNS reverse lookup on the server; fix with
  `UseDNS no` in sshd_config.
- **Port 22 blocked** — run SSH on 443 or use SSH over WebSocket / HTTPS proxy.

---

## Cross-links

- TLS (alternative encrypted transport) → [tls.md](tls.md)
- TCP (SSH transport) → [../../12_Network_Transport/protocols/tcp.md](../../12_Network_Transport/protocols/tcp.md)
- Security (key management, auth) → [../../../14_Security/protocols/INDEX.md](../../../14_Security/protocols/INDEX.md)
- OS Kernel (sshd, PAM) → [../../../05_OS_Kernel/topics/INDEX.md](../../../05_OS_Kernel/topics/INDEX.md)
