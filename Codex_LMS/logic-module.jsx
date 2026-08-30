import { useState, useEffect, createContext, useContext, useMemo } from "react";

/* ══════════════════════════════════════════════════
   LOGIC — Phase 0 of the CS Encyclopedia
   Single accent throughout, Claude brand palette
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
function DataTable({ headers, rows }) {
  const { t } = useT();
  return <div style={{ overflowX: "auto", margin: "22px 0", borderRadius: 12, border: `1px solid ${t.border}` }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
      <thead><tr>{headers.map((h, i) => <th key={i} style={{ textAlign: "left", padding: "12px 16px", background: t.surfaceAlt, color: t.accent, borderBottom: `1px solid ${t.borderStrong}`, fontFamily: F_UI, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, ri) => <tr key={ri} style={{ background: ri % 2 ? t.surfaceAlt + "60" : t.surface }}>{r.map((c, ci) => <td key={ci} style={{ padding: "11px 16px", borderBottom: ri === rows.length - 1 ? "none" : `1px solid ${t.border}`, color: ci === 0 ? t.green : t.textSecondary, fontFamily: ci === 0 ? F_MONO : F_BODY }}>{c}</td>)}</tr>)}</tbody>
    </table>
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

const TOPICS = [
  {
    id: "boolean",
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
    id: "gates",
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
    retrieval: { q: "Which two gates are called 'universal' because every other gate can be built from just them?", a: "NAND and NOR" },
    recap: ["A gate is a physical circuit implementing one Boolean operation", "Seven standard gates: AND, OR, NOT, NAND, NOR, XOR, XNOR", "XOR = 1 when inputs differ; XNOR = 1 when inputs match", "NAND and NOR are 'universal' — every other gate can be built from just one of them", "A gate's input count is its fan-in; real chips limit it for speed", "A half-adder is just one XOR (sum) and one AND (carry) run in parallel — the seed of every CPU's arithmetic unit"],
  },
  {
    id: "binhex",
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
    id: "bitwise",
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
    id: "sequential",
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
    id: "y2038",
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
];

/* ══════════════════════ TOPIC PAGE ══════════════════════ */
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
          {topic.simulator && <GateSimulator />}
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

      {topic.simulator && <GateSimulator />}

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
          <p style={{ fontFamily: F_BODY, color: t.textSecondary, maxWidth: 420, margin: "0 auto", lineHeight: 1.7 }}>Complete topics to add them to your review queue. Spaced repetition works by waiting — items you rated "Got it" come back further apart each time, so come back tomorrow.</p>
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

/* ══════════════════════ HUB PAGE ══════════════════════ */
function Hub({ onOpen, completed }) {
  const { t, view } = useT();
  const doneCount = TOPICS.filter((tp) => completed[tp.id]).length;
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${t.panel} 0%, ${t.surface} 100%)`, border: `1px solid ${t.border}`, borderRadius: 20, padding: view === "mobile" ? "32px 26px" : "48px 48px", marginBottom: 36, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -30, width: 280, height: 280, background: t.glow }} />
        <div style={{ fontFamily: F_MONO, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: t.accent, marginBottom: 10 }}>Phase 0 · Foundations</div>
        <h1 style={{ fontSize: view === "mobile" ? 32 : 44, fontWeight: 700, color: t.text, margin: "4px 0 14px", letterSpacing: -1.5, fontFamily: F_UI }}>Logic</h1>
        <p style={{ fontSize: view === "mobile" ? 15 : 17, color: t.textSecondary, maxWidth: 560, fontFamily: F_BODY, lineHeight: 1.75, margin: 0 }}>
          Every decision a computer ever makes reduces to true or false. This is where that starts — Boolean algebra, logic gates, binary and hex, bitwise operations, and the sequential circuits that give a machine its memory.
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
const STORAGE_KEY = "logic-module-progress-v1";

export default function LogicModule() {
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
          <div style={{ fontFamily: F_MONO, fontWeight: 700, fontSize: 15, color: t.text }}>LOGIC</div>
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
