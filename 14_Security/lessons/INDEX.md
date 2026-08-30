
## Dedicated Lesson Modules

| File | Covers |
|------|--------|
| [Security — Interactive Labs](./security_labs.md) | Nmap scanning, hashcat, seccomp sandbox |

# Security — Lessons

## Foundations
1. **Threat modeling** — STRIDE on a real app you know; produce data-flow diagram.
2. **Linux hardening** — CIS benchmark on a fresh VM; document each control.
3. **Windows hardening** — STIG baseline + LAPS + AppLocker/WDAC.
4. **Crypto primitives** — implement AES-GCM, ECDH, Ed25519 from libsodium; *never* roll your own.
5. **PKI lab** — private CA with step-ca; issue server + client certs; mTLS.

## Offensive tracks
6. **Network recon** — `nmap`, `masscan`, `rustscan`; banner grabbing.
7. **Web** — Portswigger Academy free labs end-to-end (top 100).
8. **Active Directory** — BloodHound, Rubeus, certipy in a lab forest.
9. **Linux privesc** — LinPEAS, sudo abuse, capabilities, SUID, GTFOBins.
10. **Windows privesc** — WinPEAS, token theft, UAC bypass categories.
11. **Wi-Fi attacks** — see [16_RF_Wireless/lessons](../../16_RF_Wireless/lessons/INDEX.md).
12. **Cloud attack paths** — AWS PMapper / Pacu, Azure AzureHound, GCP attack maps.
13. **Container escapes** — known patterns: runc CVE replays, capability misuse.

## Defensive tracks
14. **Detection engineering** — write Sigma rules; convert to splunk/elastic; mapped to ATT&CK.
15. **SIEM tour** — Elastic SIEM or Wazuh; ingest Sysmon + auditd; correlate logins.
16. **EDR investigation** — Velociraptor or Wazuh; run hunt for credential dumping artifacts.
17. **Network IDS** — Suricata + ET Open; alert on a deliberate test.
18. **Memory forensics** — Volatility 3 on a vmem snapshot of a compromised VM.
19. **Disk forensics** — Autopsy / Sleuth Kit on a sample DD image.
20. **Incident response runbook** — write your own ransomware IR plan.

## Continuous practice
- **CTFs** — picoCTF (beginner), HTB / THM (intermediate), pwn.college / Nightmare (binary), TryHackMe SOC paths
- **Bug bounty** — start on a single program scope; read past reports first
- **Capture cool malware safely** — MalwareBazaar in an isolated analysis VM

## Suggested external
- SANS reading room
- Red Team Village & Adversary Village (DEF CON)
- Antisyphon training (free + paid)
