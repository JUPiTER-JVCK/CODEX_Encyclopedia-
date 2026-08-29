# Security — Manual Pages / Tools

## Dedicated man page references

| Topic | File |
|-------|------|
| Security tools | [security_tools.md](security_tools.md) — nmap, nikto, gobuster, hashcat, john, aircrack-ng |

---

## Recon & enumeration
| Tool | Purpose |
|------|---------|
| `nmap` | Port + service + OS + script scans (NSE) |
| `masscan` | High-rate port scanner |
| `rustscan` | Fast wrapper around nmap |
| `naabu` | Go port scanner (ProjectDiscovery) |
| `subfinder`, `amass`, `assetfinder` | Subdomain enumeration |
| `dnsx`, `dnsrecon`, `puredns` | DNS recon |
| `httpx`, `httprobe`, `katana` | HTTP probing/crawling |
| `nuclei` | Templated vulnerability scanner |
| `theHarvester` | OSINT email/host gathering |
| `recon-ng` | OSINT framework |
| `shodan`, `censys` | Internet-wide search engines |
| `whois`, `dig`, `traceroute` | Classics |

## Web testing
| Tool | Purpose |
|------|---------|
| `burpsuite` (Community/Pro) | Intercepting proxy + scanner |
| `mitmproxy` / `mitmweb` | Scriptable proxy |
| `ffuf`, `wfuzz`, `feroxbuster`, `gobuster` | Content discovery / fuzzing |
| `sqlmap` | Automated SQLi |
| `wpscan`, `joomscan` | CMS-specific scanners |
| `nikto` | Legacy but useful |

## Exploitation / post-ex
| Tool | Purpose |
|------|---------|
| `msfconsole` (Metasploit) | Exploit + payload framework |
| `responder` | LLMNR/NBT-NS/MDNS poisoning |
| `impacket-*` | Windows network protocol toolkit |
| `crackmapexec` / `nxc` (NetExec) | SMB/AD swiss army knife |
| `bloodhound-python`, `SharpHound` | AD graph collection |
| `mimikatz` | Windows credential extraction (legacy but ubiquitous) |
| `chisel`, `ligolo-ng` | Pivoting / tunneling |
| `evil-winrm` | Windows remote shell |

## Network L2/L3 (cross-link to [10–11])
- `bettercap`, `ettercap`, `arpspoof`, `tcpdump`, `wireshark`, `tshark`

## Wi-Fi (cross-link to [16](../../16_RF_Wireless/))
- `aircrack-ng` suite, `kismet`, `hcxdumptool`, `wifite`

## Password cracking
| Tool | Purpose |
|------|---------|
| `hashcat` | GPU-accelerated cracking |
| `john` (JtR) | CPU/GPU cracker |
| `hydra`, `medusa`, `patator` | Online brute force |

## Forensics / IR
| Tool | Purpose |
|------|---------|
| `vol3` (Volatility 3) | Memory forensics |
| `autopsy`, `tsk` (Sleuth Kit) | Disk forensics |
| `plaso` / `log2timeline` | Timelining |
| `velociraptor` | Endpoint hunt + collection |
| `chainsaw`, `hayabusa` | Windows event log triage |
| `kape` | Triage collection (Windows) |
| `volatility` plugins, `rekall` (archival) |

## Malware analysis / RE
| Tool | Purpose |
|------|---------|
| `ghidra`, `cutter` (rizin), `radare2`, `r2`, `binaryninja`, `ida` |
| `pestudio`, `die` (Detect It Easy) | PE triage |
| `floss` | Obfuscated string extraction |
| `cape-sandbox`, `cuckoo`, `triage` | Dynamic sandboxes |
| `frida`, `objection` | Dynamic instrumentation |
| `yara`, `yarac` | Pattern matching |

## Cloud
| Tool | Purpose |
|------|---------|
| `prowler`, `scoutsuite`, `cloudsploit` | CSPM auditing |
| `pacu` | AWS exploitation framework |
| `azurehound`, `roadtools` | Azure AD recon |
| `gcphound`, `g-scout` | GCP recon |
| `kubectl`, `kube-bench`, `kube-hunter`, `peirates` | K8s |

## Container / runtime
| Tool | Purpose |
|------|---------|
| `trivy`, `grype`, `snyk` | Image vuln scanning |
| `dive` | Layer inspection |
| `falco` | Runtime detection |
| `tetragon` | eBPF-based runtime security |

## Crypto / TLS
| Tool | Purpose |
|------|---------|
| `openssl` | Swiss army knife |
| `testssl.sh` | Server TLS audit |
| `sslyze` | Same, Python |
| `nmap --script ssl-*` | NSE TLS probes |
| `hashid` / `hash-identifier` | Hash type guessing |
