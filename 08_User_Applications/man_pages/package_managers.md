---
title: "Package Manager Commands"
layer: 08_User_Applications
section: man_pages
tags: [apt, dnf, pacman, brew, nix, package-manager, man-section-1, man-section-8]
updated: 2026-05-21
---

# Package Manager Commands

> System-level package managers for installing, updating, and removing software.

---

## apt — Debian/Ubuntu package manager

### Synopsis

```
apt [options] command [package…]
```

### Description

High-level CLI for `dpkg`. Manages `.deb` packages from repositories.
`apt` is the modern replacement for `apt-get` + `apt-cache` (friendlier
output, progress bars).

### Key commands

| Command | Purpose |
|---------|---------|
| `apt update` | Refresh package index from repos |
| `apt upgrade` | Upgrade installed packages |
| `apt full-upgrade` | Upgrade with dependency changes (remove if needed) |
| `apt install pkg` | Install a package |
| `apt remove pkg` | Remove (keep config) |
| `apt purge pkg` | Remove + delete config |
| `apt autoremove` | Remove unused dependencies |
| `apt search term` | Search package names + descriptions |
| `apt show pkg` | Detailed package info |
| `apt list --installed` | List installed packages |
| `apt list --upgradable` | Packages with updates available |

### Key files

```
  /etc/apt/sources.list          — main repository list
  /etc/apt/sources.list.d/*.list — additional repos (PPAs, third-party)
  /var/cache/apt/archives/       — downloaded .deb cache
  /var/lib/dpkg/info/            — installed package metadata
```

### Examples

```bash
# Full system update
sudo apt update && sudo apt upgrade -y

# Install with a specific version
sudo apt install nginx=1.24.0-1ubuntu1

# Find which package provides a file
apt-file search /usr/bin/dig
# dnsutils: /usr/bin/dig

# Hold a package at current version
sudo apt-mark hold linux-image-generic

# Clean package cache
sudo apt clean
```

---

## dnf — Fedora/RHEL package manager

### Synopsis

```
dnf [options] command [package…]
```

### Description

Next-generation replacement for `yum`. Manages `.rpm` packages. Faster
dependency resolution, module streams, automatic transaction history.

### Key commands

| Command | Purpose |
|---------|---------|
| `dnf check-update` | Check for updates |
| `dnf upgrade` | Upgrade all packages |
| `dnf install pkg` | Install |
| `dnf remove pkg` | Remove |
| `dnf search term` | Search |
| `dnf info pkg` | Package info |
| `dnf list installed` | List installed |
| `dnf provides '*/dig'` | Which package provides a file |
| `dnf history` | Transaction history |
| `dnf history undo N` | Undo a transaction |
| `dnf module list` | Module streams (e.g., nodejs:18, python:3.11) |
| `dnf group install 'Development Tools'` | Install a package group |

### Examples

```bash
# System update
sudo dnf upgrade --refresh -y

# Install from a specific repo
sudo dnf install --repo epel nginx

# Enable a module stream
sudo dnf module enable nodejs:20
sudo dnf install nodejs

# Rollback
sudo dnf history undo last
```

---

## pacman — Arch Linux package manager

### Synopsis

```
pacman -S package    # install
pacman -R package    # remove
pacman -Syu          # sync + upgrade
pacman -Ss term      # search repos
pacman -Qs term      # search installed
pacman -Si package   # info from repos
pacman -Qi package   # info installed
```

### Description

Fast, lightweight package manager for Arch and derivatives (Manjaro,
EndeavourOS). Packages are simple compressed tarballs. The AUR (Arch User
Repository) extends coverage through community PKGBUILDs.

### Key operation groups

| Flag group | Purpose |
|------------|---------|
| `-S` | Sync (install from repos) |
| `-R` | Remove |
| `-Q` | Query (installed packages) |
| `-U` | Upgrade from local file |
| `-F` | File database (which package owns a file) |

### Examples

```bash
# Full system upgrade
sudo pacman -Syu

# Install a package
sudo pacman -S git vim tmux

# Remove with dependencies
sudo pacman -Rns package

# Find which package owns a file
pacman -F /usr/bin/dig
# extra/bind-tools

# List orphaned packages
pacman -Qtdq

# Clean package cache (keep last 2 versions)
paccache -r
```

---

## brew — macOS (and Linux) package manager

### Synopsis

```
brew install formula
brew install --cask app
brew update
brew upgrade
brew search term
brew info formula
```

### Description

Homebrew. Installs CLI tools (`formulae`) and GUI apps (`casks`). Builds
from source or downloads bottles (pre-built). Prefix: `/opt/homebrew/` (Apple
Silicon) or `/usr/local/` (Intel).

### Key commands

| Command | Purpose |
|---------|---------|
| `brew install pkg` | Install a formula |
| `brew install --cask app` | Install a macOS app |
| `brew update` | Update Homebrew + tap index |
| `brew upgrade` | Upgrade all formulae |
| `brew upgrade pkg` | Upgrade specific formula |
| `brew list` | Installed formulae |
| `brew list --cask` | Installed casks |
| `brew search term` | Search |
| `brew info pkg` | Details + dependencies |
| `brew doctor` | Diagnose issues |
| `brew cleanup` | Remove old versions |
| `brew services start pkg` | Start a background service (e.g., postgres) |
| `brew bundle dump` | Export installed to `Brewfile` |
| `brew bundle` | Install from `Brewfile` |

### Brewfile example

```ruby
tap "homebrew/cask"
brew "git"
brew "python@3.12"
brew "node"
brew "tmux"
cask "visual-studio-code"
cask "iterm2"
cask "docker"
```

### Examples

```bash
# Setup on a new Mac
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install a set of tools
brew install git python@3.12 node rust tmux jq fd ripgrep

# Background service
brew services start postgresql@16

# Dump current setup for reproducibility
brew bundle dump --file=~/Brewfile
```

---

## nix — declarative package manager

### Synopsis

```
nix-env -iA nixpkgs.package    # install (imperative)
nix shell nixpkgs#package      # temporary shell (Flakes)
nix develop                    # enter dev shell
nix build                      # build a derivation
```

### Description

Purely functional package manager. Packages are built in isolation, stored
in `/nix/store/` with hash-addressed paths. Supports atomic upgrades,
rollbacks, and reproducible dev environments. Used standalone or as the
foundation of NixOS.

### Key concepts

```
  /nix/store/abc123…-python-3.12.0/     ← immutable, content-addressed
  /nix/store/def456…-openssl-3.2.0/     ← different version = different hash
  ~/.nix-profile → /nix/store/…         ← user profile (symlink tree)
```

### Examples

```bash
# Install a package (imperative)
nix-env -iA nixpkgs.ripgrep

# Temporary shell with a tool (Flakes)
nix shell nixpkgs#python312 nixpkgs#nodejs_20

# Dev shell from flake.nix
nix develop

# Rollback to previous generation
nix-env --rollback

# Garbage collect
nix-collect-garbage -d

# Search packages
nix search nixpkgs python
```

### flake.nix example

```nix
{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  outputs = { self, nixpkgs }: {
    devShells.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      packages = with nixpkgs.legacyPackages.x86_64-linux; [
        python312 nodejs_20 rustc cargo
      ];
    };
  };
}
```

---

## Cross-links

- Shell commands → [shell_commands.md](shell_commands.md)
- Container commands → [../../07_Runtime_Environment/man_pages/INDEX.md](../../07_Runtime_Environment/man_pages/INDEX.md)
- OS Kernel (dpkg/rpm internals) → [../../05_OS_Kernel/topics/INDEX.md](../../05_OS_Kernel/topics/INDEX.md)
