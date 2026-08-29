# Network Physical — Topics

## Wired media
- **Twisted pair** — Cat5e, Cat6, Cat6a, Cat7, Cat8; lengths, shielding (UTP/FTP/STP).
- **Coax** — RG-6, RG-59 (HFC); RG-58, LMR-400 (RF).
- **Fiber** — Single-mode (OS1/OS2), multi-mode (OM1–OM5); LC/SC/MPO connectors.
- **Twinax / DAC** — direct-attach copper for short data-center runs.
- **AOC** — active optical cables.

## Wireless overview (PHY only — see [16_RF_Wireless](../../../16_RF_Wireless/) for radio)
- **Wi-Fi PHY** — 2.4 / 5 / 6 GHz bands, channel widths 20/40/80/160/320 MHz.
- **Cellular PHY** — LTE OFDMA, 5G NR with sub-6 and mmWave.
- **BT PHY** — 1M, 2M, Coded (BLE long range).

## Optical
- **Transceiver families** — SFP (1G), SFP+ (10G), SFP28 (25G), QSFP+ (40G), QSFP28 (100G), QSFP-DD / OSFP (400/800G).
- **Reach types** — SR (multi-mode short), LR (single-mode long), ER, ZR, ZR+.
- **DWDM** — dense wavelength division multiplexing on backbone.

## PCS / PMA / PMD
- **PMD** — physical medium dependent (the optics or copper interface).
- **PMA** — physical medium attachment (lane gearbox).
- **PCS** — physical coding sublayer (line code, FEC, scrambler).
- **MII / RGMII / SGMII / XGMII / XLAUI** — MAC ↔ PHY interfaces.

## Autoneg & link bring-up
- 802.3 Clause 28 autoneg (BASE-T).
- Forced speed/duplex pitfalls; duplex mismatch CRC errors.
- FEC negotiation (RS-FEC mandatory at 100G+).

## Power
- **PoE / PoE+ / PoE++** — IEEE 802.3af/at/bt; budgets, classes.
- **EEE** — Energy-Efficient Ethernet (802.3az).

## Access tech
- **DOCSIS** — cable broadband over HFC.
- **xDSL** — ADSL/VDSL/G.fast.
- **GPON / XGS-PON / 25G-PON** — fiber-to-the-premise.
- **5G NR** — radio access network basics.
