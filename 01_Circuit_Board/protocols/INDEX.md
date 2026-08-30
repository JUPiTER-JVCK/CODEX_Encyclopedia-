# Circuit Board — Protocols (Buses & Interconnect)

Physical/electrical bus protocols that live on the board.

| Protocol | Spec | Type | Status |
|----------|------|------|--------|
| PCIe (1.0 – 6.0) | PCI-SIG Base Spec | Serial, point-to-point, lanes | Active |
| DDR4 / DDR5 | JEDEC JESD79-4 / JESD79-5 | Parallel memory bus | Active |
| LPDDR4/5 | JEDEC JESD209-4/5 | Low-power memory | Active |
| USB 2.0 / 3.x / 4 | USB-IF | Serial, host-centric tree | Active |
| Thunderbolt 3 / 4 / 5 | Intel + USB-IF | Tunnels PCIe + DisplayPort over USB-C | Active |
| SATA (I/II/III) | SATA-IO | Serial storage | Legacy/active |
| NVMe (over PCIe) | NVM Express | Storage command protocol | Active |
| SPI | de facto (Motorola) | 4-wire serial, master-slave | Active |
| I²C | NXP/Philips | 2-wire, multi-drop | Active |
| UART / RS-232 | ANSI/TIA-232-F | Asynchronous serial | Legacy/active |
| CAN bus | ISO 11898 | Multi-master, automotive | Active |
| JTAG / Boundary scan | IEEE 1149.1 | Test & debug access | Active |
| SMBus | SBS-IF | I²C-derived, system management | Active |
| HDMI | HDMI Forum | Video + audio (TMDS / FRL) | Active |
| DisplayPort | VESA | Video + audio (Main Link) | Active |
| Ethernet PHY (MII/RGMII/SGMII) | IEEE 802.3 | MAC ↔ PHY interface | Active |

## Cross-links
- Wire-level Ethernet → [09_Network_Physical/protocols](../../Network/09_Network_Physical/protocols/INDEX.md)
- RF interconnects → [16_RF_Wireless/protocols](../../16_RF_Wireless/protocols/INDEX.md)
