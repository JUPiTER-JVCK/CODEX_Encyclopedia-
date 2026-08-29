# RF / Wireless — Topics

## RF fundamentals
- **Wavelength, frequency, period** — λ = c/f
- **Bands & propagation** — VLF, LF, MF, HF, VHF, UHF, SHF, EHF; ground wave, sky wave, line of sight
- **Decibels** — dBm, dBW, dBi, dBd, dBc, dBFS, dB-Hz
- **Link budget** — Tx power + Tx antenna gain − path loss − misc − Rx noise floor + Rx antenna gain
- **Path loss models** — Friis (free space), Okumura-Hata, COST-231, Longley-Rice
- **Fading** — slow vs fast; Rayleigh, Rician, Nakagami
- **Doppler shift, coherence time / bandwidth**

## Modulation
- **Analog** — AM, FM, PM, SSB (USB/LSB), DSB-SC
- **Digital** — ASK, FSK, PSK, QAM, OFDM/OFDMA, GMSK, CPFSK
- **Spreading** — DSSS, FHSS, CSS (LoRa), CDMA
- **MIMO** — SU-MIMO, MU-MIMO, beamforming, massive MIMO, OFDMA-RU

## Coding & error control
- **Block codes** — Hamming, BCH, Reed-Solomon
- **Convolutional + Viterbi**, **Turbo codes**, **LDPC**, **Polar codes** (5G)
- **Interleaving** to combat burst errors

## Antennas
- **Types** — dipole, Yagi, log-periodic, patch, helical, horn, slot, fractal
- **Parameters** — gain (dBi), VSWR, impedance (50Ω typical), polarization, F/B ratio, bandwidth
- **Arrays & beamforming** — phased arrays, MIMO antennas
- **mmWave specifics** — high path loss, narrow beams, foliage/rain attenuation

## Receivers / transmitters
- **Superheterodyne** vs **direct conversion (zero-IF)** vs **low-IF**
- **SDR architecture** — RF front-end → ADC/DAC → DDC/DUC → host DSP
- **Sensitivity, selectivity, noise figure, IP3, dynamic range**

## Spectrum & regulation
- **Licensed vs unlicensed (ISM)** — Wi-Fi/BT in 2.4/5/6 GHz; LoRa in 868/915 MHz; etc.
- **FCC Part 15**, **ETSI EN 300 328 / 220**
- **Duty cycle** restrictions on LPWAN bands
- **TDWR/radar coexistence** — DFS rules in 5 GHz Wi-Fi

## Wi-Fi specifics
- **Bands & channels** — 2.4 (1–14), 5, 6 (UNII bands), 60 GHz (802.11ad/ay)
- **Channel widths** — 20/40/80/160/320 MHz
- **Generations** — Wi-Fi 4/5/6/6E/7 (and prior a/b/g)
- **Security** — WEP (broken), WPA, WPA2, WPA3 (SAE/Dragonfly), OWE (open enhanced)

## Bluetooth / BLE
- **Versions** — Classic 1.x–5.x; LE 4.0+; Auracast LE Audio (5.2)
- **Topologies** — piconet, scatternet (Classic); BLE star, mesh, broadcast
- **GATT, ATT, L2CAP, SMP**
- **BLE attacks** — sniffing, key negotiation flaws (KNOB), spoofing

## Cellular
- **2G GSM, 3G UMTS/HSPA, 4G LTE, 5G NR (NSA/SA)**
- **EPC vs 5GC** core networks
- **RAN split** — DU/CU/RU (Open RAN)
- **Frequencies** — FR1 (sub-6) vs FR2 (mmWave)
- **Private LTE/5G (CBRS in US)**

## GNSS
- **Constellations** — GPS, GLONASS, Galileo, BeiDou, IRNSS, QZSS
- **Signals** — L1/L2/L5
- **Augmentation** — SBAS (WAAS/EGNOS/MSAS), RTK
- **Spoofing & jamming** — defenses

## LPWAN
- **LoRa** — CSS modulation; LoRaWAN MAC (ABP/OTAA)
- **Sigfox** — UNB, low-bit-rate
- **NB-IoT / LTE-M** — licensed cellular IoT
- **Zigbee, Z-Wave, Thread, Matter** — short-range mesh

## RFID / NFC
- **LF (125 kHz)** — EM4100, HID Prox
- **HF (13.56 MHz)** — MIFARE Classic/DESFire, FeliCa, NFC (ISO 14443/15693)
- **UHF (860–960 MHz)** — EPC Gen2 (logistics)

## Broadcast
- **AM / FM**, **HD Radio (US)**, **DAB+ (EU)**
- **DVB-T / T2 / S2 / C2**, **ATSC 1.0/3.0**

## Amateur radio
- **License classes** — Tech / Gen / Extra (US)
- **Modes** — SSB, CW, FT8/FT4, PSK31, AM/FM, DMR/D-STAR/Fusion/M17
- **APRS, Packet, Winlink**
- **Repeaters, satellites (AMSAT, ARISS), EME (moonbounce)**

## Security cross-link
- KRACK, dragonblood (Wi-Fi); KNOB, BLURtooth (BT); IMSI catchers (cellular); GNSS spoofing
- Wireless attacks live in [14_Security/topics](../../14_Security/topics/INDEX.md)
