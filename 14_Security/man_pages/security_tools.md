---
title: "Security Tools Reference"
layer: 14_Security
section: man_pages
tags: [nmap, nikto, gobuster, hashcat, john, aircrack-ng, security, pentest, man-section-1]
updated: 2026-05-21
---

# Security Tools Reference

> Practical reference for reconnaissance, web testing, password cracking,
> and wireless auditing tools.

---

## nmap --- network mapper (security perspective)

### Synopsis

```
nmap [scan-type] [-sV] [-sC] [-O] [-A] [-p ports] [-T timing] target
```

### Description

Beyond basic port scanning, nmap is a security assessment platform with
version detection, OS fingerprinting, and 600+ NSE (Nmap Scripting Engine)
scripts for vulnerability detection, brute force, and service enumeration.

### NSE script categories

| Category | Purpose | Example |
|----------|---------|---------|
| `auth` | Auth bypass / brute force | `ssh-brute`, `ftp-anon` |
| `default` | Safe, useful scripts | `http-title`, `ssl-cert` |
| `discovery` | Service enumeration | `dns-brute`, `smb-enum-shares` |
| `exploit` | Active exploitation | `http-shellshock` |
| `vuln` | Vulnerability detection | `smb-vuln-ms17-010`, `ssl-heartbleed` |
| `safe` | Non-intrusive | `whois-ip`, `http-headers` |

### Scan methodology

```
  1. Host discovery
     nmap -sn 192.168.1.0/24
     └── Which hosts are alive?

  2. Port scan
     nmap -sS -p- -T4 target
     └── Which ports are open?

  3. Service + version detection
     nmap -sV -sC -p 22,80,443 target
     └── What services? What versions?

  4. OS detection
     nmap -O target
     └── What operating system?

  5. Vulnerability scanning
     nmap --script vuln target
     └── Known vulnerabilities?

  6. Deep enumeration
     nmap --script "http-*" -p 80 target
     └── Application-level details
```

### Examples

```bash
# Discovery + version + default scripts
nmap -sS -sV -sC -T4 -p- target.com -oA fullscan

# Vulnerability scan
nmap --script vuln target.com

# SMB enumeration
nmap --script "smb-enum-*" -p 445 target.com

# HTTP enumeration
nmap --script "http-enum,http-headers,http-methods" -p 80,443 target.com

# Aggressive scan with OS detection
sudo nmap -A -T4 target.com
```

---

## nikto --- web server scanner

### Synopsis

```
nikto -h host [-port port] [-ssl] [-output file] [-Tuning flags]
```

### Description

Comprehensive web server scanner that checks for dangerous files/CGIs,
outdated server software, version-specific vulnerabilities, and
misconfigurations. Not stealthy but thorough.

### Tuning flags

| Flag | Category |
|------|----------|
| `1` | Interesting file / seen in logs |
| `2` | Misconfiguration |
| `3` | Information disclosure |
| `4` | Injection (XSS/Script/HTML) |
| `5` | Remote file retrieval (web root) |
| `6` | Denial of service |
| `7` | Remote file retrieval (server-wide) |
| `8` | Command execution |
| `9` | SQL injection |
| `0` | File upload |

### Examples

```bash
# Basic scan
nikto -h https://target.com

# Specific tuning (misconfig + info disclosure)
nikto -h target.com -Tuning 23

# Output to HTML report
nikto -h target.com -output report.html -Format html

# Through a proxy
nikto -h target.com -useproxy http://127.0.0.1:8080
```

---

## gobuster / ffuf --- content discovery

### Synopsis

```
gobuster dir -u URL -w wordlist [-t threads] [-o output]
gobuster dns -d domain -w wordlist
ffuf -u URL/FUZZ -w wordlist [-mc codes] [-fc codes]
```

### Description

Brute-force content discovery tools. `gobuster` and `ffuf` enumerate hidden
directories, files, virtual hosts, and subdomains by fuzzing URL paths,
headers, or parameters with wordlists.

### Comparison

```
  gobuster               ffuf
  ────────               ────
  Go, fast               Go, fast
  dir/dns/vhost/s3/fuzz  Generic fuzzer (any position)
  Simple flags           More flexible (FUZZ keyword)
  Less output control    Matchers + filters + recursion
```

### Examples

```bash
# Directory brute-force
gobuster dir -u https://target.com -w /usr/share/wordlists/dirb/common.txt \
  -t 50 -o dirs.txt

# Subdomain enumeration
gobuster dns -d target.com -w subdomains-top1m.txt -t 50

# ffuf with status code filter
ffuf -u https://target.com/FUZZ -w wordlist.txt -mc 200,301 -fc 404

# ffuf POST parameter fuzzing
ffuf -u https://target.com/login -X POST \
  -d "user=admin&pass=FUZZ" -w passwords.txt -fc 401

# ffuf virtual host discovery
ffuf -u https://target.com -H "Host: FUZZ.target.com" -w vhosts.txt -fc 301
```

---

## hashcat --- GPU password cracker

### Synopsis

```
hashcat -m hash_type -a attack_mode [options] hashfile [dict|mask]
```

### Description

World's fastest password recovery tool. Uses GPU acceleration to crack hashes
with dictionary, brute-force, combinator, and rule-based attacks. Supports
350+ hash types.

### Attack modes

| Mode | Flag | Description |
|------|------|-------------|
| Dictionary | `-a 0` | Try each word in wordlist |
| Combinator | `-a 1` | word1+word2 from two lists |
| Brute-force (mask) | `-a 3` | Positional character sets |
| Hybrid dict+mask | `-a 6` | word+mask / `-a 7` mask+word |
| Rule-based | `-a 0 -r rules` | Transform dictionary words |

### Mask charset placeholders

```
  ?l  lowercase (a-z)      ?u  uppercase (A-Z)
  ?d  digit (0-9)          ?s  special (!@#$...)
  ?a  all printable         ?b  all bytes (0x00-0xff)
  
  Example masks:
    ?u?l?l?l?l?d?d?d?d    →  "Hello1234"
    ?d?d?d?d?d?d           →  6-digit PIN
    Company?d?d?d?d?s      →  "Company1234!"
```

### Common hash modes

| Mode | Hash type |
|------|-----------|
| `0` | MD5 |
| `100` | SHA1 |
| `1000` | NTLM |
| `1800` | sha512crypt ($6$) |
| `3200` | bcrypt |
| `13100` | Kerberoasting (TGS-REP) |
| `22000` | WPA-PBKDF2-PMKID+EAPOL |
| `18200` | AS-REP roasting |

### Examples

```bash
# Dictionary attack on NTLM hashes
hashcat -m 1000 -a 0 ntlm_hashes.txt rockyou.txt

# With rules
hashcat -m 1000 -a 0 hashes.txt rockyou.txt -r rules/best64.rule

# Brute-force 8-char alphanumeric
hashcat -m 0 -a 3 hashes.txt '?a?a?a?a?a?a?a?a'

# WPA cracking
hashcat -m 22000 -a 0 handshake.hc22000 rockyou.txt

# Show cracked results
hashcat -m 1000 hashes.txt --show

# Benchmark
hashcat -b
```

---

## john --- John the Ripper

### Synopsis

```
john [options] [password-files]
john --wordlist=dict --rules hashfile
john --show hashfile
```

### Description

Versatile password cracker supporting CPU and GPU. Auto-detects hash formats.
Includes format-specific extractors (`*2john` scripts) for turning files into
crackable hashes.

### Hash extractors

| Script | Source |
|--------|--------|
| `zip2john` | ZIP archives |
| `rar2john` | RAR archives |
| `pdf2john` | PDF files |
| `ssh2john` | SSH private keys |
| `keepass2john` | KeePass databases |
| `office2john` | MS Office documents |
| `bitlocker2john` | BitLocker volumes |

### Examples

```bash
# Auto-detect and crack
john hashes.txt

# Wordlist with rules
john --wordlist=rockyou.txt --rules hashes.txt

# Extract hash from SSH key
ssh2john id_rsa > ssh_hash.txt
john ssh_hash.txt

# Show cracked passwords
john --show hashes.txt

# Specific format
john --format=raw-sha256 hashes.txt
```

---

## aircrack-ng --- wireless security audit suite

### Synopsis

```
airmon-ng [start|stop] interface [channel]
airodump-ng [options] interface
aireplay-ng [attack] -a BSSID interface
aircrack-ng [options] capture.cap
```

### Description

Suite of tools for Wi-Fi network assessment: monitor mode, packet capture,
deauthentication, and WPA/WPA2 key recovery. Requires a compatible wireless
adapter with monitor mode support.

### Tool chain

```
  1. airmon-ng start wlan0          Set monitor mode
       └── creates wlan0mon
  
  2. airodump-ng wlan0mon           Scan networks
       └── shows BSSIDs, channels, clients, encryption
       └── airodump-ng -c 6 --bssid XX:XX -w capture wlan0mon
           (targeted capture)
  
  3. aireplay-ng -0 5 -a BSSID wlan0mon    Deauth (force handshake)
       └── sends 5 deauth frames
       └── client reconnects → 4-way handshake captured
  
  4. aircrack-ng -w wordlist.txt capture-01.cap
       └── dictionary attack against captured handshake
       └── or: convert to hashcat format for GPU cracking
           → hcxpcapngtool -o hash.hc22000 capture-01.cap
           → hashcat -m 22000 hash.hc22000 rockyou.txt
```

### Examples

```bash
# Enable monitor mode
sudo airmon-ng start wlan0

# Scan all networks
sudo airodump-ng wlan0mon

# Target a specific network
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon

# Deauth attack (in another terminal)
sudo aireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF wlan0mon

# Crack with wordlist
aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap

# Stop monitor mode
sudo airmon-ng stop wlan0mon
```

---

## Cross-links

- Network scanning -> [../../Network/11_Network_Internet/man_pages/ip_commands.md](../../Network/11_Network_Internet/man_pages/ip_commands.md)
- Transport tools -> [../../Network/12_Network_Transport/man_pages/transport_tools.md](../../Network/12_Network_Transport/man_pages/transport_tools.md)
- Wi-Fi / RF -> [../../16_RF_Wireless/man_pages/rf_tools.md](../../16_RF_Wireless/man_pages/rf_tools.md)
- TLS protocol -> [../../Network/13_Network_Application/protocols/INDEX.md](../../Network/13_Network_Application/protocols/INDEX.md)
