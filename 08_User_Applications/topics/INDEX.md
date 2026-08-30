# User Applications — Topics

## UI paradigms
- **CLI** — argv, exit codes, pipes, idempotent commands, structured output.
- **TUI** — terminal UI with input handling, escape sequences, mouse.
- **GUI** — event loops, retained vs immediate-mode UI, layout engines.
- **Voice / conversational** — assistants, chatbots, LLM-driven UIs.

## GUI toolkits
- **Native** — Win32/WinUI, AppKit/SwiftUI, GTK, Qt.
- **Web** — DOM + CSS layout, React/Vue/Svelte/Solid component models.
- **Game-engine UI** — Unity UI, Unreal UMG, Godot Control nodes.
- **Immediate-mode** — Dear ImGui, egui.

## IPC between apps
- **D-Bus** (Linux desktop), **XPC** (macOS), **COM / RPC** (Windows).
- **Pasteboard / clipboard** (per-OS APIs).
- **Drag-and-drop**, **share extensions**, **app intents** (iOS), **App Actions** (Android).
- **URL schemes / Universal Links / App Links / deep links**.

## Packaging & distribution
- **macOS** — `.app` bundles, code signing, notarization, App Store; PKG installers.
- **Windows** — MSI, MSIX, EXE installers; Authenticode signing; SmartScreen.
- **Linux** — `.deb` / `.rpm` / `.tar.xz`; Flatpak, Snap, AppImage; AUR.
- **Mobile** — App Store (`.ipa`), Play Store (AAB), TestFlight, internal distribution.

## Settings & state
- **Preferences APIs** — `defaults` (macOS), Registry (Windows), `~/.config` (XDG).
- **Sandbox containers** — App Sandbox (macOS), AppContainer (Windows), Android scoped storage.

## Accessibility
- **Screen readers** — VoiceOver, NVDA, JAWS, TalkBack.
- **Semantic accessibility trees** — UI Automation (Win), AX (macOS), ARIA (web).
- **Color contrast, focus, motion preferences, scaling.**

## Cross-cutting platform features
- **Notifications**, **background tasks**, **widgets / live activities**.
- **App lifecycle** — foreground/background, suspension, cold/warm start.
- **State restoration**.

## Security cross-link
- App sandboxing & entitlements → [14_Security/topics](../../14_Security/topics/INDEX.md)
- Code-signing & supply-chain → [14_Security/topics](../../14_Security/topics/INDEX.md)
