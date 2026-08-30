import { useState, createContext, useContext, useRef, useEffect } from "react";

/* ══════════════════════════════════════════════════
   TOOLKIT — Cross-cutting tools, always available
   Glossary · Visual Reference Library · Playground
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
    glow: "radial-gradient(circle, #dd806015 0%, transparent 70%)",
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
    glow: "radial-gradient(circle, #d9775718 0%, transparent 70%)",
  },
};
const F_UI = "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const F_BODY = "'Lora', Georgia, serif";
const F_MONO = "'JetBrains Mono', 'Fira Code', monospace";
const Ctx = createContext(null);
const useT = () => useContext(Ctx);

const PHASE_COLORS = { Logic: "accent", Hardware: "blue", "CLI/OS": "green", Programming: "purple", Web: "red", Networking: "blue", Security: "accent" };

const I = {
  sun: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>,
  moon: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" /></svg>,
  desktop: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
  mobile: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></svg>,
  search: (p) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>,
  play: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5v14l11-7z" /></svg>,
};

/* ══════════════════════ SHARED PRIMITIVES ══════════════════════ */
function Code({ children, block }) {
  const { t } = useT();
  if (block) return <pre style={{ background: t.codeBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: "16px 18px", fontFamily: F_MONO, fontSize: 12.5, lineHeight: 1.7, color: t.green, overflowX: "auto", margin: "14px 0" }}>{children}</pre>;
  return <code style={{ background: t.inlineBg, padding: "2.5px 8px", borderRadius: 6, fontFamily: F_MONO, fontSize: 12.5, color: t.blue }}>{children}</code>;
}
function P({ children }) { const { t } = useT(); return <p style={{ color: t.textSecondary, fontSize: 14.5, lineHeight: 1.75, margin: "10px 0", fontFamily: F_BODY }}>{children}</p>; }
function Chip({ label, active, onClick, color = "accent" }) {
  const { t } = useT(); const c = t[color] || t.accent;
  return <button onClick={onClick} style={{ background: active ? c : t.surfaceAlt, color: active ? "#fff" : t.textSecondary, border: `1px solid ${active ? c : t.border}`, borderRadius: 20, padding: "6px 14px", fontSize: 12.5, fontWeight: 600, fontFamily: F_UI, cursor: "pointer", whiteSpace: "nowrap" }}>{label}</button>;
}
function SegToggle({ options, value, onChange }) {
  const { t } = useT();
  return <div style={{ display: "inline-flex", background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 9, padding: 2 }}>
    {options.map((o) => { const on = value === o.key; return <button key={o.key} onClick={() => onChange(o.key)} title={o.label} style={{ display: "flex", border: 0, cursor: "pointer", background: on ? t.surface : "transparent", color: on ? t.accent : t.textMuted, padding: "6px 10px", borderRadius: 7 }}>{o.node}</button>; })}
  </div>;
}

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
const TABS = [
  { key: "glossary", label: "Glossary", icon: "📖" },
  { key: "library", label: "Visual Library", icon: "🎨" },
  { key: "playground", label: "Playground", icon: "▶" },
];

export default function Toolkit() {
  const [mode, setMode] = useState("dark");
  const [view, setView] = useState("desktop");
  const [tab, setTab] = useState("glossary");
  const t = THEMES[mode];

  return (
    <Ctx.Provider value={{ t, view }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ background: t.bg, minHeight: "100vh", color: t.text, transition: "background .25s, color .25s" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: t.bg + "e8", backdropFilter: "blur(10px)", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 10, padding: view === "mobile" ? "13px 20px" : "15px 36px", minHeight: 58 }}>
          <div style={{ fontFamily: F_MONO, fontWeight: 700, fontSize: 15, color: t.text }}>TOOLKIT</div>
          <div style={{ flex: 1 }} />
          <SegToggle value={mode} onChange={setMode} options={[{ key: "light", label: "Day", node: <I.sun /> }, { key: "dark", label: "Night", node: <I.moon /> }]} />
          <SegToggle value={view} onChange={setView} options={[{ key: "desktop", label: "Desktop", node: <I.desktop /> }, { key: "mobile", label: "Mobile", node: <I.mobile /> }]} />
        </div>

        <main style={{ maxWidth: view === "mobile" ? 680 : 900, margin: "0 auto", padding: view === "mobile" ? "26px 22px 84px" : "40px 44px 100px" }}>
          <div style={{ background: `linear-gradient(135deg, ${t.panel} 0%, ${t.surface} 100%)`, border: `1px solid ${t.border}`, borderRadius: 20, padding: view === "mobile" ? "28px 24px" : "40px 44px", marginBottom: 30, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -50, right: -30, width: 260, height: 260, background: t.glow }} />
            <div style={{ fontFamily: F_MONO, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: t.accent, marginBottom: 8 }}>Always available · every phase</div>
            <h1 style={{ fontSize: view === "mobile" ? 28 : 38, fontWeight: 700, color: t.text, margin: "2px 0 10px", letterSpacing: -1, fontFamily: F_UI }}>Toolkit</h1>
            <p style={{ fontSize: 14.5, color: t.textSecondary, maxWidth: 560, fontFamily: F_BODY, lineHeight: 1.7, margin: 0 }}>
              A searchable glossary spanning every phase, a visual cheat-sheet library, and a live code playground — the three cross-cutting tools that sit alongside the curriculum, not inside any one phase of it.
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
        </main>
      </div>
    </Ctx.Provider>
  );
}
