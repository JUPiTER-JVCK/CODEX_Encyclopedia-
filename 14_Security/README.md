# 14 — Security (Cross-cutting)

> Security is not a layer above the stack — it lives at every layer. This
> folder organizes offensive, defensive, and assurance material with explicit
> pointers back to the layer where the issue originates.

## At a glance

| Field | Value |
|-------|-------|
| Spans | Layers 01 through 13 and 15/16 |
| Description | Securing, breaking, and verifying every other layer |
| Languages | Polyglot — Python, C/C++, Rust, Go, Bash, PowerShell, Assembly |
| Subdomains | OSINT, AppSec, NetSec, EndpointSec, CloudSec, IR/Forensics, Crypto, Privacy, GRC |
| Example | Adversary chains a kernel CVE (L5) with a phishing email (L13) |

## Major subdomains

- **OSINT** — open-source intelligence gathering
- **Reconnaissance & enumeration** — DNS, BGP, ports, services, web fingerprinting
- **Network security** — IDS/IPS, firewalls, VPNs, segmentation
- **Endpoint / host** — EDR, hardening, allowlisting, exploit mitigations
- **AppSec** — SAST, DAST, IAST, SCA; OWASP Top 10; SSDLC
- **Cloud security** — IAM, posture management (CSPM), workload (CWPP), SaaS (SSPM)
- **Identity & access** — IAM, SSO, MFA, zero trust
- **Cryptography** — primitives, protocols, PKI, key management
- **Reverse engineering & malware** — static + dynamic, sandboxing
- **Offensive (red team) / pentest / adversary emulation**
- **Defensive / blue team / SOC / detection engineering**
- **Incident response & forensics** — DFIR, memory & disk forensics
- **Threat intelligence** — TTPs, IOCs, ATT&CK mapping
- **Privacy** — data protection, anonymization, differential privacy
- **GRC** — governance, risk, compliance (frameworks below)

## Sub-sections

- [references/](references/INDEX.md) — books, courses, certifications, frameworks
- [lessons/](lessons/INDEX.md) — CTF tracks, lab environments, study paths
- [languages/](languages/INDEX.md) — typical security tooling languages
- [man_pages/](man_pages/INDEX.md) — `nmap`, `metasploit`, `bettercap`, `volatility`
- [topics/](topics/INDEX.md) — attack & defense per layer, mapped by source layer
- [protocols/](protocols/INDEX.md) — security-specific protocols & specs

## Cross-references
- Hardware attacks → [01_Circuit_Board](../01_Circuit_Board/), [02_CPU](../02_CPU/)
- Firmware / boot security → [03_Firmware_BIOS](../03_Firmware_BIOS/)
- Driver / kernel exploit surface → [04_Device_Drivers](../04_Device_Drivers/), [05_OS_Kernel](../05_OS_Kernel/)
- Memory safety / lib hijack → [06_System_Libraries](../06_System_Libraries/)
- Container escapes, wasm sandbox → [07_Runtime_Environment](../07_Runtime_Environment/)
- App vulns (web, mobile, desktop) → [08_User_Applications](../08_User_Applications/)
- L2–L7 network attacks → [09–13](../Network/10_Network_DataLink/)
- AI/ML threat surface → [15_AI_ML](../15_AI_ML/)
- RF / wireless attacks → [16_RF_Wireless](../16_RF_Wireless/)
