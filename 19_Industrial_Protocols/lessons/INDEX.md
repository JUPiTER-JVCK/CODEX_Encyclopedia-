
## Dedicated Lesson Modules

| File | Covers |
|------|--------|
| [Industrial Protocols — Interactive Labs](./industrial_labs.md) | Modbus TCP, OPC UA browse, CAN monitor, MQTT pub/sub |

# Industrial & Automotive Protocols — Lessons

## Industrial / OT
1. **Modbus RTU on RS-485** — single master + 2 slaves on a USB-to-RS485 dongle; read holding regs.
2. **Modbus TCP** — port 502 server with `pymodbus`; map exception codes.
3. **PROFINET basics** — read a vendor wireshark capture; identify DCP, MRP, RT/IRT.
4. **EtherCAT slave bring-up** — buy a SOEM/IgH master kit; observe DC sync.
5. **OPC UA hello** — `python-opcua` server + UaExpert client; browse address space.
6. **BACnet/IP** — `bacpypes` device sim; read property; subscribe to COV.
7. **DALI tour** — wire one DALI driver; use a USB DALI adapter (e.g. Lunatone).
8. **DMX512 lighting** — control a moving head from a DMX USB widget.
9. **HART** — concept walkthrough; HART modem decode via SDR.
10. **IEC 61850** — read a substation SCD; identify GOOSE messages in wireshark.

## Automotive
11. **CAN basics** — CANable / PEAK-USB; `cansend`, `candump`; arbitration ID 0x7E0.
12. **CAN-FD** — same hardware, FD frames; observe data-phase bitrate change.
13. **UDS over CAN** — read DTCs (service 0x19), clear DTCs (0x14); RoutineControl.
14. **OBD-II live data** — ELM327 adapter; query Mode 01 PIDs (speed, RPM, coolant).
15. **J1939** — heavy-duty truck PGNs; decode EEC1, ETC1.
16. **LIN** — master/slave on dev board; observe sync break + schedule table.
17. **FlexRay** — concept + vector trace; static + dynamic segments.
18. **SOME/IP** — Wireshark + sample app; events vs requests.

## ICS / SCADA security (cross-link [14](../../14_Security/))
19. **Modbus security** — sniff cleartext; deploy TLS-Modbus (RFC 8907 / 2018+).
20. **Modbus fuzzing** — `modbus-cli`, `smod`, Codesys exploits in isolated lab.
21. **CAN intrusion** — `canbusniffer`, replay attacks; awareness only.

## Suggested external
- CSS Electronics CAN bus introductions (free)
- "Wireshark for SCADA / OT" workshops (Black Hat / Idaho Falls)
- Real Pars (PLC) YouTube
