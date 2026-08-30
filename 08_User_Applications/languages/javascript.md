---
title: JavaScript — language profile
layer: 08_User_Applications
section: languages
tags: [javascript, js, node, npm, pnpm, bun, deno]
updated: 2026-05-20
---

# JavaScript — language profile

> ECMAScript-the-spec runs in browsers, Node.js, Deno, Bun, Cloudflare Workers,
> embedded engines, and beyond. Modern JS = ES2015+. For statically-typed JS see
> [typescript.md](typescript.md).

## Runtimes

| Runtime | Notes |
|---------|-------|
| **Node.js** | Most common server-side; CommonJS + ESM; V8 engine |
| **Bun** | Fast all-in-one (runtime + bundler + test); JavaScriptCore |
| **Deno** | TS-first; secure-by-default; npm: + jsr: imports |
| **Browsers** | V8 (Chrome/Edge), SpiderMonkey (Firefox), JavaScriptCore (Safari) |
| **Workers** | Cloudflare Workers, Vercel Edge, Deno Deploy — V8 isolate |
| **Embedded** | Hermes (React Native), QuickJS, Espruino, Moddable XS |

## Package managers (for Node)

| Tool | Notes |
|------|-------|
| `npm` | Default; lockfile `package-lock.json` |
| `pnpm` | Fast, disk-efficient (hardlinks); strict |
| `yarn` (1 / 3+) | Classic v1 or modern berry (PnP) |
| `bun` | Fastest install, drop-in replacement for npm |
| `npx`/`pnpx`/`bunx` | Execute a package without global install |

## CLI essentials

| Command | Purpose |
|---------|---------|
| `npm init -y` | Scaffold `package.json` |
| `npm install pkg` / `npm i pkg` | Install runtime dep |
| `npm install -D pkg` | Dev dep |
| `npm install -g pkg` | Global install |
| `npm uninstall pkg` | Remove |
| `npm update` | Update within semver range |
| `npm outdated` | Show updatable |
| `npm run <script>` | Run script from `package.json` |
| `npm test` / `npm start` | Built-in script shortcuts |
| `npm pack` | Tarball preview |
| `npm publish` | Publish to registry |
| `npm audit` | Vuln scan |
| `npm ci` | Clean install from lockfile (CI-safe) |
| `node script.js` | Run a file |
| `node --inspect script.js` | Debug |
| `node --watch script.js` | Re-run on change (Node 18+) |
| `node --experimental-vm-modules ...` | ESM in some contexts |
| `bun run script.js` / `bun test` | Bun runtime |
| `deno run --allow-net script.ts` | Deno (permissions-explicit) |

## Build / bundling / dev servers

| Tool | Use |
|------|-----|
| `vite` | Fast modern bundler (dev + build) |
| `webpack` | Classic, deeply configurable |
| `esbuild` | Ultra-fast bundler |
| `rollup` | Library bundling (ESM, tree-shaking) |
| `parcel` | Zero-config |
| `turbopack` | Vercel; Webpack successor in some places |
| `rspack` | Rust port of Webpack |
| `tsc` / `swc` / `babel` | Transpilers |
| `tsx` | Run `.ts` directly (`tsx script.ts`) |

## Test runners

| Tool | Use |
|------|-----|
| `vitest` | Vite-native, Jest-compatible API |
| `jest` | Classic |
| `node --test` | Built-in test runner (Node 18+) |
| `mocha` + `chai` | Older standard |
| `playwright`, `cypress`, `puppeteer` | E2E browser |
| `testing-library` | DOM testing utilities (React/Vue/Svelte) |

## Linting / formatting

| Tool | Use |
|------|-----|
| `eslint` | Linter (`.eslintrc` / `eslint.config.js`) |
| `prettier` | Formatter (`.prettierrc`) |
| `biome` | Single-tool replacement for eslint + prettier (Rust-based) |
| `oxlint` | Faster eslint alternative |
| `husky` + `lint-staged` | Pre-commit hooks |

## Stdlib / built-ins (modern JS)

| Area | Built-ins |
|------|-----------|
| Collections | `Array`, `Object`, `Map`, `Set`, `WeakMap`, `WeakSet` |
| Iteration | `for...of`, `for...in`, spread, destructuring |
| Async | `Promise`, `async`/`await`, `Promise.all/allSettled/race/any`, `AsyncIterator` |
| Strings | template literals, `String.prototype.{padStart, replaceAll, at, matchAll}` |
| Numbers | `Number.isInteger/isFinite`, `BigInt`, `Math.{trunc, sign, log2, hypot}` |
| Modules | `import`/`export`, dynamic `import()` |
| Iteration helpers | `Array.from`, `Array.of`, `flat`, `flatMap`, `Object.{keys,values,entries,fromEntries}` |
| Regex | `/.../g/i/m/s/u/y` flags, named groups `(?<name>...)`, lookbehind |
| Errors | `try/catch/finally`, `.cause`, custom `class X extends Error` |
| Optional chaining | `obj?.a?.b?.()`, nullish coalescing `??`, logical assign `??=` `\|\|=` `&&=` |
| Top-level await | In ESM only |
| Classes | private `#field`, static blocks, decorators (stage 3) |

## Web platform (browser)

| API | Use |
|-----|-----|
| `fetch()` | HTTP requests (also in modern Node) |
| `URL` / `URLSearchParams` | URL handling |
| `WebSocket` | Sockets |
| `Worker` / `SharedWorker` / `ServiceWorker` | Threads / cache / offline |
| `IndexedDB` / `localStorage` / `sessionStorage` | Client storage |
| `Intl` | i18n (DateTimeFormat, NumberFormat, Collator) |
| `Performance` | High-res timing |
| `Streams` (`ReadableStream`, `TransformStream`) | Streaming |
| `crypto.subtle` | Web Crypto |

## Common 3rd party (general)

| Lib | Use |
|-----|-----|
| `axios` / `ofetch` / `ky` / native `fetch` | HTTP clients |
| `lodash` / `lodash-es` / `radash` | Utility libs |
| `date-fns` / `dayjs` / `luxon` / native `Temporal` (proposal) | Dates |
| `zod` / `valibot` / `arktype` / `yup` | Schema validation |
| `nanoid` / `uuid` | IDs |
| `commander` / `yargs` / `clipanion` | CLI parsing |
| `pino` / `winston` / `bunyan` | Logging |
| `bullmq` / `bullmq-pro` | Background jobs (Redis) |
| `socket.io` | WebSocket abstraction |

## Framework families (browser)

- **React** ecosystem: Next.js, Remix, Vite + React
- **Vue** ecosystem: Nuxt, Vite + Vue
- **Svelte** ecosystem: SvelteKit
- **Solid**, **Qwik**, **Astro**, **Lit**, **Preact**
- **Angular** (TypeScript-first)

## Idioms

- **Strict mode** (`"use strict"`) is default in ESM modules.
- **`const` everywhere**, `let` when reassignment is needed, never `var`.
- **Destructuring**: `const { a, b = 0 } = obj;` `const [first, ...rest] = arr;`
- **Spread**: `const next = { ...prev, count: prev.count + 1 };`
- **Optional chaining** + **nullish coalescing**: `user?.profile?.name ?? "anon"`.
- **Tagged template literals** for DSLs.
- **`async`/`await`** over raw promise chaining.
- **Avoid `==`** — always `===` / `!==`.
- **`Array.prototype.{map, filter, reduce, some, every, find, includes}`**.

## Common gotchas

- **`this` binding**: arrow functions inherit; regular functions get a new `this`. Use arrow functions for callbacks.
- **`==`** coerces — `0 == ''` is true.
- **Floating-point**: `0.1 + 0.2 !== 0.3`. Use `BigInt` for integers, `Decimal.js` for money.
- **Reference equality** for objects: `{} === {}` is false.
- **Mutability**: `Array.prototype.sort` mutates; use `.toSorted()` (ES2023) or `[...a].sort()`.
- **`forEach` doesn't await**: use `for...of` or `Promise.all(a.map(...))`.
- **`JSON.stringify`** drops `undefined`, `Symbol`, `Function`; throws on cycles.
- **Module systems**: CJS (`require`) vs ESM (`import`). Mixing requires careful interop.
- **Hoisting**: `var` hoists initialized to `undefined`; `let`/`const` hoist but TDZ.

## Cross-references
- TypeScript profile → [typescript.md](typescript.md)
- V8 / runtime internals → [07_Runtime_Environment/topics](../../07_Runtime_Environment/topics/INDEX.md)
- Web frameworks → [topics/INDEX.md](../topics/INDEX.md)
