---
title: "MQTT — Message Queuing Telemetry Transport"
layer: 13_Network_Application
tags: [mqtt, iot, pub-sub, messaging, broker, oasis]
updated: 2026-05-21
---

# MQTT — Message Queuing Telemetry Transport

> **MQTT 5.0**: OASIS Standard (2019).
> **MQTT 3.1.1**: OASIS Standard (2014), still widely deployed.
> TCP port **1883** (plain), **8883** (TLS).

MQTT is a lightweight **publish/subscribe** messaging protocol designed for
constrained devices and unreliable networks. It's the dominant IoT protocol
for sensor telemetry, device control, and fleet management.

---

## Architecture

```
  ┌──────────┐         ┌─────────────┐         ┌──────────┐
  │ Publisher │────────▶│   Broker    │────────▶│Subscriber│
  │ (sensor) │  PUBLISH │ (Mosquitto, │ PUBLISH │ (cloud   │
  │          │         │  EMQX,      │         │  app)    │
  └──────────┘         │  HiveMQ)    │         └──────────┘
                       │             │
  ┌──────────┐         │             │         ┌──────────┐
  │ Pub+Sub  │◀───────▶│  Topic      │◀───────▶│ Pub+Sub  │
  │ (device) │         │  routing    │         │ (dash)   │
  └──────────┘         └─────────────┘         └──────────┘
```

- **Broker** is the central hub; clients never talk directly.
- **Topics** are hierarchical strings: `home/livingroom/temperature`.
- **Wildcards**: `+` (single level), `#` (multi-level).
  - `home/+/temperature` matches `home/kitchen/temperature`.
  - `home/#` matches everything under `home/`.

---

## Connect / Publish / Subscribe flow

```
  Client                              Broker
    │                                    │
    │── CONNECT ────────────────────────▶│  (client ID, clean start,
    │   (username, password, will,       │   keep alive, session expiry)
    │    session expiry)                 │
    │◀── CONNACK ───────────────────────│  (return code, session present)
    │                                    │
    │── SUBSCRIBE ──────────────────────▶│  (topic filter, QoS)
    │◀── SUBACK ────────────────────────│
    │                                    │
    │                                    │  (another client publishes)
    │◀── PUBLISH ───────────────────────│  (topic, payload, QoS)
    │                                    │
    │── PUBLISH ────────────────────────▶│  (topic, payload, QoS)
    │                                    │
    │── DISCONNECT ─────────────────────▶│
```

---

## Quality of Service (QoS) levels

```
  QoS 0: At most once ("fire and forget")
  ┌──────┐  PUBLISH  ┌──────┐
  │Client│──────────▶│Broker│      No ACK. May be lost.
  └──────┘           └──────┘

  QoS 1: At least once
  ┌──────┐  PUBLISH  ┌──────┐
  │Client│──────────▶│Broker│
  │      │◀─ PUBACK ─│      │      Guaranteed delivery. May duplicate.
  └──────┘           └──────┘

  QoS 2: Exactly once (4-step handshake)
  ┌──────┐  PUBLISH  ┌──────┐
  │Client│──────────▶│Broker│
  │      │◀─ PUBREC ─│      │
  │      │── PUBREL ▶│      │
  │      │◀─ PUBCOMP─│      │      No loss, no duplicates. Most overhead.
  └──────┘           └──────┘
```

| QoS | Delivery | Overhead | Use case |
|-----|----------|----------|----------|
| 0 | ≤ 1 | Lowest | Frequent sensor readings (loss OK) |
| 1 | ≥ 1 | Medium | Most IoT (idempotent actions) |
| 2 | = 1 | Highest | Financial, billing, critical commands |

---

## MQTT 5.0 new features (over 3.1.1)

| Feature | Purpose |
|---------|---------|
| Reason codes | Every ACK has a numeric reason (not just success/fail) |
| Shared subscriptions | `$share/group/topic` — load-balance across subscribers |
| Session expiry interval | Persistent sessions with configurable lifetime |
| Message expiry | TTL on published messages |
| Topic alias | Integer shorthand for long topic strings (saves bandwidth) |
| User properties | Key-value metadata on any packet |
| Request/response | Response topic + correlation data for RPC patterns |
| Flow control | Receive Maximum (inflight window per client) |
| Subscription options | No Local, Retain As Published, Retain Handling |
| Auth packets | Enhanced auth (challenge-response, SCRAM, etc.) |

---

## Last Will and Testament (LWT)

```
  Client sets Will on CONNECT:
    Will Topic:   "devices/sensor42/status"
    Will Payload: "offline"
    Will QoS:     1
    Will Retain:  true

  If client disconnects ungracefully → broker publishes the will message.
  Other subscribers learn the device went offline.
```

---

## Retained messages

- Broker stores the **last message** per topic with the retain flag.
- New subscribers get the retained message immediately on subscribe.
- Publish with empty payload + retain = clear the retained message.
- Use for status: `devices/sensor42/status → "online"` (retained).

---

## MQTT packet format

```
  Fixed Header (2+ bytes):
  ┌──────┬──────┬──────┬──────┬─────┬───────────────────┐
  │ Type │ DUP  │ QoS  │Retain│     Remaining Length    │
  │ (4b) │ (1b) │ (2b) │ (1b) │   (1-4 bytes, varint)  │
  └──────┴──────┴──────┴──────┴───────────────────────┘

  Packet types:
  1=CONNECT  2=CONNACK  3=PUBLISH  4=PUBACK   5=PUBREC
  6=PUBREL   7=PUBCOMP  8=SUBSCRIBE 9=SUBACK  10=UNSUBSCRIBE
  11=UNSUBACK 12=PINGREQ 13=PINGRESP 14=DISCONNECT 15=AUTH
```

Min overhead: **2 bytes** (QoS 0 publish with short topic). This is why
MQTT is preferred over HTTP for constrained devices.

---

## Security

| Layer | Mechanism |
|-------|-----------|
| Transport | TLS 1.2/1.3 (port 8883) |
| Auth | Username/password, client certificates, OAuth 2.0 tokens, SCRAM |
| Authorization | ACLs on broker (per-client topic read/write permissions) |
| Payload | Application-level encryption (broker can't inspect) |

---

## Common gotchas

- **Clean Start = true** loses queued QoS 1/2 messages and subscriptions.
  Use **persistent sessions** for reliable delivery across reconnects.
- **Retained messages pile up** — each topic keeps exactly one; but thousands
  of topics × retained = memory pressure on the broker.
- **$SYS topics** — broker statistics; don't subscribe with `#` or you'll get
  flooded with internal metrics.
- **Keep Alive timeout** — if client doesn't PING within 1.5× keepalive, broker
  disconnects. Set appropriately for battery-powered devices.
- **Topic design** — avoid very deep hierarchies (>10 levels) and don't put
  payload data in the topic string. Keep topics semantic.
- **QoS downgrade** — broker delivers at min(publisher QoS, subscriber QoS).
  Subscribing at QoS 0 negates publisher's QoS 2.

---

## Cross-links

- CoAP (UDP alternative for IoT) → [INDEX.md](INDEX.md)
- TLS (secures MQTT) → [tls.md](tls.md)
- TCP (MQTT transport) → [../../12_Network_Transport/protocols/tcp.md](../../12_Network_Transport/protocols/tcp.md)
- Industrial protocols (MQTT in OT) → [../../../19_Industrial_Protocols/protocols/INDEX.md](../../../19_Industrial_Protocols/protocols/INDEX.md)
- Embedded (MQTT on MCUs) → [../../../18_Embedded_Systems/topics/INDEX.md](../../../18_Embedded_Systems/topics/INDEX.md)
