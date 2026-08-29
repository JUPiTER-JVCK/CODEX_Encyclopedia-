# User Applications — Languages

The widest layer; everything compiles or transpiles down to lower layers eventually.

## Per-language profiles (man-page-style)

Deep references for the most-used languages — toolchain, stdlib map, idioms, gotchas.

| Language | Profile |
|----------|---------|
| Python | [python.md](python.md) |
| Rust | [rust.md](rust.md) |
| C | [c.md](c.md) |
| C++ | [cpp.md](cpp.md) |
| Go | [go.md](go.md) |
| JavaScript | [javascript.md](javascript.md) |
| TypeScript | [typescript.md](typescript.md) |
| Java | [java.md](java.md) |
| Kotlin | [kotlin.md](kotlin.md) |
| C# | [csharp.md](csharp.md) |
| Swift | [swift.md](swift.md) |
| Ruby | [ruby.md](ruby.md) |
| Bash / shell | [bash.md](bash.md) |
| SQL | [sql.md](sql.md) |
| Lua | [lua.md](lua.md) |

Embedded-specific dialects: see [18_Embedded_Systems/languages/](../../18_Embedded_Systems/languages/INDEX.md) for `embedded_c.md`, `embedded_rust.md`, `embedded_python.md`.

Assembly per architecture: see [02_CPU/languages/](../../02_CPU/languages/INDEX.md) for `x86_64_asm.md`, `arm64_asm.md`, `riscv_asm.md`.

## By platform

### Desktop native
| Platform | Primary | Notable alternatives |
|----------|---------|----------------------|
| Windows | C# / .NET (WPF, WinUI 3) | C++ (Win32, MFC, Qt), Rust (winit + egui) |
| macOS | Swift (AppKit / SwiftUI) | Objective-C (legacy), Qt, Rust |
| Linux | C/C++ (GTK, Qt) | Rust (gtk-rs, slint), Python (PyQt, GTK) |

### Cross-platform desktop
| Toolkit | Language | Notes |
|---------|----------|-------|
| Electron | JS/TS | Chromium + Node; heavy |
| Tauri | Rust + web frontend | Lighter alt to Electron |
| Flutter Desktop | Dart | Single codebase mobile + desktop |
| Qt | C++ / Python (PyQt, PySide) | Mature, commercial license available |
| GTK | C / Rust / Python / Vala | GNOME stack |
| Avalonia | C# | XAML-style cross-platform |
| .NET MAUI | C# | Microsoft cross-platform |
| Slint | Rust / C++ / JS | Newer embedded-friendly UI |

### Mobile
| Platform | Primary | Cross-platform |
|----------|---------|----------------|
| iOS / iPadOS | Swift + SwiftUI | Flutter (Dart), React Native (TS), MAUI (C#), Kotlin Multiplatform |
| Android | Kotlin + Jetpack Compose | same as above |
| visionOS | Swift + RealityKit | — |

### Web (browser as runtime)
| Layer | Languages / frameworks |
|-------|------------------------|
| Markup / styling | HTML, CSS, Sass, Tailwind |
| Logic | JavaScript, TypeScript |
| Frameworks | React, Vue, Svelte, SolidJS, Angular, Astro, Qwik |
| Build / runtime | Vite, Webpack, esbuild, Turbopack, Rspack |

### Server-side app code
- Python (Django, FastAPI, Flask)
- Node.js (Express, Fastify, NestJS)
- Ruby (Rails, Sinatra)
- Go (net/http, gin, echo)
- Rust (axum, actix-web)
- Java/Kotlin (Spring, Ktor)
- C# (ASP.NET Core)
- PHP (Laravel, Symfony)
- Elixir (Phoenix)

### Shell / scripting
- bash, zsh, fish, PowerShell, nushell
- AppleScript, JXA (macOS automation)
- AutoHotkey (Windows automation)
- Python, Perl, Ruby (general scripting)
