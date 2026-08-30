---
title: TypeScript — language profile
layer: 08_User_Applications
section: languages
tags: [typescript, ts, tsc, swc]
updated: 2026-05-20
---

# TypeScript — language profile

> Strict superset of JavaScript with structural types. Compile-time only — the
> runtime is JS. Pair with [javascript.md](javascript.md) for the runtime side.

## Compiler / runner

| Command | Purpose |
|---------|---------|
| `tsc` | Compile per `tsconfig.json` |
| `tsc --init` | Generate `tsconfig.json` |
| `tsc --noEmit` | Type-check only (no `.js` output) |
| `tsc -p tsconfig.build.json` | Use specific config |
| `tsc --watch` / `-w` | Re-check on file changes |
| `tsx script.ts` | Execute TS directly (esbuild-based) |
| `ts-node script.ts` | Older TS executor |
| `bun run script.ts` | Bun runs TS natively |
| `deno run script.ts` | Deno runs TS natively |
| `swc` / `esbuild` / `babel + @babel/preset-typescript` | Transpile without type-checks (fast for builds) |

## tsconfig essentials (strict starter)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "verbatimModuleSyntax": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

Add `"jsx": "preserve"` (Next/Remix) or `"jsx": "react-jsx"` (Vite + React).

## Tooling

| Tool | Use |
|------|-----|
| `tsc` | Reference type-checker |
| `tsserver` / `vscode-typescript` | LSP / editor support |
| `eslint` + `@typescript-eslint` | Lint TS |
| `biome` | Linter + formatter (fast Rust impl) |
| `prettier` | Format |
| `vitest` / `jest` / `bun test` | Testing |
| `tsx`, `ts-node`, `nodemon`, `tsup`, `tsdown` | Run / bundle |
| `attw` (Are The Types Wrong) | Validate library type exports |
| `publint` | Validate package.json for publishing |
| `api-extractor` | Generate API docs |

## Type system primer

| Construct | Example |
|-----------|---------|
| Primitives | `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined`, `void`, `never`, `unknown`, `any` |
| Union | `type ID = string \| number;` |
| Intersection | `type AB = A & B;` |
| Literal types | `type Method = "GET" \| "POST";` |
| Tuple | `type Pair = [number, string];` (`[number, ...string[]]` rest) |
| Generic | `function id<T>(x: T): T { return x; }` |
| Mapped types | `type Partial<T> = { [K in keyof T]?: T[K] };` |
| Conditional | `T extends U ? X : Y` |
| Template literal types | `` `on${Capitalize<E>}` `` |
| `keyof T` / `typeof v` | Static introspection |
| `Pick<T,K>` / `Omit<T,K>` / `Record<K,V>` / `ReturnType<F>` / `Parameters<F>` / `Awaited<P>` / `NonNullable<T>` | Utility types |
| `as const` | Narrow to literal types |
| `satisfies` | Conform without widening type |
| Discriminated unions | `type R = { ok: true; v: T } \| { ok: false; e: Error }` |
| Enums (avoid) | Prefer `const enum` or union of literals |
| Type-only imports | `import type { T } from "./x";` |
| `declare module 'x' { ... }` | Augment 3rd-party types |
| Branded types | `type UserId = string & { __brand: "UserId" }` |

## Common patterns

- **Result type**: `type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };`
- **Exhaustive switch**: assign discriminant to `never` in default to catch unhandled cases.
- **Type narrowing**: type predicates (`is`), `in` operator, `typeof`, `instanceof`.
- **`unknown` over `any`** — forces a check before use.
- **Don't disable strict** — fix the type instead.
- **Schema validation** (`zod`, `valibot`, `arktype`) for runtime + types.

## Common gotchas

- **Erased at runtime** — no type info exists post-compile; reflection isn't free.
- **`any` is contagious** — leaks through generics, defeats safety.
- **`@ts-ignore` vs `@ts-expect-error`** — prefer `expect-error`; it surfaces if the error goes away.
- **Excess property checks** apply to object literals but not to variables.
- **Index signatures** can mask typos: `type T = { [k: string]: number };` — `t.notHere` is `number | undefined` (with `noUncheckedIndexedAccess`) or `number` (without).
- **Class properties** without init need `!` (definite assignment) or `?` (optional).
- **Top-level `await`** requires ESM.
- **`import "./file"`** vs `"./file.js"` — `Bundler`/`NodeNext` moduleResolution change requirements.

## Cross-references
- JS runtime side → [javascript.md](javascript.md)
- TS for full-stack frameworks → [topics/INDEX.md](../topics/INDEX.md)
