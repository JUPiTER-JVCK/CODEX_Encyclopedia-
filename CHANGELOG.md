# CHANGELOG

## v3.1 — 2026-08-30

Repository consolidation. The codex, the macOS reader, and a React
curriculum that had been living apart now sit in one repository, and the
top-level docs describe what is actually here.

### Added — Codex LMS (CORE)

A seven-phase interactive curriculum joins the repository at
[`Codex_LMS/`](Codex_LMS/README.md): 43 topics, 222 chapters, from Boolean
logic to ethical hacking, with simulators, a glossary, a live playground,
and Leitner-box spaced review.

It arrived as a bare `core-app.jsx` with no way to run it. Now it builds:

- **Vite + React 18 harness** — `index.html` with font links and a pre-paint
  background, `src/main.jsx` root, `vite.config.js` with a relative base so
  the bundle works from a subdirectory, and a favicon
- **`src/storage.js`** — a progress-persistence adapter. The app was written
  against `window.storage`, the async bridge that only exists inside Claude
  artifacts; outside it, both the read and the write threw into empty catch
  blocks, so the app ran normally and silently discarded every bit of
  progress. The adapter resolves a backend once — `window.storage` when
  present, else `localStorage`, else an in-memory map for private mode and
  sandboxed iframes — while keeping the original async call shape
- **`test/smoke.mjs`** — drives Chromium from the master hub through a phase
  to a topic, pages to the last chapter, marks it complete, and asserts the
  stored value is byte-identical across a reload

The eight pre-merge module sources are kept alongside as the only record of
the structure before they were merged into one file. Nothing imports them.

### Added — macOS reader

- `CodexTree.nonContentDirs` collects the directories that are apps rather
  than codex content — the sibling apps, `node_modules`, build output — and
  both the sidebar tree and the palette index consult it. Without this,
  adding `Codex_LMS/` surfaced it as a phantom layer and put 97 markdown
  files, 95 of them vendored, into `⌘P`
- `allFiles` calls `skipDescendants()` on a match, pruning an excluded
  directory outright instead of walking and filtering it entry by entry

### Changed — documentation

Every top-level document described a `Codex_v2/` directory that does not
exist here, and pointed at paths on one particular Mac.

- **`README.md`** — rewritten around the three components actually present,
  with correct build instructions for both apps and a *Known gaps* section
  recording what is missing rather than implying it is present
- **`STRUCTURE.md`** — repository layout section, the H1 requirement, the
  rule that a new root directory must also be registered in
  `nonContentDirs`, and a note on where app conventions take over
- **`LAYERS.md`** — stale local paths and version annotations removed; the
  missing images and the placeholder PDF now called out where they are listed
- **`Codex_macOS/README.md`** — was still describing the pre-v3.0
  three-column layout and a `Views.swift` that no longer exists. Rewritten
  for the current architecture, with the full shortcut table and a
  **Known issues** section recording an audit of the Swift sources
- **`Codex_LMS/README.md`** — new; documents the storage backends and the
  smoke test

### Fixed — malformed markdown tables

Eleven tables across the codex rendered as literal text rather than tables.
Copilot's review on this PR flagged two; a scan for the pattern found nine
more.

Five are the protocol `INDEX.md` files that v3.0 recorded as gaining
frontmatter and an H1 — that edit inserted a "Dedicated Protocol References"
table at the top of each and clobbered the *following* table's section
heading and header row, leaving an orphaned separator. Restored in
`05_OS_Kernel`, `07_Runtime_Environment`, `16_RF_Wireless`,
`18_Embedded_Systems`, and `19_Industrial_Protocols`.

Four more are unescaped `|` inside inline code — GitHub treats a pipe as a
cell separator even within backticks — in `shell_commands.md`,
`javascript.md`, and `python.md` (twice). Two rows in
`14_Security/man_pages/INDEX.md` were missing their second cell.

`tools/table_audit.py` checks for all three faults and gates on them.

### Fixed — non-portable references

Twenty-five references to paths on one particular machine
(`~/Documents/…`, `~/Desktop/…`) across ten files, rewritten as provenance
notes that keep the "migrated from v1" information without the absolute
path. The two vendored PDFs now carry explicit redistribution status:
the LeetCode list is marked not-redistributable with the extracted
`100_must_do.md` given as the citable form, and the embedded roadmap points
at Parvizi's CC BY-SA 4.0 original. `CHANGELOG.md`'s own v2.1 migration
notes keep their paths — they are a record of what happened.

### Fixed — conventions that did not match the repository

`STRUCTURE.md` claimed filenames are lowercase throughout and that every
content note carries frontmatter. Neither held: `Network/`, `INDEX.md`, and
`Codex_macOS/` are capitalized, and 164 of 274 files have no frontmatter.
Replaced with a table of what each kind of file actually uses, and an
explicit exemption for entry points and root documents.

### Known issues recorded, not yet fixed

An audit of the 13 Swift sources found the markdown pipeline re-parsing a
document on the order of 400 times per render, a synchronous disk read
inside `body`, and `displayTitle()` re-reading every open file per tab-strip
render. Separately, the list parser only matches bullets at column 0, so
indented sub-items — about 100 lines across the codex — render as loose
paragraphs. Both are written up in `Codex_macOS/README.md`.

None of the Swift is compiler-verified; there is no Swift toolchain in the
environment these changes were made in.

### Still missing

- The Python TUI source. `requirements.txt` is present and earlier entries
  describe a Textual browser, but no `codex_tui/` exists here.
- The four `_assets/` reference images.
- `embedded_systems_full_roadmap_book.pdf` is a generated 8 KB placeholder,
  not the real roadmap book.

### Verified

- `tools/link_audit.py` — new, and now the source of these numbers: 274
  markdown files, 1006 internal links, 0 broken, every file carrying an H1.
  It strips code spans first, so the handful of `[text](path.md)` syntax
  examples in prose no longer register as breakages the way an earlier
  ad-hoc pass had them
- `npm run build` clean — 32 modules, 466 kB (148 kB gzipped)
- `npm run smoke` passes: progress survives a reload, no page errors

---

## v3.0 — 2026-06-07

Top-to-bottom SwiftUI redesign of the macOS app. The terminal-based TUI
browser is unchanged; this release is exclusively about the native app
shipping in `Codex.app/`.

### Added — Native app, modern Apple-style interface

- **Translucent vibrancy sidebar** (`NSVisualEffectView` with `.sidebar`
  material) — tracks system light/dark + window-active state
- **Top toolbar** with sidebar toggle, back/forward history (browser-style),
  clickable breadcrumb (`Codex › Layer › Section › File`), search-style
  command palette trigger, pin/star button, inspector toggle
- **Safari-style tab strip** — rounded tabs, hover-close, scroll-into-view
  on tab switch, smart tab titles (uses first H1 → falls back to filename)
- **Three-tab inspector panel** (right side):
  - Outline — current document's TOC with depth indentation
  - Info — name, location, size, modified date, line count, YAML tags,
    actions (reveal, copy path, pin)
  - Recents — recently opened files
- **Welcome screen** with hero brand, layer/doc/tools stats,
  6-card quick-actions grid, recents grid, and 5-card "Browse by Band"
  grid (each tinted with the band's accent color)
- **Pinned files** appear in their own sidebar section with star indicator
- **Right-click context menu** on sidebar rows — Open / Open in New Tab /
  Pin / Reveal in Finder / Copy Path
- **Cross-document link routing** — `[text](path.md)` clicks open in a
  new in-app tab; `http(s)` links open in default browser
- **Image embedding** — `![alt](path.png)` resolves relative paths and
  renders inline
- **Hover-copy code blocks** — three-circle window-chrome header,
  language pill, copy-to-clipboard button on hover, monospaced inner
  text with syntax-color text selection enabled
- **Zebra-striped tables** with rounded corners and hairline borders
- **Tinted blockquotes** with accent left-rail
- **Navigation history** — back/forward stack like a browser, ⌘[ / ⌘]
- **Catppuccin band tints** — Foundations (teal), Compute (blue),
  Network (mauve), Cross-cutting (peach), Tools (green)

### Added — Keyboard shortcuts

| ⌘P  | Command palette                        |
| ⌘1  | Toggle sidebar                          |
| ⌘0  | Toggle inspector                        |
| ⌘W  | Close active tab                        |
| ⇧⌘W | Close all tabs                          |
| ⌘[ ⌘] | Back / forward                         |
| ⌘H  | Open README                              |
| ⌘R  | Reload tree                              |
| ⌘D  | Pin / unpin current file                 |
| ⇧⌘R | Reveal current file in Finder            |

### Changed — Swift package layout

`Codex_macOS/Sources/Codex/` reorganized from 6 files into 11 focused
files (~1 800 LOC):

| File              | Responsibility                                       |
|-------------------|------------------------------------------------------|
| CodexApp.swift    | @main App + AppState + RootView                      |
| Theme.swift       | Catppuccin palette, font scale, radii, band tints    |
| VisualEffect.swift| NSVisualEffectView wrapper for vibrancy              |
| CodexTree.swift   | Filesystem → CodexNode tree, NodeKind, SF Symbols    |
| Markdown.swift    | Block parser + 7-block renderer (heading/paragraph/  |
|                   | code/list/table/quote/image) with link routing       |
| Sidebar.swift     | Translucent sidebar with band groups + pinned        |
| Toolbar.swift     | Top toolbar, breadcrumb, search trigger              |
| TabStrip.swift    | Safari-style horizontal tab strip                    |
| Inspector.swift   | Outline / Info / Recents tabs                        |
| Welcome.swift     | Hero + quick action / recent / band card grids       |
| Palette.swift     | Modern command palette with badges + footer hint     |
| Util.swift        | Fuzzy match, bookmarks JSON, navigation history,     |
|                   | link resolver, human-relative date formatting        |

### Content fixes

- Added YAML frontmatter + H1 to five protocol `INDEX.md` files that had
  none (`05_OS_Kernel`, `07_Runtime_Environment`, `16_RF_Wireless`,
  `18_Embedded_Systems`, `19_Industrial_Protocols` protocols indexes)

### Verified

- `swift build -c release` clean, 0 warnings, 0 errors
- Bundle ad-hoc signed (`local.codex.swift v3.0`), 2.1 MB
- Launches as foreground `Application` via Launch Services
- Link audit: **270 markdown files · 982 internal links · 0 broken**
- Every file has an H1 heading after the fixes

---

## v2.6 — 2026-05-21

Deep content expansion across all 23 layers. Codex grows from 210 → 271
markdown files (+61 files). Three workstreams: full man pages with ASCII art
and examples, interactive lab lessons for every layer, and protocol/topic
deep-dives.

### Added — Workstream A: TUI sidebar enhancement

- Sidebar width increased (36 → 40), inner padding doubled, tree labels
  bolded, `▸` prefix on section group labels
- Version bumped to "Codex v2.6" in breadcrumb, help modal, and root label

### Added — Workstream B: Full man page reference files (23 files)

**Compute layers:**
- `05_OS_Kernel/man_pages/process_commands.md` — ps, top, htop, btop, kill, nice, chrt, taskset
- `05_OS_Kernel/man_pages/memory_commands.md` — free, vmstat, slabtop, smem, pmap, numastat
- `05_OS_Kernel/man_pages/filesystem_commands.md` — mount, df, du, stat, lsof, fuser, inotifywait
- `05_OS_Kernel/man_pages/tracing_commands.md` — strace, perf, bpftrace, ftrace, dmesg, sysctl
- `06_System_Libraries/man_pages/linker_commands.md` — ld, ldd, ldconfig, nm, objdump, readelf
- `06_System_Libraries/man_pages/debug_commands.md` — gdb, lldb, valgrind, addr2line
- `08_User_Applications/man_pages/shell_commands.md` — bash, zsh, fish, tmux, screen
- `08_User_Applications/man_pages/text_processing.md` — find, grep, rg, awk, sed, jq, xargs
- `08_User_Applications/man_pages/network_tools.md` — curl, wget, rsync, scp, ssh
- `08_User_Applications/man_pages/package_managers.md` — apt, dnf, pacman, brew, nix

**Hardware/foundation layers:**
- `02_CPU/man_pages/cpu_inspection.md` — lscpu, cpuid, turbostat, perf stat
- `03_Firmware_BIOS/man_pages/firmware_tools.md` — fwupdmgr, efibootmgr, mokutil, nvram
- `04_Device_Drivers/man_pages/device_commands.md` — lspci, lsusb, lsblk, modprobe, udevadm, dkms
- `07_Runtime_Environment/man_pages/container_commands.md` — docker, podman, systemd-nspawn, crictl
- `07_Runtime_Environment/man_pages/vm_commands.md` — qemu-system, virsh, VBoxManage

**Network + cross-cutting:**
- `Network/10_Network_DataLink/man_pages/datalink_commands.md` — ip link, bridge, tc, arp, arping
- `Network/11_Network_Internet/man_pages/ip_commands.md` — ip addr/route, traceroute, mtr, ping, nmap
- `Network/12_Network_Transport/man_pages/transport_tools.md` — ss, nc, socat, iperf3, tcpdump
- `Network/13_Network_Application/man_pages/app_protocol_tools.md` — curl (deep), openssl s_client, dig, mosquitto
- `14_Security/man_pages/security_tools.md` — nmap, nikto, gobuster, hashcat, john, aircrack-ng
- `15_AI_ML/man_pages/ml_tools.md` — nvidia-smi, nvtop, tensorboard, huggingface-cli
- `16_RF_Wireless/man_pages/rf_tools.md` — GNU Radio, hackrf_transfer, rtl_sdr, kismet, bluetoothctl
- `18_Embedded_Systems/man_pages/embedded_tools.md` — openocd, probe-rs, esptool, mpremote, minicom

### Added — Workstream C: Interactive lesson modules (23 files)

One lab file per layer with Objective, Prerequisites, Lab Steps (with
runnable code blocks and ASCII diagrams), Knowledge Check (Q&A in
blockquotes), Review Flashcards (term/definition table), and Challenge.

- `00_Physics/lessons/physics_labs.md` — Ohm's law, RC circuit, diode I-V curve
- `00b_Devices/lessons/device_labs.md` — MOSFET switch, BJT LED driver
- `00c_Analog_Circuits/lessons/analog_labs.md` — Op-amp, active filter, ADC aliasing
- `00d_Digital_Circuits/lessons/digital_labs.md` — Truth tables, D flip-flop, 4-bit counter, FPGA
- `01_Circuit_Board/lessons/pcb_labs.md` — KiCad workflow, soldering, signal integrity
- `02_CPU/lessons/cpu_labs.md` — x86-64 assembly, GDB, pipeline hazard demo
- `03_Firmware_BIOS/lessons/firmware_labs.md` — UEFI shell, fwupdmgr, Secure Boot
- `04_Device_Drivers/lessons/driver_labs.md` — Linux char device, udev rules, DT overlay
- `05_OS_Kernel/lessons/kernel_labs.md` — Build & boot kernel, custom syscall, eBPF, namespaces
- `06_System_Libraries/lessons/library_labs.md` — Shared library, dlopen, symbol visibility
- `07_Runtime_Environment/lessons/runtime_labs.md` — Container from scratch, Dockerfile, systemd
- `08_User_Applications/lessons/app_labs.md` — Python CLI, TUI file picker, packaging
- `Network/09_Network_Physical/lessons/physical_labs.md` — Cable testing, ethtool, Wi-Fi survey
- `Network/10_Network_DataLink/lessons/datalink_labs.md` — VLAN config, ARP cache
- `Network/11_Network_Internet/lessons/internet_labs.md` — Subnetting drill, traceroute, BGP sim
- `Network/12_Network_Transport/lessons/transport_labs.md` — TCP handshake, cwnd, UDP jitter
- `Network/13_Network_Application/lessons/application_labs.md` — DNS trace, TLS decode, HTTP/2
- `14_Security/lessons/security_labs.md` — nmap scan, hashcat, seccomp sandbox
- `15_AI_ML/lessons/ml_labs.md` — PyTorch MNIST, attention visualization, ONNX export
- `16_RF_Wireless/lessons/rf_labs.md` — SDR FM, Wi-Fi capture, BLE scan, LoRa hello
- `17_Algorithms_DSA/lessons/dsa_labs.md` — Big-O measurement, binary search, BFS/DFS, DP knapsack
- `18_Embedded_Systems/lessons/embedded_labs.md` — Bare-metal blink, FreeRTOS tasks, UART, I2C
- `19_Industrial_Protocols/lessons/industrial_labs.md` — Modbus TCP, OPC UA browse, CAN, MQTT

### Added — Workstream D: Protocol & topic deep-dives (15 files)

**Protocol files (9):**
- `16_RF_Wireless/protocols/wifi.md` — 802.11 evolution, OFDM, WPA3, roaming, mesh
- `16_RF_Wireless/protocols/bluetooth.md` — BLE stack, GATT, pairing, LE Audio, BT Mesh
- `16_RF_Wireless/protocols/lorawan.md` — Class A/B/C, OTAA/ABP, ADR, regional params
- `18_Embedded_Systems/protocols/i2c_spi.md` — I2C timing/addressing; SPI modes, QSPI
- `18_Embedded_Systems/protocols/uart.md` — UART framing, RS-232/422/485, flow control
- `19_Industrial_Protocols/protocols/modbus.md` — RTU/ASCII/TCP, function codes, register model
- `19_Industrial_Protocols/protocols/opc_ua.md` — Info model, services, security, PubSub
- `05_OS_Kernel/protocols/posix_syscalls.md` — Syscall categories, calling convention, tracing
- `07_Runtime_Environment/protocols/oci_runtime.md` — Image/runtime/distribution spec, lifecycle

**Topic files (6):**
- `03_Firmware_BIOS/topics/uefi_boot_flow.md` — SEC→PEI→DXE→BDS, GPT, Secure Boot chain
- `04_Device_Drivers/topics/driver_model.md` — Bus/device/driver binding, DT/ACPI, udev
- `05_OS_Kernel/topics/virtual_memory.md` — Page tables, TLB, mmap, huge pages, ASLR
- `06_System_Libraries/topics/libc_variants.md` — glibc, musl, Bionic, uClibc, newlib
- `07_Runtime_Environment/topics/container_internals.md` — Namespaces, cgroups v2, overlayfs, seccomp
- `15_AI_ML/topics/transformer_architecture.md` — MHA, KV cache, MoE, scaling laws, RoPE

### Updated

- `README.md` — version to v2.6, description updated
- All 23 `lessons/INDEX.md` files — "Dedicated Lesson Modules" table
- All 9 protocol `INDEX.md` files — "Dedicated Protocol References" table
- All 6 topic `INDEX.md` files — "Dedicated Topic Deep Dives" table
- All 15 `man_pages/INDEX.md` files — "Dedicated man page references" table
- `codex_tui/styles.tcss`, `tree_model.py`, `app.py`, `modals.py` — v2.6 sidebar

### Statistics

| Metric | v2.5 | v2.6 | Δ |
|--------|------|------|---|
| Markdown files | 210 | 271 | +61 |
| Links | ~700 | 987 | +287 |
| Broken links | 0 | 2* | 0 new |

*2 pre-existing `_assets/README.md` image links (PNG not in repo)

---

## v2.5 — 2026-05-21

Protocol batch 2 + split-pane TUI viewer. Five more protocols promoted to
dedicated reference files; TUI gains side-by-side split view.

### Added — Dedicated protocol files

**`Network/11_Network_Internet/protocols/`:**
- `ospf.md` — packet types (Hello/DBD/LSR/LSU/LSAck), neighbor state machine,
  area design diagram (backbone/stub/NSSA/totally-stub), LSA types 1–7, SPF
  algorithm, cost calculation, authentication, gotchas

**`Network/13_Network_Application/protocols/`:**
- `ssh.md` — protocol layers, key exchange flow, auth methods (pubkey/password/
  keyboard-interactive/cert), channel multiplexing, port forwarding (local/
  remote/dynamic SOCKS5), ProxyJump vs agent forwarding, hardening config
- `dhcp.md` — DORA process diagram, DHCPv4 message format, key options table,
  relay with Option 82, DHCPv6 (stateful/stateless/PD), DHCP snooping, gotchas
- `mqtt.md` — pub/sub architecture, connect/publish/subscribe flow, QoS 0/1/2
  diagrams with trade-offs, MQTT 5.0 features table, LWT, retained messages,
  packet format (2-byte min overhead), security layers
- `oauth2.md` — OAuth 2.0/2.1 roles diagram, authorization code + PKCE flow,
  grant types (kept vs removed in 2.1), tokens (access/refresh/ID), PKCE
  explanation, OIDC endpoints, RFC 9700 security BCP, common gotchas

### Added — TUI split-pane viewer

- **`ctrl+\`** toggles a second `TabbedContent` pane side-by-side with the first
- Each pane maintains its own independent tab set and file tracking
- First open clones the current file into pane 2; subsequent tree/palette opens
  go to the active pane (click a tab to activate its pane)
- CSS: `#tabs2` gets a left border separator; `#tabs2.-hidden` hides via
  `display: none`
- Help screen updated with split-view binding and `j/k/space` scroll keys

### Updated

- Protocol `INDEX.md` in `Network/11_Network_Internet/`: added OSPF to
  "Dedicated protocol references" table
- Protocol `INDEX.md` in `Network/13_Network_Application/`: added SSH, DHCP,
  MQTT, OAuth 2.0 to "Dedicated protocol references" table
- `README.md` — version bumped to 2.5, split-pane mentioned in TUI section
- `codex_tui/app.py` — rewritten with dual `TabbedContent` (`#tabs` + `#tabs2`),
  `_active_pane` tracking, `_current_tabs()`/`_current_tab_paths()` helpers
- `codex_tui/styles.tcss` — added `#tabs2` and `#tabs2.-hidden` rules
- `codex_tui/modals.py` — help text updated to v2.5, added `ctrl+\` split
  binding, `j/k/space` scroll keys

### Counts

- **+5 new protocol files** (OSPF, SSH, DHCP, MQTT, OAuth 2.0)
- **2 INDEX.md updates** (layers 11, 13)
- **3 TUI module updates** (app.py, styles.tcss, modals.py)
- Codex now contains **~210 markdown files**

### Queued for v2.6

- `solutions/<id>_<slug>.md` write-ups for LeetCode problems
- Watch mode (auto-reload on file change)
- Tag-based filtering in TUI (requires frontmatter on all files)
- Tab numbers (`1`–`9` jump to tab N)
- `ctrl+]` / `ctrl+[` next/prev tab

---

## v2.4 — 2026-05-20

The "deep content" release. Headline protocols promoted from table rows to
dedicated reference files with RFC summaries and ASCII art diagrams.
Compute/foundational layers get visual reference topics. TUI outline TOC
now supports click-to-jump.

### Added — Dedicated protocol files

**`Network/12_Network_Transport/protocols/`:**
- `tcp.md` — segment header layout, 3-way handshake, state machine diagram,
  congestion control (Reno/CUBIC/BBR), key extensions table, gotchas
- `udp.md` — datagram format, kernel offloads (GSO/GRO), amplification attacks
  table, UDP-Lite
- `quic.md` — long/short header, handshake timeline, stream multiplexing,
  flow control, connection migration, implementation matrix

**`Network/11_Network_Internet/protocols/`:**
- `ipv4_ipv6.md` — IPv4 + IPv6 header layouts, extension header chain,
  addressing (CIDR, SLAAC, ULA), ICMP, PMTUD diagram
- `bgp.md` — message types, session establishment, state machine, UPDATE
  structure, path attributes, best-path decision, iBGP vs eBGP, MP-BGP AFIs,
  security (RPKI/BGPsec)

**`Network/13_Network_Application/protocols/`:**
- `http.md` — HTTP/1.1 → 2 → 3 evolution, H2 binary framing, H3 over QUIC,
  methods, status codes, caching, security headers
- `tls.md` — TLS 1.3 handshake (1-RTT), TLS 1.2 comparison, record protocol,
  cipher suites, certificate chain, post-quantum TLS, ACME flow
- `dns.md` — resolution flow diagram, message format, record types, DNSSEC
  chain of trust, encrypted DNS (DoT/DoH/DoQ), CLI tools

**`Network/10_Network_DataLink/protocols/`:**
- `ethernet.md` — Ethernet II frame, 802.1Q VLAN tagging, MAC format, ARP
  flow, STP evolution, speed timeline

**`14_Security/protocols/`:**
- `tls_ipsec.md` — transport vs tunnel mode, ESP packet format, IKEv2
  exchange, IPsec vs WireGuard vs OpenVPN comparison

### Added — ASCII art diagram topics

**`02_CPU/topics/`:**
- `cpu_pipeline.md` — 5-stage RISC pipeline, data/control/structural hazards,
  superscalar OoO block diagram, cache hierarchy, branch prediction, Spectre

**`00b_Devices/topics/`:**
- `mosfet_cross_section.md` — NMOS/PMOS cross-sections, CMOS inverter + NAND
  schematics, FinFET/GAA/nanosheet scaling evolution

**`00c_Analog_Circuits/topics/`:**
- `opamp_configurations.md` — 8 op-amp circuit diagrams (inverting, non-inverting,
  buffer, summing, differential, instrumentation, integrator, differentiator),
  active filters, real-world non-idealities table

**`Network/11_Network_Internet/topics/`:**
- `osi_model.md` — OSI 7-layer ladder with TCP/IP mapping, encapsulation
  nesting diagram, PDU names

### Fixed — TUI

- **Outline TOC click-to-jump** — clicking a heading in the outline panel now
  scrolls the viewer to that heading via `Markdown.goto_anchor()`. Falls back
  to proportional scroll if anchor not found.
- **Version strings** — breadcrumb and sidebar tree now show "Codex v2.4".

### Updated

- Protocol `INDEX.md` files in layers 10–13 + 14: added "Dedicated protocol
  references" table at top linking every new file
- Topic `INDEX.md` files in 00b, 00c, 02, 11: added "Dedicated topic files"
  table linking new diagram files
- `README.md` — version bumped to 2.4
- `codex_tui/app.py` — outline click handler, version strings
- `codex_tui/widgets.py` — `heading_text` attribute on outline items

### Counts

- **+14 new content files** (10 protocol + 4 topic/diagram)
- **~11 INDEX.md updates**
- **2 TUI module updates** (app.py, widgets.py)
- Codex now contains **~205 markdown files**

### Queued for v2.5

- True split-pane viewer (two TabbedContent side-by-side)
- More protocol promotions (OSPF, DHCP, SSH, MQTT, OAuth 2.0)
- `solutions/<id>_<slug>.md` write-ups for LeetCode problems
- Watch mode (auto-reload on file change)
- Tag-based filtering in TUI (requires frontmatter on all files)

---

## v2.3 — 2026-05-20

The "polish + per-language" release. Staged first half of the user's expansion ask
(UI refresh + per-language profiles). v2.4 will tackle the deeper content
expansion (RFC/protocol detail + ASCII visuals).

### Added — UI refresh

- **`codex_tui/themes.py`** — three custom Textual themes registered:
  - **`catppuccin-mocha`** (new default; warm pastel dark)
  - **`catppuccin-latte`** (warm pastel light)
  - **`high-contrast`** (ANSI-anchored, accessibility-first)
  - Palette per the official Catppuccin spec (mauve primary, blue secondary,
    pink accent; surface/panel/boost stops for backgrounds).
- **`codex_tui/styles.tcss`** — full rewrite:
  - Theme-aware (all colors via theme variables; no hard-coded hex)
  - Modern card surfaces with rounded borders, generous padding
  - Refined tab strip (active tab gets a primary-color bottom border)
  - Scrollbar styling per-pane with hover + active states
  - Markdown widget styling: H1/H2/H3 use the theme's primary/secondary/accent
    colors with subtle bottom borders on H1
  - Modal dialogs: search, command palette, help with primary-color thick borders
- **`codex_tui/state.py`** — legacy theme names (`dark`/`light`) migrated
  automatically on first load; cycle order updated to the three new themes.
- `ctrl+T` now cycles `catppuccin-mocha` → `catppuccin-latte` → `high-contrast`.

### Added — Per-language man-page profiles

**`08_User_Applications/languages/`** — canonical profiles, 15 files:
`python.md`, `rust.md`, `c.md`, `cpp.md`, `go.md`, `javascript.md`,
`typescript.md`, `java.md`, `kotlin.md`, `csharp.md`, `swift.md`, `ruby.md`,
`bash.md`, `sql.md`, `lua.md`.

Each profile is structured as a man-page-style reference:
- Interpreter / compiler / toolchain CLI with notable flags
- Package manager + lockfile mechanics
- Linter / formatter / type-checker / test runner
- Stdlib essentials map
- Common 3rd-party libraries
- Idioms section
- "Common gotchas" — the bugs you'd otherwise hit

**`02_CPU/languages/`** — per-architecture assembly:
`x86_64_asm.md`, `arm64_asm.md`, `riscv_asm.md`.
Each covers registers, calling conventions (SysV / MS / AAPCS64 / psABI),
syscall ABI, "hello world" examples, and arch-specific gotchas.

**`18_Embedded_Systems/languages/`** — embedded-specific dialects:
`embedded_c.md` (freestanding + linker scripts + MISRA),
`embedded_rust.md` (`no_std`, Embassy, RTIC, probe-rs),
`embedded_python.md` (MicroPython + CircuitPython + mpremote).

### Updated

- `08_User_Applications/languages/INDEX.md` — added "Per-language profiles"
  table at the top linking every new profile
- `02_CPU/languages/INDEX.md` — added "Per-architecture assembly profiles"
  table at the top
- `18_Embedded_Systems/languages/INDEX.md` — added "Embedded language
  profiles" table pointing at the three new files + their host baselines

### Fixed

- **TUI scroll** — `Markdown` is now wrapped in a `VerticalScroll` per tab;
  arrow keys, `j`/`k`, `Page Up/Down`, `Space`, `g`/`G` all scroll. Viewer
  auto-focuses when a new file is opened so input goes straight to scroll.
- **Tab focus on file change** — opening a file from the tree or palette now
  re-focuses the scroll container after a short timer so keyboard scroll
  works immediately.

### Verification

- `python3 -c "from codex_tui import themes; print([t.name for t in themes.ALL_THEMES])"`
  → `['catppuccin-mocha', 'catppuccin-latte', 'high-contrast']`
- App mount + theme cycle verified via `app.run_test()` pilot harness
- Link audit: 613 relative links checked, **0 broken from these changes**
  (only the 2 expected placeholder PNG references in `_assets/README.md`)
- File counts: +18 new language profile files, +3 INDEX.md updates,
  +1 new `themes.py` module, full `styles.tcss` rewrite

### Queued for v2.4

- Deep RFC summaries embedded per protocol (TCP, IP, HTTP, TLS, BGP, …)
- Full ASCII art diagrams (OSI ladder, TCP state machine, packet layouts,
  CPU pipeline diagrams, MOS transistor cross-sections, op-amp configs)
- More per-protocol detail files (currently they're table rows in
  `protocols/INDEX.md`; v2.4 promotes the headline ones to dedicated `.md`)
- Outline TOC click-to-jump (currently a stub status note)
- True split-pane viewer (two TabbedContent side-by-side)

## v2.2 — 2026-05-20

The "complete the pending work" release. All four workstreams (B/C/A/D from
`~/.claude/plans/cosmic-cuddling-sloth.md`) landed.

### Added
- **Network band** — layers 09–13 now live under `Codex_v2/Network/` for cleaner
  grouping. All 101 affected relative cross-links across 36 files were rewritten
  by `/tmp/network_relink.py`. Link audit: 631 links checked, 0 broken from the
  restructure, 0 `Network/Network/` duplicates.
- **Authoritative 100 LeetCode problems list** at
  `17_Algorithms_DSA/topics/100_must_do.md`, extracted from the Bosscoder Academy
  PDF (rendered at 100 DPI via `pdftoppm`, problem statements transcribed page-by-page
  through the multimodal Read tool). All 100 problems mapped to LeetCode #s + titles
  across the 14 PDF sections. `canonical_lists.md` rewritten as the pattern-first
  companion.
- **TUI browser v0.2** at `Codex_v2/codex_tui/` (Python + Textual):
  - 3-pane layout: breadcrumb header / sidebar tree / tabbed markdown viewer / outline TOC / status bar
  - Sidebar tree grouped into bands (Foundations / Compute / Network / Cross-cutting),
    with a `★/·` bookmark gutter
  - Full-text **search** modal (`/`) — substring + `r:` regex prefix
  - **Command palette** (`ctrl+P`) — VSCode-style fuzzy file picker over all 169 docs
  - **Tabs** — `n` open in new tab, `ctrl+w` close
  - **Split view scaffolding** — toggleable side panes (`ctrl+B` sidebar, `ctrl+O` outline)
  - **Bookmarks + recents** — persisted to `~/.config/codex_tui/state.json`
  - **Click-to-follow .md links** — relative markdown links open in a new tab
  - **Theme switcher** (`ctrl+T`) cycles dark / light / high-contrast
  - **Help screen** (`?`)
  - Launcher: `Codex_v2/codex` (chmod +x); deps in `Codex_v2/requirements.txt`

### Removed
- `Codex_v2/index.html`, `Codex_v2/_sidebar.md` — abandoned Docsify scaffolding
- `.claude/launch.json` — dead preview server config

### Updated
- `README.md` — version bumped to 2.2; layout block shows `Network/` band; pending TUI plan crossed off
- `LAYERS.md` — Network band callout, all five network layers' links re-pointed to `Network/...`
- `_assets/README.md` — references for future PNG drops still expected (no change in expectation, file unchanged)

### Verification (this release)
- `pip3 install --user -r requirements.txt` → installs `textual-0.89.1`, `rich-15.0.0` + transitives
- `python3 -c "from codex_tui.tree_model import build_tree; ..."` → groups: Top-level, Foundations, Compute, Network, Cross-cutting; 23 layers
- `SearchEngine.search("TCP three-way")` → 2 hits, top match in `Network/12_Network_Transport/README.md`
- `SearchEngine.search("r:RFC \\d{4}")` → 5 hits across network protocols files
- `fuzzy_rank("logic", ...)` → `00d_Digital_Circuits/topics/logic_gates.md` ranked #1
- Link audit script (`/tmp/link_audit.py`): 631 links, 0 broken from restructure, 2 expected gaps (placeholder PNG paths in `_assets/README.md`)

### Known follow-ups (queued for v2.3)
- Drop the 4 reference PNGs into `_assets/` (computer-layers ladder, DSLogic decoders, logic gates, embedded roadmap)
- Outline TOC click-to-scroll (currently flashes a status note; needs Markdown anchor resolution)
- True split-pane (two TabbedContent side-by-side) — current `ctrl+B/O` toggles are panel-show/hide
- `solutions/<id>_<slug>.md` write-ups for each LeetCode problem
- Watch mode (auto-reload on file change)
- Migrate v1 PDFs into per-layer references

## v2.1 — 2026-05-20

Modules added based on four reference images and the user-supplied
*100 LeetCode Problems Must Do* PDF.

### Added — foundational layers (below 01)
| Layer | Purpose |
|-------|---------|
| `00_Physics/` | EM, semiconductor, quantum, thermo — the laws beneath electronics |
| `00b_Devices/` | Diodes, BJTs, MOSFETs, passives — the components on a board |
| `00c_Analog_Circuits/` | Op-amps, filters, ADC/DAC, regulators, references |
| `00d_Digital_Circuits/` | Logic gates, flip-flops, ALUs, RTL — including the **logic_gates.md** topic with full truth tables |

### Added — cross-cutting layers (after 16)
| Layer | Purpose |
|-------|---------|
| `17_Algorithms_DSA/` | LeetCode + DSA — anchored by user-supplied PDF copy at `references/100_leetcode_problems.pdf`; canonical pattern list seeded in `topics/canonical_lists.md` |
| `18_Embedded_Systems/` | Roadmap-aligned (Meysam Parvizi v1.2.3) — `references/embedded_systems_full_roadmap_book.pdf` copied from v1 `~/Documents/Information_Tech/- Hardware/` |
| `19_Industrial_Protocols/` | Modbus, PROFINET, EtherCAT, BACnet, DALI, CAN, LIN, FlexRay, UDS, J1939, OPC UA, IEC 61850 — and the OT/ICS security cross-link |

### Added — supporting structure
- `_assets/` — top-level folder with placeholders for the four reference images
  - `computer_layers_ladder.png`, `dslogic_decoder_list.png`,
    `logic_gates_explained.png`, `embedded_systems_roadmap.png`
  - See [`_assets/README.md`](_assets/README.md) for naming + reference paths
- `01_Circuit_Board/protocols/embedded_bus_protocols_lookup.md` —
  recreated from the DSLogic/sigrok decoder-list screenshot. ~150 base + upper-layer
  decoders, each mapped to its owning codex layer.

### Image sources (recreated as markdown; drop PNGs into `_assets/`)
1. **Computer layers ladder** — drove the new `00*` foundational layers.
2. **DSLogic decoder list** — became `01_Circuit_Board/protocols/embedded_bus_protocols_lookup.md`.
3. **Logic Gates Explained** — became `00d_Digital_Circuits/topics/logic_gates.md`.
4. **Embedded Engineering Roadmap (Parvizi v1.2.3, CC BY-SA 4.0)** — drove
   layer `18_Embedded_Systems`. Source repo: `github.com/m3y54m/Embedded-Engineering-Roadmap`.

### V1 source materials referenced
- `~/Documents/Information_Tech/- Math:Logic:Data/Logic/BOOLEAN LOGIC GATES.html` → 00d
- `~/Documents/Information_Tech/- Math:Logic:Data/Numbering/` → 00d topics
- `~/Documents/Information_Tech/- Hardware/Embedded_Systems_Full_Roadmap_Book.pdf` → 18 references (copied)
- `~/Desktop/Folder 3/100 LeetCode Problems must do copy.pdf` → 17 references (copied)
- `~/Documents/Information_Tech/- Security : OSINT/Encryption/quantum/` → 00 + 14 cross-links

### Notes
- The LeetCode PDF is **image-based** (no text layer); without `poppler` (which
  failed to install due to a `/usr/local/share/man/man8` ownership issue), the
  exact problem list can't be auto-extracted. `topics/canonical_lists.md` uses
  the Blind 75 → NeetCode 150 progression which materially overlaps with any
  "100 must do" curation; reconcile against the PDF when text extraction is
  restored.
- Image files themselves were not copied — they're inline in the chat. Markdown
  recreations capture the content. Drop the real PNGs into `_assets/` to
  satisfy the existing image references.

### File counts
- Added: 4 foundational + 3 cross-cutting = 7 new layers × 7 files each = **49 new layer files**
- Plus: `logic_gates.md`, `canonical_lists.md`, `embedded_bus_protocols_lookup.md`, `_assets/README.md` = **4 cross-layer additions**
- Plus updates to `README.md`, `LAYERS.md`, this `CHANGELOG.md` = **3 top-level edits**
- 2 PDFs copied into `references/`
- **Codex now contains ~169 markdown files across 23 layer folders**

---

## v2.0 — 2026-05-19

New layered structure built in `DEV.02/Codex_v2/`. Source v1 (`~/Documents/Information_Tech/`)
remains untouched as the migration source.

### Added
- 16 layer folders organized into three bands:
  - **Compute stack (01–08)** — from `computer_layers.pdf`: Circuit Board, CPU,
    Firmware/BIOS, Device Drivers, OS Kernel, System Libraries, Runtime, User Apps.
  - **Network stack (09–13)** — OSI-aligned: Physical, Data Link, Internet,
    Transport, Application.
  - **Cross-cutting (14–16)** — Security, AI/ML, RF/Wireless.
- Every layer has the same six sub-sections: `references/`, `lessons/`,
  `languages/`, `man_pages/`, `topics/`, `protocols/`.
- Top-level docs: `README.md`, `LAYERS.md`, `STRUCTURE.md`, this changelog.

### Changes from v1
| v1 folder                          | v2 home                                                 |
|------------------------------------|---------------------------------------------------------|
| `- System/`                        | Spans 03_Firmware_BIOS → 07_Runtime_Environment         |
| `- System/Shell : Programing`      | 08_User_Applications/languages + 06_System_Libraries    |
| `- System/Virtual Infrastructure`  | 07_Runtime_Environment/topics                           |
| `- System/MAC` / `Unix` / `Linux` / `Windows` | 05_OS_Kernel/topics, per-OS notes            |
| `- Hardware/`                      | 01_Circuit_Board + 02_CPU                               |
| `- Hardware/- SBC/`                | 01_Circuit_Board/topics                                 |
| `- Networking/`                    | 09–13 network stack (split by OSI layer)                |
| `- Networking/PCAP/`               | 13_Network_Application/topics + 12_Transport            |
| `- Standard RFC/`                  | Distributed across 09–13 `protocols/`                   |
| `- Security : OSINT/`              | 14_Security                                             |
| `- Security : OSINT/IPsec/`        | 14_Security + 11_Network_Internet/protocols             |
| `- Security : OSINT/Encryption/`   | 14_Security/topics                                      |
| `- BlackHat/`                      | 14_Security/topics (offensive subfolder)                |
| `- BlackHat/iOT/`                  | 14_Security + 01_Circuit_Board                          |
| `- Ai/`                            | 15_AI_ML                                                |
| `- RFrequency/`                    | 16_RF_Wireless                                          |
| `- Math:Logic:Data/`               | Distributed: Logic → 02_CPU, Data → 15_AI_ML            |
| `- Learning Modules/`              | Per-layer `lessons/` folders                            |
| `- Legal/`                         | Stays at `~/Documents/Information_Tech/- Legal/`        |

### Migration status (post-v2.1)
- [x] Scaffold built
- [x] Top-level docs written
- [x] Layer READMEs + sub-section INDEX.md (16 of v2.0, then 7 more in v2.1)
- [x] User-supplied reference PDFs copied into appropriate layers
- [ ] Migrate v1 PDFs and notes (beyond the two anchor PDFs) into per-layer folders
- [ ] Add cross-reference links between layers (some done, more possible)
- [ ] Drop reference images into `_assets/` (placeholders set)
- [ ] Build the Textual TUI browser (plan approved: `~/.claude/plans/cosmic-cuddling-sloth.md`)

## v1 — (pre-existing)

Flat-ish topic folders under `~/Documents/Information_Tech/` with dash-prefixed
section names. No formal layer model; no consistent sub-section structure.
