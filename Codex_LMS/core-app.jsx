import { useState, useEffect, createContext, useContext } from "react";

/* ══════════════════════════════════════════════════
   SECURITY & ETHICAL HACKING — Phase 6 (Capstone)
   Same shell as prior modules — single accent, Claude palette,
   Study/Reference modes, Topic Map, Spaced Review, DeepDives
   Defensive/pentest awareness framing only — no operational exploit content
   ══════════════════════════════════════════════════ */

const THEMES = {
  dark: {
    bg: "#141413", panel: "#0f0e0d", surface: "#1e1d1a", surfaceAlt: "#26241f", hover: "#2b2925",
    border: "#2b2a26", borderStrong: "#3a3833",
    text: "#faf9f5", textSecondary: "#c9c6bb", textMuted: "#8f8d83",
    accent: "#dd8060", accentSoft: "#dd806022",
    blue: "#7fa9d4", blueSoft: "#7fa9d422",
    green: "#8ba173", greenSoft: "#8ba17322",
    red: "#d9776a", redSoft: "#d9776a22",
    purple: "#b99ad4", purpleSoft: "#b99ad422",
    codeBg: "#0f0e0d", inlineBg: "#26241f",
    shadow: "none", glow: "radial-gradient(circle, #dd806015 0%, transparent 70%)",
    on: "#8ba173", off: "#3a3833",
    diagramBg: "#0f0e0d", heroGlow: "radial-gradient(circle, #dd806018 0%, transparent 70%)", heroGrad: "linear-gradient(135deg, #1c1a16 0%, #211e18 50%, #17150f 100%)",
  },
  light: {
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
    on: "#5f7345", off: "#dcd9cc",
    diagramBg: "#f5f3ec", heroGlow: "radial-gradient(circle, #d9775720 0%, transparent 70%)", heroGrad: "linear-gradient(135deg, #f5efe4 0%, #faf9f5 50%, #f0ebdf 100%)",
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
  search: (p) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>,
  play: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5v14l11-7z" /></svg>,
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
const PHASE_COLORS = { Logic: "accent", Hardware: "blue", "CLI/OS": "green", Programming: "purple", Web: "red", Networking: "blue", Security: "accent" };
function Chip({ label, active, onClick, color = "accent" }) {
  const { t } = useT(); const c = t[color] || t.accent;
  return <button onClick={onClick} style={{ background: active ? c : t.surfaceAlt, color: active ? "#fff" : t.textSecondary, border: `1px solid ${active ? c : t.border}`, borderRadius: 20, padding: "6px 14px", fontSize: 12.5, fontWeight: 600, fontFamily: F_UI, cursor: "pointer", whiteSpace: "nowrap" }}>{label}</button>;
}
/* ══════════════════════ GATE SYMBOL SVG ══════════════════════ */
function GateSymbol({ type, active, size = 90 }) {
  const { t } = useT();
  const stroke = t.text, fillOn = t.accent;
  const bubble = ["NAND", "NOR", "NOT", "XNOR"].includes(type);
  const isOrFamily = ["OR", "NOR", "XOR", "XNOR"].includes(type);
  const isNot = type === "NOT";
  const w = size, h = size * 0.66;
  const bodyColor = active ? fillOn : stroke;
  return (
    <svg width={w} height={h + 10} viewBox={`0 0 ${w} ${h + 10}`}>
      {!isNot && <><line x1="0" y1={h * 0.28} x2={w * 0.28} y2={h * 0.28} stroke={bodyColor} strokeWidth="2.5" /><line x1="0" y1={h * 0.72} x2={w * 0.28} y2={h * 0.72} stroke={bodyColor} strokeWidth="2.5" /></>}
      {isNot && <line x1="0" y1={h * 0.5} x2={w * 0.22} y2={h * 0.5} stroke={bodyColor} strokeWidth="2.5" />}
      {isNot ? (
        <polygon points={`${w * 0.22},${h * 0.1} ${w * 0.22},${h * 0.9} ${w * 0.65},${h * 0.5}`} fill="none" stroke={bodyColor} strokeWidth="2.5" />
      ) : isOrFamily ? (
        <path d={`M ${w * 0.24},${h * 0.06} Q ${w * 0.45},${h * 0.5} ${w * 0.24},${h * 0.94} Q ${w * 0.55},${h * 0.94} ${w * 0.75},${h * 0.5} Q ${w * 0.55},${h * 0.06} ${w * 0.24},${h * 0.06} Z`} fill="none" stroke={bodyColor} strokeWidth="2.5" />
      ) : (
        <path d={`M ${w * 0.24},${h * 0.06} L ${w * 0.5},${h * 0.06} A ${h * 0.44},${h * 0.44} 0 0 1 ${w * 0.5},${h * 0.94} L ${w * 0.24},${h * 0.94} Z`} fill="none" stroke={bodyColor} strokeWidth="2.5" />
      )}
      {(type === "XOR" || type === "XNOR") ? (
        <path d={`M ${w * 0.16},${h * 0.06} Q ${w * 0.32},${h * 0.5} ${w * 0.16},${h * 0.94}`} fill="none" stroke={bodyColor} strokeWidth="2.5" />
      ) : null}
      {bubble && <circle cx={isNot ? w * 0.71 : w * 0.81} cy={h * 0.5} r={h * 0.07} fill="none" stroke={bodyColor} strokeWidth="2.5" />}
      <line x1={bubble ? (isNot ? w * 0.78 : w * 0.88) : (isNot ? w * 0.65 : w * 0.75)} y1={h * 0.5} x2={w} y2={h * 0.5} stroke={bodyColor} strokeWidth="2.5" />
      <circle cx={w} cy={h * 0.5} r={active ? 5 : 3} fill={active ? fillOn : "none"} stroke={bodyColor} strokeWidth="2" />
      <text x={w * 0.4} y={h + 9} textAnchor="middle" fontSize="11" fontFamily={F_MONO} fill={t.textMuted} fontWeight="600">{type}</text>
    </svg>
  );
}

function TruthTable({ cols, rows, highlight }) {
  const { t } = useT();
  return <div style={{ overflowX: "auto", margin: "22px 0", borderRadius: 12, border: `1px solid ${t.border}` }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: F_MONO, fontSize: 13.5 }}>
      <thead><tr>{cols.map((c, i) => <th key={i} style={{ padding: "12px 16px", background: t.surfaceAlt, color: t.accent, borderBottom: `1px solid ${t.borderStrong}`, fontSize: 12, fontWeight: 700, textAlign: "center" }}>{c}</th>)}</tr></thead>
      <tbody>{rows.map((r, ri) => {
        const isHi = highlight != null && ri === highlight;
        return <tr key={ri} style={{ background: isHi ? t.accentSoft : (ri % 2 ? t.surfaceAlt + "60" : t.surface) }}>
          {r.map((c, ci) => <td key={ci} style={{ padding: "11px 16px", textAlign: "center", borderBottom: ri === rows.length - 1 ? "none" : `1px solid ${t.border}`, color: isHi ? t.accent : (c === 1 || c === "1" ? t.green : c === 0 || c === "0" ? t.textMuted : t.textSecondary), fontWeight: isHi ? 700 : ci === r.length - 1 ? 700 : 400 }}>{c}</td>)}
        </tr>;
      })}</tbody>
    </table>
  </div>;
}

const GATE_LOGIC = {
  AND: (a, b) => a & b, OR: (a, b) => a | b, NOT: (a) => a ? 0 : 1,
  NAND: (a, b) => (a & b) ? 0 : 1, NOR: (a, b) => (a | b) ? 0 : 1,
  XOR: (a, b) => a ^ b, XNOR: (a, b) => (a ^ b) ? 0 : 1,
};

/* ══════════════════════ INTERACTIVE: GATE SIMULATOR ══════════════════════ */
function GateSimulator() {
  const { t, view } = useT();
  const [gate, setGate] = useState("AND");
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const unary = gate === "NOT";
  const out = unary ? GATE_LOGIC[gate](a) : GATE_LOGIC[gate](a, b);
  const rows = unary
    ? [0, 1].map((x) => [x, GATE_LOGIC[gate](x)])
    : [[0, 0], [0, 1], [1, 0], [1, 1]].map(([x, y]) => [x, y, GATE_LOGIC[gate](x, y)]);
  const curRowIdx = unary ? a : a * 2 + b;

  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: 26, margin: "24px 0" }}>
      <div style={{ fontFamily: F_MONO, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: t.accent, marginBottom: 12 }}>🎮 Interactive · Gate Simulator</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        {Object.keys(GATE_LOGIC).map((g) => (
          <button key={g} onClick={() => setGate(g)} style={{ background: gate === g ? t.accent : t.surfaceAlt, color: gate === g ? "#fff" : t.textSecondary, border: `1px solid ${gate === g ? t.accent : t.border}`, borderRadius: 8, padding: "6px 13px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: F_MONO }}>{g}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: view === "mobile" ? "1fr" : "auto 1fr", gap: 24, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", gap: 18 }}>
            <ToggleSwitch label="A" value={a} onChange={setA} />
            {!unary && <ToggleSwitch label="B" value={b} onChange={setB} />}
          </div>
          <GateSymbol type={gate} active={!!out} size={120} />
          <div style={{ fontFamily: F_MONO, fontSize: 13, color: t.textMuted }}>output = <span style={{ color: out ? t.green : t.textMuted, fontWeight: 700, fontSize: 16 }}>{out}</span></div>
        </div>
        <TruthTable cols={unary ? ["A", "OUT"] : ["A", "B", "OUT"]} rows={rows} highlight={curRowIdx} />
      </div>
    </div>
  );
}
function ToggleSwitch({ label, value, onChange }) {
  const { t } = useT();
  return <button onClick={() => onChange(value ? 0 : 1)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer" }}>
    <span style={{ fontFamily: F_MONO, fontSize: 11, color: t.textMuted }}>{label}</span>
    <div style={{ width: 52, height: 28, borderRadius: 20, background: value ? t.on : t.off, position: "relative", transition: "background .15s" }}>
      <div style={{ position: "absolute", top: 3, left: value ? 27 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", transition: "left .15s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
    </div>
    <span style={{ fontFamily: F_MONO, fontSize: 13, fontWeight: 700, color: value ? t.green : t.textMuted }}>{value}</span>
  </button>;
}

/* ══════════════════════ INTERACTIVE: BASE CONVERTER ══════════════════════ */
function BaseConverter() {
  const { t, view } = useT();
  const [dec, setDec] = useState(202);
  const clamp = (n) => Math.max(0, Math.min(65535, n));
  const bin = dec.toString(2).padStart(8, "0");
  const hex = dec.toString(16).toUpperCase().padStart(2, "0");
  const setFromBin = (v) => { if (/^[01]*$/.test(v)) setDec(clamp(parseInt(v || "0", 2))); };
  const setFromHex = (v) => { if (/^[0-9a-fA-F]*$/.test(v)) setDec(clamp(parseInt(v || "0", 16))); };
  const bits = bin.split("").map(Number);
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: 26, margin: "24px 0" }}>
      <div style={{ fontFamily: F_MONO, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: t.accent, marginBottom: 16 }}>🎮 Interactive · Base Converter</div>
      <div style={{ display: "grid", gridTemplateColumns: view === "mobile" ? "1fr" : "repeat(3, 1fr)", gap: 12, marginBottom: 18 }}>
        {[
          { label: "Decimal", value: dec, onChange: (v) => /^\d*$/.test(v) && setDec(clamp(v === "" ? 0 : parseInt(v, 10))), color: t.accent },
          { label: "Binary", value: bin, onChange: setFromBin, color: t.green },
          { label: "Hexadecimal", value: hex, onChange: setFromHex, color: t.blue },
        ].map((f) => (
          <div key={f.label}>
            <div style={{ fontFamily: F_MONO, fontSize: 10.5, color: t.textMuted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 5 }}>{f.label}</div>
            <input value={f.value} onChange={(e) => f.onChange(e.target.value)} style={{ width: "100%", boxSizing: "border-box", background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 8, padding: "9px 12px", color: f.color, fontFamily: F_MONO, fontSize: 17, fontWeight: 700, outline: "none" }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap" }}>
        {bits.map((b, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 30, height: 30, borderRadius: 6, background: b ? t.accentSoft : t.surfaceAlt, border: `1px solid ${b ? t.accent : t.border}`, display: "grid", placeItems: "center", fontFamily: F_MONO, fontWeight: 700, color: b ? t.accent : t.textMuted, fontSize: 14 }}>{b}</div>
            <span style={{ fontFamily: F_MONO, fontSize: 9.5, color: t.textMuted }}>{2 ** (7 - i)}</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: t.textMuted, fontFamily: F_BODY }}>each column is a power of two — add up the highlighted ones to get {dec}</div>
    </div>
  );
}

/* ══════════════════════ INTERACTIVE: BITWISE VISUALIZER ══════════════════════ */
function BitwiseVisualizer() {
  const { t } = useT();
  const [x, setX] = useState(0b10110100);
  const [y, setY] = useState(0b11001010);
  const [op, setOp] = useState("AND");
  const OPS = { AND: (a, b) => a & b, OR: (a, b) => a | b, XOR: (a, b) => a ^ b, "NOT A": (a) => (~a) & 0xff, "A << 1": (a) => (a << 1) & 0xff, "A >> 1": (a) => a >> 1 };
  const needsY = !["NOT A", "A << 1", "A >> 1"].includes(op);
  const result = needsY ? OPS[op](x, y) : OPS[op](x);
  const bitsOf = (n) => n.toString(2).padStart(8, "0").split("").map(Number);
  const Row = ({ label, val, color }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <span style={{ fontFamily: F_MONO, fontSize: 12, color: t.textMuted, width: 60 }}>{label}</span>
      <div style={{ display: "flex", gap: 3 }}>{bitsOf(val).map((b, i) => <div key={i} style={{ width: 24, height: 24, borderRadius: 5, background: b ? color + "33" : t.surfaceAlt, border: `1px solid ${b ? color : t.border}`, display: "grid", placeItems: "center", fontFamily: F_MONO, fontSize: 12, fontWeight: 700, color: b ? color : t.textMuted }}>{b}</div>)}</div>
      <span style={{ fontFamily: F_MONO, fontSize: 12, color: t.textMuted }}>= {val}</span>
    </div>
  );
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: 26, margin: "24px 0" }}>
      <div style={{ fontFamily: F_MONO, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: t.accent, marginBottom: 16 }}>🎮 Interactive · Bitwise Visualizer</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
        {Object.keys(OPS).map((o) => <button key={o} onClick={() => setOp(o)} style={{ background: op === o ? t.accent : t.surfaceAlt, color: op === o ? "#fff" : t.textSecondary, border: `1px solid ${op === o ? t.accent : t.border}`, borderRadius: 8, padding: "6px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: F_MONO }}>{o}</button>)}
      </div>
      <div style={{ overflowX: "auto" }}>
        <Row label="A" val={x} color={t.blue} />
        {needsY && <Row label="B" val={y} color={t.purple} />}
        <div style={{ borderTop: `1px dashed ${t.border}`, margin: "8px 0 8px 70px", width: 218 }} />
        <Row label={op} val={result} color={t.accent} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <input type="range" min="0" max="255" value={x} onChange={(e) => setX(+e.target.value)} style={{ flex: 1, minWidth: 120 }} />
        {needsY && <input type="range" min="0" max="255" value={y} onChange={(e) => setY(+e.target.value)} style={{ flex: 1, minWidth: 120 }} />}
      </div>
    </div>
  );
}

/* ══════════════════════ GATE REFERENCE GRID (own component — safe hook scope) ══════════════════════ */
function SevenGatesChapter() {
  const { t } = useT();
  return (<>
    <P>Beyond the three basic operations, digital logic uses four more gates that come up constantly enough to have their own symbol and name:</P>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, margin: "16px 0" }}>
      {GATE_REF.map((item) => (
        <div key={item.g} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16, textAlign: "center" }}>
          <GateSymbol type={item.g} active={false} size={90} />
          <div style={{ fontSize: 13, color: t.textMuted, fontFamily: F_BODY, marginTop: 8, lineHeight: 1.5 }}>{item.desc}</div>
        </div>
      ))}
    </div>
  </>);
}

/* ══════════════════════ DIAGRAM: 4 BITS → 1 HEX DIGIT ══════════════════════ */
function BinaryHexDiagram() {
  const { t } = useT();
  const rows = [["0000", "0", "0"], ["0100", "4", "4"], ["1000", "8", "8"], ["1010", "A", "10"], ["1100", "C", "12"], ["1111", "F", "15"]];
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 18, margin: "18px 0" }}>
      <div style={{ fontFamily: F_MONO, fontSize: 10.5, letterSpacing: 1, textTransform: "uppercase", color: t.accent, marginBottom: 12 }}>📊 Diagram · 4 Bits → 1 Hex Digit</div>
      {rows.map(([bin, hex, dec]) => (
        <div key={hex} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {bin.split("").map((b, i) => (
              <div key={i} style={{ width: 24, height: 24, borderRadius: 5, background: b === "1" ? t.accent + "33" : t.surfaceAlt, border: `1px solid ${b === "1" ? t.accent : t.border}`, display: "grid", placeItems: "center", fontFamily: F_MONO, fontWeight: 700, fontSize: 12, color: b === "1" ? t.accent : t.textMuted }}>{b}</div>
            ))}
          </div>
          <span style={{ color: t.textMuted }}>→</span>
          <div style={{ fontFamily: F_MONO, fontWeight: 700, fontSize: 16, color: t.green, width: 24 }}>{hex}</div>
          <span style={{ fontFamily: F_BODY, fontSize: 12, color: t.textMuted }}>(decimal {dec})</span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════ CONTENT MODEL ══════════════════════ */
const GATE_REF = [
  { g: "AND", desc: "Output is 1 only if BOTH inputs are 1. Like two switches in series — current only flows if both are closed." },
  { g: "OR", desc: "Output is 1 if AT LEAST ONE input is 1. Like two switches in parallel — current flows if either is closed." },
  { g: "NOT", desc: "Flips a single input. 0 becomes 1, 1 becomes 0. Also called an inverter." },
  { g: "NAND", desc: "AND, then NOT. Output is 0 only when both inputs are 1 — everything else is 1." },
  { g: "NOR", desc: "OR, then NOT. Output is 1 only when both inputs are 0 — everything else is 0." },
  { g: "XOR", desc: "Exclusive OR — output is 1 if the inputs are DIFFERENT from each other." },
  { g: "XNOR", desc: "Exclusive NOR — output is 1 if the inputs are the SAME as each other." },
];

const TOPICS_LOGIC = [
  {
    id: "logic:boolean",
    icon: "⊤",
    title: "Boolean Algebra Basics",
    blurb: "The two-value system — true and false — that every digital decision in a computer is built from.",
    chapters: [
      {
        title: "What Is Boolean Logic?",
        body: () => (<>
          <P>In 1854, mathematician George Boole published a system of algebra where every value is either <Strong>true</Strong> or <Strong>false</Strong> — nothing in between. No fractions, no "maybe." Just two states. It seemed like a mathematical curiosity at the time. Almost a century later, engineers building the first electronic computers realized something remarkable: an electrical circuit is either carrying current or it isn't. On or off. High voltage or low. <Strong>Boole's two-value logic was already describing exactly how a switch behaves.</Strong></P>
          <P>That's the entire reason binary computing exists. Every decision your computer ever makes — every <Code>if</Code> statement, every comparison, every routing choice in a network — eventually reduces to combinations of true/false answered by tiny electronic switches flipping on and off, billions of times a second.</P>
          <MemoryHook>Boolean = two values, named after George Boole. If you remember nothing else: <Strong>everything a computer "decides" is really just true/false, stacked in clever combinations.</Strong></MemoryHook>
          <P>In digital electronics we usually write true as <Code>1</Code> and false as <Code>0</Code> instead of the words — same meaning, just the notation that survived into engineering.</P>
          <DeepDive title="The thesis that connected the dots">
            <P>Boole died in 1864 having no idea his algebra would ever touch a machine. The connection was made in 1937, when a 21-year-old MIT graduate student named Claude Shannon wrote a master's thesis proving that Boolean algebra could describe — and simplify — real electrical switching circuits made of relays. It's often called the most important master's thesis of the 20th century, because it's the exact paper that turns "true/false algebra" into "this is how you build a computer."</P>
          </DeepDive>
        </>),
      },
      {
        title: "The Three Fundamental Operations",
        body: () => (<>
          <P>Boolean algebra has exactly three basic operations. Every other logical operation — no matter how complex — can be built by combining these three.</P>
          <H3>AND — both must be true</H3>
          <P><Code>A AND B</Code> is true only when A is true <em>and</em> B is true. Think of two light switches wired in series on the same circuit — the bulb only lights if both switches are flipped on.</P>
          <TruthTable cols={["A", "B", "A AND B"]} rows={[[0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 1, 1]]} />
          <H3>OR — at least one must be true</H3>
          <P><Code>A OR B</Code> is true if A is true, or B is true, or both. Same two switches, but now wired in parallel — the bulb lights if either one is flipped on.</P>
          <TruthTable cols={["A", "B", "A OR B"]} rows={[[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1]]} />
          <H3>NOT — flip it</H3>
          <P><Code>NOT A</Code> simply reverses whatever A is. This is the only operation here that takes just one input instead of two.</P>
          <TruthTable cols={["A", "NOT A"]} rows={[[0, 1], [1, 0]]} />
        </>),
      },
      {
        title: "Building Complex Expressions",
        body: () => (<>
          <P>Real logic gets built by chaining these three operations together. Consider: <Code>(A AND B) OR (NOT C)</Code>. Read left to right: this is true whenever A and B are both true, OR whenever C is false — either path makes the whole thing true.</P>
          <Callout title="Order matters — use parentheses" tone="blue">Just like arithmetic has an order of operations (multiply before add), Boolean expressions have one too: NOT is evaluated first, then AND, then OR. Most programmers don't memorize this — they just add parentheses to make the intent unambiguous, and you should too.</Callout>
          <H3>De Morgan's Laws — a genuinely useful trick</H3>
          <P>Augustus De Morgan proved two rules that let you "push" a NOT through an AND/OR by flipping which operation it is:</P>
          <Code block>{`NOT (A AND B)  ==  (NOT A) OR (NOT B)
NOT (A OR B)   ==  (NOT A) AND (NOT B)`}</Code>
          <P>This shows up constantly in real code — "if NOT (logged in AND has permission)" is exactly equivalent to "if not logged in OR doesn't have permission," and the second version is usually easier to read.</P>
        </>),
      },
      {
        title: "Boolean Algebra Laws & Identities",
        body: () => (<>
          <P>Beyond De Morgan's Laws, Boolean algebra has a small set of identities that let you simplify an expression without ever building a truth table. You won't memorize these on day one, but you'll recognize them constantly once you know they exist — this chapter is the reference to come back to.</P>
          <DataTable headers={["Law", "Rule", "Plain meaning"]} rows={[
            ["Identity", "A AND 1 = A  ·  A OR 0 = A", "ANDing with true, or ORing with false, changes nothing"],
            ["Null", "A AND 0 = 0  ·  A OR 1 = 1", "ANDing with false always kills it; ORing with true always wins"],
            ["Idempotent", "A AND A = A  ·  A OR A = A", "combining a value with itself is a no-op"],
            ["Complement", "A AND (NOT A) = 0  ·  A OR (NOT A) = 1", "a thing and its opposite can't both be true, and one of them always is"],
            ["Commutative", "A AND B = B AND A", "order doesn't matter for AND or OR"],
            ["Distributive", "A AND (B OR C) = (A AND B) OR (A AND C)", "AND distributes over OR, just like multiplication over addition"],
            ["Absorption", "A AND (A OR B) = A", "the bigger expression collapses back to just A"],
          ]} />
          <MemoryHook>Most of these are exactly the algebra rules you already know from arithmetic — swap "AND" for multiply, "OR" for add, and almost every law here maps directly onto a rule you learned before you ever touched a computer.</MemoryHook>
        </>),
      },
      {
        title: "Boolean Logic in Real Code",
        body: () => (<>
          <P>Every <Code>if</Code> statement you'll ever write in Python, JavaScript, or any other language is a Boolean expression in disguise. <Code>if (age &gt;= 18)</Code> isn't magic — the comparison <Code>age &gt;= 18</Code> evaluates to a plain true/false value first, and the <Code>if</Code> simply branches on that result. Comparison operators (<Code>==</Code>, <Code>!=</Code>, <Code>&lt;</Code>, <Code>&gt;=</Code>) are just machines for producing a Boolean from two other values.</P>
          <Code block>{`if (isLoggedIn && hasPermission) {
  showDashboard();
}`}</Code>
          <P>That <Code>&&</Code> is the same AND you just learned — most languages simply spell it with two symbols instead of the word. <Code>||</Code> is OR, and <Code>!</Code> is NOT. Same three operations, new spelling.</P>
          <Callout title="Short-circuit evaluation — a preview" tone="green">Most languages are smart about AND/OR: in <Code>{"a() && b()"}</Code>, if <Code>a()</Code> comes back false, the language won't even bother calling <Code>b()</Code> — the answer is already known to be false. This is called short-circuit evaluation, and it's exactly why <Code>{"user && user.name"}</Code> is a common, safe pattern for checking something might not exist before reading a property off it. You'll meet this properly in the Programming phase.</Callout>
        </>),
      },
      {
        title: "Practice: Trace a Truth Table",
        body: () => (<>
          <P>Let's build a truth table for a three-variable expression by hand — the same process works no matter how complicated the expression gets. The expression: <Code>(A AND B) OR (NOT C)</Code>.</P>
          <P>Three variables means 2³ = 8 possible input combinations. Work through each row left to right: compute <Code>A AND B</Code> first, compute <Code>NOT C</Code> next, then OR those two results together.</P>
          <TruthTable cols={["A", "B", "C", "A AND B", "NOT C", "RESULT"]} rows={[
            [0, 0, 0, 0, 1, 1], [0, 0, 1, 0, 0, 0], [0, 1, 0, 0, 1, 1], [0, 1, 1, 0, 0, 0],
            [1, 0, 0, 0, 1, 1], [1, 0, 1, 0, 0, 0], [1, 1, 0, 1, 1, 1], [1, 1, 1, 1, 0, 1],
          ]} />
          <P>Notice the pattern: the result is true whenever C is 0 (look at the "NOT C" column), <em>or</em> whenever both A and B are 1 — exactly what the expression says, now proven for all eight possible cases instead of just trusted in the abstract.</P>
          <MemoryHook>When a truth table has n variables, it always has exactly 2ⁿ rows. Three variables, eight rows. Four variables, sixteen. This is the same exponential growth you'll see again when we talk about IP address ranges in Networking.</MemoryHook>
        </>),
      },
    ],
    retrieval: { q: "Which single gate flips a 0 to a 1 and a 1 to a 0?", a: "NOT" },
    recap: ["Boolean logic has exactly two values: true/false, written 1/0", "AND needs both inputs true; OR needs at least one", "NOT reverses a single input", "De Morgan's Laws let you push a NOT through AND/OR by swapping the operator", "&&, ||, and ! in real code are just AND, OR, and NOT spelled differently", "A truth table for n variables always has exactly 2ⁿ rows"],
  },
  {
    id: "logic:gates",
    icon: "⎔",
    title: "Logic Gates Deep Dive",
    blurb: "The physical circuits that implement Boolean operations — and the seven you'll see everywhere.",
    chapters: [
      {
        title: "From Algebra to Circuits",
        body: () => (<>
          <P>A logic gate is a tiny physical circuit — built from a handful of transistors — that takes one or two electrical inputs and produces one output, following exactly the truth table of a Boolean operation. An AND gate is a physical object that behaves like the AND operation. That's genuinely the whole idea: <Strong>math you can hold in your hand.</Strong></P>
          <P>Modern CPUs contain billions of these gates, each one no wider than a few atoms, switching on and off billions of times per second. Every one of them is still, fundamentally, just answering a true/false question.</P>
        </>),
      },
      {
        title: "The Seven Standard Gates",
        body: () => <SevenGatesChapter />,
      },
      {
        title: "Universal Gates — the one cool fact worth remembering",
        body: () => (<>
          <P>Here's a genuinely surprising fact: <Strong>you can build every other gate using only NAND gates.</Strong> AND, OR, NOT, XOR — all of it, constructed purely from repeated NAND. The same is separately true for NOR.</P>
          <Callout title="Why this matters" tone="green">This is why NAND and NOR are called "universal gates." Chip manufacturers exploit this: it's cheaper and more consistent to mass-produce one gate design and wire it in different patterns than to manufacture seven different physical components.</Callout>
          <P>For example, <Code>NOT A</Code> is just <Code>A NAND A</Code> — feed the same signal into both inputs of a NAND gate and you get an inverter for free.</P>
          <TruthTable cols={["A", "A NAND A", "= NOT A?"]} rows={[[0, 1, "\u2713"], [1, 0, "\u2713"]]} />
          <DeepDive title="Actually building AND out of NAND">
            <P>Talk is cheap — here's the real derivation. First, NAND the two inputs together: that gives you <Code>NOT (A AND B)</Code>. Then feed that single result into a second NAND gate with both of its inputs tied to that same value — which, as you just saw, turns any NAND into a plain inverter. Inverting <Code>NOT (A AND B)</Code> gives you back <Code>A AND B</Code>. Two NAND gates, wired in sequence, and you've built an AND gate using nothing else.</P>
          </DeepDive>
        </>),
      },
      {
        title: "Gates With More Than Two Inputs",
        body: () => (<>
          <P>Every gate so far has taken exactly one or two inputs, but that's a teaching simplification, not a hard rule. AND and OR both generalize cleanly to three, four, or more inputs: a 3-input AND is true only when all three inputs are 1; a 4-input OR is true if any one of the four is 1.</P>
          <TruthTable cols={["A", "B", "C", "A AND B AND C"]} rows={[[0, 0, 0, 0], [1, 1, 0, 0], [1, 0, 1, 0], [1, 1, 1, 1]]} />
          <Callout title="Fan-in" tone="blue">The number of inputs a single gate can accept is called its <Strong>fan-in</Strong>. Real chips have practical fan-in limits (often 2-8 inputs per gate) because too many inputs slow the gate down electrically — so a designer needing a 16-input AND will usually chain several smaller gates together instead of building one giant one.</Callout>
        </>),
      },
      {
        title: "Building a Half-Adder From Gates",
        body: () => (<>
          <P>Here's where gates stop being an abstract exercise and start looking like the inside of a real CPU. A <Strong>half-adder</Strong> is a tiny circuit that adds two single bits together — and it needs exactly two gates you already know: XOR and AND.</P>
          <P>Adding two bits can produce a two-bit answer (1 + 1 = 10 in binary), so a half-adder has two outputs: a <Strong>Sum</Strong> bit and a <Strong>Carry</Strong> bit.</P>
          <TruthTable cols={["A", "B", "Sum (A XOR B)", "Carry (A AND B)"]} rows={[[0, 0, 0, 0], [0, 1, 1, 0], [1, 0, 1, 0], [1, 1, 0, 1]]} />
          <P>Look closely: the Sum column is exactly the XOR truth table, and the Carry column is exactly the AND truth table. That's the entire circuit — one XOR gate and one AND gate, both fed the same two inputs, running in parallel.</P>
          <MemoryHook>XOR gives you "1 + 1 = 0, carry the 1" for free, because XOR is already "true when the inputs differ" — which is exactly what addition without a carry looks like at the bit level.</MemoryHook>
          <Callout title="Where this goes next" tone="green">Chain multiple half-adders together (adding in each previous carry) and you get a <Strong>full adder</Strong>. Chain eight full adders and you can add two entire bytes at once — this is genuinely, literally, how the arithmetic unit inside a real CPU works.</Callout>
        </>),
      },
      {
        title: "Reading a Circuit Diagram",
        body: () => (<>
          <P>Real circuit diagrams chain many gate symbols together, and signal always flows left to right: inputs enter on the left, pass through one or more gates, and the final output exits on the right. Reading one is mostly a matter of patience — trace one input value at a time through every gate it touches.</P>
          <Code block>{`A ─┐
    AND ── X ─┐
B ─┘             OR ── OUT
C ──────────────┘`}</Code>
          <P>To trace this: X = A AND B. Then OUT = X OR C. If A=1, B=1, C=0: X = 1 AND 1 = 1, then OUT = 1 OR 0 = 1. Change any single input and re-trace — that's the entire skill, repeated for circuits of any size.</P>
          <Callout title="Practice tip" tone="purple">When a diagram looks overwhelming, don't try to understand the whole thing at once. Pick one gate, find its inputs, compute its output, label it, and move to the next gate downstream. Big circuits are just many small, individually-simple gates in a row.</Callout>
        </>),
      },
    ],
    simulator: true,
    recapSimulator: GateSimulator,
    retrieval: { q: "Which two gates are called 'universal' because every other gate can be built from just them?", a: "NAND and NOR" },
    recap: ["A gate is a physical circuit implementing one Boolean operation", "Seven standard gates: AND, OR, NOT, NAND, NOR, XOR, XNOR", "XOR = 1 when inputs differ; XNOR = 1 when inputs match", "NAND and NOR are 'universal' — every other gate can be built from just one of them", "A gate's input count is its fan-in; real chips limit it for speed", "A half-adder is just one XOR (sum) and one AND (carry) run in parallel — the seed of every CPU's arithmetic unit"],
  },
  {
    id: "logic:binhex",
    icon: "01",
    title: "Binary & Hexadecimal",
    blurb: "Why computers count in twos, and why programmers cheat by counting in sixteens instead.",
    chapters: [
      {
        title: "Why Base 2?",
        body: () => (<>
          <P>You count in base 10 because you have ten fingers — decimal has ten symbols (0-9) before it needs a second column. A computer has no fingers, but it does have transistors that are reliably either "on" or "off." Building a component that reliably distinguishes ten different voltage levels is hard and error-prone. Building one that reliably distinguishes <Strong>two</Strong> states — on/off, high/low — is cheap, fast, and extremely reliable. That's the entire reason binary (base 2) won.</P>
          <P>Every number system works the same way: each position is worth a power of the base. In decimal, the digits in "203" are worth 2×100 + 0×10 + 3×1. In binary, each position is worth a power of two instead of ten.</P>
        </>),
      },
      {
        title: "Converting Between Bases",
        body: () => (<>
          <P>To read a binary number, write the power-of-two value above each position, then add up the ones where there's a 1:</P>
          <Code block>{`  128  64  32  16   8   4   2   1
    1   1   0   0   1   0   1   0    =  11001010

128 + 64 + 8 + 2 = 202`}</Code>
          <P>Converting decimal to binary works in reverse: repeatedly find the largest power of two that fits, subtract it, and repeat.</P>
          <Code block>{`202 → 128 fits (202-128=74) → 64 fits (74-64=10)
    → 32 doesn't fit → 16 doesn't fit → 8 fits (10-8=2)
    → 4 doesn't fit → 2 fits (2-2=0) → 1 doesn't fit
    
    result: 1 1 0 0 1 0 1 0`}</Code>
          <BaseConverter />
        </>),
      },
      {
        title: "Hexadecimal as Binary Shorthand",
        body: () => (<>
          <P>Binary is precise but painful to read — a single byte is 8 characters of 0s and 1s, and a memory address can be 16+ characters long. Hexadecimal (base 16) exists purely to make binary shorter for humans to read, because <Strong>exactly 4 binary bits map to exactly 1 hex digit</Strong> with no remainder.</P>
          <BinaryHexDiagram />
          <P>Hex needs 6 symbols beyond 0-9, so it borrows letters: A=10, B=11, C=12, D=13, E=14, F=15. A full byte like <Code>11001010</Code> splits into two 4-bit chunks — <Code>1100</Code> and <Code>1010</Code> — which read directly as <Code>C</Code> and <Code>A</Code>, giving the hex value <Code>CA</Code>.</P>
          <Callout title="Where you'll actually see this" tone="blue">MAC addresses, IPv6 addresses, memory addresses, and color codes in CSS (<Code>#d97757</Code>) are all written in hex for exactly this reason — it's the most human-readable way to write down what's fundamentally binary data.</Callout>
        </>),
      },
      {
        title: "Octal — Binary in Groups of Three",
        body: () => (<>
          <P>Hex groups bits by four; octal (base 8) groups them by three, since 2³ = 8. It's far less common today, but it survives in exactly one place you'll meet very soon: <Strong>Unix and Linux file permissions.</Strong></P>
          <P>A Unix permission is three groups of three bits each — read, write, execute — for owner, group, and everyone else. Each group of three bits is just an octal digit.</P>
          <TruthTable cols={["r", "w", "x", "Octal digit"]} rows={[[0, 0, 0, 0], [1, 0, 0, 4], [0, 1, 0, 2], [0, 0, 1, 1], [1, 1, 1, 7]]} />
          <P>That's why you'll type <Code>chmod 755</Code> in a terminal to make a file readable/writable/executable by you and read/execute-only for everyone else — <Code>7</Code> is <Code>111</Code> (all three permissions), <Code>5</Code> is <Code>101</Code> (read and execute, no write). You already know exactly why those numbers mean what they mean.</P>
          <MemoryHook>Hex = binary in groups of 4. Octal = binary in groups of 3. Same idea, different grouping — and octal's one real home today is Unix permission bits, which you'll use constantly in the Command Line phase.</MemoryHook>
        </>),
      },
      {
        title: "Negative Numbers: Two's Complement",
        body: () => (<>
          <P>Everything so far has been positive numbers. But computers need negative numbers too, and there's no minus sign in binary — just 0s and 1s. The standard solution is called <Strong>two's complement</Strong>, and the trick is almost sneaky in its simplicity: to negate a number, flip every bit, then add 1.</P>
          <Code block>{`  00000101   (5)
flip every bit:
  11111010
add 1:
  11111011   (this represents -5)`}</Code>
          <P>The very first bit of a two's-complement number acts as a sign flag — 0 means positive, 1 means negative — which is why an 8-bit signed number can only count up to 127 positive instead of 255: half the range is spent representing negative values.</P>
          <Callout title="Foreshadowing" tone="red">This is the exact mechanism behind the Year 2038 case study later in this module. When a signed number runs out of positive room and overflows, two's complement doesn't error — it silently wraps around into a negative number instead. Keep this chapter in mind when you get there.</Callout>
        </>),
      },
      {
        title: "Practice: Convert These By Hand",
        body: () => (<>
          <P>Work through these the same way as the worked examples earlier, then check yourself against the answer underneath each one.</P>
          <DataTable headers={["Problem", "Answer"]} rows={[
            ["Convert 45 (decimal) to binary", "00101101 — 32+8+4+1 = 45"],
            ["Convert 11010110 (binary) to hex", "D6 — 1101=D, 0110=6"],
            ["Convert 3F (hex) to decimal", "63 — (3×16) + 15"],
            ["Convert 100 (decimal) to octal", "144 — three groups: 001 100 100"],
          ]} />
          <P>If any of these felt slow, that's expected — this is a skill that gets fast with repetition, not something you're meant to memorize instantly. The Base Converter tool a couple of chapters back is exactly for building that speed.</P>
        </>),
      },
    ],
    retrieval: { q: "How many binary bits does a single hexadecimal digit represent?", a: "4 bits" },
    recap: ["Computers use binary because transistors reliably distinguish 2 states, not 10", "Each binary position is worth a power of 2, just like decimal positions are powers of 10", "Hex exists as human-friendly shorthand — 1 hex digit = exactly 4 bits", "You'll see hex in MAC addresses, IPv6, memory addresses, and color codes", "Octal groups bits by 3 — it's why Unix permissions like chmod 755 use those exact numbers", "Two's complement negates a number by flipping every bit and adding 1"],
  },
  {
    id: "logic:bitwise",
    icon: "&",
    title: "Bitwise Operations",
    blurb: "Applying AND, OR, and XOR directly to the individual bits inside a number — the tool every low-level language gives you.",
    chapters: [
      {
        title: "Operating on Bits Directly",
        body: () => (<>
          <P>Every language that gets close to the hardware — C, C++, and even Python and JavaScript when you need it — gives you operators that apply Boolean logic to every bit of a number simultaneously, in parallel, in a single instruction.</P>
          <DataTable headers={["Operator", "Name", "Effect"]} rows={[["&", "Bitwise AND", "1 where both bits are 1"], ["|", "Bitwise OR", "1 where either bit is 1"], ["^", "Bitwise XOR", "1 where bits differ"], ["~", "Bitwise NOT", "flips every bit"], ["<<", "Left shift", "moves bits left, fills with 0"], [">>", "Right shift", "moves bits right"]]} />
          <P>These aren't the same as the logical <Code>&&</Code> / <Code>||</Code> you use in an <Code>if</Code> statement — those look at a whole value as one true/false. Bitwise operators look at every individual bit position independently.</P>
          <BitwiseVisualizer />
        </>),
      },
      {
        title: "Bit Sets & Masks",
        body: () => (<>
          <P>One of the most common real-world uses of bitwise AND is checking a specific flag inside a number that's packed with many true/false settings at once. If bit 2 of a settings byte means "notifications enabled," you can check it with a <Strong>mask</Strong> — a number with only that bit set to 1 — and AND it against the settings.</P>
          <Code block>{`settings = 00101100
mask     = 00000100   (checks bit 2 only)
result   = 00000100   → non-zero, so the flag IS set`}</Code>
          <P>This pattern is everywhere in systems programming: file permission bits, network protocol flags, graphics pixel formats. One number, many independent yes/no answers, checked instantly with a single AND.</P>
          <MemoryHook>A bitmask is a stencil. Lay it over a number and AND — only the holes in the stencil let anything through.</MemoryHook>
          <DeepDive title="Where the word 'mask' actually comes from">
            <P>It's not a computing invention — it's borrowed straight from stencil masking in printing and photography, where a physical mask blocks light or ink from reaching everything except the shapes you want exposed. A bitmask does the exact same job to a number: it blocks every bit position except the ones you specifically want to read or change.</P>
          </DeepDive>
        </>),
      },
      {
        title: "Shifting as Multiplication",
        body: () => (<>
          <P>Shifting bits left or right has a clean mathematical meaning: shifting left by one position doubles the number; shifting right by one halves it (dropping any remainder).</P>
          <Code block>{`00000101  (5)
<< 1
00001010  (10)   →  shifted left once = 5 × 2

00001010  (10)
>> 1
00000101  (5)    →  shifted right once = 10 ÷ 2`}</Code>
          <P>This is why you'll sometimes see old, performance-obsessed code write <Code>{'x << 3'}</Code> instead of <Code>x * 8</Code> — on very simple processors a shift is faster than a multiply. Modern compilers do this optimization automatically now, so you rarely need to by hand.</P>
        </>),
      },
      {
        title: "Setting, Clearing, and Toggling Bits",
        body: () => (<>
          <P>Three small recipes cover almost everything you'll ever need to do to an individual bit, and each one uses a different bitwise operator on purpose:</P>
          <DataTable headers={["Goal", "Recipe", "Why it works"]} rows={[
            ["Set a bit to 1", "value OR mask", "OR with 1 always produces 1, and OR with 0 leaves other bits alone"],
            ["Clear a bit to 0", "value AND (NOT mask)", "ANDing with 0 always produces 0, and ANDing with 1 leaves other bits alone"],
            ["Toggle a bit", "value XOR mask", "XOR with 1 flips it, XOR with 0 leaves other bits alone"],
          ]} />
          <P>In every recipe, the "mask" is a number with a single 1 in exactly the bit position you want to change and 0s everywhere else — the same masking idea from a couple chapters back, just now used to write instead of only read.</P>
          <MemoryHook>OR to turn on, AND-with-NOT to turn off, XOR to flip. Three operators, three verbs, and together they cover every single-bit edit you'll ever need to make.</MemoryHook>
        </>),
      },
      {
        title: "Bitwise in the Real World",
        body: () => (<>
          <P>This isn't academic — bitwise operations are doing real work all around you, right now:</P>
          <H3>Unix file permissions</H3>
          <P>Each of read/write/execute for owner/group/other is one bit — nine bits total, packed and checked with exactly the AND-masking pattern from earlier in this topic.</P>
          <H3>Colors on screen</H3>
          <P>A CSS color like <Code>#d97757</Code> packs three 8-bit numbers (red, green, blue) into one value. Extracting just the red channel is a shift-and-mask: shift right 16 places, then AND with <Code>0xFF</Code> to keep only the lowest 8 bits.</P>
          <H3>Network protocol flags</H3>
          <P>A single byte in a network packet header often carries several independent true/false flags — exactly the bit-set pattern you learned two chapters ago. You'll meet this again directly when the Networking phase covers packet headers.</P>
          <Callout title="The throughline" tone="green">Every one of these "real world" uses is the exact same handful of operators you just learned, applied to a slightly different problem. Nothing new to learn here — just recognizing the pattern in the wild.</Callout>
        </>),
      },
    ],
    retrieval: { q: "What does shifting a binary number one position to the left do to its value?", a: "Doubles it" },
    recap: ["Bitwise operators (&, |, ^, ~) act on every bit independently, not the whole value at once", "A bitmask uses AND to check one specific flag inside a number packed with many", "Left shift ×2, right shift ÷2, per position shifted", "OR sets a bit, AND-with-NOT clears a bit, XOR toggles a bit", "Unix permissions, CSS colors, and network flag bytes are all real-world bitwise masking"],
  },
  {
    id: "logic:sequential",
    icon: "⏱",
    title: "Combinational vs. Sequential Logic",
    blurb: "The difference between circuits that just react, and circuits that remember — the beginning of computer memory.",
    chapters: [
      {
        title: "Combinational Logic — no memory",
        body: () => (<>
          <P>Every circuit built purely from AND/OR/NOT-family gates so far has one property in common: the output depends <em>only</em> on the current inputs, right now. Feed it the same inputs tomorrow and you get the same output. This is called <Strong>combinational logic</Strong> — it has no concept of "before."</P>
          <P>Real combinational building blocks you'll encounter: an <Strong>adder</Strong> (adds two binary numbers), a <Strong>multiplexer</Strong> (picks one of several inputs to pass through, based on a selector), and a <Strong>decoder</Strong> (turns a binary code into a single "which one" signal — the reverse of a multiplexer).</P>
        </>),
      },
      {
        title: "Sequential Logic — circuits that remember",
        body: () => (<>
          <P>A computer needs to remember things — the current value in a variable, the next instruction to run, whether a key is currently held down. None of that is possible with combinational logic alone, because it never remembers anything between one instant and the next. The fix is a circuit called a <Strong>flip-flop</Strong>: a tiny loop of gates that can hold one bit of state indefinitely, changing only when explicitly told to.</P>
          <DataTable headers={["Flip-flop", "Behavior"]} rows={[["SR (Set-Reset)", "Set input forces the stored bit to 1, Reset forces it to 0"], ["D (Data)", "Stores whatever value is on the input the moment the clock ticks"], ["JK", "A refined SR that has no invalid input combination"], ["T (Toggle)", "Flips its stored value every time the clock ticks"]]} />
          <Callout title="The clock signal" tone="purple">Sequential circuits are synchronized by a clock — a signal that pulses at a steady rate (your CPU's "3.5 GHz" is literally its clock pulsing 3.5 billion times per second). Flip-flops only update on a clock pulse, which is what keeps billions of gates changing state in a coordinated, predictable order instead of chaos.</Callout>
        </>),
      },
      {
        title: "Registers & Counters — the bridge to Hardware",
        body: () => (<>
          <P>Chain 8 flip-flops together and you have a <Strong>register</Strong> — a small storage unit that holds one full byte, exactly like the registers you'll meet in the Hardware phase (accumulator, program counter, and the rest). Wire flip-flops to increment automatically on each clock tick and you have a <Strong>counter</Strong> — used for everything from a CPU's program counter to a digital clock's seconds display.</P>
          <MemoryHook>Combinational logic is a calculator: same input, same answer, every time, no memory. Sequential logic is a diary: it remembers what happened before, and that memory is exactly what a "register" in a CPU actually is.</MemoryHook>
          <Callout title="Where this goes next" tone="green">Every register inside a real CPU — the accumulator, the program counter, the instruction register — is built from exactly the flip-flops you just learned. That's the entire bridge into the Hardware phase: you already understand the core building block.</Callout>
        </>),
      },
      {
        title: "Multiplexers & Decoders, Worked",
        body: () => (<>
          <P>A <Strong>multiplexer</Strong> ("mux") is a selector switch built from gates: it has several data inputs, one "select" input, and routes exactly one chosen data input through to the output. A 2-to-1 mux picks between two inputs based on a single select bit.</P>
          <TruthTable cols={["Select", "Output"]} rows={[[0, "= Input A"], [1, "= Input B"]]} />
          <P>A <Strong>decoder</Strong> runs the idea in reverse: it takes a binary code in and activates exactly one of many output lines. A 2-to-4 decoder takes a 2-bit code and lights up exactly one of four outputs:</P>
          <TruthTable cols={["Input", "Out0", "Out1", "Out2", "Out3"]} rows={[["00", 1, 0, 0, 0], ["01", 0, 1, 0, 0], ["10", 0, 0, 1, 0], ["11", 0, 0, 0, 1]]} />
          <Callout title="Where you'll see these again" tone="blue">A CPU uses a decoder to turn a binary instruction code into "which specific operation to run." Memory chips use decoders to turn an address into "which specific memory cell to access." Same tiny circuit, two of the most important jobs in the whole machine.</Callout>
        </>),
      },
      {
        title: "State Machines — Logic That Remembers Where It's Been",
        body: () => (<>
          <P>Sequential logic's real superpower shows up when you use stored bits to represent not just data, but a <Strong>current situation</Strong> — a "state" — that determines how the circuit reacts to new input. This pattern is called a <Strong>finite state machine</Strong>, and once you see it, you'll notice it everywhere in computing.</P>
          <P>A traffic light is the classic example: it's always in exactly one state (Red, Green, or Yellow), a timer triggers the transition to the next state, and which state it's currently in determines everything about its behavior.</P>
          <Code block>{`Red ──(timer)──> Green ──(timer)──> Yellow ──(timer)──> Red`}</Code>
          <Callout title="This shows up constantly later" tone="purple">A TCP network connection is a state machine (Closed → Listening → Established → Closing). A game character is a state machine (Idle → Walking → Jumping). A vending machine, a login flow, a traffic light — all the same underlying idea: a small set of states, and rules for what moves you from one to the next. You're building the mental model for all of it right now.</Callout>
        </>),
      },
      {
        title: "Clock Speed & Why It Matters",
        body: () => (<>
          <P>When a CPU is advertised as "3.5 GHz," that number is literally the frequency of its clock signal — 3.5 billion pulses per second, each one an opportunity for every flip-flop in the chip to update simultaneously.</P>
          <P>Why not just make the clock infinitely fast? Because every real gate has a tiny <Strong>propagation delay</Strong> — the physical time it takes for a change at its input to show up at its output, caused by nothing more exotic than electricity not moving instantaneously. If the clock ticks faster than signals can finish propagating through a chain of gates, the circuit reads a value before it's actually ready and gets the wrong answer.</P>
          <MemoryHook>Clock speed is a promise: "every signal in this chip will have finished settling by the time the next tick arrives." Push the clock faster than that promise can be kept, and the chip doesn't get faster — it gets wrong.</MemoryHook>
        </>),
      },
    ],
    recap: ["Combinational logic has no memory — same inputs always give the same output", "Sequential logic (flip-flops) can hold one bit of state indefinitely", "A clock signal synchronizes when sequential circuits are allowed to change", "Chained flip-flops become registers and counters — literally what's inside a CPU", "A multiplexer selects one of several inputs; a decoder activates one of several outputs", "A finite state machine uses stored state to decide how to react to new input — TCP connections and game logic both work this way", "Clock speed is limited by propagation delay — how long it takes a signal to settle through a gate"],
  },
  {
    id: "logic:y2038",
    icon: "⏳",
    title: "Case Study: The Year 2038 Problem",
    blurb: "What happens when a 32-bit number runs out of room — a real deadline caused entirely by binary arithmetic.",
    chapters: [
      {
        title: "What Is Unix Time?",
        body: () => (<>
          <P>Almost every computer system tracks the current moment as a single number: the count of seconds elapsed since midnight, January 1st, 1970 (an arbitrary but universally agreed-upon starting line called "the Unix epoch"). This single number — called Unix time — is simpler to do math with than a calendar date, so it's used everywhere under the hood: file timestamps, network protocols, database records.</P>
        </>),
      },
      {
        title: "The 32-Bit Signed Integer Limit",
        body: () => (<>
          <P>For decades, that Unix time counter was stored as a 32-bit signed integer — the standard whole-number size on most systems at the time. A 32-bit number has exactly 2³² possible values. Because it's <em>signed</em> (able to represent negative numbers, for dates before 1970), half of that range is reserved for negative values, leaving a maximum positive value of:</P>
          <Code block>{`2^31 - 1  =  2,147,483,647`}</Code>
          <P>That's the largest number of seconds-since-1970 a 32-bit signed integer can ever hold. One second past that number, the value has nowhere left to go — it overflows, and in two's-complement arithmetic (the standard way signed numbers are represented in binary), the very next value wraps around to the most negative number possible instead of continuing upward.</P>
          <DeepDive title="Why the range is asymmetric by exactly one">
            <P>Notice the max positive value is 2,147,483,647, but the min negative value one chapter ago went to -2,147,483,648 — one further. That's not a typo. Two's complement spends exactly one bit pattern — all zeros — representing the number 0 itself, and that pattern comes out of the positive side's budget. So positives get 0 through 2,147,483,647 (2,147,483,648 values including zero), while negatives get the entire remaining range down to -2,147,483,648. The asymmetry is exactly one value wide, and it's the direct fingerprint of how two's complement is built.</P>
          </DeepDive>
        </>),
      },
      {
        title: "January 19, 2038, 03:14:07 UTC",
        body: () => (<>
          <P>That's the exact moment 2,147,483,647 seconds will have passed since the Unix epoch. One second later, any system still using a 32-bit signed integer for time will roll over to a negative number — which most software interprets as December 13, 1901. Timestamps break, scheduled events misfire, anything comparing "is this date before or after that one" gets the wrong answer.</P>
          <Callout title="This is a real, active engineering problem" tone="red">This isn't hypothetical or historical — it's a genuine deadline still being worked on today, in the same category as the Y2K problem (which was a formatting convention, not a hardware limit). Embedded systems, older databases, and legacy code with a fixed 32-bit time field are all potentially affected, and the fix — moving to a 64-bit time value — has been rolling out gradually for years precisely because so much software assumes the old size.</Callout>
          <P>A 64-bit signed integer, by contrast, can represent seconds up to roughly 292 billion years past 1970 — long enough that no one needs to worry about a repeat.</P>
        </>),
      },
      {
        title: "Why It Wraps to a Negative Date, Specifically",
        body: () => (<>
          <P>Remember two's complement from a few topics back? This is exactly where it matters. The largest positive value a 32-bit signed integer can hold is <Code>01111111 11111111 11111111 11111111</Code> — a 0 followed by all 1s. Add one more second:</P>
          <Code block>{`  01111111 11111111 11111111 11111111   (2,147,483,647)
+ 1
  10000000 00000000 00000000 00000000   (this bit pattern)`}</Code>
          <P>That result — a leading 1 followed by all 0s — isn't an error flag. In two's complement, a leading 1 means "negative," and this exact bit pattern decodes to <Code>-2,147,483,648</Code>, the most negative number the format can represent. The counter doesn't stop or crash; it silently becomes a huge negative number, which most software then reads as a date in 1901 — 1970 minus roughly 68 years.</P>
          <MemoryHook>Overflow in two's complement doesn't fail loudly. It fails quietly, by wrapping straight into the most negative value available — which is exactly what makes bugs like this so dangerous: nothing crashes, the software just becomes confidently wrong.</MemoryHook>
        </>),
      },
      {
        title: "The Fix, and Who's Already Safe",
        body: () => (<>
          <P>The fix is conceptually simple: store time as a 64-bit integer instead of 32-bit. In practice, it's a slow migration, because so much existing software, file formats, and hardware assumes the old 32-bit size.</P>
          <DataTable headers={["System", "Status"]} rows={[
            ["Modern 64-bit Linux and macOS", "Already using 64-bit time internally — safe"],
            ["Most modern databases", "Migrated or migrating to 64-bit timestamp columns"],
            ["Older 32-bit embedded systems", "Often still vulnerable — industrial control, older IoT devices"],
            ["Legacy file formats with fixed-width date fields", "Vulnerable unless the format itself is revised"],
          ]} />
          <Callout title="Why this takes decades, not months" tone="blue">Changing a stored value's size isn't just a software update — file formats change, network protocols change, and hardware that's already deployed in the field (think industrial equipment expected to run for 30+ years) may never get updated at all. This is a genuine, multi-decade migration, and it's already well underway.</Callout>
        </>),
      },
      {
        title: "Not Alone: Other Overflow Deadlines",
        body: () => (<>
          <P>The Year 2038 problem is the most famous example of a class of bugs, not a one-off. Anywhere a system counts something with a fixed number of bits, there's a rollover date lurking, waiting for enough time to pass.</P>
          <DataTable headers={["Rollover", "Cause"]} rows={[
            ["GPS week rollover", "GPS satellites originally counted weeks in a 10-bit field, rolling over roughly every 19.7 years — it has already happened twice, in 1999 and 2019"],
            ["NTP rollover (2036)", "The Network Time Protocol's own clock format overflows in 2036, two years before Unix time does"],
            ["Y2K (already passed)", "Not a binary overflow — a two-digit year field simply couldn't represent 2000, a formatting choice rather than a hardware limit"],
          ]} />
          <MemoryHook>Any time you see a fixed-size counter — 8 bits, 16 bits, 32 bits — ask "what happens the instant this runs out of room?" That single question predicts an entire category of real, dated bugs before they happen.</MemoryHook>
        </>),
      },
    ],
    retrieval: { q: "Why does the Year 2038 problem happen at exactly that date?", a: "A 32-bit signed integer counting seconds since 1970 runs out of room and overflows" },
    recap: ["Unix time counts seconds since Jan 1, 1970", "A 32-bit signed integer maxes out at 2,147,483,647", "That limit is reached on Jan 19, 2038 — one second later, the value overflows to a negative number", "This is exactly why understanding binary number representation has real, dated consequences", "Two's complement overflow wraps silently to the most negative value — it doesn't crash, it becomes confidently wrong", "This is one of several fixed-width rollover bugs, alongside GPS week rollover and the 2036 NTP rollover"],
  },
  {
    id: "logic:simplification",
    icon: "≡",
    title: "Boolean Laws & Simplification",
    blurb: "The algebra that lets you shrink a tangled expression — or circuit — down to its simplest equivalent form.",
    chapters: [
      {
        title: "Why Simplification Matters",
        body: () => (<>
          <P>Every Boolean expression can be written many different ways that all produce the identical truth table. <Strong>Simplification</Strong> is the art of finding the shortest of those equivalent forms — and it isn't just tidiness. In real hardware, each operator in an expression is a physical gate consuming space, power, and time. A simpler expression is a literally smaller, faster, cheaper circuit.</P>
          <MemoryHook>Two expressions with the same truth table are the same expression, no matter how different they look. Simplification is just finding the cheapest disguise for a logic function you already have.</MemoryHook>
        </>),
      },
      {
        title: "The Basic Laws",
        body: () => (<>
          <P>Boolean algebra has its own laws, many mirroring ordinary algebra and a few that are gloriously unique to a two-value world:</P>
          <DataTable headers={["Law", "Form"]} rows={[
            ["Identity", "A AND 1 = A · A OR 0 = A"],
            ["Null", "A AND 0 = 0 · A OR 1 = 1"],
            ["Idempotent", "A AND A = A · A OR A = A"],
            ["Complement", "A AND NOT A = 0 · A OR NOT A = 1"],
            ["Double negation", "NOT (NOT A) = A"],
          ]} />
          <P>The Null and Idempotent laws have no everyday-arithmetic equivalent — <Code>A OR A = A</Code> would be nonsense with numbers, but makes perfect sense when the only values that exist are true and false.</P>
        </>),
      },
      {
        title: "Commutative, Associative, Distributive",
        body: () => (<>
          <P>Three structural laws behave almost exactly as they do in ordinary algebra, letting you rearrange and regroup freely:</P>
          <DataTable headers={["Law", "Meaning"]} rows={[
            ["Commutative", "Order doesn't matter: A AND B = B AND A"],
            ["Associative", "Grouping doesn't matter: (A AND B) AND C = A AND (B AND C)"],
            ["Distributive", "A AND (B OR C) = (A AND B) OR (A AND C)"],
          ]} />
          <Callout title="One surprising bonus" tone="blue">Unlike ordinary algebra, Boolean logic distributes <em>both</em> ways — OR distributes over AND just as AND distributes over OR. That symmetry is a recurring theme: nearly every Boolean law has a mirror-image twin, found by swapping AND↔OR and 0↔1.</Callout>
        </>),
      },
      {
        title: "De Morgan's Laws",
        body: () => (<>
          <P>The two most useful laws in all of digital logic, De Morgan's laws describe exactly how negation interacts with AND and OR:</P>
          <Code block>{`NOT (A AND B)  =  (NOT A) OR  (NOT B)
NOT (A OR  B)  =  (NOT A) AND (NOT B)`}</Code>
          <P>In words: negating a whole expression flips every operator (AND becomes OR, OR becomes AND) and negates every term. This is what lets a circuit built only from NAND gates implement anything at all — De Morgan's laws are the bridge between the universal NAND gate and every other operation.</P>
          <MemoryHook>"Break the line, change the sign." When you break a negation bar across an AND or OR, the operation underneath flips. It's the single most-used trick in simplifying real logic.</MemoryHook>
        </>),
      },
      {
        title: "Karnaugh Maps",
        body: () => (<>
          <P>A <Strong>Karnaugh map</Strong> (K-map) is a visual method for simplifying a Boolean expression by hand, laying out a truth table as a grid arranged so that adjacent cells differ by exactly one variable. Groups of adjacent 1s can then be circled and read off as a single simplified term — turning algebra into a spatial pattern-matching task.</P>
          <Callout title="Why the odd ordering" tone="purple">K-map columns are labeled 00, 01, 11, 10 — not 00, 01, 10, 11 — specifically so that any two neighbors (including the wrap-around edges) differ by only one bit. That single-bit-change ordering is called Gray code, and it's the entire reason the visual grouping trick works.</Callout>
        </>),
      },
      {
        title: "From Simplified Expression Back to Circuit",
        body: () => (<>
          <P>The payoff of all this algebra is concrete: simplify the expression, then build the smaller circuit. An expression needing four gates before simplification might need only two afterward — half the physical hardware, drawing half the power, for the identical logical result. Modern chip-design software does this automatically at massive scale, but it's running exactly the laws from this topic underneath.</P>
          <Callout title="Where this connects" tone="green">This closes the loop on the whole Logic phase: truth tables (what a function does) → Boolean expressions (how to write it) → these laws (how to shrink it) → gates and circuits (how to build it physically). Every later phase runs on hardware that was, at some level, simplified using exactly these rules.</Callout>
        </>),
      },
    ],
    retrieval: { q: "State De Morgan's law for NOT (A AND B).", a: "NOT (A AND B) = (NOT A) OR (NOT B) — negation flips the operator and negates each term" },
    recap: ["Simplification finds the shortest expression with the same truth table — a literally smaller, cheaper circuit", "Basic laws (identity, null, idempotent, complement) include some with no arithmetic equivalent", "Commutative, associative, and distributive laws let you rearrange freely — and Boolean distributes both ways", "De Morgan's laws flip operators across a negation, bridging NAND to every other operation", "Karnaugh maps turn simplification into visual grouping, using Gray-code ordering so neighbors differ by one bit", "Simplifying an expression directly produces a smaller physical circuit — the concrete payoff of the whole phase"],
  },
];
/* ══════════════════════ INTERACTIVE: FETCH-DECODE-EXECUTE STEPPER ══════════════════════ */
const CYCLE_STAGES = [
  { name: "Fetch", desc: "The CPU reads the next instruction from memory, using the address currently held in the program counter." },
  { name: "Decode", desc: "The instruction register figures out what the instruction actually means — which operation, and which operands it needs." },
  { name: "Execute", desc: "The ALU (or FPU, for decimals) actually performs the operation — an add, a comparison, a jump to somewhere else in the program." },
  { name: "Store", desc: "The result is written back — into a register, or out to memory — and the program counter advances to the next instruction." },
];
function CPUCycleStepper() {
  const { t } = useT();
  const [stage, setStage] = useState(0);
  const [cycles, setCycles] = useState(0);
  const step = () => setStage((s) => { const next = (s + 1) % 4; if (next === 0) setCycles((c) => c + 1); return next; });
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: 26, margin: "24px 0" }}>
      <div style={{ fontFamily: F_MONO, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: t.accent, marginBottom: 16 }}>🎮 Interactive · Fetch–Decode–Execute Stepper</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {CYCLE_STAGES.map((s, i) => (
          <div key={s.name} style={{ flex: "1 1 110px", textAlign: "center", padding: "14px 8px", borderRadius: 10, background: i === stage ? t.accent : t.surfaceAlt, color: i === stage ? "#fff" : t.textMuted, fontFamily: F_UI, fontWeight: 700, fontSize: 13, transition: "background .15s" }}>
            {i + 1}. {s.name}
          </div>
        ))}
      </div>
      <p style={{ fontFamily: F_BODY, color: t.textSecondary, fontSize: 14.5, lineHeight: 1.7, minHeight: 54 }}>{CYCLE_STAGES[stage].desc}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontFamily: F_MONO, fontSize: 12, color: t.textMuted }}>Completed cycles: {cycles}</span>
        <button onClick={step} style={{ background: t.accent, color: "#fff", border: 0, borderRadius: 9, padding: "10px 22px", fontFamily: F_UI, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>Step →</button>
      </div>
    </div>
  );
}

/* ══════════════════════ INTERACTIVE: MEMORY HIERARCHY SPEED LADDER ══════════════════════ */
const MEM_LEVELS = [
  { name: "Register", time: 0.3, desc: "Inside the CPU itself — as fast as physically possible, and vanishingly small in capacity." },
  { name: "L1 Cache", time: 1, desc: "A tiny, extremely fast memory built directly into the CPU core." },
  { name: "L2 / L3 Cache", time: 10, desc: "Larger than L1, still on-chip, often shared across cores." },
  { name: "RAM", time: 100, desc: "Main memory — much bigger than cache, physically further from the CPU, and slower to reach." },
  { name: "SSD", time: 100000, desc: "Solid-state storage — no moving parts, but still roughly a thousand times slower than RAM." },
  { name: "HDD", time: 10000000, desc: "Spinning platters — a physical read/write arm has to move before data can even be reached." },
];
function fmtTime(ns) {
  if (ns < 1000) return `${ns} ns`;
  if (ns < 1000000) return `${(ns / 1000).toFixed(1)} µs`;
  return `${(ns / 1000000).toFixed(ns >= 10000000 ? 0 : 1)} ms`;
}
function MemoryHierarchyVisualizer() {
  const { t } = useT();
  const [sel, setSel] = useState(null);
  const maxLog = Math.log10(MEM_LEVELS[MEM_LEVELS.length - 1].time);
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: 26, margin: "24px 0" }}>
      <div style={{ fontFamily: F_MONO, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: t.accent, marginBottom: 18 }}>🎮 Interactive · Memory Speed Ladder (tap a level)</div>
      {MEM_LEVELS.map((lvl, i) => {
        const pct = Math.max((Math.log10(lvl.time < 1 ? 1 : lvl.time) / maxLog) * 100, 4);
        const isSel = sel === i;
        return (
          <div key={lvl.name} onClick={() => setSel(isSel ? null : i)} style={{ cursor: "pointer", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontFamily: F_UI, marginBottom: 5 }}>
              <span style={{ color: isSel ? t.accent : t.text, fontWeight: 600 }}>{lvl.name}</span>
              <span style={{ fontFamily: F_MONO, color: t.textMuted, fontSize: 12.5 }}>{fmtTime(lvl.time)}</span>
            </div>
            <div style={{ height: 11, background: t.surfaceAlt, borderRadius: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: isSel ? t.accent : t.blue, borderRadius: 6, transition: "width .2s" }} />
            </div>
            {isSel && <div style={{ fontSize: 12.5, color: t.textMuted, fontFamily: F_BODY, marginTop: 7, lineHeight: 1.5 }}>{lvl.desc}</div>}
          </div>
        );
      })}
      <Callout title="The whole point of this ladder" tone="green">Every step down is roughly 10-1000× slower than the one above it, and roughly 10-1000× bigger in capacity. A CPU spends enormous engineering effort trying to keep the data it needs up in the fast, tiny levels — that entire discipline is called cache management, and it's a huge part of why some code runs dramatically faster than other code that does "the same" work.</Callout>
    </div>
  );
}

/* ══════════════════════ DIAGRAM: THE FULL-STACK ══════════════════════ */
function FullStackDiagram() {
  const { t } = useT();
  const layers = [
    { name: "Applications", ex: "browser, code editor, games", c: t.accent },
    { name: "Frameworks / Libraries", ex: "reusable building blocks", c: t.blue },
    { name: "System Shell", ex: "bash, zsh, PowerShell", c: t.blue },
    { name: "Operating System Kernel", ex: "manages every resource", c: t.green },
    { name: "Device Drivers", ex: "translators for hardware", c: t.green },
    { name: "Firmware / BIOS", ex: "runs before any OS", c: t.purple },
    { name: "CPU + Memory", ex: "actually computes", c: t.purple },
    { name: "Physical Circuit Board", ex: "transistors, voltage", c: t.textMuted },
  ];
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 22, margin: "20px 0" }}>
      <div style={{ fontFamily: F_MONO, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: t.accent, marginBottom: 14 }}>📊 Diagram · The Full Stack, Top to Bottom</div>
      {layers.map((l, i) => (
        <div key={l.name} style={{ display: "flex", alignItems: "center", gap: 12, background: l.c + "16", border: `1px solid ${l.c}44`, borderRadius: 9, padding: "10px 14px", marginBottom: i === layers.length - 1 ? 0 : 5 }}>
          <span style={{ fontFamily: F_MONO, fontWeight: 700, color: l.c, width: 16 }}>{layers.length - i}</span>
          <span style={{ fontFamily: F_UI, fontWeight: 600, fontSize: 13.5, color: t.text, flex: 1 }}>{l.name}</span>
          <span style={{ fontFamily: F_BODY, fontSize: 11.5, color: t.textMuted, fontStyle: "italic" }}>{l.ex}</span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════ DIAGRAM: BUS WIDTH GROWTH ══════════════════════ */
function BusWidthChart() {
  const { t } = useT();
  const chips = [{ name: "8088", bits: 8 }, { name: "8086", bits: 16 }, { name: "80286", bits: 16 }, { name: "80386 DX", bits: 32 }, { name: "80486 DX", bits: 32 }, { name: "Pentium", bits: 64 }];
  const max = 64;
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 18, margin: "18px 0" }}>
      <div style={{ fontFamily: F_MONO, fontSize: 10.5, letterSpacing: 1, textTransform: "uppercase", color: t.accent, marginBottom: 14 }}>📊 Diagram · Data Bus Width, Generation by Generation</div>
      {chips.map((c) => (
        <div key={c.name} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F_UI, fontSize: 12.5, marginBottom: 4 }}>
            <span style={{ color: t.text, fontWeight: 600 }}>{c.name}</span>
            <span style={{ fontFamily: F_MONO, color: t.textMuted }}>{c.bits}-bit</span>
          </div>
          <div style={{ height: 10, background: t.surfaceAlt, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(c.bits / max) * 100}%`, background: t.blue, borderRadius: 6 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════ DIAGRAM: FREQUENCY SPECTRUM ══════════════════════ */
function SpectrumDiagram() {
  const { t } = useT();
  const bands = [{ name: "AM Radio", pos: 4, note: "530–1700 kHz" }, { name: "FM Radio", pos: 26, note: "88–108 MHz" }, { name: "WiFi 2.4GHz / Bluetooth", pos: 68, note: "2.4 GHz" }, { name: "WiFi 5GHz", pos: 92, note: "5 GHz" }];
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20, margin: "18px 0" }}>
      <div style={{ fontFamily: F_MONO, fontSize: 10.5, letterSpacing: 1, textTransform: "uppercase", color: t.accent, marginBottom: 26 }}>📊 Diagram · The Frequency Spectrum (low → high)</div>
      <div style={{ position: "relative", height: 6, background: `linear-gradient(90deg, ${t.blue}, ${t.purple}, ${t.accent})`, borderRadius: 4, margin: "0 10px 44px" }}>
        {bands.map((b) => (
          <div key={b.name} style={{ position: "absolute", left: `${b.pos}%`, top: 0, transform: "translateX(-50%)" }}>
            <div style={{ width: 3, height: 16, background: t.text, margin: "0 auto" }} />
            <div style={{ textAlign: "center", marginTop: 6, whiteSpace: "nowrap" }}>
              <div style={{ fontFamily: F_UI, fontWeight: 600, fontSize: 11, color: t.text }}>{b.name}</div>
              <div style={{ fontFamily: F_MONO, fontSize: 10, color: t.textMuted }}>{b.note}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F_MONO, fontSize: 10, color: t.textMuted }}>
        <span>Lower frequency — longer range</span><span>Higher frequency — more bandwidth</span>
      </div>
    </div>
  );
}

/* ══════════════════════ CONTENT MODEL ══════════════════════ */
const TOPICS_HARDWARE = [
  {
    id: "hardware:fullstack",
    icon: "▤",
    title: "The Full-Stack Diagram",
    blurb: "One diagram showing every layer between a silicon transistor and the app icon you click — the map for the rest of this phase.",
    chapters: [
      {
        title: "Why Start With the Whole Stack?",
        body: () => (<>
          <P>Before zooming into any one piece of hardware, it's worth seeing the entire tower at once. A running computer is a stack of layers, each one built on top of the last, each one hiding the complexity of the layer below it so the layer above doesn't have to think about it.</P>
          <FullStackDiagram />
          <P>Every phase after this one is really just zooming into one layer of this exact diagram. Command Line is the shell layer. Programming lives in the applications/frameworks layers. Networking is largely about what the kernel and drivers do with a network card. Keep this picture in mind — it's the map.</P>
          <MemoryHook>Each layer's entire job is to hide the mess underneath it. A web developer never thinks about voltage; a CPU never thinks about your browser tab. That's not an accident — it's the whole design philosophy of computing.</MemoryHook>
        </>),
      },
      {
        title: "Hardware: The Physical Foundation",
        body: () => (<>
          <P>At the very bottom sits the physical circuit board — transistors, capacitors, resistors, and the copper traces connecting them. Nothing here is "software" in any sense; it's pure electrical engineering. A CPU's transistors are carved at a scale of a few nanometers — smaller than a virus.</P>
          <P>This layer doesn't run programs the way you think of "running" something. It responds to voltage. High voltage might mean 1, low voltage might mean 0 — and every single thing your computer will ever do reduces to patterns of exactly that, which is precisely why the Logic phase came before this one.</P>
          <Callout title="Connecting back to Logic" tone="purple">Every gate you learned to reason about with truth tables is a physical arrangement of transistors on this board. A truth table isn't just a teaching tool — it's a literal description of a circuit that exists, physically, inside the chip in front of you right now.</Callout>
        </>),
      },
      {
        title: "Firmware & the Boot Handoff",
        body: () => (<>
          <P>When you press the power button, the CPU has no operating system loaded yet — it needs something even more basic to start with. That's <Strong>firmware</Strong>, usually called BIOS (Basic Input/Output System) or its modern replacement, UEFI. Firmware lives in a small chip on the motherboard and survives being powered off, unlike RAM.</P>
          <P>Firmware runs a quick self-test called POST (Power-On Self-Test), checking that basic hardware is present and functioning, then hands control to a small program called a <Strong>bootloader</Strong>, whose only job is finding and loading the actual operating system off storage into memory.</P>
          <DeepDive title="Where the word 'BIOS' comes from">
            <P>BIOS stands for Basic Input/Output System, and it dates back to the earliest personal computers, where it really was just a basic set of routines for talking to the keyboard, screen, and disk drive — nothing like the graphical setup menus modern UEFI firmware provides. The name stuck around decades after the "basic" part stopped being literally true.</P>
          </DeepDive>
        </>),
      },
      {
        title: "The Kernel's Job",
        body: () => (<>
          <P>Once the OS loads, its core — the <Strong>kernel</Strong> — takes over managing every hardware resource: which program gets the CPU next, which memory addresses belong to which program, and how requests to read a file or send network data get carried out. Programs don't touch hardware directly; they ask the kernel to do it on their behalf through a <Strong>system call</Strong>.</P>
          <P><Strong>Device drivers</Strong> sit just below the kernel, acting as translators for specific hardware — a printer driver knows how to speak "printer," a network driver knows how to speak "this specific network card," and the kernel doesn't need to know those details itself.</P>
          <MemoryHook>The kernel is the strict building manager: no tenant (program) gets to rewire the electrical panel (hardware) directly. Every request goes through the office (a system call), which is exactly what keeps one crashing program from taking down the whole building.</MemoryHook>
        </>),
      },
      {
        title: "From Libraries to the App You Click",
        body: () => (<>
          <P>Above the kernel sit <Strong>system libraries</Strong> — reusable code for common tasks like opening files or drawing graphics, so every application doesn't have to reinvent them. Above that, <Strong>frameworks</Strong> bundle libraries into larger toolkits for building a specific kind of software (a web browser engine, a game engine). And at the very top sits the <Strong>application</Strong> — the browser, the code editor, the game — the only layer most users ever consciously interact with.</P>
          <Callout title="The whole stack, restated" tone="green">Circuit board → firmware → kernel → drivers → libraries → frameworks → application. Every single phase from here forward zooms into one rung of this ladder. Hardware (this phase) stays mostly at the bottom two rungs; Command Line lives at the shell/kernel boundary; Programming and Web live at the top.</Callout>
        </>),
      },
    ],
    retrieval: { q: "What is the one job every layer in the stack shares?", a: "Hiding the complexity of the layer below it from the layer above it" },
    recap: ["A running computer is a stack of layers, each hiding the one below it", "Firmware (BIOS/UEFI) runs first and hands off to a bootloader, which loads the OS", "The kernel manages hardware on behalf of programs via system calls", "Drivers translate between the kernel and specific hardware devices", "Libraries and frameworks sit above the kernel; applications sit at the very top"],
  },
  {
    id: "hardware:cpu",
    icon: "⚙",
    title: "CPU Anatomy",
    blurb: "Registers, the ALU, and the fetch-decode-execute cycle — what's actually happening inside the chip billions of times a second.",
    chapters: [
      {
        title: "What's Actually Inside the Chip",
        body: () => (<>
          <P>Crack open a CPU conceptually and you'll find a small number of specialized components, each with one job, wired together to repeat a simple cycle at enormous speed. None of it is mysterious once you've seen the pieces — it's the speed and scale that make it feel like magic.</P>
          <P>The core pieces: a handful of <Strong>registers</Strong> (tiny, extremely fast storage), an <Strong>ALU</Strong> (arithmetic logic unit) that does the actual math and comparisons, and a <Strong>control unit</Strong> that orchestrates everything — reading instructions and directing the other parts on what to do with them.</P>
        </>),
      },
      {
        title: "Registers: The CPU's Scratchpad",
        body: () => (<>
          <P>Registers are the fastest storage that exists in a computer — faster than even L1 cache — because they sit directly inside the CPU itself. There are only a handful of them, and each has a job:</P>
          <DataTable headers={["Register", "Job"]} rows={[
            ["Accumulator", "Holds the data currently being worked on, or the result of the last operation"],
            ["Program Counter", "Holds the memory address of the next instruction to fetch"],
            ["Instruction Register", "Holds the instruction currently being decoded"],
            ["Address Register", "Holds the memory address of the next read or write"],
            ["Flag Register", "Individual bits set by instructions — zero, negative, carry, overflow — used for decisions"],
          ]} />
          <MemoryHook>Registers from Hardware are literally the same flip-flop registers from the Logic phase, just wired for a specific job. The program counter is a counter. The flag register is a set of individually-addressable stored bits. Nothing new — same circuits, now doing real work.</MemoryHook>
        </>),
      },
      {
        title: "The ALU and FPU",
        body: () => (<>
          <P>The <Strong>ALU</Strong> (Arithmetic Logic Unit) is the part that actually computes — addition, subtraction, AND/OR/XOR, comparisons. Every one of those operations is built from the logic gates you already know; a full binary adder chained many times over handles arithmetic on entire numbers, not just single bits.</P>
          <P>Early CPUs handled decimal (floating-point) math painfully slowly through the ALU, until a dedicated <Strong>FPU</Strong> (Floating Point Unit) was added specifically to accelerate it. This single addition is what made real-time 3D graphics and complex simulations practical — those workloads live and die by fast decimal math.</P>
        </>),
      },
      {
        title: "The Fetch-Decode-Execute Cycle",
        body: () => (<>
          <P>Every single thing a CPU does, no matter how complex the program, is this one small loop repeated an almost unfathomable number of times per second:</P>
          <CPUCycleStepper />
          <P>A CPU advertised at "3.5 GHz" is running this exact loop roughly 3.5 billion times per second. Nothing about an individual step is fast in an absolute sense — it's the sheer repetition rate that makes a computer feel instantaneous.</P>
        </>),
      },
      {
        title: "A Brief History: 8088 to Pentium",
        body: () => (<>
          <P>Watching bus widths grow across early Intel chips tells the story of the entire industry's progress in miniature:</P>
          <BusWidthChart />
          <P>A wider data bus moves more bits per trip; a wider address bus can reference more distinct memory locations. Both numbers climbing, generation after generation, is the concrete, physical shape of "computers got faster."</P>
          <DeepDive title="Why the 80486 DX's built-in FPU was a big deal">
            <P>Before the 486 DX, doing floating-point math meant either an agonizingly slow software workaround or an optional separate FPU chip you had to buy and install yourself. Building the FPU directly into the main chip made fast decimal math a baseline expectation instead of a luxury — a small architectural decision with an outsized effect on what software developers felt free to build afterward.</P>
          </DeepDive>
        </>),
      },
    ],
    simulator: true,
    retrieval: { q: "What are the four stages of the CPU's core cycle, in order?", a: "Fetch, Decode, Execute, Store" },
    recap: ["A CPU's core parts are registers, the ALU, and the control unit", "Registers are the fastest storage that exists, each with a specific job", "The ALU does arithmetic/logic; the FPU accelerates floating-point math", "Every CPU operation is Fetch → Decode → Execute → Store, repeated billions of times per second", "Growing data/address bus widths across CPU generations are the literal shape of 'computers got faster'"],
  },
  {
    id: "hardware:buses-memory",
    icon: "▥",
    title: "Buses & Memory Hierarchy",
    blurb: "How components physically talk to each other, and why memory comes in layers instead of one giant pool.",
    chapters: [
      {
        title: "Buses: How Components Talk",
        body: () => (<>
          <P>A <Strong>bus</Strong> is simply a bundle of wires that carries information between components — nothing more exotic than that. A motherboard has several, each carrying a different kind of information:</P>
          <DataTable headers={["Bus", "Carries"]} rows={[
            ["Address bus", "Which memory location is being read or written"],
            ["Data bus", "The actual data being transferred"],
            ["Control bus", "Signals coordinating the transfer — read vs. write, timing"],
            ["Power bus", "Electrical power to components"],
          ]} />
          <P>When the CPU wants a value from RAM, it places the target location on the address bus, sends a "read" signal on the control bus, and the value comes back over the data bus. Three different jobs, three different sets of wires, all happening in a coordinated sequence for every single memory access.</P>
        </>),
      },
      {
        title: "Memory Hierarchy Overview",
        body: () => (<>
          <P>You might expect a computer to have one pool of memory. Instead it has several layers, each trading capacity for speed. Faster memory is dramatically more expensive per byte and physically has to stay small — so computers keep a little bit of very fast memory close to the CPU, and much more slow, cheap memory further away.</P>
          <MemoryHierarchyVisualizer />
        </>),
      },
      {
        title: "Cache: The CPU's Cheat Sheet",
        body: () => (<>
          <P>Cache exists on a simple bet: whatever data or instructions the CPU just used, it's likely to want again very soon. Rather than fetching everything from slow RAM every single time, the CPU keeps a copy of recently-used data in cache, split into levels — L1 smallest and fastest, right on the core; L2 larger and a bit slower; L3 larger still, often shared across all cores on the chip.</P>
          <Callout title="Cache hit vs. cache miss" tone="blue">When the CPU finds what it needs already sitting in cache, that's a <Strong>hit</Strong> — fast. When it doesn't and has to go all the way to RAM, that's a <Strong>miss</Strong> — dramatically slower. Well-written software is often, invisibly, software that's good at keeping its cache hit rate high.</Callout>
        </>),
      },
      {
        title: "RAM vs. Storage",
        body: () => (<>
          <P>RAM (Random Access Memory) is <Strong>volatile</Strong> — it needs continuous power to hold its contents, and loses everything the instant power cuts out. That's exactly why an unsaved document vanishes in a crash: it only ever existed in RAM. Storage (SSD/HDD) is <Strong>non-volatile</Strong> — it keeps its contents with no power at all, which is why files survive a full shutdown.</P>
          <P>This distinction is the entire reason "save" is a meaningful action: saving means deliberately copying data from volatile, fast RAM into non-volatile, slower storage, trading speed for permanence.</P>
          <MemoryHook>RAM is your desk — fast to work on, but swept clean when you leave. Storage is the filing cabinet — slower to dig through, but it's still there tomorrow.</MemoryHook>
        </>),
      },
      {
        title: "Why the Hierarchy Exists At All",
        body: () => (<>
          <P>You could, in principle, build a computer entirely out of register-speed memory. Nobody does, because that speed is only affordable in tiny quantities — a chip's worth of register-speed storage might hold a few hundred bytes, not the gigabytes a modern program expects. The hierarchy is a deliberate engineering compromise: put a small amount of the fastest, most expensive memory closest to the CPU, and progressively larger, cheaper, slower pools further away.</P>
          <Callout title="Where this goes next" tone="green">This exact tradeoff — small and fast vs. large and slow — reappears constantly: browser caches, DNS caches, database query caches in later phases. Once you've internalized why memory hierarchy exists, you'll recognize the same shape everywhere in computing.</Callout>
        </>),
      },
    ],
    retrieval: { q: "Why does RAM lose its contents when the power goes out, but an SSD doesn't?", a: "RAM is volatile (needs continuous power); SSDs are non-volatile" },
    recap: ["A bus is a bundle of wires; address/data/control buses each carry a different kind of information", "Memory exists in layers because faster memory is more expensive and must stay small", "Cache bets that recently-used data will be needed again soon; a cache miss falls through to slower RAM", "RAM is volatile (loses data without power); storage is non-volatile", "The fast/small vs. slow/large tradeoff reappears throughout computing, not just in hardware"],
  },
  {
    id: "hardware:storage",
    icon: "▦",
    title: "Storage Evolution",
    blurb: "From floppy disks to solid state — how the physical medium changed, and why partitioning is still a thing.",
    chapters: [
      {
        title: "Floppy Disks: Where It Started",
        body: () => (<>
          <P>Long before USB drives, personal computers relied on 3½-inch floppy disks, and even those came in more than one capacity as the technology improved:</P>
          <DataTable headers={["Type", "Capacity"]} rows={[["Double density", "720 KB"], ["High density", "1.44 MB"], ["Super density", "2.88 MB"]]} />
          <P>Each generation roughly doubled the last — the same "line goes up over time" pattern you saw in CPU bus widths, now showing up in storage capacity instead.</P>
        </>),
      },
      {
        title: "Hard Drives: Spinning Platters",
        body: () => (<>
          <P>A traditional hard disk drive (HDD) stores data magnetically on spinning circular platters, read and written by a physical arm that moves across the surface — genuinely similar in spirit to a record player. That physical movement is the source of an HDD's biggest weakness: no matter how fast the platter spins, the arm still has to physically travel to the right spot before any data can be read, which takes real, measurable time.</P>
        </>),
      },
      {
        title: "CD-ROMs: SCSI vs. ATAPI",
        body: () => (<>
          <P>Early CD-ROM drives came in two competing connection standards. SCSI drives were often cheap on their own, but required a separate, notably expensive adapter card to function — creating a classic "cheap bait, expensive hook" sales pattern. ATAPI drives plugged straight into the same IDE slot already used by hard drives, needing only a driver, no extra hardware purchase.</P>
          <DeepDive title="A small lesson in hardware economics">
            <P>The SCSI-vs-ATAPI split is a neat, concrete example of how a hardware standard's total cost of ownership can hide behind an attractively low sticker price on the main component. It's the same pattern consumers still navigate today with printers sold cheap and ink sold dear.</P>
          </DeepDive>
        </>),
      },
      {
        title: "Solid State: No Moving Parts",
        body: () => (<>
          <P>Solid-state drives (SSDs) store data electrically in flash memory chips, with no spinning platter and no moving read/write arm at all. Removing physical motion from the equation is exactly why SSDs are dramatically faster than HDDs — there's no travel time to wait out, only electrical signaling, which is why they sit so much higher on the Memory Speed Ladder a few chapters back.</P>
        </>),
      },
      {
        title: "Partitions & Formatting",
        body: () => (<>
          <P>A raw storage device isn't usable the moment it's manufactured — it has to be <Strong>partitioned</Strong> (divided into one or more logical sections) and <Strong>formatted</Strong> (given a filesystem structure the operating system knows how to read and write). This is exactly what a modern installer is doing behind a friendly graphical progress bar when you set up a new drive.</P>
          <Callout title="Where you'll meet this again" tone="blue">Partitioning and filesystems come back properly in the Command Line & Operating Systems phase, where you'll see the Linux, macOS, and Windows filesystem hierarchies built directly on top of the concepts from this chapter.</Callout>
        </>),
      },
    ],
    retrieval: { q: "Why are SSDs faster than traditional HDDs?", a: "SSDs have no moving parts (no spinning platter, no read/write arm) — everything is electrical" },
    recap: ["Storage capacity has followed the same roughly-doubling pattern as other hardware over time", "HDDs store data magnetically on spinning platters read by a moving arm", "SCSI CD-ROMs needed an extra adapter card; ATAPI plugged directly into the existing IDE slot", "SSDs remove physical motion entirely, which is the direct source of their speed advantage", "A drive must be partitioned and formatted before an OS can use it"],
  },
  {
    id: "hardware:interrupts",
    icon: "⚡",
    title: "Interrupts, DMA & IRQs",
    blurb: "How hardware gets the CPU's attention without making it wait around — and how devices write to memory without going through the CPU at all.",
    chapters: [
      {
        title: "The Classroom Analogy",
        body: () => (<>
          <P>Picture a teacher mid-lecture when a student raises a hand. The teacher doesn't ignore the room until the lecture naturally ends — she pauses, addresses the question, then resumes exactly where she left off. That's precisely what a hardware <Strong>interrupt</Strong> is: a signal that says "stop what you're doing and deal with this now," after which the CPU returns to whatever it was doing before.</P>
          <P>Without interrupts, a CPU would have to constantly ask every single device "do you have anything for me?" in an endless, wasteful loop — a technique called polling. Interrupts flip that around: devices speak up only when they actually have something, and the CPU is free to do other work the rest of the time.</P>
        </>),
      },
      {
        title: "DMA: Skipping the Middleman",
        body: () => (<>
          <P>Imagine a modem receiving a large amount of data from the network. Routing every single byte through the CPU on its way into memory would waste enormous amounts of CPU time on pure data-shuffling. <Strong>DMA</Strong> (Direct Memory Access) lets a device write straight into memory itself, without the CPU babysitting every transferred byte.</P>
          <P>The CPU typically still gets involved once, briefly, to tell the device where in memory to put the data — then steps out of the way while the transfer happens, and gets an interrupt only when the whole thing is finished.</P>
          <MemoryHook>Interrupts are "excuse me, I need you now." DMA is "don't worry about carrying these boxes yourself — I'll put them directly on the shelf, just tell me which shelf."</MemoryHook>
        </>),
      },
      {
        title: "IRQ Lines: The Original 8, and the Modern 16",
        body: () => (<>
          <P>An <Strong>IRQ</Strong> (Interrupt Request) is a specific numbered line a device uses to signal the CPU, so the system knows which device is asking for attention. Early PCs had only 8 IRQ lines:</P>
          <DataTable headers={["IRQ", "Typically used by"]} rows={[["0", "Available"], ["1", "Sound / available"], ["2", "Floppy disk controller"], ["3", "Available"], ["4", "First DMA controller"], ["5", "Sound / available"], ["6", "Available"], ["7", "Available"]]} />
          <P>Later systems doubled this to 16 IRQ lines as more devices needed to coexist, a direct consequence of PCs supporting more peripherals than the original design anticipated.</P>
        </>),
      },
      {
        title: "Why This Still Matters Today",
        body: () => (<>
          <P>Modern systems have replaced the rigid old IRQ-line scheme with more flexible mechanisms, but the underlying concepts — a device signaling the CPU, and moving bulk data without CPU micromanagement — are exactly as relevant as ever. Every keystroke, every incoming network packet, every mouse movement still generates an interrupt somewhere in the stack.</P>
          <Callout title="Foreshadowing the OS phase" tone="green">When you learn to read a process list or check system load in the Command Line & Operating Systems phase, interrupts are part of what's actually happening underneath those numbers — a busy system is very often a system fielding a high rate of interrupts.</Callout>
        </>),
      },
      {
        title: "Putting It Together: A Modem's Data, Start to Finish",
        body: () => (<>
          <P>Trace the whole path: a modem receives data from the network. It can't hold much data itself, so it needs to get it into memory quickly. It raises an interrupt to get the CPU's attention. The CPU (briefly) tells the modem where in memory to place the incoming data. The modem then uses DMA to write the data directly into that memory location, without further CPU involvement. Once finished, the modem raises another interrupt to say "done" — and only then does the CPU (or the software waiting on that data) pick the result up.</P>
          <MemoryHook>Interrupt → hand-off instructions → DMA transfer → interrupt again when done. Four small steps, and they're happening constantly, on every device, the entire time your computer is on.</MemoryHook>
        </>),
      },
    ],
    retrieval: { q: "What problem does DMA solve that plain interrupts don't?", a: "It lets a device transfer bulk data directly into memory without the CPU handling every byte" },
    recap: ["An interrupt is a signal that says 'pause and handle this now' — the alternative, polling, wastes CPU time constantly asking devices if they need attention", "DMA lets a device write directly to memory without routing every byte through the CPU", "IRQ lines are the numbered channels devices use to signal interrupts — 8 originally, 16 later", "These concepts are still active in every modern system, even though the exact mechanisms have evolved", "A full transfer typically looks like: interrupt → hand-off → DMA transfer → interrupt again when done"],
  },
  {
    id: "hardware:casestudies",
    icon: "◐",
    title: "Case Studies: Where Hardware Meets Software",
    blurb: "Two real stories about the blurry, movable line between what's built in silicon and what's done in code.",
    chapters: [
      {
        title: "The Softmodem: Hardware's Job, Done in Software",
        body: () => (<>
          <P>A traditional modem contains a dedicated chip that performs modulation and demodulation — converting between the digital signals a computer understands and the analog signals that travel over a phone line. A <Strong>softmodem</Strong> (commonly nicknamed a "Winmodem") skips that dedicated chip entirely and does the same conversion in software, using the general-purpose CPU instead.</P>
          <P>This is the clearest possible example that the line between "hardware" and "software" isn't fixed — the exact same job, converting signals, can live in dedicated silicon or in a piece of code, and which one a given device uses is an economic and engineering choice, not a law of nature.</P>
        </>),
      },
      {
        title: "Why Softmodems 'Sucked' (And Why That's Interesting)",
        body: () => (<>
          <P>Softmodems were cheaper to manufacture — no dedicated chip needed — but that savings came directly out of your CPU's spare time and your system's memory. If your computer got busy with something else, the softmodem could stutter or drop the connection entirely, because the CPU wasn't reliably free to keep doing the signal conversion in real time.</P>
          <Callout title="The general lesson" tone="purple">Moving a job from dedicated hardware into general-purpose software is almost always cheaper up front and almost always costs something at runtime — CPU cycles, memory, reliability. That exact tradeoff reappears throughout computing, from software-defined networking to GPU-accelerated video encoding done "in software" versus in a dedicated chip.</Callout>
        </>),
      },
      {
        title: "Radio Waves 101",
        body: () => (<>
          <P>Wireless communication of every kind — WiFi, Bluetooth, cellular, radio, satellite — relies on the exact same underlying physics: encoding information onto electromagnetic waves traveling through the air, rather than through a physical wire. A transmitter varies a wave's properties (its amplitude, frequency, or phase) in a pattern that encodes data; a receiver detects those variations and decodes them back into the original information.</P>
          <P>This connects directly back to the Networking phase's Physical Layer — wireless networking is simply the Physical Layer implemented without a cable at all.</P>
        </>),
      },
      {
        title: "The Electromagnetic Spectrum",
        body: () => (<>
          <P>Different wireless technologies deliberately use different frequency bands so they don't interfere with each other, trading off range, speed, and how well the signal passes through obstacles like walls:</P>
          <SpectrumDiagram />
          <MemoryHook>Lower frequency generally means longer range and better penetration through obstacles; higher frequency generally means more bandwidth but shorter range. Every wireless standard you'll ever meet is a specific point chosen along that same tradeoff curve.</MemoryHook>
        </>),
      },
      {
        title: "The Throughline: Hardware Draws the Line, Software Can Move It",
        body: () => (<>
          <P>Across this entire phase, one idea keeps resurfacing in different costumes: hardware sets the hard physical limits — the speed of electricity, the capacity of a chip, the frequencies available in the air — and software constantly negotiates around those limits, sometimes doing a hardware job in software (the softmodem), sometimes squeezing more performance out of fixed hardware through cleverness (cache-friendly code).</P>
          <Callout title="Carrying this forward" tone="green">Every phase from here on is, in some sense, about that same negotiation. Command Line and Operating Systems is software managing hardware resources. Programming is writing the instructions hardware will execute. Networking is moving data across physical links with real, hard limits. You now have the physical foundation underneath all of it.</Callout>
        </>),
      },
    ],
    retrieval: { q: "What's the general tradeoff between lower and higher frequency wireless signals?", a: "Lower frequency = longer range and better penetration; higher frequency = more bandwidth but shorter range" },
    recap: ["A softmodem does a hardware job (signal modulation) in software, trading cost for reliability and CPU overhead", "Moving a job from dedicated hardware to general-purpose software is a recurring tradeoff throughout computing", "All wireless communication encodes data onto electromagnetic waves — WiFi, Bluetooth, and radio all share this same physics", "Different wireless bands trade off range, speed, and obstacle penetration", "Hardware sets the physical limits; software negotiates around them — the theme connecting every phase ahead"],
  },
];
/* ══════════════════════ INTERACTIVE: CHMOD PERMISSIONS CALCULATOR ══════════════════════ */
const PERM_GROUPS = ["Owner", "Group", "Other"];
const PERM_BITS = [["r", 4], ["w", 2], ["x", 1]];
function ChmodCalculator() {
  const { t } = useT();
  const [perms, setPerms] = useState({ Owner: { r: true, w: true, x: true }, Group: { r: true, w: false, x: true }, Other: { r: true, w: false, x: false } });
  const toggle = (group, bit) => setPerms((p) => ({ ...p, [group]: { ...p[group], [bit]: !p[group][bit] } }));
  const digitFor = (group) => PERM_BITS.reduce((sum, [bit, val]) => sum + (perms[group][bit] ? val : 0), 0);
  const octal = PERM_GROUPS.map(digitFor).join("");
  const symbolic = PERM_GROUPS.map((g) => PERM_BITS.map(([bit]) => (perms[g][bit] ? bit : "-")).join("")).join("");

  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: 26, margin: "24px 0" }}>
      <div style={{ fontFamily: F_MONO, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: t.accent, marginBottom: 18 }}>🎮 Interactive · chmod Permissions Calculator</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 22 }}>
        {PERM_GROUPS.map((g) => (
          <div key={g} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: F_UI, fontWeight: 600, fontSize: 13, color: t.text, marginBottom: 10 }}>{g}</div>
            {PERM_BITS.map(([bit, val]) => (
              <button key={bit} onClick={() => toggle(g, bit)} style={{ display: "block", width: "100%", marginBottom: 6, background: perms[g][bit] ? t.accentSoft : t.surfaceAlt, border: `1px solid ${perms[g][bit] ? t.accent : t.border}`, color: perms[g][bit] ? t.accent : t.textMuted, borderRadius: 8, padding: "8px 6px", fontFamily: F_MONO, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{bit} ({val})</button>
            ))}
            <div style={{ fontFamily: F_MONO, fontSize: 20, fontWeight: 700, color: t.green, marginTop: 6 }}>{digitFor(g)}</div>
          </div>
        ))}
      </div>
      <div style={{ background: t.codeBg, borderRadius: 10, padding: "14px 18px", fontFamily: F_MONO, fontSize: 14, color: t.green, textAlign: "center" }}>
        chmod {octal} file &nbsp;→&nbsp; -{symbolic}
      </div>
    </div>
  );
}


/* ══════════════════════ DIAGRAM: FILESYSTEM TREE ══════════════════════ */
function FilesystemTreeDiagram() {
  const { t } = useT();
  const tree = { name: "/", note: "root", children: [
    { name: "bin", note: "essential commands" },
    { name: "etc", note: "configuration files" },
    { name: "home", note: "personal directories", children: [{ name: "yourname", note: "your files" }] },
    { name: "var", note: "data that keeps changing", children: [{ name: "log", note: "system logs" }] },
    { name: "usr", note: "installed software", children: [{ name: "bin", note: "more commands" }] },
    { name: "tmp", note: "temporary files" },
  ]};
  const renderNode = (node, depth) => (
    <div key={node.name + depth}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, padding: "6px 0 6px 0", marginLeft: depth * 24, borderLeft: depth > 0 ? `2px solid ${t.borderStrong}` : "none", paddingLeft: depth > 0 ? 16 : 0 }}>
        <span style={{ fontFamily: F_MONO, fontSize: 14, fontWeight: 700, color: depth === 0 ? t.accent : t.blue }}>{node.name}</span>
        {node.note && <span style={{ fontFamily: F_BODY, fontSize: 12.5, color: t.textMuted, fontStyle: "italic" }}>— {node.note}</span>}
      </div>
      {node.children && node.children.map((c) => renderNode(c, depth + 1))}
    </div>
  );
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24, margin: "22px 0" }}>
      <div style={{ fontFamily: F_MONO, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: t.accent, marginBottom: 14 }}>📊 Diagram · The Linux Filesystem Tree</div>
      {renderNode(tree, 0)}
    </div>
  );
}

/* ══════════════════════ CONTENT MODEL ══════════════════════ */
const TOPICS_CLI = [
  {
    id: "cli:terminal",
    icon: "▸_",
    title: "Terminal Fundamentals",
    blurb: "Why typing commands still beats clicking icons, and the handful of commands that cover most of what you'll ever need.",
    chapters: [
      {
        title: "Why the Terminal, Still",
        body: () => (<>
          <P>A graphical interface hides most of a system behind icons and menus, which is friendly right up until you need to do something the icons don't offer — rename ten thousand files at once, automate a repetitive task, or manage a server that has no screen attached at all. The terminal is precise, scriptable, and works identically whether you're sitting in front of the machine or connected to one on the other side of the planet.</P>
          <MemoryHook>A GUI shows you the options someone else thought to build. A terminal lets you say exactly what you mean, every time, and script it so you never have to type it twice.</MemoryHook>
        </>),
      },
      {
        title: "Navigating: pwd, cd, ls",
        body: () => (<>
          <P>Three commands cover the entire skill of "knowing where you are" in a filesystem:</P>
          <DataTable headers={["Command", "Meaning"]} rows={[["pwd", "Print Working Directory — where am I right now"], ["cd path", "Change Directory — move somewhere else"], ["ls", "List — what's in this directory"], ["ls -la", "List all files, long format, including hidden ones"]]} />
          <P><Code>cd ..</Code> moves up one level; <Code>cd ~</Code> jumps straight home; <Code>cd -</Code> jumps back to wherever you just were. Those three shortcuts alone cover most day-to-day navigation.</P>
        </>),
      },
      {
        title: "Working with Files: cp, mv, rm, mkdir",
        body: () => (<>
          <P>Once you can navigate, the next skill is manipulating what you find:</P>
          <DataTable headers={["Command", "Meaning"]} rows={[["mkdir name", "Make a new directory"], ["cp source dest", "Copy a file"], ["cp -r source dest", "Copy a directory recursively"], ["mv source dest", "Move or rename"], ["rm file", "Remove a file"], ["rm -rf dir", "Remove a directory and everything in it — no confirmation, no undo"]]} />
          <Callout title="Respect rm -rf" tone="red">There's no trash can in a terminal. <Code>rm -rf</Code> deletes immediately and permanently. Every experienced terminal user has a story about running it in the wrong directory — the lesson is always the same afterward: double-check <Code>pwd</Code> before anything destructive.</Callout>
        </>),
      },
      {
        title: "Piping and Redirection",
        body: () => (<>
          <P>The terminal's real power shows up when commands connect to each other. A <Strong>pipe</Strong> (<Code>{'|'}</Code>) sends one command's output directly into another command's input — no temporary files, no manual copying.</P>
          <Code block>{`ls -la | grep ".txt"`}</Code>
          <P>That line lists everything in the current directory, then filters the list down to only lines mentioning ".txt" — two small, single-purpose commands combined into something neither could do alone. <Code>{'>'}</Code> redirects output into a file (overwriting it); <Code>{'>>'}</Code> appends to the end instead.</P>
          <MemoryHook>Unix philosophy in one sentence: write small tools that each do one thing well, then combine them with pipes. That idea, more than any single command, is what the terminal is really teaching you.</MemoryHook>
        </>),
      },
      {
        title: "PowerShell: Same Ideas, Different Words",
        body: () => (<>
          <P>Windows' PowerShell follows the exact same philosophy — navigate, manipulate, pipe commands together — with different vocabulary and, notably, full objects flowing through pipes instead of plain text.</P>
          <DataTable headers={["bash / zsh", "PowerShell", "Meaning"]} rows={[
            ["pwd", "Get-Location", "Where am I"],
            ["ls", "Get-ChildItem", "List contents"],
            ["cd", "Set-Location", "Change directory"],
            ["cp", "Copy-Item", "Copy"],
            ["rm", "Remove-Item", "Delete"],
            ["grep", "Select-String", "Search text"],
          ]} />
          <P>PowerShell even aliases many of these to their Unix names (<Code>ls</Code> quietly runs <Code>Get-ChildItem</Code> under the hood) specifically to soften the transition for people coming from a Unix background — a small, deliberate act of cross-platform courtesy.</P>
        </>),
      },
    ],
    retrieval: { q: "What does a pipe (|) do between two commands?", a: "Sends the first command's output directly into the second command's input" },
    recap: ["The terminal offers precision, scriptability, and remote access a GUI can't match", "pwd/cd/ls cover navigation; mkdir/cp/mv/rm cover manipulation", "rm -rf deletes permanently with no confirmation — always check pwd first", "Pipes (|) chain small commands together; > and >> redirect output to files", "PowerShell follows the same philosophy as bash/zsh with different command names"],
  },
  {
    id: "cli:filesystem",
    icon: "🗂",
    title: "The Filesystem Hierarchy",
    blurb: "How Linux, macOS, and Windows each organize files — and the permission system underneath every one of them.",
    chapters: [
      {
        title: "Everything Is a File",
        body: () => (<>
          <P>A foundational Unix idea — inherited by both Linux and macOS — is that nearly everything in the system is represented as a file, even things that aren't documents at all: a connected printer, a running process, even raw memory can show up somewhere in the filesystem as a file you could technically open. This uniformity is what lets the same small set of commands (read, write, redirect) work on almost anything in the system.</P>
        </>),
      },
      {
        title: "The Linux / Debian Filesystem Tree",
        body: () => (<>
          <P>Unlike Windows' separate drive letters, Linux has exactly one filesystem tree, starting at the root, written as a single <Code>/</Code>. Everything else branches from there:</P>
          <FilesystemTreeDiagram />
          <MemoryHook>/etc for settings, /home for you, /var for things that change constantly, /usr for the software itself. Four directories, a genuinely large fraction of everyday navigation.</MemoryHook>
        </>),
      },
      {
        title: "How macOS Differs",
        body: () => (<>
          <P>macOS is built on a Unix foundation (Darwin) and keeps the same root-anchored single tree, the same <Code>/etc</Code> and <Code>/tmp</Code>, and the same permission model — but layers Apple-specific directories on top for the graphical experience: <Code>/Applications</Code> for apps, <Code>/Library</Code> for shared system resources, and a parallel <Code>~/Library</Code> inside your home directory for your personal app data and preferences.</P>
          <Callout title="Why this matters for you" tone="blue">Because macOS is genuinely Unix underneath, almost everything you learn in this Linux-focused topic — permissions, piping, navigation — transfers directly to a Mac terminal with zero translation needed.</Callout>
        </>),
      },
      {
        title: "Windows and the Drive-Letter World",
        body: () => (<>
          <P>Windows takes a different approach entirely: rather than one universal tree, each physical or logical drive gets its own letter — <Code>C:\\</Code> for the primary drive, <Code>D:\\</Code> for a second one, and so on. Software conventionally lives in <Code>C:\\Program Files</Code>, and personal files live under <Code>C:\\Users\\yourname</Code> — the rough equivalent of Linux's <Code>/home</Code>.</P>
          <P>Neither approach is objectively better; they're just different solutions to the same organizational problem, shaped by decades of separate design history.</P>
        </>),
      },
      {
        title: "WSL: Linux Inside Windows",
        body: () => (<>
          <P>The Windows Subsystem for Linux (WSL) runs an actual Linux environment directly inside Windows, giving you a real Linux filesystem tree, real Linux commands, and access to your Windows files through a bridge path — letting developers use Linux-native tools without leaving Windows or setting up a separate machine.</P>
          <DeepDive title="Why Microsoft built this at all">
            <P>For years, "just use a Mac or Linux machine" was common advice for developers, because so much server software is Linux-based. WSL is Microsoft directly addressing that gap — rather than compete with Linux, they made it a first-class citizen inside their own OS, a notable shift from a company that once treated open-source software as a rival.</P>
          </DeepDive>
        </>),
      },
      {
        title: "File Permissions, Interactively",
        body: () => (<>
          <P>Every file on a Unix-family system (Linux and macOS both) carries three sets of permissions — for the file's owner, for a group, and for everyone else — and each set independently controls read, write, and execute access. This is precisely the octal-number system from the Logic phase's chapter on octal, doing real work.</P>
          <ChmodCalculator />
          <P>The command to apply this is <Code>chmod</Code> (change mode), followed by the three-digit octal number and the target file — exactly what the calculator above builds for you.</P>
        </>),
      },
    ],
    simulator: true,
    retrieval: { q: "In chmod 755, what does the middle digit (5) grant to the file's group?", a: "Read and execute, but not write (4+1=5)" },
    recap: ["Unix treats almost everything as a file, which lets the same commands work across very different resources", "Linux has one filesystem tree starting at /; key directories are /bin, /etc, /home, /var, /usr", "macOS is Unix underneath, with Apple-specific directories layered on top", "Windows uses separate drive letters instead of one unified tree", "chmod permissions are exactly the octal system from Logic, applied to real files"],
  },
  {
    id: "cli:vim",
    icon: "✎",
    title: "Text Editors: vim",
    blurb: "The modal editor every server has pre-installed, and the commands that get you through your first real session.",
    chapters: [
      {
        title: "Why a Modal Editor?",
        body: () => (<>
          <P>Most editors have one mode: you click somewhere and start typing. Vim has several distinct modes, and most of your time is spent in a mode where the keyboard doesn't insert text at all — it issues commands. This feels backwards at first and becomes extremely fast once it clicks, because your hands never have to leave the home row.</P>
          <DataTable headers={["Mode", "Purpose"]} rows={[["Normal", "The default — keys are commands, not text"], ["Insert", "Typing actually inserts characters, like a normal editor"], ["Visual", "Select text to act on"], ["Command-line", "Type a colon-command like :w or :q"]]} />
        </>),
      },
      {
        title: "Moving Around Without a Mouse",
        body: () => (<>
          <P>In Normal mode, <Code>h</Code> <Code>j</Code> <Code>k</Code> <Code>l</Code> move left, down, up, right — positioned directly under your right hand on a standard keyboard, which is the entire reason they were chosen. Larger motions build on the same idea:</P>
          <DataTable headers={["Key", "Moves"]} rows={[["w", "Forward one word"], ["b", "Back one word"], ["0", "Start of the line"], ["$", "End of the line"], ["gg", "Top of the file"], ["G", "Bottom of the file"]]} />
        </>),
      },
      {
        title: "Editing Commands",
        body: () => (<>
          <P>Vim's editing commands compose like a small language: an operator plus a motion. <Code>d</Code> (delete) plus <Code>w</Code> (word) becomes <Code>dw</Code> — delete a word. <Code>d</Code> plus <Code>d</Code> becomes <Code>dd</Code> — delete the whole line.</P>
          <DataTable headers={["Command", "Effect"]} rows={[["i", "Enter Insert mode before the cursor"], ["dd", "Delete the current line"], ["yy", "Copy ('yank') the current line"], ["p", "Paste after the cursor"], ["u", "Undo"], ["Ctrl+r", "Redo"]]} />
          <MemoryHook>Once you know a handful of operators (d, y, c) and a handful of motions (w, $, gg), they combine like Lego bricks — dw, y$, cgg, and dozens more all follow the same pattern without needing to be memorized one by one.</MemoryHook>
        </>),
      },
      {
        title: "Search and Replace",
        body: () => (<>
          <P>Typing <Code>/word</Code> in Normal mode searches forward for "word"; <Code>n</Code> jumps to the next match, <Code>N</Code> to the previous. Find-and-replace uses the <Code>:s</Code> (substitute) command:</P>
          <Code block>{`:%s/old/new/g`}</Code>
          <P>Reading that left to right: across the whole file (<Code>%</Code>), substitute (<Code>s</Code>) "old" with "new", globally on every line (<Code>g</Code>) rather than stopping at the first match per line.</P>
        </>),
      },
      {
        title: "Saving, Quitting, and Surviving Your First Session",
        body: () => (<>
          <P>Vim's command-line mode, entered with <Code>:</Code>, handles saving and quitting:</P>
          <DataTable headers={["Command", "Effect"]} rows={[[":w", "Write (save) the file"], [":q", "Quit"], [":wq", "Save and quit"], [":q!", "Quit without saving, discarding changes"]]} />
          <Callout title="The famous joke, addressed directly" tone="green">"How do I exit vim" is a long-running programmer joke precisely because Normal mode doesn't accept plain typing, and a panicked new user often mashes random keys that do nothing visible. The actual answer is simply <Code>Esc</Code> to make sure you're in Normal mode, then <Code>:wq</Code> to save and quit, or <Code>:q!</Code> to bail out without saving.</Callout>
        </>),
      },
    ],
    retrieval: { q: "What do you type to save and quit vim in one step?", a: ":wq" },
    recap: ["Vim is modal — Normal mode issues commands, Insert mode types text", "hjkl move the cursor; w/b move by word; gg/G jump to top/bottom", "Editing commands compose as operator + motion, e.g. dw = delete word, dd = delete line", ":%s/old/new/g finds and replaces across the whole file", ":w saves, :q quits, :wq does both, :q! discards changes and quits"],
  },
  {
    id: "cli:git",
    icon: "⑂",
    title: "Git & GitHub",
    blurb: "Version control — tracking every change, branching into parallel timelines, and collaborating without overwriting each other's work.",
    chapters: [
      {
        title: "What Version Control Actually Solves",
        body: () => (<>
          <P>Before version control, protecting a project meant manually copying whole folders — <Code>project_final</Code>, <Code>project_final_v2</Code>, <Code>project_final_ACTUALLY_FINAL</Code> — a system that scales badly and loses the story of what changed and why. Git tracks every change as a precise, timestamped, reversible snapshot, with a message explaining what happened.</P>
        </>),
      },
      {
        title: "The Core Loop: add, commit, push",
        body: () => (<>
          <P>Nearly all day-to-day git usage boils down to three steps repeated constantly:</P>
          <Code block>{`git add file.txt         # stage a change
git commit -m "message"   # save a snapshot with a description
git push                  # send it to a remote (like GitHub)`}</Code>
          <P><Strong>Staging</Strong> (add) lets you choose exactly which changes go into the next snapshot — you don't have to commit everything you've touched at once. <Strong>Committing</Strong> saves that chosen snapshot locally. <Strong>Pushing</Strong> sends your local history to a shared remote repository.</P>
        </>),
      },
      {
        title: "Branches: Parallel Timelines",
        body: () => (<>
          <P>A <Strong>branch</Strong> is an independent line of development — you can experiment, break things, and commit freely on a branch without touching the stable main line of the project at all.</P>
          <Code block>{`git branch new-feature       # create a branch
git checkout new-feature      # switch to it
git checkout -b new-feature   # create and switch in one step`}</Code>
          <MemoryHook>Think of main as the published book, and a branch as a photocopy you can scribble all over. Nothing you do to the copy touches the original until you deliberately decide to merge your changes back in.</MemoryHook>
        </>),
      },
      {
        title: "Merging and Conflicts",
        body: () => (<>
          <P><Code>git merge</Code> brings a branch's changes back into another one, usually back into main once a feature is finished. Most merges happen automatically and invisibly. A <Strong>conflict</Strong> happens only when two branches changed the exact same lines differently — git can't guess which version you want, so it stops and asks you to decide by hand.</P>
          <Callout title="A conflict is normal, not a failure" tone="blue">Seeing "CONFLICT" in the terminal for the first time feels alarming, but it's an expected, routine part of collaborative development — git is simply refusing to silently guess wrong on your behalf.</Callout>
        </>),
      },
      {
        title: "GitHub: Git Plus Collaboration",
        body: () => (<>
          <P>Git itself is just the version-control tool and works entirely offline on your own machine. GitHub is a separate, web-based service built around git that adds hosting and collaboration on top of it: a <Strong>remote</Strong> repository others can push to and pull from, a <Strong>fork</Strong> (your own copy of someone else's project), and a <Strong>pull request</Strong> — a formal proposal to merge your changes into someone else's project, with space for discussion and review before it happens.</P>
          <MemoryHook>Git is the engine. GitHub is one possible garage to park it in — GitLab and Bitbucket are others, all built on the exact same underlying git.</MemoryHook>
        </>),
      },
    ],
    retrieval: { q: "What's the difference between staging (add) and committing in git?", a: "Staging chooses which changes go into the next snapshot; committing actually saves that snapshot" },
    recap: ["Git tracks precise, timestamped, reversible snapshots instead of manually copying folders", "The core loop is add (stage) → commit (save) → push (share)", "A branch is an independent line of development that doesn't affect main until merged", "A merge conflict happens only when two branches changed the same lines differently", "GitHub adds hosting and collaboration (remotes, forks, pull requests) on top of git itself"],
  },
  {
    id: "cli:scripting",
    icon: "⚙",
    title: "Intermediate Shell Scripting",
    blurb: "Turning a sequence of commands you keep retyping into a program the shell can run for you.",
    chapters: [
      {
        title: "Your First Script",
        body: () => (<>
          <P>A shell script is just a text file full of the same commands you'd type by hand, run all at once. Every script starts with a <Strong>shebang</Strong> line telling the system which interpreter should run it:</P>
          <Code block>{`#!/bin/bash
echo "Hello from a script"`}</Code>
          <P>Before it'll run, the file needs execute permission — exactly the permission bit from the Filesystem topic's chmod calculator:</P>
          <Code block>{`chmod +x myscript.sh
./myscript.sh`}</Code>
        </>),
      },
      {
        title: "Variables and Input",
        body: () => (<>
          <P>Bash variables need no type declaration and are referenced with a <Code>$</Code>:</P>
          <Code block>{`name="World"
echo "Hello, $name"

# arguments passed to the script:
echo "First argument: $1"

# reading user input:
read -p "Enter your name: " username
echo "Hi, $username"`}</Code>
          <P><Code>$1</Code>, <Code>$2</Code>, and so on refer to arguments passed when the script was run — <Code>./myscript.sh Alice</Code> makes <Code>$1</Code> equal to "Alice" inside the script.</P>
        </>),
      },
      {
        title: "Conditionals and Loops",
        body: () => (<>
          <P>Bash's control flow reads almost like English once you know the punctuation:</P>
          <Code block>{`if [ -f "myfile.txt" ]; then
  echo "File exists"
else
  echo "No such file"
fi

for i in 1 2 3; do
  echo "Count: $i"
done`}</Code>
          <P><Code>[ -f "file" ]</Code> tests whether a file exists — one of dozens of small test conditions bash supports for files, strings, and numbers.</P>
        </>),
      },
      {
        title: "Functions",
        body: () => (<>
          <P>Repeated logic belongs in a function, exactly as in any real programming language:</P>
          <Code block>{`greet() {
  echo "Hello, $1"
}

greet "Alice"
greet "Bob"`}</Code>
          <P>Inside a bash function, <Code>$1</Code> refers to the function's own first argument, not the whole script's — the same parameter-passing idea, just scoped one level deeper.</P>
        </>),
      },
      {
        title: "Putting It to Work: A Real Backup Script",
        body: () => (<>
          <P>Combining everything from this topic into something genuinely useful — a script that copies a folder into a dated backup:</P>
          <Code block>{`#!/bin/bash
SOURCE="$1"
DATE=$(date +%Y-%m-%d)
DEST="backup-$DATE"

if [ -d "$SOURCE" ]; then
  cp -r "$SOURCE" "$DEST"
  echo "Backed up $SOURCE to $DEST"
else
  echo "Source folder not found"
fi`}</Code>
          <P>Every piece here — the shebang, a variable, an argument, a conditional, a familiar command from Terminal Fundamentals — has already been covered individually. This is simply all of it, composed into one small, genuinely useful tool.</P>
        </>),
      },
    ],
    retrieval: { q: "What line must appear first in a bash script to tell the system which interpreter to use?", a: "The shebang line (e.g. #!/bin/bash)" },
    recap: ["A script needs a shebang line and execute permission (chmod +x) to run", "Variables use $name; $1, $2 etc. refer to arguments passed to the script", "if/else and for loops give scripts real control flow", "Functions group reusable logic, with their own local $1", "A real script is just these pieces composed together toward one useful task"],
  },
  {
    id: "cli:packages",
    icon: "📦",
    title: "Package Management & Making It Yours",
    blurb: "How software actually gets installed on Linux, and the small customizations that make a shell feel like home.",
    chapters: [
      {
        title: "How Software Gets Installed on Linux",
        body: () => (<>
          <P>Rather than downloading installers from random websites, Debian-based Linux systems pull software from trusted, centrally maintained <Strong>package repositories</Strong> — verified, versioned, and easy to update all at once. This is the same basic idea as an app store, years before app stores were a mainstream concept.</P>
        </>),
      },
      {
        title: "apt vs. dpkg",
        body: () => (<>
          <P>Debian's package system actually has two layers. <Code>dpkg</Code> is the low-level tool that installs, removes, and inspects individual <Code>.deb</Code> package files directly — but it has no idea about dependencies between packages. <Code>apt</Code> sits on top of dpkg, handles dependency resolution automatically, and can fetch packages from a repository over the network.</P>
          <Code block>{`sudo apt update            # refresh the list of available packages
sudo apt install nginx     # install a package, and anything it depends on
sudo apt remove nginx      # remove it again`}</Code>
          <MemoryHook>dpkg is the mechanic who can install one part if you hand it exactly the right part. apt is the parts-store clerk who also knows what else you'll need to make that part actually work.</MemoryHook>
        </>),
      },
      {
        title: "Package Management Elsewhere",
        body: () => (<>
          <P>The same core idea shows up under different names on every platform:</P>
          <DataTable headers={["Platform", "Tool", "Example"]} rows={[["Debian/Ubuntu Linux", "apt", "sudo apt install git"], ["macOS (unofficial but standard)", "Homebrew", "brew install git"], ["Windows", "winget", "winget install Git.Git"]]} />
          <P>None of these ship with every operating system by default in quite the same way (Homebrew is a beloved third-party addition on macOS, not an Apple product), but all three solve the exact same problem: reliable, repository-backed software installation instead of hunting for installers.</P>
        </>),
      },
      {
        title: "Customizing Your Prompt",
        body: () => (<>
          <P>The text your shell shows before every command — your <Strong>prompt</Strong> — is fully configurable through a variable called <Code>PS1</Code> in bash. Popular frameworks like <Strong>oh-my-zsh</Strong> package up hundreds of ready-made prompt themes and plugins, so most people customize by choosing a theme rather than hand-writing prompt syntax from scratch.</P>
        </>),
      },
      {
        title: "Dotfiles: Your Shell, Portable",
        body: () => (<>
          <P>Shell configuration lives in files starting with a dot — <Code>.bashrc</Code>, <Code>.zshrc</Code>, <Code>.vimrc</Code> — hidden from a normal <Code>ls</Code> but shown by <Code>ls -la</Code>, tying directly back to Terminal Fundamentals. Many developers keep their dotfiles in a personal git repository, so setting up a brand-new machine to feel exactly like their old one is a single <Code>git clone</Code> away.</P>
          <Callout title="Where this phase closes" tone="green">Filesystem navigation, permissions, an editor, version control, scripting, and package management — this is genuinely the full toolkit a working developer reaches for daily. Everything in the Programming phase next gets written, saved, run, and version-controlled using exactly what you just learned here.</Callout>
        </>),
      },
    ],
    retrieval: { q: "What's the key difference between apt and dpkg?", a: "apt handles dependencies and fetches from a repository; dpkg only installs individual package files directly" },
    recap: ["Linux installs software from trusted package repositories rather than random installers", "apt sits on top of dpkg, adding dependency resolution and network fetching", "Homebrew (macOS) and winget (Windows) solve the same problem on other platforms", "PS1 and frameworks like oh-my-zsh customize your shell prompt", "Dotfiles (.bashrc, .vimrc, etc.) hold your personal configuration and are often version-controlled with git"],
  },
];

/* ══════════════════════ INTERACTIVE: CODE EXECUTION TRACER ══════════════════════ */
const TRACE_LINES = [
  "total = 0",
  "for i in range(3):",
  "    total = total + i",
  "print(total)",
];
const TRACE_STEPS = [
  { line: 0, vars: {}, note: "Nothing has run yet." },
  { line: 0, vars: { total: 0 }, note: "total is created and set to 0." },
  { line: 1, vars: { total: 0, i: 0 }, note: "The loop starts. i is 0 for this pass." },
  { line: 2, vars: { total: 0, i: 0 }, note: "total becomes total + i → 0 + 0 = 0." },
  { line: 1, vars: { total: 0, i: 1 }, note: "Loop returns to the top. i is now 1." },
  { line: 2, vars: { total: 1, i: 1 }, note: "total becomes total + i → 0 + 1 = 1." },
  { line: 1, vars: { total: 1, i: 2 }, note: "Loop returns to the top. i is now 2." },
  { line: 2, vars: { total: 3, i: 2 }, note: "total becomes total + i → 1 + 2 = 3." },
  { line: 1, vars: { total: 3, i: 2 }, note: "The loop condition is no longer true — it ends." },
  { line: 3, vars: { total: 3, i: 2 }, note: "print(total) runs, showing 3." },
];
function CodeTracer() {
  const { t } = useT();
  const [step, setStep] = useState(0);
  const cur = TRACE_STEPS[step];
  const next = () => setStep((s) => Math.min(s + 1, TRACE_STEPS.length - 1));
  const reset = () => setStep(0);
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: 26, margin: "24px 0" }}>
      <div style={{ fontFamily: F_MONO, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: t.accent, marginBottom: 18 }}>🎮 Interactive · Code Execution Tracer</div>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18, alignItems: "start" }}>
        <div style={{ background: t.codeBg, borderRadius: 10, padding: "14px 0", fontFamily: F_MONO, fontSize: 13.5 }}>
          {TRACE_LINES.map((line, i) => (
            <div key={i} style={{ padding: "5px 18px", background: i === cur.line ? t.accentSoft : "transparent", borderLeft: i === cur.line ? `3px solid ${t.accent}` : "3px solid transparent", color: i === cur.line ? t.accent : t.green, whiteSpace: "pre" }}>{line}</div>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: F_MONO, fontSize: 10.5, color: t.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Variables</div>
          {Object.keys(cur.vars).length === 0 ? (
            <div style={{ fontFamily: F_BODY, fontSize: 13, color: t.textMuted, fontStyle: "italic" }}>none yet</div>
          ) : Object.entries(cur.vars).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", background: t.surfaceAlt, borderRadius: 7, padding: "6px 12px", marginBottom: 6, fontFamily: F_MONO, fontSize: 13 }}>
              <span style={{ color: t.blue }}>{k}</span><span style={{ color: t.green, fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <p style={{ fontFamily: F_BODY, color: t.textSecondary, fontSize: 14, lineHeight: 1.6, minHeight: 42, marginTop: 16 }}>{cur.note}</p>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={reset} style={{ background: "none", border: `1px solid ${t.border}`, color: t.textSecondary, borderRadius: 9, padding: "10px 18px", fontFamily: F_UI, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Reset</button>
        <button onClick={next} disabled={step === TRACE_STEPS.length - 1} style={{ background: t.accent, color: "#fff", border: 0, borderRadius: 9, padding: "10px 22px", fontFamily: F_UI, fontWeight: 600, fontSize: 13.5, cursor: step === TRACE_STEPS.length - 1 ? "default" : "pointer", opacity: step === TRACE_STEPS.length - 1 ? 0.5 : 1 }}>Step →</button>
      </div>
    </div>
  );
}

/* ══════════════════════ DIAGRAM: DATA STRUCTURES SIDE BY SIDE ══════════════════════ */
function DataStructureDiagram() {
  const { t } = useT();
  const list = ["\"apple\"", "\"banana\"", "\"cherry\""];
  const dict = [["name", "\"Alice\""], ["age", "30"], ["active", "true"]];
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24, margin: "22px 0" }}>
      <div style={{ fontFamily: F_MONO, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: t.accent, marginBottom: 18 }}>📊 Diagram · List vs. Dictionary</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <div style={{ fontFamily: F_UI, fontWeight: 600, fontSize: 13, color: t.text, marginBottom: 10 }}>List — ordered, indexed by position</div>
          <div style={{ display: "flex", gap: 6 }}>
            {list.map((v, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ background: t.blueSoft, border: `1px solid ${t.blue}`, borderRadius: 8, padding: "10px 8px", fontFamily: F_MONO, fontSize: 12, color: t.blue, minWidth: 62 }}>{v}</div>
                <div style={{ fontFamily: F_MONO, fontSize: 10.5, color: t.textMuted, marginTop: 4 }}>[{i}]</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: F_UI, fontWeight: 600, fontSize: 13, color: t.text, marginBottom: 10 }}>Dictionary — key looks up value</div>
          {dict.map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ background: t.purpleSoft, border: `1px solid ${t.purple}`, borderRadius: 7, padding: "7px 10px", fontFamily: F_MONO, fontSize: 12, color: t.purple }}>{k}</div>
              <span style={{ color: t.textMuted }}>→</span>
              <div style={{ background: t.greenSoft, border: `1px solid ${t.green}`, borderRadius: 7, padding: "7px 10px", fontFamily: F_MONO, fontSize: 12, color: t.green }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════ DIAGRAM: COMPILED ↔ INTERPRETED SPECTRUM ══════════════════════ */
function CompiledSpectrum() {
  const { t } = useT();
  const langs = [{ name: "C / C++", pos: 6, note: "Compiled ahead of time" }, { name: "JavaScript", pos: 52, note: "JIT — compiled while running" }, { name: "Python", pos: 94, note: "Interpreted line by line" }];
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20, margin: "18px 0" }}>
      <div style={{ fontFamily: F_MONO, fontSize: 10.5, letterSpacing: 1, textTransform: "uppercase", color: t.accent, marginBottom: 26 }}>📊 Diagram · Compiled ↔ Interpreted Spectrum</div>
      <div style={{ position: "relative", height: 6, background: `linear-gradient(90deg, ${t.blue}, ${t.purple}, ${t.accent})`, borderRadius: 4, margin: "0 10px 46px" }}>
        {langs.map((l) => (
          <div key={l.name} style={{ position: "absolute", left: `${l.pos}%`, top: 0, transform: "translateX(-50%)" }}>
            <div style={{ width: 3, height: 16, background: t.text, margin: "0 auto" }} />
            <div style={{ textAlign: "center", marginTop: 6, whiteSpace: "nowrap" }}>
              <div style={{ fontFamily: F_UI, fontWeight: 700, fontSize: 12.5, color: t.text }}>{l.name}</div>
              <div style={{ fontFamily: F_MONO, fontSize: 10, color: t.textMuted }}>{l.note}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F_MONO, fontSize: 10, color: t.textMuted }}>
        <span>Compiled — faster, extra build step</span><span>Interpreted — instant, slower</span>
      </div>
    </div>
  );
}

/* ══════════════════════ CONTENT MODEL ══════════════════════ */
const TOPICS_PROGRAMMING = [
  {
    id: "programming:fundamentals",
    icon: "{ }",
    title: "Programming Fundamentals",
    blurb: "Variables, types, and expressions — the vocabulary every language builds on, regardless of syntax.",
    chapters: [
      {
        title: "What Is a Program, Really?",
        body: () => (<>
          <P>A program is nothing more than a sequence of instructions, executed in order, one at a time — the exact same fetch-decode-execute idea from the Hardware phase, just written in a form humans can read instead of raw binary. Every language you'll ever learn is ultimately a more comfortable way of writing those instructions.</P>
          <MemoryHook>Underneath every "fancy" language feature, a CPU is still just fetching one instruction after another. Nothing you learn from here forward replaces that — it's all just increasingly comfortable ways of telling the CPU what to do.</MemoryHook>
        </>),
      },
      {
        title: "Variables: Named Boxes for Values",
        body: () => (<>
          <P>A <Strong>variable</Strong> is a named location that holds a value you can refer to later and change over time. Naming things is what makes code readable — <Code>total = 0</Code> tells a reader what's being tracked; a bare, unnamed number wouldn't.</P>
          <Code block>{`age = 25
name = "Alice"
is_student = True`}</Code>
        </>),
      },
      {
        title: "Data Types",
        body: () => (<>
          <P>Every value has a <Strong>type</Strong> — a category describing what kind of data it is and what you're allowed to do with it.</P>
          <DataTable headers={["Type", "Example", "Typical use"]} rows={[
            ["Integer", "42", "Whole numbers — counts, ages, indexes"],
            ["Float", "3.14", "Numbers with a decimal point"],
            ["String", '"hello"', "Text"],
            ["Boolean", "True / False", "Exactly the two-value logic from the Logic phase"],
          ]} />
          <Callout title="Why types matter" tone="blue">Adding two numbers and adding two pieces of text mean completely different things (3 + 4 = 7, but "3" + "4" is often "34" — concatenation, not arithmetic). Types exist so the language knows which behavior you actually want.</Callout>
        </>),
      },
      {
        title: "Expressions & Operators",
        body: () => (<>
          <P>An <Strong>expression</Strong> is anything that evaluates to a value: <Code>2 + 2</Code>, <Code>age &gt;= 18</Code>, <Code>name == "Alice"</Code>. The comparison and boolean operators here are the exact AND/OR/NOT you already learned in the Logic phase, just applied to real program values instead of abstract 1s and 0s.</P>
          <Code block>{`is_adult = age >= 18
can_vote = is_adult and is_citizen`}</Code>
        </>),
      },
      {
        title: "Comments & Readability",
        body: () => (<>
          <P>A <Strong>comment</Strong> is text the language ignores entirely, written purely for the humans reading the code — including your future self, six months later, who will have forgotten exactly why a piece of code exists.</P>
          <Code block>{`# This calculates a 15% tip
tip = bill * 0.15`}</Code>
          <MemoryHook>Code is read far more often than it's written. A comment explaining "why," not "what," is one of the cheapest investments in your own future sanity that programming offers.</MemoryHook>
        </>),
      },
    ],
    retrieval: { q: "Why does adding two numbers behave differently from adding two strings?", a: "Their types are different — types define which operations mean what for that kind of value" },
    recap: ["A program is a sequence of instructions — the human-readable version of fetch-decode-execute", "Variables are named locations that hold and can change a value", "Every value has a type (integer, float, string, boolean) that determines what operations mean for it", "Expressions evaluate to a value, using the same comparison/boolean operators from Logic", "Comments explain code to humans and are ignored by the language itself"],
  },
  {
    id: "programming:control-flow",
    icon: "⤾",
    title: "Control Flow",
    blurb: "Making decisions and repeating work — the two mechanisms that turn a straight-line list of instructions into a real program.",
    chapters: [
      {
        title: "Making Decisions: if / else",
        body: () => (<>
          <P>An <Code>if</Code> statement runs a block of code only when a condition evaluates to true — exactly the Boolean expressions from the previous topic, now controlling which instructions actually execute.</P>
          <Code block>{`if age >= 18:
    print("You can vote")
else:
    print("Not yet")`}</Code>
        </>),
      },
      {
        title: "Repeating Work: while Loops",
        body: () => (<>
          <P>A <Code>while</Code> loop repeats a block of code for as long as a condition stays true, checking that condition again before every single pass.</P>
          <Code block>{`count = 0
while count < 3:
    print(count)
    count = count + 1`}</Code>
          <Callout title="The infinite loop trap" tone="red">If the condition never becomes false — commonly because the code inside forgets to update the variable being checked — the loop runs forever. Every programmer eventually freezes a program this way at least once; it's a rite of passage, not a sign you're doing something wrong.</Callout>
        </>),
      },
      {
        title: "Repeating Over Collections: for Loops",
        body: () => (<>
          <P>A <Code>for</Code> loop repeats once per item in a collection, without needing to manually track a counter:</P>
          <Code block>{`fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)`}</Code>
          <P><Code>range(3)</Code> generates the sequence 0, 1, 2 — a common way to loop a fixed number of times without an actual collection to iterate over.</P>
        </>),
      },
      {
        title: "Nesting and Complexity",
        body: () => (<>
          <P>Conditionals and loops can contain other conditionals and loops, and real programs frequently do exactly this — a loop inside a loop, an if inside a for. Each level of nesting adds one more layer of indentation and one more layer of "what's true right now" to track mentally.</P>
          <Code block>{`for i in range(3):
    for j in range(3):
        if i == j:
            print("match")`}</Code>
          <MemoryHook>Deep nesting is a readability warning sign, not a badge of honor. Experienced programmers actively look for ways to flatten nested logic — often by pulling a piece into its own function, the topic right after this one.</MemoryHook>
        </>),
      },
      {
        title: "Tracing Execution, Step by Step",
        body: () => (<>
          <P>The single most useful debugging skill in all of programming is simply tracing through code by hand, one line at a time, tracking what every variable holds at each step — exactly what the tool below does for you.</P>
          <CodeTracer />
        </>),
      },
    ],
    simulator: true,
    retrieval: { q: "What's the key difference between a while loop and a for loop over a collection?", a: "while repeats based on a condition being checked each time; for repeats once per item without manual counting" },
    recap: ["if/else runs code conditionally, based on a Boolean expression", "while loops repeat based on a condition; for loops repeat once per item in a collection", "Forgetting to update a while loop's condition variable causes an infinite loop", "Loops and conditionals can nest, but deep nesting is a sign to consider pulling logic into a function", "Tracing code by hand, line by line, is one of the most valuable debugging skills there is"],
  },
  {
    id: "programming:functions",
    icon: "ƒ",
    title: "Functions & Scope",
    blurb: "Packaging logic into reusable, nameable pieces — and understanding exactly where a variable is allowed to be seen.",
    chapters: [
      {
        title: "Why Functions Exist",
        body: () => (<>
          <P>A <Strong>function</Strong> is a named, reusable block of code you can call from anywhere instead of retyping the same logic repeatedly. Beyond saving typing, naming a chunk of logic (<Code>calculate_tip</Code> instead of five unlabeled lines) makes the surrounding code dramatically easier to read.</P>
          <Code block>{`def greet(name):
    print("Hello, " + name)

greet("Alice")
greet("Bob")`}</Code>
        </>),
      },
      {
        title: "Parameters, Arguments, Return Values",
        body: () => (<>
          <P>A <Strong>parameter</Strong> is a named input a function expects; an <Strong>argument</Strong> is the actual value supplied when calling it. A <Code>return</Code> statement sends a value back out to whoever called the function.</P>
          <Code block>{`def add(a, b):
    return a + b

result = add(3, 4)   # result is now 7`}</Code>
          <MemoryHook>Parameters are the labeled blanks on a form; arguments are what you actually write in those blanks each time you fill one out.</MemoryHook>
        </>),
      },
      {
        title: "Scope: Where a Variable Lives",
        body: () => (<>
          <P>A variable created inside a function only exists inside that function — this is called <Strong>local scope</Strong>. A variable created outside any function has <Strong>global scope</Strong> and can (carefully) be seen everywhere.</P>
          <Code block>{`def my_function():
    x = 5  # local — only exists inside here
    print(x)

my_function()
print(x)  # error — x doesn't exist out here`}</Code>
          <Callout title="Why this is a feature, not a limitation" tone="green">Scoping prevents a variable named <Code>x</Code> in one function from accidentally colliding with an unrelated <Code>x</Code> somewhere else in a large program. It's the same "hide the complexity below" idea from the Hardware phase's layered stack, applied to your own code.</Callout>
        </>),
      },
      {
        title: "Recursion: Functions Calling Themselves",
        body: () => (<>
          <P>A function can call itself — this is <Strong>recursion</Strong>, and it's a natural fit for problems that are naturally defined in terms of smaller versions of themselves.</P>
          <Code block>{`def countdown(n):
    if n == 0:
        print("Liftoff!")
    else:
        print(n)
        countdown(n - 1)`}</Code>
          <P>Every recursive function needs a <Strong>base case</Strong> — a condition where it stops calling itself — or it recurses forever, exactly like a while loop with no way to become false.</P>
        </>),
      },
      {
        title: "Pure vs. Impure Functions",
        body: () => (<>
          <P>A <Strong>pure</Strong> function always returns the same output for the same input and doesn't change anything outside itself. An <Strong>impure</Strong> function might print something, modify a global variable, or depend on something outside its own parameters — its behavior can vary even with identical inputs.</P>
          <Code block>{`# pure
def square(x):
    return x * x

# impure — depends on and changes something external
total = 0
def add_to_total(x):
    global total
    total = total + x`}</Code>
          <MemoryHook>Pure functions are predictable and easy to test in isolation — feed them an input, get an answer, no surprises. Impure functions are sometimes necessary (you have to print something eventually) but harder to reason about, because their behavior depends on more than just what you handed them.</MemoryHook>
        </>),
      },
    ],
    retrieval: { q: "What must every recursive function have to avoid running forever?", a: "A base case — a condition where it stops calling itself" },
    recap: ["Functions package reusable logic under a name, taking parameters and often returning a value", "Local variables only exist inside the function that created them; global variables exist everywhere", "Recursion is a function calling itself, and needs a base case to eventually stop", "Pure functions always return the same output for the same input and affect nothing external", "Impure functions depend on or change something outside themselves, which makes them harder to reason about"],
  },
  {
    id: "programming:data-structures",
    icon: "▦",
    title: "Data Structures",
    blurb: "Lists, dictionaries, and the art of picking the right shape to hold your data.",
    chapters: [
      {
        title: "Lists: Ordered Collections",
        body: () => (<>
          <P>A <Strong>list</Strong> (called an array in many other languages) holds multiple values in a specific order, each reachable by its numeric position, or <Strong>index</Strong> — starting at 0, not 1, in almost every mainstream language.</P>
          <Code block>{`fruits = ["apple", "banana", "cherry"]
fruits[0]        # "apple"
fruits.append("date")
len(fruits)      # 4`}</Code>
        </>),
      },
      {
        title: "Dictionaries: Key-Value Pairs",
        body: () => (<>
          <P>A <Strong>dictionary</Strong> (called an object in JavaScript, a map or hash in other languages) stores values looked up by a meaningful key instead of a numeric position.</P>
          <Code block>{`person = {"name": "Alice", "age": 30}
person["name"]     # "Alice"
person["age"] = 31  # update a value`}</Code>
          <DataStructureDiagram />
        </>),
      },
      {
        title: "Choosing the Right Structure",
        body: () => (<>
          <P>The choice between a list and a dictionary usually comes down to one question: does order matter, or does a meaningful name matter more? A shopping list is naturally a list — order is somewhat meaningful and items don't need names. A user profile is naturally a dictionary — "name" and "age" are meaningful labels, and their order doesn't matter at all.</P>
          <MemoryHook>List: "give me the third thing." Dictionary: "give me the thing called 'age'." Same underlying idea — storing multiple values — solved for two different questions.</MemoryHook>
        </>),
      },
      {
        title: "Nested Structures",
        body: () => (<>
          <P>Structures can contain other structures — a list of dictionaries is an extremely common real-world shape, representing something like a table of records:</P>
          <Code block>{`users = [
    {"name": "Alice", "age": 30},
    {"name": "Bob", "age": 25},
]
users[0]["name"]   # "Alice"`}</Code>
          <P>Almost any real dataset you'll encounter — rows from a database, results from a web API — arrives in exactly this nested list-of-dictionaries shape.</P>
        </>),
      },
      {
        title: "A Visual Tour",
        body: () => (<>
          <P>Seeing these two structures side by side, drawn out, makes the distinction concrete rather than abstract:</P>
          <DataStructureDiagram />
          <Callout title="Where this goes next" tone="green">The Web Fundamentals phase leans on this constantly — JSON, the format nearly every web API speaks, is precisely nested lists and dictionaries, written as text. You've already learned the shape; only the file format will be new.</Callout>
        </>),
      },
    ],
    retrieval: { q: "When would you reach for a dictionary instead of a list?", a: "When you want to look values up by a meaningful name (key) rather than by numeric position" },
    recap: ["A list holds ordered values, accessed by numeric index starting at 0", "A dictionary holds values accessed by a meaningful key instead of position", "Choose based on whether order or meaningful naming matters more for your data", "Structures nest — a list of dictionaries is an extremely common real-world shape", "JSON, used constantly on the web, is exactly this same nested shape written as text"],
  },
  {
    id: "programming:python",
    icon: "🐍",
    title: "Python",
    blurb: "Why whitespace is syntax, why typing is dynamic, and why an enormous share of data science and AI code is written here.",
    chapters: [
      {
        title: "Whitespace as Syntax",
        body: () => (<>
          <P>Most languages use curly braces <Code>{'{ }'}</Code> to mark a block of code. Python uses indentation itself — the whitespace before each line is not just for readability, it's how the language knows which lines belong to which block.</P>
          <Code block>{`if True:
    print("inside the if")
    print("still inside")
print("outside the if")`}</Code>
          <Callout title="A deliberate design choice" tone="blue">Python's creator, Guido van Rossum, made this choice specifically because inconsistent indentation in other languages made code confusing to read even when it was technically correct. Making indentation mandatory forces every Python program to at least look consistently readable.</Callout>
        </>),
      },
      {
        title: "Dynamic Typing",
        body: () => (<>
          <P>Python doesn't require you to declare a variable's type in advance, and a variable can even hold a different type of value later in the program — this is <Strong>dynamic typing</Strong>. The type still exists and still matters; Python just figures it out at the moment a value is assigned, rather than requiring you to state it upfront.</P>
          <Code block>{`x = 5        # x is currently an integer
x = "hello"  # now x is a string — perfectly legal in Python`}</Code>
        </>),
      },
      {
        title: "Python's Batteries-Included Philosophy",
        body: () => (<>
          <P>Python ships with an enormous standard library covering dates, file handling, math, networking, and far more — the "batteries included" philosophy, meaning you rarely need an external tool for common tasks. Beyond the standard library, a massive ecosystem of third-party packages (installed via <Code>pip</Code>, Python's own package manager) covers virtually everything else.</P>
        </>),
      },
      {
        title: "Lists, Dicts, and Comprehensions",
        body: () => (<>
          <P>Python offers a compact way to build a list from another collection in a single line, called a <Strong>list comprehension</Strong>:</P>
          <Code block>{`squares = [x * x for x in range(5)]
# same as:
squares = []
for x in range(5):
    squares.append(x * x)`}</Code>
          <P>Both versions produce the identical result — the comprehension is simply a denser, more idiomatic way to express "build a new list by transforming each item in this one."</P>
        </>),
      },
      {
        title: "Why Python Took Over Data Science & AI",
        body: () => (<>
          <P>Python's combination of readable syntax and a mature ecosystem of numerical libraries (built originally for scientific computing) made it the default language for machine learning and data analysis — not because it's the fastest language (it usually isn't), but because those libraries do the heavy performance-critical work in fast, compiled code underneath, while Python provides a comfortable, readable interface on top.</P>
          <MemoryHook>Python is often the friendly front door to code that's actually doing its heavy lifting in C underneath — the exact layered-stack idea from Hardware, now showing up inside a single library instead of an entire operating system.</MemoryHook>
        </>),
      },
    ],
    retrieval: { q: "What determines the boundaries of a code block in Python, instead of curly braces?", a: "Indentation (whitespace) itself is syntactically meaningful" },
    recap: ["Python uses indentation, not braces, to mark code blocks", "Python is dynamically typed — a variable's type is determined at assignment, and can change", "The standard library plus pip-installed packages cover most needs without external tools", "A list comprehension is a compact way to build a list by transforming another collection", "Python dominates data science/AI largely because its libraries do heavy work in fast compiled code underneath a readable interface"],
  },
  {
    id: "programming:js-c",
    icon: "◈",
    title: "JavaScript & C/C++: The Two Extremes",
    blurb: "One language built for the browser and forgiving by design; two languages built for raw speed and direct memory control.",
    chapters: [
      {
        title: "JavaScript: Built for the Browser",
        body: () => (<>
          <P>JavaScript was created to make web pages interactive and remains the only programming language every major browser runs natively — a genuinely unique position no other language shares. Its syntax uses curly braces for blocks (unlike Python) and, unlike Python's strict indentation rules, is comparatively forgiving about formatting.</P>
          <Code block>{`function greet(name) {
  console.log("Hello, " + name);
}
greet("Alice");`}</Code>
        </>),
      },
      {
        title: "Asynchronous JavaScript, Briefly",
        body: () => (<>
          <P>A web page often needs to wait on something slow — a network request, a timer — without freezing the entire page while it waits. JavaScript handles this with <Strong>asynchronous</Strong> code: an operation starts, the rest of the page keeps responding, and a callback runs once the slow operation finishes.</P>
          <Code block>{`console.log("1: starting");
setTimeout(() => console.log("3: this runs later"), 1000);
console.log("2: this runs immediately");`}</Code>
          <P>Notice the numbers print out of typed order — "1", "2", then "3" a full second later — because the timer doesn't block anything else from running while it waits. This single idea (don't freeze while waiting) is foundational to why the web feels responsive at all.</P>
        </>),
      },
      {
        title: "C: Closer to the Machine",
        body: () => (<>
          <P>C strips away nearly everything between your code and the actual hardware — no automatic memory cleanup, no built-in safety nets, and a compiler that turns your code directly into the machine instructions from the Hardware phase, rather than interpreting it line by line at runtime.</P>
          <Code block>{`#include <stdio.h>

int main() {
    int x = 5;
    printf("%d\\n", x);
    return 0;
}`}</Code>
          <P>Notice the type (<Code>int</Code>) is declared explicitly — the opposite of Python's dynamic typing. C wants to know exactly how much memory to set aside, in advance, for every value.</P>
        </>),
      },
      {
        title: "Pointers & Manual Memory",
        body: () => (<>
          <P>A <Strong>pointer</Strong> is a variable that holds a memory address rather than a value directly — literally an address into the RAM you learned about in the Hardware phase's memory hierarchy chapter. C requires the programmer to manually request memory (<Code>malloc</Code>) and release it (<Code>free</Code>) when finished; forgetting to free it causes a <Strong>memory leak</Strong>, and using it after freeing causes a crash or, worse, a security vulnerability.</P>
          <Callout title="Why Python doesn't make you do this" tone="purple">Python and JavaScript both use <Strong>garbage collection</Strong> — the language automatically frees memory it can prove is no longer reachable, trading a small amount of runtime overhead for removing an entire category of bugs C programmers have to manage by hand.</Callout>
        </>),
      },
      {
        title: "Compiled vs. Interpreted — The Spectrum",
        body: () => (<>
          <P>C is <Strong>compiled</Strong>: an entire program is translated into machine code once, ahead of time, then run directly by the CPU — fast, but requiring a separate compile step after every change. Python is <Strong>interpreted</Strong>: a program is read and executed line by line by another program (the Python interpreter) at runtime — slower, but instantly runnable with no separate build step. JavaScript sits in between, using a technique called just-in-time (JIT) compilation that compiles hot code on the fly, while it runs.</P>
          <CompiledSpectrum />
          <MemoryHook>Compiled vs. interpreted is a spectrum, not a binary choice, and where a language sits on it is a direct tradeoff between raw speed and how instantly you can run and change your code.</MemoryHook>
        </>),
      },
    ],
    retrieval: { q: "What's the fundamental tradeoff between a compiled language like C and an interpreted one like Python?", a: "Compiled code runs faster but needs a build step; interpreted code runs instantly but slower" },
    recap: ["JavaScript is the only language every browser runs natively, and is comparatively forgiving about syntax", "Asynchronous JavaScript lets slow operations run without freezing the whole page", "C compiles directly to machine code and requires explicit type declarations", "Pointers hold memory addresses directly; C requires manually requesting and freeing memory", "Python and JavaScript use garbage collection to automate memory management that C leaves to the programmer"],
  },
];
/* ══════════════════════ INTERACTIVE: CSS BOX MODEL VISUALIZER ══════════════════════ */
function BoxModelVisualizer() {
  const { t } = useT();
  const [margin, setMargin] = useState(20);
  const [border, setBorder] = useState(6);
  const [padding, setPadding] = useState(24);
  const Slider = (label, val, setVal, color) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F_MONO, fontSize: 12, marginBottom: 5 }}>
        <span style={{ color }}>{label}</span><span style={{ color: t.textMuted }}>{val}px</span>
      </div>
      <input type="range" min="0" max="40" value={val} onChange={(e) => setVal(+e.target.value)} style={{ width: "100%" }} />
    </div>
  );
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: 26, margin: "24px 0" }}>
      <div style={{ fontFamily: F_MONO, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: t.accent, marginBottom: 18 }}>🎮 Interactive · CSS Box Model</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
        <div>
          {Slider("margin", margin, setMargin, t.textMuted)}
          {Slider("border", border, setBorder, t.accent)}
          {Slider("padding", padding, setPadding, t.blue)}
        </div>
        <div style={{ background: t.surfaceAlt, borderRadius: 10, padding: 10 }}>
          <div style={{ background: "transparent", border: `${margin}px dashed ${t.textMuted}55`, padding: 0 }}>
            <div style={{ background: t.accent + "33", border: `${border}px solid ${t.accent}`, padding: 0 }}>
              <div style={{ background: t.blue + "33", border: `${padding}px solid transparent`, backgroundClip: "content-box" }}>
                <div style={{ background: t.surface, padding: "16px 10px", textAlign: "center", fontFamily: F_MONO, fontSize: 11, color: t.text }}>content</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Callout title="Reading the box, outside in" tone="blue">Every element is, in order from the outside: <Strong>margin</Strong> (space outside the border, between this element and its neighbors), <Strong>border</Strong> (a visible line), <Strong>padding</Strong> (space inside the border, before the content starts), and finally the <Strong>content</Strong> itself. This is precisely the "snug but not trapped" spacing idea from earlier — padding keeps content from touching its own edges, margin keeps elements from touching each other.</Callout>
    </div>
  );
}

/* ══════════════════════ CONTENT MODEL ══════════════════════ */
const TOPICS_WEB = [
  {
    id: "web:html",
    icon: "</>",
    title: "HTML: The Structure of a Page",
    blurb: "Markup, not programming — the tags that give a web page its shape before any style or behavior is added.",
    chapters: [
      {
        title: "What HTML Actually Is",
        body: () => (<>
          <P>HTML (HyperText Markup Language) isn't a programming language in the sense Programming used the word — there's no logic, no loops, no variables. It's <Strong>markup</Strong>: text wrapped in tags that describe what each piece of content <em>is</em> — a heading, a paragraph, a link — leaving how it looks entirely to CSS.</P>
          <Code block>{`<h1>This is a heading</h1>
<p>This is a paragraph.</p>`}</Code>
          <MemoryHook>HTML answers "what is this?" CSS answers "how should it look?" JavaScript answers "what should it do?" Three separate jobs, three separate languages, on purpose.</MemoryHook>
        </>),
      },
      {
        title: "The Document Skeleton",
        body: () => (<>
          <P>Every HTML page shares the same basic skeleton: an outer <Code>{'<html>'}</Code> tag, a <Code>{'<head>'}</Code> holding metadata the browser needs but doesn't display, and a <Code>{'<body>'}</Code> holding everything actually visible on the page.</P>
          <Code block>{`<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello, Web</h1>
  </body>
</html>`}</Code>
        </>),
      },
      {
        title: "Common Elements",
        body: () => (<>
          <P>A small set of tags covers most of what a typical page needs:</P>
          <DataTable headers={["Tag", "Purpose"]} rows={[
            ["h1–h6", "Headings, from most to least important"],
            ["p", "A paragraph of text"],
            ["a href=\"...\"", "A link to another page"],
            ["img src=\"...\"", "An image"],
            ["ul / li", "An unordered (bulleted) list and its items"],
          ]} />
        </>),
      },
      {
        title: "Semantic HTML",
        body: () => (<>
          <P>Early web pages, and plenty of careless ones since, wrap everything in generic <Code>{'<div>'}</Code> tags — technically functional, but meaningless to anything trying to understand the page's structure, including screen readers and search engines. <Strong>Semantic</Strong> HTML uses tags that describe their actual role:</P>
          <Code block>{`<header>...</header>
<nav>...</nav>
<main>...</main>
<footer>...</footer>`}</Code>
          <Callout title="Why this actually matters" tone="green">A screen reader can announce "navigation" or "main content" to a visually impaired user only if the underlying HTML says so. A wall of unlabeled <Code>{'<div>'}</Code> tags looks identical on screen but is functionally invisible in terms of structure to anyone not looking at it visually.</Callout>
        </>),
      },
      {
        title: "Forms: Getting Input From a User",
        body: () => (<>
          <P>A <Code>{'<form>'}</Code> collects user input and sends it somewhere — the entire mechanism behind login pages, search bars, and checkout flows.</P>
          <Code block>{`<form action="/submit" method="post">
  <input type="text" name="username" />
  <input type="password" name="password" />
  <button type="submit">Log In</button>
</form>`}</Code>
          <P><Code>method="post"</Code> sends the data in the request body rather than visibly in the URL — the right choice for anything sensitive, like a password.</P>
        </>),
      },
    ],
    retrieval: { q: "What's the core difference in job between HTML and CSS?", a: "HTML describes what content is (structure); CSS describes how it looks" },
    recap: ["HTML is markup, not programming — tags describe what content is, not how it behaves", "Every page shares the html/head/body skeleton", "A small set of tags (headings, paragraphs, links, images, lists) covers most content", "Semantic tags (header, nav, main, footer) communicate structure to screen readers and search engines, not just browsers", "Forms collect and submit user input; method=\"post\" keeps sensitive data out of the visible URL"],
  },
  {
    id: "web:css",
    icon: "◫",
    title: "CSS: Styling and Layout",
    blurb: "Selecting elements, resolving conflicting styles, and the box model every single element on the web is built from.",
    chapters: [
      {
        title: "Selectors: Targeting What to Style",
        body: () => (<>
          <P>A CSS rule pairs a <Strong>selector</Strong> (which elements to target) with a set of properties to apply:</P>
          <Code block>{`p {
  color: navy;
}
.highlight {
  background: yellow;
}
#main-title {
  font-size: 32px;
}`}</Code>
          <P>A bare tag name (<Code>p</Code>) targets every paragraph. A dot (<Code>.highlight</Code>) targets a class, reusable across many elements. A hash (<Code>#main-title</Code>) targets one specific element by its unique ID.</P>
        </>),
      },
      {
        title: "The Cascade & Specificity",
        body: () => (<>
          <P>The "C" in CSS stands for Cascading — when multiple rules target the same element with conflicting properties, CSS resolves the conflict through <Strong>specificity</Strong> rules, roughly: an ID selector beats a class selector, which beats a plain tag selector, with later rules winning ties.</P>
          <Callout title="Why 'it's not working' so often means a specificity fight" tone="blue">A huge share of "my CSS isn't applying" confusion is actually a more specific rule elsewhere quietly winning. Browser developer tools will show you exactly which rule won and why — learning to read that panel is one of the highest-leverage CSS skills there is.</Callout>
        </>),
      },
      {
        title: "The Box Model, Interactively",
        body: () => (<>
          <P>Every single element on a web page — no exceptions — is a rectangular box made of the same four layers: content, padding, border, and margin.</P>
          <BoxModelVisualizer />
        </>),
      },
      {
        title: "Layout: Flexbox Basics",
        body: () => (<>
          <P>Flexbox arranges a row (or column) of elements along a single axis, distributing space between them automatically — the modern default for most simple layout needs.</P>
          <Code block>{`.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}`}</Code>
          <P><Code>justify-content</Code> controls spacing along the main axis (commonly left-to-right); <Code>align-items</Code> controls alignment along the cross axis (commonly top-to-bottom).</P>
        </>),
      },
      {
        title: "Responsive Design: One Page, Every Screen",
        body: () => (<>
          <P>A <Strong>media query</Strong> applies different CSS rules depending on the screen's width, letting one page adapt from a phone to a widescreen monitor:</P>
          <Code block>{`.sidebar {
  width: 300px;
}
@media (max-width: 600px) {
  .sidebar {
    width: 100%;
  }
}`}</Code>
          <MemoryHook>Design "mobile-first" — build the small-screen layout as your default, then use media queries to add complexity for larger screens, rather than the reverse. It's a smaller, more forgiving problem in that direction.</MemoryHook>
        </>),
      },
    ],
    simulator: true,
    retrieval: { q: "Listed from outside to inside, what are the four layers of the CSS box model?", a: "Margin, border, padding, content" },
    recap: ["A CSS rule pairs a selector with properties to apply", "Conflicting rules resolve via specificity — ID beats class beats tag, with later rules winning ties", "Every element is a box: margin, border, padding, then content, from outside in", "Flexbox distributes elements along one axis using justify-content and align-items", "Media queries let one page adapt its layout across different screen sizes"],
  },
  {
    id: "web:js-browser",
    icon: "◇",
    title: "JavaScript in the Browser",
    blurb: "The DOM, responding to clicks, and fetching data — how a static page becomes something that reacts to you.",
    chapters: [
      {
        title: "The DOM: A Live Model of the Page",
        body: () => (<>
          <P>The browser reads your HTML and builds a live, in-memory tree structure called the <Strong>DOM</Strong> (Document Object Model). Crucially, JavaScript doesn't edit your HTML file — it edits this live tree directly, and the browser instantly redraws the page to match. This is exactly why JavaScript can change a page after it's loaded without ever reloading it.</P>
        </>),
      },
      {
        title: "Selecting and Changing Elements",
        body: () => (<>
          <P>JavaScript finds elements in the DOM and changes their content or appearance directly:</P>
          <Code block>{`const title = document.querySelector("h1");
title.textContent = "Updated by JavaScript!";
title.style.color = "orange";`}</Code>
          <P><Code>querySelector</Code> accepts the exact same kind of selector syntax you just learned in CSS — a genuinely direct payoff from the previous topic.</P>
        </>),
      },
      {
        title: "Responding to Events",
        body: () => (<>
          <P>An <Strong>event listener</Strong> runs a function whenever something specific happens — a click, a keystroke, a page load:</P>
          <Code block>{`const button = document.querySelector("button");
button.addEventListener("click", () => {
  alert("Button was clicked!");
});`}</Code>
          <MemoryHook>Nearly every interactive thing you've ever done on a website — a dropdown opening, a form validating, a "like" button filling in — is, underneath, exactly this pattern: listen for an event, then change the DOM in response.</MemoryHook>
        </>),
      },
      {
        title: "Fetching Data from a Server",
        body: () => (<>
          <P>The <Code>fetch</Code> function requests data from a server without reloading the page — the mechanism behind infinite-scrolling feeds, live search suggestions, and every "single-page app."</P>
          <Code block>{`fetch("https://api.example.com/users")
  .then(response => response.json())
  .then(data => console.log(data));`}</Code>
          <Callout title="Foreshadowing Networking" tone="purple">That URL, that request, and the response coming back are exactly the request-response cycle the Networking phase covers in depth — HTTP methods, status codes, headers. You're already using it; Networking explains precisely what's happening underneath.</Callout>
        </>),
      },
      {
        title: "Putting It Together: A Tiny Interactive Widget",
        body: () => (<>
          <P>Combining DOM selection, event listening, and a small amount of state into a genuinely working counter button:</P>
          <Code block>{`let count = 0;
const button = document.querySelector("#counter");

button.addEventListener("click", () => {
  count = count + 1;
  button.textContent = "Clicked " + count + " times";
});`}</Code>
          <P>Every piece here was covered individually earlier in this topic — select an element, listen for an event, update a variable, write it back to the DOM. This is genuinely the entire pattern behind a huge share of interactive web widgets.</P>
        </>),
      },
    ],
    retrieval: { q: "When JavaScript changes a page, what is it actually editing?", a: "The live in-memory DOM tree, not the original HTML file" },
    recap: ["The DOM is a live, in-memory tree the browser builds from your HTML", "JavaScript edits the DOM directly, and the browser redraws instantly to match", "querySelector uses the same selector syntax as CSS", "Event listeners run a function in response to clicks, keystrokes, and other events", "fetch requests data from a server without reloading the page — the same request-response cycle Networking covers in depth"],
  },
  {
    id: "web:page-load",
    icon: "⟳",
    title: "How a Web Page Loads",
    blurb: "The exact sequence of events between typing a URL and seeing a finished page — and why some of it can be slow.",
    chapters: [
      {
        title: "Typing a URL: What Happens First",
        body: () => (<>
          <P>Before any page content can load, your browser needs the actual numeric address of the server hosting it — a human-readable name like "example.com" gets translated to an IP address through a lookup called <Strong>DNS</Strong>, a process covered in full in the Networking phase. Only after that lookup resolves can the browser even attempt to connect.</P>
        </>),
      },
      {
        title: "The Request-Response Cycle",
        body: () => (<>
          <P>Once connected, the browser sends an HTTP <Strong>request</Strong> asking for the page; the server sends back a <Strong>response</Strong> containing the HTML (and a status code indicating success or failure, covered fully in Networking). This single request/response exchange is the foundational unit of essentially everything that happens on the web.</P>
        </>),
      },
      {
        title: "Parsing HTML, Building the DOM",
        body: () => (<>
          <P>As HTML arrives, the browser reads it top to bottom and incrementally builds the DOM tree from the earlier topic — which is why a page can start rendering visible content before the entire file has even finished downloading.</P>
        </>),
      },
      {
        title: "Render-Blocking: CSS and JS",
        body: () => (<>
          <P>A <Code>{'<script>'}</Code> tag in the middle of a page, by default, stops HTML parsing entirely until that script finishes downloading and running — it's <Strong>render-blocking</Strong>. CSS is similarly blocking, since the browser won't paint content it doesn't yet know how to style. This is exactly why script tags are often placed at the very end of <Code>{'<body>'}</Code>, or marked with a <Code>defer</Code> attribute — so they don't hold up everything the user is waiting to see.</P>
        </>),
      },
      {
        title: "Why Page Speed Matters",
        body: () => (<>
          <P>Every step in this chain — DNS lookup, request/response, parsing, render-blocking resources — adds real, measurable time, and users notice surprisingly small delays. This is why professional web development spends real engineering effort on page-load performance: compressing images, deferring non-critical scripts, minimizing what has to happen before something useful appears on screen.</P>
          <MemoryHook>DNS lookup → request/response → HTML parsing → DOM building, with CSS and JS potentially blocking along the way. Five words, five real steps, every single page load, every single time.</MemoryHook>
        </>),
      },
    ],
    retrieval: { q: "Why can a page start showing content before the entire HTML file has finished downloading?", a: "The browser builds the DOM incrementally as HTML arrives, top to bottom" },
    recap: ["DNS translates a human-readable domain name into a numeric IP address before anything else can happen", "A request/response cycle over HTTP is the foundational exchange behind loading a page", "The browser builds the DOM incrementally as HTML streams in", "Scripts and CSS can block rendering, which is why scripts are often deferred or placed at the end", "Page speed is a real engineering discipline because every step in the load chain adds noticeable delay"],
  },
  {
    id: "web:standards",
    icon: "✓",
    title: "Web Standards & Accessibility",
    blurb: "Why the web works the same way (mostly) everywhere, and designing pages that work for everyone, not just the average user.",
    chapters: [
      {
        title: "Why Standards Exist At All",
        body: () => (<>
          <P>The web works because browsers from different companies agree to implement the same published standards — HTML, CSS, and JavaScript specifications maintained by organizations like the W3C and WHATWG. Without shared standards, a page built for one browser could simply fail to work in another.</P>
        </>),
      },
      {
        title: "The Browser Wars, Briefly",
        body: () => (<>
          <P>The 1990s and early 2000s saw real, damaging fragmentation — competing browsers implementing incompatible, non-standard features, forcing developers to write different code for different browsers just to reach everyone. Modern standards compliance is a direct, hard-won response to that painful era, not an accident.</P>
        </>),
      },
      {
        title: "Accessibility: Designing for Everyone",
        body: () => (<>
          <P>Accessibility (often abbreviated a11y) means building pages usable by people with visual, motor, auditory, or cognitive disabilities — not a niche concern, but a substantial share of any real audience. Sufficient color contrast, full keyboard navigation (not just mouse), and meaningful alt text on images are baseline, not advanced, requirements.</P>
          <Code block>{`<img src="chart.png" alt="Bar chart showing sales rising 20% in Q3" />`}</Code>
        </>),
      },
      {
        title: "ARIA & Semantic HTML, Revisited",
        body: () => (<>
          <P>Semantic HTML from the earlier HTML topic is the first and best accessibility tool available — a real <Code>{'<button>'}</Code> is automatically keyboard-operable and correctly announced by screen readers; a <Code>{'<div>'}</Code> styled to look like a button is neither, unless extra ARIA (Accessible Rich Internet Applications) attributes are added by hand to compensate.</P>
          <Callout title="The clearest rule in accessibility" tone="green">Use the native, semantic element that already does the job whenever one exists. ARIA exists to patch gaps when there's genuinely no native element available — not to replace using the correct tag in the first place.</Callout>
        </>),
      },
      {
        title: "Testing What You Build",
        body: () => (<>
          <P>Browser developer tools include real accessibility auditing panels, and simply trying to navigate your own page using only the keyboard (no mouse) surfaces an enormous share of common problems immediately. Building this checking habit early is far cheaper than retrofitting accessibility onto a finished, complex site later.</P>
        </>),
      },
    ],
    retrieval: { q: "Why does a real <button> element beat a <div> styled to look like one?", a: "The real button is automatically keyboard-operable and correctly announced by screen readers; a styled div is neither without extra work" },
    recap: ["Web standards let the same page work consistently across different browsers", "The browser wars of the 90s/2000s directly motivated today's standards compliance", "Accessibility means building for visual, motor, auditory, and cognitive differences — a substantial share of any real audience", "Semantic HTML is the first and best accessibility tool; ARIA patches gaps only where no native element exists", "Keyboard-only navigation testing surfaces most accessibility problems quickly and cheaply"],
  },
  {
    id: "web:sql",
    icon: "🗄",
    title: "SQL: Talking to a Database",
    blurb: "The query language behind nearly every website's data — asking precise questions and getting exact answers back.",
    chapters: [
      {
        title: "What a Database Actually Is",
        body: () => (<>
          <P>A relational database stores data in <Strong>tables</Strong> — rows and columns, much like a spreadsheet — and SQL (Structured Query Language) is how you ask it questions or make changes. Nearly every website with accounts, comments, or products behind the scenes is really just a set of SQL tables being queried constantly.</P>
        </>),
      },
      {
        title: "SELECT: Asking Questions",
        body: () => (<>
          <P>The <Code>SELECT</Code> statement retrieves data:</P>
          <Code block>{`SELECT name, age FROM users;`}</Code>
          <P>Read left to right: select the <Code>name</Code> and <Code>age</Code> columns, from the <Code>users</Code> table. <Code>SELECT *</Code> retrieves every column instead of naming them individually.</P>
        </>),
      },
      {
        title: "WHERE, ORDER BY, and Filtering",
        body: () => (<>
          <P><Code>WHERE</Code> filters which rows come back; <Code>ORDER BY</Code> controls the order they're returned in:</P>
          <Code block>{`SELECT name, age FROM users
WHERE age >= 18
ORDER BY name ASC;`}</Code>
          <P>This is precisely the same comparison logic from the Programming phase's expressions chapter, now filtering real rows in a real table instead of a single variable.</P>
        </>),
      },
      {
        title: "JOIN: Combining Tables",
        body: () => (<>
          <P>Real data is usually spread across multiple related tables — a <Code>users</Code> table and a separate <Code>orders</Code> table, linked by a shared ID. <Code>JOIN</Code> combines rows from both based on that shared value:</P>
          <Code block>{`SELECT users.name, orders.item
FROM users
JOIN orders ON users.id = orders.user_id;`}</Code>
          <MemoryHook>A JOIN is a lookup, exactly like the dictionary lookups from Programming — "find the row over there whose ID matches this row's reference to it" — just operating across two whole tables instead of one dictionary.</MemoryHook>
        </>),
      },
      {
        title: "INSERT, UPDATE, DELETE: Changing Data",
        body: () => (<>
          <P>Beyond asking questions, SQL also changes data directly:</P>
          <Code block>{`INSERT INTO users (name, age) VALUES ("Alice", 30);
UPDATE users SET age = 31 WHERE name = "Alice";
DELETE FROM users WHERE name = "Alice";`}</Code>
          <Callout title="Always test WHERE before you run DELETE or UPDATE" tone="red">Running <Code>UPDATE</Code> or <Code>DELETE</Code> with no <Code>WHERE</Code> clause at all applies the change to every single row in the table — the SQL equivalent of the CLI phase's <Code>rm -rf</Code> warning. Test your <Code>WHERE</Code> condition with a <Code>SELECT</Code> first to see exactly which rows it matches, before changing or deleting anything.</Callout>
        </>),
      },
    ],
    retrieval: { q: "What single mistake turns an UPDATE or DELETE into a mistake affecting the entire table?", a: "Forgetting the WHERE clause" },
    recap: ["A relational database stores data in tables of rows and columns; SQL queries and changes that data", "SELECT retrieves data; WHERE filters rows; ORDER BY sorts the results", "JOIN combines related tables using a shared key, like a lookup across two tables at once", "INSERT, UPDATE, and DELETE change data directly", "Always verify a WHERE clause with SELECT before running UPDATE or DELETE — forgetting it affects the whole table"],
  },
];
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
const TOPICS_NETWORKING = [
  {
    id: "networking:osi",
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
    id: "networking:topologies",
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
    id: "networking:routing",
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
    id: "networking:http-ports",
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
    id: "networking:subnetting",
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
    id: "networking:ccna",
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
/* ══════════════════════ INTERACTIVE: ATTACK LIFECYCLE STEPPER ══════════════════════ */
const LIFECYCLE_STAGES = [
  { name: "Reconnaissance", desc: "Gathering publicly available information about the target — domain records, employee names, technology used — without touching the target's systems directly yet.", tools: "OSINT search, WHOIS lookups" },
  { name: "Scanning", desc: "Actively probing the target (with authorization) to discover what's actually running — open ports, live hosts, service versions.", tools: "Nmap" },
  { name: "Gaining Access", desc: "Attempting to exploit a discovered weakness to gain a foothold — the step that requires explicit written authorization and the most caution.", tools: "Metasploit, Burp Suite" },
  { name: "Maintaining Access", desc: "In a real engagement, testing whether a foothold could be preserved — assessing persistence risk, not actually leaving anything behind.", tools: "Documented in the report only" },
  { name: "Covering Tracks", desc: "Understanding how an attacker might attempt to hide their activity — critical for defenders building logging and detection, taught here purely as awareness.", tools: "Log analysis (defensive side)" },
  { name: "Reporting", desc: "Writing up every finding clearly enough that the client's engineers can actually fix it — arguably the single most valuable deliverable of the entire engagement.", tools: "Structured written report" },
];
function AttackLifecycleStepper() {
  const { t } = useT();
  const [stage, setStage] = useState(0);
  const cur = LIFECYCLE_STAGES[stage];
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: 26, margin: "24px 0" }}>
      <div style={{ fontFamily: F_MONO, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: t.accent, marginBottom: 18 }}>🎮 Interactive · The Pentest Lifecycle</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {LIFECYCLE_STAGES.map((s, i) => (
          <button key={s.name} onClick={() => setStage(i)} style={{ flex: "1 1 90px", textAlign: "center", padding: "10px 6px", borderRadius: 9, background: i === stage ? t.accent : t.surfaceAlt, color: i === stage ? "#fff" : t.textMuted, fontFamily: F_UI, fontWeight: 700, fontSize: 11.5, border: 0, cursor: "pointer" }}>
            {i + 1}. {s.name}
          </button>
        ))}
      </div>
      <p style={{ fontFamily: F_BODY, color: t.textSecondary, fontSize: 14.5, lineHeight: 1.7, minHeight: 66 }}>{cur.desc}</p>
      <div style={{ fontFamily: F_MONO, fontSize: 12, color: t.textMuted }}>Typical category: <span style={{ color: t.blue }}>{cur.tools}</span></div>
    </div>
  );
}

/* ══════════════════════ DIAGRAM: HAT COLOR CARDS ══════════════════════ */
function HatCards() {
  const { t } = useT();
  const hats = [
    { name: "White Hat", c: t.green, desc: "Authorized testing, disclosed responsibly — this course's entire focus" },
    { name: "Gray Hat", c: t.accent, desc: "Unauthorized but not malicious, often disclosed anyway — still generally illegal, treated with real caution" },
    { name: "Black Hat", c: t.red, desc: "Unauthorized, malicious intent — a crime, not a skill level" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, margin: "18px 0" }}>
      {hats.map((h) => (
        <div key={h.name} style={{ background: h.c + "14", border: `1px solid ${h.c}55`, borderRadius: 12, padding: "16px 14px", textAlign: "center" }}>
          <div style={{ fontFamily: F_UI, fontWeight: 700, fontSize: 13.5, color: h.c, marginBottom: 8 }}>{h.name}</div>
          <div style={{ fontFamily: F_BODY, fontSize: 11.5, color: t.textSecondary, lineHeight: 1.5 }}>{h.desc}</div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════ CONTENT MODEL ══════════════════════ */
const TOPICS_SECURITY = [
  {
    id: "security:foundations",
    icon: "⚖",
    title: "Foundations & Scope",
    blurb: "What 'ethical' actually means in this context, and the single line that separates a professional from a criminal.",
    chapters: [
      {
        title: "What 'Ethical' Actually Means Here",
        body: () => (<>
          <P>Every other phase in this course has been building toward one question: given a genuine, deep understanding of how these systems work, how do you use that knowledge responsibly? Ethical hacking means using offensive security skills to find and report weaknesses so they can be fixed — <Strong>with the owner's explicit permission</Strong> — rather than to cause harm or steal.</P>
          <MemoryHook>Everything before this phase taught you how systems work. This phase is entirely about the one word that decides whether that knowledge helps people or hurts them: authorization.</MemoryHook>
        </>),
      },
      {
        title: "Authorization: The Line That Matters Most",
        body: () => (<>
          <P>The single most important fact in this entire phase: testing a system you don't have explicit, documented permission to test is illegal, regardless of intent, regardless of skill level, and regardless of whether you "meant well." Professional engagements always begin with a signed <Strong>scope document</Strong> spelling out exactly what's authorized, by whom, and for how long.</P>
          <Callout title="This isn't a formality" tone="red">Real careers and real freedom have been lost over exactly this line. Every technique in this phase is taught for use only against systems you own or are explicitly, contractually authorized to test.</Callout>
        </>),
      },
      {
        title: "White Hat, Black Hat, Gray Hat",
        body: () => (<>
          <P>The security community uses a simple color shorthand for intent:</P>
          <HatCards />
        </>),
      },
      {
        title: "A Brief Legal Landscape",
        body: () => (<>
          <P>In the United States, the Computer Fraud and Abuse Act (CFAA) makes unauthorized access to a computer system a federal crime — this is background awareness, not legal advice, and laws vary meaningfully by country and jurisdiction. The practical takeaway for a working pentester is simple and consistent everywhere: get it in writing, every single time, before touching anything.</P>
        </>),
      },
      {
        title: "Why This Phase Is the Capstone",
        body: () => (<>
          <P>Notice how much of this phase leans on everything before it: understanding a buffer overflow needs Hardware's memory model; understanding SQL injection needs Web Fundamentals' SQL topic; understanding network attacks needs the entire Networking phase. Security isn't a separate skill bolted on at the end — it's what all of the preceding knowledge looks like when aimed at a genuine, real-world question: is this system actually safe?</P>
        </>),
      },
    ],
    retrieval: { q: "What's the single most important factor separating ethical hacking from a crime?", a: "Explicit, documented authorization from the system's owner" },
    recap: ["Ethical hacking means finding and reporting weaknesses with explicit permission, to get them fixed", "Testing without authorization is illegal regardless of intent or skill level", "White hat = authorized; black hat = malicious/unauthorized; gray hat = unauthorized but not malicious, still risky", "The CFAA (in the US) and equivalent laws elsewhere make unauthorized access a real crime", "This capstone phase draws directly on nearly everything from every prior phase"],
  },
  {
    id: "security:lifecycle",
    icon: "⟲",
    title: "The Pentest Lifecycle",
    blurb: "The six-stage structure every professional penetration test follows, from first research to final report.",
    chapters: [
      {
        title: "Reconnaissance: Learning About the Target",
        body: () => (<>
          <P>Every engagement starts with <Strong>reconnaissance</Strong> — gathering publicly available information without touching the target's systems at all: domain registration records, employee names on LinkedIn, technology mentioned in job postings. This is sometimes called OSINT (Open-Source Intelligence), and it's entirely passive at this stage.</P>
        </>),
      },
      {
        title: "Scanning: Finding What's Actually There",
        body: () => (<>
          <P>Once recon is complete and authorization confirmed, <Strong>scanning</Strong> actively probes the target to discover what's actually running — which hosts are alive, which ports are open, which software versions respond. This is the first stage that actually touches the target system, which is exactly why authorization has to already be in place.</P>
        </>),
      },
      {
        title: "Exploitation: Conceptually",
        body: () => (<>
          <P>The <Strong>exploitation</Strong> stage attempts to actually leverage a discovered weakness to gain access. This course covers what makes vulnerabilities exploitable in principle — the mechanism, the reasoning — in the next topic, deliberately at the level of understanding rather than a step-by-step attack manual.</P>
        </>),
      },
      {
        title: "Post-Exploitation & Maintaining Access, Conceptually",
        body: () => (<>
          <P>After gaining a foothold, a real engagement assesses how much further an attacker could go from there, and whether that access could be quietly preserved — <Strong>maintaining access</Strong>. In a professional test, this is assessed and documented, not actually left in place; the goal is proving the risk exists, not exploiting it further than the scope allows.</P>
        </>),
      },
      {
        title: "Covering Tracks & Reporting",
        body: () => (<>
          <P>Understanding how a real attacker might attempt to hide their activity is valuable almost entirely from the defender's side — it's exactly what good logging and detection are built to catch. The lifecycle closes with <Strong>reporting</Strong>: writing up every finding clearly enough for the client's own engineers to fix it, which is genuinely the most valuable deliverable of the entire engagement.</P>
          <AttackLifecycleStepper />
        </>),
      },
    ],
    simulator: true,
    retrieval: { q: "Which stage of the pentest lifecycle is the first to actually touch the target's systems?", a: "Scanning" },
    recap: ["Reconnaissance gathers public information passively, without touching the target", "Scanning actively probes the target and is the first stage requiring confirmed authorization", "Exploitation attempts to leverage a discovered weakness — covered conceptually, not operationally, in this course", "Maintaining access is assessed and documented in a real engagement, not actually exploited further than scope allows", "Reporting is arguably the most valuable deliverable — findings are worthless if they can't be understood and fixed"],
  },
  {
    id: "security:vuln-mechanics",
    icon: "⚠",
    title: "Vulnerability Mechanics",
    blurb: "How three classic vulnerability classes actually work, at the level of mechanism — not a working attack, a working understanding.",
    chapters: [
      {
        title: "SQL Injection: The Concept",
        body: () => (<>
          <P>Recall from Web Fundamentals that a SQL query is built as a string. If a web application carelessly inserts user input directly into that string without treating it as pure data, an attacker can supply input that changes the query's actual meaning rather than just filling in a value.</P>
          <Code block>{`// Vulnerable pattern (conceptual, not a working exploit):
query = "SELECT * FROM users WHERE name = '" + userInput + "'"`}</Code>
          <P>If <Code>userInput</Code> isn't strictly treated as data, cleverly crafted input can alter what the query does entirely, rather than simply searching for a name. This is why the defense — <Strong>parameterized queries</Strong>, which keep user input strictly separated from the query's structure — matters so much, and it's the single most effective fix for this entire vulnerability class.</P>
          <Callout title="Why this is taught at concept level" tone="blue">Understanding <em>why</em> mixing code and data is dangerous is the actual lesson — that understanding transfers to every language and every database, whereas a specific attack string against a specific system would transfer to nothing and teaches nothing lasting.</Callout>
        </>),
      },
      {
        title: "Cross-Site Scripting (XSS): The Concept",
        body: () => (<>
          <P>XSS follows the same underlying mistake as SQL injection, in a different layer: a web page that displays user-submitted content without properly treating it as plain text — rather than executable markup — lets an attacker's submitted content run as if it were part of the page itself, in another user's browser.</P>
          <P>The defense is symmetrical to SQL injection's: rigorously treat user input as data to display, never as markup or code to execute, through proper output encoding.</P>
        </>),
      },
      {
        title: "Buffer Overflows: The Concept",
        body: () => (<>
          <P>Recall from Programming's C/C++ chapter that a fixed-size block of memory is reserved for a variable. If a program writes more data into that block than it was sized for, and doesn't check the length first, the extra data spills into adjacent memory — potentially overwriting other important values, including, in more advanced cases, a stored return address that decides where the program continues executing next.</P>
          <MemoryHook>A buffer overflow is a cup filled past its rim — the overflow doesn't vanish, it spills onto whatever's sitting right next to it, which in memory might be something far more important than the cup itself.</MemoryHook>
          <P>Modern languages with automatic memory management (Python, JavaScript) are largely immune to this specific class of bug by design — one of the real, concrete safety benefits of garbage collection covered back in Programming's pointers chapter.</P>
        </>),
      },
      {
        title: "Why 'Concept, Not Payload' Is the Right Level Here",
        body: () => (<>
          <P>Every vulnerability in this topic is taught at the level of "here's the mechanism and why it works" rather than "here's a working attack string to copy." That's a deliberate choice, not a limitation: understanding the mechanism is what actually makes you effective at finding and explaining new instances of these bugs later, while memorizing one working payload only ever helps against one specific, already-patched target.</P>
        </>),
      },
      {
        title: "Defense in Depth: The Common Thread",
        body: () => (<>
          <P>Notice the pattern across all three vulnerabilities: SQL injection, XSS, and buffer overflows are all fundamentally the same mistake wearing different clothes — <Strong>failing to properly validate or separate untrusted input from the system's own logic or memory.</Strong> This single idea, applied consistently everywhere user input touches a system, prevents an enormous share of real-world vulnerabilities.</P>
          <Callout title="The single most useful sentence in this entire phase" tone="green">Never trust input you didn't generate yourself — validate it, sanitize it, and keep it strictly separated from your system's actual logic, memory, and structure. If you remember one sentence from this whole course, this is a strong candidate.</Callout>
        </>),
      },
    ],
    retrieval: { q: "What single underlying mistake do SQL injection, XSS, and buffer overflows all share?", a: "Failing to properly validate or separate untrusted input from the system's own logic or memory" },
    recap: ["SQL injection happens when user input isn't kept separate from a query's actual structure", "XSS happens when user content is displayed as executable markup instead of plain text", "A buffer overflow happens when data written exceeds its allocated memory and spills into adjacent memory", "This course teaches the mechanism, not working payloads — understanding transfers, memorized attacks don't", "All three vulnerabilities share one root cause: untrusted input not being properly validated or separated"],
  },
  {
    id: "security:tools",
    icon: "🛠",
    title: "The Tool Landscape",
    blurb: "The handful of tools every pentester knows by name — what each is actually for, at an awareness level.",
    chapters: [
      {
        title: "Nmap: Mapping a Network",
        body: () => (<>
          <P>Nmap (Network Mapper) is the standard tool for the scanning stage of the lifecycle — discovering which hosts on a network are live, which ports are open on them, and often which software and version is answering on each port. It's frequently the very first active tool used once authorization is confirmed.</P>
        </>),
      },
      {
        title: "Wireshark: Watching Traffic",
        body: () => (<>
          <P>Wireshark captures and displays network traffic in detail, letting an analyst inspect exactly what's being sent across a network at the packet level — directly built on every OSI layer concept from the Networking phase, now visible in a real capture instead of a diagram.</P>
        </>),
      },
      {
        title: "Burp Suite: Inspecting Web Traffic",
        body: () => (<>
          <P>Burp Suite sits between a browser and a web application, letting a tester see and analyze every request and response passing through — the practical, hands-on tool version of the HTTP methods and status codes covered in the Networking phase.</P>
        </>),
      },
      {
        title: "Metasploit: A Framework, Not a Magic Button",
        body: () => (<>
          <P>Metasploit is a framework organizing known, publicly documented vulnerabilities and testing modules in one place, used during the exploitation stage of an authorized engagement. It's often misrepresented in pop culture as a single button that "hacks" anything — in reality it still requires real understanding of what a given module actually does and why, exactly the vulnerability mechanics from two topics ago.</P>
        </>),
      },
      {
        title: "Tools Don't Replace Understanding",
        body: () => (<>
          <P>Every tool in this topic automates something a skilled analyst could, in principle, do by hand — Nmap automates careful manual port probing, Wireshark automates manually decoding raw packets, Metasploit automates applying known techniques. None of them replace understanding <em>why</em> a finding matters or <em>how</em> to explain it clearly in a report — which is exactly why this course spent so much more time on mechanisms and concepts than on any specific tool's command syntax.</P>
          <MemoryHook>A tool without understanding just produces output nobody can properly interpret. Understanding without tools is slow. This entire phase has prioritized the first, because it's the part that doesn't become outdated the moment a tool's interface changes.</MemoryHook>
        </>),
      },
    ],
    retrieval: { q: "What's a common misconception about Metasploit specifically?", a: "That it's a single button that automatically 'hacks' anything, rather than a framework requiring real understanding to use effectively" },
    recap: ["Nmap discovers live hosts, open ports, and running services during the scanning stage", "Wireshark captures and inspects raw network traffic at the packet level", "Burp Suite inspects and manipulates web traffic between a browser and an application", "Metasploit organizes known vulnerabilities and testing modules — a framework, not an automatic solution", "Every tool automates something a skilled analyst could do manually; none replace genuine understanding"],
  },
  {
    id: "security:social-network-attacks",
    icon: "◎",
    title: "Network & Social Attacks, Conceptually",
    blurb: "Attacks that target the connection itself, the availability of a service, or — most often — the human using the system.",
    chapters: [
      {
        title: "Man-in-the-Middle: Conceptually",
        body: () => (<>
          <P>A man-in-the-middle (MITM) attack positions an attacker between two communicating parties, potentially reading or altering traffic neither side realizes has been intercepted. This is precisely why HTTPS (from the Networking phase) matters so much — proper encryption makes intercepted traffic unreadable even if an attacker successfully sits in the middle of the connection.</P>
        </>),
      },
      {
        title: "Denial of Service: Overwhelming, Not Breaking In",
        body: () => (<>
          <P>A Denial of Service (DoS) attack doesn't try to break into a system at all — it tries to overwhelm it with traffic or requests until legitimate users can no longer be served. A Distributed Denial of Service (DDoS) does the same thing using many machines at once, making it far harder to block by simply denying one source.</P>
          <MemoryHook>Every other attack in this phase is about getting in somewhere you shouldn't be. DoS is different — it's not about entry at all, just about making the front door too crowded for anyone legitimate to get through.</MemoryHook>
        </>),
      },
      {
        title: "Phishing: The Human Vulnerability",
        body: () => (<>
          <P>Phishing attempts to trick a person — not a system — into revealing credentials or installing something harmful, typically through a message impersonating a trusted source. No amount of technical hardening covered in this entire course prevents a phishing attack, because the vulnerability being targeted is human judgment, not code.</P>
        </>),
      },
      {
        title: "Social Engineering Beyond Phishing",
        body: () => (<>
          <P>Phishing is just the most common example of a wider category called <Strong>social engineering</Strong> — manipulating people rather than systems. Pretexting (fabricating a believable scenario to gain trust) and tailgating (following someone through a secured door without their own badge) are both classic examples that require zero technical skill at all.</P>
        </>),
      },
      {
        title: "Why Humans Are Often the Weakest Link",
        body: () => (<>
          <P>Every technical topic in this course — firewalls, encryption, subnetting, parameterized queries — hardens a system. None of it hardens a person's judgment in a stressful, unexpected moment. This is precisely why professional security programs invest heavily in security awareness training for employees, not just technical controls — a single well-crafted phishing email can undo an enormous amount of technical hardening in one click.</P>
          <Callout title="Where this ties everything together" tone="green">A truly secure system needs strong technical controls (everything from earlier in this phase) and well-trained, security-aware people. Neither one alone is sufficient — this is the practical meaning of "defense in depth" applied at the organizational level, not just the code level.</Callout>
        </>),
      },
    ],
    retrieval: { q: "Why doesn't strong technical hardening alone prevent phishing?", a: "Phishing targets human judgment, not a technical vulnerability in the system itself" },
    recap: ["A man-in-the-middle attack intercepts communication between two parties; HTTPS encryption defends against it", "DoS/DDoS attacks overwhelm a service's availability rather than trying to break in", "Phishing manipulates a person into revealing credentials or installing something harmful", "Social engineering (pretexting, tailgating) manipulates people and often requires no technical skill at all", "Real security requires both strong technical controls and well-trained people — neither alone is sufficient"],
  },
  {
    id: "security:reporting-careers",
    icon: "📋",
    title: "Reporting, Culture & Where You Go From Here",
    blurb: "Turning findings into something a client can actually act on, hacker culture as history, and how to keep going after this course ends.",
    chapters: [
      {
        title: "Writing a Pentest Report",
        body: () => (<>
          <P>A professional report typically includes an executive summary (for non-technical leadership), a detailed findings section (severity, evidence, and exact reproduction steps for engineers), and clear, prioritized remediation recommendations. A brilliant finding that's poorly explained often goes unfixed — communication is genuinely as important a skill here as the technical work itself.</P>
        </>),
      },
      {
        title: "Responsible Disclosure",
        body: () => (<>
          <P>When a vulnerability is found outside a formal paid engagement — in a public product, say — <Strong>responsible disclosure</Strong> means privately notifying the vendor first, giving them reasonable time to fix it before any public disclosure, rather than publishing details immediately. Many organizations run formal "bug bounty" programs specifically to reward and channel this kind of responsible reporting.</P>
        </>),
      },
      {
        title: "Hacker Culture as History",
        body: () => (<>
          <P>The word "hacker" originally described someone who deeply understood and cleverly manipulated a system — not necessarily maliciously. Early hacker culture, including the BBS (Bulletin Board System) scene of the 1980s-90s, was as much about curiosity, shared knowledge, and exploration as anything criminal, even though that era also produced its share of real crime. Understanding this history is worth doing honestly — as a framed historical artifact to learn from, not a lifestyle to imitate.</P>
        </>),
      },
      {
        title: "Certifications & Career Paths",
        body: () => (<>
          <P>Several certifications validate this skill set formally in the industry, each pitched at a different level:</P>
          <DataTable headers={["Certification", "Level"]} rows={[["CompTIA Security+", "Foundational, vendor-neutral entry point"], ["CEH (Certified Ethical Hacker)", "Broad awareness across many attack categories"], ["OSCP (Offensive Security Certified Professional)", "Hands-on, heavily practical, widely respected"]]} />
          <P>None of these certifications are required to start a career, but they're a common, recognizable way to demonstrate this exact skill set to an employer.</P>
        </>),
      },
      {
        title: "Closing the Loop: Logic to Security",
        body: () => (<>
          <P>Trace the whole arc: Logic gave you true/false and binary. Hardware gave you the physical machine those bits run on. Command Line gave you the tools to control that machine directly. Programming gave you the ability to write instructions for it. Web Fundamentals gave you how those instructions become something people actually use. Networking gave you how machines find and talk to each other. And Security — this phase — is what all of it looks like when you ask the one question that matters most: <Strong>is this actually safe, and how would I know?</Strong></P>
          <MemoryHook>You didn't start this course learning "security." You started learning true and false. Every single phase since has been building, one honest layer at a time, toward being able to ask that final question with real understanding behind it.</MemoryHook>
        </>),
      },
    ],
    retrieval: { q: "What does 'responsible disclosure' mean when a vulnerability is found outside a formal engagement?", a: "Privately notifying the vendor first and giving them reasonable time to fix it before any public disclosure" },
    recap: ["A good pentest report includes an executive summary, detailed findings, and prioritized remediation steps", "Responsible disclosure means notifying a vendor privately before any public disclosure", "Early hacker culture, including the BBS scene, is worth understanding honestly as history, not glorified", "Security+, CEH, and OSCP are common certifications validating this skill set at different levels", "This entire capstone phase is every prior phase's knowledge aimed at one question: is this system actually safe?"],
  },
];

/* ══════════════════════ GLOSSARY DATA ══════════════════════ */
const GLOSSARY = [
  { term: "Boolean", phase: "Logic", def: "A value that is only ever true or false — the two-state foundation every digital decision is built from." },
  { term: "Truth Table", phase: "Logic", def: "A table listing every possible input combination for a logical expression alongside its resulting output." },
  { term: "Logic Gate", phase: "Logic", def: "A physical circuit implementing one Boolean operation — AND, OR, NOT, and their relatives." },
  { term: "NAND", phase: "Logic", def: "AND followed by NOT. Called a 'universal gate' because every other gate can be built from NAND alone." },
  { term: "Two's Complement", phase: "Logic", def: "The standard way binary represents negative numbers — flip every bit, then add 1." },
  { term: "Bitmask", phase: "Logic", def: "A number used with AND, OR, or XOR to check, set, or toggle one specific bit inside another number." },
  { term: "Register", phase: "Hardware", def: "The fastest storage that exists, built directly into the CPU — holds a handful of values at any moment." },
  { term: "ALU", phase: "Hardware", def: "Arithmetic Logic Unit — the part of the CPU that actually performs math and comparisons." },
  { term: "Cache", phase: "Hardware", def: "A small, very fast memory layer that stores recently-used data to avoid slower trips to RAM." },
  { term: "RAM", phase: "Hardware", def: "Main memory — fast, but volatile, meaning it loses everything the instant power is cut." },
  { term: "DMA", phase: "Hardware", def: "Direct Memory Access — lets a device write straight into memory without routing every byte through the CPU." },
  { term: "IRQ", phase: "Hardware", def: "Interrupt Request — the numbered signal line a device uses to get the CPU's attention." },
  { term: "Firmware", phase: "Hardware", def: "Low-level software stored on a chip, surviving power-off, that runs before any operating system loads." },
  { term: "Shebang", phase: "CLI/OS", def: "The #! line at the top of a script telling the system which interpreter should run it." },
  { term: "Pipe", phase: "CLI/OS", def: "The | operator, sending one command's output directly into another command's input." },
  { term: "chmod", phase: "CLI/OS", def: "The command that changes a file's read/write/execute permissions, using the octal system from Logic." },
  { term: "Repository", phase: "CLI/OS", def: "A git-tracked project folder, holding the full history of every committed change." },
  { term: "Branch", phase: "CLI/OS", def: "An independent line of development in git, letting you experiment without affecting the main project." },
  { term: "Kernel", phase: "CLI/OS", def: "The core of an operating system, managing hardware resources on behalf of every running program." },
  { term: "Variable", phase: "Programming", def: "A named location that holds a value you can reference and change as a program runs." },
  { term: "Function", phase: "Programming", def: "A named, reusable block of code, optionally taking inputs and returning a value." },
  { term: "Recursion", phase: "Programming", def: "A function calling itself, always requiring a base case to eventually stop." },
  { term: "Scope", phase: "Programming", def: "Where in a program a variable is visible — local to one function, or global everywhere." },
  { term: "Pointer", phase: "Programming", def: "A variable that holds a memory address rather than a value directly, common in C/C++." },
  { term: "Garbage Collection", phase: "Programming", def: "Automatic memory cleanup performed by languages like Python and JavaScript, freeing memory the program can no longer reach." },
  { term: "DOM", phase: "Web", def: "Document Object Model — the live, in-memory tree structure a browser builds from HTML, which JavaScript actually edits." },
  { term: "API", phase: "Web", def: "Application Programming Interface — a defined way for one piece of software to request data or action from another." },
  { term: "JSON", phase: "Web", def: "A text format for structured data, shaped exactly like nested lists and dictionaries — the web's most common data format." },
  { term: "CSS Selector", phase: "Web", def: "The part of a CSS rule (or JavaScript query) describing which elements to target." },
  { term: "HTTP Method", phase: "Web", def: "The verb in an HTTP request — GET, POST, PUT, DELETE — describing the intended action." },
  { term: "Subnet", phase: "Networking", def: "A smaller network carved out of a larger one, defined by a CIDR prefix and subnet mask." },
  { term: "CIDR", phase: "Networking", def: "Notation (like /24) stating how many bits of an IP address are reserved for the network portion." },
  { term: "Router", phase: "Networking", def: "A device that forwards packets between different networks, based on destination IP address." },
  { term: "VLAN", phase: "Networking", def: "Virtual LAN — lets one physical switch behave as several separate, isolated logical networks." },
  { term: "Port", phase: "Networking", def: "A number identifying which specific service on a machine a connection is meant for." },
  { term: "DNS", phase: "Networking", def: "The system that translates a human-readable domain name into a numeric IP address." },
  { term: "Pentest", phase: "Security", def: "Penetration test — an authorized, simulated attack meant to find real weaknesses before a malicious actor does." },
  { term: "Phishing", phase: "Security", def: "An attack that tricks a person, rather than a system, into revealing credentials or installing something harmful." },
  { term: "Exploit", phase: "Security", def: "Code or a technique that takes advantage of a specific vulnerability to achieve an unintended effect." },
  { term: "Vulnerability", phase: "Security", def: "A weakness in a system that could potentially be exploited to cause unintended behavior." },
  { term: "Authorization", phase: "Security", def: "Explicit, documented permission from a system's owner — the single line separating ethical hacking from a crime." },
];

function GlossaryTool() {
  const { t, view } = useT();
  const [query, setQuery] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("All");
  const phases = ["All", ...Array.from(new Set(GLOSSARY.map((g) => g.phase)))];
  const filtered = GLOSSARY.filter((g) =>
    (phaseFilter === "All" || g.phase === phaseFilter) &&
    (g.term.toLowerCase().includes(query.toLowerCase()) || g.def.toLowerCase().includes(query.toLowerCase()))
  ).sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div>
      <div style={{ position: "relative", marginBottom: 16 }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: t.textMuted }}><I.search /></span>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search terms or definitions…" style={{ width: "100%", boxSizing: "border-box", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: "13px 16px 13px 38px", color: t.text, fontFamily: F_UI, fontSize: 14.5, outline: "none" }} />
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
        {phases.map((p) => <Chip key={p} label={p} active={phaseFilter === p} onClick={() => setPhaseFilter(p)} color={p === "All" ? "accent" : PHASE_COLORS[p]} />)}
      </div>
      <div style={{ fontFamily: F_MONO, fontSize: 12, color: t.textMuted, marginBottom: 14 }}>{filtered.length} term{filtered.length === 1 ? "" : "s"}</div>
      <div style={{ display: "grid", gridTemplateColumns: view === "mobile" ? "1fr" : "1fr 1fr", gap: 12 }}>
        {filtered.map((g) => {
          const c = t[PHASE_COLORS[g.phase]] || t.accent;
          return (
            <div key={g.term} style={{ background: t.surface, border: `1px solid ${t.border}`, borderLeft: `3px solid ${c}`, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                <span style={{ fontFamily: F_UI, fontWeight: 700, fontSize: 15, color: t.text }}>{g.term}</span>
                <span style={{ fontFamily: F_MONO, fontSize: 10, color: c, textTransform: "uppercase", letterSpacing: 0.5 }}>{g.phase}</span>
              </div>
              <div style={{ fontFamily: F_BODY, fontSize: 13.5, color: t.textSecondary, lineHeight: 1.6 }}>{g.def}</div>
            </div>
          );
        })}
        {filtered.length === 0 && <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 0", color: t.textMuted, fontFamily: F_BODY }}>No terms match "{query}"</div>}
      </div>

      <div style={{ marginTop: 30, background: t.purpleSoft, border: `1px dashed ${t.purple}55`, borderRadius: 14, padding: "18px 20px" }}>
        <div style={{ fontFamily: F_UI, fontWeight: 600, color: t.purple, fontSize: 12.5, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Dual-mode, by design</div>
        <P>This searchable view is half of the glossary's job. The other half lives inside each module: the first time a term like <InlineTerm term="Bitmask" def={GLOSSARY.find(g => g.term === "Bitmask").def} /> appears in a chapter, it's underlined — tap or hover it for the definition right there, with no need to leave what you're reading. Try the example in this sentence.</P>
      </div>
    </div>
  );
}
function InlineTerm({ term, def }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative" }}>
      <span onClick={() => setOpen((o) => !o)} style={{ borderBottom: `2px dotted ${t.accent}`, color: t.accent, cursor: "pointer", fontWeight: 600 }}>{term}</span>
      {open && (
        <span style={{ position: "absolute", bottom: "125%", left: 0, background: t.surface, border: `1px solid ${t.borderStrong}`, borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: t.textSecondary, fontFamily: F_BODY, width: 220, boxShadow: "0 6px 20px rgba(0,0,0,0.25)", zIndex: 20, lineHeight: 1.5 }}>{def}</span>
      )}
    </span>
  );
}

/* ══════════════════════ VISUAL REFERENCE LIBRARY ══════════════════════ */
function OSIDiagram() {
  const { t } = useT();
  const layers = [
    { n: 7, name: "Application", ex: "HTTP", c: t.accent },
    { n: 6, name: "Presentation", ex: "TLS", c: t.blue },
    { n: 5, name: "Session", ex: "—", c: t.blue },
    { n: 4, name: "Transport", ex: "TCP/UDP", c: t.green },
    { n: 3, name: "Network", ex: "IP", c: t.green },
    { n: 2, name: "Data Link", ex: "Ethernet", c: t.purple },
    { n: 1, name: "Physical", ex: "Cable/Radio", c: t.purple },
  ];
  return (
    <div>
      {layers.map((l) => (
        <div key={l.n} style={{ display: "flex", alignItems: "center", gap: 10, background: l.c + "18", border: `1px solid ${l.c}44`, borderRadius: 8, padding: "9px 14px", marginBottom: 5 }}>
          <span style={{ fontFamily: F_MONO, fontWeight: 700, color: l.c, width: 18 }}>{l.n}</span>
          <span style={{ fontFamily: F_UI, fontWeight: 600, fontSize: 13.5, color: t.text, flex: 1 }}>{l.name}</span>
          <span style={{ fontFamily: F_MONO, fontSize: 11.5, color: t.textMuted }}>{l.ex}</span>
        </div>
      ))}
    </div>
  );
}
function BitBox({ label, val, color }) {
  const { t } = useT();
  return <div style={{ textAlign: "center" }}>
    <div style={{ width: 26, height: 26, borderRadius: 5, background: val ? color + "33" : t.surfaceAlt, border: `1px solid ${val ? color : t.border}`, display: "grid", placeItems: "center", fontFamily: F_MONO, fontWeight: 700, color: val ? color : t.textMuted, fontSize: 12 }}>{val}</div>
    {label && <div style={{ fontSize: 9, color: t.textMuted, marginTop: 2, fontFamily: F_MONO }}>{label}</div>}
  </div>;
}
function BinaryHexChart() {
  const { t } = useT();
  const rows = [["0000", "0"], ["0001", "1"], ["0010", "2"], ["0011", "3"], ["0100", "4"], ["0101", "5"], ["0110", "6"], ["0111", "7"], ["1000", "8"], ["1001", "9"], ["1010", "A"], ["1011", "B"], ["1100", "C"], ["1101", "D"], ["1110", "E"], ["1111", "F"]];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
      {rows.map(([bin, hex]) => (
        <div key={hex} style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
          <div style={{ fontFamily: F_MONO, fontSize: 11, color: t.textMuted }}>{bin}</div>
          <div style={{ fontFamily: F_MONO, fontSize: 15, fontWeight: 700, color: t.accent }}>{hex}</div>
        </div>
      ))}
    </div>
  );
}
function HttpStatusChart() {
  const { t } = useT();
  const groups = [
    { range: "2xx", label: "Success", c: t.green, ex: "200 OK · 201 Created" },
    { range: "3xx", label: "Redirection", c: t.blue, ex: "301 Moved · 304 Not Modified" },
    { range: "4xx", label: "Client Error", c: t.accent, ex: "404 Not Found · 401 Unauthorized" },
    { range: "5xx", label: "Server Error", c: t.red, ex: "500 Internal Error · 503 Unavailable" },
  ];
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {groups.map((g) => (
        <div key={g.range} style={{ display: "flex", alignItems: "center", gap: 12, background: g.c + "14", border: `1px solid ${g.c}44`, borderRadius: 10, padding: "10px 14px" }}>
          <span style={{ fontFamily: F_MONO, fontWeight: 800, fontSize: 16, color: g.c, width: 42 }}>{g.range}</span>
          <div>
            <div style={{ fontFamily: F_UI, fontWeight: 600, fontSize: 13, color: t.text }}>{g.label}</div>
            <div style={{ fontFamily: F_MONO, fontSize: 11, color: t.textMuted }}>{g.ex}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
function CommandCheatSheet({ rows }) {
  const { t } = useT();
  return (
    <div style={{ display: "grid", gap: 6 }}>
      {rows.map(([cmd, desc]) => (
        <div key={cmd} style={{ display: "flex", gap: 12, alignItems: "baseline", padding: "6px 0", borderBottom: `1px solid ${t.border}` }}>
          <code style={{ background: t.inlineBg, padding: "2px 8px", borderRadius: 6, fontFamily: F_MONO, fontSize: 12, color: t.blue, minWidth: 90 }}>{cmd}</code>
          <span style={{ fontFamily: F_BODY, fontSize: 12.5, color: t.textSecondary }}>{desc}</span>
        </div>
      ))}
    </div>
  );
}

const LIBRARY_CARDS = [
  { id: "osi", title: "OSI 7-Layer Model", phase: "Networking", render: () => <OSIDiagram /> },
  { id: "binhex", title: "Binary ↔ Hex Chart", phase: "Logic", render: () => <BinaryHexChart /> },
  { id: "http", title: "HTTP Status Codes", phase: "Web", render: () => <HttpStatusChart /> },
  { id: "bash", title: "Terminal Commands", phase: "CLI/OS", render: () => <CommandCheatSheet rows={[["pwd", "Print working directory"], ["ls -la", "List all, long format"], ["cd ~", "Go home"], ["cp -r", "Copy recursively"], ["rm -rf", "Delete permanently, no undo"], ["grep", "Search text"]]} /> },
  { id: "vim", title: "vim Essentials", phase: "CLI/OS", render: () => <CommandCheatSheet rows={[["i", "Enter insert mode"], ["Esc", "Return to normal mode"], ["dd", "Delete a line"], ["yy / p", "Copy / paste a line"], [":wq", "Save and quit"], [":q!", "Quit, discard changes"]]} /> },
  { id: "git", title: "Git Core Commands", phase: "CLI/OS", render: () => <CommandCheatSheet rows={[["git add", "Stage a change"], ["git commit -m", "Save a snapshot"], ["git push", "Send to remote"], ["git branch", "Create a branch"], ["git checkout -b", "Create & switch"], ["git merge", "Combine branches"]]} /> },
  { id: "sql", title: "SQL Quick Reference", phase: "Web", render: () => <CommandCheatSheet rows={[["SELECT * FROM t", "Retrieve every column"], ["WHERE", "Filter rows"], ["ORDER BY", "Sort results"], ["JOIN ... ON", "Combine tables"], ["INSERT INTO", "Add a row"], ["UPDATE ... SET", "Change a row"]]} /> },
  { id: "ports", title: "Well-Known Ports", phase: "Networking", render: () => <CommandCheatSheet rows={[["22", "SSH"], ["25", "SMTP"], ["53", "DNS"], ["80", "HTTP"], ["443", "HTTPS"], ["3306", "MySQL"]]} /> },
];

function VisualLibraryTool() {
  const { t, view } = useT();
  const [filter, setFilter] = useState("All");
  const phases = ["All", ...Array.from(new Set(LIBRARY_CARDS.map((c) => c.phase)))];
  const filtered = LIBRARY_CARDS.filter((c) => filter === "All" || c.phase === filter);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
        {phases.map((p) => <Chip key={p} label={p} active={filter === p} onClick={() => setFilter(p)} color={p === "All" ? "accent" : PHASE_COLORS[p]} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: view === "mobile" ? "1fr" : "1fr 1fr", gap: 16 }}>
        {filtered.map((card) => {
          const c = t[PHASE_COLORS[card.phase]] || t.accent;
          return (
            <div key={card.id} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontFamily: F_UI, fontWeight: 700, fontSize: 15, color: t.text }}>{card.title}</span>
                <span style={{ fontFamily: F_MONO, fontSize: 10, color: c, textTransform: "uppercase", letterSpacing: 0.5, border: `1px solid ${c}55`, borderRadius: 6, padding: "2px 7px" }}>{card.phase}</span>
              </div>
              {card.render()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════ PLAYGROUND ══════════════════════ */
function JSPlayground() {
  const { t } = useT();
  const [code, setCode] = useState(`// Try me — click Run, or edit freely
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

for (let i = 0; i < 8; i++) {
  console.log("fib(" + i + ") =", fib(i));
}`);
  const [output, setOutput] = useState([]);

  const run = () => {
    const logs = [];
    const fakeConsole = { log: (...args) => logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")) };
    try {
      const fn = new Function("console", code);
      fn(fakeConsole);
      setOutput(logs.length ? logs : ["(no output — try a console.log)"]);
    } catch (err) {
      setOutput([`Error: ${err.message}`]);
    }
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
        <textarea value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} style={{ width: "100%", boxSizing: "border-box", minHeight: 220, background: t.codeBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16, color: t.green, fontFamily: F_MONO, fontSize: 13, lineHeight: 1.6, outline: "none", resize: "vertical" }} />
        <button onClick={run} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8, background: t.accent, color: "#fff", border: 0, borderRadius: 10, padding: "10px 20px", fontFamily: F_UI, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}><I.play /> Run</button>
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: "14px 16px", minHeight: 70 }}>
          <div style={{ fontFamily: F_MONO, fontSize: 10.5, color: t.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Console output</div>
          {output.length === 0 ? (
            <div style={{ fontFamily: F_BODY, fontSize: 13, color: t.textMuted, fontStyle: "italic" }}>Nothing run yet — click Run above.</div>
          ) : output.map((line, i) => <div key={i} style={{ fontFamily: F_MONO, fontSize: 12.5, color: line.startsWith("Error") ? t.red : t.textSecondary, marginBottom: 3 }}>{line}</div>)}
        </div>
      </div>
    </div>
  );
}
function HTMLPlayground() {
  const { t } = useT();
  const [html, setHtml] = useState(`<style>
  body { font-family: sans-serif; padding: 20px; color: #333; }
  .card { background: #f5f3ec; border-radius: 12px; padding: 20px; }
  button { background: #c05f3c; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; }
</style>
<div class="card">
  <h2>Edit me!</h2>
  <p>This preview updates live as you type.</p>
  <button onclick="alert('Hello from the Playground!')">Click me</button>
</div>`);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <textarea value={html} onChange={(e) => setHtml(e.target.value)} spellCheck={false} style={{ width: "100%", boxSizing: "border-box", minHeight: 320, background: t.codeBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16, color: t.green, fontFamily: F_MONO, fontSize: 12.5, lineHeight: 1.6, outline: "none", resize: "vertical" }} />
      <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden", minHeight: 320, background: "#fff" }}>
        <iframe title="preview" srcDoc={html} style={{ width: "100%", height: "100%", minHeight: 320, border: "none" }} sandbox="allow-scripts" />
      </div>
    </div>
  );
}
function PlaygroundTool() {
  const { t, view } = useT();
  const [lang, setLang] = useState("js");
  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <SegToggle value={lang} onChange={setLang} options={[
          { key: "js", label: "JavaScript", node: <span style={{ fontFamily: F_MONO, fontSize: 12, fontWeight: 700, padding: "0 4px" }}>JS</span> },
          { key: "html", label: "HTML/CSS", node: <span style={{ fontFamily: F_MONO, fontSize: 12, fontWeight: 700, padding: "0 4px" }}>{"</>"}</span> },
        ]} />
      </div>
      {view === "mobile" && lang === "html" && (
        <div style={{ background: t.accentSoft, border: `1px solid ${t.accent}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontFamily: F_BODY, fontSize: 12.5, color: t.textSecondary }}>The HTML playground's side-by-side view works best on a wider screen — try Desktop mode above.</div>
      )}
      {lang === "js" ? <JSPlayground /> : <HTMLPlayground />}
      <div style={{ marginTop: 20, background: t.blueSoft, border: `1px dashed ${t.blue}55`, borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontFamily: F_UI, fontWeight: 600, color: t.blue, fontSize: 12.5, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>Coming next</div>
        <P>A Python playground is planned here as well, running entirely in-browser via Pyodide — same instant, no-setup experience, for the Python content in the Programming phase.</P>
      </div>
    </div>
  );
}

/* ══════════════════════ APP ══════════════════════ */
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
  const topicById = (id) => ALL_TOPICS.find((tp) => tp.id === id);

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
          {topic.recapSimulator && <topic.recapSimulator />}
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

      {topic.recapSimulator && <topic.recapSimulator />}

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

function SegToggle({ options, value, onChange }) {
  const { t } = useT();
  return <div style={{ display: "inline-flex", background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 9, padding: 2 }}>
    {options.map((o) => { const on = value === o.key; return <button key={o.key} onClick={() => onChange(o.key)} title={o.label} style={{ display: "flex", border: 0, cursor: "pointer", background: on ? t.surface : "transparent", color: on ? t.accent : t.textMuted, padding: "6px 10px", borderRadius: 7 }}>{o.node}</button>; })}
  </div>;
}

/* ══════════════════════ APP ══════════════════════ */
/* ══════════════════════ COMBINED TOPICS & PHASE METADATA ══════════════════════ */
const PHASES = [
  { key: "logic", num: 0, label: "Logic", icon: "⊤", topics: TOPICS_LOGIC, title: "Logic", blurb: "Every decision a computer ever makes reduces to true or false. This is where that starts — Boolean algebra, logic gates, binary and hex, bitwise operations, and the sequential circuits that give a machine its memory." },
  { key: "hardware", num: 1, label: "Hardware", icon: "▤", topics: TOPICS_HARDWARE, title: "Hardware", blurb: "The physical machine underneath everything else — CPU anatomy, buses, memory hierarchy, storage, interrupts, and where hardware's job quietly becomes software's job." },
  { key: "cli", num: 2, label: "CLI & OS", icon: "▸_", topics: TOPICS_CLI, title: "Command Line & Operating Systems", blurb: "The toolset you'll use in every phase after this one — the terminal, filesystems across Linux, macOS and Windows, vim, Git, shell scripting, and package management." },
  { key: "programming", num: 3, label: "Programming", icon: "{ }", topics: TOPICS_PROGRAMMING, title: "Programming", blurb: "Learning to think in logic and instructions — fundamentals, control flow, functions, data structures, then Python, JavaScript, and a bridge down to C/C++." },
  { key: "web", num: 4, label: "Web", icon: "</>", topics: TOPICS_WEB, title: "Web Fundamentals", blurb: "Applying code to something you can see — HTML structure, CSS layout, JavaScript in the browser, how a page actually loads, and a first taste of SQL." },
  { key: "networking", num: 5, label: "Networking", icon: "☰", topics: TOPICS_NETWORKING, title: "Networking & Cisco", blurb: "How machines actually talk to each other — the OSI model, topologies, routing, ports and HTTP, subnetting, and the CCNA essentials of switching and VLANs." },
  { key: "security", num: 6, label: "Security", icon: "⚖", topics: TOPICS_SECURITY, title: "Security & Ethical Hacking", blurb: "The capstone — the pentest lifecycle, how common vulnerabilities actually work, the tool landscape at awareness level, and how to write up what you find." },
];
const ALL_TOPICS = PHASES.flatMap((p) => p.topics);

/* ══════════════════════ PHASE HUB (generalized, one implementation for all 7 phases) ══════════════════════ */
function PhaseHub({ phase, onOpenTopic, onBackToMaster, completed }) {
  const { t, view } = useT();
  const topics = phase.topics;
  const doneCount = topics.filter((tp) => completed[tp.id]).length;
  return (
    <div>
      <button onClick={onBackToMaster} style={backLinkStyle(t)}><I.back /> All phases</button>
      <div style={{ background: `linear-gradient(135deg, ${t.panel} 0%, ${t.surface} 100%)`, border: `1px solid ${t.border}`, borderRadius: 20, padding: view === "mobile" ? "32px 26px" : "48px 48px", marginBottom: 36, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -30, width: 280, height: 280, background: t.glow }} />
        <div style={{ fontFamily: F_MONO, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: t.accent, marginBottom: 10 }}>Phase {phase.num}</div>
        <h1 style={{ fontSize: view === "mobile" ? 30 : 42, fontWeight: 700, color: t.text, margin: "4px 0 14px", letterSpacing: -1.3, fontFamily: F_UI }}>{phase.title}</h1>
        <p style={{ fontSize: view === "mobile" ? 15 : 17, color: t.textSecondary, maxWidth: 580, fontFamily: F_BODY, lineHeight: 1.75, margin: 0 }}>{phase.blurb}</p>
        <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, maxWidth: 200, height: 6, background: t.surfaceAlt, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(doneCount / topics.length) * 100}%`, background: t.accent, transition: "width .3s" }} />
          </div>
          <span style={{ fontFamily: F_MONO, fontSize: 12.5, color: t.textMuted }}>{doneCount} / {topics.length} complete</span>
        </div>
      </div>

      <TopicMap topics={topics} completed={completed} onOpen={onOpenTopic} />

      <div style={{ display: "grid", gridTemplateColumns: view === "mobile" ? "1fr" : "1fr 1fr", gap: 16 }}>
        {topics.map((tp, i) => {
          const done = completed[tp.id];
          return (
            <button key={tp.id} onClick={() => onOpenTopic(i)} style={{ textAlign: "left", background: t.surface, border: `1px solid ${done ? t.green + "55" : t.border}`, borderRadius: 16, padding: 22, cursor: "pointer", display: "flex", gap: 17, alignItems: "flex-start", position: "relative" }}>
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

/* ══════════════════════ MASTER HUB (new — top-level phase selector) ══════════════════════ */
function MasterHub({ onOpenPhase, onOpenToolkit, completed }) {
  const { t, view } = useT();
  const totalChapters = ALL_TOPICS.reduce((sum, tp) => sum + tp.chapters.length, 0);
  const totalTopics = ALL_TOPICS.length;
  const doneTopics = ALL_TOPICS.filter((tp) => completed[tp.id]).length;

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${t.panel} 0%, ${t.surface} 100%)`, border: `1px solid ${t.border}`, borderRadius: 20, padding: view === "mobile" ? "32px 26px" : "48px 48px", marginBottom: 36, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -30, width: 280, height: 280, background: t.glow }} />
        <div style={{ fontFamily: F_MONO, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: t.accent, marginBottom: 10 }}>CORE · CS Encyclopedia</div>
        <h1 style={{ fontSize: view === "mobile" ? 32 : 46, fontWeight: 700, color: t.text, margin: "4px 0 14px", letterSpacing: -1.5, fontFamily: F_UI }}>Every Phase, One App</h1>
        <p style={{ fontSize: view === "mobile" ? 15 : 17, color: t.textSecondary, maxWidth: 600, fontFamily: F_BODY, lineHeight: 1.75, margin: 0 }}>
          Seven phases, {totalChapters} chapters, one continuous story from Boolean logic to ethical hacking — plus a glossary, visual reference library, and live code playground alongside it.
        </p>
        <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, maxWidth: 240, height: 6, background: t.surfaceAlt, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(doneTopics / totalTopics) * 100}%`, background: t.accent, transition: "width .3s" }} />
          </div>
          <span style={{ fontFamily: F_MONO, fontSize: 12.5, color: t.textMuted }}>{doneTopics} / {totalTopics} topics complete</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: view === "mobile" ? "1fr" : "1fr 1fr", gap: 16 }}>
        {PHASES.map((phase) => {
          const done = phase.topics.filter((tp) => completed[tp.id]).length;
          return (
            <button key={phase.key} onClick={() => onOpenPhase(phase.key)} style={{ textAlign: "left", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 22, cursor: "pointer", display: "flex", gap: 17, alignItems: "flex-start" }}>
              <div style={{ fontFamily: F_MONO, fontSize: phase.icon.length > 2 ? 15 : phase.icon.length > 1 ? 18 : 20, color: t.accent, width: 48, height: 48, display: "grid", placeItems: "center", background: t.accentSoft, borderRadius: 12, flexShrink: 0, letterSpacing: -0.5 }}>{phase.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F_MONO, fontSize: 10.5, color: t.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>Phase {phase.num}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: t.text, fontFamily: F_UI }}>{phase.title}</div>
                <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 8, fontFamily: F_MONO }}>{done} / {phase.topics.length} topics complete</div>
              </div>
            </button>
          );
        })}
        <button onClick={onOpenToolkit} style={{ textAlign: "left", background: t.accentSoft, border: `1px solid ${t.accent}55`, borderRadius: 16, padding: 22, cursor: "pointer", display: "flex", gap: 17, alignItems: "center" }}>
          <div style={{ fontFamily: F_MONO, fontSize: 20, color: t.accent, width: 48, height: 48, display: "grid", placeItems: "center", background: t.surface, borderRadius: 12, flexShrink: 0 }}>🧰</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: t.text, fontFamily: F_UI }}>Toolkit</div>
            <div style={{ fontSize: 11.5, color: t.textMuted, marginTop: 4, fontFamily: F_MONO }}>Glossary · Visual Library · Playground</div>
          </div>
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════ TOOLKIT SCREEN (wraps the 3 tools without a duplicate top bar) ══════════════════════ */
const EthIc = {
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
const ETH_SECTIONS = [
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
function EthBadge({ children, tone = "blue" }) {
  const { t } = useT();
  const c = t[tone] || t.blue;
  return (
    <span style={{
      display: "inline-block", background: c + "1e", color: c, fontSize: 11, fontWeight: 600,
      padding: "3px 10px", borderRadius: 20, letterSpacing: 0.4, textTransform: "uppercase",
      border: `1px solid ${c}33`, fontFamily: F_UI,
    }}>{children}</span>
  );
}

function EthInfoBox({ title, children, variant = "info" }) {
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
        <div style={{ fontWeight: 600, color: v.c, marginBottom: 6, fontSize: 14, fontFamily: F_UI }}>
          {v.icon} {title}
        </div>
      )}
      <div style={{ color: t.textSecondary, fontSize: 14.5, lineHeight: 1.75, fontFamily: F_BODY }}>
        {children}
      </div>
    </div>
  );
}

function EthTableBlock({ headers, rows }) {
  const { t } = useT();
  return (
    <div style={{
      overflowX: "auto", margin: "14px 0", borderRadius: 10,
      border: `1px solid ${t.border}`, boxShadow: t.shadow,
    }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: F_MONO }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{
                textAlign: "left", padding: "11px 14px", background: t.surfaceAlt, color: t.accent,
                borderBottom: `1px solid ${t.borderStrong}`, fontWeight: 600, fontSize: 11.5,
                letterSpacing: 0.5, textTransform: "uppercase", fontFamily: F_UI,
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

function EthSectionHeading({ id, children }) {
  const { t, view } = useT();
  return (
    <h2 id={id} style={{
      fontSize: view === "mobile" ? 24 : 28, fontWeight: 700, color: t.text,
      margin: "48px 0 12px", paddingBottom: 10, borderBottom: `1px solid ${t.border}`,
      letterSpacing: -0.6, scrollMarginTop: 76, fontFamily: F_UI,
    }}>{children}</h2>
  );
}
function EthSubHeading({ id, children }) {
  const { t } = useT();
  return (
    <h3 id={id} style={{
      fontSize: 18, fontWeight: 600, color: t.text, margin: "32px 0 8px",
      scrollMarginTop: 76, fontFamily: F_UI,
    }}>{children}</h3>
  );
}
function EthContentArea() {
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
          <EthBadge tone="green">v1.04</EthBadge><EthBadge tone="accent">MS-DOS</EthBadge><EthBadge tone="blue">Free Software</EthBadge>
        </div>
        <h1 style={{
          fontSize: view === "mobile" ? 40 : 52, fontWeight: 700, color: t.text,
          margin: "12px 0 6px", letterSpacing: -2, lineHeight: 1.05, fontFamily: F_UI,
        }}>ETHLOAD</h1>
        <p style={{ fontSize: view === "mobile" ? 17 : 21, color: t.textSecondary, margin: 0, fontWeight: 400, fontFamily: F_BODY }}>
          Ethernet Load Analyzer &amp; Protocol Event Tracer
        </p>
        <p style={{ color: t.accent, fontSize: 13.5, marginTop: 16, opacity: 0.9, fontStyle: "italic", fontFamily: F_BODY }}>
          by Eric Vyncke · January 16, 1994 · vyncke@csl.sni.be
        </p>
        <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Ethernet Analysis", "TCP/IP", "DECnet", "OSI", "NetWare", "NetBEUI"].map((x) => (
            <span key={x} style={{
              background: t.surface, color: t.textSecondary, padding: "6px 14px", borderRadius: 8,
              fontSize: 13, fontWeight: 500, border: `1px solid ${t.border}`, fontFamily: F_UI,
            }}>{x}</span>
          ))}
        </div>
      </div>

      {/* INTRO */}
      <EthSectionHeading id="intro">Introduction</EthSectionHeading>
      <P>ETHLOAD is free software designed to run on any MS-DOS PC equipped with an Ethernet controller. It serves as both a simple load analyzer and a multi-protocol event tracer for local area networks.</P>

      <EthSubHeading id="supported-drivers">Supported Drivers</EthSubHeading>
      <P>ETHLOAD supports the following datalink driver specifications for Ethernet and Token Ring:</P>
      <EthTableBlock headers={["Driver", "Notes"]} rows={[
        ["Digital Equipment DLL", "DLL.EXE or DLLDEPCA.EXE"],
        ["Microsoft / 3Com NDIS", "Network Driver Interface Specification"],
        ["Packet Driver", "PC/TCP, Clarkson, or Crynwr collection"],
        ["Novell ODI", "Open Datalink Interface (promiscuous mode required)"],
        ["ASCII File", "Reads captured Ethernet frames from file"],
        ["Loopback", "For debugging and testing purposes"],
      ]} />

      <EthSubHeading id="capabilities">Core Capabilities</EthSubHeading>
      <P>At the base Ethernet level, ETHLOAD lets you monitor frame rates, bandwidth usage, error rates, inter-frame gaps, and identify the busiest transmitters and receivers on the wire. Beyond that, it decodes and traces events for every major protocol stack of the era:</P>
      <div style={{ display: "grid", gridTemplateColumns: twoCol, gap: 12, margin: "16px 0" }}>
        {[
          { name: "TCP/IP", items: "ARP table, IP/UDP/TCP stats, DNS, BOOTP/TFTP, Telnet monitoring, ICMP, fragmentation, NetBIOS" },
          { name: "DECnet", items: "Top transmitters/receivers, Connect Initiate packets, returned frames" },
          { name: "OSI", items: "NSAP tracking, TUBA events, ES-IS/IS-IS exchanges, transport layer connections" },
          { name: "NetWare / XNS", items: "Routers, IPX networks, advertised services, connection mapping" },
        ].map((p) => (
          <div key={p.name} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: "16px 18px", boxShadow: t.shadow }}>
            <div style={{ fontWeight: 600, color: t.accent, fontSize: 15, marginBottom: 6, fontFamily: F_UI }}>{p.name}</div>
            <div style={{ color: t.textMuted, fontSize: 13, lineHeight: 1.6, fontFamily: F_BODY }}>{p.items}</div>
          </div>
        ))}
      </div>

      {/* ABOUT */}
      <EthSectionHeading id="misc">About &amp; Credits</EthSectionHeading>
      <EthSubHeading id="copyright">Copyright &amp; Origins</EthSubHeading>
      <P>ETHLOAD originated at Network Research Belgium (NRB), developed by a team called BERT. The original software was released free and in the public domain thanks to NRB's management. The current version (1.04) represents ongoing development by Eric Vyncke, done independently after working hours.</P>
      <EthInfoBox title="Original BERT Team" variant="info">Eric Vyncke · Frederic Blondiau · Michel Ghys (later at Cisco) · Marie-Christine Timmermans · Jean Hotterbeex (later at Cisco) · Manu Khronis · Vincent Keunen</EthInfoBox>

      <EthSubHeading id="support">Getting Support</EthSubHeading>
      <P>The primary support channel is the UseNet newsgroup <Code>comp.protocols.tcp-ip.ibmpc</Code>. The author monitors this group daily along with <Code>comp.sys.novell</Code> and the BITNET Novell/PATHWORKS mailing list.</P>
      <EthInfoBox variant="tip" title="The Postcard Request">If you're happy with ETHLOAD, Eric's little son Pierre would appreciate receiving a postcard! Send to: Eric Vyncke, Rue Nolden 25, B-4432 Alleur, Belgium.</EthInfoBox>

      <EthSubHeading id="distribution">Distribution</EthSubHeading>
      <P>ETHLOAD is distributed as <Code>ETHLDvrr.ZIP</Code> from the Simtel repository (oak.oakland.edu) in <Code>/pub/msdos/lan</Code> and from <Code>ub4b.eunet.be:/pub/ub4b/network/msdos</Code>. A companion utility called ETHDUMP is available as <Code>ETHDPvrr.ZIP</Code> from the same locations.</P>

      <EthSubHeading id="testers">Contributors &amp; Beta Testers</EthSubHeading>
      <EthTableBlock headers={["Name", "Email / Affiliation"]} rows={[
        ["Ralf Buettemeyer", "buettemeyer@hagenuk.netuse.de"],
        ["Michel Dalle", "michel@d92.cb.sni.be"],
        ["Niels Kr. Jensen", "msterlje@vm.uni-c.dk"],
        ["Hans-Joachim Koch", "koch@lifra.lif.de"],
        ["Hans-Michael Pronk", "hpronk@fac.fbk.eur.nl"],
        ["Joe Doupnik", "jrd@cc.usu.edu"],
        ["Russ Nelson", "nelson@crynwr.com"],
        ["A.A.L. Reijnierse", "Research PTT Netherlands"],
      ]} />

      <EthSubHeading id="changelog">Changelog</EthSubHeading>
      {[
        { v: "1.01", items: ["Packet driver, ODI and NDIS support", "TCP/IP protocol support", "Dictionary system for name resolution", "Ported from large model Borland C to small model Borland C++"] },
        { v: "1.02", items: ["Bug fix in DLL support", "Dropped packets percentage in MAC screen", "MAC flow screen", "SMTP, TFTP and BOOTP support", "Telnet/rlogin monitoring", "OSI support"] },
        { v: "1.03", items: ["Local stack for interrupt routines", "File driver added", "DNS and RFC NetBIOS support in TCP/IP", "NetBEUI and XNS/NetWare support", "NumLock toggle for numeric vs symbolic display", "Improved memory management"] },
        { v: "1.04", items: ["TUBA protocol support", "Better OSI support (active network layers)", "New options: -b, -f, -m, -o", "IEEE 802.5 Token Ring partial support", "TCP MSS option and IP options decoding", "ETHDUMP companion can record short frames"] },
      ].map((e) => (
        <div key={e.v} style={{ margin: "14px 0" }}>
          <div style={{ marginBottom: 8 }}><EthBadge tone="green">v{e.v}</EthBadge></div>
          <div style={{ paddingLeft: 12, borderLeft: `2px solid ${t.border}` }}>
            {e.items.map((it, i) => (
              <div key={i} style={{ color: t.textSecondary, fontSize: 14, lineHeight: 1.8, fontFamily: F_BODY }}>
                <span style={{ color: t.green, marginRight: 8 }}>+</span>{it}
              </div>
            ))}
          </div>
        </div>
      ))}

      <EthSubHeading id="licensing">Licensing</EthSubHeading>
      <P>All versions of ETHLOAD (1.01–1.04) are copyrighted by NRB and Eric Vyncke. These versions are free to use, copy, and distribute as long as no money is earned from it (media/transmission costs excepted). This right is granted for an unlimited period of time.</P>
      <EthInfoBox variant="warn" title="Version 2.0 Plans">The planned v2.0 would transition to shareware ($199 / ECU 199 registration) with added features: print-outs, Excel-compatible load export, larger buffers, configurable table sizes, and dedicated email support.</EthInfoBox>

      <EthSubHeading id="security">Security Considerations</EthSubHeading>
      <P>ETHLOAD is designed to never be a major security leak. It may disclose MAC/IP addresses and usernames visible on the LAN. For monitoring Telnet/rlogin sessions or DECnet connect-initiate contents, a special software key is required, linked to the Ethernet ROM address of your PC. Authorization requires an official paper letter from a high-level manager.</P>

      {/* CONFIG */}
      <EthSectionHeading id="config">Configuration Files</EthSectionHeading>
      <P>ETHLOAD can run in basic mode without any configuration files. Configuration files are only needed for translating addresses into human-readable names. All files use the same format: plain ASCII with key-value pairs, where lines beginning with <Code>;</Code> or <Code>#</Code> are comments.</P>
      <EthInfoBox variant="tip" title="File Location">All config files must be in the current directory or in the path specified by the <Code>ETHLOAD</Code> MS-DOS environment variable. Suppress loading messages with the <Code>-q</Code> option.</EthInfoBox>

      <EthSubHeading id="ethers">ETHERS</EthSubHeading>
      <P>Maps MAC Ethernet addresses to host names. Format: <Code>HH-HH-HH-HH-HH-HH  hostname</Code></P>
      <Code block>{`AB-00-03-00-00-00     DEC: Local Area Transport -LAT-
FF-FF-FF-FF-FF-FF     Broadcast
CF-00-00-01-00-00     Loopback Assistance
00-00-00-00-00-00     Null Address`}</Code>
      <EthInfoBox variant="info">ETHLOAD automatically resolves DECnet addresses and listens for ARP requests/replies to map IP addresses. Add custom MAC addresses only if not using DECnet or TCP/IP — and always append them at the end of the file.</EthInfoBox>

      <EthSubHeading id="hosts">HOSTS</EthSubHeading>
      <P>Maps IP addresses to host names. Format: <Code>ddd.ddd.ddd.ddd  hostname</Code></P>
      <Code block>{`139.21.20.18    d012s509.mch.sni.de d012s509
139.21.24.1     cisco.ap.mch.sni.de
139.24.16.44    baumann`}</Code>
      <P>Best initialized by copying <Code>/etc/hosts</Code> from a UNIX machine or using <Code>ypcat hosts.byaddr</Code> with NIS.</P>

      <EthSubHeading id="networks">NETWORKS</EthSubHeading>
      <P>Maps IP network addresses to network names, used when no host entry is found.</P>
      <Code block>{`150.144.0.0    UCCLE
150.148.0.0    CSL`}</Code>

      <EthSubHeading id="protocol">PROTOCOL</EthSubHeading>
      <P>Maps IP protocol numbers (0–255) to protocol names. Copy from <Code>/etc/protocols</Code> on UNIX.</P>
      <Code block>{`0       ip
1       icmp
3       ggp, gateway-gateway protocol
6       tcp
8       egp, exterior gateway protocol
17      udp
22      xns-idp`}</Code>

      <EthSubHeading id="saps">SAPS</EthSubHeading>
      <P>Maps IEEE 802.2 LLC Service Access Points to names. Two hex digit key.</P>
      <Code block>{`80     3Com XNS
8E     Proway-LAN
AA     TCP/IP SNAP (Ethernet type in LLC)
BC     Banyan VINES
E0     Novell NetWare
F0     IBM NetBIOS`}</Code>

      <EthSubHeading id="wks">WKS.TCP &amp; WKS.UDP</EthSubHeading>
      <P>Maps well-known TCP/UDP service port numbers (0–65535) to service names.</P>
      <Code block>{`# WKS.TCP
21      ftp
79      finger
101     hostnames
2156    informix
1524    ingreslock`}</Code>

      <EthSubHeading id="types">TYPES</EthSubHeading>
      <P>Maps DIX Ethernet packet types (4 hex digits) to names.</P>
      <Code block>{`0600     XNS
0601     XNS Address Translation
0800     DOD IP
0801     X.75 internet`}</Code>

      <EthSubHeading id="vendors">VENDORS</EthSubHeading>
      <P>Maps IEEE vendor codes (first 3 bytes of MAC address) to manufacturer names.</P>
      <Code block>{`00-00-0C     cisco
00-00-0F     NeXT
00-00-10     Sytek
00-00-1D     Cabletron`}</Code>

      <EthSubHeading id="osi-files">OSI Configuration Files</EthSubHeading>
      <P>ETHLOAD includes several specialized files for OSI protocol analysis:</P>
      <EthTableBlock headers={["File", "Purpose", "Key Format"]} rows={[
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
      <EthSectionHeading id="drivers">Datalink Driver Setup</EthSectionHeading>
      <P>ETHLOAD automatically detects the best available driver in this order: Novell ODI → Microsoft NDIS v2.0.1+ → DEC DLL → Packet Driver → ASCII File Driver. Use the <Code>-d</Code> option to override this auto-detection.</P>
      <EthTableBlock headers={["Driver", "Concurrent Stacks", "Reboot Required", "Error Detail"]} rows={[
        ["ODI", "Yes", "No", "Full (source addr)"],
        ["NDIS v2.0+", "Yes", "After initial setup", "Partial"],
        ["DLL", "No (shuts down conns)", "After use", "Partial"],
        ["Packet Driver", "Disrupted efficiency", "No", "None"],
        ["File Driver", "N/A", "No", "N/A"],
      ]} />
      <EthInfoBox variant="tip" title="Recommendation">If your Ethernet hardware has an ODI driver with promiscuous mode support, ODI is the best choice. It provides concurrent operation with your protocol stack, no reboot requirement, and full error source identification.</EthInfoBox>

      <EthSubHeading id="odi">Novell ODI</EthSubHeading>
      <P>Only certain ODI drivers support promiscuous mode (required by ETHLOAD). Novell maintains a list since their LANanalyzer product also requires it. Load the ODI driver (preceded by LSL.COM) with a correct NET.CFG. Use <Code>-do2</Code> or <Code>-do3</Code> to select alternate frame types.</P>
      <EthInfoBox variant="warn">IPXODI and NETX cannot be loaded before ETHLOAD. Ensure NET.CFG allocates enough buffers and mempool.</EthInfoBox>

      <EthSubHeading id="ndis">Microsoft / 3Com NDIS</EthSubHeading>
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

      <EthSubHeading id="dll">Digital Equipment DLL</EthSubHeading>
      <P>If DLL.EXE or DLLDEPCA.EXE is loaded, simply run ETHLOAD. Note that DLL requires shutting down ALL connections (LAT, DECnet, etc.) to enter promiscuous mode. You'll likely need to reboot after using ETHLOAD.</P>

      <EthSubHeading id="packet">Packet Driver</EthSubHeading>
      <P>Packet drivers exist for nearly all Ethernet adapters. Use a software interrupt between <Code>0x60</Code> and <Code>0x7F</Code>. ETHLOAD scans from <Code>0x60</Code> upward to find the first available driver.</P>
      <EthInfoBox variant="info">Crynwr Packet Driver Collection is available under GNU GPL from the Simtel repository. For 3Com 3C509, use version 11.* of the Crynwr driver.</EthInfoBox>

      <EthSubHeading id="file-driver">File Driver</EthSubHeading>
      <P>Reads Ethernet frames from an ASCII file. Default input is <Code>ETHLOAD.IN</Code> — compatible with ETHDUMP output format. Each frame record consists of a timestamp, length, and the hex-encoded frame data starting from the destination MAC address.</P>
      <Code block>{`; Example input file format:
0000000087  0060 000E20009127 0000E80109FC 0020 FF-FF-00-20-
01-00-00-00-00-03-00-0E-20-00-91-27-40-05-00-B0-BB-1E-00-00-
00-00-00-01`}</Code>

      {/* CLI */}
      <EthSectionHeading id="cli">Command Line Options</EthSectionHeading>
      <P>Options can be specified in UNIX format (<Code>-do1 -i65 -t</Code>) or MS-DOS format (<Code>/D:O1 /I:65 /T</Code>). Case-insensitive.</P>
      {[
        { id: "opt-d", flag: "-d", name: "Datalink Driver Selection", desc: "Force a specific datalink driver instead of auto-detection.", examples: [["-do / /D:O", "Use Novell ODI"], ["-do3 / /D:O3", "Use ODI MLID board 3"], ["-dn / /D:N", "Use NDIS (optionally specify MAC module)"], ["-dd / /D:D", "Use DEC DLL"], ["-dp / /D:P", "Use first packet driver (0x60–0x7F)"], ["-dphh / /D:PHH", "Use packet driver at interrupt 0xHH"], ["-dl / /D:L", "Use loopback driver"], ["-dfname / /D:Fname", "Use file driver with filename"]] },
        { id: "opt-p", flag: "-p", name: "Protocol Filter", desc: "Restrict which protocols are analyzed to save memory and CPU.", examples: [["-pd", "DECnet only"], ["-pi", "TCP/IP only"], ["-po", "OSI only"], ["-pt", "TUBA only"], ["-pn", "XNS/NetWare only"], ["-pl", "IEEE 802.2 LLC only"], ["-pb", "NetBEUI only"], ["-p3", "Analyze up to layer 3 only"]] },
      ].map((opt) => (
        <div key={opt.id}>
          <EthSubHeading id={opt.id}><Code>{opt.flag}</Code> — {opt.name}</EthSubHeading>
          <P>{opt.desc}</P>
          <EthTableBlock headers={["Option", "Effect"]} rows={opt.examples} />
        </div>
      ))}

      <EthSubHeading id="opt-t"><Code>-t</Code> — Real-time Frame Trace</EthSubHeading>
      <P>Displays the first bytes of every received frame on the bottom line of the display in real time.</P>
      <EthSubHeading id="opt-s"><Code>-s</Code> — Slow/Secure Mode</EthSubHeading>
      <P>Disables IRQ during frame analysis. Fewer dropped frames but may cause stability issues under heavy load. Use only if experiencing high packet loss in default (fast) mode. With the file driver, this makes ETHLOAD process frames as fast as possible, ignoring timestamps.</P>
      <EthSubHeading id="opt-i"><Code>-i</Code> — Measure Interval</EthSubHeading>
      <P>Sets the statistics measurement and screen refresh interval. Default: 5 seconds. Example: <Code>-i10</Code> for 10-second intervals.</P>
      <EthSubHeading id="opt-q"><Code>-q</Code> — Quiet Mode</EthSubHeading>
      <P>Skips the startup pause (normally waits for a keypress) and suppresses dictionary loading messages. Useful for batch files.</P>
      <EthSubHeading id="opt-r"><Code>-r</Code> — Recorder Mode</EthSubHeading>
      <P>Records all received frames to an ASCII file instead of analyzing them. Default output: <Code>ETHLOAD.OUT</Code>. Specify a custom filename directly after <Code>-r</Code>. Compatible with the file driver input format.</P>
      <EthSubHeading id="opt-b"><Code>-b</Code> — LAN Bandwidth</EthSubHeading>
      <P>Specifies LAN bandwidth in bits/sec for load calculations. Defaults to 10 Mbps (Ethernet). Required for non-standard networks.</P>
      <Code block>{`-b1000000      # Starlan 1 Mbps
-b1.0E+6       # Same, scientific notation`}</Code>
      <EthSubHeading id="opt-o"><Code>-o</Code> — Promiscuous Override</EthSubHeading>
      <P>Allows ETHLOAD to start even when the adapter doesn't support promiscuous mode. Only broadcast/multicast traffic will be analyzed — expect very light apparent load.</P>
      <EthSubHeading id="opt-f"><Code>-f</Code> — Filter</EthSubHeading>
      <P>Restricts analysis to specific frame types:</P>
      <EthTableBlock headers={["Filter", "Example"]} rows={[
        ["By LLC SAP (2 hex digits)", "-fAA  (TCP/IP SNAP)"],
        ["By Ethernet type (4 hex digits)", "-f0800  (DOD IP)"],
        ["By MAC address (6 bytes)", "-f00-00-0C-01-02-03"],
      ]} />
      <EthSubHeading id="opt-m"><Code>-m</Code> — Memory Buffers</EthSubHeading>
      <P>Sets the number of receive buffers (1–5, default: 1). More buffers reduce dropped frames but may cause out-of-order analysis. Increase until "buffer misses" reaches zero. Not used with ODI when a protocol stack is active.</P>

      {/* SCREENS */}
      <EthSectionHeading id="screens">Display &amp; Screens</EthSectionHeading>
      <EthSubHeading id="screen-layout">Screen Layout</EthSubHeading>
      <P>All ETHLOAD screens share a consistent layout:</P>
      <div style={{
        background: t.diagramBg, border: `1px solid ${t.border}`, borderRadius: 10,
        padding: "16px 20px", fontFamily: F_MONO, fontSize: 11.5, margin: "12px 0",
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

      <EthSubHeading id="commands">Universal Commands</EthSubHeading>
      <EthTableBlock headers={["Key", "Action"]} rows={[
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

      <EthSubHeading id="data-display">Data Display Modes</EthSubHeading>
      <P>ETHLOAD uses three primary display patterns throughout its screens:</P>
      <div style={{ display: "grid", gap: 12, margin: "12px 0" }}>
        {[
          { name: "Top Sorted Table", desc: "Entries ranked by frequency. Each line shows a percentage, the node identifier, and a visual bar graph (2.5% resolution). The percentage can be relative to: frames in current screen, total frames analyzed, or estimated bandwidth usage." },
          { name: "Raw Table", desc: "Unsorted internal table displayed directly — for example, the ARP cache showing MAC / IP address mappings." },
          { name: "Event History", desc: "Chronological log of events. Each line shows a timestamp (hh:mm:ss.hh) followed by the event description." },
        ].map((m) => (
          <div key={m.name} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: "14px 18px", boxShadow: t.shadow }}>
            <div style={{ fontWeight: 600, color: t.blue, fontSize: 14, marginBottom: 4, fontFamily: F_UI }}>{m.name}</div>
            <div style={{ color: t.textMuted, fontSize: 13, lineHeight: 1.65, fontFamily: F_BODY }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <EthSubHeading id="accuracy">Accuracy Notes</EthSubHeading>
      <EthInfoBox variant="warn" title="Measurement Limitations">Frame drops from slow controllers or inefficient drivers will undercount load. The MS-DOS timer has ~50ms resolution and may miss ticks under heavy CPU load. ETHLOAD provides reliable figures on a medium-loaded Ethernet (~10%) with a 386DX-25MHz or better CPU. 32-bit counters cap at ~4x10^9 frames — tables freeze and display overflow time in red.</EthInfoBox>

      <EthSubHeading id="mac-screen">MAC Level Screen</EthSubHeading>
      <P><Strong>Statistics Summary:</Strong> Three time windows — last interval, busiest interval, and cumulative. For each: total frames (with mean interframe gap), total data bytes (with load percentage), and error count (with rate/second and breakdown: CRC, too-long, too-short).</P>
      <P><Strong>VU-meter:</Strong> Visual load gauge graduated in Mbps. The <Code>{">"}</Code> marker shows peak load; the bar shows current load. Color-coded: green under 1 Mbps, yellow under 5 Mbps, red above 5 Mbps.</P>
      <P>MAC commands: <Code>Q</Code> to quit ETHLOAD (with confirmation), <Code>P</Code> to enter Protocol screen, <Code>E</Code> to view error source addresses (ODI only).</P>

      <EthSubHeading id="tcpip-screens">TCP/IP Screens</EthSubHeading>
      <P>The TCP/IP sub-menus provide deep protocol visibility:</P>
      <EthTableBlock headers={["Screen", "Shows"]} rows={[
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

      <EthSubHeading id="decnet-screens">DECnet Screens</EthSubHeading>
      <P>Shows Connect Initiate history (with object numbers), Disconnect Initiate events, returned frames from routers (unreachable end-nodes), and top DECnet transmitters/receivers. Note: DECnet layer stats differ from MAC stats — routers dominate at MAC level but may be invisible at the DECnet level, revealing actual remote node traffic.</P>

      <EthSubHeading id="osi-screens">OSI Screens</EthSubHeading>
      <P>Displays active and inactive network layer hosts, ES-IS/IS-IS information exchange, and transport layer events (connect/disconnect/error). NSAP addresses shown in hex; TSAP shown in hex, ASCII, and EBCDIC.</P>

      <EthSubHeading id="screen-summary">Screen Navigation Summary</EthSubHeading>
      <EthTableBlock headers={["Keystroke", "Screen", "Description"]} rows={[
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
      <EthSectionHeading id="annexes">Annexes</EthSectionHeading>
      <EthSubHeading id="references">Data Link Layer References</EthSubHeading>
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

      <EthSubHeading id="tested">Tested Datalink Configurations</EthSubHeading>
      <EthTableBlock headers={["Hardware / Driver", "Type"]} rows={[
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

      <EthSubHeading id="decnet-names">Adding DECnet Node Names</EthSubHeading>
      <P>The MKNODE utility converts DECnet addresses (area.node format) into Ethernet MAC addresses for the ETHERS file. It reads from stdin and writes to stdout:</P>
      <Code block>{`# Create NODES file on VMS:
$ NCP SHOW KNOWN NODES TO nodes

# Convert and append on MS-DOS:
MKNODE < NODES >> ETHERS

# Input format:       Output in ETHERS:
1.1    RM         ->  AA-00-04-00-01-04   RM
1.76   MDCPC      ->  AA-00-04-00-4C-04   MDCPC
2.3    DSRV03     ->  AA-00-04-00-03-08   DSRV03`}</Code>

      <EthSubHeading id="pitfalls">Common Pitfalls</EthSubHeading>
      <div style={{ display: "grid", gap: 10, margin: "12px 0" }}>
        {[
          { from: "Drew Letcher", issue: "ETHLOAD always fails if CONFIG.SYS contains STACKS=0,0. ETHLOAD is memory-hungry during interrupt processing.", fix: "Set at least STACKS=9,512" },
          { from: "Klaus Troja", issue: "Running with ODI requires proper NET.CFG configuration and specific load order.", fix: 'Add "Link Support / Buffer 4 1600 / MemPool 4096" to NET.CFG. Load ETHLOAD before IPXODI and NETX.' },
          { from: "Wey Jing Ho", issue: "Some datalink drivers fail when loaded into high memory.", fix: "Load in conventional memory (don't use LH command in MS-DOS 5.0)." },
          { from: "General", issue: "NDIS driver uses much more memory than other drivers.", fix: "Use -p option to restrict analyzed protocols." },
          { from: "General", issue: "On heavily loaded networks, CPU may be insufficient for full analysis.", fix: "Use -p2 to analyze only MAC layer." },
        ].map((p, i) => (
          <EthInfoBox key={i} variant="danger" title={`Reported by: ${p.from}`}>
            <Strong>Problem:</Strong> {p.issue}<br /><Strong>Solution:</Strong> {p.fix}
          </EthInfoBox>
        ))}
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: 64, paddingTop: 24, borderTop: `1px solid ${t.border}`, color: t.textMuted, fontSize: 13, textAlign: "center", lineHeight: 1.8, fontFamily: F_UI }}>
        <div>ETHLOAD v1.04 User's Guide · © NRB &amp; Eric Vyncke, 1994</div>
        <div style={{ marginTop: 4 }}>Modernized documentation redesign · All original content preserved</div>
      </div>
    </div>
  );
}

/* ══════════════════════ ETHLOAD GUIDE (folded into Toolkit as a reference tab) ══════════════════════ */
function EthloadTool() {
  const { t } = useT();
  const jump = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };
  return (
    <div>
      <div style={{ position: "sticky", top: 66, zIndex: 10, background: t.bg, padding: "10px 0", marginBottom: 20, borderBottom: `1px solid ${t.border}`, overflowX: "auto", whiteSpace: "nowrap" }}>
        {ETH_SECTIONS.map((s) => (
          <button key={s.id} onClick={() => jump(s.id)} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 8, padding: "7px 12px", marginRight: 8, fontFamily: F_UI, fontSize: 12.5, color: t.textSecondary, cursor: "pointer" }}>
            <span>{s.icon}</span>{s.title}
          </button>
        ))}
      </div>
      <EthContentArea />
    </div>
  );
}

const TABS = [
  { key: "glossary", label: "Glossary", icon: "📖" },
  { key: "library", label: "Visual Library", icon: "🎨" },
  { key: "playground", label: "Playground", icon: "▶" },
  { key: "ethload", label: "Ethload Guide", icon: "⚡" },
];
function ToolkitScreen({ onBack }) {
  const { t, view } = useT();
  const [tab, setTab] = useState("glossary");
  return (
    <div>
      <button onClick={onBack} style={backLinkStyle(t)}><I.back /> All phases</button>
      <div style={{ background: `linear-gradient(135deg, ${t.panel} 0%, ${t.surface} 100%)`, border: `1px solid ${t.border}`, borderRadius: 20, padding: view === "mobile" ? "28px 24px" : "40px 44px", marginBottom: 30, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -30, width: 260, height: 260, background: t.glow }} />
        <div style={{ fontFamily: F_MONO, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: t.accent, marginBottom: 8 }}>Always available · every phase</div>
        <h1 style={{ fontSize: view === "mobile" ? 28 : 38, fontWeight: 700, color: t.text, margin: "2px 0 10px", letterSpacing: -1, fontFamily: F_UI }}>Toolkit</h1>
        <p style={{ fontSize: 14.5, color: t.textSecondary, maxWidth: 560, fontFamily: F_BODY, lineHeight: 1.7, margin: 0 }}>
          A searchable glossary spanning every phase, a visual cheat-sheet library, a live code playground, and a restored historical networking manual.
        </p>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 26, flexWrap: "wrap" }}>
        {TABS.map((tb) => (
          <button key={tb.key} onClick={() => setTab(tb.key)} style={{ display: "flex", alignItems: "center", gap: 8, background: tab === tb.key ? t.accent : t.surface, color: tab === tb.key ? "#fff" : t.textSecondary, border: `1px solid ${tab === tb.key ? t.accent : t.border}`, borderRadius: 11, padding: "11px 18px", fontFamily: F_UI, fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
            <span>{tb.icon}</span>{tb.label}
          </button>
        ))}
      </div>
      {tab === "glossary" && <GlossaryTool />}
      {tab === "library" && <VisualLibraryTool />}
      {tab === "playground" && <PlaygroundTool />}
      {tab === "ethload" && <EthloadTool />}
    </div>
  );
}

/* ══════════════════════ CORE APP (unified root — replaces all 8 previous app roots) ══════════════════════ */
const STORAGE_KEY = "core-app-progress-v1";

export default function CoreApp() {
  const [mode, setMode] = useState("dark");
  const [view, setView] = useState("desktop");
  const [screen, setScreen] = useState("master"); // "master" | "phase" | "topic" | "review" | "toolkit"
  const [currentPhaseKey, setCurrentPhaseKey] = useState(null);
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

  const currentPhase = PHASES.find((p) => p.key === currentPhaseKey) || null;

  const openPhase = (key) => { setCurrentPhaseKey(key); setScreen("phase"); window.scrollTo({ top: 0 }); };
  const openTopic = (i) => { setTopicIdx(i); setScreen("topic"); window.scrollTo({ top: 0 }); };
  const backToMaster = () => { setCurrentPhaseKey(null); setScreen("master"); window.scrollTo({ top: 0 }); };
  const backToPhase = () => { setScreen("phase"); window.scrollTo({ top: 0 }); };

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
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Lora:ital,wght@0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ background: t.bg, minHeight: "100vh", color: t.text, transition: "background .25s, color .25s" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: t.bg + "e8", backdropFilter: "blur(10px)", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 10, padding: view === "mobile" ? "13px 20px" : "15px 36px", minHeight: 58 }}>
          <button onClick={backToMaster} style={{ background: "none", border: 0, cursor: "pointer", fontFamily: F_MONO, fontWeight: 700, fontSize: 15, color: t.text, padding: 0 }}>CORE</button>
          <div style={{ flex: 1 }} />
          <button onClick={() => setScreen("toolkit")} style={{ display: "flex", alignItems: "center", gap: 6, background: screen === "toolkit" ? t.accentSoft : "none", border: `1px solid ${screen === "toolkit" ? t.accent : t.border}`, color: screen === "toolkit" ? t.accent : t.textSecondary, borderRadius: 9, padding: "7px 13px", cursor: "pointer", fontFamily: F_UI, fontSize: 13, fontWeight: 600 }}>🧰 Toolkit</button>
          <button onClick={() => setScreen("review")} style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, background: screen === "review" ? t.accentSoft : "none", border: `1px solid ${screen === "review" ? t.accent : t.border}`, color: screen === "review" ? t.accent : t.textSecondary, borderRadius: 9, padding: "7px 13px", cursor: "pointer", fontFamily: F_UI, fontSize: 13, fontWeight: 600 }}>
            🔁 Review
            {dueCount > 0 && <span style={{ position: "absolute", top: -6, right: -6, background: t.accent, color: "#fff", fontSize: 10, fontFamily: F_MONO, fontWeight: 700, borderRadius: 10, minWidth: 16, height: 16, display: "grid", placeItems: "center", padding: "0 3px" }}>{dueCount}</span>}
          </button>
          <SegToggle value={mode} onChange={setMode} options={[{ key: "light", label: "Day", node: <I.sun /> }, { key: "dark", label: "Night", node: <I.moon /> }]} />
          <SegToggle value={view} onChange={setView} options={[{ key: "desktop", label: "Desktop", node: <I.desktop /> }, { key: "mobile", label: "Mobile", node: <I.mobile /> }]} />
        </div>
        <main style={{ maxWidth: view === "mobile" ? 680 : 900, margin: "0 auto", padding: view === "mobile" ? "26px 22px 84px" : "40px 44px 100px" }}>
          {screen === "master" && <MasterHub onOpenPhase={openPhase} onOpenToolkit={() => setScreen("toolkit")} completed={completed} />}
          {screen === "phase" && currentPhase && <PhaseHub phase={currentPhase} onOpenTopic={openTopic} onBackToMaster={backToMaster} completed={completed} />}
          {screen === "topic" && currentPhase && <TopicPage topic={currentPhase.topics[topicIdx]} onExit={backToPhase} onComplete={markComplete} readMode={readMode} onSetReadMode={setAndPersistReadMode} completed={completed} />}
          {screen === "review" && <ReviewScreen reviewItems={reviewItems} onRate={rateReview} onBack={backToMaster} />}
          {screen === "toolkit" && <ToolkitScreen onBack={backToMaster} />}
        </main>
      </div>
    </Ctx.Provider>
  );
}
