import { useState, useEffect, createContext, useContext } from "react";

/* ══════════════════════════════════════════════════
   SECURITY & ETHICAL HACKING — Phase 6 (Capstone)
   Same shell as prior modules — single accent, Claude palette,
   Study/Reference modes, Topic Map, Spaced Review, DeepDives
   Defensive/pentest awareness framing only — no operational exploit content
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
const TOPICS = [
  {
    id: "foundations",
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
    id: "lifecycle",
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
    id: "vuln-mechanics",
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
    id: "tools",
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
    id: "social-network-attacks",
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
    id: "reporting-careers",
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
        <div style={{ fontFamily: F_MONO, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: t.accent, marginBottom: 10 }}>Phase 6 · Capstone</div>
        <h1 style={{ fontSize: view === "mobile" ? 32 : 44, fontWeight: 700, color: t.text, margin: "4px 0 14px", letterSpacing: -1.2, fontFamily: F_UI }}>Security &amp; Ethical Hacking</h1>
        <p style={{ fontSize: view === "mobile" ? 15 : 17, color: t.textSecondary, maxWidth: 560, fontFamily: F_BODY, lineHeight: 1.75, margin: 0 }}>
          The capstone — the pentest lifecycle, how common vulnerabilities actually work, the tool landscape at awareness level, and how to write up what you find.
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
const STORAGE_KEY = "security-module-progress-v1";

export default function SecurityModule() {
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
          <div style={{ fontFamily: F_MONO, fontWeight: 700, fontSize: 15, color: t.text }}>SECURITY</div>
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
