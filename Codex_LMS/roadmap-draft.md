# CORE — Structure Draft v5 (Systems merged into Programming, Hardware standalone)

```
$ tree core-encyclopedia --status -L 2 --final

Legend:  ✅ built   🔜 next up   💭 proposed   🔀 moved this round
```

Two structural moves from your last message, applied. Visual Learning Kit
(9 pieces) is unchanged and still applies to every phase below — that part's
fully locked, no need to restate it each round.

---

## The reshuffle, in one line each

- **Systems (C/C++) 🔀** — no longer its own phase. Folded directly into
  Programming, as the third language after Python and JavaScript.
- **Hardware 🔀** — pulled out of Phase 0. Now its own standalone phase,
  right after Logic instead of sitting beside it.

---

## The complete build order

```
CORE — Learning Path/
│
├── PHASE 0 · Logic ..................................... 🆕 standalone now
│   ├── Boolean algebra — AND/OR/NOT/NAND/NOR/XOR/XNOR
│   ├── Truth tables & logic gate symbols
│   ├── Binary & hex number systems
│   ├── Bitwise operations (&, |, ^, ~, <<, >>)
│   ├── Combinational vs. sequential logic (flip-flops)
│   └── Case study: the Year 2038 problem (integer overflow)
│   [🎮 Simulator: build-a-logic-gate · 🗺️ Concept Map: gate → decision]
│
├── PHASE 1 · Hardware ................................... 🔀 now standalone
│   ├── The full-stack diagram — circuit board to application ⭐
│   ├── CPU anatomy — registers, ALU, control unit, FPU
│   ├── Buses — address/data/control
│   ├── Memory hierarchy — registers → cache → RAM → storage
│   ├── Storage evolution — floppy → HDD → SSD
│   ├── Interrupts, DMA & IRQs
│   ├── Case study: softmodems — where hardware ends, software begins
│   └── RF & wireless fundamentals (sub-unit, cross-listed with Networking)
│   [🧭 Process Diagram: fetch-decode-execute · 🧠 Memory Hook: "a CPU
│    without a program is an expensive space heater"]
│
├── PHASE 2 · Command Line & Operating Systems .......... ✅ foundation live
│   ├── Terminal — bash/zsh ✅, PowerShell ✅
│   ├── Filesystem hierarchy — Linux (Debian), macOS, Windows/WSL 🔜
│   ├── vim 🔜  ·  Git & GitHub 🔜  ·  Intermediate bash scripting 🔜
│   ├── Package management — apt/dpkg 🔜
│   └── Shell customization aside 💭
│
├── PHASE 3 · Programming ................................ 🔀 now includes Systems
│   ├── Python ✅ — variables → control flow → functions → data structures
│   ├── JavaScript ✅ — same arc, plus the event loop
│   └── C / C++ 🔀 (moved here) — memory, pointers, structs; "what Python
│       and JavaScript were hiding from you"
│   [🧭 Process Diagram: call stack · 🏗️ Annotated: stack vs. heap ·
│    🧠 Memory Hook: mutable vs. immutable]
│
├── PHASE 4 · Web Fundamentals ........................... ✅ foundation live
│   ├── HTML ✅  ·  CSS 🔜  ·  JS-in-browser 🔜
│   ├── Web standards checklist 🔜  ·  Search literacy aside 💭
│   └── SQL 💭 (elective)
│   → still ends on "how does this request reach a server" — the door
│      into Networking stays right where it was
│
├── PHASE 5 · Networking & Cisco ......................... ✅ foundation live
│   ├── OSI/Topologies/Routing/HTTP/Ports/Subnetting ✅
│   ├── Internet & IP fundamentals 🔜  ·  CCNA 1/2/3 🔜
│   ├── RF & wireless sub-unit 💭 (shared with Hardware)
│   └── Historical footnote 💭 — Novell bindery, links to your Ethload guide
│
└── PHASE 6 · Security & Ethical Hacking ................. 💭 pentest-framed
    ├── Foundations — CIA triad, hat colors, legal boundaries, scope
    ├── ⭐ The Pentest Lifecycle — Recon → Scan → Exploit → Maintain
    │   Access → Cover Tracks → Report
    ├── OSI-layer attack map  ·  Vulnerability mechanics (SQLi/XSS/
    │   buffer overflow — how it works, not working payloads)
    ├── Tool landscape — Nmap/Wireshark/Burp/Metasploit, conceptual role
    ├── Network attacks — DoS, MITM, ARP/DNS spoofing
    ├── Password & auth security  ·  Malware categories (concepts only)
    ├── Threat intelligence  ·  Digital forensics  ·  Anonymity/OPSEC
    ├── Incident response & policy (RFC 1244)
    ├── Historical context — 1991 BBS/hacker-culture text, as artifact
    └── Writing a pentest report

    Same exclusions as always, format-independent: no functional malware,
    exploits, cracking/keygen walkthroughs, or the live exploit-tool catalog.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cross-Cutting Tools/
├── 🎨 Visual Reference Library 💭
├── 📖 Glossary ✅ confirmed — inline the first time a term appears,
│      plus one full searchable dictionary section
├── ▶️  Playground ✅ — JS + HTML live; Python (Pyodide) 🔜
└── ❓ Test Yourself ✅ — general quiz live; per-phase quizzes 🔜
```

---

## One trade-off worth flagging

Web Fundamentals no longer sits between Python/JS and C/C++, so it's not
acting as a "breather" between the easy language and the hard one anymore —
Programming is now one longer continuous climb (Python → JS → C/C++) before
you get to build something visible in Web. Not a problem, just means that
phase runs a bit longer before the payoff. Say the word if you'd rather
soften that, otherwise this stands as drafted.

Everything else — Visual Kit, exclusions, Glossary, Security framing — is
unchanged from last approval. Ready to build at **Phase 0 (Logic)** on your go.
