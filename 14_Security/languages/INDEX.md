# Security — Languages

Security work is polyglot — choose by tool / domain.

## Tooling languages (most common)
| Language | Use |
|----------|-----|
| Python | Recon, automation, exploit PoCs, frameworks (impacket, scapy, mitmproxy, sqlmap) |
| Bash | Glue, recon pipelines, `*sh*` enumeration scripts |
| PowerShell | Windows offense (PowerSploit, Empire), defense (logging, hardening) |
| C / C++ | Native exploit dev, shellcode, drivers, low-level tools |
| Rust | Modern offensive tools (Rustcrack-likes), safer fuzzers, agents |
| Go | Implants, recon (subfinder, naabu, nuclei), portable binaries |
| Assembly (x86/ARM) | Shellcode, exploit primitives, reverse engineering |
| JavaScript / TypeScript | Web exploit dev, BeEF, Electron analysis |
| Ruby | Metasploit modules, legacy tools |
| Lua | Nmap NSE scripts |

## Detection / data
| Language | Use |
|----------|-----|
| YARA | Pattern signatures for files & memory |
| Sigma | Vendor-agnostic SIEM detection rules |
| KQL (Kusto) | Microsoft Sentinel / Defender hunting |
| SPL (Splunk) | Splunk searches |
| EQL / EsQL (Elastic) | Elastic detection |
| Suricata / Snort rules | Network IDS |
| Falco rules | Runtime container detection |
| osquery SQL | Endpoint querying |
| OSSEC / Wazuh rules | HIDS |
| Open Policy Agent (Rego) | Policy as code |

## Crypto / formal
| Language | Use |
|----------|-----|
| Sage / Python with sympy | CTF crypto math |
| Z3 (Python/SMT-LIB) | Constraint solving for exploitation/RE |
| Coq / Lean / F* | Verified crypto / OS code |

## Reverse engineering platforms
| Platform | Scripting |
|----------|-----------|
| Ghidra | Java / Python (Jython), PyGhidra |
| IDA Pro | IDC, IDAPython |
| Binary Ninja | Python (BNIL plugins) |
| radare2 / rizin | r2pipe (any language) |
| angr | Python symbolic execution |
| Frida | JS instrumentation glue |
