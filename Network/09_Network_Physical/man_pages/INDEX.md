# Network Physical — Manual Pages

| Command | Purpose |
|---------|---------|
| `ethtool eth0` | Link status, speed, duplex, autoneg |
| `ethtool -m eth0` | Read SFP/SFP+ transceiver EEPROM |
| `ethtool -S eth0` | NIC stats (errors, drops, FEC) |
| `ethtool --show-fec eth0` | FEC mode (RS-FEC, Firecode) |
| `ip link show` | List interfaces & operstate |
| `mii-tool` | Older PHY query utility |
| `iwconfig` (legacy) / `iw dev` | Wireless interface settings |
| `iwlist wlan0 scan` | Scan visible SSIDs/channels |
| `iw dev wlan0 station dump` | Connected station details |
| `wpa_supplicant` / `nmcli` | Wireless client mgmt |
| `iperf3` | End-to-end throughput test (also useful at L4/L7) |
| `mtr`, `ping` | Reachability (cross-layer) |
| `tcpdump -i eth0 -w cap.pcap` | Capture from PHY/MAC |
| `vconfig` (legacy) / `ip link add type vlan` | VLAN tagging (L2 boundary) |

## macOS
- `ifconfig`, `networksetup`, `airport` (legacy CLI: `/System/Library/PrivateFrameworks/Apple80211.framework/.../airport`)
- System Information → Network → physical link reports

## Windows
- `Get-NetAdapter`, `Get-NetAdapterAdvancedProperty`, `netsh wlan show interfaces`
