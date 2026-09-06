import { chromium } from "playwright";
import { existsSync } from "node:fs";

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

await browser.close();

if (warnings.length) {
  console.log(`\nsubresource warnings (not failures): ${warnings.length}`);
  for (const w of warnings.slice(0, 5)) console.log("   " + w);
}

console.log("\napp errors: " + (errors.length || "none"));
for (const e of errors.slice(0, 15)) console.log("   " + e);

if (errors.length) process.exitCode = 2;
else console.log("\nSMOKE TEST PASSED");
