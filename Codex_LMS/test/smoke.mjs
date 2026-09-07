import { chromium } from "playwright";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const URL = process.argv[2] || "http://localhost:4173/";

// Prefer whatever Playwright installed for itself — that's the CI case and
// most local setups. `executablePath()` reports where the browser *would*
// live without checking it's there, so test the path rather than trusting it.
// Fall back to a pre-provisioned binary, which is how sandboxed environments
// supply Chromium without allowing a download.
const PROVISIONED = process.env.PLAYWRIGHT_CHROMIUM_PATH || "/opt/pw-browsers/chromium";

function resolveBrowser() {
  let managed;
  try {
    managed = chromium.executablePath();
  } catch {
    managed = null;
  }
  if (managed && existsSync(managed)) return {};
  if (existsSync(PROVISIONED)) return { executablePath: PROVISIONED };
  throw new Error(
    `No Chromium found. Run "npx playwright install chromium", or set ` +
      `PLAYWRIGHT_CHROMIUM_PATH to an existing binary.`
  );
}


// ── The `simulator` flag must match what a topic actually renders ──────────
// The flag drives the "· interactive" badge on topic cards. It has already
// drifted once — 17 topics had a widget while 7 carried the flag — and that
// drift is invisible in the UI: the badge simply under-reports. Checked from
// source rather than by visiting 43 topics, because the failure is a stale
// literal, not a rendering fault.
function checkSimulatorFlags() {
  const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "src", "CoreApp.jsx"), "utf8");
  // "Interactive" means a component the reader can change something in, so
  // the set is built from components that hold state. A static diagram is an
  // illustration, not a simulator, and must not claim the badge — an earlier
  // pass counted any component reference and mislabelled seven topics.
  const widgets = new Set();
  for (const m of src.matchAll(/^function ([A-Z][A-Za-z]*)\(/gm)) {
    const from = m.index;
    const next = src.indexOf("\nfunction ", from + 1);
    const body = src.slice(from, next < 0 ? src.length : next);
    if (body.includes("useState")) widgets.add(m[1]);
  }
  const arrays = ["LOGIC", "HARDWARE", "CLI", "PROGRAMMING", "WEB", "NETWORKING", "SECURITY"];
  const bad = [];
  const byPhase = {};
  let total = 0;
  let flagged = 0;

  for (const name of arrays) {
    const at = src.indexOf(`const TOPICS_${name} = [`);
    if (at < 0) throw new Error(`TOPICS_${name} not found — smoke test is out of date with the source`);
    let depth = 0;
    let i = src.indexOf("[", at);
    const start = i;
    for (; i < src.length; i++) {
      if (src[i] === "[") depth++;
      else if (src[i] === "]" && --depth === 0) break;
    }
    const body = src.slice(start + 1, i);
    let d = 0;
    let open = null;
    for (let k = 0; k < body.length; k++) {
      if (body[k] === "{") { if (d === 0) open = k; d++; }
      else if (body[k] === "}" && --d === 0) {
        const topic = body.slice(open, k + 1);
        const id = (topic.match(/id: "([^"]+)"/) || [])[1];
        if (!id) continue;
        total++;
        const flag = /simulator: true/.test(topic);
        const rc = (topic.match(/recapSimulator: (?:\(\) => <)?([A-Z][A-Za-z]*)/) || [])[1];
        const renders = (rc && widgets.has(rc)) ||
          [...topic.matchAll(/<([A-Z][A-Za-z]*)\s*\/>/g)].some((m) => widgets.has(m[1]));
        const title = (topic.match(/title: "([^"]+)"/) || [])[1];
        if (flag) { flagged++; if (title) (byPhase[name] ||= []).push(title); }
        if (flag !== renders) bad.push(`${id}: flag=${flag} but renders=${renders}`);
      }
    }
  }
  if (bad.length) {
    throw new Error("simulator flag out of sync with what renders:\n   " + bad.join("\n   "));
  }
  return { total, flagged, byPhase };
}

// ── A click target must be operable by keyboard ────────────────────────────
// onClick on a <div>, <span> or <th> is invisible to Tab, ignores Enter and
// Space, and is not announced as a control. Three widgets shipped that way
// before review caught it. Allowed: a real <button>, a component (capitalised
// tag, which renders its own button), or an element carrying role="button"
// with tabIndex and a key handler — the escape hatch SVG needs, since <svg>
// cannot contain a <button>.
function checkClickTargets() {
  const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "src", "CoreApp.jsx"), "utf8");
  const lines = src.split("\n");
  const bad = [];
  lines.forEach((line, i) => {
    if (!line.includes("onClick")) return;
    const tag = (line.match(/<([A-Za-z][A-Za-z0-9]*)/) || [])[1];
    if (!tag) return;                                   // continuation line
    if (tag === "button") return;                       // the good case
    if (tag[0] === tag[0].toUpperCase()) return;        // a component
    // role="button" + tabIndex + a key handler may span the following lines
    const block = lines.slice(i, i + 6).join(" ");
    if (/role="button"/.test(block) && /tabIndex/.test(block) && /onKeyDown/.test(block)) return;
    bad.push(`${i + 1}: <${tag}> has onClick but is not keyboard-operable`);
  });
  if (bad.length) {
    throw new Error("click targets that a keyboard cannot reach:\n   " + bad.join("\n   "));
  }
}
checkClickTargets();
console.log("  every click target is keyboard-operable");

const flags = checkSimulatorFlags();
console.log(`  simulator flag matches reality: ${flags.flagged}/${flags.total} topics interactive`);

const browser = await chromium.launch(resolveBrowser());
const ctx = await browser.newContext();
const page = await ctx.newPage();

// A JS exception is always the app's fault. A failed subresource usually
// isn't — the app loads its fonts from Google Fonts, and a blocked or flaky
// fetch says nothing about whether the page works. Splitting these keeps the
// gate meaningful: a red run means real breakage, not a network hiccup.
const errors = [];
const warnings = [];
const NETWORK_NOISE = /Failed to load resource|net::ERR_|ERR_CONNECTION|favicon/i;

page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
page.on("console", (m) => {
  if (m.type() !== "error") return;
  const text = m.text();
  (NETWORK_NOISE.test(text) ? warnings : errors).push("console.error: " + text);
});

const step = (msg) => console.log("  " + msg);

await page.goto(URL, { waitUntil: "networkidle" });
step(`loaded — title: ${JSON.stringify(await page.title())}`);

// Storage backend the adapter picked.
const kind = await page.evaluate(() => {
  return window.localStorage ? (window.storage ? "artifact" : "local") : "memory";
});
step(`expected storage backend: ${kind}`);

// Master hub should show the seven phases (rendered by phase.title).
await page.waitForSelector("text=Every Phase, One App", { timeout: 10000 });
const phases = [
  "Logic",
  "Hardware",
  "Command Line & Operating Systems",
  "Programming",
  "Web Fundamentals",
  "Networking & Cisco",
  "Security & Ethical Hacking",
];
for (const p of phases) {
  const n = await page.getByText(p, { exact: true }).count();
  if (n === 0) throw new Error(`master hub missing phase: ${p}`);
}
step(`master hub renders all ${phases.length} phases`);
step(`hero: ${JSON.stringify((await page.locator("h1").first().textContent()).trim())}`);

// Phase 0 card -> Logic hub.
await page.getByText("Logic", { exact: true }).first().click();
await page.waitForTimeout(500);
step(`opened Logic phase`);

// Open the first topic card in the phase.
const topicCard = page.locator("button").filter({ hasText: /Gates|Boolean|Truth|Binary/i }).first();
await topicCard.click();
await page.waitForTimeout(500);
step(`opened topic: ${JSON.stringify((await page.locator("h1, h2").first().textContent()).trim())}`);

// "Mark complete" only renders on the final chapter, so page through with Next.
const markComplete = page.locator('button:has-text("Mark complete")');
const next = page.locator('button:has-text("Next")');
let hops = 0;
while ((await markComplete.count()) === 0 && hops < 40) {
  if ((await next.count()) === 0) throw new Error("no Next and no Mark complete on chapter " + hops);
  await next.first().click();
  await page.waitForTimeout(120);
  hops++;
}
if ((await markComplete.count()) === 0) throw new Error("never reached Mark complete");
step(`paged through ${hops} chapters to reach the end`);
await markComplete.first().click();
await page.waitForTimeout(700);
step("clicked Mark complete");

// Read what actually landed in localStorage.
const stored = await page.evaluate(() => window.localStorage.getItem("core-app-progress-v1"));
step(`localStorage after complete: ${stored ? stored.slice(0, 120) : "(null)"}`);

if (!stored) throw new Error("nothing persisted to localStorage");

// Reload and confirm the progress survived.
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(800);
const after = await page.evaluate(() => window.localStorage.getItem("core-app-progress-v1"));
step(`localStorage after reload: ${after ? after.slice(0, 120) : "(null)"}`);
if (after !== stored) throw new Error("progress changed across reload");

const parsed = JSON.parse(after);
const done = Object.keys(parsed.completed || {});
step(`completed topics persisted: ${JSON.stringify(done)}`);
if (done.length === 0) throw new Error("completed set is empty after reload");

await page.screenshot({ path: process.argv[3] || "/tmp/core.png", fullPage: false });
step("screenshot captured");


// ── Every widget must actually mount ───────────────────────────────────────
// The flag check above is static: it proves the metadata agrees with the
// source, not that the components render without throwing. Reference mode
// lays a whole topic out at once, so each can be opened without paging.
// Scoped per phase and given short timeouts — a locator that misses would
// otherwise sit on Playwright's 30 s default and turn a failure into a hang.
const PHASE_OF = {
  LOGIC: "Logic",
  HARDWARE: "Hardware",
  CLI: "Command Line & Operating Systems",
  PROGRAMMING: "Programming",
  WEB: "Web Fundamentals",
  NETWORKING: "Networking & Cisco",
  SECURITY: "Security & Ethical Hacking",
};
const T = { timeout: 4000 };
const sweep = await ctx.newPage();
const sweepErrors = [];
sweep.on("pageerror", (e) => sweepErrors.push(String(e)));
await sweep.addInitScript(() => {
  try {
    window.localStorage.setItem("core-app-progress-v1",
      JSON.stringify({ completed: {}, reviewItems: {}, readMode: "reference" }));
  } catch { /* private mode — sweep still runs, just in study mode */ }
});
await sweep.goto(URL, { waitUntil: "networkidle" });

let checked = 0;
const missing = [];
for (const [key, phaseTitle] of Object.entries(PHASE_OF)) {
  const titles = flags.byPhase[key] || [];
  if (!titles.length) continue;
  await sweep.getByText(phaseTitle, { exact: true }).first().click(T);
  for (const title of titles) {
    await sweep.locator("button").filter({ hasText: title }).first().click(T);
    if ((await sweep.locator("text=/🎮 Interactive/").first().count()) === 0) missing.push(title);
    checked++;
    await sweep.getByText("All topics").first().click(T);
  }
  await sweep.getByText("All phases").first().click(T).catch(async () => {
    await sweep.goto(URL, { waitUntil: "networkidle" });
  });
}
if (sweepErrors.length) {
  throw new Error("a widget threw while rendering:\n   " + sweepErrors.slice(0, 5).join("\n   "));
}
if (missing.length) {
  throw new Error("flagged interactive but rendered no widget:\n   " + missing.join("\n   "));
}
step(`every flagged topic renders a widget: ${checked} opened`);

// ── The fixed controls must actually work from the keyboard ────────────────
// The source check above proves the markup is right; this proves the result
// is operable. Tab reaches the control, Enter activates it, state changes.
await sweep.getByText("Hardware", { exact: true }).first().click(T);
await sweep.locator("button").filter({ hasText: "Storage Evolution" }).first().click(T);
const headers = sweep.locator('th button[aria-pressed]');
const headerCount = await headers.count();
if (headerCount < 2) throw new Error(`CompareGrid headers not keyboard controls (found ${headerCount})`);
const before = await headers.nth(1).getAttribute("aria-pressed");
const target = before === "true" ? headers.nth(2) : headers.nth(1);
await target.focus();
const focused = await sweep.evaluate(() => document.activeElement.tagName);
if (focused !== "BUTTON") throw new Error(`focus landed on <${focused}>, not a button`);
await sweep.keyboard.press("Enter");
if ((await target.getAttribute("aria-pressed")) !== "true") {
  throw new Error("Enter on a focused column header did not select it");
}
step("keyboard: Tab reaches a CompareGrid header, Enter selects it");
await sweep.getByText("All topics").first().click(T);

await sweep.close();

await browser.close();


if (warnings.length) {
  console.log(`\nsubresource warnings (not failures): ${warnings.length}`);
  for (const w of warnings.slice(0, 5)) console.log("   " + w);
}

console.log("\napp errors: " + (errors.length || "none"));
for (const e of errors.slice(0, 15)) console.log("   " + e);

if (errors.length) process.exitCode = 2;
else console.log("\nSMOKE TEST PASSED");
