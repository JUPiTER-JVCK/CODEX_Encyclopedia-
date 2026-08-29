---
title: C# — language profile
layer: 08_User_Applications
section: languages
tags: [csharp, dotnet, nuget, aspnetcore]
updated: 2026-05-20
---

# C# — language profile

> Microsoft's primary language for .NET. Modern .NET (≥ 6, LTS 8/10) is
> cross-platform — runs on macOS, Linux, Windows. Single SDK (`dotnet`)
> handles everything.

## Toolchain (`dotnet`)

| Command | Purpose |
|---------|---------|
| `dotnet --info` | SDK + runtime info |
| `dotnet new console -o app` | New project from template |
| `dotnet new list` | List templates |
| `dotnet add package <pkg>` | Add NuGet dep |
| `dotnet restore` | Fetch packages |
| `dotnet build` | Build (Debug by default) |
| `dotnet build -c Release` | Release build |
| `dotnet run` / `dotnet run --project src/Api` | Build + run |
| `dotnet watch run` | Live reload |
| `dotnet test` | Run tests |
| `dotnet test --logger "console;verbosity=detailed"` | Verbose |
| `dotnet test --collect:"XPlat Code Coverage"` | Coverage |
| `dotnet pack` | Build NuGet package |
| `dotnet nuget push pkg.nupkg -k <key> -s <src>` | Publish |
| `dotnet publish -c Release -r osx-arm64 --self-contained` | Self-contained binary |
| `dotnet ef migrations add Init` | EF Core migration |
| `dotnet tool install -g dotnet-format` | Install global tool |

## Templates of note
`console`, `classlib`, `web`, `webapi`, `mvc`, `blazorserver`, `blazorwasm`,
`maui`, `worker`, `grpc`, `nunit`, `xunit`, `mstest`.

## Tooling

| Tool | Use |
|------|-----|
| `dotnet format` | Format (or IDE auto) |
| Roslyn analyzers + EditorConfig | Lint via `.editorconfig` |
| SonarAnalyzer for C# | Static analysis |
| Roslynator | Refactoring + diagnostics |
| ReSharper / Rider | JetBrains IDE/extension |
| BenchmarkDotNet | Microbenchmarks |
| `dotnet-counters`, `dotnet-dump`, `dotnet-trace`, `dotnet-gcdump` | Diagnostics |
| `Polly` | Resilience (retry/circuit-breaker) |
| `Serilog` / `NLog` | Logging |
| `Moq`, `NSubstitute`, `FakeItEasy` | Mocking |
| `FluentAssertions` | Assertions |
| `xUnit` / `NUnit` / `MSTest` | Test frameworks |

## Frameworks

| Framework | Use |
|-----------|-----|
| ASP.NET Core | Web (Minimal APIs, MVC, Razor, Blazor) |
| Entity Framework Core | ORM |
| MAUI | Cross-platform UI (Android/iOS/macOS/Windows) |
| Blazor (Server / WebAssembly / Hybrid) | Web UI |
| Avalonia | Cross-platform desktop UI |
| WPF / WinForms | Windows desktop |
| Orleans | Distributed actors |
| gRPC for .NET | RPC |
| SignalR | Real-time WebSocket |
| Akka.NET | Actor model |

## Stdlib / BCL essentials

| Namespace | When |
|-----------|------|
| `System` | Core types, `Console`, `Math`, primitives |
| `System.Collections.Generic` | `List<T>`, `Dictionary<K,V>`, `HashSet<T>`, `Queue<T>`, `Stack<T>` |
| `System.Linq` | `Where`, `Select`, `GroupBy`, `Aggregate`, `Any`, `All` |
| `System.Text.Json` | JSON (`JsonSerializer.Serialize/Deserialize`) |
| `System.Text.RegularExpressions` | Regex |
| `System.IO` / `System.IO.Pipelines` | I/O |
| `System.Net.Http` | `HttpClient` |
| `System.Threading.Tasks` | `Task`, `Task<T>`, `async`/`await` |
| `System.Threading.Channels` | Lightweight channels |
| `System.Diagnostics` | Stopwatch, Trace, Activity, Process |
| `Microsoft.Extensions.Logging/DependencyInjection/Configuration` | DI, config, logging |
| `System.Memory` | `Span<T>`, `Memory<T>`, `ReadOnlySpan<T>` |
| `System.Threading` | Locks, atomics, semaphores |
| `System.Reactive` (Rx) | Observable pipelines |

## Modern features (a quick map)

| Feature | Since |
|---------|-------|
| `async`/`await` | C# 5 |
| Pattern matching | C# 7 → 11 (improving each version) |
| Records (value + ref) | C# 9/10 |
| Nullable reference types (`string?`) | C# 8 (default-on in modern templates) |
| Top-level statements | C# 9 |
| `init`-only setters, `with` expression on records | C# 9 |
| File-scoped namespaces, global usings | C# 10 |
| `required` members, raw string literals, primary constructors on classes | C# 11/12 |
| Lambdas with default values, alias-any-type | C# 12 |
| Collection expressions (`[1, 2, 3]`) | C# 12 |
| `field` keyword in property accessors | C# 13 |

## Idioms

- **Nullable reference types** + the compiler will flag unguarded null deref.
- **Records** for DTOs / values.
- **`async` all the way** — don't block with `.Result` or `.Wait()`; use `ConfigureAwait(false)` in libraries.
- **`IEnumerable<T>`** for lazy sequences; materialize with `ToList()` when needed twice.
- **DI everywhere** with `Microsoft.Extensions.DependencyInjection`.
- **`Span<T>` / `Memory<T>`** for zero-allocation slicing.
- **`using` declarations** (no braces) for scope-bound disposables.
- **Pattern matching** in `switch` expressions for ADT-style dispatch.
- **`record struct`** for tiny value types.

## Common gotchas

- **`async void`** — only for event handlers; otherwise exceptions vanish.
- **Closures** capture *variables*, not values — be careful in loops (less of an issue with `foreach` value-typed loop var since C# 5).
- **`HttpClient`** should be reused (DI'd or static) — `using new HttpClient()` in a loop exhausts sockets. Use `IHttpClientFactory`.
- **`Task.Result`/`Wait()`** can deadlock in sync contexts (legacy WPF/WinForms; less in ASP.NET Core).
- **LINQ deferred execution** — query runs on enumeration.
- **`==`** vs `Equals` for reference types — usually `Equals`; records get value equality automatically.

## Cross-references
- CLR runtime → [07_Runtime_Environment/topics](../../07_Runtime_Environment/topics/INDEX.md)
- F# (functional .NET sibling) → topics
