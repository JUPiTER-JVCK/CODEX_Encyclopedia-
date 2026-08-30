# 19 — Industrial & Automotive Protocols (Cross-cutting)

> Field-bus, motion-control, building-automation, and vehicle-network protocols.
> Many ride below standard IP networks (or in parallel to them) and don't fit
> cleanly into the OSI-aligned layers 09–13.

## At a glance

| Field | Value |
|-------|-------|
| Spans | 09–13 + OT/ICS world; 18 (embedded) consumer |
| Description | Deterministic and/or domain-specific networks: industrial, automotive, building, energy |
| Languages | C / C++ (stack impls); Python (clients); Vector CANoe (automotive); CodeSys (PLC) |

## Subdomains

### Industrial / OT
- **Field buses** — Modbus, PROFIBUS, DeviceNet, AS-i, INTERBUS
- **Industrial Ethernet** — PROFINET, EtherNet/IP, EtherCAT, POWERLINK, Sercos III, CC-Link IE, Modbus TCP
- **Building automation** — BACnet, KNX, LonWorks, DALI, DMX512, M-Bus
- **Process** — HART, WirelessHART, ISA100.11a, Foundation Fieldbus
- **Energy / smart grid** — IEC 61850, DNP3, Modbus, IEC 60870-5
- **Semantic / interop** — OPC UA, OPC Classic (DA/AE/HDA)

### Automotive
- **CAN (CAN 2.0A/B, CAN-FD, CAN-XL)**, **LIN**, **FlexRay**, **MOST**
- **Automotive Ethernet** (100BASE-T1 / 1000BASE-T1 / MultiGBASE-T1)
- **SOME/IP, DDS** — service-oriented in-vehicle
- **AUTOSAR PDU formats**
- **UDS (ISO 14229)**, **KWP2000 (ISO 14230)**, **J1939** — diagnostics & heavy-duty
- **OBD-II (ISO 15765)** — emissions diag

### IoT / messaging (cross-link)
- **MQTT, CoAP, AMQP, NATS** — see [13_Network_Application](../Network/13_Network_Application/protocols/INDEX.md)

## Sub-sections

- [references/](references/INDEX.md)
- [lessons/](lessons/INDEX.md)
- [languages/](languages/INDEX.md)
- [man_pages/](man_pages/INDEX.md)
- [topics/](topics/INDEX.md)
- [protocols/](protocols/INDEX.md)

## Cross-references
- Ethernet PHY for industrial Ethernet → [09_Network_Physical](../Network/09_Network_Physical/)
- IP-based traffic on top → [11_Network_Internet](../Network/11_Network_Internet/)
- Embedded system context → [18_Embedded_Systems](../18_Embedded_Systems/)
- ICS / SCADA security → [14_Security/topics](../14_Security/topics/INDEX.md)
- Bus-wire physical level → [01_Circuit_Board/protocols](../01_Circuit_Board/protocols/INDEX.md)
