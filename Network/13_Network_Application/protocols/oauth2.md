---
title: "OAuth 2.0 / 2.1 — Authorization Framework"
layer: 13_Network_Application
tags: [oauth, oauth2, authorization, oidc, rfc-6749, rfc-9700, tokens, pkce]
updated: 2026-05-21
---

# OAuth 2.0 / 2.1 — Authorization Framework

> **OAuth 2.0**: RFC 6749 (2012).
> **OAuth 2.0 Security BCP**: RFC 9700 (2025).
> **OAuth 2.1**: draft (consolidates 2.0 + BCP into one spec).
> **OpenID Connect (OIDC)**: identity layer on top of OAuth 2.0.

OAuth 2.0 lets a **resource owner** (user) grant a **client** (app) limited
access to a **resource server** (API) without sharing credentials. The
**authorization server** issues tokens after the user consents.

---

## Roles

```
  ┌──────────────┐                     ┌────────────────────┐
  │   Resource   │                     │   Authorization    │
  │    Owner     │                     │      Server        │
  │   (User)     │                     │ (IdP: Auth0, Okta, │
  └──────┬───────┘                     │  Keycloak, Google) │
         │ consent                     └─────────┬──────────┘
         │                                       │ issues tokens
  ┌──────▼───────┐    access token     ┌─────────▼──────────┐
  │   Client     │────────────────────▶│   Resource Server  │
  │   (App)      │                     │   (API)            │
  └──────────────┘                     └────────────────────┘
```

---

## Authorization Code flow (with PKCE)

The **recommended** flow for web apps, SPAs, mobile, and native clients.

```
  User          Client (App)           Auth Server           Resource Server
   │                │                       │                      │
   │── click "Login"│                       │                      │
   │                │── GET /authorize ────▶│                      │
   │                │   response_type=code  │                      │
   │                │   client_id=...       │                      │
   │                │   redirect_uri=...    │                      │
   │                │   scope=openid email  │                      │
   │                │   state=xyz           │                      │
   │                │   code_challenge=S256 │  ← PKCE              │
   │                │                       │                      │
   │◀── Login page ─┼───────────────────────│                      │
   │── credentials ─┼──────────────────────▶│                      │
   │                │                       │                      │
   │◀── Consent ────┼───────────────────────│                      │
   │── Approve ─────┼──────────────────────▶│                      │
   │                │                       │                      │
   │                │◀── 302 redirect ──────│                      │
   │                │   ?code=AUTH_CODE      │                      │
   │                │   &state=xyz          │                      │
   │                │                       │                      │
   │                │── POST /token ───────▶│  (back-channel)      │
   │                │   grant_type=         │                      │
   │                │   authorization_code  │                      │
   │                │   code=AUTH_CODE       │                      │
   │                │   code_verifier=...   │  ← PKCE              │
   │                │                       │                      │
   │                │◀── access_token ──────│                      │
   │                │    refresh_token      │                      │
   │                │    id_token (OIDC)    │                      │
   │                │                       │                      │
   │                │── GET /api/resource ──┼─────────────────────▶│
   │                │   Authorization:      │                      │
   │                │   Bearer <token>      │                      │
   │                │◀─ 200 OK ─────────────┼──────────────────────│
```

---

## Grant types

| Grant | Use | OAuth 2.1 status |
|-------|-----|-----------------|
| Authorization Code + PKCE | Web, mobile, SPA, native | **Required** |
| Client Credentials | Machine-to-machine (no user) | Kept |
| Device Authorization (RFC 8628) | Smart TV, IoT (no browser) | Kept |
| Refresh Token | Get new access token silently | Kept (rotation required) |
| ~~Implicit~~ | ~~SPA (token in redirect)~~ | **Removed** (use AuthCode+PKCE) |
| ~~Resource Owner Password~~ | ~~Direct username/password~~ | **Removed** |

---

## Tokens

### Access Token

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "openid email profile"
}
```

- **Bearer token** — anyone possessing it can use it (protect in transit + storage).
- Can be **opaque** (random string, introspected by resource server) or
  **JWT** (self-contained, verified with public key).
- Short-lived (minutes to hours).

### Refresh Token

- Long-lived; exchanged at the token endpoint for a new access token.
- **Rotation** (RFC 9700 BCP): each use returns a new refresh token;
  old one invalidated → detect replay.
- Store securely (HTTP-only cookie or secure storage).

### ID Token (OIDC)

A JWT with user identity claims:

```json
{
  "iss": "https://auth.example.com",
  "sub": "user123",
  "aud": "client_id",
  "exp": 1716345600,
  "iat": 1716342000,
  "nonce": "abc123",
  "email": "user@example.com",
  "name": "Alice"
}
```

---

## PKCE (Proof Key for Code Exchange)

```
  Client generates:
    code_verifier  = random 43-128 char string
    code_challenge = BASE64URL(SHA256(code_verifier))

  /authorize → sends code_challenge + method=S256
  /token     → sends code_verifier

  Auth server verifies: SHA256(code_verifier) == code_challenge

  Prevents: authorization code interception (no client_secret needed)
```

**Required** for all clients in OAuth 2.1 — including confidential clients.

---

## Scopes & consent

```
  scope=openid profile email read:repos write:repos

  Scopes are arbitrary strings defined by the resource server.
  The auth server presents them to the user during consent.
  Access token is scoped — resource server enforces.
```

Standard OIDC scopes: `openid`, `profile`, `email`, `address`, `phone`.

---

## Token validation at the Resource Server

```
  Option A: JWT validation (no network call)
  ┌─────────────────────────────────────────┐
  │ 1. Decode header → get kid              │
  │ 2. Fetch JWKS from auth server (cached) │
  │ 3. Verify signature (RSA/ECDSA)         │
  │ 4. Check exp, iss, aud, scope           │
  └─────────────────────────────────────────┘

  Option B: Token introspection (RFC 7662)
  ┌─────────────────────────────────────────┐
  │ POST /introspect                        │
  │   token=<opaque_token>                  │
  │ Response: {"active": true, "sub": ...}  │
  └─────────────────────────────────────────┘
```

---

## OpenID Connect (OIDC) — identity on OAuth

| Endpoint | Purpose |
|----------|---------|
| `/authorize` | Same as OAuth (+ `openid` scope) |
| `/token` | Returns access_token + **id_token** |
| `/userinfo` | Get user claims with access_token |
| `/.well-known/openid-configuration` | Discovery document |
| `/jwks` | Public keys for JWT verification |

---

## Security best practices (RFC 9700)

| Practice | Why |
|----------|-----|
| Always use PKCE | Prevents code interception |
| Exact redirect_uri matching | Prevents open redirect |
| Sender-constrained tokens (DPoP / mTLS) | Token binding to client |
| Short access token lifetime | Limit blast radius |
| Refresh token rotation | Detect replay |
| No tokens in URLs/query params | Logged by proxies/browsers |
| Use `state` parameter | Prevent CSRF on authorization |
| Validate `iss` in token response | Prevent mix-up attacks |

---

## Common gotchas

- **Implicit flow still in use** — many tutorials teach it; it's insecure
  (token in URL fragment, no refresh). Use Authorization Code + PKCE.
- **JWT without validation** — trusting the payload without signature
  verification = anyone can forge tokens.
- **Long-lived access tokens** — reduces the value of revocation; keep ≤ 1 hour.
- **Refresh token not rotated** — stolen refresh token = permanent access.
- **Wildcard redirect_uri** — open redirect → token theft.
- **Scope confusion** — API grants more permissions than the scope implies;
  always validate scope at the resource server.
- **ID token as API credential** — ID tokens are for the client; use access
  tokens for API calls.

---

## Cross-links

- HTTP (OAuth is HTTP-based) → [http.md](http.md)
- TLS (protects all OAuth flows) → [tls.md](tls.md)
- JWT / JOSE → [INDEX.md](INDEX.md)
- Security (auth patterns) → [../../../14_Security/protocols/INDEX.md](../../../14_Security/protocols/INDEX.md)
- DNS (discovery endpoints) → [dns.md](dns.md)
