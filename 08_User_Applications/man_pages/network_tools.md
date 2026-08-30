---
title: "Network Tools"
layer: 08_User_Applications
section: man_pages
tags: [curl, wget, httpie, rsync, scp, sftp, ssh, network, transfer, man-section-1]
updated: 2026-05-21
---

# Network Tools

> Command-line tools for transferring data, remote access, and file sync.

---

## curl — transfer data with URLs

### Synopsis

```
curl [options] URL…
```

### Description

Swiss-army knife for HTTP, HTTPS, FTP, SFTP, SCP, MQTT, and more. Supports
authentication, cookies, proxies, TLS client certs, and HTTP/2.

### Key Options

| Flag | Purpose |
|------|---------|
| `-o file` | Save output to file |
| `-O` | Save with remote filename |
| `-L` | Follow redirects |
| `-s` | Silent (no progress) |
| `-S` | Show errors (with `-s`) |
| `-v` | Verbose (show headers, TLS handshake) |
| `-I` / `--head` | HEAD request — headers only |
| `-X POST` | HTTP method |
| `-d 'data'` | POST body (URL-encoded) |
| `-H 'Key: Val'` | Custom header |
| `-u user:pass` | Basic auth |
| `-b cookies.txt` / `-c cookies.txt` | Read / write cookies |
| `-k` | Skip TLS verification (insecure) |
| `--cert client.pem` | Client certificate |
| `--http2` | Force HTTP/2 |
| `-w '%{http_code}'` | Custom output format |
| `--retry 3` | Retry on transient errors |
| `--max-time 30` | Timeout |
| `--compressed` | Accept-Encoding: gzip, deflate, br |

### Examples

```bash
# GET with headers shown
curl -sS -D - https://httpbin.org/get

# POST JSON
curl -X POST https://api.example.com/data \
  -H 'Content-Type: application/json' \
  -d '{"name": "test", "value": 42}'

# Upload a file with multipart form
curl -F 'file=@report.pdf' -F 'name=Q4 Report' https://upload.example.com

# Download with progress bar, resume support
curl -L -O -C - https://releases.example.com/big-file.tar.gz

# Timing breakdown
curl -w '\nDNS: %{time_namelookup}s\nConnect: %{time_connect}s\nTLS: %{time_appconnect}s\nTotal: %{time_total}s\n' \
  -so /dev/null https://example.com

# Loop through pages
for i in $(seq 1 10); do
  curl -s "https://api.example.com/items?page=$i" | jq '.items[]'
done
```

---

## wget — non-interactive network downloader

### Synopsis

```
wget [options] URL…
```

### Description

Downloads files via HTTP, HTTPS, FTP. Supports recursive downloads, retry,
bandwidth limiting. Simpler than curl for bulk downloads.

### Key Options

| Flag | Purpose |
|------|---------|
| `-O file` | Save as specific filename |
| `-c` | Continue/resume partial download |
| `-r` | Recursive download |
| `-l N` | Recursion depth |
| `-np` | Don't ascend to parent directory |
| `-p` | Download page prerequisites (CSS, images) |
| `-k` | Convert links for local viewing |
| `--mirror` | Mirror: `-r -N -l inf --no-remove-listing` |
| `-q` | Quiet |
| `--limit-rate=1m` | Bandwidth limit |
| `--user-agent='...'` | Custom UA |

### Examples

```bash
# Download a file
wget https://example.com/data.tar.gz

# Mirror a website
wget --mirror --convert-links --no-parent https://docs.example.com/

# Download all PDFs from a page
wget -r -l1 -np -A '*.pdf' https://example.com/papers/
```

---

## httpie — human-friendly HTTP client

### Synopsis

```
http [method] URL [item…]
https URL [item…]
```

### Description

Colorized, JSON-friendly alternative to curl. Key-value pairs auto-detect
as headers (`:`) , query params (`==`), JSON data (`=`), or form data (`:=`).

### Examples

```bash
# GET with query parameters
http GET https://api.example.com/users name==alice active==true

# POST JSON (default for request body)
http POST https://api.example.com/items name=Widget price:=9.99

# Custom header
http GET https://api.example.com Authorization:'Bearer TOKEN'

# Form POST
http -f POST https://example.com/login user=admin password=secret

# Download
http -d https://example.com/file.zip
```

---

## rsync — fast, versatile file copying

### Synopsis

```
rsync [options] source… destination
```

### Description

Copies files locally or over SSH using delta transfer — only changed portions
are sent. The standard for backups and deployment sync.

### Key Options

| Flag | Purpose |
|------|---------|
| `-a` | Archive: `-rlptgoD` (recursive, links, perms, times, group, owner, devices) |
| `-v` | Verbose |
| `-z` | Compress during transfer |
| `-P` | Progress + partial (resume) |
| `--delete` | Delete files in dest that aren't in source |
| `--exclude='pattern'` | Skip matching files |
| `-n` / `--dry-run` | Show what would happen |
| `-e 'ssh -p 2222'` | Custom SSH command |
| `--bwlimit=5000` | Bandwidth limit (KB/s) |
| `--checksum` | Compare by checksum instead of mtime+size |

### Trailing slash matters

```
  rsync -a src/  dest/    → copies contents of src INTO dest
  rsync -a src   dest/    → copies src directory INTO dest (creates dest/src/)
```

### Examples

```bash
# Sync local directory to remote
rsync -avzP ~/project/ deploy@server:/var/www/project/

# Backup with delete (mirror)
rsync -a --delete /data/ /backup/data/

# Dry-run first
rsync -avnP --delete src/ dest/

# Exclude build artifacts
rsync -avz --exclude='.git' --exclude='node_modules' . server:/app/
```

---

## scp — secure copy (over SSH)

### Synopsis

```
scp [-r] [-P port] source… destination
```

### Description

Copies files between hosts over SSH. Simpler than rsync but no delta
transfer — copies everything every time. Being deprecated in favor of
`sftp` in newer OpenSSH.

### Examples

```bash
# Local to remote
scp report.pdf user@server:/home/user/

# Remote to local
scp user@server:/var/log/app.log ./

# Recursive directory copy, custom port
scp -r -P 2222 ./config/ user@server:/etc/myapp/
```

---

## sftp — secure file transfer

### Synopsis

```
sftp [-P port] [user@]host
sftp -b batchfile [user@]host
```

### Description

Interactive file transfer over SSH. Supports `ls`, `cd`, `get`, `put`, `mkdir`,
`rm` commands on the remote host. More capable than `scp` and now the
recommended replacement.

### Key commands

| Command | Purpose |
|---------|---------|
| `ls` / `lls` | Remote / local directory listing |
| `cd` / `lcd` | Change remote / local directory |
| `get file` | Download file |
| `put file` | Upload file |
| `mget *.log` | Download multiple files |
| `mput *.csv` | Upload multiple files |
| `mkdir dir` | Create remote directory |
| `rm file` | Delete remote file |
| `!cmd` | Run local command |

### Examples

```bash
# Interactive session
sftp deploy@server
sftp> cd /var/www
sftp> get config.yaml
sftp> put updated.yaml
sftp> bye

# Batch mode (scripting)
sftp -b - user@server <<'EOF'
cd /data
get export.csv
EOF
```

---

## ssh — secure shell

### Synopsis

```
ssh [-p port] [-i key] [-L local:host:remote] [-J jump] [user@]host [command]
```

### Description

Encrypted remote shell. Also used for port forwarding, SOCKS proxy,
and as a transport for `scp`, `rsync`, `git`.

### Key Options

| Flag | Purpose |
|------|---------|
| `-i ~/.ssh/id_ed25519` | Identity (private key) file |
| `-p 2222` | Custom port |
| `-L 8080:db:5432` | Local port forward |
| `-R 9090:localhost:3000` | Remote port forward |
| `-D 1080` | Dynamic SOCKS5 proxy |
| `-J jump-host` | ProxyJump (bastion/jump host) |
| `-N` | No remote command (tunnel only) |
| `-f` | Background after auth |
| `-t` | Force pseudo-terminal (needed for `sudo`) |
| `-o StrictHostKeyChecking=no` | Skip host key check (use with caution) |

### Examples

```bash
# Simple connect
ssh user@server

# Run a remote command
ssh server 'df -h && free -m'

# Port forward: local 8080 → remote's db:5432
ssh -L 8080:db-host:5432 bastion

# Jump through a bastion
ssh -J bastion user@internal-server

# SOCKS proxy for browser
ssh -D 1080 -Nf user@server
# Then set browser proxy to SOCKS5 localhost:1080
```

### `~/.ssh/config` example

```
Host prod
    HostName 10.0.1.50
    User deploy
    Port 2222
    IdentityFile ~/.ssh/deploy_ed25519
    ProxyJump bastion

Host bastion
    HostName bastion.example.com
    User admin
    IdentityFile ~/.ssh/admin_ed25519
```

---

## Cross-links

- Shell commands → [shell_commands.md](shell_commands.md)
- Text processing → [text_processing.md](text_processing.md)
- SSH protocol → [../../Network/13_Network_Application/protocols/ssh.md](../../Network/13_Network_Application/protocols/ssh.md)
- TLS protocol → [../../Network/13_Network_Application/protocols/tls.md](../../Network/13_Network_Application/protocols/tls.md)
