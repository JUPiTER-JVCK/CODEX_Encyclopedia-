import { useState, useEffect, createContext, useContext } from "react";

/* ══════════════════════════════════════════════════
   PROGRAMMING — Phase 3
   Same shell as Logic/Hardware/CLI — single accent, Claude palette,
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
const TOPICS = [
  {
    id: "fundamentals",
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
    id: "control-flow",
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
    id: "functions",
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
    id: "data-structures",
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
    id: "python",
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
    id: "js-c",
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
        <div style={{ fontFamily: F_MONO, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: t.accent, marginBottom: 10 }}>Phase 3</div>
        <h1 style={{ fontSize: view === "mobile" ? 32 : 44, fontWeight: 700, color: t.text, margin: "4px 0 14px", letterSpacing: -1.4, fontFamily: F_UI }}>Programming</h1>
        <p style={{ fontSize: view === "mobile" ? 15 : 17, color: t.textSecondary, maxWidth: 560, fontFamily: F_BODY, lineHeight: 1.75, margin: 0 }}>
          Learning to think in logic and instructions — fundamentals, control flow, functions, data structures, then Python, JavaScript, and a bridge down to C/C++.
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
const STORAGE_KEY = "programming-module-progress-v1";

export default function ProgrammingModule() {
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
          <div style={{ fontFamily: F_MONO, fontWeight: 700, fontSize: 15, color: t.text }}>PROGRAMMING</div>
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
