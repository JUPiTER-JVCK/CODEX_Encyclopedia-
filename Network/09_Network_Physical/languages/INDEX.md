# Network Physical — Languages

Not a software-language layer. The "language" here is **encoding and modulation**.

## Line codes (digital)
| Code | Used by |
|------|---------|
| NRZ / NRZI | RS-232, USB low/full-speed |
| Manchester | 10BASE-T Ethernet |
| 4B/5B + MLT-3 | 100BASE-TX |
| 8B/10B | 1000BASE-X, PCIe Gen1/2, SATA, USB 3.x |
| 64B/66B | 10G/40G/100G Ethernet PCS |
| 128B/130B | PCIe Gen3 |
| 256B/257B (RS-FEC) | 100G/400G |
| PAM4 | 25G/50G/100G per-lane, DDR5 |
| 4D-PAM5 | 1000BASE-T |

## Modulation (RF / fiber)
| Modulation | Used by |
|-----------|---------|
| OOK (on-off keying) | Simple optical, basic IR |
| BPSK / QPSK | satellite, 802.11 lowest rates |
| QAM-16 / 64 / 256 / 1024 / 4096 | Wi-Fi, DOCSIS, cellular |
| OFDM / OFDMA | 802.11a/g/n/ac/ax/be, LTE, 5G, DOCSIS 3.1 |
| GMSK | GSM |
| FM / FSK | analog/legacy |

## Where these are described
- IEEE 802 PHY clauses
- ITU-T G-series, 3GPP TS 38.211 for 5G NR
- DSP textbooks (see [16_RF_Wireless/references](../../../16_RF_Wireless/references/INDEX.md))
