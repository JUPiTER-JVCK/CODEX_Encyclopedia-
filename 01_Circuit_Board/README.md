# 01 — Circuit Board

> The physical substrate. Copper, silicon, solder, and signals — everything
> above this layer ultimately rides on electrons moving across these traces.

## At a glance

| Field | Value |
|-------|-------|
| Description | Physical hardware connecting CPU, RAM, I/O |
| Languages | N/A (Hardware Description Languages: Verilog, VHDL, SystemVerilog) |
| Medium / Interface | Electrical signals, parallel & serial buses |
| Example | CPU fetches data from RAM via the memory bus |
| Adjacent layers | ↑ [02_CPU](../02_CPU/), [09_Network_Physical](../Network/09_Network_Physical/) (NIC PHY) |

## What lives here

- Motherboard, daughterboards, riser cards, backplanes
- Chipsets (PCH, Southbridge equivalents)
- Buses: PCIe, DDR, SPI, I²C, USB, SATA, NVMe (M.2), JTAG, UART
- Power delivery (VRMs), clock distribution, signal integrity, EMI/EMC
- Single Board Computers (Raspberry Pi, BeagleBone, Jetson)

## Sub-sections

- [references/](references/INDEX.md) — books, datasheets, vendor docs
- [lessons/](lessons/INDEX.md) — electronics, PCB design, FPGA labs
- [languages/](languages/INDEX.md) — HDLs and EDA tools
- [man_pages/](man_pages/INDEX.md) — `lspci`, `lshw`, `dmidecode`, `lsusb`
- [topics/](topics/INDEX.md) — buses, chipsets, RAM, NIC PHYs
- [protocols/](protocols/INDEX.md) — PCIe, USB, SPI, I²C, JTAG, DDR

## Cross-references

- Voltage / ISA-level concerns → [02_CPU](../02_CPU/)
- Driver enumeration of devices → [04_Device_Drivers](../04_Device_Drivers/)
- RF and antenna front-ends → [16_RF_Wireless](../16_RF_Wireless/)
- Hardware attacks (fault injection, side channels) → [14_Security/topics](../14_Security/topics/)
