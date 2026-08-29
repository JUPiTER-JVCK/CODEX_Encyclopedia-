---
title: "Text Processing & File Search Commands"
layer: 08_User_Applications
section: man_pages
tags: [find, fd, grep, rg, awk, sed, cut, tr, jq, xargs, text, search, man-section-1]
updated: 2026-05-21
---

# Text Processing & File Search Commands

> The Unix text-processing pipeline: find files, search content, transform data.

---

## find — search for files in a directory hierarchy

### Synopsis

```
find [path…] [expression]
```

### Description

Recursively walks a directory tree, evaluating tests and actions on each
file/directory. Powerful but the syntax takes getting used to.

### Key tests

| Test | Purpose |
|------|---------|
| `-name '*.log'` | Filename glob (case-sensitive) |
| `-iname '*.LOG'` | Case-insensitive |
| `-type f` / `-type d` | Regular file / directory |
| `-size +100M` | Larger than 100 MB |
| `-mtime -7` | Modified within last 7 days |
| `-mmin -30` | Modified within last 30 minutes |
| `-newer ref` | Newer than reference file |
| `-user root` | Owned by user |
| `-perm -644` | At least these permission bits |
| `-empty` | Empty files or directories |
| `-maxdepth N` | Limit recursion depth |

### Key actions

| Action | Purpose |
|--------|---------|
| `-print` | Print path (default) |
| `-print0` | Null-terminated (for `xargs -0`) |
| `-delete` | Delete matched files |
| `-exec cmd {} \;` | Run cmd on each match |
| `-exec cmd {} +` | Run cmd with batched args (faster) |
| `-execdir cmd {} \;` | Execute in the file's directory |

### Examples

```bash
# Find large log files modified in the last 7 days
find /var/log -name '*.log' -size +50M -mtime -7

# Delete .pyc files
find . -name '*.pyc' -delete

# Find and chmod all directories to 755, files to 644
find /var/www -type d -exec chmod 755 {} +
find /var/www -type f -exec chmod 644 {} +

# Null-safe pipeline for filenames with spaces
find . -name '*.txt' -print0 | xargs -0 grep -l 'TODO'
```

---

## fd — simple, fast alternative to find

### Synopsis

```
fd [options] [pattern] [path…]
```

### Description

Rust-based `find` replacement. Sensible defaults: regex, ignores `.git` and
`.gitignore`'d files, colorized output, parallel execution.

### Examples

```bash
# Find all .rs files
fd -e rs

# Find files matching a regex
fd 'test_.*\.py$'

# Execute a command on each result
fd -e log -x gzip {}

# Include hidden and gitignored files
fd -HI 'config'
```

---

## grep — search file contents

### Synopsis

```
grep [-riwnl] [-E|-P] [-e pattern] [-f file] [pattern] [file…]
```

### Description

Searches for lines matching a pattern. Supports basic (`-G`), extended (`-E`),
and Perl-compatible (`-P`) regular expressions.

### Key Options

| Flag | Purpose |
|------|---------|
| `-r` | Recursive |
| `-i` | Case-insensitive |
| `-w` | Whole word match |
| `-n` | Show line numbers |
| `-l` | Filenames only (list matches) |
| `-L` | Filenames that don't match |
| `-c` | Count matches per file |
| `-v` | Invert match |
| `-A N` / `-B N` / `-C N` | After / before / context lines |
| `-E` | Extended regex (same as `egrep`) |
| `-P` | Perl regex (lookahead, `\d`, etc.) |
| `-o` | Only the matching part |
| `--include='*.py'` | Filter filenames in recursive search |
| `--exclude-dir=node_modules` | Skip directories |

### Examples

```bash
# Recursive search for a function, Python files only
grep -rn --include='*.py' 'def process_request' .

# Count TODO/FIXME in a project
grep -rci 'TODO\|FIXME' src/

# Perl regex: extract IP addresses
grep -oP '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}' access.log

# Context: 3 lines around each match
grep -rn -C 3 'PANIC' /var/log/
```

---

## rg (ripgrep) — fast recursive search

### Synopsis

```
rg [options] pattern [path…]
```

### Description

Rust-based `grep` replacement. Respects `.gitignore`, searches in parallel,
handles binary files, supports PCRE2. Usually 2–10× faster than `grep -r`.

### Examples

```bash
# Basic search (recursive by default)
rg 'fn main'

# Only Rust files, with file type filter
rg -t rust 'unsafe'

# Fixed string (no regex interpretation)
rg -F 'map[string]interface{}'

# JSON output (for tooling)
rg --json 'TODO'

# Replace (preview — doesn't modify files)
rg 'old_name' -r 'new_name'
```

---

## awk — pattern scanning and processing

### Synopsis

```
awk 'pattern { action }' [file…]
awk -F separator 'program' [file…]
```

### Description

Line-oriented data processor. Each line is split into fields (`$1`, `$2`, …).
Powerful for columnar data, log parsing, and quick calculations.

### Built-in variables

| Var | Purpose |
|-----|---------|
| `$0` | Entire line |
| `$1`…`$NF` | Fields 1 through last |
| `NR` | Record (line) number |
| `NF` | Number of fields |
| `FS` | Field separator (default: whitespace) |
| `OFS` | Output field separator |
| `RS` | Record separator (default: newline) |

### Examples

```bash
# Print the 2nd column
awk '{print $2}' data.txt

# Sum a column
awk '{sum += $3} END {print sum}' sales.csv

# Filter: lines where column 5 > 1000
awk '$5 > 1000' report.txt

# Custom separator (CSV)
awk -F, '{print $1, $3}' data.csv

# Reformat /etc/passwd
awk -F: '{printf "%-20s UID=%-5s Shell=%s\n", $1, $3, $7}' /etc/passwd

# Multi-rule: header + data
awk 'NR==1 {print "Name", "Score"; next} {print $1, $2*100}' grades.txt
```

---

## sed — stream editor

### Synopsis

```
sed [-i[suffix]] [-E] 'command' [file…]
```

### Description

Applies editing commands to a text stream line by line. Most common use:
find-and-replace with regex.

### Key commands

| Command | Purpose |
|---------|---------|
| `s/old/new/` | Substitute first match |
| `s/old/new/g` | Substitute all matches |
| `s/old/new/gi` | Case-insensitive (GNU) |
| `d` | Delete line |
| `p` | Print line |
| `a\text` | Append text after line |
| `i\text` | Insert text before line |
| `c\text` | Replace entire line |
| `y/abc/xyz/` | Transliterate (like `tr`) |

### Examples

```bash
# Replace in-place (with backup)
sed -i.bak 's/localhost/0.0.0.0/g' config.yaml

# Delete blank lines
sed '/^$/d' file.txt

# Print only lines 10-20
sed -n '10,20p' file.txt

# Insert a line after every #include
sed '/^#include/a #include "debug.h"' main.c

# Multiple commands
sed -e 's/foo/bar/g' -e '/^#/d' config
```

---

## cut / tr — column extraction and character translation

### cut

```bash
# Tab-delimited: extract fields 1 and 3
cut -f1,3 data.tsv

# Character positions 1-10
cut -c1-10 file.txt

# CSV: field 2
cut -d, -f2 data.csv
```

### tr

```bash
# Lowercase to uppercase
echo "hello" | tr 'a-z' 'A-Z'

# Delete characters
echo "he11o w0rld" | tr -d '0-9'

# Squeeze repeated spaces
echo "too   many   spaces" | tr -s ' '

# Replace newlines with commas
cat list.txt | tr '\n' ','
```

---

## jq — JSON processor

### Synopsis

```
jq [options] 'filter' [file…]
```

### Description

Command-line JSON processor. Parses, queries, and transforms JSON with a
concise filter language.

### Essential filters

| Filter | Purpose |
|--------|---------|
| `.` | Identity (pretty-print) |
| `.key` | Object field |
| `.[]` | Iterate array |
| `.[0]` | Array index |
| `.key1.key2` | Nested access |
| `select(.age > 30)` | Filter elements |
| `map(.name)` | Transform each element |
| `length` | Array/string/object length |
| `keys` | Object keys |
| `@csv` / `@tsv` | Format as CSV/TSV |
| `{name, age}` | Construct object |
| `// "default"` | Alternative (null coalescing) |

### Examples

```bash
# Pretty-print
cat data.json | jq .

# Extract nested field
curl -s https://api.github.com/repos/jqlang/jq | jq '.stargazers_count'

# Filter array of objects
jq '.users[] | select(.active == true) | .email' users.json

# Transform: extract + reshape
jq '[.items[] | {name: .title, price: .cost}]' catalog.json

# CSV output
jq -r '.[] | [.name, .age] | @csv' people.json
```

---

## xargs — build and execute command lines from stdin

### Synopsis

```
xargs [-0] [-I {}] [-P N] [-n N] command [initial-args]
```

### Description

Reads items from stdin and passes them as arguments to a command. Essential
for connecting `find`/`grep` output to actions.

### Key Options

| Flag | Purpose |
|------|---------|
| `-0` | Null-delimited input (pair with `find -print0`) |
| `-I {}` | Replace `{}` with each input item |
| `-n 1` | One argument per command invocation |
| `-P 4` | Parallel: 4 processes at once |
| `-t` | Print commands before executing |
| `-p` | Prompt before each command |

### Examples

```bash
# Delete files found by find (null-safe)
find /tmp -name '*.tmp' -print0 | xargs -0 rm -f

# Parallel gzip
find . -name '*.log' -print0 | xargs -0 -P 4 gzip

# Replace placeholder
cat urls.txt | xargs -I {} curl -sO {}

# Batch git add
git diff --name-only | xargs git add
```

---

## Cross-links

- Shell commands → [shell_commands.md](shell_commands.md)
- Network tools → [network_tools.md](network_tools.md)
- Bash profile → [../languages/bash.md](../languages/bash.md)
