---
title: "Security — Interactive Labs"
layer: 14_Security
section: lessons
tags: [lesson, security, nmap, hashcat, seccomp, burp, lab, quiz, hands-on]
updated: 2026-05-21
---

# Security — Interactive Labs

---

## Module 1: Network Reconnaissance with nmap

### Objective

Perform host discovery, port scanning, and service version detection,
interpreting scan results to map an attack surface.

### Prerequisites

- Linux host with nmap installed
- A target lab VM or localhost (always scan only systems you own/are
  authorized to test)

### Lab Steps

1. Host discovery — find live hosts on a subnet:
```bash
nmap -sn 192.168.1.0/24
# -sn = ping scan (no port scan)
# Lists responding hosts with MAC addresses
```

2. Fast port scan — top 1000 ports:
```bash
nmap -T4 -F 192.168.1.10
# -T4 = aggressive timing (faster, more detectable)
# -F  = fast mode (top 100 ports only — even faster)
```

3. Full scan with service + version detection:
```bash
nmap -sV -sC -p- -oA scan_results 192.168.1.10
# -sV  = version detection
# -sC  = default scripts
# -p-  = all 65535 ports
# -oA  = output in all formats (XML, grepable, normal)
```

4. OS fingerprinting (requires root):
```bash
sudo nmap -O 192.168.1.10
# Compares TCP/IP stack behaviour to OS fingerprint database
```

5. Parse results:
```bash
grep "open" scan_results.gnmap
cat scan_results.xml | python3 -c "
import sys, xml.etree.ElementTree as ET
tree = ET.parse(sys.stdin)
for host in tree.findall('host'):
    addr = host.find('address').get('addr')
    for port in host.findall('ports/port'):
        state = port.find('state').get('state')
        if state == 'open':
            portid = port.get('portid')
            service = port.find('service')
            name = service.get('name') if service is not None else '?'
            print(f'{addr}:{portid} ({name})')
"
```

```
  Scan type selection:
  ┌─────────────┬───────────────────────────────────────────┐
  │ -sS (SYN)   │ Default, fast, stealth — sends SYN only   │
  │ -sT (TCP)   │ Full connect — slower, no root needed     │
  │ -sU (UDP)   │ UDP scan — slow, unreliable responses     │
  │ -sA (ACK)   │ Firewall mapping — tests filter rules     │
  └─────────────┴───────────────────────────────────────────┘
```

### Knowledge Check

**Q1**: What is the difference between a SYN scan and a TCP connect scan?

> **A1**: SYN scan (`-sS`) sends a SYN, waits for SYN-ACK, then sends RST
> rather than completing the handshake — it never creates a full connection,
> making it stealthier and faster. TCP connect (`-sT`) completes the 3-way
> handshake; it's visible in application logs but doesn't require raw socket
> privileges.

**Q2**: Why does nmap mark ports as "filtered"?

> **A2**: "Filtered" means nmap received no response and no ICMP error.
> This usually indicates a firewall is silently dropping the packets.
> "Closed" means the host responded with TCP RST (port exists but no
> service). "Open" means SYN-ACK was received.

---

## Module 2: Password Cracking with hashcat

### Objective

Extract and crack password hashes using dictionary and rule-based
attacks, understanding hash algorithm strength.

### Lab Steps

1. Generate test hashes:
```bash
echo -n "password123" | md5sum        # MD5
echo -n "password123" | sha256sum     # SHA-256
python3 -c "import hashlib; print(hashlib.sha256(b'password123').hexdigest())"

# bcrypt (as would appear in /etc/shadow):
python3 -c "import bcrypt; print(bcrypt.hashpw(b'password123', bcrypt.gensalt()).decode())"
```

2. Create a wordlist:
```bash
# Use rockyou.txt (common wordlist)
ls /usr/share/wordlists/rockyou.txt
# Or generate a small test list:
echo -e "password\npassword123\n123456\nletmein\nqwerty" > test_wordlist.txt
```

3. Crack MD5 hash (dictionary attack):
```bash
echo "482c811da5d5b4bc6d497ffa98491e38" > hash.txt
hashcat -m 0 hash.txt /usr/share/wordlists/rockyou.txt
# -m 0 = MD5 hash mode
```

4. Crack with rules (mangling):
```bash
hashcat -m 0 hash.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule
# Rules apply transformations: append numbers, capitalize, l33tspeak
```

5. Mask attack (brute force with pattern):
```bash
# Crack 8-char password: 4 letters + 4 digits
hashcat -m 0 hash.txt -a 3 ?l?l?l?l?d?d?d?d
# ?l = lowercase, ?u = uppercase, ?d = digit, ?s = special
```

```
  Hash algorithm strength (time to crack "password123"):
  ┌──────────────┬────────────┬──────────────────────────────┐
  │ Algorithm    │ Time       │ Notes                        │
  ├──────────────┼────────────┼──────────────────────────────┤
  │ MD5          │ < 1 sec    │ Never use for passwords      │
  │ SHA-256      │ < 1 sec    │ Fast hash — not for passwords│
  │ bcrypt(10)   │ ~hours     │ Work factor tunable          │
  │ bcrypt(12)   │ ~days      │ Recommended minimum          │
  │ Argon2id     │ ~weeks     │ Memory-hard, best choice     │
  └──────────────┴────────────┴──────────────────────────────┘
  (RTX 4090 single GPU, dictionary attack)
```

### Knowledge Check

**Q1**: What is a rainbow table and why does salting defeat it?

> **A1**: A rainbow table is a precomputed mapping of hash → plaintext.
> Salting adds a unique random value to each password before hashing, so
> the same password produces different hashes. The attacker must crack each
> hash independently — precomputed tables are useless.

**Q2**: Why is MD5 unsuitable for password storage even with salting?

> **A2**: MD5 is a fast hash designed for integrity checking, not password
> hashing. Modern GPUs can compute billions of MD5 hashes per second.
> Even with salting, an attacker can exhaust wordlists rapidly. Purpose-built
> password hashing functions (bcrypt, scrypt, Argon2) are intentionally slow
> and memory-hard, making GPU attacks impractical.

---

## Module 3: seccomp Sandbox

### Objective

Apply a seccomp filter to restrict a process's available syscalls,
reducing attack surface for privilege escalation.

### Lab Steps

1. Install dependencies:
```bash
sudo apt install libseccomp-dev gcc
```

2. Write a minimal seccomp filter in C:
```c
// seccomp_demo.c
#include <stdio.h>
#include <seccomp.h>
#include <unistd.h>

int main() {
    // Initialize whitelist (deny all by default)
    scmp_filter_ctx ctx = seccomp_init(SCMP_ACT_KILL);

    // Allow only essential syscalls
    seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(read), 0);
    seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(write), 0);
    seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(exit), 0);
    seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(exit_group), 0);
    seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(brk), 0);
    seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(mmap), 0);

    // Load the filter
    seccomp_load(ctx);
    seccomp_release(ctx);

    printf("seccomp active — only allowed syscalls work\n");

    // This will be killed by the filter:
    // execve("/bin/sh", NULL, NULL);

    return 0;
}
```

3. Compile and test:
```bash
gcc -o seccomp_demo seccomp_demo.c -lseccomp
./seccomp_demo
# Succeeds — printf only uses read/write internally

# Strace to verify:
strace -e trace=seccomp ./seccomp_demo
```

4. Audit syscalls a program uses:
```bash
# Find which syscalls a program needs:
strace -c ls /tmp 2>&1 | grep -v "^%" | tail -20
# Build a minimal allowlist from actual usage
```

5. Docker seccomp profile:
```bash
# Docker's default profile blocks ~44 dangerous syscalls
# Run with custom profile:
docker run --security-opt seccomp=./my_profile.json ubuntu ls /

# Run without seccomp (dangerous):
docker run --security-opt seccomp=unconfined ubuntu ls /
```

### Review Flashcards

| Term | Definition |
|------|-----------|
| CVE | Common Vulnerabilities and Exposures — unique vuln identifier |
| CVSS | Common Vulnerability Scoring System — severity 0–10 |
| nmap | Network mapper — host/port/service/OS discovery |
| seccomp | Linux kernel mechanism to restrict syscalls per-process |
| bcrypt | Password hashing function with tunable work factor |
| Argon2 | Memory-hard password KDF — winner of Password Hashing Competition |
| Salt | Random per-password value prepended before hashing |
| Rainbow table | Precomputed hash→plaintext lookup (defeated by salting) |
| Burp Suite | Intercepting HTTP proxy for web app security testing |
| OWASP Top 10 | Ten most critical web application security risks |

### Challenge

> Set up a VM with a vulnerable web application (DVWA or Juice Shop).
> Run a full nmap scan, enumerate web paths with gobuster, identify
> a SQL injection point, and document the attack chain in a simple
> report. Then apply a WAF rule to block the injection and verify.

---

## Cross-links

- Security tools → [../man_pages/security_tools.md](../man_pages/security_tools.md)
- Network scanning → [../../Network/11_Network_Internet/man_pages/ip_commands.md](../../Network/11_Network_Internet/man_pages/ip_commands.md)
- Container security → [../../07_Runtime_Environment/topics/container_internals.md](../../07_Runtime_Environment/topics/container_internals.md)
