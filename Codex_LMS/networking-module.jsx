import { useState, useEffect, createContext, useContext } from "react";

/* ══════════════════════════════════════════════════
   NETWORKING & CISCO — Phase 5
   Same shell as prior modules — single accent, Claude palette,
   Study/Reference modes, Topic Map, Spaced Review, DeepDives
   ══════════════════════════════════════════════════ */

const THEMES = {
  dark: {
    bg: "#141413", panel: "#0f0e0d", surface: "#1e1d1a", surfaceAlt: "#26241f",
    border: "#2b2a26", borderStrong: "#3a3833",
    text: "#faf9f5", textSecondary: "#c9c6bb", textMuted: "#8f8d83",
    accent: "#dd8060", accentSoft: "#dd806022",
    blue: "#7fa9d4", blueSoft: "#7fa9d422",
    green: "#8ba173", greenSoft: "#8ba17322",
    red: "#d9776a", redSoft: "#d9776a22",
    purple: "#b99ad4", purpleSoft: "#b99ad422",
    codeBg: "#0f0e0d", inlineBg: "#26241f",
    shadow: "none", glow: "radial-gradient(circle, #dd806015 0%, transparent 70%)",
  },
  light: {
    bg: "#faf9f5", panel: "#f4f2ea", surface: "#ffffff", surfaceAlt: "#f2f0e8",
    border: "#e8e6dc", borderStrong: "#dcd9cc",
    text: "#141413", textSecondary: "#57554d", textMuted: "#8a887e",
    accent: "#c05f3c", accentSoft: "#c05f3c14",
    blue: "#4a7db0", blueSoft: "#4a7db014",
    green: "#5f7345", greenSoft: "#5f734514",
    red: "#b23a2b", redSoft: "#b23a2b12",
    purple: "#7c5da8", purpleSoft: "#7c5da814",
    codeBg: "#f5f3ec", inlineBg: "#eeece3",
    shadow: "0 1px 3px rgba(20,20,19,0.06), 0 1px 2px rgba(20,20,19,0.04)",
    glow: "radial-gradient(circle, #d9775718 0%, transparent 70%)",
  },
};
const F_UI = "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const F_BODY = "'Lora', Georgia, serif";
const F_MONO = "'JetBrains Mono', 'Fira Code', monospace";
const Ctx = createContext(null);
const useT = () => useContext(Ctx);

const I = {
  sun: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>,
  moon: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" /></svg>,
  desktop: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
  mobile: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></svg>,
  back: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 18l-6-6 6-6" /></svg>,
  next: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 18l6-6-6-6" /></svg>,
  check: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6L9 17l-5-5" /></svg>,
};

/* ══════════════════════ PRIMITIVES ══════════════════════ */
function Code({ children, block }) {
  const { t } = useT();
  if (block) return <pre style={{ background: t.codeBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: "18px 20px", fontFamily: F_MONO, fontSize: 12.5, lineHeight: 1.75, color: t.green, overflowX: "auto", margin: "20px 0" }}>{children}</pre>;
  return <code style={{ background: t.inlineBg, padding: "2.5px 8px", borderRadius: 6, fontFamily: F_MONO, fontSize: 12.5, color: t.blue }}>{children}</code>;
}
function P({ children }) { const { t } = useT(); return <p style={{ color: t.textSecondary, fontSize: 15.5, lineHeight: 1.85, margin: "14px 0", fontFamily: F_BODY }}>{children}</p>; }
function Strong({ children }) { const { t } = useT(); return <strong style={{ color: t.text, fontWeight: 600 }}>{children}</strong>; }
function H3({ children }) { const { t } = useT(); return <h3 style={{ fontSize: 19, fontWeight: 600, color: t.text, margin: "36px 0 12px", fontFamily: F_UI }}>{children}</h3>; }
function Callout({ title, children, tone = "blue", icon = "\u2139\ufe0f" }) {
  const { t } = useT(); const c = t[tone] || t.blue;
  return <div style={{ background: c + "14", border: `1px solid ${c}33`, borderLeft: `3px solid ${c}`, borderRadius: 12, padding: "18px 22px", margin: "22px 0" }}>
    {title && <div style={{ fontWeight: 600, color: c, marginBottom: 7, fontSize: 13.5, fontFamily: F_UI }}>{icon} {title}</div>}
    <div style={{ color: t.textSecondary, fontSize: 14, lineHeight: 1.75, fontFamily: F_BODY }}>{children}</div>
  </div>;
}
function MemoryHook({ children }) {
  const { t } = useT();
  return <div style={{ background: `linear-gradient(135deg, ${t.purpleSoft}, transparent)`, border: `1px dashed ${t.purple}55`, borderRadius: 14, padding: "20px 22px", margin: "24px 0", display: "flex", gap: 14, alignItems: "flex-start" }}>
    <span style={{ fontSize: 20 }}>🧠</span>
    <div><div style={{ fontWeight: 600, color: t.purple, fontSize: 12.5, fontFamily: F_UI, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 }}>Memory Hook</div>
      <div style={{ color: t.textSecondary, fontSize: 14, fontFamily: F_BODY, lineHeight: 1.65, fontStyle: "italic" }}>{children}</div></div>
  </div>;
}
function DeepDive({ title, children }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, margin: "20px 0", overflow: "hidden", background: t.surface }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between", background: "none", border: 0, padding: "13px 18px", cursor: "pointer", textAlign: "left" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: F_UI, fontWeight: 600, fontSize: 13.5, color: t.text }}>
          <span>🔎</span> Go deeper: {title}
        </span>
        <span style={{ color: t.textMuted, fontSize: 11 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && <div style={{ padding: "2px 18px 18px", borderTop: `1px solid ${t.border}` }}><div style={{ paddingTop: 14 }}>{children}</div></div>}
    </div>
  );
}
function DataTable({ headers, rows }) {
  const { t } = useT();
  return <div style={{ overflowX: "auto", margin: "22px 0", borderRadius: 12, border: `1px solid ${t.border}` }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
      <thead><tr>{headers.map((h, i) => <th key={i} style={{ textAlign: "left", padding: "12px 16px", background: t.surfaceAlt, color: t.accent, borderBottom: `1px solid ${t.borderStrong}`, fontFamily: F_UI, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, ri) => <tr key={ri} style={{ background: ri % 2 ? t.surfaceAlt + "60" : t.surface }}>{r.map((c, ci) => <td key={ci} style={{ padding: "11px 16px", borderBottom: ri === rows.length - 1 ? "none" : `1px solid ${t.border}`, color: ci === 0 ? t.green : t.textSecondary, fontFamily: ci === 0 ? F_MONO : F_BODY }}>{c}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}
const backLinkStyle = (t) => ({ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: t.textMuted, cursor: "pointer", fontFamily: F_UI, fontSize: 13, marginBottom: 24, padding: 0 });
function ModeToggle({ mode, onChange }) {
  const { t } = useT();
  return (
    <div style={{ display: "inline-flex", background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 9, padding: 2, flexShrink: 0 }}>
      {["study", "reference"].map((m) => (
        <button key={m} onClick={() => onChange(m)} style={{ background: mode === m ? t.surface : "transparent", color: mode === m ? t.accent : t.textMuted, border: 0, borderRadius: 7, padding: "6px 13px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: F_UI, textTransform: "capitalize" }}>{m}</button>
      ))}
    </div>
  );
}

/* ══════════════════════ INTERACTIVE: SUBNET CALCULATOR ══════════════════════ */
function ipToInt(ip) {
  const parts = ip.split(".").map((n) => parseInt(n, 10) || 0);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}
function intToIp(n) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}
function SubnetCalculator() {
  const { t } = useT();
  const [ip, setIp] = useState("192.168.1.10");
  const [prefix, setPrefix] = useState(24);
  let result = null;
  try {
    const ipInt = ipToInt(ip);
    const maskInt = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    const network = (ipInt & maskInt) >>> 0;
    const broadcast = (network | (~maskInt >>> 0)) >>> 0;
    const hostCount = Math.max(0, 2 ** (32 - prefix) - 2);
    result = { mask: intToIp(maskInt), network: intToIp(network), broadcast: intToIp(broadcast), first: intToIp(network + 1), last: intToIp(broadcast - 1), hostCount };
  } catch (e) { result = null; }

  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: 26, margin: "24px 0" }}>
      <div style={{ fontFamily: F_MONO, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: t.accent, marginBottom: 18 }}>🎮 Interactive · Subnet Calculator</div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "2 1 180px" }}>
          <div style={{ fontFamily: F_MONO, fontSize: 10.5, color: t.textMuted, textTransform: "uppercase", marginBottom: 5 }}>IP Address</div>
          <input value={ip} onChange={(e) => setIp(e.target.value)} style={{ width: "100%", boxSizing: "border-box", background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 8, padding: "9px 12px", color: t.accent, fontFamily: F_MONO, fontSize: 15, fontWeight: 700, outline: "none" }} />
        </div>
        <div style={{ flex: "1 1 100px" }}>
          <div style={{ fontFamily: F_MONO, fontSize: 10.5, color: t.textMuted, textTransform: "uppercase", marginBottom: 5 }}>CIDR prefix /</div>
          <input type="number" min="0" max="32" value={prefix} onChange={(e) => setPrefix(Math.max(0, Math.min(32, +e.target.value)))} style={{ width: "100%", boxSizing: "border-box", background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 8, padding: "9px 12px", color: t.accent, fontFamily: F_MONO, fontSize: 15, fontWeight: 700, outline: "none" }} />
        </div>
      </div>
      {result && (
        <DataTable headers={["Field", "Value"]} rows={[
          ["Subnet mask", result.mask],
          ["Network address", result.network],
          ["Broadcast address", result.broadcast],
          ["Usable host range", `${result.first} – ${result.last}`],
          ["Usable hosts", result.hostCount.toLocaleString()],
        ]} />
      )}
    </div>
  );
}

/* ══════════════════════ DIAGRAM: OSI LAYER STACK ══════════════════════ */
function OSIStackDiagram() {
  const { t } = useT();
  const layers = [
    { n: 7, name: "Application", job: "What the software actually wants to do", c: t.accent },
    { n: 6, name: "Presentation", job: "Formatting, encoding, encryption", c: t.blue },
    { n: 5, name: "Session", job: "Managing an ongoing conversation", c: t.blue },
    { n: 4, name: "Transport", job: "Reliable or fast delivery", c: t.green },
    { n: 3, name: "Network", job: "Routing between different networks", c: t.green },
    { n: 2, name: "Data Link", job: "Moving data across one direct link", c: t.purple },
    { n: 1, name: "Physical", job: "The actual electrical/optical/radio signal", c: t.purple },
  ];
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 22, margin: "20px 0" }}>
      <div style={{ fontFamily: F_MONO, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: t.accent, marginBottom: 14 }}>📊 Diagram · The OSI Stack, Top to Bottom</div>
      {layers.map((l) => (
        <div key={l.n} style={{ display: "flex", alignItems: "center", gap: 12, background: l.c + "16", border: `1px solid ${l.c}44`, borderRadius: 9, padding: "10px 14px", marginBottom: l.n === 1 ? 0 : 5 }}>
          <span style={{ fontFamily: F_MONO, fontWeight: 700, color: l.c, width: 16 }}>{l.n}</span>
          <span style={{ fontFamily: F_UI, fontWeight: 600, fontSize: 13.5, color: t.text, flex: 1 }}>{l.name}</span>
          <span style={{ fontFamily: F_BODY, fontSize: 11.5, color: t.textMuted, fontStyle: "italic" }}>{l.job}</span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════ DIAGRAM: HTTP STATUS CODE GROUPS ══════════════════════ */
function HttpStatusDiagram() {
  const { t } = useT();
  const groups = [{ range: "2xx", label: "Success", c: t.green, ex: "200 OK" }, { range: "3xx", label: "Redirection", c: t.blue, ex: "301 Moved Permanently" }, { range: "4xx", label: "Client Error", c: t.accent, ex: "404 Not Found" }, { range: "5xx", label: "Server Error", c: t.red, ex: "500 Internal Server Error" }];
  return (
    <div style={{ display: "grid", gap: 8, margin: "18px 0" }}>
      {groups.map((g) => (
        <div key={g.range} style={{ display: "flex", alignItems: "center", gap: 14, background: g.c + "14", border: `1px solid ${g.c}44`, borderRadius: 10, padding: "11px 16px" }}>
          <span style={{ fontFamily: F_MONO, fontWeight: 800, fontSize: 17, color: g.c, width: 46 }}>{g.range}</span>
          <div>
            <div style={{ fontFamily: F_UI, fontWeight: 600, fontSize: 13.5, color: t.text }}>{g.label}</div>
            <div style={{ fontFamily: F_MONO, fontSize: 11.5, color: t.textMuted }}>{g.ex}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════ CONTENT MODEL ══════════════════════ */
const TOPICS = [
  {
    id: "osi",
    icon: "☰",
    title: "The OSI Model",
    blurb: "Seven layers describing every step data takes between one machine and another — the map for this entire phase.",
    chapters: [
      {
        title: "Why Layers At All",
        body: () => (<>
          <P>The OSI (Open Systems Interconnection) model breaks networking into seven distinct layers, each with one job, each unaware of how the layers above or below it actually work — precisely the same "hide the complexity below" idea from the Hardware phase's full-stack diagram, now applied to how machines talk to each other instead of how one machine runs.</P>
          <OSIStackDiagram />
          <MemoryHook>A classic mnemonic, top to bottom: "All People Seem To Need Data Processing." Bottom to top works just as well in reverse.</MemoryHook>
        </>),
      },
      {
        title: "Layers 1–3: Physical, Data Link, Network",
        body: () => (<>
          <P>The bottom three layers get data physically moving and correctly addressed. The <Strong>Physical</Strong> layer is the actual signal — voltage on copper, light on fiber, radio waves for WiFi, directly connecting back to the Hardware phase's radio waves chapter. The <Strong>Data Link</Strong> layer manages one direct hop between two devices on the same local network, using MAC addresses. The <Strong>Network</Strong> layer handles routing across multiple different networks, using IP addresses.</P>
        </>),
      },
      {
        title: "Layers 4–7: Transport, Session, Presentation, Application",
        body: () => (<>
          <P>The top four layers deal with the actual conversation, not just getting bits from one place to another. <Strong>Transport</Strong> decides whether delivery needs to be guaranteed and ordered (TCP) or fast with no such guarantee (UDP). <Strong>Session</Strong> manages an ongoing back-and-forth. <Strong>Presentation</Strong> handles formatting, like encryption or compression. <Strong>Application</Strong> is the actual protocol the software speaks — HTTP for the web, for instance.</P>
        </>),
      },
      {
        title: "Encapsulation: Wrapping Data as It Descends",
        body: () => (<>
          <P>As data moves down through the layers on the sending machine, each layer wraps the previous layer's data in its own header — called <Strong>encapsulation</Strong>. On the receiving machine, the exact reverse happens: each layer strips off its corresponding header as data moves back up.</P>
          <Code block>{`[ Application data ]
  → wrapped by Transport (adds port info)
    → wrapped by Network (adds IP addresses)
      → wrapped by Data Link (adds MAC addresses)
        → sent as Physical signal`}</Code>
        </>),
      },
      {
        title: "Where Real Protocols Live in the Model",
        body: () => (<>
          <P>Every protocol you'll actually work with maps onto a specific layer:</P>
          <DataTable headers={["Protocol", "Layer"]} rows={[["HTTP/HTTPS", "Application (7)"], ["TCP / UDP", "Transport (4)"], ["IP", "Network (3)"], ["Ethernet / WiFi", "Data Link (2)"]]} />
          <Callout title="Where this goes next" tone="green">Every remaining topic in this phase is really just zooming into one or two of these layers in detail — subnetting lives at Layer 3, ports and HTTP live at Layers 4 and 7, switching and VLANs live at Layer 2.</Callout>
        </>),
      },
    ],
    retrieval: { q: "What happens to data at each layer as it travels down the stack before being sent?", a: "Each layer wraps (encapsulates) the data from the layer above it in its own header" },
    recap: ["The OSI model has 7 layers, each hiding its complexity from the layers around it", "Layers 1-3 (Physical, Data Link, Network) get data physically moving and addressed", "Layers 4-7 (Transport, Session, Presentation, Application) manage the actual conversation", "Encapsulation wraps data in a new header at each layer going down; de-encapsulation reverses it going up", "Real protocols map to specific layers: HTTP=7, TCP/UDP=4, IP=3, Ethernet/WiFi=2"],
  },
  {
    id: "topologies",
    icon: "⌬",
    title: "Network Topologies",
    blurb: "The physical and logical shapes a network can take, and what happens to each one when a single point fails.",
    chapters: [
      {
        title: "Bus, Star, Ring: The Classics",
        body: () => (<>
          <P>A <Strong>bus</Strong> topology connects every device to one shared central cable — simple, but the whole network goes down if that cable fails. A <Strong>star</Strong> topology connects every device to one central hub or switch — the dominant topology in real offices and homes today. A <Strong>ring</Strong> topology connects each device to exactly two neighbors, forming a loop, with data passing around the ring until it reaches its destination.</P>
        </>),
      },
      {
        title: "Mesh: Redundancy at a Cost",
        body: () => (<>
          <P>A <Strong>mesh</Strong> topology connects many or all devices directly to each other, so there's no single point whose failure takes down the whole network — traffic simply reroutes around a failed link. The cost is real: far more cabling (or wireless links) and configuration complexity than a star topology needs.</P>
        </>),
      },
      {
        title: "Hybrid Topologies in the Real World",
        body: () => (<>
          <P>Almost no real network is a single pure topology. A typical office is a star at the desk level (devices connecting to a local switch), with those switches connected to each other in a partial mesh for redundancy, all feeding up eventually to a single router out to the internet — a <Strong>hybrid</Strong> topology combining the strengths of several patterns at different scales.</P>
        </>),
      },
      {
        title: "Topology and Failure: What Breaks When One Node Dies",
        body: () => (<>
          <P>Topology is fundamentally a conversation about failure. Ask "what happens to the rest of the network if this one point breaks?" for any topology and the design tradeoff becomes obvious: bus and ring both have a single point whose failure can affect everyone; star isolates a single device's failure but makes the central hub critical; mesh has no single point of failure at all, at the cost of complexity.</P>
          <MemoryHook>Every topology is a bet about which failure you're willing to accept in exchange for lower cost and simpler wiring.</MemoryHook>
        </>),
      },
      {
        title: "Choosing a Topology",
        body: () => (<>
          <P>In practice, the choice usually isn't really "which one" but "how much redundancy can we afford, and where does it matter most?" A small home network happily runs on a single star with a single point of failure, because the cost of an outage is low. A data center or ISP backbone invests heavily in mesh-like redundancy, because the cost of an outage is enormous.</P>
        </>),
      },
    ],
    retrieval: { q: "Which topology has no single point of failure, at the cost of far more connections needed?", a: "Mesh" },
    recap: ["Bus, star, and ring are the three classic topologies, each with a different single point of failure", "Mesh connects devices directly to each other, avoiding any single point of failure at the cost of complexity", "Real networks are almost always hybrids, combining topologies at different scales", "Every topology represents a deliberate tradeoff between cost/simplicity and resilience to failure", "The right choice depends on how expensive an outage would actually be"],
  },
  {
    id: "routing",
    icon: "➜",
    title: "Routing Fundamentals",
    blurb: "How a router decides where to send a packet next, and how it decides which of several sources of information to trust.",
    chapters: [
      {
        title: "What a Router Actually Does",
        body: () => (<>
          <P>A router's entire job, at its core, is deceptively simple: look at a packet's destination IP address, consult a <Strong>routing table</Strong>, and forward the packet toward the next hop that gets it closer to that destination — repeated at every router the packet passes through until it arrives.</P>
        </>),
      },
      {
        title: "Routing Tables",
        body: () => (<>
          <P>A routing table lists known destination networks and which direction (which next-hop router, or which outgoing interface) leads toward each one:</P>
          <DataTable headers={["Destination", "Next Hop"]} rows={[["10.0.1.0/24", "Directly connected"], ["10.0.2.0/24", "via 10.0.1.1"], ["0.0.0.0/0 (default)", "via 10.0.1.254"]]} />
          <P>The <Code>0.0.0.0/0</Code> entry is a <Strong>default route</Strong> — "if nothing more specific matches, send it here," almost always pointing toward the wider internet.</P>
        </>),
      },
      {
        title: "Administrative Distance: Trusting the Right Source",
        body: () => (<>
          <P>A router often learns about the same destination from multiple sources — a manually configured static route, and also a dynamic routing protocol discovering it automatically. <Strong>Administrative distance</Strong> is a trust ranking: lower numbers are more trusted, and when sources disagree, the router uses whichever has the lower administrative distance.</P>
          <DataTable headers={["Source", "Typical Admin Distance"]} rows={[["Directly connected", "0"], ["Static route", "1"], ["OSPF", "110"], ["RIP", "120"]]} />
        </>),
      },
      {
        title: "Static vs. Dynamic Routing",
        body: () => (<>
          <P><Strong>Static</Strong> routes are entered manually and never change unless someone edits them — predictable, but doesn't adapt if the network's shape changes. <Strong>Dynamic</Strong> routing protocols (like OSPF) have routers automatically discover and share paths with each other, adapting to failures or changes without human intervention, at the cost of added complexity.</P>
          <MemoryHook>Static routing is a hand-drawn map that never updates itself. Dynamic routing is a GPS that reroutes the moment a road closes.</MemoryHook>
        </>),
      },
      {
        title: "A Packet's Journey Across Routers",
        body: () => (<>
          <P>Tracing a full journey: a packet leaves your laptop destined for a server across the internet. Your home router checks its table, finds no specific match, and forwards it via the default route to your ISP. The ISP's router checks its own (much larger) table and forwards it further. This repeats, router by router, each one only needing to know "which direction is closer," not the entire path — until the packet finally arrives.</P>
          <Callout title="No router needs the whole map" tone="green">This is the elegant part: no single router anywhere needs to know the complete path from source to destination — only the next hop. That's precisely what makes an internet-scale network of millions of routers actually tractable.</Callout>
        </>),
      },
    ],
    retrieval: { q: "When two sources disagree about a route, which does the router trust?", a: "Whichever source has the lower administrative distance" },
    recap: ["A router forwards packets toward their destination using a routing table, one hop at a time", "A default route (0.0.0.0/0) catches anything not matched by a more specific entry", "Administrative distance ranks how much a router trusts different route sources when they conflict", "Static routes are manual and fixed; dynamic routing protocols adapt automatically to changes", "No single router needs the whole path — only the next hop — which is what makes internet-scale routing tractable"],
  },
  {
    id: "http-ports",
    icon: "⇄",
    title: "HTTP & Ports",
    blurb: "How a single IP address serves many different services at once, and the vocabulary of the web's core protocol.",
    chapters: [
      {
        title: "What a Port Actually Is",
        body: () => (<>
          <P>An IP address gets a packet to the right machine; a <Strong>port</Strong> gets it to the right <em>service</em> running on that machine. A single server can run a web server, an email server, and a database simultaneously, each listening on its own numbered port — 65,536 possible ports (0-65535) on any one IP address.</P>
        </>),
      },
      {
        title: "Well-Known Ports",
        body: () => (<>
          <P>Ports 0-1023 are reserved as "well-known," assigned to standard services by convention:</P>
          <DataTable headers={["Port", "Service"]} rows={[["20/21", "FTP"], ["22", "SSH"], ["25", "SMTP (email sending)"], ["53", "DNS"], ["80", "HTTP"], ["443", "HTTPS"]]} />
          <MemoryHook>80 for plain web traffic, 443 for encrypted — the two you'll see constantly, and the pair worth memorizing first if you memorize nothing else here.</MemoryHook>
        </>),
      },
      {
        title: "HTTP Methods",
        body: () => (<>
          <P>HTTP requests specify a <Strong>method</Strong> describing the intended action:</P>
          <DataTable headers={["Method", "Meaning"]} rows={[["GET", "Retrieve data, no side effects"], ["POST", "Submit new data (create something)"], ["PUT", "Replace existing data entirely"], ["DELETE", "Remove data"]]} />
          <P>This maps directly onto the SQL statements from the Web Fundamentals phase — GET is like SELECT, POST is like INSERT, DELETE is, unsurprisingly, DELETE.</P>
        </>),
      },
      {
        title: "HTTP Status Codes",
        body: () => (<>
          <P>Every HTTP response carries a three-digit status code summarizing what happened, grouped by their first digit:</P>
          <HttpStatusDiagram />
          <Callout title="A quick mental model" tone="blue">2xx: it worked. 3xx: go look somewhere else. 4xx: you (the client) made a mistake. 5xx: the server made a mistake. That single sentence covers the overwhelming majority of status codes you'll ever see.</Callout>
        </>),
      },
      {
        title: "HTTPS: Adding Encryption",
        body: () => (<>
          <P>HTTPS is HTTP wrapped in TLS encryption — the same request/response conversation, just unreadable to anyone intercepting it along the way. It runs on port 443 rather than HTTP's port 80, and the padlock icon in a browser's address bar confirms that TLS encryption is active for the current connection.</P>
        </>),
      },
    ],
    retrieval: { q: "What do a 4xx and a 5xx status code each indicate?", a: "4xx means the client made an error; 5xx means the server made an error" },
    recap: ["A port routes traffic to the right service on a machine; an IP address alone only routes to the right machine", "Ports 0-1023 are well-known — 80 for HTTP, 443 for HTTPS, 22 for SSH", "HTTP methods (GET, POST, PUT, DELETE) map closely onto SQL's SELECT/INSERT/UPDATE/DELETE", "Status codes group by first digit: 2xx success, 3xx redirect, 4xx client error, 5xx server error", "HTTPS is HTTP wrapped in TLS encryption, running on port 443"],
  },
  {
    id: "subnetting",
    icon: "▨",
    title: "Subnetting & IP Addressing",
    blurb: "Dividing one network into smaller ones on purpose — and the binary math from Logic, doing real work at last.",
    chapters: [
      {
        title: "IPv4 Addresses, Revisited",
        body: () => (<>
          <P>An IPv4 address is a 32-bit number, conventionally written as four decimal numbers separated by dots (<Code>192.168.1.10</Code>) — each of those four numbers is one byte, 0-255, exactly the binary-to-decimal conversion from the Logic phase, applied four times over.</P>
        </>),
      },
      {
        title: "CIDR Notation",
        body: () => (<>
          <P>CIDR notation (<Code>192.168.1.0/24</Code>) states how many of the 32 bits are reserved for identifying the network, versus how many remain for identifying individual hosts within it. A <Code>/24</Code> reserves the first 24 bits for the network, leaving 8 bits — 256 possible values — for hosts.</P>
        </>),
      },
      {
        title: "Subnet Masks",
        body: () => (<>
          <P>A subnet mask is the same information as a CIDR prefix, written as a full 32-bit address instead: <Code>/24</Code> is exactly <Code>255.255.255.0</Code> — 24 bits of all-1s, followed by 8 bits of all-0s. ANDing an IP address against its subnet mask (the bitwise AND from the Logic phase again) reveals the network portion of the address.</P>
        </>),
      },
      {
        title: "Calculating a Subnet, Interactively",
        body: () => (<>
          <P>Rather than working this out by hand every time, plug in any address and prefix and watch the network address, broadcast address, and usable host range compute live:</P>
          <SubnetCalculator />
        </>),
      },
      {
        title: "IPv6: Solving the Address Shortage",
        body: () => (<>
          <P>IPv4's 32 bits allow roughly 4.3 billion unique addresses — a number the internet has now exhausted. IPv6 uses 128 bits instead, an almost incomprehensibly larger address space, written in hexadecimal (directly connecting back to the Logic phase's hex chapter) and separated by colons rather than dots: <Code>2001:0db8:85a3::8a2e:0370:7334</Code>.</P>
          <Callout title="Why adoption has been slow" tone="purple">IPv6 has existed since the 1990s, yet IPv4 is still everywhere today, because migrating an entire internet's worth of infrastructure, software, and hardware is an enormous, gradual undertaking — most networks today run both side by side rather than having fully switched over.</Callout>
        </>),
      },
    ],
    simulator: true,
    retrieval: { q: "What does the number after the slash in CIDR notation (e.g. /24) represent?", a: "How many bits of the 32-bit address are reserved for the network portion" },
    recap: ["An IPv4 address is 32 bits, written as four decimal bytes", "CIDR notation (/24) states how many bits identify the network vs. the host", "A subnet mask is the same information, written as a full address of 1s and 0s", "ANDing an IP against its subnet mask reveals the network address — a direct application of Logic's bitwise AND", "IPv6 uses 128-bit hex addresses to solve IPv4's address exhaustion, though both still coexist widely today"],
  },
  {
    id: "ccna",
    icon: "⎊",
    title: "CCNA Essentials: Switching & VLANs",
    blurb: "How switches move traffic within a network, and how VLANs let one physical network behave like several separate ones.",
    chapters: [
      {
        title: "Switches vs. Routers",
        body: () => (<>
          <P>A <Strong>switch</Strong> operates mainly at the Data Link layer, forwarding traffic between devices on the same local network using MAC addresses. A <Strong>router</Strong> operates at the Network layer, forwarding traffic between different networks using IP addresses. Simplified to one sentence: switches connect devices within a network; routers connect networks to each other.</P>
        </>),
      },
      {
        title: "VLANs: Segmenting a Network Logically",
        body: () => (<>
          <P>A <Strong>VLAN</Strong> (Virtual LAN) lets a single physical switch behave as if it were several separate, isolated networks — devices on different VLANs can't see each other's traffic directly, even though they're plugged into the exact same physical hardware.</P>
          <MemoryHook>A VLAN is an apartment building: one physical structure, but each unit is a separate, locked space that doesn't share traffic with its neighbors, purely through configuration rather than separate wiring.</MemoryHook>
        </>),
      },
      {
        title: "Trunk Ports & VLAN Tagging",
        body: () => (<>
          <P>When traffic from multiple VLANs needs to travel over a single physical link between two switches, each frame gets tagged with which VLAN it belongs to — this is <Strong>VLAN tagging</Strong>, and a port configured to carry multiple tagged VLANs at once is called a <Strong>trunk</Strong> port, as opposed to an ordinary <Strong>access</Strong> port serving just one VLAN.</P>
        </>),
      },
      {
        title: "Spanning Tree: Preventing Loops",
        body: () => (<>
          <P>Redundant physical links between switches (added deliberately, for the same failure-resilience reasons covered in the Topologies topic) create a real risk: a <Strong>switching loop</Strong>, where traffic circulates endlessly and overwhelms the network. The Spanning Tree Protocol (STP) automatically detects redundant paths and logically disables just enough of them to eliminate loops, while keeping the physical backup links ready to activate instantly if the primary path fails.</P>
        </>),
      },
      {
        title: "WAN Basics: Connecting Networks Together",
        body: () => (<>
          <P>Everything so far in this topic has covered a LAN (Local Area Network) — one site. A WAN (Wide Area Network) connects separate LANs across distance, commonly leased from an ISP, tying a company's branch offices (or a home network and the wider internet) together into one larger logical network.</P>
          <Callout title="Closing this phase" tone="green">OSI layers, topologies, routing, ports and HTTP, subnetting, and now switching — this is genuinely the core of an entry-level networking certification, condensed into one connected story instead of a list of disconnected facts to memorize.</Callout>
        </>),
      },
    ],
    retrieval: { q: "In one sentence, what's the difference between what a switch does and what a router does?", a: "A switch connects devices within one network; a router connects separate networks to each other" },
    recap: ["Switches operate at Layer 2 (MAC addresses) within a network; routers operate at Layer 3 (IP addresses) between networks", "A VLAN lets one physical switch behave as multiple isolated logical networks", "Trunk ports carry multiple tagged VLANs over a single link; access ports carry just one", "Spanning Tree Protocol disables redundant paths just enough to prevent loops, while keeping them ready as backups", "A WAN connects separate LANs across distance, commonly via a leased ISP connection"],
  },
];

/* ══════════════════════ TOPIC MAP (compact, local knowledge map) ══════════════════════ */
function miniSegPath(a, b) {
  const midX = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x} ${b.y}`;
}
function TopicMap({ topics, completed, onOpen }) {
  const { t } = useT();
  const n = topics.length;
  const W = Math.max(600, n * 118), H = 132;
  const spacing = (W - 80) / (n - 1);
  const nodes = topics.map((tp, i) => ({ ...tp, x: 40 + i * spacing, y: H / 2 + (i % 2 === 0 ? -20 : 20) }));
  const firstIncompleteIdx = topics.findIndex((tp) => !completed[tp.id]);

  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", margin: "0 0 22px", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: "18px 16px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: 520, height: "auto", display: "block" }}>
        {nodes.slice(0, -1).map((a, i) => {
          const b = nodes[i + 1];
          const traveled = !!completed[a.id];
          return <path key={i} d={miniSegPath(a, b)} fill="none" stroke={traveled ? t.green : t.borderStrong} strokeWidth={traveled ? 4 : 3} strokeDasharray={traveled ? "none" : "1 9"} strokeLinecap="round" />;
        })}
        {nodes.map((node, i) => {
          const done = !!completed[node.id];
          const isCurrent = i === firstIncompleteIdx;
          const col = done ? t.green : t.accent;
          const short = node.title.split(" ").slice(0, 2).join(" ");
          return (
            <g key={node.id} onClick={() => onOpen(i)} style={{ cursor: "pointer" }}>
              <circle cx={node.x} cy={node.y} r={16} fill={done || isCurrent ? col : t.surface} stroke={col} strokeWidth="2" opacity={done || isCurrent ? 1 : 0.5} />
              <text x={node.x} y={node.y + 5} textAnchor="middle" fontFamily={F_MONO} fontSize="12" fontWeight="700" fill={done || isCurrent ? "#fff" : col}>{i + 1}</text>
              <text x={node.x} y={node.y + (i % 2 === 0 ? -28 : 40)} textAnchor="middle" fontFamily={F_UI} fontSize="10.5" fontWeight="600" fill={t.textMuted}>{short}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ══════════════════════ REVIEW SCREEN (spaced repetition) ══════════════════════ */
const LEITNER_DAYS = [0, 1, 3, 7, 16, 35];
function ReviewScreen({ reviewItems, onRate, onBack }) {
  const { t, view } = useT();
  const now = Date.now();
  const dueIds = Object.keys(reviewItems).filter((id) => reviewItems[id].dueAt <= now);
  const upcoming = Object.entries(reviewItems).filter(([id]) => !dueIds.includes(id)).sort((a, b) => a[1].dueAt - b[1].dueAt);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const topicById = (id) => TOPICS.find((tp) => tp.id === id);

  if (dueIds.length === 0) {
    return (
      <div>
        <button onClick={onBack} style={backLinkStyle(t)}><I.back /> All topics</button>
        <div style={{ textAlign: "center", padding: "56px 16px" }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>✅</div>
          <h2 style={{ fontFamily: F_UI, fontSize: 22, color: t.text, margin: "0 0 10px" }}>Nothing due right now</h2>
          <p style={{ fontFamily: F_BODY, color: t.textSecondary, maxWidth: 420, margin: "0 auto", lineHeight: 1.7 }}>Complete topics to add them to your review queue. Items you rate "Got it" come back further apart each time, so come back tomorrow.</p>
          {upcoming.length > 0 && (
            <div style={{ marginTop: 32, textAlign: "left", maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
              <div style={{ fontFamily: F_MONO, fontSize: 11, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Upcoming</div>
              {upcoming.map(([id, v]) => {
                const tp = topicById(id);
                const days = Math.max(1, Math.ceil((v.dueAt - now) / 86400000));
                return (
                  <div key={id} style={{ display: "flex", justifyContent: "space-between", padding: "11px 16px", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, marginBottom: 8 }}>
                    <span style={{ fontFamily: F_BODY, fontSize: 13.5, color: t.textSecondary }}>{tp ? tp.title : id}</span>
                    <span style={{ fontFamily: F_MONO, fontSize: 12, color: t.textMuted }}>in {days} day{days === 1 ? "" : "s"}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  const curId = dueIds[idx % dueIds.length];
  const curTopic = topicById(curId);
  if (!curTopic || !curTopic.retrieval) return null;

  const handleRate = (good) => {
    onRate(curId, good);
    setRevealed(false);
    setIdx((v) => (dueIds.length > 1 ? (v + 1) % dueIds.length : 0));
  };

  return (
    <div>
      <button onClick={onBack} style={backLinkStyle(t)}><I.back /> All topics</button>
      <div style={{ fontFamily: F_MONO, fontSize: 12, color: t.accent, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>🔁 Review · {dueIds.length} due</div>
      <h1 style={{ fontFamily: F_UI, fontSize: view === "mobile" ? 24 : 28, fontWeight: 700, color: t.text, margin: "0 0 26px" }}>Spaced Review</h1>
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 26 }}>
        <div style={{ fontFamily: F_MONO, fontSize: 11.5, color: t.textMuted, marginBottom: 12 }}>{curTopic.title}</div>
        <div style={{ fontFamily: F_BODY, fontSize: 17, color: t.text, lineHeight: 1.6, marginBottom: 20 }}>{curTopic.retrieval.q}</div>
        {!revealed ? (
          <button onClick={() => setRevealed(true)} style={{ background: t.accent, color: "#fff", border: 0, borderRadius: 9, padding: "11px 20px", fontFamily: F_UI, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>Reveal answer</button>
        ) : (
          <>
            <div style={{ color: t.green, fontFamily: F_MONO, fontWeight: 600, fontSize: 14.5, marginBottom: 22 }}>{curTopic.retrieval.a}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => handleRate(false)} style={{ flex: 1, background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.text, borderRadius: 10, padding: "12px", fontFamily: F_UI, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>Still shaky</button>
              <button onClick={() => handleRate(true)} style={{ flex: 1, background: t.green, border: 0, color: "#fff", borderRadius: 10, padding: "12px", fontFamily: F_UI, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>Got it</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════ TOPIC PAGE (study mode) ══════════════════════ */
function TopicPage({ topic, onExit, onComplete, readMode, onSetReadMode, completed }) {
  const { t, view } = useT();
  const [chapterIdx, setChapterIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const totalSteps = topic.chapters.length + 1;
  const onFinalStep = chapterIdx === topic.chapters.length;
  const chapter = !onFinalStep ? topic.chapters[chapterIdx] : null;

  const goNext = () => { if (chapterIdx < topic.chapters.length) setChapterIdx((c) => c + 1); };
  const goPrev = () => { if (chapterIdx > 0) setChapterIdx((c) => c - 1); };

  if (readMode === "reference") {
    return <ReferenceView topic={topic} onExit={onExit} onComplete={onComplete} onSetReadMode={onSetReadMode} completed={completed} />;
  }

  return (
    <div>
      <button onClick={onExit} style={backLinkStyle(t)}><I.back /> All topics</button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontFamily: F_MONO, fontSize: 20, color: t.accent }}>{topic.icon}</span>
          <h1 style={{ fontSize: view === "mobile" ? 24 : 30, fontWeight: 700, color: t.text, margin: 0, fontFamily: F_UI, letterSpacing: -0.5 }}>{topic.title}</h1>
        </div>
        <ModeToggle mode="study" onChange={onSetReadMode} />
      </div>

      <div style={{ display: "flex", gap: 5, margin: "24px 0 10px" }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 3, background: i <= chapterIdx ? t.accent : t.surfaceAlt }} />
        ))}
      </div>
      <div style={{ fontFamily: F_MONO, fontSize: 11.5, color: t.textMuted, marginBottom: 28 }}>
        {onFinalStep ? "Recap" : `Chapter ${chapterIdx + 1} of ${topic.chapters.length}`} — {chapter ? chapter.title : "Summary & Check"}
      </div>

      {!onFinalStep ? (
        <div style={{ minHeight: 240 }}>{chapter.body()}</div>
      ) : (
        <div>
          {null}
          <H3>Recap</H3>
          <div style={{ display: "grid", gap: 10, margin: "14px 0 26px" }}>
            {topic.recap.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: "13px 16px" }}>
                <span style={{ color: t.accent, marginTop: 2 }}><I.check /></span>
                <span style={{ color: t.textSecondary, fontSize: 14, fontFamily: F_BODY, lineHeight: 1.6 }}>{r}</span>
              </div>
            ))}
          </div>
          {topic.retrieval && (
            <div style={{ background: t.accentSoft, border: `1px solid ${t.accent}44`, borderRadius: 14, padding: "22px 24px" }}>
              <div style={{ fontFamily: F_UI, fontWeight: 600, color: t.accent, fontSize: 13, marginBottom: 11, textTransform: "uppercase", letterSpacing: 0.6 }}>🔁 Quick Check</div>
              <div style={{ color: t.text, fontSize: 15, fontFamily: F_BODY, marginBottom: 14 }}>{topic.retrieval.q}</div>
              {!revealed ? (
                <button onClick={() => setRevealed(true)} style={{ background: t.accent, color: "#fff", border: 0, borderRadius: 9, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: F_UI }}>Reveal answer</button>
              ) : (
                <div style={{ color: t.green, fontWeight: 600, fontFamily: F_MONO, fontSize: 14 }}>{topic.retrieval.a}</div>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: `1px solid ${t.border}` }}>
        <button onClick={goPrev} disabled={chapterIdx === 0} style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: `1px solid ${t.border}`, color: chapterIdx === 0 ? t.textMuted : t.text, borderRadius: 10, padding: "11px 19px", cursor: chapterIdx === 0 ? "default" : "pointer", fontFamily: F_UI, fontSize: 13.5, opacity: chapterIdx === 0 ? 0.4 : 1 }}><I.back /> Previous</button>
        {!onFinalStep ? (
          <button onClick={goNext} style={{ display: "flex", alignItems: "center", gap: 7, background: t.accent, color: "#fff", border: 0, borderRadius: 10, padding: "11px 21px", cursor: "pointer", fontFamily: F_UI, fontSize: 13.5, fontWeight: 600 }}>Next <I.next /></button>
        ) : (
          <button onClick={() => { onComplete(topic.id); onExit(); }} style={{ display: "flex", alignItems: "center", gap: 7, background: t.green, color: "#fff", border: 0, borderRadius: 10, padding: "11px 21px", cursor: "pointer", fontFamily: F_UI, fontSize: 13.5, fontWeight: 600 }}><I.check /> Mark complete</button>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════ REFERENCE VIEW (flattened, fast-lookup mode) ══════════════════════ */
function ReferenceView({ topic, onExit, onComplete, onSetReadMode, completed }) {
  const { t, view } = useT();
  const [revealed, setRevealed] = useState(false);
  const done = !!completed[topic.id];
  const scrollTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return (
    <div>
      <button onClick={onExit} style={backLinkStyle(t)}><I.back /> All topics</button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontFamily: F_MONO, fontSize: 20, color: t.accent }}>{topic.icon}</span>
          <h1 style={{ fontSize: view === "mobile" ? 24 : 30, fontWeight: 700, color: t.text, margin: 0, fontFamily: F_UI, letterSpacing: -0.5 }}>{topic.title}</h1>
        </div>
        <ModeToggle mode="reference" onChange={onSetReadMode} />
      </div>
      <p style={{ color: t.textMuted, fontFamily: F_MONO, fontSize: 11.5, margin: "10px 0 22px" }}>Reference mode · everything on one page, jump anywhere</p>

      <div style={{ position: "sticky", top: 66, zIndex: 10, background: t.bg, padding: "10px 0", marginBottom: 24, borderBottom: `1px solid ${t.border}`, overflowX: "auto", whiteSpace: "nowrap" }}>
        {topic.chapters.map((c, i) => (
          <button key={i} onClick={() => scrollTo(`ch-${i}`)} style={{ display: "inline-block", background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 8, padding: "7px 13px", marginRight: 8, fontFamily: F_UI, fontSize: 12.5, color: t.textSecondary, cursor: "pointer" }}>{i + 1}. {c.title}</button>
        ))}
      </div>

      {topic.chapters.map((c, i) => (
        <div key={i} id={`ch-${i}`} style={{ marginBottom: 34, scrollMarginTop: 90 }}>
          <div style={{ fontFamily: F_MONO, fontSize: 11, color: t.accent, marginBottom: 5 }}>Chapter {i + 1}</div>
          <h2 style={{ fontFamily: F_UI, fontSize: 22, fontWeight: 700, color: t.text, margin: "0 0 12px" }}>{c.title}</h2>
          {c.body()}
        </div>
      ))}

      {null}

      <H3>Recap</H3>
      <div style={{ display: "grid", gap: 10, margin: "14px 0 26px" }}>
        {topic.recap.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: "13px 16px" }}>
            <span style={{ color: t.accent, marginTop: 2 }}><I.check /></span>
            <span style={{ color: t.textSecondary, fontSize: 14, fontFamily: F_BODY, lineHeight: 1.6 }}>{r}</span>
          </div>
        ))}
      </div>

      {topic.retrieval && (
        <div style={{ background: t.accentSoft, border: `1px solid ${t.accent}44`, borderRadius: 14, padding: "22px 24px", marginBottom: 30 }}>
          <div style={{ fontFamily: F_UI, fontWeight: 600, color: t.accent, fontSize: 13, marginBottom: 11, textTransform: "uppercase", letterSpacing: 0.6 }}>🔁 Quick Check</div>
          <div style={{ color: t.text, fontSize: 15, fontFamily: F_BODY, marginBottom: 14 }}>{topic.retrieval.q}</div>
          {!revealed ? (
            <button onClick={() => setRevealed(true)} style={{ background: t.accent, color: "#fff", border: 0, borderRadius: 9, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: F_UI }}>Reveal answer</button>
          ) : (
            <div style={{ color: t.green, fontWeight: 600, fontFamily: F_MONO, fontSize: 14 }}>{topic.retrieval.a}</div>
          )}
        </div>
      )}

      <button onClick={() => { onComplete(topic.id); onExit(); }} style={{ display: "flex", alignItems: "center", gap: 7, background: done ? t.surfaceAlt : t.green, color: done ? t.textSecondary : "#fff", border: done ? `1px solid ${t.border}` : "none", borderRadius: 10, padding: "12px 22px", cursor: "pointer", fontFamily: F_UI, fontSize: 13.5, fontWeight: 600 }}><I.check /> {done ? "Completed — mark again" : "Mark complete"}</button>
    </div>
  );
}

/* ══════════════════════ HUB PAGE ══════════════════════ */
function Hub({ onOpen, completed }) {
  const { t, view } = useT();
  const doneCount = TOPICS.filter((tp) => completed[tp.id]).length;
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${t.panel} 0%, ${t.surface} 100%)`, border: `1px solid ${t.border}`, borderRadius: 20, padding: view === "mobile" ? "32px 26px" : "48px 48px", marginBottom: 36, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -30, width: 280, height: 280, background: t.glow }} />
        <div style={{ fontFamily: F_MONO, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: t.accent, marginBottom: 10 }}>Phase 5</div>
        <h1 style={{ fontSize: view === "mobile" ? 32 : 44, fontWeight: 700, color: t.text, margin: "4px 0 14px", letterSpacing: -1.3, fontFamily: F_UI }}>Networking &amp; Cisco</h1>
        <p style={{ fontSize: view === "mobile" ? 15 : 17, color: t.textSecondary, maxWidth: 560, fontFamily: F_BODY, lineHeight: 1.75, margin: 0 }}>
          How machines actually talk to each other — the OSI model, topologies, routing, ports and HTTP, subnetting, and the CCNA essentials of switching and VLANs.
        </p>
        <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, maxWidth: 200, height: 6, background: t.surfaceAlt, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(doneCount / TOPICS.length) * 100}%`, background: t.accent, transition: "width .3s" }} />
          </div>
          <span style={{ fontFamily: F_MONO, fontSize: 12.5, color: t.textMuted }}>{doneCount} / {TOPICS.length} complete</span>
        </div>
      </div>

      <TopicMap topics={TOPICS} completed={completed} onOpen={onOpen} />

      <div style={{ display: "grid", gridTemplateColumns: view === "mobile" ? "1fr" : "1fr 1fr", gap: 16 }}>
        {TOPICS.map((tp, i) => {
          const done = completed[tp.id];
          return (
            <button key={tp.id} onClick={() => onOpen(i)} style={{ textAlign: "left", background: t.surface, border: `1px solid ${done ? t.green + "55" : t.border}`, borderRadius: 16, padding: 22, cursor: "pointer", display: "flex", gap: 17, alignItems: "flex-start", position: "relative" }}>
              <div style={{ fontFamily: F_MONO, fontSize: tp.icon.length > 2 ? 15 : tp.icon.length > 1 ? 18 : 20, color: t.accent, width: 48, height: 48, display: "grid", placeItems: "center", background: t.accentSoft, borderRadius: 12, flexShrink: 0, letterSpacing: -0.5 }}>{tp.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: t.text, fontFamily: F_UI }}>{tp.title}</div>
                <div style={{ fontSize: 13, color: t.textMuted, marginTop: 6, fontFamily: F_BODY, lineHeight: 1.55 }}>{tp.blurb}</div>
                <div style={{ fontSize: 11, color: t.textMuted, marginTop: 10, fontFamily: F_MONO }}>{tp.chapters.length} chapters{tp.simulator ? " · interactive" : ""}</div>
              </div>
              {done && <span style={{ position: "absolute", top: 16, right: 16, color: t.green }}><I.check /></span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════ TOP BAR ══════════════════════ */
function SegToggle({ options, value, onChange }) {
  const { t } = useT();
  return <div style={{ display: "inline-flex", background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 9, padding: 2 }}>
    {options.map((o) => { const on = value === o.key; return <button key={o.key} onClick={() => onChange(o.key)} title={o.label} style={{ display: "flex", border: 0, cursor: "pointer", background: on ? t.surface : "transparent", color: on ? t.accent : t.textMuted, padding: "6px 10px", borderRadius: 7 }}>{o.node}</button>; })}
  </div>;
}

/* ══════════════════════ APP ══════════════════════ */
const STORAGE_KEY = "networking-module-progress-v1";

export default function NetworkingModule() {
  const [mode, setMode] = useState("dark");
  const [view, setView] = useState("desktop");
  const [screen, setScreen] = useState("hub");
  const [topicIdx, setTopicIdx] = useState(0);
  const [completed, setCompleted] = useState({});
  const [reviewItems, setReviewItems] = useState({});
  const [readMode, setReadMode] = useState("study");
  const t = THEMES[mode];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (!cancelled && res && res.value) {
          const data = JSON.parse(res.value);
          if (data.completed) setCompleted(data.completed);
          if (data.reviewItems) setReviewItems(data.reviewItems);
          if (data.readMode) setReadMode(data.readMode);
        }
      } catch (e) { /* no saved progress yet, or storage unavailable — start fresh */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const persist = (patch) => {
    (async () => {
      try {
        await window.storage.set(STORAGE_KEY, JSON.stringify({ completed, reviewItems, readMode, ...patch }));
      } catch (e) { /* progress just won't persist this session */ }
    })();
  };

  const openTopic = (i) => { setTopicIdx(i); setScreen("topic"); window.scrollTo({ top: 0 }); };

  const markComplete = (id) => {
    const nextCompleted = { ...completed, [id]: true };
    const nextReview = { ...reviewItems, [id]: reviewItems[id] || { box: 0, dueAt: Date.now() } };
    setCompleted(nextCompleted);
    setReviewItems(nextReview);
    persist({ completed: nextCompleted, reviewItems: nextReview });
  };

  const rateReview = (id, good) => {
    const cur = reviewItems[id] || { box: 0, dueAt: Date.now() };
    const nextBox = good ? Math.min(cur.box + 1, LEITNER_DAYS.length - 1) : 0;
    const dueAt = Date.now() + LEITNER_DAYS[nextBox] * 86400000;
    const nextReview = { ...reviewItems, [id]: { box: nextBox, dueAt } };
    setReviewItems(nextReview);
    persist({ reviewItems: nextReview });
  };

  const setAndPersistReadMode = (m) => { setReadMode(m); persist({ readMode: m }); };

  const dueCount = Object.values(reviewItems).filter((v) => v.dueAt <= Date.now()).length;

  return (
    <Ctx.Provider value={{ t, view }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ background: t.bg, minHeight: "100vh", color: t.text, transition: "background .25s, color .25s" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: t.bg + "e8", backdropFilter: "blur(10px)", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 10, padding: view === "mobile" ? "13px 20px" : "15px 36px", minHeight: 58 }}>
          <div style={{ fontFamily: F_MONO, fontWeight: 700, fontSize: 15, color: t.text }}>NETWORKING</div>
          <div style={{ flex: 1 }} />
          <button onClick={() => setScreen("review")} style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, background: screen === "review" ? t.accentSoft : "none", border: `1px solid ${screen === "review" ? t.accent : t.border}`, color: screen === "review" ? t.accent : t.textSecondary, borderRadius: 9, padding: "7px 13px", cursor: "pointer", fontFamily: F_UI, fontSize: 13, fontWeight: 600 }}>
            🔁 Review
            {dueCount > 0 && <span style={{ position: "absolute", top: -6, right: -6, background: t.accent, color: "#fff", fontSize: 10, fontFamily: F_MONO, fontWeight: 700, borderRadius: 10, minWidth: 16, height: 16, display: "grid", placeItems: "center", padding: "0 3px" }}>{dueCount}</span>}
          </button>
          <SegToggle value={mode} onChange={setMode} options={[{ key: "light", label: "Day", node: <I.sun /> }, { key: "dark", label: "Night", node: <I.moon /> }]} />
          <SegToggle value={view} onChange={setView} options={[{ key: "desktop", label: "Desktop", node: <I.desktop /> }, { key: "mobile", label: "Mobile", node: <I.mobile /> }]} />
        </div>
        <main style={{ maxWidth: view === "mobile" ? 680 : 840, margin: "0 auto", padding: view === "mobile" ? "26px 22px 84px" : "40px 44px 100px" }}>
          {screen === "hub" && <Hub onOpen={openTopic} completed={completed} />}
          {screen === "topic" && <TopicPage topic={TOPICS[topicIdx]} onExit={() => setScreen("hub")} onComplete={markComplete} readMode={readMode} onSetReadMode={setAndPersistReadMode} completed={completed} />}
          {screen === "review" && <ReviewScreen reviewItems={reviewItems} onRate={rateReview} onBack={() => setScreen("hub")} />}
        </main>
      </div>
    </Ctx.Provider>
  );
}
