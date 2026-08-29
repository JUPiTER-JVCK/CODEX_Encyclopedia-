# User Applications — Manual Pages

## Dedicated man page references

| Topic | File |
|-------|------|
| Shells & multiplexers | [shell_commands.md](shell_commands.md) — bash, zsh, fish, tmux, screen |
| Text processing & search | [text_processing.md](text_processing.md) — find, fd, grep, rg, awk, sed, jq, xargs |
| Network tools | [network_tools.md](network_tools.md) — curl, wget, httpie, rsync, scp, sftp, ssh |
| Package managers | [package_managers.md](package_managers.md) — apt, dnf, pacman, brew, nix |

---

## Shells & terminals
| Command | Purpose |
|---------|---------|
| `bash` / `zsh` / `fish` / `nu` | Interactive shells |
| `pwsh` / `powershell` | PowerShell |
| `tmux` / `screen` | Terminal multiplexers |
| `tput`, `infocmp`, `terminfo` | Terminal capabilities |
| `stty` | Terminal settings |

## Common power-user tools
| Command | Purpose |
|---------|---------|
| `find` / `fd` | File search |
| `grep` / `rg` (ripgrep) | Text search |
| `awk` / `sed` / `cut` / `tr` | Text manipulation |
| `jq` / `yq` | JSON / YAML query |
| `xargs`, `parallel` | Batch execution |
| `curl`, `wget`, `httpie` | HTTP clients |
| `rsync`, `scp`, `sftp` | File transfer |
| `ssh`, `mosh` | Remote shell |
| `tar`, `zip`, `7z`, `zstd` | Archives |
| `git` | Version control |

## Package managers
| Command | Platform |
|---------|----------|
| `apt` / `dnf` / `pacman` / `apk` / `zypper` | Linux distros |
| `brew` | macOS/Linux Homebrew |
| `winget` / `choco` / `scoop` | Windows |
| `nix` / `nix-env` / `nix-shell` | Nix |
| `flatpak` / `snap` / `appimage` | Linux app distribution |

## App build / package
| Command | Purpose |
|---------|---------|
| `xcodebuild`, `xcrun`, `codesign`, `notarytool` | Apple build & signing |
| `gradle`, `./gradlew`, `apksigner`, `bundletool` | Android |
| `msbuild`, `dotnet publish` | .NET |
| `electron-builder`, `tauri build` | Cross-platform desktop bundling |
| `appimagetool`, `flatpak-builder`, `snapcraft` | Linux bundles |

## App-level inspection
| Command | Purpose |
|---------|---------|
| `man` / `info` / `tldr` | Documentation |
| `which` / `command -v` / `type` | Command resolution |
| `printenv` / `env` | Environment variables |
| `lsof` | Open files & sockets |
| `pgrep` / `pkill` | Process lookup |

## macOS
- `open`, `open -a`, `defaults`, `pmset`, `softwareupdate`, `sudo softwareupdate --install-rosetta`

## Windows
- `wt` (Windows Terminal), `winget`, `pwsh`, `taskmgr`, `regedit`, `gpedit.msc`
