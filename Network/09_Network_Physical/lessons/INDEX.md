
## Dedicated Lesson Modules

| File | Covers |
|------|--------|
| [Network Physical — Interactive Labs](./physical_labs.md) | Cable testing, ethtool diagnostics, Wi-Fi signal survey |

# Network Physical — Lessons

1. **Terminate a Cat6 cable** — T568A vs T568B, RJ45 crimp, certify.
2. **Test cable with a tester** — Fluke or budget equivalent: length, wiremap, NEXT.
3. **Inspect fiber connectors** — clean with proper wipes, scope for end-face contamination.
4. **Identify transceivers** — read SFP/SFP+ EEPROM with `ethtool -m`.
5. **Spectrum sweep (wireless)** — see [16_RF_Wireless/lessons](../../../16_RF_Wireless/lessons/INDEX.md).
6. **Tune autoneg** — observe link bring-up; force speed/duplex; diagnose mismatch.
7. **Link budget for fiber** — calculate dB budget from spec sheets.
8. **Read 802.3 PCS** — understand 64B/66B, scrambling, lane bonding for 100G.
9. **WAN circuit terminology** — DS-1, T-3, OC-3, OC-48 (legacy literacy).
10. **5G NR primer** — slot structure, numerology, BWPs, beamforming.

## Lab equipment / sims
- Cable tester (Fluke MicroScanner, Klein VDV, Pockethernet)
- Fiber inspection scope, OTDR
- Spectrum analyzer (RTL-SDR for low-cost intro — see [16_RF_Wireless](../../../16_RF_Wireless/))
