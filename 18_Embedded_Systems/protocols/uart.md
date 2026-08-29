---
title: "UART — Universal Asynchronous Receiver-Transmitter"
layer: 18_Embedded_Systems
section: protocols
tags: [protocol, uart, rs232, rs485, serial, embedded]
updated: 2026-05-21
---

# UART — Universal Asynchronous Receiver-Transmitter

---

## Overview

UART is a hardware serial communication protocol that transmits data
asynchronously over two wires (TX and RX). Both sides agree on baud rate
(bits/second) in advance — there is no clock signal. Each byte is wrapped
in a start bit, optional parity, and one or two stop bits.

```
  UART frame (8N1 — most common):
  
  Idle: ────────────────────────────────────── HIGH (mark)
  
         Start  D0  D1  D2  D3  D4  D5  D6  D7  Stop
  ──────┐   ┌───┐   ┌───┐   ┌───┐   ┌───┐   ┌───┐   ┌──────
        │   │   │   │   │   │   │   │   │   │   │   │
        └───┘   └───┘   └───┘   └───┘   └───┘   └───┘
        0   1   0   1   0   1   0   1   0   1   1  (stop)
              LSB first → 0b00101010 = 0x2A = '*'
  
  Timing: each bit occupies 1/baud seconds
  At 115200 baud: 1 bit = 8.68 µs, 1 byte (10 bits total) = 86.8 µs
```

---

## Common Baud Rates

| Baud rate | Bits/sec | Bytes/sec | Typical use |
|-----------|---------|-----------|-------------|
| 9600 | 9600 | 960 | Legacy devices, GPS NMEA |
| 115200 | 115200 | 11520 | Debug console, most MCUs |
| 230400 | 230400 | 23040 | Higher-speed MCU comms |
| 921600 | 921600 | 92160 | Maximum on many UART cores |
| 4000000 | 4 Mbps | 400000 | High-speed (short cable) |

---

## Frame Formats (Config Notation: 8N1)

```
  Data bits: 5, 6, 7, 8, 9
  Parity: N (none), E (even), O (odd), M (mark), S (space)
  Stop bits: 1, 1.5, 2

  Common configs:
  8N1 — 8 data, no parity, 1 stop (default, most used)
  8E1 — 8 data, even parity, 1 stop (industrial, legacy)
  7E1 — 7 data, even parity, 1 stop (some telecom)
  8N2 — 8 data, no parity, 2 stop (slow devices, ensures gap)
```

---

## Hardware Flow Control (RTS/CTS)

```
  Without flow control: TX can overflow RX buffer
  
  RTS/CTS handshaking:
  
  Device A         Device B
  ────────         ────────
  TX ──────────▶ RX
  RX ◂─────────── TX
  RTS ─────────▶ CTS   "I am ready to receive"
  CTS ◂───────── RTS   "I am ready to receive"
  
  When Device B's RX buffer is almost full:
  Device B de-asserts RTS (high) → Device A stops sending
  When buffer drains, Device B asserts RTS (low) → resume
```

---

## RS-232, RS-422, RS-485

UART defines the protocol; the physical layer can vary:

```
  ┌──────────────┬──────────────┬────────────────┬────────────────────┐
  │ Standard     │ Voltage      │ Topology       │ Max distance/speed │
  ├──────────────┼──────────────┼────────────────┼────────────────────┤
  │ TTL UART     │ 0V / 3.3-5V  │ Point-to-point │ ~1m / ~1 Mbps      │
  │ RS-232       │ ±3–15V       │ Point-to-point │ 15m / 115200 bps   │
  │ RS-422       │ Differential │ Point-to-point │ 1200m / 10 Mbps    │
  │              │ ±2–6V        │ (multi-drop RX)│                    │
  │ RS-485       │ Differential │ Multi-drop     │ 1200m / 10 Mbps    │
  │              │ ±1.5–5V      │ up to 32 nodes │                    │
  └──────────────┴──────────────┴────────────────┴────────────────────┘
```

### RS-485 Half-Duplex Bus

```
  RS-485 network (half-duplex, 2-wire):
  
  Termination     Termination
  120Ω            120Ω
  │               │
  ├──A(+)──┬──A(+)──┬──A(+)──┤
  │        │        │        │
  ├──B(-)──┴──B(-)──┴──B(-)──┤
  │        │                 │
  Master  Node1             Node2
  
  Only one node transmits at a time (collision avoidance by protocol)
  DE pin: Drive Enable — assert to transmit, deassert to receive
```

---

## UART on Linux

```bash
# List serial ports
ls /dev/ttyUSB* /dev/ttyS* /dev/ttyACM*

# Configure and connect (minicom)
minicom -D /dev/ttyUSB0 -b 115200

# or stty + cat/echo
stty -F /dev/ttyUSB0 115200 raw cs8 -cstopb -parenb
cat /dev/ttyUSB0 &       # background reader
echo "hello" > /dev/ttyUSB0

# Python (pyserial)
python3 -c "
import serial, time
s = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)
s.write(b'hello\r\n')
time.sleep(0.1)
print(s.read(100))
s.close()
"
```

---

## Key Terms

| Term | Definition |
|------|-----------|
| Baud rate | Symbols per second (for UART: bits per second) |
| Start bit | Always 0 (space) — marks beginning of frame |
| Stop bit | Always 1 (mark) — marks end of frame, idle returns high |
| Parity | Optional error-detection bit (even/odd count of 1-bits) |
| 8N1 | 8 data bits, No parity, 1 stop bit |
| RTS | Request To Send — asserted to signal readiness to receive |
| CTS | Clear To Send — asserted by peer when it can accept data |
| RS-232 | Single-ended unbalanced voltage standard for serial comms |
| RS-485 | Differential balanced bus, multi-node, industrial standard |
| Break signal | TX held low for > 1 frame duration (signals to receiver) |

---

## See Also

- Embedded lab exercises → [../lessons/embedded_labs.md](../lessons/embedded_labs.md)
- Embedded tools (minicom, picocom) → [../man_pages/embedded_tools.md](../man_pages/embedded_tools.md)
- I2C and SPI protocols → [./i2c_spi.md](./i2c_spi.md)
