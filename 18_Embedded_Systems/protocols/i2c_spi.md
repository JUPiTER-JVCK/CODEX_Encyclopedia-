---
title: "I2C and SPI — Protocols"
layer: 18_Embedded_Systems
section: protocols
tags: [protocol, i2c, spi, qspi, embedded, serial, bus]
updated: 2026-05-21
---

# I2C and SPI — Protocols

---

## I2C — Inter-Integrated Circuit

### Overview

I2C is a 2-wire serial bus (SDA + SCL) supporting multiple masters and
up to 127 devices per bus (7-bit addressing) or 1023 (10-bit). Open-drain
lines with pull-up resistors — devices can only pull low; high is passive.

```
  I2C bus topology:
  
  VCC ──┬────────────┬───── (pull-up resistors)
        R              R
  SDA ──┴──┬──┬──┬──┴──
           │  │  │
         MCU Sensor1 Sensor2
  
  SCL ──┴──┬──┬──┬──┴──
           │  │  │
         MCU Sensor1 Sensor2  (all share same bus)
```

### Bus Speeds

| Mode | Speed | Typical use |
|------|-------|-------------|
| Standard mode | 100 kHz | Most sensors, EEPROMs |
| Fast mode | 400 kHz | Displays, IMUs |
| Fast mode Plus | 1 MHz | High-speed sensors |
| High speed | 3.4 MHz | Rare, special hardware |

### Addressing and Protocol

```
  I2C transaction anatomy:
  
  START condition: SDA falls while SCL is high
  ┌─────────────────────────────────────────────────────┐
  │ S │ Addr (7-bit) │ R/W │ A │ Data byte │ A │ P │
  └─────────────────────────────────────────────────────┘
   │                         │           │   │   │
   Start                     │           │   │   Stop
                        Master sends  ACK from  (SDA rises
                        address+dir   slave     while SCL high)
  
  A = ACK (SDA pulled low by receiver during 9th clock)
  NAK = SDA stays high (error or end of read)
```

### Clock Stretching

A slow slave can hold SCL low to pause the transaction until it is
ready. Masters must support clock stretching (most do).

### Repeated START

Allows read-then-write (or vice versa) without releasing the bus:

```bash
START → Write addr+W → Write reg_ptr → RSTART → Write addr+R → Read data → STOP
```

### I2C Pull-up Resistor Selection

```
  R_pull = (VCC - V_OL_max) / I_OL_max
  For VCC=3.3V, V_OL_max=0.4V, I_OL_max=3mA:
  R_pull_min = (3.3-0.4)/3mA = 967Ω → use 1kΩ

  Rise time: t_r = 0.8473 × C_bus × R_pull
  At 400 kHz: t_r must be < 300ns
  C_bus = 100pF → R_pull = 300ns/(0.8473×100pF) ≈ 3.54kΩ → use 3.3kΩ
```

---

## SPI — Serial Peripheral Interface

### Overview

SPI is a 4-wire synchronous full-duplex bus: MOSI (Master Out Slave In),
MISO (Master In Slave Out), SCLK (clock), CS (Chip Select, active low).
No standard — devices typically run 1–50 MHz.

```
  SPI bus wiring (multiple slaves):
  
  Master ──MOSI──┬──MOSI──Slave1
         ──MISO──┤──MISO──Slave1
         ──SCLK──┤──SCLK──Slave1
         ──CS1───┘──CS────Slave1
         │
         ├──MOSI──Slave2
         ├──MISO──Slave2
         ├──SCLK──Slave2
         └──CS2───CS──────Slave2
  
  Each slave has dedicated CS line; only one active at a time.
```

### SPI Clock Modes (CPOL / CPHA)

```
  CPOL=0, CPHA=0 (Mode 0) — most common:
  CLK:  ─┐─┐─┐─┐─ (idle low, sample on rising edge)
  MOSI: ─D7─D6─D5─ (data valid on rising edge)

  CPOL=1, CPHA=1 (Mode 3):
  CLK:  ─┘─┘─┘─┘─ (idle high, sample on falling edge)
  MOSI: ─D7─D6─D5─
  
  ┌──────┬──────┬────────────┬──────────────────────────────┐
  │ Mode │ CPOL │ CPHA       │ Clock idle / sample edge     │
  ├──────┼──────┼────────────┼──────────────────────────────┤
  │  0   │  0   │  0         │ Low idle / rising            │
  │  1   │  0   │  1         │ Low idle / falling           │
  │  2   │  1   │  0         │ High idle / falling          │
  │  3   │  1   │  1         │ High idle / rising           │
  └──────┴──────┴────────────┴──────────────────────────────┘
```

### SPI vs I2C Comparison

```
  ┌─────────────────┬────────────────────┬────────────────────┐
  │ Feature         │ I2C                │ SPI                │
  ├─────────────────┼────────────────────┼────────────────────┤
  │ Wires           │ 2 (SDA, SCL)       │ 4 + 1/slave (CS)   │
  │ Speed           │ Up to 3.4 MHz      │ Tens of MHz        │
  │ Addressing      │ 7 or 10-bit addr   │ CS pin per device  │
  │ Full duplex     │ No                 │ Yes                │
  │ Multi-master    │ Yes (arbitration)  │ No (usually)       │
  │ Slaves          │ Up to 127 (7-bit)  │ Limited by CS pins │
  │ Cable length    │ Short (cm–few m)   │ Very short (cm)    │
  │ Typical use     │ Sensors, EEPROMs   │ Flash, displays    │
  └─────────────────┴────────────────────┴────────────────────┘
```

---

## QSPI — Quad SPI

Flash memories often support Quad SPI: 4 data lines (IO0-IO3) instead
of 1 (MOSI/MISO), quadrupling throughput. Used for external NOR flash
running code (XiP — Execute in Place) on embedded systems.

```
  Regular SPI: 1 data line → 1 bit/clock
  Dual SPI:    2 data lines → 2 bits/clock
  Quad SPI:    4 data lines → 4 bits/clock (e.g., 160 Mbps at 40 MHz)
```

---

## Key Terms

| Term | Definition |
|------|-----------|
| SDA | Serial Data — bidirectional data line (I2C) |
| SCL | Serial Clock — master-generated clock (I2C) |
| ACK | Acknowledgment — receiver pulls SDA low on 9th clock |
| Clock stretching | Slave holds SCL low to pause master |
| MOSI | Master Out Slave In — data from master to slave (SPI) |
| MISO | Master In Slave Out — data from slave to master (SPI) |
| CPOL | Clock polarity — idle state of clock (0=low, 1=high) |
| CPHA | Clock phase — which edge samples data (0=first, 1=second) |
| XiP | Execute in Place — run code directly from external flash via QSPI |

---

## See Also

- Embedded lab exercises → [../lessons/embedded_labs.md](../lessons/embedded_labs.md)
- Embedded tools → [../man_pages/embedded_tools.md](../man_pages/embedded_tools.md)
- UART protocol → [./uart.md](./uart.md)
