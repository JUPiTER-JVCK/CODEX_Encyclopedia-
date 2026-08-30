---
title: Rust — language profile
layer: 08_User_Applications
section: languages
tags: [rust, cargo, rustup, clippy, tokio]
updated: 2026-05-20
---

# Rust — language profile

> Memory-safe systems language with zero-cost abstractions. Single canonical
> toolchain (`rustup` → `cargo`). Edition-based language evolution (2015, 2018,
> 2021, 2024).

## Toolchain

| Command | Purpose |
|---------|---------|
| `rustup install stable` | Install toolchain |
| `rustup default stable` | Set system-wide default |
| `rustup update` | Update all toolchains |
| `rustup show` | Active toolchain + targets |
| `rustup toolchain list` | List installed |
| `rustup target add wasm32-unknown-unknown` | Cross-compile target |
| `rustup target add thumbv7em-none-eabihf` | ARM Cortex-M4F bare-metal |
| `rustup component add rustfmt clippy rust-analyzer rust-src` | Common components |
| `rustc --version` | Compiler version |
| `rustc --print sysroot` | Where rustc lives |
| `rustc --emit=asm src.rs` | Emit ASM (also `llvm-ir`, `mir`, `metadata`) |

## Cargo (build / package)

| Command | Purpose |
|---------|---------|
| `cargo new pkg` | New binary crate |
| `cargo new --lib pkg` | New library crate |
| `cargo init` | Init in current dir |
| `cargo build` | Debug build (in `target/debug/`) |
| `cargo build --release` | Optimized build (in `target/release/`) |
| `cargo run -- arg1 arg2` | Build + run |
| `cargo check` | Type-check without code-gen (fast) |
| `cargo test` | Run all tests |
| `cargo test foo::bar` | Run specific test |
| `cargo test -- --nocapture` | Show stdout from tests |
| `cargo test -- --test-threads=1` | Serialize tests |
| `cargo bench` | Run benchmarks (`#[bench]` or `criterion`) |
| `cargo doc --open` | Build + open docs |
| `cargo fmt` | Format (rustfmt) |
| `cargo clippy` | Lint (additional warnings) |
| `cargo clippy -- -D warnings` | Treat warnings as errors |
| `cargo add serde --features derive` | Add dep + edit Cargo.toml |
| `cargo remove serde` | Remove dep |
| `cargo update` | Update Cargo.lock |
| `cargo tree` | Dependency tree |
| `cargo tree --duplicates` | Find diamond deps |
| `cargo vendor` | Vendor deps for offline build |
| `cargo expand` | Show macro expansion (subcommand) |
| `cargo install ripgrep` | Install a binary crate to `~/.cargo/bin` |
| `cargo install --list` | List installed binaries |

## Toolchain extras (install via `cargo install`)

| Tool | Purpose |
|------|---------|
| `cargo-watch` | Re-run on file change (`cargo watch -x test`) |
| `cargo-edit` | `add`/`rm`/`upgrade` subcommands (newer cargo has these built-in) |
| `cargo-expand` | Macro expansion |
| `cargo-audit` | Vulnerability scan of deps |
| `cargo-outdated` | Find updatable deps |
| `cargo-llvm-cov` | LLVM-source coverage |
| `cargo-criterion` | Benchmark frontend |
| `cargo-machete` | Find unused deps |
| `cargo-deny` | License + advisory enforcement |
| `cargo-nextest` | Faster test runner |
| `cargo-msrv` | Find minimum supported Rust version |
| `cargo-bloat` | What's making my binary big? |
| `cargo-flamegraph` | Profile flame graphs |
| `cargo-embed` / `cargo-flash` | Probe-rs for embedded |
| `cargo-mobile2` | iOS/Android project scaffolds |
| `bacon` | Background `cargo check` + warnings |
| `mold` / `lld` | Faster linkers (set `RUSTFLAGS`) |
| `sccache` | Compiler cache for CI |

## Debugging / profiling

| Tool | Use |
|------|-----|
| `rust-gdb` | gdb with Rust pretty-printers |
| `rust-lldb` | lldb with Rust pretty-printers |
| `RUST_BACKTRACE=1 cargo run` | Show backtrace on panic |
| `RUST_BACKTRACE=full` | Full symbols |
| `RUST_LOG=debug` | env_logger / tracing filter |
| `cargo flamegraph` | Flame graph (Linux/macOS via dtrace) |
| `samply` | Sampling profiler (Firefox profiler frontend) |
| `perf record cargo run --release` | Linux perf |
| `valgrind --tool=massif` | Heap profiler |

## Standard library essentials

| Module | When |
|--------|------|
| `std::collections` | `HashMap`, `BTreeMap`, `HashSet`, `BTreeSet`, `VecDeque`, `BinaryHeap` |
| `std::fs`, `std::path::{Path, PathBuf}` | Filesystem |
| `std::io::{Read, Write, BufRead, BufReader, BufWriter}` | I/O |
| `std::process::Command` | Shell out |
| `std::env` | Args + env vars |
| `std::sync::{Arc, Mutex, RwLock, Once, atomic::*, mpsc}` | Concurrency primitives |
| `std::thread` | OS threads |
| `std::time::{Duration, Instant, SystemTime}` | Time |
| `std::net::{TcpStream, TcpListener, UdpSocket}` | Networking |
| `std::error::Error`, `Result<T, E>` | Error handling |
| `std::fmt::{Debug, Display, Formatter}` | Formatting |

## Async ecosystem

| Crate | Use |
|-------|-----|
| `tokio` | De-facto async runtime + I/O + sync primitives |
| `async-std` | Alt runtime (less popular now) |
| `smol` | Minimal async runtime |
| `monoio` | Single-threaded `io_uring` runtime |
| `futures` | `Stream`, combinators, low-level traits |
| `reqwest` | HTTP client (over tokio) |
| `axum`, `actix-web`, `warp`, `rocket`, `poem` | Web frameworks |
| `sqlx` | Async SQL with compile-time query checks |
| `sea-orm`, `diesel` | ORMs (Diesel is sync) |
| `tonic` | gRPC |

## Web / serialization / CLI essentials

| Crate | Use |
|-------|-----|
| `serde` + `serde_json`/`serde_yaml`/`bincode` | Serialization |
| `clap` (`derive` feature) | CLI parsing (most ergonomic) |
| `anyhow` | App-level error handling (`Result<_, anyhow::Error>`) |
| `thiserror` | Library-level typed errors |
| `tracing` | Structured logging (preferred over `log`) |
| `log` + `env_logger` | Simple logging |
| `crossbeam` | Channels, queues, atomics |
| `rayon` | Data parallelism (drop-in `.par_iter()`) |
| `bytes` | Efficient byte buffers |
| `regex` | Regex |
| `once_cell` / `std::sync::OnceLock` | Lazy statics |
| `dashmap` | Concurrent HashMap |
| `parking_lot` | Faster `Mutex`/`RwLock` |

## Patterns

- **Ownership**: every value has one owner. `&T` borrow, `&mut T` mutable borrow.
- **Lifetimes**: `'a`, `'static`. Elision rules cover most cases.
- **Error handling**: `Result<T, E>` + `?` operator. `panic!()` only for unrecoverable bugs.
- **Pattern matching**: `match`, `if let`, `while let`, `let else`.
- **Traits**: `impl Trait for Type`, default methods, blanket impls, `where` bounds.
- **`Box<dyn Trait>`** for trait objects (dynamic dispatch).
- **Generics + monomorphization**: zero-cost at runtime, larger binary.
- **`async fn`** desugars to a `Future`; needs a runtime to execute.
- **`unsafe`** blocks contained, justified, often wrapped in safe APIs.

## Common gotchas

- **`String` vs `&str`**: prefer `&str` in function params unless ownership needed.
- **Numeric overflow**: panics in debug, wraps in release. Use `checked_*`, `wrapping_*`, `saturating_*` explicitly.
- **Moves**: `let y = x;` moves non-`Copy` types. `.clone()` if needed.
- **Borrow checker**: when stuck, split into smaller scopes or refactor to take an index rather than reference.
- **Lifetime annotations on return values**: the compiler will guide you.
- **`?` only inside `fn() -> Result<...>` or `Option<...>`** (and `async fn`).
- **`async fn` in traits**: stable in Rust 1.75+ but with object-safety caveats; use `async-trait` for older.
- **Self-referential structs**: hard to express directly — use `Pin`, `Arena`, or external IDs.

## Workspace layout

```
my-project/
├── Cargo.toml          # [workspace] + [workspace.dependencies]
├── Cargo.lock
├── crates/
│   ├── core/
│   ├── cli/
│   └── web/
└── tools/
```

`Cargo.toml`:
```toml
[workspace]
members = ["crates/*"]
resolver = "2"

[workspace.dependencies]
serde = { version = "1", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
```

## Editions

| Edition | Notable |
|---------|---------|
| 2015 | Original |
| 2018 | NLL, `?` in main, `async`/`await` reserved |
| 2021 | Disjoint closure captures, `panic` macro consistency |
| 2024 | New `match` ergonomics, `let chains`, `gen` blocks reserved |

## Cross-references
- Embedded Rust (`no_std`, embassy, RTIC) → [18_Embedded_Systems/languages/embedded_rust.md](../../18_Embedded_Systems/languages/embedded_rust.md)
- Rust in kernel space → [05_OS_Kernel/languages](../../05_OS_Kernel/languages/INDEX.md)
- Rust for drivers → [04_Device_Drivers/languages](../../04_Device_Drivers/languages/INDEX.md)
