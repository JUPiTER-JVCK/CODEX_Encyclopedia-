---
title: "OPC UA — Unified Architecture Protocol"
layer: 19_Industrial_Protocols
section: protocols
tags: [protocol, opc-ua, iiot, information-model, pubsub, security, tsn]
updated: 2026-05-21
---

# OPC UA — Unified Architecture Protocol

---

## Overview

OPC Unified Architecture (IEC 62541) is a platform-independent, service-
oriented IIoT communication standard from the OPC Foundation (2008+).
Unlike classic OPC (COM/DCOM Windows-only), OPC UA runs on any OS and
natively includes security.

```
  OPC UA stack:
  ┌──────────────────────────────────────────────────────────┐
  │           Application (client / server / publisher)      │
  ├──────────────────────────────────────────────────────────┤
  │  Information Model (address space, nodes, references)    │
  ├──────────────────────────────────────────────────────────┤
  │  Services: Session, Browse, Read, Write, Subscribe, Call │
  ├──────────────────────────────────────────────────────────┤
  │  Security: certificates, signing, encryption, user auth  │
  ├──────────────────────────────────────────────────────────┤
  │  Transport: UA TCP (port 4840) / HTTPS / WebSocket / AMQP│
  └──────────────────────────────────────────────────────────┘
```

---

## Information Model — Address Space

OPC UA models all data and functionality as a graph of **nodes** connected
by **references**. Every item in the address space is a node.

### Node Classes

| Class | Description | Example |
|-------|-------------|---------|
| Object | Represents a system component | "Pump1" |
| Variable | Holds a data value | "Temperature" (Float, °C) |
| Method | Callable function | "StartPump()" |
| ObjectType | Template for Objects | "PumpType" |
| VariableType | Template for Variables | "AnalogItemType" |
| View | Filtered subset of address space | "SafetyView" |
| DataType | Data type definition | "EUInformation" |
| ReferenceType | Named relationship | "HasComponent", "Organizes" |

### Address Space Hierarchy

```
  Root (ns=0, id=84)
  └─ Objects (ns=0, id=85)
     ├─ Server (ns=0, id=2253)   ← mandatory server info node
     └─ MyFactory (ns=2, id=1)
        └─ Line1 (ns=2, id=2)
           ├─ Temperature (Variable, Float)
           │  └─ EURange (Property): [0..200]°C
           ├─ Status (Variable, Enumeration)
           └─ StartLine (Method)
  
  Node ID format: ns=<namespace_index>;<type>=<value>
  e.g.: ns=2;i=1001  (numeric)  or  ns=2;s=Line1 (string)
```

---

## Services

### Client-Server Services

| Service | Description |
|---------|-------------|
| Browse | Walk the address space tree |
| Read | Read one or more node attributes (Value, DataType, etc.) |
| Write | Write to a writable variable |
| Subscribe | Register for MonitoredItem changes |
| Call | Invoke a Method node |
| CreateSession | Establish authenticated session |
| GetEndpoints | Discover server endpoints and security policies |

### Session Lifecycle

```
  Client                          Server
    │                                │
    │──── GetEndpoints ─────────────▸│
    │◂─── Endpoints + certificates ──│
    │                                │
    │──── OpenSecureChannel ────────▸│  (TLS-like key exchange)
    │◂─── SecureChannel ID ──────────│
    │                                │
    │──── CreateSession ────────────▸│  (user credentials)
    │◂─── Session ID ────────────────│
    │                                │
    │──── ActivateSession ──────────▸│  (sign + user token)
    │◂─── OK ────────────────────────│
    │                                │
    │══ Read / Browse / Subscribe ═══│
```

---

## Subscriptions and MonitoredItems

OPC UA's subscription model lets servers push data changes to clients:

```python
# Server pushes when Temperature changes by > 0.5°C (deadband)
subscription = await client.create_subscription(
    period=500,          # Publish interval: 500ms
    handler=my_handler
)
node = client.get_node("ns=2;i=1001")
monitored = await subscription.subscribe_data_change(node,
    queuesize=10,
    deadband=0.5        # MonitoringFilter: filter noise
)
# Server only sends notification when |new_value - last_sent| > 0.5
```

---

## Security

OPC UA security has three dimensions:

### Security Modes

| Mode | Message signing | Encryption |
|------|----------------|-----------|
| None | No | No |
| Sign | Yes | No |
| Sign & Encrypt | Yes | Yes (recommended) |

### Security Policies

| Policy | Key exchange | Symmetric cipher |
|--------|-------------|-----------------|
| Basic256Sha256 | RSA-2048 + SHA-256 | AES-256-CBC |
| Aes128_Sha256_RsaOaep | RSA-2048-OAEP | AES-128-CBC |
| Aes256_Sha256_RsaPss | RSA-4096-PSS | AES-256-GCM |

### User Authentication

- Anonymous (testing only)
- Username + password (encrypted in channel)
- X.509 Certificate
- IssuedToken (OAuth 2.0 JWT bearer)

---

## PubSub Extension (OPC UA Part 14)

For high-throughput, many-to-many scenarios, OPC UA PubSub avoids
the overhead of individual sessions:

```
  Publisher ──▶ MQTT/AMQP/UDP broker ──▶ Subscriber(s)
  
  DataSetWriter → MessageBus → DataSetReader
  
  Advantages:
  - No per-subscriber connection overhead
  - Works over TSN (Time-Sensitive Networking) for deterministic delivery
  - Compatible with field device publishers (no session management)
```

---

## Companion Specifications

OPC UA defines companion specs for vertical industries:

| Spec | Domain |
|------|--------|
| OPC UA for Robotics | Robot kinematics, joints, programs |
| OPC UA for CNC | Axis data, G-code state, tools |
| OPC UA for PackML | Packaging machine states, modes |
| OPC UA for AutoID | RFID readers, barcodes |
| OPC UA for BACnet | Building automation integration |
| OPC UA for PLC | IEC 61131-3 program access |

---

## Key Terms

| Term | Definition |
|------|-----------|
| Node | Basic address space element — typed, has attributes |
| Reference | Directed link between two nodes (typed) |
| Namespace | Scoping mechanism — avoids node ID conflicts between vendors |
| NodeId | Unique identifier: namespace + type + value |
| Attribute | Named property of a node (Value, DataType, BrowseName, etc.) |
| Subscription | Client registers interest; server sends publish messages |
| MonitoredItem | One node attribute within a subscription |
| Secure channel | Encrypted/signed transport channel (pre-session) |
| Session | Authenticated context over a secure channel |
| OPC Foundation | Standards body maintaining OPC UA specification |

---

## See Also

- Industrial lab exercises → [../lessons/industrial_labs.md](../lessons/industrial_labs.md)
- Modbus protocol → [./modbus.md](./modbus.md)
- MQTT protocol → [../../Network/13_Network_Application/protocols/INDEX.md](../../Network/13_Network_Application/protocols/INDEX.md)
