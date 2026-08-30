import { useState, useEffect, createContext, useContext } from "react";

/* ══════════════════════════════════════════════════
   WEB FUNDAMENTALS — Phase 4
   Same shell as Logic/Hardware/CLI/Programming — single accent, Claude palette,
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
const TOPICS = [
  {
    id: "html",
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
    id: "css",
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
    id: "js-browser",
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
    id: "page-load",
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
    id: "standards",
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
    id: "sql",
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
        <div style={{ fontFamily: F_MONO, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: t.accent, marginBottom: 10 }}>Phase 4</div>
        <h1 style={{ fontSize: view === "mobile" ? 32 : 44, fontWeight: 700, color: t.text, margin: "4px 0 14px", letterSpacing: -1.3, fontFamily: F_UI }}>Web Fundamentals</h1>
        <p style={{ fontSize: view === "mobile" ? 15 : 17, color: t.textSecondary, maxWidth: 560, fontFamily: F_BODY, lineHeight: 1.75, margin: 0 }}>
          Applying code to something you can see — HTML structure, CSS layout, JavaScript in the browser, how a page actually loads, and a first taste of SQL.
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
const STORAGE_KEY = "web-module-progress-v1";

export default function WebModule() {
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
          <div style={{ fontFamily: F_MONO, fontWeight: 700, fontSize: 15, color: t.text }}>WEB</div>
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
