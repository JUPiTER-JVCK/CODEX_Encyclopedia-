import { useState, useEffect, createContext, useContext } from "react";

/* ══════════════════════════════════════════════════
   HARDWARE — Phase 1 of the CS Encyclopedia
   Same shell as Logic: single accent, Claude palette,
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
const TOPICS = [
  {
    id: "fullstack",
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
    id: "cpu",
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
    id: "buses-memory",
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
    id: "storage",
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
    id: "interrupts",
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
    id: "casestudies",
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
          {topic.simulator && <MemoryHierarchyVisualizer />}
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

      {topic.simulator && <MemoryHierarchyVisualizer />}

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
        <div style={{ fontFamily: F_MONO, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: t.accent, marginBottom: 10 }}>Phase 1 · Foundations</div>
        <h1 style={{ fontSize: view === "mobile" ? 32 : 44, fontWeight: 700, color: t.text, margin: "4px 0 14px", letterSpacing: -1.5, fontFamily: F_UI }}>Hardware</h1>
        <p style={{ fontSize: view === "mobile" ? 15 : 17, color: t.textSecondary, maxWidth: 560, fontFamily: F_BODY, lineHeight: 1.75, margin: 0 }}>
          The physical machine underneath everything else — CPU anatomy, buses, memory hierarchy, storage, interrupts, and where hardware's job quietly becomes software's job.
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
const STORAGE_KEY = "hardware-module-progress-v1";

export default function HardwareModule() {
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
          <div style={{ fontFamily: F_MONO, fontWeight: 700, fontSize: 15, color: t.text }}>HARDWARE</div>
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
