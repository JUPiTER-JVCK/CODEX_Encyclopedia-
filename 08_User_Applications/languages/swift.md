---
title: Swift — language profile
layer: 08_User_Applications
section: languages
tags: [swift, xcode, spm, swiftpm, swiftui]
updated: 2026-05-20
---

# Swift — language profile

## What is in this section

```text
  Swift profile — Apple platforms + server-side; Swift 6 strict concurrency.

  ┌─── platforms & targets ───────────────────────────────────────────────┐
  │  iOS · iPadOS · macOS · watchOS · tvOS · visionOS (via Xcode)         │
  │  Linux · Windows (server-side)  │  SwiftPM (package manager)          │
  └───────────────────────────────────────────────────────────────────────┘

  ┌─── reference sections ────────────────────────────────────────────────┐
  │  Toolchain (swift build · test · run · xcodebuild · xcrun)             │
  │  SwiftPM Package.swift  │  Tooling (Xcode · SwiftLint · swift-format) │
  │  Stdlib (Optional · Result · Codable · Task)                          │
  │  Frameworks (Foundation · Combine · SwiftUI · UIKit · SwiftData · Vapor) │
  └───────────────────────────────────────────────────────────────────────┘
```

> Apple's primary language for iOS / macOS / iPadOS / watchOS / tvOS / visionOS.
> Also available on Linux + Windows (server-side). Swift 6 added strict
> concurrency by default.

## Toolchain

| Command | Purpose |
|---------|---------|
| `swift --version` | Compiler version |
| `swift build` | Build the SwiftPM package |
| `swift run` | Build + run executable target |
| `swift test` | Run tests |
| `swift package init --type executable` | Scaffold new package |
| `swift package init --type library` | Library |
| `swift package update` | Update deps to allowed versions |
| `swift package resolve` | Recompute Package.resolved |
| `swift package generate-xcodeproj` | (legacy) emit Xcode project |
| `swift repl` | REPL |
| `xcodebuild -scheme App build` | Build via Xcode CLI |
| `xcrun simctl list devices` | iOS simulator devices |
| `xcrun simctl boot <UDID>` | Boot simulator |
| `xcrun -sdk iphoneos clang ...` | Use iOS toolchain manually |

## SwiftPM `Package.swift`

```swift
// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "App",
    platforms: [.macOS(.v14), .iOS(.v17)],
    products: [.executable(name: "App", targets: ["App"])],
    dependencies: [
        .package(url: "https://github.com/apple/swift-argument-parser", from: "1.4.0"),
    ],
    targets: [
        .executableTarget(name: "App", dependencies: [
            .product(name: "ArgumentParser", package: "swift-argument-parser"),
        ]),
        .testTarget(name: "AppTests", dependencies: ["App"]),
    ]
)
```

## Tooling

| Tool | Use |
|------|-----|
| Xcode | Primary IDE (free on Mac App Store) |
| `swift-format` | Format |
| `SwiftLint` | Lint |
| `swift-format --in-place ...` | In-place format |
| `XCTest` | Built-in test framework |
| `Swift Testing` (new in 6) | Modern `@Test` macro-based framework |
| `swift-doc` / DocC | Docs |
| `Instruments` (Xcode) | Profiling |
| `xcbeautify` | Pretty xcodebuild output |
| `tuist` | Generate Xcode projects from Swift DSL |
| `fastlane` | Build / release automation (Ruby) |
| `SwiftFormat` (Nick Lockwood) | Alt formatter |

## Stdlib essentials

The standard library proper — what you get with no imports at all. It ships
with the compiler and is available wherever Swift runs, Linux and Windows
included.

| API | Use |
|-----|-----|
| `Array`, `Dictionary`, `Set`, `Sequence`, `Collection` | Collections |
| `Optional<T>` (sugar `T?`) | Null safety |
| `Result<Success, Failure>` | Sync error type |
| `String` + `Substring` (value types, COW) | Strings |
| `Encodable` / `Decodable` (together, `Codable`) | Serialization *protocols* |
| `Task`, `MainActor`, `async let`, `TaskGroup` | Concurrency (Swift 5.5+) |

## Foundation essentials

Not the standard library, though it is easy to assume otherwise — these need
`import Foundation`, and off Apple platforms they come from
swift-corelibs-foundation, a separate reimplementation. The distinction is
invisible on macOS and decides whether your code builds on Linux.

| API | Use |
|-----|-----|
| `JSONEncoder`, `JSONDecoder` | The concrete coders behind `Codable` |
| `URLSession` | HTTP |
| `FileManager`, `Data`, `URL` | Files |
| `DateComponents`, `Calendar`, `Locale`, `TimeZone`, `ISO8601DateFormatter` | Time |
| `OSLog` / `Logger` | Logging — `import os`, Apple platforms only |

## Frameworks

| Framework | Use |
|-----------|-----|
| SwiftUI | Declarative UI (iOS 13+, macOS 10.15+) |
| UIKit / AppKit | Classic imperative UI |
| Combine | Reactive |
| SwiftData / Core Data / GRDB / Realm | Persistence |
| Network.framework | Sockets, NWConnection |
| Vapor / Hummingbird | Server-side |
| RealityKit / ARKit / SceneKit | 3D / AR |
| CryptoKit | Modern crypto |
| Charts (iOS 16+) | Native charting |

## Modern syntax map

| Feature | Since |
|---------|-------|
| Optionals + chaining | 1.0 |
| Protocol-oriented programming | 2.0 |
| `Codable` | 4.0 |
| Property wrappers (`@State`, `@Binding`) | 5.1 |
| Result builders | 5.4 |
| `async`/`await`, structured concurrency, actors | 5.5 |
| Macros (`@freestanding`, `@attached`) | 5.9 |
| Strict concurrency, region-based isolation | 6.0 |
| `~Copyable` / `~Escapable` | 6.0+ |

## Idioms

- **`let` over `var`** when possible.
- **Optionals via `if let`** / `guard let` / `if case` / `??` defaulting.
- **`guard` early returns** for cleaner happy-path code.
- **Value types by default** (struct/enum). Use classes for identity / reference semantics.
- **`extension Foo: Protocol`** to retroactively conform types.
- **Protocols + protocol extensions** instead of base classes.
- **`@MainActor`** for UI-touching code.
- **`async`/`await`** with structured concurrency over callback completion handlers.

## Common gotchas

- **Reference cycles** with closures capturing `self` — use `[weak self]` / `[unowned self]`.
- **Force-unwraps `!`** crash on nil — usually fixable with `??` or `guard let`.
- **`Equatable`/`Hashable` synthesized** only if all stored properties conform.
- **Strict concurrency warnings** in Swift 6 — embrace, don't suppress.
- **Toll-free bridging** with Foundation types (`String` ↔ `NSString`) is cheap; bridging others may copy.
- **`Codable` errors** — debug with `JSONDecoder().dateDecodingStrategy`, `keyDecodingStrategy`.

## Cross-references
- macOS / iOS app fundamentals → [topics/INDEX.md](../topics/INDEX.md)
- Apple frameworks vs cross-platform → [topics/INDEX.md](../topics/INDEX.md)
