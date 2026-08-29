import { useState, useEffect, createContext, useContext } from "react";

/* ══════════════════════════════════════════════════
   COMMAND LINE & OPERATING SYSTEMS — Phase 2
   Same shell as Logic/Hardware — single accent, Claude palette,
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
const TOPICS = [
  {
    id: "terminal",
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
    id: "filesystem",
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
    id: "vim",
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
    id: "git",
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
    id: "scripting",
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
    id: "packages",
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
        <div style={{ fontFamily: F_MONO, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: t.accent, marginBottom: 10 }}>Phase 2</div>
        <h1 style={{ fontSize: view === "mobile" ? 32 : 44, fontWeight: 700, color: t.text, margin: "4px 0 14px", letterSpacing: -1.3, fontFamily: F_UI }}>Command Line & Operating Systems</h1>
        <p style={{ fontSize: view === "mobile" ? 15 : 17, color: t.textSecondary, maxWidth: 560, fontFamily: F_BODY, lineHeight: 1.75, margin: 0 }}>
          The toolset you'll use in every phase after this one — the terminal, filesystems across Linux, macOS and Windows, vim, Git, shell scripting, and package management.
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
const STORAGE_KEY = "cli-module-progress-v1";

export default function CLIModule() {
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
          <div style={{ fontFamily: F_MONO, fontWeight: 700, fontSize: 15, color: t.text }}>CLI &amp; OS</div>
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
