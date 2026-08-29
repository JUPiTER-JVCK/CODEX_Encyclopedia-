import { useState, useEffect, useRef, createContext, useContext, useMemo } from "react";

/* ══════════════════════════════════════════════════════════
   CORE — Interactive CS Encyclopedia
   Theme built on Anthropic / Claude brand palette
   Dark #141413 · Light #faf9f5 · Orange #d97757
   Blue #6a9bcc · Green #788c5d · Grays #b0aea5 / #e8e6dc
   ══════════════════════════════════════════════════════════ */

const THEMES = {
  dark: {
    name: "dark",
    bg: "#141413", panel: "#0f0e0d", surface: "#1e1d1a", surfaceAlt: "#26241f", hover: "#2b2925",
    border: "#2b2a26", borderStrong: "#3a3833",
    text: "#faf9f5", textSecondary: "#c9c6bb", textMuted: "#8f8d83",
    accent: "#dd8060", accentSoft: "#dd806022",
    blue: "#7fa9d4", blueSoft: "#7fa9d422",
    green: "#8ba173", greenSoft: "#8ba17322",
    red: "#d9776a", redSoft: "#d9776a22",
    purple: "#b99ad4", purpleSoft: "#b99ad422",
    codeBg: "#0f0e0d", inlineBg: "#26241f",
    shadow: "none",
    glow: "radial-gradient(circle, #dd806015 0%, transparent 70%)",
  },
  light: {
    name: "light",
    bg: "#faf9f5", panel: "#f4f2ea", surface: "#ffffff", surfaceAlt: "#f2f0e8", hover: "#efece3",
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

/* ─── ICONS ─── */
const I = {
  sun: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>,
  moon: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" /></svg>,
  desktop: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
  mobile: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></svg>,
  menu: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M3 6h18M3 12h18M3 18h18" /></svg>,
  close: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M18 6L6 18M6 6l12 12" /></svg>,
  search: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>,
  play: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5v14l11-7z" /></svg>,
  chev: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 18l6-6-6-6" /></svg>,
};

/* ══════════════════════ MODULE REGISTRY ══════════════════════ */
const MODULES = [
  { id: "home", glyph: "◆", label: "Dashboard", tag: "Start here" },
  { id: "networking", glyph: "⬡", label: "Networking & Cisco", tag: "OSI · Routing · Security" },
  { id: "programming", glyph: "{ }", label: "Programming", tag: "Python · JS · HTML" },
  { id: "cli", glyph: "▸_", label: "Command Line", tag: "bash · zsh · PowerShell" },
  { id: "playground", glyph: "▶", label: "Playground", tag: "Run code live" },
  { id: "quiz", glyph: "?", label: "Test Yourself", tag: "Check your knowledge" },
];

/* ══════════════════════ PRIMITIVES ══════════════════════ */
function Chip({ children, tone = "blue" }) {
  const { t } = useT();
  const c = t[tone] || t.blue;
  return <span style={{ display: "inline-block", background: c + "1e", color: c, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, letterSpacing: 0.4, border: `1px solid ${c}33`, fontFamily: F_UI, textTransform: "uppercase" }}>{children}</span>;
}

function Mono({ children }) {
  const { t } = useT();
  return <code style={{ background: t.inlineBg, padding: "2px 7px", borderRadius: 5, fontFamily: F_MONO, fontSize: 12.5, color: t.blue }}>{children}</code>;
}

function Card({ children, pad = 18, style }) {
  const { t } = useT();
  return <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: pad, boxShadow: t.shadow, ...style }}>{children}</div>;
}

function H2({ children }) {
  const { t, view } = useT();
  return <h2 style={{ fontSize: view === "mobile" ? 23 : 27, fontWeight: 700, color: t.text, margin: "6px 0 14px", letterSpacing: -0.6, fontFamily: F_UI }}>{children}</h2>;
}
function H3({ children }) {
  const { t } = useT();
  return <h3 style={{ fontSize: 17, fontWeight: 600, color: t.text, margin: "26px 0 8px", fontFamily: F_UI }}>{children}</h3>;
}
function P({ children }) {
  const { t } = useT();
  return <p style={{ color: t.textSecondary, fontSize: 15, lineHeight: 1.8, margin: "8px 0", fontFamily: F_BODY }}>{children}</p>;
}
function Eyebrow({ children }) {
  const { t } = useT();
  return <div style={{ fontFamily: F_MONO, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: t.accent, marginBottom: 4 }}>{children}</div>;
}

function DataTable({ headers, rows, accentCol = 0 }) {
  const { t } = useT();
  return (
    <div style={{ overflowX: "auto", margin: "12px 0", borderRadius: 10, border: `1px solid ${t.border}`, boxShadow: t.shadow }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: F_MONO }}>
        <thead><tr>
          {headers.map((h, i) => <th key={i} style={{ textAlign: "left", padding: "10px 14px", background: t.surfaceAlt, color: t.accent, borderBottom: `1px solid ${t.borderStrong}`, fontWeight: 600, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase", fontFamily: F_UI, whiteSpace: "nowrap" }}>{h}</th>)}
        </tr></thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} style={{ background: ri % 2 ? t.surfaceAlt + "70" : t.surface }}>
              {r.map((c, ci) => <td key={ci} style={{ padding: "9px 14px", borderBottom: ri === rows.length - 1 ? "none" : `1px solid ${t.border}`, color: ci === accentCol ? t.green : t.textSecondary, whiteSpace: ci === accentCol ? "nowrap" : "normal" }}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Callout({ title, children, tone = "blue", icon = "ℹ️" }) {
  const { t } = useT();
  const c = t[tone] || t.blue;
  return (
    <div style={{ background: c + "14", border: `1px solid ${c}33`, borderLeft: `3px solid ${c}`, borderRadius: 10, padding: "13px 16px", margin: "14px 0" }}>
      {title && <div style={{ fontWeight: 600, color: c, marginBottom: 4, fontSize: 13.5, fontFamily: F_UI }}>{icon} {title}</div>}
      <div style={{ color: t.textSecondary, fontSize: 14, lineHeight: 1.7, fontFamily: F_BODY }}>{children}</div>
    </div>
  );
}

/* ══════════════════════ SYNTAX HIGHLIGHTER ══════════════════════ */
const escHTML = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const JS_KW = "await async break case catch class const continue default delete do else export extends false finally for function if import in instanceof let new null of return super switch this throw true try typeof undefined var void while yield";
const JS_RE = new RegExp(
  "(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)" +           // 1 comment
  "|(`(?:\\\\.|[^`\\\\])*`|\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*')" + // 2 string
  "|\\b(" + JS_KW.split(" ").join("|") + ")\\b" +      // 3 keyword
  "|\\b(0x[0-9a-fA-F]+|\\d+\\.?\\d*)\\b",              // 4 number
  "g"
);
function highlightJS(code, t) {
  let out = "", last = 0, m;
  JS_RE.lastIndex = 0;
  while ((m = JS_RE.exec(code)) !== null) {
    out += escHTML(code.slice(last, m.index));
    const col = m[1] ? t.textMuted : m[2] ? t.green : m[3] ? t.accent : t.blue;
    out += `<span style="color:${col}">${escHTML(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  out += escHTML(code.slice(last));
  return out;
}

function CodeEditor({ value, onChange, minH = 220 }) {
  const { t } = useT();
  const taRef = useRef(null), preRef = useRef(null);
  const sync = () => { if (taRef.current && preRef.current) { preRef.current.scrollTop = taRef.current.scrollTop; preRef.current.scrollLeft = taRef.current.scrollLeft; } };
  const shared = { margin: 0, border: 0, padding: 14, fontFamily: F_MONO, fontSize: 13, lineHeight: 1.6, whiteSpace: "pre", tabSize: 2 };
  return (
    <div style={{ position: "relative", background: t.codeBg, border: `1px solid ${t.border}`, borderRadius: 10, overflow: "hidden", minHeight: minH }}>
      <pre ref={preRef} aria-hidden style={{ ...shared, position: "absolute", inset: 0, overflow: "auto", color: t.text, pointerEvents: "none" }} dangerouslySetInnerHTML={{ __html: highlightJS(value, t) + "\n" }} />
      <textarea
        ref={taRef} value={value} spellCheck={false}
        onChange={(e) => onChange(e.target.value)} onScroll={sync}
        onKeyDown={(e) => { if (e.key === "Tab") { e.preventDefault(); const s = e.target.selectionStart, en = e.target.selectionEnd; const nv = value.slice(0, s) + "  " + value.slice(en); onChange(nv); requestAnimationFrame(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; }); } }}
        style={{ ...shared, position: "relative", width: "100%", minHeight: minH, background: "transparent", color: "transparent", caretColor: t.accent, outline: "none", resize: "vertical", display: "block", overflow: "auto" }}
      />
    </div>
  );
}

/* ══════════════════════ MODULE: DASHBOARD ══════════════════════ */
function Dashboard({ go }) {
  const { t, view } = useT();
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${t.panel} 0%, ${t.surface} 100%)`, border: `1px solid ${t.border}`, borderRadius: 18, padding: view === "mobile" ? "30px 22px" : "44px 40px", marginBottom: 28, position: "relative", overflow: "hidden", boxShadow: t.shadow }}>
        <div style={{ position: "absolute", top: -60, right: -40, width: 320, height: 320, background: t.glow }} />
        <Eyebrow>Interactive CS Encyclopedia</Eyebrow>
        <h1 style={{ fontSize: view === "mobile" ? 38 : 54, fontWeight: 700, color: t.text, margin: "6px 0 8px", letterSpacing: -2, lineHeight: 1.02, fontFamily: F_UI }}>
          Learn the machine,<br /><span style={{ color: t.accent }}>layer by layer.</span>
        </h1>
        <p style={{ fontSize: view === "mobile" ? 16 : 19, color: t.textSecondary, margin: "0 0 4px", maxWidth: 560, fontFamily: F_BODY, lineHeight: 1.6 }}>
          One place to study programming, the command line, and how networks really work — with guides, live examples, and quizzes to test yourself.
        </p>
        <div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => go("networking")} style={{ background: t.accent, color: "#fff", border: 0, borderRadius: 10, padding: "11px 20px", fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: F_UI }}>Start with Networking →</button>
          <button onClick={() => go("playground")} style={{ background: "transparent", color: t.text, border: `1px solid ${t.borderStrong}`, borderRadius: 10, padding: "11px 20px", fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: F_UI }}>Open Playground</button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
        <H2>Modules</H2>
        <span style={{ fontFamily: F_MONO, fontSize: 12, color: t.textMuted }}>{MODULES.length - 1} available · more coming</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: view === "mobile" ? "1fr" : "1fr 1fr", gap: 14 }}>
        {MODULES.filter((m) => m.id !== "home").map((m) => (
          <button key={m.id} onClick={() => go(m.id)} style={{ textAlign: "left", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20, cursor: "pointer", boxShadow: t.shadow, transition: "transform .12s, border-color .12s", display: "flex", gap: 16, alignItems: "flex-start" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = t.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = t.border; }}>
            <div style={{ fontFamily: F_MONO, fontSize: 22, color: t.accent, width: 40, height: 40, display: "grid", placeItems: "center", background: t.accentSoft, borderRadius: 10, flexShrink: 0 }}>{m.glyph}</div>
            <div>
              <div style={{ fontSize: 16.5, fontWeight: 600, color: t.text, fontFamily: F_UI }}>{m.label}</div>
              <div style={{ fontSize: 13, color: t.textMuted, marginTop: 2, fontFamily: F_MONO }}>{m.tag}</div>
            </div>
          </button>
        ))}
      </div>

      <Callout title="This is a living foundation" tone="green" icon="🌱" >
        The framework is modular and data-driven — new subjects (more Cisco depth, additional languages, operating systems) plug in without rebuilding anything. Tell me where to go deeper next.
      </Callout>
    </div>
  );
}

/* ══════════════════════ MODULE: NETWORKING ══════════════════════ */
const OSI_LAYERS = [
  { n: 7, name: "Application", color: "green", devices: "Gateway", protocols: "HTTP, FTP, SMTP, DNS, SNMP, Telnet", desc: "Services directly to user applications — identifies partners, quality of service, and privacy.", vulns: ["SQL Injection", "Cross-Site Scripting (XSS)", "DDoS attacks"] },
  { n: 6, name: "Presentation", color: "blue", devices: "Gateway", protocols: "TLS, SSL, JPEG, ASCII, encryption", desc: "Data translation, compression, and encryption — a common interface for applications.", vulns: ["Character-encoding attacks", "SSL stripping", "Data-compression manipulation"] },
  { n: 5, name: "Session", color: "purple", devices: "Gateway", protocols: "Sockets, NetBIOS, RPC", desc: "Establishes, manages, and terminates connections between applications.", vulns: ["Session replay", "Session fixation", "Man-in-the-middle"] },
  { n: 4, name: "Transport", color: "accent", devices: "Gateway", protocols: "TCP, UDP", desc: "End-to-end delivery, segmentation/reassembly, flow control, and error recovery.", vulns: ["UDP flood", "SYN flood", "Port scanning"] },
  { n: 3, name: "Network", color: "blue", devices: "Router", protocols: "IP, ICMP, IGMP, IPsec", desc: "Logical addressing and routing — moves packets across networks.", vulns: ["IP spoofing", "Route-table manipulation", "Smurf attack"] },
  { n: 2, name: "Data Link", color: "green", devices: "Switch, Bridge", protocols: "Ethernet, PPP, Wi-Fi, HDLC", desc: "Node-to-node framing on the local segment. Split into MAC and LLC sublayers.", vulns: ["MAC spoofing", "ARP spoofing", "Switch flooding"] },
  { n: 1, name: "Physical", color: "purple", devices: "Hub, Repeater, Cable", protocols: "Ethernet, Token Ring, FDDI", desc: "Raw bitstream over the medium — voltages, timing, connectors.", vulns: ["Eavesdropping / tapping", "Physical tampering", "Electromagnetic interference"] },
];

function OSIExplorer() {
  const { t } = useT();
  const [open, setOpen] = useState(7);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, margin: "12px 0" }}>
      {OSI_LAYERS.map((L) => {
        const c = t[L.color] || t.accent;
        const isOpen = open === L.n;
        return (
          <div key={L.n} style={{ border: `1px solid ${isOpen ? c + "66" : t.border}`, borderRadius: 12, overflow: "hidden", background: t.surface, boxShadow: t.shadow }}>
            <button onClick={() => setOpen(isOpen ? -1 : L.n)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", background: isOpen ? c + "12" : "transparent", border: 0, cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontFamily: F_MONO, fontSize: 13, fontWeight: 700, color: c, width: 28, height: 28, display: "grid", placeItems: "center", background: c + "22", borderRadius: 8, flexShrink: 0 }}>{L.n}</span>
              <span style={{ flex: 1 }}>
                <span style={{ fontSize: 15.5, fontWeight: 600, color: t.text, fontFamily: F_UI }}>{L.name}</span>
                <span style={{ fontSize: 12.5, color: t.textMuted, marginLeft: 10, fontFamily: F_MONO }}>{L.protocols.split(",")[0]}…</span>
              </span>
              <span style={{ color: t.textMuted, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .15s", display: "flex" }}><I.chev /></span>
            </button>
            {isOpen && (
              <div style={{ padding: "4px 16px 16px 58px" }}>
                <P>{L.desc}</P>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 14px", margin: "10px 0", fontSize: 13.5 }}>
                  <span style={{ color: t.textMuted, fontFamily: F_MONO }}>Devices</span><span style={{ color: t.textSecondary, fontFamily: F_BODY }}>{L.devices}</span>
                  <span style={{ color: t.textMuted, fontFamily: F_MONO }}>Protocols</span><span style={{ color: t.textSecondary, fontFamily: F_BODY }}>{L.protocols}</span>
                </div>
                <div style={{ marginTop: 6 }}>
                  <span style={{ fontSize: 12, color: t.red, fontFamily: F_MONO, textTransform: "uppercase", letterSpacing: 1 }}>⚠ Common attacks at this layer</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                    {L.vulns.map((v) => <span key={v} style={{ fontSize: 12.5, background: t.redSoft, color: t.red, border: `1px solid ${t.red}33`, padding: "4px 10px", borderRadius: 20, fontFamily: F_UI }}>{v}</span>)}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const TOPOLOGIES = [
  { name: "Bus", note: "Single backbone; cheap, but one break downs all.", draw: (c) => <><line x1="20" y1="60" x2="180" y2="60" stroke={c} strokeWidth="2.5" />{[40, 80, 120, 160].map((x) => <g key={x}><line x1={x} y1="60" x2={x} y2="38" stroke={c} strokeWidth="2" /><circle cx={x} cy="30" r="8" fill={c} /></g>)}</> },
  { name: "Star", note: "All nodes to a central hub/switch. Common today.", draw: (c) => <>{[[40, 30], [160, 30], [40, 90], [160, 90], [30, 60], [170, 60]].map(([x, y], i) => <line key={i} x1="100" y1="60" x2={x} y2={y} stroke={c} strokeWidth="2" />)}{[[40, 30], [160, 30], [40, 90], [160, 90], [30, 60], [170, 60]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" fill={c} />)}<rect x="90" y="50" width="20" height="20" rx="4" fill={c} /></> },
  { name: "Ring", note: "Each node links two others; data circles around.", draw: (c) => { const pts = [[100, 24], [156, 44], [168, 90], [124, 96], [76, 96], [32, 90], [44, 44]]; return <>{pts.map((p, i) => { const q = pts[(i + 1) % pts.length]; return <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={c} strokeWidth="2" />; })}{pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="7" fill={c} />)}</>; } },
  { name: "Mesh", note: "Every node interconnects. Max redundancy, max cabling.", draw: (c) => { const pts = [[50, 34], [150, 34], [40, 88], [160, 88], [100, 62]]; return <>{pts.map((p, i) => pts.slice(i + 1).map((q, j) => <line key={i + "-" + j} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={c} strokeWidth="1.3" opacity="0.7" />))}{pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="7" fill={c} />)}</>; } },
];

function Topologies() {
  const { t, view } = useT();
  return (
    <div style={{ display: "grid", gridTemplateColumns: view === "mobile" ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12, margin: "12px 0" }}>
      {TOPOLOGIES.map((topo) => (
        <Card key={topo.name} pad={12}>
          <svg viewBox="0 0 200 120" style={{ width: "100%", height: "auto", display: "block" }}>{topo.draw(t.accent)}</svg>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.text, fontFamily: F_UI, marginTop: 4 }}>{topo.name}</div>
          <div style={{ fontSize: 11.5, color: t.textMuted, fontFamily: F_BODY, lineHeight: 1.5, marginTop: 2 }}>{topo.note}</div>
        </Card>
      ))}
    </div>
  );
}

const HTTP_CODES = [
  ["1xx", "Informational", "blue", [["100", "Continue"], ["101", "Switching Protocols"], ["103", "Early Hints"]]],
  ["2xx", "Success", "green", [["200", "OK"], ["201", "Created"], ["202", "Accepted"], ["204", "No Content"], ["206", "Partial Content"]]],
  ["3xx", "Redirection", "purple", [["301", "Moved Permanently"], ["302", "Found"], ["304", "Not Modified"], ["307", "Temporary Redirect"], ["308", "Permanent Redirect"]]],
  ["4xx", "Client Error", "accent", [["400", "Bad Request"], ["401", "Unauthorized"], ["403", "Forbidden"], ["404", "Not Found"], ["405", "Method Not Allowed"], ["418", "I'm a teapot"], ["429", "Too Many Requests"]]],
  ["5xx", "Server Error", "red", [["500", "Internal Server Error"], ["502", "Bad Gateway"], ["503", "Service Unavailable"], ["504", "Gateway Timeout"]]],
];

function HTTPCodes() {
  const { t, view } = useT();
  const [q, setQ] = useState("");
  return (
    <div>
      <SearchField value={q} onChange={setQ} placeholder="Filter status codes…" />
      <div style={{ display: "grid", gridTemplateColumns: view === "mobile" ? "1fr" : "1fr 1fr", gap: 12, marginTop: 12 }}>
        {HTTP_CODES.map(([cls, label, tone, items]) => {
          const c = t[tone];
          const filtered = items.filter(([code, name]) => (code + name + cls + label).toLowerCase().includes(q.toLowerCase()));
          if (!filtered.length) return null;
          return (
            <Card key={cls} pad={0} style={{ overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", background: c + "16", borderBottom: `1px solid ${c}33`, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: F_MONO, fontWeight: 700, color: c }}>{cls}</span>
                <span style={{ fontSize: 13, color: t.textSecondary, fontFamily: F_UI, fontWeight: 500 }}>{label}</span>
              </div>
              {filtered.map(([code, name]) => (
                <div key={code} style={{ display: "flex", gap: 12, padding: "7px 14px", borderBottom: `1px solid ${t.border}`, alignItems: "center" }}>
                  <span style={{ fontFamily: F_MONO, fontSize: 13, fontWeight: 600, color: c, width: 34 }}>{code}</span>
                  <span style={{ fontSize: 13.5, color: t.textSecondary, fontFamily: F_BODY }}>{name}</span>
                </div>
              ))}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function SearchField({ value, onChange, placeholder }) {
  const { t } = useT();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: "8px 12px" }}>
      <span style={{ color: t.textMuted, display: "flex" }}><I.search /></span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ flex: 1, background: "transparent", border: 0, outline: "none", color: t.text, fontSize: 14, fontFamily: F_UI }} />
    </div>
  );
}

function Networking() {
  const { t } = useT();
  const [tab, setTab] = useState("osi");
  const tabs = [["osi", "OSI Model"], ["topo", "Topologies"], ["routing", "Routing"], ["http", "HTTP Codes"], ["ports", "Ports"], ["subnet", "Subnetting"]];
  return (
    <div>
      <Eyebrow>Networking · Cisco 1–3</Eyebrow>
      <H2>How networks actually work</H2>
      <P>From the physical wire up to the application layer — the models, the hardware, the protocols, and the security concerns a CS student needs to recognize. Content here is drawn from your reference material and structured for study.</P>
      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === "osi" && <><H3>The OSI Model — tap a layer</H3><P>Seven layers, each with its own job, devices, protocols, and characteristic attacks. This is the mental model everything else hangs on.</P><OSIExplorer /><Callout title="Mnemonic" tone="purple" icon="🧠">Layer 7→1: <b>All People Seem To Need Data Processing</b> (Application, Presentation, Session, Transport, Network, Data Link, Physical).</Callout></>}
      {tab === "topo" && <><H3>Physical topologies</H3><P>How nodes are physically arranged changes cost, resilience, and failure modes.</P><Topologies /></>}
      {tab === "routing" && <><H3>Routing protocols compared</H3><P>Routers pick paths using different algorithms. Administrative Distance (AD) is how a router breaks ties when two protocols both offer a route — lower wins.</P>
        <DataTable headers={["Protocol", "Type", "Metric", "AD", "Use Case"]} rows={[["RIP", "Distance Vector", "Hop Count", "120", "Small networks"], ["OSPF", "Link State", "Cost (bandwidth)", "110", "Enterprise"], ["EIGRP", "Adv. Distance Vector", "Bandwidth + delay", "90", "Cisco networks"], ["BGP", "Path Vector", "Path attributes", "20 / 200", "Internet routing"]]} />
        <H3>Administrative Distance reference</H3>
        <DataTable headers={["Route source", "AD"]} rows={[["Connected interface", "0"], ["Static route", "1"], ["EIGRP (internal)", "90"], ["OSPF", "110"], ["RIP", "120"], ["External BGP", "20"], ["Internal BGP", "200"]]} />
      </>}
      {tab === "http" && <><H3>HTTP status codes</H3><P>The three-digit language of the web. First digit is the class; the rest is the specific meaning.</P><HTTPCodes /></>}
      {tab === "ports" && <><H3>Well-known ports</H3><P>The first 1024 ports are reserved for common services. Worth memorizing the top ones.</P>
        <DataTable headers={["Port", "Protocol", "Service"]} rows={[["20/21", "TCP", "FTP (data / control)"], ["22", "TCP", "SSH"], ["23", "TCP", "Telnet"], ["25", "TCP", "SMTP (email send)"], ["53", "TCP/UDP", "DNS"], ["67/68", "UDP", "DHCP"], ["80", "TCP", "HTTP"], ["110", "TCP", "POP3"], ["143", "TCP", "IMAP"], ["443", "TCP", "HTTPS"], ["3389", "TCP", "RDP"]]} />
      </>}
      {tab === "subnet" && <><H3>Subnetting quick reference</H3><P>CIDR notation tells you how many bits are the network portion. The rest are host bits.</P>
        <DataTable headers={["CIDR", "Subnet Mask", "Hosts", "Networks"]} rows={[["/24", "255.255.255.0", "254", "1"], ["/25", "255.255.255.128", "126", "2"], ["/26", "255.255.255.192", "62", "4"], ["/27", "255.255.255.224", "30", "8"], ["/28", "255.255.255.240", "14", "16"], ["/29", "255.255.255.248", "6", "32"], ["/30", "255.255.255.252", "2", "64"]]} />
        <Callout title="Rule of thumb" tone="blue" icon="🔢">Usable hosts = 2^(host bits) − 2 (one address for the network, one for broadcast).</Callout>
      </>}
    </div>
  );
}

/* ══════════════════════ MODULE: PROGRAMMING ══════════════════════ */
const LANGS = {
  python: {
    label: "Python", tone: "green",
    blurb: "Readable, batteries-included, everywhere from scripting to ML. Whitespace defines blocks.",
    topics: [
      { h: "Variables & types", code: `name = "Ada"          # str\nage = 36               # int\npi = 3.14159           # float\nready = True           # bool\nnums = [1, 2, 3]       # list\nprint(f"{name} is {age}")` },
      { h: "Control flow", code: `for i in range(3):\n    if i % 2 == 0:\n        print(i, "even")\n    else:\n        print(i, "odd")` },
      { h: "Functions", code: `def greet(who, punct="!"):\n    return f"Hello, {who}{punct}"\n\nprint(greet("world"))` },
    ],
  },
  javascript: {
    label: "JavaScript", tone: "accent",
    blurb: "The language of the browser (and, via Node, the server). This is the one the Playground can run live.",
    topics: [
      { h: "Variables & types", code: `const name = "Ada";      // string\nlet age = 36;            // number\nconst ready = true;      // boolean\nconst nums = [1, 2, 3];  // array\nconsole.log(\`\${name} is \${age}\`);` },
      { h: "Functions & arrows", code: `const greet = (who, punct = "!") =>\n  \`Hello, \${who}\${punct}\`;\n\nconsole.log(greet("world"));` },
      { h: "Array methods", code: `const nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map(n => n * 2);\nconst evens = nums.filter(n => n % 2 === 0);\nconsole.log(doubled, evens);` },
    ],
  },
  html: {
    label: "HTML", tone: "blue",
    blurb: "The skeleton of every web page. Tags describe structure; the browser renders it. Preview HTML live in the Playground.",
    topics: [
      { h: "Document skeleton", code: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Hello</h1>\n  </body>\n</html>` },
      { h: "Common elements", code: `<a href="https://example.com">Link</a>\n<img src="cat.png" alt="A cat">\n<ul>\n  <li>First</li>\n  <li>Second</li>\n</ul>\n<button>Click me</button>` },
    ],
  },
};

function Programming({ sendToPlayground }) {
  const { t } = useT();
  const [lang, setLang] = useState("javascript");
  const L = LANGS[lang];
  const c = t[L.tone];
  return (
    <div>
      <Eyebrow>Programming</Eyebrow>
      <H2>Languages, from first principles</H2>
      <P>Start with the three that every web-era CS student needs. Each concept comes with a runnable example — send JavaScript and HTML straight to the Playground to see them work.</P>
      <TabBar tabs={Object.entries(LANGS).map(([k, v]) => [k, v.label])} active={lang} onChange={setLang} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0 4px" }}>
        <span style={{ fontFamily: F_MONO, fontSize: 22, color: c }}>{"{ }"}</span>
        <div><div style={{ fontWeight: 600, color: t.text, fontFamily: F_UI, fontSize: 17 }}>{L.label}</div></div>
      </div>
      <P>{L.blurb}</P>
      {L.topics.map((tp) => (
        <div key={tp.h} style={{ margin: "18px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <H3>{tp.h}</H3>
            {(lang === "javascript" || lang === "html") && (
              <button onClick={() => sendToPlayground(lang === "html" ? "html" : "js", tp.code)} style={{ display: "flex", alignItems: "center", gap: 6, background: c + "1a", color: c, border: `1px solid ${c}44`, borderRadius: 8, padding: "5px 11px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: F_UI }}><I.play /> Try it</button>
            )}
          </div>
          <ReadOnlyCode code={tp.code} />
        </div>
      ))}
    </div>
  );
}

function ReadOnlyCode({ code }) {
  const { t } = useT();
  return <pre style={{ background: t.codeBg, border: `1px solid ${t.border}`, borderRadius: 10, padding: "14px 16px", fontFamily: F_MONO, fontSize: 12.5, lineHeight: 1.65, overflowX: "auto", margin: 0, color: t.text }} dangerouslySetInnerHTML={{ __html: highlightJS(code, t) }} />;
}

/* ══════════════════════ MODULE: COMMAND LINE ══════════════════════ */
const SHELLS = {
  bash: {
    label: "bash / zsh", tone: "green",
    rows: [["ls -la", "List all files, long format, incl. hidden"], ["cd ~/dir", "Change directory (~ = home)"], ["pwd", "Print working directory"], ["mkdir -p a/b/c", "Make nested directories"], ["cp -r src dst", "Copy recursively"], ["mv a b", "Move / rename"], ["rm -rf dir", "Remove recursively (careful!)"], ["grep -r 'txt' .", "Search text recursively"], ["find . -name '*.js'", "Find files by pattern"], ["chmod +x file", "Make executable"], ["cat file | less", "Page through a file"], ["ps aux | grep node", "Find running processes"], ["kill -9 PID", "Force-kill a process"], ["curl -O url", "Download a file"], ["history", "Show command history"]],
  },
  powershell: {
    label: "PowerShell", tone: "blue",
    rows: [["Get-ChildItem", "List items (alias: ls, dir)"], ["Set-Location path", "Change directory (alias: cd)"], ["Get-Location", "Current directory (alias: pwd)"], ["New-Item -ItemType Directory x", "Make a directory (alias: mkdir)"], ["Copy-Item a b -Recurse", "Copy recursively"], ["Move-Item a b", "Move / rename"], ["Remove-Item x -Recurse -Force", "Delete recursively"], ["Select-String 'txt' *.log", "Search text in files"], ["Get-Process | Where CPU -gt 10", "Filter processes"], ["Stop-Process -Id PID", "Kill a process"], ["Get-Content file -Tail 20", "Show last 20 lines"], ["Invoke-WebRequest url -OutFile f", "Download a file"]],
  },
};

function CommandLine() {
  const { t } = useT();
  const [shell, setShell] = useState("bash");
  const [q, setQ] = useState("");
  const S = SHELLS[shell];
  const rows = S.rows.filter((r) => (r[0] + r[1]).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <Eyebrow>Command Line</Eyebrow>
      <H2>Talk to the machine directly</H2>
      <P>The shell is where a CS student gains real power over a system — Linux/macOS use bash or zsh; Windows uses PowerShell. Same ideas, different vocabulary.</P>
      <TabBar tabs={Object.entries(SHELLS).map(([k, v]) => [k, v.label])} active={shell} onChange={setShell} />
      <div style={{ margin: "8px 0 12px" }}><SearchField value={q} onChange={setQ} placeholder={`Filter ${S.label} commands…`} /></div>
      <div style={{ display: "grid", gap: 6 }}>
        {rows.map(([cmd, desc]) => (
          <div key={cmd} style={{ display: "grid", gridTemplateColumns: "minmax(140px, 40%) 1fr", gap: 12, alignItems: "center", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: "9px 14px", boxShadow: t.shadow }}>
            <code style={{ fontFamily: F_MONO, fontSize: 13, color: t[S.tone], fontWeight: 600 }}>{cmd}</code>
            <span style={{ fontSize: 13.5, color: t.textSecondary, fontFamily: F_BODY }}>{desc}</span>
          </div>
        ))}
        {!rows.length && <P>No commands match "{q}".</P>}
      </div>
    </div>
  );
}

/* ══════════════════════ MODULE: PLAYGROUND ══════════════════════ */
function fmtVal(v) {
  if (typeof v === "string") return v;
  if (v === undefined) return "undefined";
  if (v === null) return "null";
  try { return JSON.stringify(v, null, 2); } catch { return String(v); }
}
function runJS(code) {
  const logs = [];
  const fakeConsole = {
    log: (...a) => logs.push(a.map(fmtVal).join(" ")),
    error: (...a) => logs.push("⛔ " + a.map(fmtVal).join(" ")),
    warn: (...a) => logs.push("⚠ " + a.map(fmtVal).join(" ")),
    info: (...a) => logs.push(a.map(fmtVal).join(" ")),
  };
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("console", code);
    const ret = fn(fakeConsole);
    if (ret !== undefined) logs.push("↳ " + fmtVal(ret));
  } catch (e) {
    logs.push("⛔ " + (e && e.message ? e.message : String(e)));
  }
  return logs.length ? logs.join("\n") : "↳ ran with no console output";
}

function Playground({ seed }) {
  const { t, view } = useT();
  const [mode, setMode] = useState("js");
  const [js, setJs] = useState(`// JavaScript runs live — edit and press Run\nconst nums = [1, 2, 3, 4, 5];\nconst total = nums.reduce((a, b) => a + b, 0);\nconsole.log("sum:", total);\nconsole.log("doubled:", nums.map(n => n * 2));`);
  const [html, setHtml] = useState(`<!DOCTYPE html>\n<html>\n  <body style="font-family: sans-serif; padding: 20px">\n    <h1 style="color:#d97757">Hello, web!</h1>\n    <p>Edit me and press <b>Run</b>.</p>\n  </body>\n</html>`);
  const [out, setOut] = useState("");
  const [ranHtml, setRanHtml] = useState("");

  useEffect(() => {
    if (!seed) return;
    if (seed.mode === "html") { setMode("html"); setHtml(seed.code); }
    else { setMode("js"); setJs(seed.code); setOut(""); }
  }, [seed]);

  const run = () => { if (mode === "js") setOut(runJS(js)); else setRanHtml(html); };

  return (
    <div>
      <Eyebrow>Playground</Eyebrow>
      <H2>Write code. Run it. See what happens.</H2>
      <P>A live editor with syntax highlighting. JavaScript executes in your browser and prints to the console below; HTML renders in a sandboxed preview. Nothing leaves this page.</P>
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "10px 0" }}>
        <TabBar tabs={[["js", "JavaScript"], ["html", "HTML"]]} active={mode} onChange={setMode} compact />
        <button onClick={run} style={{ display: "flex", alignItems: "center", gap: 7, background: t.accent, color: "#fff", border: 0, borderRadius: 9, padding: "8px 16px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: F_UI, marginLeft: "auto" }}><I.play /> Run</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: view === "mobile" ? "1fr" : "1fr 1fr", gap: 14 }}>
        <div>
          <Label>Editor · {mode.toUpperCase()}</Label>
          {mode === "js"
            ? <CodeEditor value={js} onChange={setJs} />
            : <CodeEditor value={html} onChange={setHtml} />}
        </div>
        <div>
          <Label>{mode === "js" ? "Console output" : "Preview"}</Label>
          {mode === "js"
            ? <pre style={{ background: t.codeBg, border: `1px solid ${t.border}`, borderRadius: 10, padding: 14, fontFamily: F_MONO, fontSize: 13, lineHeight: 1.6, color: t.green, minHeight: 220, margin: 0, whiteSpace: "pre-wrap", overflow: "auto" }}>{out || "↳ press Run to see output"}</pre>
            : <iframe title="preview" srcDoc={ranHtml || html} sandbox="allow-scripts" style={{ width: "100%", minHeight: 220, background: "#fff", border: `1px solid ${t.border}`, borderRadius: 10 }} />}
        </div>
      </div>
    </div>
  );
}
function Label({ children }) {
  const { t } = useT();
  return <div style={{ fontFamily: F_MONO, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: t.textMuted, marginBottom: 6 }}>{children}</div>;
}

/* ══════════════════════ MODULE: QUIZ ══════════════════════ */
const QUESTIONS = [
  { q: "Which OSI layer does a router primarily operate at?", opts: ["Layer 2 – Data Link", "Layer 3 – Network", "Layer 4 – Transport", "Layer 7 – Application"], a: 1, why: "Routers make forwarding decisions using logical (IP) addresses at Layer 3." },
  { q: "What does HTTP status code 404 mean?", opts: ["Server error", "Unauthorized", "Not Found", "Redirect"], a: 2, why: "404 is a client error meaning the requested resource wasn't found." },
  { q: "Which protocol has the lowest Administrative Distance by default?", opts: ["RIP (120)", "OSPF (110)", "EIGRP (90)", "External BGP (20)"], a: 3, why: "Lower AD is more trusted; eBGP's 20 beats EIGRP, OSPF, and RIP." },
  { q: "In a /26 subnet, how many usable host addresses are there?", opts: ["30", "62", "126", "14"], a: 1, why: "/26 leaves 6 host bits → 2^6 − 2 = 62 usable hosts." },
  { q: "Which port does HTTPS use by default?", opts: ["80", "22", "443", "8080"], a: 2, why: "HTTPS runs on TCP 443; plain HTTP is 80." },
  { q: "ARP spoofing is an attack at which layer?", opts: ["Physical", "Data Link", "Network", "Session"], a: 1, why: "ARP maps IP↔MAC at Layer 2 (Data Link), where spoofing occurs." },
  { q: "Which array method builds a NEW array from transformed elements?", opts: [".forEach()", ".map()", ".filter()", ".reduce()"], a: 1, why: ".map() returns a new array with each element transformed." },
];

function Quiz() {
  const { t } = useT();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const Q = QUESTIONS[i];

  const choose = (idx) => { if (picked !== null) return; setPicked(idx); if (idx === Q.a) setScore((s) => s + 1); };
  const next = () => { if (i + 1 >= QUESTIONS.length) { setDone(true); return; } setI(i + 1); setPicked(null); };
  const restart = () => { setI(0); setPicked(null); setScore(0); setDone(false); };

  if (done) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div>
        <Eyebrow>Test Yourself</Eyebrow>
        <H2>Results</H2>
        <Card pad={28} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, fontWeight: 700, color: pct >= 70 ? t.green : pct >= 40 ? t.accent : t.red, fontFamily: F_UI }}>{pct}%</div>
          <P>You scored {score} of {QUESTIONS.length}. {pct >= 70 ? "Strong work — the fundamentals are landing." : "Good start — revisit the Networking module and try again."}</P>
          <button onClick={restart} style={{ background: t.accent, color: "#fff", border: 0, borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: F_UI, marginTop: 8 }}>Try again</button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Eyebrow>Test Yourself</Eyebrow>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <H2>Question {i + 1} <span style={{ color: t.textMuted, fontSize: 18 }}>/ {QUESTIONS.length}</span></H2>
        <span style={{ fontFamily: F_MONO, fontSize: 13, color: t.textMuted }}>Score {score}</span>
      </div>
      <div style={{ height: 4, background: t.surfaceAlt, borderRadius: 4, overflow: "hidden", margin: "0 0 18px" }}>
        <div style={{ height: "100%", width: `${((i) / QUESTIONS.length) * 100}%`, background: t.accent, transition: "width .3s" }} />
      </div>
      <Card pad={22}>
        <div style={{ fontSize: 18, fontWeight: 600, color: t.text, fontFamily: F_UI, marginBottom: 16, lineHeight: 1.4 }}>{Q.q}</div>
        <div style={{ display: "grid", gap: 9 }}>
          {Q.opts.map((opt, idx) => {
            let bg = t.surface, bc = t.border, col = t.text;
            if (picked !== null) {
              if (idx === Q.a) { bg = t.greenSoft; bc = t.green; col = t.green; }
              else if (idx === picked) { bg = t.redSoft; bc = t.red; col = t.red; }
            }
            return (
              <button key={idx} onClick={() => choose(idx)} disabled={picked !== null} style={{ textAlign: "left", background: bg, border: `1px solid ${bc}`, borderRadius: 10, padding: "12px 15px", fontSize: 14.5, color: col, cursor: picked === null ? "pointer" : "default", fontFamily: F_UI, fontWeight: 500, transition: "all .12s" }}>
                <span style={{ fontFamily: F_MONO, color: t.textMuted, marginRight: 10 }}>{String.fromCharCode(65 + idx)}</span>{opt}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div style={{ marginTop: 16 }}>
            <Callout title={picked === Q.a ? "Correct" : "Not quite"} tone={picked === Q.a ? "green" : "accent"} icon={picked === Q.a ? "✓" : "→"}>{Q.why}</Callout>
            <button onClick={next} style={{ background: t.accent, color: "#fff", border: 0, borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: F_UI }}>{i + 1 >= QUESTIONS.length ? "See results" : "Next question →"}</button>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ══════════════════════ SHARED UI ══════════════════════ */
function TabBar({ tabs, active, onChange, compact }) {
  const { t } = useT();
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", margin: compact ? 0 : "14px 0", background: t.surfaceAlt, padding: 4, borderRadius: 11, border: `1px solid ${t.border}`, width: "fit-content", maxWidth: "100%" }}>
      {tabs.map(([k, label]) => {
        const on = active === k;
        return <button key={k} onClick={() => onChange(k)} style={{ background: on ? t.surface : "transparent", color: on ? t.accent : t.textMuted, border: 0, borderRadius: 8, padding: "7px 14px", fontSize: 13.5, fontWeight: on ? 600 : 500, cursor: "pointer", fontFamily: F_UI, boxShadow: on ? t.shadow : "none", whiteSpace: "nowrap" }}>{label}</button>;
      })}
    </div>
  );
}

function SegToggle({ options, value, onChange }) {
  const { t } = useT();
  return (
    <div style={{ display: "inline-flex", background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 9, padding: 2 }}>
      {options.map((o) => {
        const on = value === o.key;
        return <button key={o.key} onClick={() => onChange(o.key)} title={o.label} aria-label={o.label} style={{ display: "flex", alignItems: "center", border: 0, cursor: "pointer", background: on ? t.surface : "transparent", color: on ? t.accent : t.textMuted, padding: "6px 10px", borderRadius: 7, boxShadow: on ? t.shadow : "none" }}>{o.node}</button>;
      })}
    </div>
  );
}

/* ─── COMMAND PALETTE (⌘K) ─── */
const SEARCH_INDEX = [
  { m: "networking", label: "OSI Model", hint: "7 layers" },
  { m: "networking", label: "Network Topologies", hint: "bus, star, ring, mesh" },
  { m: "networking", label: "Routing Protocols", hint: "RIP OSPF EIGRP BGP" },
  { m: "networking", label: "HTTP Status Codes", hint: "200 404 500" },
  { m: "networking", label: "Well-known Ports", hint: "22 80 443" },
  { m: "networking", label: "Subnetting", hint: "CIDR masks" },
  { m: "programming", label: "Python", hint: "variables, functions" },
  { m: "programming", label: "JavaScript", hint: "arrays, arrows" },
  { m: "programming", label: "HTML", hint: "tags, structure" },
  { m: "cli", label: "bash / zsh commands", hint: "ls grep chmod" },
  { m: "cli", label: "PowerShell commands", hint: "Get-ChildItem" },
  { m: "playground", label: "Code Playground", hint: "run JS, preview HTML" },
  { m: "quiz", label: "Quiz", hint: "test yourself" },
];

function Palette({ open, onClose, go }) {
  const { t } = useT();
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  const results = useMemo(() => SEARCH_INDEX.filter((r) => (r.label + r.hint + r.m).toLowerCase().includes(q.toLowerCase())), [q]);
  useEffect(() => { if (open) { setQ(""); setTimeout(() => inputRef.current?.focus(), 20); } }, [open]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "12vh" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(560px, 92vw)", background: t.surface, border: `1px solid ${t.borderStrong}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: `1px solid ${t.border}` }}>
          <span style={{ color: t.textMuted, display: "flex" }}><I.search /></span>
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search topics…" style={{ flex: 1, background: "transparent", border: 0, outline: "none", color: t.text, fontSize: 16, fontFamily: F_UI }} />
          <span style={{ fontFamily: F_MONO, fontSize: 11, color: t.textMuted, border: `1px solid ${t.border}`, borderRadius: 5, padding: "2px 6px" }}>ESC</span>
        </div>
        <div style={{ maxHeight: 340, overflowY: "auto", padding: 8 }}>
          {results.map((r, idx) => (
            <button key={idx} onClick={() => { go(r.m); onClose(); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "transparent", border: 0, borderRadius: 9, cursor: "pointer", textAlign: "left" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = t.hover)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <span style={{ fontFamily: F_MONO, fontSize: 13, color: t.accent, width: 26 }}>{MODULES.find((m) => m.id === r.m)?.glyph}</span>
              <span style={{ flex: 1 }}>
                <span style={{ fontSize: 14.5, color: t.text, fontFamily: F_UI, fontWeight: 500 }}>{r.label}</span>
                <span style={{ fontSize: 12, color: t.textMuted, marginLeft: 8, fontFamily: F_MONO }}>{r.hint}</span>
              </span>
              <span style={{ fontSize: 11, color: t.textMuted, fontFamily: F_MONO, textTransform: "capitalize" }}>{r.m}</span>
            </button>
          ))}
          {!results.length && <div style={{ padding: 20, textAlign: "center", color: t.textMuted, fontFamily: F_BODY }}>No topics match "{q}".</div>}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════ APP SHELL ══════════════════════ */
export default function App() {
  const [mode, setMode] = useState("dark");
  const [view, setView] = useState("desktop");
  const [active, setActive] = useState("home");
  const [drawer, setDrawer] = useState(false);
  const [palette, setPalette] = useState(false);
  const [seed, setSeed] = useState(null);
  const init = useRef(false);
  const t = THEMES[mode];

  useEffect(() => {
    if (init.current) return; init.current = true;
    if (typeof window !== "undefined" && window.innerWidth < 768) setView("mobile");
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((p) => !p); }
      if (e.key === "Escape") setPalette(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (id) => { setActive(id); setDrawer(false); window.scrollTo({ top: 0 }); };
  const sendToPlayground = (m, code) => { setSeed({ mode: m, code, k: Date.now() }); go("playground"); };

  const mobile = view === "mobile";
  const margin = mobile ? 0 : 248;

  const nav = (
    <>
      <div style={{ padding: "18px 18px 14px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: t.accent, display: "grid", placeItems: "center", color: "#fff", fontFamily: F_MONO, fontWeight: 700, fontSize: 16 }}>C</div>
          <div>
            <div style={{ fontFamily: F_MONO, fontWeight: 700, fontSize: 16, color: t.text, letterSpacing: -0.5 }}>CORE</div>
            <div style={{ fontSize: 10, color: t.textMuted, fontFamily: F_UI, letterSpacing: 0.5 }}>CS ENCYCLOPEDIA</div>
          </div>
        </div>
        {mobile && <button onClick={() => setDrawer(false)} aria-label="Close" style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 7, padding: "5px 7px", color: t.textSecondary, cursor: "pointer", display: "flex" }}><I.close /></button>}
      </div>
      <div style={{ padding: 10 }}>
        <button onClick={() => setPalette(true)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 9, padding: "8px 12px", color: t.textMuted, cursor: "pointer", fontFamily: F_UI, fontSize: 13 }}>
          <I.search /><span style={{ flex: 1, textAlign: "left" }}>Search…</span><span style={{ fontFamily: F_MONO, fontSize: 11, border: `1px solid ${t.border}`, borderRadius: 5, padding: "1px 5px" }}>⌘K</span>
        </button>
      </div>
      <nav style={{ padding: "2px 8px 12px", flex: 1, overflowY: "auto" }}>
        {MODULES.map((m) => {
          const on = active === m.id;
          return (
            <button key={m.id} onClick={() => go(m.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", marginBottom: 2, border: 0, borderRadius: 9, background: on ? t.accentSoft : "transparent", color: on ? t.accent : t.textSecondary, cursor: "pointer", textAlign: "left", fontFamily: F_UI }}>
              <span style={{ fontFamily: F_MONO, fontSize: 14, width: 22, textAlign: "center", color: on ? t.accent : t.textMuted }}>{m.glyph}</span>
              <span style={{ fontSize: 14, fontWeight: on ? 600 : 500 }}>{m.label}</span>
            </button>
          );
        })}
      </nav>
      <div style={{ padding: 14, borderTop: `1px solid ${t.border}`, fontFamily: F_MONO, fontSize: 10.5, color: t.textMuted, lineHeight: 1.6 }}>
        Built on the Claude palette.<br />Modular · extensible · yours.
      </div>
    </>
  );

  return (
    <Ctx.Provider value={{ t, mode, setMode, view, setView }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ background: t.bg, minHeight: "100vh", color: t.text, transition: "background .25s, color .25s" }}>
        {/* Sidebar / Drawer */}
        {mobile ? (
          <>
            {drawer && <div onClick={() => setDrawer(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 90 }} />}
            <div style={{ position: "fixed", top: 0, bottom: 0, left: 0, width: 260, background: t.panel, borderRight: `1px solid ${t.border}`, zIndex: 95, display: "flex", flexDirection: "column", transform: drawer ? "translateX(0)" : "translateX(-100%)", transition: "transform .25s ease" }}>{nav}</div>
          </>
        ) : (
          <div style={{ position: "fixed", top: 0, bottom: 0, left: 0, width: 248, background: t.panel, borderRight: `1px solid ${t.border}`, display: "flex", flexDirection: "column", zIndex: 40 }}>{nav}</div>
        )}

        {/* Main */}
        <div style={{ marginLeft: margin, transition: "margin-left .2s" }}>
          <div style={{ position: "sticky", top: 0, zIndex: 50, background: t.bg + "e8", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 12, padding: mobile ? "10px 16px" : "11px 32px", minHeight: 56 }}>
            {mobile && <button onClick={() => setDrawer(true)} aria-label="Menu" style={{ background: "none", border: 0, color: t.text, cursor: "pointer", display: "flex", padding: 4 }}><I.menu /></button>}
            <div style={{ flex: 1, fontFamily: F_MONO, fontSize: 13, color: t.textMuted, textTransform: "capitalize" }}>{MODULES.find((m) => m.id === active)?.label}</div>
            <SegToggle value={mode} onChange={setMode} options={[{ key: "light", label: "Day", node: <I.sun /> }, { key: "dark", label: "Night", node: <I.moon /> }]} />
            <SegToggle value={view} onChange={setView} options={[{ key: "desktop", label: "Desktop", node: <I.desktop /> }, { key: "mobile", label: "Mobile", node: <I.mobile /> }]} />
          </div>

          <main style={{ maxWidth: mobile ? 720 : 940, margin: "0 auto", padding: mobile ? "22px 18px 80px" : "30px 32px 90px" }}>
            {active === "home" && <Dashboard go={go} />}
            {active === "networking" && <Networking />}
            {active === "programming" && <Programming sendToPlayground={sendToPlayground} />}
            {active === "cli" && <CommandLine />}
            {active === "playground" && <Playground seed={seed} />}
            {active === "quiz" && <Quiz />}
          </main>
        </div>

        <Palette open={palette} onClose={() => setPalette(false)} go={go} />
      </div>
    </Ctx.Provider>
  );
}
