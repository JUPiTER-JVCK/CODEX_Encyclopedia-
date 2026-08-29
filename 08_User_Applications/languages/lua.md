---
title: Lua — language profile
layer: 08_User_Applications
section: languages
tags: [lua, luajit, neovim, nginx, openresty]
updated: 2026-05-20
---

# Lua — language profile

> Tiny, embeddable, fast. Lives inside: Neovim, Wireshark, Nginx (OpenResty),
> Redis (scripts), World of Warcraft, Roblox, many game engines, FreeBSD's
> `pkg`. The whole stdlib fits on a page.

## Implementations

| Impl | Notes |
|------|-------|
| Reference Lua | 5.1 / 5.2 / 5.3 / 5.4 — each version has small breaking changes |
| LuaJIT | Tracing JIT; mostly 5.1 compat + some 5.2 features; very fast |
| Luau (Roblox) | Type system, sandboxed; growing ecosystem |
| Moonscript | Sugar that compiles to Lua |
| Fennel | Lisp that compiles to Lua |

## Toolchain

| Command | Use |
|---------|-----|
| `lua` / `lua5.4` | Run a script |
| `luajit` | Run via LuaJIT |
| `lua -e 'print(1+1)'` | Inline |
| `lua -i script.lua` | Interactive after running |
| `luarocks install pkg` | Package manager |
| `luarocks make` | Build from rockspec |
| `busted` | Test runner |
| `stylua` | Formatter (Rust) |
| `luacheck` | Linter |
| `lua-language-server` | LSP (also typing extension) |
| `selene` | Modern linter (Rust) |
| `nvim --headless -u init.lua` | Run Neovim's lua |

## Quick syntax tour

```lua
-- comments
--[[ multi-line
     comment ]]

local x = 10                 -- prefer `local`; globals are usually a mistake
local function add(a, b) return a + b end

-- tables = the only data structure (array + hash unified)
local t = {1, 2, 3, name = "alice", [42] = "k"}
print(t[1], t.name, t[42])

-- 1-indexed!
for i = 1, #t do print(i, t[i]) end

-- ipairs (array part) vs pairs (all keys)
for i, v in ipairs(t) do ... end
for k, v in pairs(t) do ... end

-- string concat
local s = "hello, " .. "world"

-- multiple return + multiple assign
local a, b = 1, 2
local function pair() return 1, 2 end
local x, y = pair()

-- "method" call (passes self implicitly)
local o = {n = 0}
function o:inc(by) self.n = self.n + (by or 1) end
o:inc()

-- metatables = operator overload + inheritance
local Vector = {}
Vector.__index = Vector
function Vector.new(x, y) return setmetatable({x=x, y=y}, Vector) end
function Vector:length() return math.sqrt(self.x^2 + self.y^2) end
Vector.__add = function(a, b) return Vector.new(a.x+b.x, a.y+b.y) end

-- pcall for "try"
local ok, err = pcall(function() error("oops") end)
```

## Stdlib at a glance

| Module | When |
|--------|------|
| `string` | `string.format`, `gsub`, `find`, `match`, `sub`, `byte`, `char`, `len`, `lower`, `upper`, `rep` |
| `table` | `insert`, `remove`, `concat`, `sort`, `unpack` (5.1) / `table.unpack` (5.2+) |
| `math` | `sqrt`, `pi`, `floor`, `ceil`, `random`, `min`, `max`, `huge` |
| `io` | `io.read`, `io.write`, `io.open`, `io.lines`, `io.close` |
| `os` | `os.time`, `os.date`, `os.getenv`, `os.execute`, `os.exit` |
| `coroutine` | `coroutine.create`, `resume`, `yield`, `wrap`, `status` |
| `debug` | `debug.traceback`, `debug.getinfo` |
| `package` | `package.path` (Lua), `package.cpath` (C), `require` |

Lua patterns ≠ regex: `%a` letter, `%d` digit, `%w` alnum, `%s` whitespace, `+`, `-`, `*`, `?`, `^`, `$`, character classes `[...]`. No alternation `|`.

## Idioms

- **`local` everywhere** — globals leak across files.
- **One return value** unless you really mean multi-return; helps avoid surprises in expressions.
- **`or` for defaults**: `local n = opts.count or 1`.
- **Tables as namespaces**: `local M = {}; function M.foo() end; return M`.
- **`require` cache**: `package.loaded[name] = nil` to force reload.
- **Coroutines** for cooperative multitasking — generators, async-ish flows.
- **Length operator `#`** for arrays without holes; otherwise iterate.

## Common gotchas

- **1-indexed arrays.** All of them. Always.
- **`nil` in arrays creates holes** — `#t` may return a smaller-than-expected length.
- **`nil` is falsy; everything else (including `0` and `""`) is truthy.**
- **No `continue`** — use a `repeat … until true` block or `goto`.
- **`global` typos silently create new globals** (in vanilla Lua); use `strict.lua` or LSP warnings.
- **`==` is value/identity** based on type; `t1 == t2` is reference equality for tables unless `__eq` set.
- **String immutability**: every modification allocates. Use `table.concat({...})` to build big strings.
- **Integer division (5.3+)**: `//`. Float `/`. Older: `math.floor(a/b)`.
- **LuaJIT** is 5.1 + some 5.2 — code targeting 5.3+ may not run on it.

## Embedding contexts

| Context | What you'll write |
|---------|------------------|
| Neovim | `~/.config/nvim/init.lua`; `vim.opt`, `vim.keymap`, `vim.lsp`, plugin DSLs (`lazy.nvim`) |
| Nginx (OpenResty) | `content_by_lua_block`, `init_by_lua_file`; `ngx.*` API |
| Redis | `EVAL "redis.call(...)" 0` — sandboxed; no I/O |
| Wireshark | Dissectors via `Proto`, `ProtoField`, `tap` |
| Roblox (Luau) | Game scripts, types, async via tasks |
| LÖVE | `love.load`, `love.update(dt)`, `love.draw()` |
| Defold / Solar2D / Pico-8 | Game engines |

## Cross-references
- Lua in Neovim (config language) → [08/man_pages](../man_pages/INDEX.md)
- Lua in Nginx → [13_Network_Application/topics](../../Network/13_Network_Application/topics/INDEX.md)
