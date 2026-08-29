---
title: "Shell & Terminal Multiplexer Commands"
layer: 08_User_Applications
section: man_pages
tags: [bash, zsh, fish, tmux, screen, shell, terminal, multiplexer, man-section-1]
updated: 2026-05-21
---

# Shell & Terminal Multiplexer Commands

> Interactive shells and terminal multiplexers — the daily driver tools.

---

## bash — Bourne Again Shell

### Synopsis

```
bash [options] [script] [args…]
```

### Description

The default shell on most Linux distributions. POSIX sh superset with arrays,
brace expansion, process substitution, and programmable completion.

### Key startup files

```
  Login shell:          /etc/profile → ~/.bash_profile → ~/.bash_login → ~/.profile
  Interactive non-login: ~/.bashrc
  Non-interactive:       $BASH_ENV (if set)

  Typical pattern: ~/.bash_profile sources ~/.bashrc so settings work everywhere.
```

### Essential features

| Feature | Syntax | Example |
|---------|--------|---------|
| Variable | `$VAR` / `${VAR}` | `echo "Hello $USER"` |
| Array | `arr=(a b c)` | `echo ${arr[1]}` → `b` |
| Parameter expansion | `${var:-default}` | `${PORT:-8080}` |
| Command substitution | `$(cmd)` | `files=$(ls)` |
| Process substitution | `<(cmd)` | `diff <(sort a) <(sort b)` |
| Brace expansion | `{a,b,c}` | `touch file_{1..10}.txt` |
| Here-string | `<<<` | `grep foo <<< "$data"` |
| Arithmetic | `$(( ))` | `echo $((2**10))` → `1024` |
| Test | `[[ ]]` | `[[ -f file && $x -gt 5 ]]` |

### Key options

| Flag | Purpose |
|------|---------|
| `-c 'cmd'` | Execute a command string |
| `-x` | Print commands as executed (debug) |
| `-e` | Exit on first error |
| `-u` | Treat unset variables as errors |
| `-o pipefail` | Pipeline fails if any command fails |
| `--norc` | Don't read `~/.bashrc` |

### Examples

```bash
# Safe script header
#!/usr/bin/env bash
set -euo pipefail

# Iterate with glob
for f in *.log; do
    [[ -f "$f" ]] && gzip "$f"
done

# Associative array (bash 4+)
declare -A config
config[host]="localhost"
config[port]="5432"
echo "Connecting to ${config[host]}:${config[port]}"
```

---

## zsh — Z Shell

### Synopsis

```
zsh [options] [script] [args…]
```

### Description

Feature-rich shell with superior interactive features: better globbing,
spelling correction, plugin ecosystem (Oh My Zsh, zinit, antigen).
Default on macOS since Catalina.

### Killer features over bash

| Feature | Syntax |
|---------|--------|
| Recursive glob | `**/*.py` (no `shopt -s globstar` needed) |
| Glob qualifiers | `*.log(m-1)` — log files modified in last day |
| Right-side prompt | `RPROMPT='%T'` |
| Spelling correction | `setopt CORRECT` |
| Shared history | `setopt SHARE_HISTORY` |
| Extended globbing | `^*.o` (negate), `(*.c\|*.h)` |
| Named directories | `hash -d proj=~/projects` → `cd ~proj` |
| Suffix aliases | `alias -s py=python3` → typing `script.py` runs it |

### Configuration

```
  ~/.zshenv    — always read (even non-interactive)
  ~/.zprofile  — login shells
  ~/.zshrc     — interactive shells (put most config here)
  ~/.zlogin    — after .zshrc, login shells
  ~/.zlogout   — on logout
```

---

## fish — Friendly Interactive Shell

### Synopsis

```
fish [-c cmd] [script]
```

### Description

User-friendly shell with syntax highlighting, autosuggestions, and web-based
configuration. Not POSIX-compatible (intentionally).

### Key differences from bash/zsh

| Feature | fish syntax | bash equivalent |
|---------|------------|-----------------|
| Variable | `set name value` | `name=value` |
| Function | `function greet; echo hi; end` | `greet() { echo hi; }` |
| Conditional | `if test -f file; ...; end` | `if [[ -f file ]]; then ...; fi` |
| Loop | `for f in *.txt; ...; end` | `for f in *.txt; do ...; done` |
| Command sub | `(cmd)` | `$(cmd)` |
| Environment | `set -gx PATH /usr/bin $PATH` | `export PATH="/usr/bin:$PATH"` |

---

## tmux — terminal multiplexer

### Synopsis

```
tmux [new-session] [-s name]
tmux attach [-t name]
tmux list-sessions
```

### Description

Multiplexes a single terminal into multiple windows and panes. Sessions
persist after disconnection (essential for remote work over SSH).

### Architecture

```
  ┌── tmux server ──────────────────────────┐
  │                                          │
  │  Session "dev"                           │
  │  ├── Window 0: "editor"                  │
  │  │   ├── Pane 0 (vim)     ← active       │
  │  │   └── Pane 1 (shell)                  │
  │  ├── Window 1: "build"                   │
  │  │   └── Pane 0 (make -j8)              │
  │  └── Window 2: "logs"                   │
  │      └── Pane 0 (tail -f ...)           │
  │                                          │
  │  Session "deploy"                        │
  │  └── Window 0: "ssh prod"               │
  └──────────────────────────────────────────┘
```

### Key bindings (default prefix: `Ctrl+b`)

| Keys | Action |
|------|--------|
| `Ctrl+b c` | New window |
| `Ctrl+b ,` | Rename window |
| `Ctrl+b n` / `p` | Next / previous window |
| `Ctrl+b 0`–`9` | Jump to window N |
| `Ctrl+b %` | Split pane vertically |
| `Ctrl+b "` | Split pane horizontally |
| `Ctrl+b o` | Cycle through panes |
| `Ctrl+b z` | Toggle pane zoom (full screen) |
| `Ctrl+b x` | Kill pane |
| `Ctrl+b d` | Detach session |
| `Ctrl+b [` | Copy mode (scroll, search, select) |
| `Ctrl+b :` | Command prompt |

### Examples

```bash
# New named session
tmux new-session -s dev

# Detach and re-attach
# (press Ctrl+b d to detach)
tmux attach -t dev

# Split and run commands
tmux split-window -h 'htop'

# Send keys to another pane (scripting)
tmux send-keys -t dev:0.1 'make test' Enter

# Useful .tmux.conf settings
set -g mouse on
set -g history-limit 50000
set -g default-terminal "tmux-256color"
bind | split-window -h
bind - split-window -v
```

---

## screen — GNU terminal multiplexer (legacy)

### Synopsis

```
screen [-S name] [-r name] [-ls]
```

### Description

Older terminal multiplexer, still found on minimal servers where tmux isn't
installed. Same concept: persistent sessions, multiple windows.

### Key bindings (prefix: `Ctrl+a`)

| Keys | Action |
|------|--------|
| `Ctrl+a c` | New window |
| `Ctrl+a n` / `p` | Next / previous |
| `Ctrl+a "` | Window list |
| `Ctrl+a S` | Split horizontal |
| `Ctrl+a |` | Split vertical |
| `Ctrl+a d` | Detach |
| `Ctrl+a k` | Kill window |
| `Ctrl+a [` | Copy/scroll mode |

### Examples

```bash
# Create named session
screen -S deploy

# List sessions
screen -ls

# Reattach
screen -r deploy

# Detach a session someone else left attached
screen -dr deploy
```

---

## Cross-links

- Text processing → [text_processing.md](text_processing.md)
- Network tools → [network_tools.md](network_tools.md)
- Bash language profile → [../languages/bash.md](../languages/bash.md)
