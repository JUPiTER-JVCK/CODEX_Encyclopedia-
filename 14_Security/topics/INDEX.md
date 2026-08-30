# Security — Topics (organized by source layer)

## Layer 01 — Circuit Board / hardware
- **Glitching / fault injection** — voltage, clock, EM, laser
- **Side channels** — power (SPA/DPA), EM, timing, acoustic
- **JTAG/SWD debug abuse**, chip-off, NAND mirroring
- **Implants / supply-chain hardware**, **counterfeit components**
- **Rowhammer** (DRAM-level bit flips)

## Layer 02 — CPU
- **Speculative execution** — Spectre v1/v2/v4, Meltdown, MDS (RIDL/Fallout/ZombieLoad), L1TF, Retbleed, Downfall, Inception
- **TLB / cache side channels** — Flush+Reload, Prime+Probe
- **SGX/SEV/TDX attacks** — Foreshadow, SQUIP, etc.
- **Pointer auth / CET / shadow stacks** — defenses

## Layer 03 — Firmware / BIOS
- **Bootkits** — LoJax, MosaicRegressor, BlackLotus
- **Evil maid attacks** — pre-boot tampering
- **BMC vulnerabilities** — IPMI cleartext creds, Redfish bugs
- **UEFI implant frameworks** — LoJax-class
- **SMM attacks**, **Boot Guard / Verified Boot bypass**

## Layer 04 — Device Drivers
- **BYOVD** (Bring Your Own Vulnerable Driver)
- **Driver signing bypass** — leaked certs
- **MSI/MMIO escalation primitives**

## Layer 05 — OS Kernel
- **LPE classes** — UAF, type confusion, integer overflows in syscalls
- **Container escapes** — runc CVEs, capability misuse, /proc/self/exe tricks
- **eBPF abuse** — verifier bugs, rootkits, evasion
- **Rootkits** — LKM, kprobes, ftrace, eBPF-based
- **LSM bypass** — SELinux/AppArmor escapes
- **Kernel info leaks** — KASLR break primitives

## Layer 06 — System Libraries
- **Memory corruption** — heap (UAF, double-free, heap spray), stack overflow, integer overflow
- **Format string bugs**, **printf** primitives
- **Exploit mitigations** — ASLR, NX/DEP, SafeSEH, CFG, CET, Stack Canaries, FORTIFY_SOURCE
- **LD_PRELOAD / DLL hijacking / dyld injection**
- **Crypto library misuse** — IV reuse, weak randomness, padding oracles

## Layer 07 — Runtime Environment
- **JVM / .NET deserialization** — gadget chains
- **Python pickle / yaml.load / eval injection**
- **Node prototype pollution**, **vm escape**
- **Container escapes (already listed)**, **Wasm sandbox bypass**
- **CI/CD compromise** — GitHub Actions injection, runner poisoning
- **Supply chain** — typosquatting, dependency confusion, malicious packages

## Layer 08 — User Applications
- **App sandbox escapes** — App Sandbox, AppContainer, Android scoped storage
- **URL scheme abuse, deep-link hijacking**
- **Browser exploitation** — type confusion in JS engines, sandbox + GPU compromise
- **Code-signing bypass** — Authenticode, notarization, Mach-O LC_CODE_SIGNATURE
- **Mobile** — IPC abuse, intent redirection, deep links, accessibility abuse

## Layer 09 — Network Physical
- **Cable taps**, **fiber tap optical bend couplers**
- **Wireless eavesdropping & jamming** (cross-link [16](../../16_RF_Wireless/))

## Layer 10 — Data Link
- **ARP spoofing / poisoning** → MitM
- **MAC flooding** (CAM table exhaustion)
- **VLAN hopping** — double tagging, switch spoofing
- **DHCP starvation + rogue DHCP**, **DHCPv6 RA flood**
- **STP attacks** — root bridge takeover
- **802.1X bypass** — MAB tricks, hub-style
- **Wi-Fi** — deauth, KRACK, PMKID, evil twin (see [16](../../16_RF_Wireless/))

## Layer 11 — Internet
- **BGP hijacks / route leaks** — RPKI/ROA as mitigation
- **DDoS** — SYN flood, UDP amplification (DNS/NTP/Memcached), reflection
- **IPsec / VPN flaws** — IKE downgrade, weak DH groups
- **Tunneling abuse** — DNS tunneling, ICMP exfil, IPv6 over IPv4 to bypass policy

## Layer 12 — Transport
- **TCP RST injection, sequence prediction** (mostly historical)
- **SYN flood**, **slowloris/slowread** (app-layer DoS)
- **Off-path attacks** — side-channel TCP injection (RFC 5961 mitigation)
- **QUIC** — early TLS bugs in implementations

## Layer 13 — Application
- **Web** — OWASP Top 10: injection, broken authn, XSS, CSRF, SSRF, IDOR, deserialization, RCE
- **HTTP smuggling / desync**, **request splitting**
- **JWT pitfalls** — alg=none, key confusion, weak HS256 secret
- **OAuth flaws** — open redirect, mix-up, CSRF on flows, PKCE skip
- **TLS attacks** — POODLE, BEAST, FREAK, LOGJAM, ROBOT, downgrade
- **DNS attacks** — cache poisoning (Kaminsky), spoofing, NXNS, sub-domain takeover
- **Email** — phishing, BEC, spoof via missing SPF/DKIM/DMARC; spoofable display names
- **SSH** — weak keys, port forwarding abuse, leaked authorized_keys
- **SMB / RDP** — relay (NTLM relay), BlueKeep-class
- **AD** — Kerberoasting, AS-REP roasting, DCSync, Golden/Silver/Diamond/Sapphire tickets, ADCS ESCs

## Cross-cutting topics
- **Threat modeling** — STRIDE, PASTA, LINDDUN (privacy)
- **Zero Trust** — NIST 800-207, BeyondCorp
- **Detection engineering** — Pyramid of Pain, ATT&CK mapping, Sigma → SIEM
- **Incident response** — PICERL, MITRE D3FEND, tabletop exercises
- **Threat intelligence** — IOCs vs TTPs, STIX/TAXII

## Identity / IAM
- **MFA fatigue**, **adversary-in-the-middle (AiTM)** phishing kits
- **Passkey / FIDO2 phishing-resistance**
- **OAuth/OIDC misconfig**, **token theft via XSS, cookie scoping**

## Cloud-specific
- **IAM privilege escalation paths** (AWS PMapper, AzureHound)
- **Public S3 buckets / open storage**, **SSRF → IMDS** (v1 vs IMDSv2)
- **Lambda / Functions abuse**, **CI/CD trust boundary**
- **K8s RBAC misuse**, **service-account token theft**, **CRD injection**

## Cryptography (deeper)
- **Primitives** — AES, ChaCha20, SHA-2/3, HMAC, HKDF; AEAD modes
- **Asymmetric** — RSA (OAEP/PSS), ECC (P-256/Curve25519), Ed25519, X25519
- **Key exchange** — ECDH(E), TLS 1.3 handshake
- **Post-quantum** — ML-KEM (Kyber), ML-DSA (Dilithium), SLH-DSA (SPHINCS+)
- **Pitfalls** — IV reuse, padding oracles (CBC/MAC-then-encrypt), key reuse across modes

## Privacy
- **Anonymization & re-identification**
- **Differential privacy** (cross-link [15_AI_ML](../../15_AI_ML/))
- **Tor**, **mixnets**, **VPNs vs proxies vs onion routing**
- **Tracking** — cookies, fingerprinting, supercookies, ETag tracking

## GRC
- **NIST 800-53** control families
- **ISO 27001** clauses & Annex A
- **PCI DSS v4**, **SOC 2** Trust Services Criteria
- **GDPR / CCPA / HIPAA** — privacy regs basics
- **DPIA**, **PIA**, **DPA**
