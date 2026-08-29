---
title: Bash / Shell — language profile
layer: 08_User_Applications
section: languages
tags: [bash, zsh, sh, posix, shellcheck]
updated: 2026-05-20
---

# Bash / Shell — language profile

> The Unix lingua franca for automation. Bash is the universal default; zsh
> ships as the macOS interactive default; POSIX `sh` is the lowest-common
> denominator. **Write Bash like you'd write any other language**: with
> safety flags, quoting, and a linter.

## Shells

| Shell | Notes |
|-------|-------|
| `bash` | GNU; Linux server default |
| `zsh` | macOS default; powerful interactive features (globbing, prompts) |
| `sh` / `dash` / `ash` | POSIX-only; fast |
| `fish` | User-friendly but not POSIX |
| `nu` (nushell) | Structured-data shell |
| `xonsh` | Python + shell hybrid |
| `elvish`, `oils` | Modern alts |

## Safety preamble (Bash scripts)

```bash
#!/usr/bin/env bash
set -euo pipefail   # exit on err, unset vars are errors, pipe failures bubble
IFS=$'\n\t'         # safer word-splitting
```

`shopt -s inherit_errexit nullglob globstar` for extra hardening.

## Common idioms

| Pattern | Example |
|---------|---------|
| Quote everything | `cp -- "$src" "$dst"` |
| `--` end-of-options | `rm -- "$file"` |
| `printf` over `echo` | `printf '%s\n' "$x"` |
| Local vars in fns | `foo() { local x="$1"; ... }` |
| Heredoc | `cat <<'EOF' ... EOF` (single-quoted disables expansion) |
| Command substitution | `out="$(cmd args)"` |
| Arrays | `arr=(a b c); for x in "${arr[@]}"; do ...; done` |
| Associative arrays (bash 4+) | `declare -A m=([k]=v); echo "${m[k]}"` |
| Conditional | `[[ -f file ]] && echo yes` |
| Parameter expansion | `${var:-default}`, `${var:?msg}`, `${var%suffix}`, `${var#prefix}`, `${var//foo/bar}` |
| Subshell vs group | `(cd x && cmd)` vs `{ cmd1; cmd2; }` |
| Trap cleanup | `trap 'rm -rf "$tmp"' EXIT INT TERM` |
| Mktemp | `tmp=$(mktemp -d)` |

## Built-ins worth memorizing

| Built-in | Purpose |
|----------|---------|
| `cd` `pwd` `pushd` `popd` `dirs` | Directory stack |
| `read` | Read user input or piped line |
| `printf` `echo` | Output |
| `declare` `local` `readonly` `export` `unset` | Variables |
| `set` `shopt` `unset` | Shell options |
| `trap` | Signal handlers |
| `eval` | Re-eval string (use sparingly!) |
| `exec` | Replace shell with command (or redirect) |
| `source` / `.` | Run file in current shell |
| `getopts` | Built-in arg parsing |
| `mapfile` / `readarray` | Read file into array |
| `wait` | Wait for background jobs |
| `jobs` / `fg` / `bg` / `kill %1` | Job control |
| `[[ ... ]]` / `(( ... ))` | Modern test / arithmetic |
| `type` / `command -v` / `which` | Where is command |

## Text-processing classics

| Command | One-line use |
|---------|--------------|
| `grep -rn 'pat' path/` | Recursive search |
| `rg 'pat'` | Ripgrep (much faster) |
| `sed -i'' -e 's/old/new/g' file` | In-place edit (BSD/macOS needs `''` after `-i`) |
| `awk -F: '{print $1}' /etc/passwd` | Field-extract |
| `cut -d',' -f1,3 file.csv` | Cut columns |
| `sort -u` / `sort -k 2,2n` | Sort + uniq |
| `uniq -c` | Count duplicates (after sort) |
| `tr 'a-z' 'A-Z' < f` | Translate chars |
| `wc -l` / `-c` / `-w` | Line / byte / word count |
| `head -n 20` / `tail -n 20` / `tail -F` | First / last / follow |
| `paste -d, a.txt b.txt` | Side-by-side merge |
| `xargs -I{} cmd {}` | Argument fan-out |
| `find . -name '*.md' -print0 \| xargs -0 -I{} echo {}` | Null-safe find→xargs |
| `tee file` | Split output |
| `jq '.foo.bar'` | JSON query |
| `yq '.foo.bar'` | YAML query |
| `dasel` / `gron` | Other structured-data tools |

## Networking

| Command | Use |
|---------|-----|
| `curl -sSL url` | Fetch quietly + follow redirects |
| `curl -fsSL url \| sh` | (Risky) install pattern |
| `wget -q url` | Simpler download |
| `ssh user@host` / `ssh -L 8080:remote:80 user@host` | Remote shell + tunnels |
| `scp file user@host:/path` | Copy |
| `rsync -avP src/ dest/` | Mirror with progress |
| `nc -zv host port` | Port check |
| `dig +short example.com` | DNS query |

## Tools you'll want

| Tool | Use |
|------|-----|
| `shellcheck script.sh` | Linter — *use it always* |
| `shfmt -w -i 2 script.sh` | Formatter |
| `bats-core` | Test framework for shell |
| `direnv` | Per-dir env vars |
| `entr` | Re-run on file change |
| `parallel` (GNU) | Parallelize commands |
| `pv` | Pipe progress meter |
| `fzf` | Fuzzy filter for terminal |
| `bat` / `eza` / `fd` / `rg` / `dust` / `procs` / `bottom` | Modern coreutils replacements |
| `tmux` / `screen` | Multiplexer |
| `nohup`, `disown`, `setsid` | Background detach |
| `at`, `cron`, `systemd-timer` | Scheduling |
| `flock` | File-lock helper |
| `dialog`, `whiptail`, `gum` | TUI for scripts |
| `gum` (Charm) | Stylish prompts |

## Common gotchas

- **`for x in $(cmd)`** word-splits on `IFS`. Use `while IFS= read -r line; do ... done < <(cmd)`.
- **`$*` vs `$@`** — `"$@"` is "preserves each arg quoted"; **always quote it**.
- **`set -e`** doesn't catch all errors (subshells, conditionals). Combine with `pipefail` + careful structure.
- **`==` only in `[[ ]]`** — POSIX `[` uses `=`.
- **`expr` is dead** — use `$((..))` for arithmetic.
- **Backticks** — old; prefer `$(...)`.
- **`/tmp` is shared** — use `mktemp -d`.
- **`shopt -s nocaseglob`** vs explicit case — be explicit.
- **macOS BSD vs GNU** divergence: `sed -i` differs; install `coreutils`, `gnu-sed`, `gnu-tar` via Homebrew if needed.
- **`source` vs subshell** — `./script.sh` runs in subshell (env doesn't propagate up); `source script.sh` modifies your shell.

## Cross-references
- All sysadmin-y CLIs → [05_OS_Kernel/man_pages](../../05_OS_Kernel/man_pages/INDEX.md) and per-layer `man_pages/`
- Embedded Bash for flash/test → [18_Embedded_Systems/languages](../../18_Embedded_Systems/languages/INDEX.md)
