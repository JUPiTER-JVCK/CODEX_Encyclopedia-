import { useState, createContext, useContext } from "react";

/* ══════════════════════════════════════════════════
   CORE · KNOWLEDGE MAP  — prototype
   A winding learning-path that turns progress into a place.
   Claude brand palette · single accent · dark/light · desktop/mobile
   ══════════════════════════════════════════════════ */

const THEMES = {
  dark: {
    bg: "#141413", panel: "#0f0e0d", surface: "#1e1d1a", surfaceAlt: "#26241f",
    border: "#2b2a26", borderStrong: "#3a3833",
    text: "#faf9f5", textSecondary: "#c9c6bb", textMuted: "#8f8d83",
    accent: "#dd8060", accentSoft: "#dd806022",
    green: "#8ba173", greenSoft: "#8ba17322",
    blue: "#7fa9d4", purple: "#b99ad4",
    line: "#3a3833", glow: "radial-gradient(circle, #dd806018 0%, transparent 70%)",
    shadow: "none",
  },
  light: {
    bg: "#faf9f5", panel: "#f4f2ea", surface: "#ffffff", surfaceAlt: "#f2f0e8",
    border: "#e8e6dc", borderStrong: "#dcd9cc",
    text: "#141413", textSecondary: "#57554d", textMuted: "#8a887e",
    accent: "#c05f3c", accentSoft: "#c05f3c14",
    green: "#5f7345", greenSoft: "#5f734514",
    blue: "#4a7db0", purple: "#7c5da8",
    line: "#dcd9cc", glow: "radial-gradient(circle, #d9775720 0%, transparent 70%)",
    shadow: "0 1px 3px rgba(20,20,19,0.06), 0 1px 2px rgba(20,20,19,0.04)",
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
  close: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M18 6L6 18M6 6l12 12" /></svg>,
  check: (p) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6L9 17l-5-5" /></svg>,
  lock: (p) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>,
  arrow: (p) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
};

/* ══════════════════════ CURRICULUM DATA ══════════════════════
   states: complete | current | available | locked  (illustrative) */
const PHASES = [
  { id: "logic", n: "0", label: "Logic", icon: "⊤", state: "complete",
    blurb: "Boolean algebra, gates, binary, and the circuits that remember — where every decision a computer makes begins.",
    topics: [["Boolean Algebra Basics", 1], ["Logic Gates Deep Dive", 1], ["Binary & Hexadecimal", 1], ["Bitwise Operations", 1], ["Combinational vs. Sequential", 1], ["Case Study: Year 2038", 1]] },
  { id: "hardware", n: "1", label: "Hardware", icon: "▤", state: "current",
    blurb: "The physical machine — CPU anatomy, buses, memory hierarchy, and how a program actually runs on silicon.",
    topics: [["Full-Stack Diagram", 0], ["CPU Anatomy", 0], ["Buses", 0], ["Memory Hierarchy", 0], ["Storage Evolution", 0], ["Interrupts, DMA & IRQs", 0], ["Case Study: Softmodems", 0], ["RF & Wireless", 0]] },
  { id: "cli", n: "2", label: "Command Line & OS", icon: "▸_", state: "available",
    blurb: "Gaining real control of a system — bash/zsh, PowerShell, the filesystem, vim, Git, and package management.",
    topics: [["bash / zsh", 1], ["PowerShell", 1], ["Filesystem Hierarchy", 0], ["vim", 0], ["Git & GitHub", 0], ["Package Management", 0]] },
  { id: "programming", n: "3", label: "Programming", icon: "{ }", state: "available",
    blurb: "Learning to think in logic — Python, JavaScript, and then C/C++ to see what the high-level languages were hiding.",
    topics: [["Python", 1], ["JavaScript", 1], ["C / C++", 0]] },
  { id: "web", n: "4", label: "Web Fundamentals", icon: "◈", state: "available",
    blurb: "Applying code to something you can see — HTML, CSS, JavaScript in the browser, and a first taste of SQL.",
    topics: [["HTML", 1], ["CSS", 0], ["JS in the Browser", 0], ["SQL (elective)", 0]] },
  { id: "networking", n: "5", label: "Networking & Cisco", icon: "⬡", state: "available",
    blurb: "How programs talk to each other — the OSI model, routing, subnetting, and the full CCNA 1–3 arc.",
    topics: [["OSI Model", 1], ["Topologies", 1], ["Routing & AD", 1], ["HTTP Codes", 1], ["Ports", 1], ["Subnetting", 1], ["CCNA 1", 0], ["CCNA 2", 0], ["CCNA 3", 0]] },
  { id: "security", n: "6", label: "Security & Ethical Hacking", icon: "⚿", state: "locked",
    blurb: "The capstone — the pentest lifecycle, vulnerability mechanics, the tool landscape, forensics, and reporting. Visual-first, defensive framing.",
    topics: [["Foundations & Scope", 0], ["Pentest Lifecycle", 0], ["Vulnerability Mechanics", 0], ["Tool Landscape", 0], ["Network Attacks", 0], ["Forensics", 0], ["Writing a Report", 0]] },
];

const CROSSCUTTING = [
  { id: "playground", label: "Playground", icon: "▶", note: "Run JS & HTML live" },
  { id: "glossary", label: "Glossary", icon: "📖", note: "Inline + searchable" },
  { id: "library", label: "Visual Library", icon: "🎨", note: "Every cheat sheet" },
  { id: "review", label: "Review", icon: "🔁", note: "Spaced repetition" },
];

/* winding serpentine layout across a fixed viewBox */
const VW = 760, VH = 1360;
const NODES = PHASES.map((p, i) => ({
  ...p,
  x: 380 + 205 * Math.sin(i * 0.92),
  y: 150 + i * ((VH - 260) / (PHASES.length - 1)),
}));

function segPath(a, b) {
  const midY = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
}

/* ══════════════════════ MAP ══════════════════════ */
function Map({ onSelect, selected }) {
  const { t } = useT();
  const stateColor = (s) => s === "complete" ? t.green : s === "current" ? t.accent : s === "available" ? t.accent : t.textMuted;
  const R = 32, ringR = 32;
  const C = 2 * Math.PI * ringR;

  return (
    <div style={{ overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch" }}>
      <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: "100%", minWidth: 520, height: "auto", display: "block" }}>
        {/* connecting segments */}
        {NODES.slice(0, -1).map((a, i) => {
          const b = NODES[i + 1];
          const traveled = a.state === "complete";
          return (
            <path key={i} d={segPath(a, b)} fill="none"
              stroke={traveled ? t.green : t.line}
              strokeWidth={traveled ? 6 : 5}
              strokeLinecap="round"
              strokeDasharray={traveled ? "none" : "2 14"} />
          );
        })}

        {/* start pin */}
        <g>
          <text x={NODES[0].x} y={NODES[0].y - 62} textAnchor="middle" fontFamily={F_MONO} fontSize="12" fill={t.textMuted} letterSpacing="2">START</text>
        </g>

        {/* nodes */}
        {NODES.map((node) => {
          const done = node.topics.filter((tp) => tp[1]).length;
          const frac = done / node.topics.length;
          const col = stateColor(node.state);
          const isSel = selected === node.id;
          const labelLeft = node.x > 380;
          const labelX = labelLeft ? node.x - R - 16 : node.x + R + 16;
          const locked = node.state === "locked";
          return (
            <g key={node.id} style={{ cursor: "pointer" }} onClick={() => onSelect(node.id)}>
              {/* selection halo */}
              {isSel && <circle cx={node.x} cy={node.y} r={R + 11} fill="none" stroke={col} strokeWidth="2" opacity="0.5" />}
              {/* current pulse */}
              {node.state === "current" && <circle className="km-pulse" cx={node.x} cy={node.y} r={R + 6} fill="none" stroke={col} strokeWidth="2.5" />}
              {/* progress ring track */}
              <circle cx={node.x} cy={node.y} r={ringR} fill="none" stroke={t.line} strokeWidth="4" />
              {/* progress ring fill */}
              {frac > 0 && (
                <circle cx={node.x} cy={node.y} r={ringR} fill="none" stroke={col} strokeWidth="4"
                  strokeLinecap="round" strokeDasharray={`${frac * C} ${C}`}
                  transform={`rotate(-90 ${node.x} ${node.y})`} />
              )}
              {/* inner disc */}
              <circle cx={node.x} cy={node.y} r={R - 7} fill={node.state === "complete" ? col : node.state === "current" ? col : t.surface} stroke={col} strokeWidth="2" opacity={locked ? 0.5 : 1} />
              {/* glyph */}
              {node.state === "complete" ? (
                <g transform={`translate(${node.x - 7} ${node.y - 7})`} style={{ color: t.bg }}><I.check /></g>
              ) : (
                <text x={node.x} y={node.y + 6} textAnchor="middle" fontFamily={F_MONO} fontSize="18" fontWeight="700"
                  fill={node.state === "current" ? t.bg : col} opacity={locked ? 0.6 : 1}>{node.n}</text>
              )}
              {/* label */}
              <text x={labelX} y={node.y - 2} textAnchor={labelLeft ? "end" : "start"} fontFamily={F_UI} fontSize="17" fontWeight="600" fill={t.text} opacity={locked ? 0.55 : 1}>
                {node.label}
              </text>
              <text x={labelX} y={node.y + 17} textAnchor={labelLeft ? "end" : "start"} fontFamily={F_MONO} fontSize="12" fill={t.textMuted}>
                {locked ? "locked" : `${done}/${node.topics.length} topics`}
              </text>
            </g>
          );
        })}

        {/* finish flag near last node */}
        <text x={NODES[NODES.length - 1].x} y={NODES[NODES.length - 1].y + 66} textAnchor="middle" fontFamily={F_MONO} fontSize="12" fill={t.textMuted} letterSpacing="2">CAPSTONE</text>
      </svg>
    </div>
  );
}

/* ══════════════════════ DETAIL DRAWER ══════════════════════ */
function Drawer({ phase, onClose }) {
  const { t, view } = useT();
  if (!phase) return null;
  const done = phase.topics.filter((tp) => tp[1]).length;
  const col = phase.state === "complete" ? t.green : t.accent;
  const mobile = view === "mobile";
  const ctaLabel = phase.state === "complete" ? "Review this phase" : phase.state === "current" ? "Continue learning" : phase.state === "locked" ? "Finish earlier phases first" : "Start this phase";

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 90 }} />
      <div style={{
        position: "fixed", zIndex: 95, background: t.surface, boxShadow: "0 10px 50px rgba(0,0,0,0.35)",
        ...(mobile
          ? { left: 0, right: 0, bottom: 0, borderRadius: "18px 18px 0 0", maxHeight: "82vh" }
          : { top: 0, bottom: 0, right: 0, width: 380, borderLeft: `1px solid ${t.borderStrong}` }),
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ padding: "20px 22px 16px", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ fontFamily: F_MONO, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: col }}>Phase {phase.n}</div>
            <button onClick={onClose} aria-label="Close" style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 8, padding: "5px 7px", color: t.textSecondary, cursor: "pointer", display: "flex" }}><I.close /></button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: col + "22", display: "grid", placeItems: "center", fontFamily: F_MONO, fontSize: 20, color: col }}>{phase.icon}</div>
            <h2 style={{ margin: 0, fontFamily: F_UI, fontSize: 21, fontWeight: 700, color: t.text, letterSpacing: -0.4 }}>{phase.label}</h2>
          </div>
          <p style={{ color: t.textSecondary, fontSize: 14, lineHeight: 1.6, fontFamily: F_BODY, margin: "12px 0 0" }}>{phase.blurb}</p>
        </div>

        <div style={{ padding: "16px 22px", overflowY: "auto", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontFamily: F_MONO, fontSize: 12, color: t.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>Topics</span>
            <span style={{ fontFamily: F_MONO, fontSize: 12, color: col }}>{done}/{phase.topics.length} complete</span>
          </div>
          <div style={{ display: "grid", gap: 7 }}>
            {phase.topics.map(([name, isDone], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 9, padding: "10px 13px" }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: isDone ? t.green : "transparent", border: `1.5px solid ${isDone ? t.green : t.borderStrong}`, display: "grid", placeItems: "center", color: t.bg, flexShrink: 0 }}>{isDone ? <I.check /> : null}</span>
                <span style={{ fontSize: 14, color: isDone ? t.textSecondary : t.text, fontFamily: F_BODY }}>{name}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "14px 22px 18px", borderTop: `1px solid ${t.border}` }}>
          <button disabled={phase.state === "locked"} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: phase.state === "locked" ? t.surfaceAlt : col, color: phase.state === "locked" ? t.textMuted : "#fff", border: phase.state === "locked" ? `1px solid ${t.border}` : "none", borderRadius: 10, padding: "12px", fontSize: 14.5, fontWeight: 600, cursor: phase.state === "locked" ? "default" : "pointer", fontFamily: F_UI }}>
            {phase.state === "locked" ? <I.lock /> : null}{ctaLabel}{phase.state !== "locked" ? <I.arrow /> : null}
          </button>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════ SHARED ══════════════════════ */
function SegToggle({ options, value, onChange }) {
  const { t } = useT();
  return <div style={{ display: "inline-flex", background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 9, padding: 2 }}>
    {options.map((o) => { const on = value === o.key; return <button key={o.key} onClick={() => onChange(o.key)} title={o.label} style={{ display: "flex", border: 0, cursor: "pointer", background: on ? t.surface : "transparent", color: on ? t.accent : t.textMuted, padding: "6px 10px", borderRadius: 7 }}>{o.node}</button>; })}
  </div>;
}
function LegendDot({ color, ring, label }) {
  const { t } = useT();
  return <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
    <span style={{ width: 14, height: 14, borderRadius: "50%", background: ring ? "transparent" : color, border: `2px solid ${color}` }} />
    <span style={{ fontSize: 12.5, color: t.textSecondary, fontFamily: F_UI }}>{label}</span>
  </div>;
}

/* ══════════════════════ APP ══════════════════════ */
export default function KnowledgeMap() {
  const [mode, setMode] = useState("dark");
  const [view, setView] = useState("desktop");
  const [selected, setSelected] = useState(null);
  const t = THEMES[mode];
  const mobile = view === "mobile";

  const totalTopics = PHASES.reduce((s, p) => s + p.topics.length, 0);
  const doneTopics = PHASES.reduce((s, p) => s + p.topics.filter((tp) => tp[1]).length, 0);
  const pct = Math.round((doneTopics / totalTopics) * 100);
  const selPhase = PHASES.find((p) => p.id === selected) || null;

  return (
    <Ctx.Provider value={{ t, view }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes kmpulse { 0% { opacity:.7; transform:scale(1);} 70%{opacity:0; transform:scale(1.35);} 100%{opacity:0;} }
        .km-pulse { transform-box: fill-box; transform-origin: center; animation: kmpulse 2.2s ease-out infinite; }
        @media (prefers-reduced-motion: reduce){ .km-pulse{ animation:none; } }
      `}</style>
      <div style={{ background: t.bg, minHeight: "100vh", color: t.text, transition: "background .25s, color .25s" }}>
        {/* top bar */}
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: t.bg + "e8", backdropFilter: "blur(10px)", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 12, padding: mobile ? "10px 16px" : "11px 28px", minHeight: 54 }}>
          <div style={{ fontFamily: F_MONO, fontWeight: 700, fontSize: 15 }}>CORE</div>
          <div style={{ fontFamily: F_MONO, fontSize: 12.5, color: t.textMuted }}>· Knowledge Map</div>
          <div style={{ flex: 1 }} />
          <SegToggle value={mode} onChange={setMode} options={[{ key: "light", label: "Day", node: <I.sun /> }, { key: "dark", label: "Night", node: <I.moon /> }]} />
          <SegToggle value={view} onChange={setView} options={[{ key: "desktop", label: "Desktop", node: <I.desktop /> }, { key: "mobile", label: "Mobile", node: <I.mobile /> }]} />
        </div>

        <main style={{ maxWidth: 860, margin: "0 auto", padding: mobile ? "22px 14px 70px" : "30px 28px 90px" }}>
          {/* header */}
          <div style={{ position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${t.panel}, ${t.surface})`, border: `1px solid ${t.border}`, borderRadius: 18, padding: mobile ? "24px 20px" : "34px 34px", marginBottom: 22 }}>
            <div style={{ position: "absolute", top: -50, right: -30, width: 260, height: 260, background: t.glow }} />
            <div style={{ fontFamily: F_MONO, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: t.accent, marginBottom: 6 }}>Your path through Computer Science</div>
            <h1 style={{ fontSize: mobile ? 30 : 40, fontWeight: 700, margin: "2px 0 10px", letterSpacing: -1.4, fontFamily: F_UI }}>The whole journey, one map.</h1>
            <p style={{ fontSize: mobile ? 15 : 16.5, color: t.textSecondary, fontFamily: F_BODY, lineHeight: 1.65, margin: "0 0 18px", maxWidth: 560 }}>
              Every phase is a stop on the path. Fill them in as you go — seeing where a concept lives helps it stick. Tap any stop to see its topics.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 160, maxWidth: 300, height: 8, background: t.surfaceAlt, borderRadius: 5, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: t.accent, borderRadius: 5, transition: "width .4s" }} />
              </div>
              <span style={{ fontFamily: F_MONO, fontSize: 13, color: t.textMuted }}>{doneTopics}/{totalTopics} topics · {pct}%</span>
            </div>
          </div>

          {/* legend */}
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", padding: "0 4px 10px", justifyContent: "center" }}>
            <LegendDot color={t.green} label="Complete" />
            <LegendDot color={t.accent} label="In progress" />
            <LegendDot color={t.accent} ring label="Available" />
            <LegendDot color={t.textMuted} ring label="Locked" />
          </div>

          {/* the map */}
          <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: mobile ? "8px 4px" : "16px 8px", boxShadow: t.shadow }}>
            <Map onSelect={setSelected} selected={selected} />
          </div>

          {/* cross-cutting rail */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontFamily: F_MONO, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: t.textMuted, marginBottom: 10, textAlign: "center" }}>Always available — not a phase</div>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
              {CROSSCUTTING.map((c) => (
                <div key={c.id} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 13, padding: "16px 14px", textAlign: "center", boxShadow: t.shadow }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{c.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.text, fontFamily: F_UI }}>{c.label}</div>
                  <div style={{ fontSize: 11.5, color: t.textMuted, fontFamily: F_MONO, marginTop: 3 }}>{c.note}</div>
                </div>
              ))}
            </div>
          </div>

          <p style={{ textAlign: "center", color: t.textMuted, fontFamily: F_MONO, fontSize: 11.5, marginTop: 26 }}>
            Prototype · completion states shown are illustrative
          </p>
        </main>

        <Drawer phase={selPhase} onClose={() => setSelected(null)} />
      </div>
    </Ctx.Provider>
  );
}
