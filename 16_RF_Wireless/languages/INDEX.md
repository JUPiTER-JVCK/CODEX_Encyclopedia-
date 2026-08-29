# RF / Wireless — Languages

The "language" of RF is **signal processing**. Software tooling clusters around
a few ecosystems.

## SDR / DSP frameworks
| Tool | Languages | Notes |
|------|-----------|-------|
| GNU Radio | C++ core, Python bindings, GRC visual flowgraphs | Open-source workhorse |
| MATLAB / Simulink + Communications Toolbox | MATLAB | Industry/academia |
| Pothos / SoapySDR | C++/Python | Cross-SDR abstraction |
| LiquidSDR | C | Lightweight DSP library |
| Volk | C/C++ | Vector-optimized kernels (used by GNU Radio) |
| PySDR | Python (numpy/scipy) | Educational |
| LuaRadio | Lua | Lightweight alt to GNU Radio |
| Redhawk | C++/Python | DoD-flavored SDR framework |
| SDRangel / SDR++ / Cubic SDR | C++ | GUI SDR receivers |

## Cellular stacks
| Stack | Languages |
|-------|-----------|
| srsRAN / srsLTE / srsUE | C++ |
| Open5GS | C |
| OpenAirInterface (OAI) | C/C++ |
| YateBTS | C++ |
| Osmocom suite (OsmoBTS, OsmoBSC, OsmoCN, etc.) | C |

## Wi-Fi tooling
| Tool | Languages |
|------|-----------|
| hostapd / wpa_supplicant | C |
| aircrack-ng | C |
| kismet | C++ |
| nexmon (firmware patches) | C / assembly |
| OpenWrt / OpenWRT-friendly drivers | C |

## Bluetooth / BLE
- BlueZ (Linux) — C
- bleak (Python), noble (Node.js), CoreBluetooth (Swift/Obj-C), Android BLE (Kotlin)
- nRF Connect SDK — C / Zephyr RTOS

## LoRa / LPWAN
- LMIC / RadioLib / arduino-LoRa — C++ on microcontrollers
- ChirpStack — Go (LoRaWAN Network Server)

## HDL for SDR FPGAs
- USRP / LimeSDR / Pluto FPGAs — Verilog/VHDL/Chisel
- gr-iio / libiio — Python/C glue to FPGA-side flows

## Math / sim
- NumPy/SciPy, Octave — quick DSP prototyping
- Sionna (TF) — link-level 5G/6G physical-layer simulation
- Komm (Python) — communications-systems library
- MATLAB Communications + Antenna toolboxes
