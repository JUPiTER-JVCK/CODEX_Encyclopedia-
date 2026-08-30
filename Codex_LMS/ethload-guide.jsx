import { useState, useEffect, useRef, createContext, useContext } from "react";

/* ─────────────────────────────────────────────
   THEME SYSTEM — built on Anthropic brand colors
   Dark:  #141413   Light: #faf9f5
   Orange #d97757 · Blue #6a9bcc · Green #788c5d
   Mid Gray #b0aea5 · Light Gray #e8e6dc
   ───────────────────────────────────────────── */
const THEMES = {
  dark: {
    name: "dark",
    bg: "#141413", sidebar: "#0f0e0d", surface: "#1e1d1a", surfaceAlt: "#26241f", hover: "#26241f",
    border: "#2b2a26", borderStrong: "#3a3833",
    text: "#faf9f5", textSecondary: "#c9c6bb", textMuted: "#8f8d83",
    accent: "#dd8060", accentSoft: "#dd806022",
    blue: "#7fa9d4", blueSoft: "#7fa9d422",
    green: "#8ba173", greenSoft: "#8ba17322",
    red: "#d9776a", redSoft: "#d9776a22",
    codeBg: "#0f0e0d", codeBorder: "#2b2a26", codeText: "#8ba173",
    inlineBg: "#26241f", inlineText: "#7fa9d4",
    heroGrad: "linear-gradient(135deg, #1c1a16 0%, #211e18 50%, #17150f 100%)",
    heroGlow: "radial-gradient(circle, #dd806018 0%, transparent 70%)",
    shadow: "none", diagramBg: "#0f0e0d",
  },
  light: {
    name: "light",
    bg: "#faf9f5", sidebar: "#f4f2ea", surface: "#ffffff", surfaceAlt: "#f2f0e8", hover: "#efece3",
    border: "#e8e6dc", borderStrong: "#dcd9cc",
    text: "#141413", textSecondary: "#57554d", textMuted: "#8a887e",
    accent: "#c05f3c", accentSoft: "#c05f3c14",
    blue: "#4a7db0", blueSoft: "#4a7db014",
    green: "#5f7345", greenSoft: "#5f734514",
    red: "#b23a2b", redSoft: "#b23a2b12",
    codeBg: "#f5f3ec", codeBorder: "#e8e6dc", codeText: "#5f7345",
    inlineBg: "#eeece3", inlineText: "#4a7db0",
    heroGrad: "linear-gradient(135deg, #f5efe4 0%, #faf9f5 50%, #f0ebdf 100%)",
    heroGlow: "radial-gradient(circle, #d9775720 0%, transparent 70%)",
    shadow: "0 1px 3px rgba(20,20,19,0.06), 0 1px 2px rgba(20,20,19,0.04)",
    diagramBg: "#f5f3ec",
  },
};

const FONT_UI = "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_BODY = "'Lora', Georgia, 'Times New Roman', serif";
const FONT_MONO = "'JetBrains Mono', 'Fira Code', monospace";

const ThemeCtx = createContext(null);
const useT = () => useContext(ThemeCtx);

/* ─── ICONS ─── */
const Ic = {
  sun: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  moon: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
    </svg>
  ),
  desktop: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
    </svg>
  ),
  mobile: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" />
    </svg>
  ),
  menu: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  ),
  close: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
};

/* ─── STRUCTURE ─── */
const SECTIONS = [
  { id: "intro", icon: "⚡", title: "Introduction", subsections: [] },
  {
    id: "misc", icon: "📋", title: "About & Credits",
    subsections: [
      { id: "copyright", title: "Copyright" }, { id: "support", title: "Support" },
      { id: "distribution", title: "Distribution" }, { id: "testers", title: "Contributors" },
      { id: "changelog", title: "Changelog" }, { id: "licensing", title: "Licensing" },
      { id: "security", title: "Security" },
    ],
  },
  {
    id: "config", icon: "⚙️", title: "Configuration Files",
    subsections: [
      { id: "ethers", title: "ETHERS" }, { id: "hosts", title: "HOSTS" },
      { id: "networks", title: "NETWORKS" }, { id: "protocol", title: "PROTOCOL" },
      { id: "saps", title: "SAPS" }, { id: "wks", title: "WKS.TCP / WKS.UDP" },
      { id: "types", title: "TYPES" }, { id: "vendors", title: "VENDORS" },
      { id: "osi-files", title: "OSI Files" },
    ],
  },
  {
    id: "drivers", icon: "🔌", title: "Datalink Drivers",
    subsections: [
      { id: "odi", title: "Novell ODI" }, { id: "ndis", title: "Microsoft NDIS" },
      { id: "dll", title: "DEC DLL" }, { id: "packet", title: "Packet Driver" },
      { id: "file-driver", title: "File Driver" },
    ],
  },
  {
    id: "cli", icon: "▶", title: "Command Line Options",
    subsections: [
      { id: "opt-d", title: "-d  Datalink Driver" }, { id: "opt-p", title: "-p  Protocol Filter" },
      { id: "opt-t", title: "-t  Real-time Trace" }, { id: "opt-s", title: "-s  Slow/Secure Mode" },
      { id: "opt-i", title: "-i  Measure Interval" }, { id: "opt-q", title: "-q  Quiet Mode" },
      { id: "opt-r", title: "-r  Recorder Mode" }, { id: "opt-b", title: "-b  LAN Bandwidth" },
      { id: "opt-o", title: "-o  Promiscuous Override" }, { id: "opt-f", title: "-f  Filter" },
      { id: "opt-m", title: "-m  Buffers" },
    ],
  },
  {
    id: "screens", icon: "🖥", title: "Display & Screens",
    subsections: [
      { id: "screen-layout", title: "Screen Layout" }, { id: "commands", title: "Commands" },
      { id: "data-display", title: "Data Display" }, { id: "accuracy", title: "Accuracy" },
      { id: "mac-screen", title: "MAC Level Screen" }, { id: "tcpip-screens", title: "TCP/IP Screens" },
      { id: "decnet-screens", title: "DECnet Screens" }, { id: "osi-screens", title: "OSI Screens" },
      { id: "screen-summary", title: "Screen Summary" },
    ],
  },
  {
    id: "annexes", icon: "📎", title: "Annexes",
    subsections: [
      { id: "references", title: "Data Link References" }, { id: "tested", title: "Tested Data Links" },
      { id: "decnet-names", title: "DECnet Node Names" }, { id: "pitfalls", title: "Common Pitfalls" },
    ],
  },
];

/* ─── PRIMITIVES ─── */
function Code({ children, block }) {
  const { t } = useT();
  if (block) {
    return (
      <pre style={{
        background: t.codeBg, border: `1px solid ${t.codeBorder}`, borderRadius: 10,
        padding: "14px 18px", fontFamily: FONT_MONO, fontSize: 12.5, lineHeight: 1.7,
        color: t.codeText, overflowX: "auto", margin: "12px 0",
      }}>{children}</pre>
    );
  }
  return (
    <code style={{
      background: t.inlineBg, padding: "2px 7px", borderRadius: 5,
      fontFamily: FONT_MONO, fontSize: 12.5, color: t.inlineText,
    }}>{children}</code>
  );
}

function Badge({ children, tone = "blue" }) {
  const { t } = useT();
  const c = t[tone] || t.blue;
  return (
    <span style={{
      display: "inline-block", background: c + "1e", color: c, fontSize: 11, fontWeight: 600,
      padding: "3px 10px", borderRadius: 20, letterSpacing: 0.4, textTransform: "uppercase",
      border: `1px solid ${c}33`, fontFamily: FONT_UI,
    }}>{children}</span>
  );
}

function InfoBox({ title, children, variant = "info" }) {
  const { t } = useT();
  const map = {
    info: { c: t.blue, bg: t.blueSoft, icon: "ℹ️" },
    warn: { c: t.accent, bg: t.accentSoft, icon: "⚠️" },
    tip: { c: t.green, bg: t.greenSoft, icon: "💡" },
    danger: { c: t.red, bg: t.redSoft, icon: "🚨" },
  };
  const v = map[variant];
  return (
    <div style={{
      background: v.bg, border: `1px solid ${v.c}33`, borderLeft: `3px solid ${v.c}`,
      borderRadius: 10, padding: "14px 18px", margin: "16px 0",
    }}>
      {title && (
        <div style={{ fontWeight: 600, color: v.c, marginBottom: 6, fontSize: 14, fontFamily: FONT_UI }}>
          {v.icon} {title}
        </div>
      )}
      <div style={{ color: t.textSecondary, fontSize: 14.5, lineHeight: 1.75, fontFamily: FONT_BODY }}>
        {children}
      </div>
    </div>
  );
}

function TableBlock({ headers, rows }) {
  const { t } = useT();
  return (
    <div style={{
      overflowX: "auto", margin: "14px 0", borderRadius: 10,
      border: `1px solid ${t.border}`, boxShadow: t.shadow,
    }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: FONT_MONO }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{
                textAlign: "left", padding: "11px 14px", background: t.surfaceAlt, color: t.accent,
                borderBottom: `1px solid ${t.borderStrong}`, fontWeight: 600, fontSize: 11.5,
                letterSpacing: 0.5, textTransform: "uppercase", fontFamily: FONT_UI,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? t.surface : t.surfaceAlt + "80" }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{
                  padding: "9px 14px", borderBottom: ri === rows.length - 1 ? "none" : `1px solid ${t.border}`,
                  color: ci === 0 ? t.green : t.textSecondary,
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeading({ id, children }) {
  const { t, view } = useT();
  return (
    <h2 id={id} style={{
      fontSize: view === "mobile" ? 24 : 28, fontWeight: 700, color: t.text,
      margin: "48px 0 12px", paddingBottom: 10, borderBottom: `1px solid ${t.border}`,
      letterSpacing: -0.6, scrollMarginTop: 76, fontFamily: FONT_UI,
    }}>{children}</h2>
  );
}
function SubHeading({ id, children }) {
  const { t } = useT();
  return (
    <h3 id={id} style={{
      fontSize: 18, fontWeight: 600, color: t.text, margin: "32px 0 8px",
      scrollMarginTop: 76, fontFamily: FONT_UI,
    }}>{children}</h3>
  );
}
function P({ children }) {
  const { t } = useT();
  return <p style={{ color: t.textSecondary, fontSize: 15.5, lineHeight: 1.85, margin: "8px 0", fontFamily: FONT_BODY }}>{children}</p>;
}
function Strong({ children }) {
  const { t } = useT();
  return <strong style={{ color: t.text, fontWeight: 600 }}>{children}</strong>;
}

/* ─── CONTENT ─── */
function ContentArea() {
  const { t, view } = useT();
  const twoCol = view === "mobile" ? "1fr" : "1fr 1fr";

  return (
    <div>
      {/* HERO */}
      <div style={{
        background: t.heroGrad, border: `1px solid ${t.border}`, borderRadius: 18,
        padding: view === "mobile" ? "32px 22px" : "48px 40px", marginBottom: 40,
        position: "relative", overflow: "hidden", boxShadow: t.shadow,
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 320, height: 320, background: t.heroGlow }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <Badge tone="green">v1.04</Badge><Badge tone="accent">MS-DOS</Badge><Badge tone="blue">Free Software</Badge>
        </div>
        <h1 style={{
          fontSize: view === "mobile" ? 40 : 52, fontWeight: 700, color: t.text,
          margin: "12px 0 6px", letterSpacing: -2, lineHeight: 1.05, fontFamily: FONT_UI,
        }}>ETHLOAD</h1>
        <p style={{ fontSize: view === "mobile" ? 17 : 21, color: t.textSecondary, margin: 0, fontWeight: 400, fontFamily: FONT_BODY }}>
          Ethernet Load Analyzer &amp; Protocol Event Tracer
        </p>
        <p style={{ color: t.accent, fontSize: 13.5, marginTop: 16, opacity: 0.9, fontStyle: "italic", fontFamily: FONT_BODY }}>
          by Eric Vyncke · January 16, 1994 · vyncke@csl.sni.be
        </p>
        <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Ethernet Analysis", "TCP/IP", "DECnet", "OSI", "NetWare", "NetBEUI"].map((x) => (
            <span key={x} style={{
              background: t.surface, color: t.textSecondary, padding: "6px 14px", borderRadius: 8,
              fontSize: 13, fontWeight: 500, border: `1px solid ${t.border}`, fontFamily: FONT_UI,
            }}>{x}</span>
          ))}
        </div>
      </div>

      {/* INTRO */}
      <SectionHeading id="intro">Introduction</SectionHeading>
      <P>ETHLOAD is free software designed to run on any MS-DOS PC equipped with an Ethernet controller. It serves as both a simple load analyzer and a multi-protocol event tracer for local area networks.</P>

      <SubHeading id="supported-drivers">Supported Drivers</SubHeading>
      <P>ETHLOAD supports the following datalink driver specifications for Ethernet and Token Ring:</P>
      <TableBlock headers={["Driver", "Notes"]} rows={[
        ["Digital Equipment DLL", "DLL.EXE or DLLDEPCA.EXE"],
        ["Microsoft / 3Com NDIS", "Network Driver Interface Specification"],
        ["Packet Driver", "PC/TCP, Clarkson, or Crynwr collection"],
        ["Novell ODI", "Open Datalink Interface (promiscuous mode required)"],
        ["ASCII File", "Reads captured Ethernet frames from file"],
        ["Loopback", "For debugging and testing purposes"],
      ]} />

      <SubHeading id="capabilities">Core Capabilities</SubHeading>
      <P>At the base Ethernet level, ETHLOAD lets you monitor frame rates, bandwidth usage, error rates, inter-frame gaps, and identify the busiest transmitters and receivers on the wire. Beyond that, it decodes and traces events for every major protocol stack of the era:</P>
      <div style={{ display: "grid", gridTemplateColumns: twoCol, gap: 12, margin: "16px 0" }}>
        {[
          { name: "TCP/IP", items: "ARP table, IP/UDP/TCP stats, DNS, BOOTP/TFTP, Telnet monitoring, ICMP, fragmentation, NetBIOS" },
          { name: "DECnet", items: "Top transmitters/receivers, Connect Initiate packets, returned frames" },
          { name: "OSI", items: "NSAP tracking, TUBA events, ES-IS/IS-IS exchanges, transport layer connections" },
          { name: "NetWare / XNS", items: "Routers, IPX networks, advertised services, connection mapping" },
        ].map((p) => (
          <div key={p.name} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: "16px 18px", boxShadow: t.shadow }}>
            <div style={{ fontWeight: 600, color: t.accent, fontSize: 15, marginBottom: 6, fontFamily: FONT_UI }}>{p.name}</div>
            <div style={{ color: t.textMuted, fontSize: 13, lineHeight: 1.6, fontFamily: FONT_BODY }}>{p.items}</div>
          </div>
        ))}
      </div>

      {/* ABOUT */}
      <SectionHeading id="misc">About &amp; Credits</SectionHeading>
      <SubHeading id="copyright">Copyright &amp; Origins</SubHeading>
      <P>ETHLOAD originated at Network Research Belgium (NRB), developed by a team called BERT. The original software was released free and in the public domain thanks to NRB's management. The current version (1.04) represents ongoing development by Eric Vyncke, done independently after working hours.</P>
      <InfoBox title="Original BERT Team" variant="info">Eric Vyncke · Frederic Blondiau · Michel Ghys (later at Cisco) · Marie-Christine Timmermans · Jean Hotterbeex (later at Cisco) · Manu Khronis · Vincent Keunen</InfoBox>

      <SubHeading id="support">Getting Support</SubHeading>
      <P>The primary support channel is the UseNet newsgroup <Code>comp.protocols.tcp-ip.ibmpc</Code>. The author monitors this group daily along with <Code>comp.sys.novell</Code> and the BITNET Novell/PATHWORKS mailing list.</P>
      <InfoBox variant="tip" title="The Postcard Request">If you're happy with ETHLOAD, Eric's little son Pierre would appreciate receiving a postcard! Send to: Eric Vyncke, Rue Nolden 25, B-4432 Alleur, Belgium.</InfoBox>

      <SubHeading id="distribution">Distribution</SubHeading>
      <P>ETHLOAD is distributed as <Code>ETHLDvrr.ZIP</Code> from the Simtel repository (oak.oakland.edu) in <Code>/pub/msdos/lan</Code> and from <Code>ub4b.eunet.be:/pub/ub4b/network/msdos</Code>. A companion utility called ETHDUMP is available as <Code>ETHDPvrr.ZIP</Code> from the same locations.</P>

      <SubHeading id="testers">Contributors &amp; Beta Testers</SubHeading>
      <TableBlock headers={["Name", "Email / Affiliation"]} rows={[
        ["Ralf Buettemeyer", "buettemeyer@hagenuk.netuse.de"],
        ["Michel Dalle", "michel@d92.cb.sni.be"],
        ["Niels Kr. Jensen", "msterlje@vm.uni-c.dk"],
        ["Hans-Joachim Koch", "koch@lifra.lif.de"],
        ["Hans-Michael Pronk", "hpronk@fac.fbk.eur.nl"],
        ["Joe Doupnik", "jrd@cc.usu.edu"],
        ["Russ Nelson", "nelson@crynwr.com"],
        ["A.A.L. Reijnierse", "Research PTT Netherlands"],
      ]} />

      <SubHeading id="changelog">Changelog</SubHeading>
      {[
        { v: "1.01", items: ["Packet driver, ODI and NDIS support", "TCP/IP protocol support", "Dictionary system for name resolution", "Ported from large model Borland C to small model Borland C++"] },
        { v: "1.02", items: ["Bug fix in DLL support", "Dropped packets percentage in MAC screen", "MAC flow screen", "SMTP, TFTP and BOOTP support", "Telnet/rlogin monitoring", "OSI support"] },
        { v: "1.03", items: ["Local stack for interrupt routines", "File driver added", "DNS and RFC NetBIOS support in TCP/IP", "NetBEUI and XNS/NetWare support", "NumLock toggle for numeric vs symbolic display", "Improved memory management"] },
        { v: "1.04", items: ["TUBA protocol support", "Better OSI support (active network layers)", "New options: -b, -f, -m, -o", "IEEE 802.5 Token Ring partial support", "TCP MSS option and IP options decoding", "ETHDUMP companion can record short frames"] },
      ].map((e) => (
        <div key={e.v} style={{ margin: "14px 0" }}>
          <div style={{ marginBottom: 8 }}><Badge tone="green">v{e.v}</Badge></div>
          <div style={{ paddingLeft: 12, borderLeft: `2px solid ${t.border}` }}>
            {e.items.map((it, i) => (
              <div key={i} style={{ color: t.textSecondary, fontSize: 14, lineHeight: 1.8, fontFamily: FONT_BODY }}>
                <span style={{ color: t.green, marginRight: 8 }}>+</span>{it}
              </div>
            ))}
          </div>
        </div>
      ))}

      <SubHeading id="licensing">Licensing</SubHeading>
      <P>All versions of ETHLOAD (1.01–1.04) are copyrighted by NRB and Eric Vyncke. These versions are free to use, copy, and distribute as long as no money is earned from it (media/transmission costs excepted). This right is granted for an unlimited period of time.</P>
      <InfoBox variant="warn" title="Version 2.0 Plans">The planned v2.0 would transition to shareware ($199 / ECU 199 registration) with added features: print-outs, Excel-compatible load export, larger buffers, configurable table sizes, and dedicated email support.</InfoBox>

      <SubHeading id="security">Security Considerations</SubHeading>
      <P>ETHLOAD is designed to never be a major security leak. It may disclose MAC/IP addresses and usernames visible on the LAN. For monitoring Telnet/rlogin sessions or DECnet connect-initiate contents, a special software key is required, linked to the Ethernet ROM address of your PC. Authorization requires an official paper letter from a high-level manager.</P>

      {/* CONFIG */}
      <SectionHeading id="config">Configuration Files</SectionHeading>
      <P>ETHLOAD can run in basic mode without any configuration files. Configuration files are only needed for translating addresses into human-readable names. All files use the same format: plain ASCII with key-value pairs, where lines beginning with <Code>;</Code> or <Code>#</Code> are comments.</P>
      <InfoBox variant="tip" title="File Location">All config files must be in the current directory or in the path specified by the <Code>ETHLOAD</Code> MS-DOS environment variable. Suppress loading messages with the <Code>-q</Code> option.</InfoBox>

      <SubHeading id="ethers">ETHERS</SubHeading>
      <P>Maps MAC Ethernet addresses to host names. Format: <Code>HH-HH-HH-HH-HH-HH  hostname</Code></P>
      <Code block>{`AB-00-03-00-00-00     DEC: Local Area Transport -LAT-
FF-FF-FF-FF-FF-FF     Broadcast
CF-00-00-01-00-00     Loopback Assistance
00-00-00-00-00-00     Null Address`}</Code>
      <InfoBox variant="info">ETHLOAD automatically resolves DECnet addresses and listens for ARP requests/replies to map IP addresses. Add custom MAC addresses only if not using DECnet or TCP/IP — and always append them at the end of the file.</InfoBox>

      <SubHeading id="hosts">HOSTS</SubHeading>
      <P>Maps IP addresses to host names. Format: <Code>ddd.ddd.ddd.ddd  hostname</Code></P>
      <Code block>{`139.21.20.18    d012s509.mch.sni.de d012s509
139.21.24.1     cisco.ap.mch.sni.de
139.24.16.44    baumann`}</Code>
      <P>Best initialized by copying <Code>/etc/hosts</Code> from a UNIX machine or using <Code>ypcat hosts.byaddr</Code> with NIS.</P>

      <SubHeading id="networks">NETWORKS</SubHeading>
      <P>Maps IP network addresses to network names, used when no host entry is found.</P>
      <Code block>{`150.144.0.0    UCCLE
150.148.0.0    CSL`}</Code>

      <SubHeading id="protocol">PROTOCOL</SubHeading>
      <P>Maps IP protocol numbers (0–255) to protocol names. Copy from <Code>/etc/protocols</Code> on UNIX.</P>
      <Code block>{`0       ip
1       icmp
3       ggp, gateway-gateway protocol
6       tcp
8       egp, exterior gateway protocol
17      udp
22      xns-idp`}</Code>

      <SubHeading id="saps">SAPS</SubHeading>
      <P>Maps IEEE 802.2 LLC Service Access Points to names. Two hex digit key.</P>
      <Code block>{`80     3Com XNS
8E     Proway-LAN
AA     TCP/IP SNAP (Ethernet type in LLC)
BC     Banyan VINES
E0     Novell NetWare
F0     IBM NetBIOS`}</Code>

      <SubHeading id="wks">WKS.TCP &amp; WKS.UDP</SubHeading>
      <P>Maps well-known TCP/UDP service port numbers (0–65535) to service names.</P>
      <Code block>{`# WKS.TCP
21      ftp
79      finger
101     hostnames
2156    informix
1524    ingreslock`}</Code>

      <SubHeading id="types">TYPES</SubHeading>
      <P>Maps DIX Ethernet packet types (4 hex digits) to names.</P>
      <Code block>{`0600     XNS
0601     XNS Address Translation
0800     DOD IP
0801     X.75 internet`}</Code>

      <SubHeading id="vendors">VENDORS</SubHeading>
      <P>Maps IEEE vendor codes (first 3 bytes of MAC address) to manufacturer names.</P>
      <Code block>{`00-00-0C     cisco
00-00-0F     NeXT
00-00-10     Sytek
00-00-1D     Cabletron`}</Code>

      <SubHeading id="osi-files">OSI Configuration Files</SubHeading>
      <P>ETHLOAD includes several specialized files for OSI protocol analysis:</P>
      <TableBlock headers={["File", "Purpose", "Key Format"]} rows={[
        ["OBJECTS.DNA", "DECnet object number to name mapping", "Decimal (1–255)"],
        ["NETWORKS.XNS", "XNS/IPX network numbers to names", "XX-XX-XX-XX"],
        ["TYPES.XNS", "XNS/IPX protocol types to names", "Two hex digits"],
        ["WKS.XNS", "XNS/IPX socket numbers to names", "XX-XX-XX-XX"],
        ["NLIDS.OSI", "OSI network PDU first byte mapping", "Two hex digits"],
        ["SELECTOR.OSI", "NSAP selector to name mapping", "Two hex digits"],
        ["NSAPS.OSI", "Full NSAP to name mapping", "HH-HH-...-HH (up to 20 bytes)"],
        ["AFI.OSI", "Authority & Format Identifier names", "Two hex digits"],
        ["ICD.OSI", "Internal Code Designator to org names", "HH-HH"],
        ["DCC.OSI", "Data Country Code to country names", "HH-HH"],
      ]} />

      {/* DRIVERS */}
      <SectionHeading id="drivers">Datalink Driver Setup</SectionHeading>
      <P>ETHLOAD automatically detects the best available driver in this order: Novell ODI → Microsoft NDIS v2.0.1+ → DEC DLL → Packet Driver → ASCII File Driver. Use the <Code>-d</Code> option to override this auto-detection.</P>
      <TableBlock headers={["Driver", "Concurrent Stacks", "Reboot Required", "Error Detail"]} rows={[
        ["ODI", "Yes", "No", "Full (source addr)"],
        ["NDIS v2.0+", "Yes", "After initial setup", "Partial"],
        ["DLL", "No (shuts down conns)", "After use", "Partial"],
        ["Packet Driver", "Disrupted efficiency", "No", "None"],
        ["File Driver", "N/A", "No", "N/A"],
      ]} />
      <InfoBox variant="tip" title="Recommendation">If your Ethernet hardware has an ODI driver with promiscuous mode support, ODI is the best choice. It provides concurrent operation with your protocol stack, no reboot requirement, and full error source identification.</InfoBox>

      <SubHeading id="odi">Novell ODI</SubHeading>
      <P>Only certain ODI drivers support promiscuous mode (required by ETHLOAD). Novell maintains a list since their LANanalyzer product also requires it. Load the ODI driver (preceded by LSL.COM) with a correct NET.CFG. Use <Code>-do2</Code> or <Code>-do3</Code> to select alternate frame types.</P>
      <InfoBox variant="warn">IPXODI and NETX cannot be loaded before ETHLOAD. Ensure NET.CFG allocates enough buffers and mempool.</InfoBox>

      <SubHeading id="ndis">Microsoft / 3Com NDIS</SubHeading>
      <P>For NDIS v2.0.1+, add the following to your <Code>PROTOCOL.INI</Code>:</P>
      <Code block>{`[ETHLOAD]
     drivername = ETHLOAD$
     bindings = MYMAC

[PROTOCOL MANAGER]
     devicename = PROTMAN$
     dynamic = YES
     bindstatus = YES
     priority = ETHLOAD`}</Code>
      <P>Replace <Code>MYMAC</Code> with your MAC module name from PROTOCOL.INI. Reboot after initial setup; subsequent use of ETHLOAD should not be disruptive to your protocol stacks.</P>

      <SubHeading id="dll">Digital Equipment DLL</SubHeading>
      <P>If DLL.EXE or DLLDEPCA.EXE is loaded, simply run ETHLOAD. Note that DLL requires shutting down ALL connections (LAT, DECnet, etc.) to enter promiscuous mode. You'll likely need to reboot after using ETHLOAD.</P>

      <SubHeading id="packet">Packet Driver</SubHeading>
      <P>Packet drivers exist for nearly all Ethernet adapters. Use a software interrupt between <Code>0x60</Code> and <Code>0x7F</Code>. ETHLOAD scans from <Code>0x60</Code> upward to find the first available driver.</P>
      <InfoBox variant="info">Crynwr Packet Driver Collection is available under GNU GPL from the Simtel repository. For 3Com 3C509, use version 11.* of the Crynwr driver.</InfoBox>

      <SubHeading id="file-driver">File Driver</SubHeading>
      <P>Reads Ethernet frames from an ASCII file. Default input is <Code>ETHLOAD.IN</Code> — compatible with ETHDUMP output format. Each frame record consists of a timestamp, length, and the hex-encoded frame data starting from the destination MAC address.</P>
      <Code block>{`; Example input file format:
0000000087  0060 000E20009127 0000E80109FC 0020 FF-FF-00-20-
01-00-00-00-00-03-00-0E-20-00-91-27-40-05-00-B0-BB-1E-00-00-
00-00-00-01`}</Code>

      {/* CLI */}
      <SectionHeading id="cli">Command Line Options</SectionHeading>
      <P>Options can be specified in UNIX format (<Code>-do1 -i65 -t</Code>) or MS-DOS format (<Code>/D:O1 /I:65 /T</Code>). Case-insensitive.</P>
      {[
        { id: "opt-d", flag: "-d", name: "Datalink Driver Selection", desc: "Force a specific datalink driver instead of auto-detection.", examples: [["-do / /D:O", "Use Novell ODI"], ["-do3 / /D:O3", "Use ODI MLID board 3"], ["-dn / /D:N", "Use NDIS (optionally specify MAC module)"], ["-dd / /D:D", "Use DEC DLL"], ["-dp / /D:P", "Use first packet driver (0x60–0x7F)"], ["-dphh / /D:PHH", "Use packet driver at interrupt 0xHH"], ["-dl / /D:L", "Use loopback driver"], ["-dfname / /D:Fname", "Use file driver with filename"]] },
        { id: "opt-p", flag: "-p", name: "Protocol Filter", desc: "Restrict which protocols are analyzed to save memory and CPU.", examples: [["-pd", "DECnet only"], ["-pi", "TCP/IP only"], ["-po", "OSI only"], ["-pt", "TUBA only"], ["-pn", "XNS/NetWare only"], ["-pl", "IEEE 802.2 LLC only"], ["-pb", "NetBEUI only"], ["-p3", "Analyze up to layer 3 only"]] },
      ].map((opt) => (
        <div key={opt.id}>
          <SubHeading id={opt.id}><Code>{opt.flag}</Code> — {opt.name}</SubHeading>
          <P>{opt.desc}</P>
          <TableBlock headers={["Option", "Effect"]} rows={opt.examples} />
        </div>
      ))}

      <SubHeading id="opt-t"><Code>-t</Code> — Real-time Frame Trace</SubHeading>
      <P>Displays the first bytes of every received frame on the bottom line of the display in real time.</P>
      <SubHeading id="opt-s"><Code>-s</Code> — Slow/Secure Mode</SubHeading>
      <P>Disables IRQ during frame analysis. Fewer dropped frames but may cause stability issues under heavy load. Use only if experiencing high packet loss in default (fast) mode. With the file driver, this makes ETHLOAD process frames as fast as possible, ignoring timestamps.</P>
      <SubHeading id="opt-i"><Code>-i</Code> — Measure Interval</SubHeading>
      <P>Sets the statistics measurement and screen refresh interval. Default: 5 seconds. Example: <Code>-i10</Code> for 10-second intervals.</P>
      <SubHeading id="opt-q"><Code>-q</Code> — Quiet Mode</SubHeading>
      <P>Skips the startup pause (normally waits for a keypress) and suppresses dictionary loading messages. Useful for batch files.</P>
      <SubHeading id="opt-r"><Code>-r</Code> — Recorder Mode</SubHeading>
      <P>Records all received frames to an ASCII file instead of analyzing them. Default output: <Code>ETHLOAD.OUT</Code>. Specify a custom filename directly after <Code>-r</Code>. Compatible with the file driver input format.</P>
      <SubHeading id="opt-b"><Code>-b</Code> — LAN Bandwidth</SubHeading>
      <P>Specifies LAN bandwidth in bits/sec for load calculations. Defaults to 10 Mbps (Ethernet). Required for non-standard networks.</P>
      <Code block>{`-b1000000      # Starlan 1 Mbps
-b1.0E+6       # Same, scientific notation`}</Code>
      <SubHeading id="opt-o"><Code>-o</Code> — Promiscuous Override</SubHeading>
      <P>Allows ETHLOAD to start even when the adapter doesn't support promiscuous mode. Only broadcast/multicast traffic will be analyzed — expect very light apparent load.</P>
      <SubHeading id="opt-f"><Code>-f</Code> — Filter</SubHeading>
      <P>Restricts analysis to specific frame types:</P>
      <TableBlock headers={["Filter", "Example"]} rows={[
        ["By LLC SAP (2 hex digits)", "-fAA  (TCP/IP SNAP)"],
        ["By Ethernet type (4 hex digits)", "-f0800  (DOD IP)"],
        ["By MAC address (6 bytes)", "-f00-00-0C-01-02-03"],
      ]} />
      <SubHeading id="opt-m"><Code>-m</Code> — Memory Buffers</SubHeading>
      <P>Sets the number of receive buffers (1–5, default: 1). More buffers reduce dropped frames but may cause out-of-order analysis. Increase until "buffer misses" reaches zero. Not used with ODI when a protocol stack is active.</P>

      {/* SCREENS */}
      <SectionHeading id="screens">Display &amp; Screens</SectionHeading>
      <SubHeading id="screen-layout">Screen Layout</SubHeading>
      <P>All ETHLOAD screens share a consistent layout:</P>
      <div style={{
        background: t.diagramBg, border: `1px solid ${t.border}`, borderRadius: 10,
        padding: "16px 20px", fontFamily: FONT_MONO, fontSize: 11.5, margin: "12px 0",
        lineHeight: 1.9, overflowX: "auto",
      }}>
        <div style={{ color: t.blue }}>+-- Top Line --------------------------------- [P] [+/-] +</div>
        <div style={{ color: t.green }}>| Copyright . Version . Dropped %   Proc|Recv          |</div>
        <div style={{ color: t.accent }}>+-- Command Bar ----------------------------------------+</div>
        <div style={{ color: t.textSecondary }}>| Available commands for this screen                   |</div>
        <div style={{ color: t.textMuted }}>+-- Main Content Area ---------------------------------+</div>
        <div style={{ color: t.textMuted }}>|  Statistics, tables, events, VU-meters ...           |</div>
        <div style={{ color: t.red }}>+-- Bottom Line (if -t) -------------------------------+</div>
        <div style={{ color: t.red }}>| Hex dump: DST(6) SRC(6) TYPE(2) DATA...              |</div>
        <div style={{ color: t.blue }}>+------------------------------------------------------+</div>
      </div>
      <P>Screens auto-refresh every measure interval (default: 5 sec). Press <Code>SPACE</Code> for manual refresh. On Token Ring, ring status appears in red during beaconing or purge events.</P>

      <SubHeading id="commands">Universal Commands</SubHeading>
      <TableBlock headers={["Key", "Action"]} rows={[
        ["Z or 0", "Reset all statistics and clear all tables"],
        ["X or ESC", "Return to previous menu"],
        ["PgUp / F8", "Scroll table up"],
        ["PgDn / F7", "Scroll table down"],
        ["Home", "Jump to first page"],
        ["End", "Jump to last page"],
        ["NumLock", "Toggle numeric / symbolic address display"],
        ["%", "Cycle percentage display mode"],
        ["SPACE", "Force screen refresh"],
      ]} />

      <SubHeading id="data-display">Data Display Modes</SubHeading>
      <P>ETHLOAD uses three primary display patterns throughout its screens:</P>
      <div style={{ display: "grid", gap: 12, margin: "12px 0" }}>
        {[
          { name: "Top Sorted Table", desc: "Entries ranked by frequency. Each line shows a percentage, the node identifier, and a visual bar graph (2.5% resolution). The percentage can be relative to: frames in current screen, total frames analyzed, or estimated bandwidth usage." },
          { name: "Raw Table", desc: "Unsorted internal table displayed directly — for example, the ARP cache showing MAC / IP address mappings." },
          { name: "Event History", desc: "Chronological log of events. Each line shows a timestamp (hh:mm:ss.hh) followed by the event description." },
        ].map((m) => (
          <div key={m.name} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: "14px 18px", boxShadow: t.shadow }}>
            <div style={{ fontWeight: 600, color: t.blue, fontSize: 14, marginBottom: 4, fontFamily: FONT_UI }}>{m.name}</div>
            <div style={{ color: t.textMuted, fontSize: 13, lineHeight: 1.65, fontFamily: FONT_BODY }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <SubHeading id="accuracy">Accuracy Notes</SubHeading>
      <InfoBox variant="warn" title="Measurement Limitations">Frame drops from slow controllers or inefficient drivers will undercount load. The MS-DOS timer has ~50ms resolution and may miss ticks under heavy CPU load. ETHLOAD provides reliable figures on a medium-loaded Ethernet (~10%) with a 386DX-25MHz or better CPU. 32-bit counters cap at ~4x10^9 frames — tables freeze and display overflow time in red.</InfoBox>

      <SubHeading id="mac-screen">MAC Level Screen</SubHeading>
      <P><Strong>Statistics Summary:</Strong> Three time windows — last interval, busiest interval, and cumulative. For each: total frames (with mean interframe gap), total data bytes (with load percentage), and error count (with rate/second and breakdown: CRC, too-long, too-short).</P>
      <P><Strong>VU-meter:</Strong> Visual load gauge graduated in Mbps. The <Code>{">"}</Code> marker shows peak load; the bar shows current load. Color-coded: green under 1 Mbps, yellow under 5 Mbps, red above 5 Mbps.</P>
      <P>MAC commands: <Code>Q</Code> to quit ETHLOAD (with confirmation), <Code>P</Code> to enter Protocol screen, <Code>E</Code> to view error source addresses (ODI only).</P>

      <SubHeading id="tcpip-screens">TCP/IP Screens</SubHeading>
      <P>The TCP/IP sub-menus provide deep protocol visibility:</P>
      <TableBlock headers={["Screen", "Shows"]} rows={[
        ["ARP Cache", "IP / MAC mapping (detects duplicate IPs, proxy-ARP routers)"],
        ["ARP History", "Timestamped ARP requests (?) and replies (!)"],
        ["ARP Senders", "Top hosts issuing ARP requests (detects cache thrashing)"],
        ["ARP Targets", "Most-requested IPs (flags unresolved as possible misconfig)"],
        ["IP Fragments", "Hosts sending fragmented datagrams + fragment sizes"],
        ["IP Host Info", "MTU, missing/repeated datagrams, min/max TTL per host"],
        ["ICMP", "Recent ICMP messages and top senders"],
        ["Protocols", "Top used protocols: TCP, UDP, etc."],
        ["TCP Events", "Connection requests, terminations, per-service stats"],
        ["TCP Services", "Most-used ports, SMTP/POP events, Telnet monitoring"],
        ["UDP", "Associations, top services, BOOTP/TFTP events"],
      ]} />

      <SubHeading id="decnet-screens">DECnet Screens</SubHeading>
      <P>Shows Connect Initiate history (with object numbers), Disconnect Initiate events, returned frames from routers (unreachable end-nodes), and top DECnet transmitters/receivers. Note: DECnet layer stats differ from MAC stats — routers dominate at MAC level but may be invisible at the DECnet level, revealing actual remote node traffic.</P>

      <SubHeading id="osi-screens">OSI Screens</SubHeading>
      <P>Displays active and inactive network layer hosts, ES-IS/IS-IS information exchange, and transport layer events (connect/disconnect/error). NSAP addresses shown in hex; TSAP shown in hex, ASCII, and EBCDIC.</P>

      <SubHeading id="screen-summary">Screen Navigation Summary</SubHeading>
      <TableBlock headers={["Keystroke", "Screen", "Description"]} rows={[
        ["(M)ac", "MAC Statistics", "Frame counts, load, VU-meter"],
        ["(E)rror", "MAC Errors", "Top faulty transmitters (ODI only)"],
        ["(F)low", "Traffic Matrix", "Source to destination pairs"],
        ["(L)ength", "Frame Length", "Length distribution histogram"],
        ["(R)eceiver", "MAC Receivers", "Top destination addresses"],
        ["(T)xr", "MAC Transmitters", "Top source addresses"],
        ["(P) > (I)P", "TCP/IP Suite", "All IP, ARP, TCP, UDP screens"],
        ["(P) > (D)ecnet", "DECnet Suite", "Connect/disconnect, top nodes"],
        ["(P) > (O)SI", "OSI Suite", "NSAP, transport events"],
        ["(P) > (N)ovell", "XNS/NetWare", "Routers, services, connections"],
        ["(P) > (T)ype/SAP", "Protocol Types", "LLC SAP and Ethernet types"],
      ]} />

      {/* ANNEXES */}
      <SectionHeading id="annexes">Annexes</SectionHeading>
      <SubHeading id="references">Data Link Layer References</SubHeading>
      <div style={{ paddingLeft: 12, borderLeft: `2px solid ${t.border}`, margin: "12px 0" }}>
        {[
          "Digital Equipment, 'PCSA Data Link Programmer's Reference Manual', April 1989, EK-PCDLL-PR-001",
          "FTP Software, 'PC/TCP Packet Driver Specification', Rev 1.09, September 1989",
          "3Com/Microsoft, 'LAN Manager Network Driver Interface Specification', Version 2.0.1, October 1990",
          "Novell, 'Open Data-Link Interface Developer's Guide for DOS Workstation Protocol Stacks', Version 1.10, March 1992",
        ].map((r, i) => (
          <P key={i}><span style={{ color: t.blue }}>[{i + 1}]</span> {r}</P>
        ))}
      </div>

      <SubHeading id="tested">Tested Datalink Configurations</SubHeading>
      <TableBlock headers={["Hardware / Driver", "Type"]} rows={[
        ["Protocol Manager 2.01 + Cogent LP486E", "NDIS"],
        ["SMC 8003 + 8003PKDR V2.03", "Packet"],
        ["SMC 8003 + SMC8000 V3.03 + LSL 1.0", "ODI"],
        ["EXOS205 V10.1.2", "Packet"],
        ["NE2000 Crynwr", "Packet"],
        ["XIRCOM Ethernet II + DLL 3.0.5", "DLL"],
        ["DEPCA / DE202 / DE100 + DLLDEPCA v4.1", "DLL"],
        ["3Com 503 Crynwr v4.1", "Packet"],
        ["Madge Smart AT Ringnode + MADGEODI 1.28", "ODI (Token Ring)"],
      ]} />

      <SubHeading id="decnet-names">Adding DECnet Node Names</SubHeading>
      <P>The MKNODE utility converts DECnet addresses (area.node format) into Ethernet MAC addresses for the ETHERS file. It reads from stdin and writes to stdout:</P>
      <Code block>{`# Create NODES file on VMS:
$ NCP SHOW KNOWN NODES TO nodes

# Convert and append on MS-DOS:
MKNODE < NODES >> ETHERS

# Input format:       Output in ETHERS:
1.1    RM         ->  AA-00-04-00-01-04   RM
1.76   MDCPC      ->  AA-00-04-00-4C-04   MDCPC
2.3    DSRV03     ->  AA-00-04-00-03-08   DSRV03`}</Code>

      <SubHeading id="pitfalls">Common Pitfalls</SubHeading>
      <div style={{ display: "grid", gap: 10, margin: "12px 0" }}>
        {[
          { from: "Drew Letcher", issue: "ETHLOAD always fails if CONFIG.SYS contains STACKS=0,0. ETHLOAD is memory-hungry during interrupt processing.", fix: "Set at least STACKS=9,512" },
          { from: "Klaus Troja", issue: "Running with ODI requires proper NET.CFG configuration and specific load order.", fix: 'Add "Link Support / Buffer 4 1600 / MemPool 4096" to NET.CFG. Load ETHLOAD before IPXODI and NETX.' },
          { from: "Wey Jing Ho", issue: "Some datalink drivers fail when loaded into high memory.", fix: "Load in conventional memory (don't use LH command in MS-DOS 5.0)." },
          { from: "General", issue: "NDIS driver uses much more memory than other drivers.", fix: "Use -p option to restrict analyzed protocols." },
          { from: "General", issue: "On heavily loaded networks, CPU may be insufficient for full analysis.", fix: "Use -p2 to analyze only MAC layer." },
        ].map((p, i) => (
          <InfoBox key={i} variant="danger" title={`Reported by: ${p.from}`}>
            <Strong>Problem:</Strong> {p.issue}<br /><Strong>Solution:</Strong> {p.fix}
          </InfoBox>
        ))}
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: 64, paddingTop: 24, borderTop: `1px solid ${t.border}`, color: t.textMuted, fontSize: 13, textAlign: "center", lineHeight: 1.8, fontFamily: FONT_UI }}>
        <div>ETHLOAD v1.04 User's Guide · © NRB &amp; Eric Vyncke, 1994</div>
        <div style={{ marginTop: 4 }}>Modernized documentation redesign · All original content preserved</div>
      </div>
    </div>
  );
}

/* ─── SEGMENTED TOGGLE ─── */
function SegToggle({ options, value, onChange }) {
  const { t } = useT();
  return (
    <div style={{ display: "inline-flex", background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 9, padding: 2 }}>
      {options.map((o) => {
        const active = value === o.key;
        return (
          <button key={o.key} onClick={() => onChange(o.key)} title={o.label} aria-label={o.label}
            style={{
              display: "flex", alignItems: "center", gap: 6, border: "none", cursor: "pointer",
              background: active ? t.surface : "transparent", color: active ? t.accent : t.textMuted,
              padding: "6px 10px", borderRadius: 7, fontSize: 12.5, fontWeight: 500, fontFamily: FONT_UI,
              boxShadow: active ? t.shadow : "none", transition: "all 0.15s",
            }}>
            {o.node}
          </button>
        );
      })}
    </div>
  );
}

/* ─── TOP BAR ─── */
function TopBar({ onMenu, sectionTitle }) {
  const { t, view, setView, mode, setMode } = useT();
  const mobile = view === "mobile";
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 50, background: t.bg + "e8",
      backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
      borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center",
      gap: 12, padding: mobile ? "10px 16px" : "12px 40px", minHeight: 56,
    }}>
      {mobile && (
        <button onClick={onMenu} aria-label="Open menu" style={{ background: "none", border: "none", color: t.text, cursor: "pointer", padding: 4, display: "flex" }}>
          <Ic.menu />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: t.textMuted, fontSize: 13, fontFamily: FONT_UI, fontWeight: 500 }}>
        {mobile ? "ETHLOAD Guide" : sectionTitle}
      </div>
      <SegToggle
        value={mode} onChange={setMode}
        options={[
          { key: "light", label: "Day theme", node: <Ic.sun /> },
          { key: "dark", label: "Night theme", node: <Ic.moon /> },
        ]}
      />
      <SegToggle
        value={view} onChange={setView}
        options={[
          { key: "desktop", label: "Desktop layout", node: <Ic.desktop /> },
          { key: "mobile", label: "Mobile layout", node: <Ic.mobile /> },
        ]}
      />
    </div>
  );
}

/* ─── SIDEBAR ─── */
function Sidebar({ activeSection, onNavigate, collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const { t, view } = useT();
  const [expanded, setExpanded] = useState({ intro: true });
  const mobile = view === "mobile";
  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const NavList = () => (
    <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
      {SECTIONS.map((s) => {
        const isOpen = expanded[s.id];
        const isActive = activeSection === s.id;
        return (
          <div key={s.id}>
            <button onClick={() => { onNavigate(s.id); if (s.subsections.length) toggle(s.id); if (mobile) onCloseMobile(); }}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 18px",
                border: "none", background: isActive ? t.hover : "transparent",
                color: isActive ? t.accent : t.textSecondary, cursor: "pointer", fontSize: 14,
                fontWeight: isActive ? 600 : 400, textAlign: "left", fontFamily: FONT_UI,
                borderLeft: isActive ? `2px solid ${t.accent}` : "2px solid transparent",
              }}>
              <span style={{ fontSize: 15, width: 22, textAlign: "center" }}>{s.icon}</span>
              <span style={{ flex: 1 }}>{s.title}</span>
              {s.subsections.length > 0 && <span style={{ fontSize: 10, opacity: 0.5 }}>{isOpen ? "\u25be" : "\u25b8"}</span>}
            </button>
            {isOpen && s.subsections.map((sub) => (
              <button key={sub.id} onClick={() => { onNavigate(sub.id); if (mobile) onCloseMobile(); }}
                style={{
                  display: "block", width: "100%", padding: "7px 18px 7px 50px", border: "none",
                  background: activeSection === sub.id ? t.hover + "aa" : "transparent",
                  color: activeSection === sub.id ? t.blue : t.textMuted, cursor: "pointer",
                  fontSize: 13, textAlign: "left", fontFamily: FONT_UI,
                }}>{sub.title}</button>
            ))}
          </div>
        );
      })}
    </nav>
  );

  const Brand = ({ showClose }) => (
    <div style={{ padding: "20px 18px 12px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 18, color: t.text, letterSpacing: -0.5, fontFamily: FONT_MONO }}>ETHLOAD</div>
        <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2, fontFamily: FONT_UI }}>User's Guide v1.04</div>
      </div>
      {showClose ? (
        <button onClick={onCloseMobile} aria-label="Close menu" style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.textSecondary, cursor: "pointer", borderRadius: 7, padding: "5px 7px", display: "flex" }}><Ic.close /></button>
      ) : (
        <button onClick={onToggleCollapse} aria-label="Collapse sidebar" style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.textSecondary, cursor: "pointer", borderRadius: 7, padding: "4px 8px", fontSize: 14, fontFamily: FONT_UI }}>&#10005;</button>
      )}
    </div>
  );

  if (mobile) {
    return (
      <>
        {mobileOpen && (
          <div onClick={onCloseMobile} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 90 }} />
        )}
        <div style={{
          position: "fixed", top: 0, bottom: 0, left: 0, width: 280, background: t.sidebar,
          borderRight: `1px solid ${t.border}`, zIndex: 95, display: "flex", flexDirection: "column",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease", boxShadow: mobileOpen ? "4px 0 24px rgba(0,0,0,0.25)" : "none",
        }}>
          <Brand showClose />
          <NavList />
        </div>
      </>
    );
  }

  if (collapsed) {
    return (
      <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 52, background: t.sidebar, borderRight: `1px solid ${t.border}`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 16, zIndex: 40 }}>
        <button onClick={onToggleCollapse} aria-label="Expand sidebar" style={{ background: "none", border: "none", color: t.textSecondary, cursor: "pointer", padding: 8, marginBottom: 16, display: "flex" }}><Ic.menu /></button>
        {SECTIONS.map((s) => (
          <button key={s.id} onClick={() => onNavigate(s.id)} title={s.title}
            style={{ background: activeSection === s.id ? t.hover : "none", border: "none", color: activeSection === s.id ? t.accent : t.textMuted, cursor: "pointer", fontSize: 16, padding: "9px 0", width: "100%", textAlign: "center" }}>{s.icon}</button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 260, background: t.sidebar, borderRight: `1px solid ${t.border}`, overflowY: "auto", zIndex: 40, display: "flex", flexDirection: "column" }}>
      <Brand />
      <NavList />
    </div>
  );
}

/* ─── APP ─── */
export default function EthloadGuide() {
  const [mode, setMode] = useState("dark");
  const [view, setView] = useState("desktop");
  const [activeSection, setActiveSection] = useState("intro");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTitle, setActiveTitle] = useState("Introduction");
  const didInit = useRef(false);

  const t = THEMES[mode];

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    if (typeof window !== "undefined" && window.innerWidth < 768) setView("mobile");
  }, []);

  const navigate = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const allIds = SECTIONS.flatMap((s) => [s.id, ...s.subsections.map((x) => x.id)]);
      let current = allIds[0];
      for (const id of allIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 90) current = id;
      }
      setActiveSection(current);
      const parent = SECTIONS.find((s) => s.id === current || s.subsections.some((x) => x.id === current));
      if (parent) setActiveTitle(parent.title);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mobile = view === "mobile";
  const mainMargin = mobile ? 0 : collapsed ? 52 : 260;

  return (
    <ThemeCtx.Provider value={{ t, mode, setMode, view, setView }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ background: t.bg, minHeight: "100vh", color: t.text, transition: "background 0.25s, color 0.25s" }}>
        <Sidebar
          activeSection={activeSection}
          onNavigate={navigate}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <div style={{ marginLeft: mainMargin, transition: "margin-left 0.2s ease" }}>
          <TopBar onMenu={() => setMobileOpen(true)} sectionTitle={activeTitle} />
          <main style={{ maxWidth: mobile ? 680 : 860, padding: mobile ? "24px 18px 80px" : "28px 40px 80px", margin: "0 auto" }}>
            <ContentArea />
          </main>
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}
