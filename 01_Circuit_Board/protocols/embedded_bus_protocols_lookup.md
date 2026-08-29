---
title: Embedded Bus Protocols — Logic-Analyzer Decoder Catalog
layer: 01_Circuit_Board
section: protocols
tags: [logic-analyzer, decoders, dslogic, sigrok, embedded-bus]
updated: 2026-05-20
source_image: ../../_assets/dslogic_decoder_list.png
---

# Embedded Bus Protocols — Decoder Catalog

> Reproduced from the supplied logic-analyzer software protocol-decoder table
> (DSLogic / sigrok PulseView style). This is the practical "every bus you
> might see on a board" reference. Decoders are split into **base protocols**
> (line-level / framing) and **upper-layer protocols** (built on top of one of
> the base set).
>
> Each entry is mapped to the codex layer that owns its protocol-level entry.
> Many of these are tiny chip-specific decoders — for those, the spec lives
> in the chip's datasheet, not in a standards body.

---

## Base protocols

| Decoder | Codex layer / category |
|---------|------------------------|
| 1-Wire link layer | 01 (serial bus, Dallas/Maxim) |
| aud | 02 CPU (ARM Trace audio capture variant) |
| avr_pdi | 03 Firmware (Atmel AVR PDI programming) |
| bean | 19 Industrial (LCN-BEAN, building auto.) |
| caliper | misc (digital caliper) |
| can/canfd | 19 Industrial (automotive CAN) |
| Carrera | misc (slot-car set) |
| cec | 01/13 (HDMI Consumer Electronics Control) |
| cjtag | 00d/01 (compact JTAG, IEEE 1149.7) |
| counter | misc (logic counter) |
| dali | 19 (DALI lighting) |
| dcc | misc (model-railroad Digital Command Control) |
| dcf77 | 13 (longwave time signal) |
| delta-sigma | 00c Analog (ΣΔ stream) |
| dsi | 01 (MIPI DSI display) |
| em4100 | 16 RF (125 kHz RFID) |
| em4305 | 16 RF (125 kHz writable RFID) |
| emmc_sd | 01 (eMMC / SD command/data) |
| flexray | 19 Auto (FlexRay) |
| gpib | 01 (IEEE 488 instrument bus) |
| graycode | 00d (gray-code encoder) |
| guess_bitrate | tool helper |
| hdlc | 13 (PPP/X.25 framing) |
| i2c | 01 (I²C) |
| i2s | 01 (I²S audio) |
| ieee488 | 01 (synonym for GPIB) |
| ir_irmp | 16 RF (consumer IR multi-proto) |
| ir_itto | 16 RF |
| ir_nec | 16 RF (NEC IR remote) |
| ir_rc5 | 16 RF (Philips RC-5) |
| ir_rc6 | 16 RF (Philips RC-6) |
| ir_recoil | 16 RF (Recoil IR game) |
| ir_sirc | 16 RF (Sony SIRC) |
| iso7816 | 01 (smartcards) |
| jitter | 00c/00d (signal jitter analysis) |
| jtag | 01/00d (IEEE 1149.1) |
| lfast | 01 (TI LFAST high-speed serial) |
| lpc | 03 Firmware (Low Pin Count, ISA replacement) |
| maple_bus | misc (Sega Dreamcast) |
| mcs48 | misc (Intel 8048 family) |
| mdio | 09 Network Physical (MAC↔PHY mgmt) |
| microwire | 01 (early SPI variant) |
| miller | 16 RF (Miller-coded RFID) |
| mipi_dsi | 01 (MIPI DSI display) |
| morse | 16 RF (CW Morse code) |
| mvb | 19 (Train Multi-function Vehicle Bus) |
| numbers_and_state | tool helper |
| ook | 16 RF (On-Off Keying) |
| onesinglewire | 01 (One-wire variant) |
| parallel | 01 (generic parallel bus) |
| pcfx_cntrlr | misc (NEC PC-FX controller) |
| pjdl | 01 (PJON Data Link) |
| ps2 | 01 (PS/2 keyboard/mouse) |
| pwm | 00d (PWM signal decode) |
| qi | 16 RF (wireless charging) |
| qspi | 01 (Quad SPI flash) |
| rc_encode | 16 RF |
| rgb_led_ws281x | 01 (NeoPixel WS281x timing) |
| rinnai-control-panel | misc (water heater) |
| rpm | misc (RPM tach signal) |
| rvswd | 03 Firmware (CH32V debug) |
| sae_j1850_vpw | 19 Auto (legacy GM/Ford) |
| sae_j2716_sent | 19 Auto (SENT sensor bus) |
| sda2506 | misc (EEPROM) |
| sdcard_sd | 01 (SD card) |
| sdq | 01 (Apple 1-wire variant for batteries) |
| seven_segment | 00d (7-seg display) |
| signature | tool helper |
| sle44xx | 01 (smartcard) |
| sony_md | misc (Sony MiniDisc) |
| spdif | 01/13 (S/PDIF digital audio) |
| spi | 01 (SPI) |
| ssi32 | 01 (synchronous serial) |
| st7735 | misc (LCD controller) |
| stepper_motor | 18/00c (stepper coils) |
| swd | 01/03 (ARM SWD) |
| swi | 01 (Atmel single-wire interface) |
| swim | 03 (ST single-wire interface module) |
| t55xx | 16 RF (Atmel 125 kHz tag) |
| timing | tool helper |
| tlc5620 | misc (TI DAC) |
| tmc | misc (motor driver) |
| uart | 01 / 18 (UART) |
| usb_packet | 01 (USB packet) |
| usb_power_delivery | 01 (USB-PD) |
| usb_request | 01 (USB control transfers) |
| usb_signalling | 01 (USB PHY signalling) |
| wiegand | 16 RF (access-control card readers) |
| X10 RF Decoding | 16 RF / 19 (home auto) |
| xy2-100 | misc (galvanometer scanner) |
| z80 | 02 CPU (Z80 bus) |

---

## Upper-layer protocols (built on base)

| Decoder | Carries on top of | Codex layer / category |
|---------|--------------------|------------------------|
| ac97 | I²S/parallel | 01 Audio codec |
| ad5626 | SPI | misc DAC |
| ad79x0 | SPI | misc ADC |
| ade77xx | SPI | misc energy meter IC |
| adf435x | SPI | misc PLL |
| adns5020 | SPI | misc optical mouse sensor |
| adxl345 | I²C/SPI | 00b accelerometer |
| am230x | 1-Wire | 18 humidity/temp sensor |
| amulet_ascii | UART | misc HMI display |
| arm_etmv3 | parallel | 02 CPU trace |
| arm_itm | parallel | 02 CPU trace |
| arm_tpiu | parallel | 02 CPU trace |
| as5047 | SPI | misc magnetic encoder |
| atsha204a | I²C | 14 secure auth |
| avr_isp | SPI | 03 AVR programming |
| bh1750 | I²C | 18 ambient light |
| bluetooth_h4 | UART | 16 BT host controller |
| boost | I²C | misc |
| cc1101 | SPI | 16 RF transceiver |
| cfp | parallel | misc |
| crsf | UART | 16 RF (Crossfire RC) |
| ds18b20 | 1-Wire | 18 temperature |
| ds1307 | I²C | 18 RTC |
| ds2408 | 1-Wire | 18 8-channel IO |
| ds243x | 1-Wire | 18 / 14 (ID + auth) |
| ds28ea00 | 1-Wire | 18 |
| ds3231 | I²C | 18 high-accuracy RTC |
| ds3231 | I²C | 18 RTC |
| dmx512 | RS-485 | 19 Lighting |
| edid | I²C | 01/08 (display EDID) |
| eeprom24xx | I²C | 01 EEPROM |
| eeprom93xx | Microwire | 01 EEPROM |
| enc28j60 | SPI | 09/10 (Microchip Ethernet MAC) |
| hdcp | HDMI/DDC | 14 / 01 |
| hdmi_scdc | I²C | 01 HDMI status |
| i2cdemux / i2cfilter | I²C | tool helper |
| i2s decode | I²S | 01 audio |
| jtag_avr | JTAG | 03 AVR |
| jtag_ejtag | JTAG | 02 MIPS EJTAG |
| jtag_stm32 | JTAG | 03 ST |
| ltar smartdevice / decode | UART | misc (laser tag) |
| ltc26x7 | I²C | misc DAC |
| ltc242x | SPI | misc ADC |
| lin | UART (LIN) | 19 Automotive |
| lm75 | I²C | 18 temperature |
| max6954 / max7219 | SPI | misc LED driver |
| midi | UART | misc audio |
| mlx90614 | I²C | 18 IR thermometer |
| modbus | UART/TCP | 19 Industrial |
| mpu6050 | I²C | 00b IMU |
| mrf24j40 | SPI | 16 802.15.4 |
| mxc6225xu | I²C | 00b accelerometer |
| nes_gamepad | parallel/serial | misc retro |
| nrf24l01 / nrf905 | SPI | 16 RF transceiver |
| nunchuk | I²C | misc gaming peripheral |
| ook_oregon / ook_vis | OOK | 16 RF weather telemetry |
| pan1321 | UART | 16 BT module |
| pca9571 | I²C | misc IO expander |
| pjon | UART | 01 multi-master bus |
| ps2 | PS/2 base | 01 keyboard/mouse |
| rfm12 | SPI | 16 RF transceiver |
| rgb_led_spi | SPI | 01 LED matrix |
| rtc8564 | I²C | 18 RTC |
| sbus_futaba | UART | 16 RC receiver |
| sdcard_spi | SPI | 01 SD card |
| sipi | SPI | misc |
| slip | UART | 13 (Serial Line IP) |
| spiflash | SPI | 03 boot flash |
| ssd1306 | I²C/SPI | 01 OLED display |
| ssi32 | SSI | 01 |
| st25dv | NFC | 16 NFC tag |
| st25r39xx_spi | SPI | 16 NFC reader |
| streletz | UART | misc alarm |
| tca6408a | I²C | 01 IO expander |
| tcs3472x | I²C | 18 color sensor |
| tdm_audio | TDM | 01 audio |
| tm1637 / tm1638 | I²C-like | misc display |
| tmp102 | I²C | 18 temperature |
| usb_packet/request | USB | 01 USB transfers |
| x2444m | Microwire | 01 |
| xfp | I²C | 09 transceiver mgmt |

---

## How to use this catalog

1. Identify the **base protocol** on the wire with your logic analyzer.
2. Match the **upper-layer decoder** based on the chip you're talking to.
3. Cross-reference into the matching codex layer for protocol details and standards bodies:
   - L1 / wire-level → [01_Circuit_Board/protocols](INDEX.md)
   - L2 framing → [10_Network_DataLink](../../Network/10_Network_DataLink/protocols/INDEX.md)
   - L3 IP and friends → [11_Network_Internet](../../Network/11_Network_Internet/protocols/INDEX.md)
   - Industrial / automotive → [19_Industrial_Protocols](../../19_Industrial_Protocols/protocols/INDEX.md)
   - RF / wireless → [16_RF_Wireless](../../16_RF_Wireless/protocols/INDEX.md)
   - Embedded debug → [03_Firmware_BIOS](../../03_Firmware_BIOS/protocols/INDEX.md) + [00d_Digital_Circuits](../../00d_Digital_Circuits/protocols/INDEX.md)

## Notes
- Chip-specific decoders (ADXL345, BMP280, MPU6050, SSD1306, etc.) have specs in the part datasheet, not in a standards body.
- The list is **not exhaustive**. sigrok / DSLogic / Saleae add new decoders continuously. To get the current list on your tool:
  - `sigrok-cli --list-protocol-decoders`
  - PulseView GUI → *Decoders* menu
  - Saleae Logic 2 → *Analyzers* dropdown

## Source image
- `_assets/dslogic_decoder_list.png` (drop the screenshot here)
