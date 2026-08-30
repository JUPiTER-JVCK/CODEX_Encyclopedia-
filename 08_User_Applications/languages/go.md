---
title: Go — language profile
layer: 08_User_Applications
section: languages
tags: [go, golang, gofmt, gopls]
updated: 2026-05-20
---

# Go — language profile

> Single binary, fast compile, batteries-included stdlib, M:N goroutine
> scheduler. Single canonical toolchain — there's only one Go.

## Toolchain

| Command | Purpose |
|---------|---------|
| `go version` | Version + arch |
| `go env` | Show environment (`GOROOT`, `GOPATH`, `GOMODCACHE`, `GOOS`, `GOARCH`) |
| `go mod init github.com/me/proj` | New module |
| `go mod tidy` | Sync `go.mod` / `go.sum` with imports |
| `go mod download` | Download deps |
| `go mod vendor` | Vendor deps to `vendor/` |
| `go get pkg@v1.2.3` | Add or upgrade dep |
| `go install pkg@latest` | Install binary (to `$GOBIN` / `$GOPATH/bin`) |
| `go build ./...` | Build all packages |
| `go build -o app ./cmd/app` | Build a specific cmd |
| `go run ./cmd/app` | Compile + run |
| `go test ./...` | Run all tests |
| `go test -run TestFoo -v` | Filter + verbose |
| `go test -race ./...` | Race detector |
| `go test -cover ./...` | Coverage |
| `go test -bench=. -benchmem` | Benchmarks (incl. memory) |
| `go test -fuzz=FuzzFoo` | Fuzzing (1.18+) |
| `go fmt ./...` | Format |
| `go vet ./...` | Static analyzer |
| `go doc fmt.Println` | Local docs |
| `go tool pprof cpu.prof` | Profiler UI |
| `go tool trace trace.out` | Execution tracer |
| `go work init / use / sync` | Workspaces (multi-module dev) |
| `go generate ./...` | Run `//go:generate` directives |

## Cross-compile

```sh
GOOS=linux   GOARCH=amd64 go build -o app-linux .
GOOS=darwin  GOARCH=arm64 go build -o app-mac .
GOOS=windows GOARCH=amd64 go build -o app.exe .
```

`GOOS`: linux, darwin, windows, freebsd, openbsd, netbsd, js, wasip1.
`GOARCH`: amd64, arm64, 386, arm, riscv64, ppc64le, wasm.

## Tooling (install with `go install`)

| Tool | Use |
|------|-----|
| `gopls` | LSP for editors |
| `golangci-lint run` | Multi-linter aggregator (de-facto) |
| `staticcheck ./...` | Strict analyzer |
| `goimports -w .` | gofmt + import sort + missing imports |
| `gofumpt -w .` | Stricter gofmt |
| `delve` (`dlv debug`) | Debugger |
| `pprof` | Already in toolchain (`go tool pprof`) |
| `revive` | Configurable linter (replaces golint) |
| `mockgen` | Generate mocks (`go.uber.org/mock`) |
| `air`, `reflex`, `cosmtrek/air` | Live reload |
| `goreleaser` | Build + release multi-platform |

## Stdlib essentials

| Package | When |
|---------|------|
| `fmt` | Formatting, `Println`, `Errorf`, `Sprintf` |
| `errors` | `errors.Is`, `errors.As`, `fmt.Errorf("%w", err)` |
| `context` | Cancellation + deadlines through call chains |
| `os`, `io`, `io/fs`, `bufio` | I/O |
| `os/exec` | Shell out |
| `encoding/json`, `encoding/xml`, `encoding/csv` | Serialization |
| `net/http` | HTTP client + server |
| `net`, `net/url` | TCP/UDP/IP, URL parsing |
| `sync`, `sync/atomic` | Mutex, RWMutex, WaitGroup, Once, atomics |
| `time` | Durations, timers, tickers |
| `log/slog` (1.21+) | Structured logging |
| `regexp` | RE2 regex |
| `strings`, `strconv`, `unicode/utf8` | String ops |
| `sort`, `slices`, `maps` (1.21+) | Collection helpers |
| `crypto/...` | Crypto primitives + TLS |
| `database/sql` + driver | DB access |
| `embed` | `//go:embed` embed files into binary |
| `testing` + subtests + `testing/quick` | Testing framework |

## Common 3rd party

| Lib | Use |
|-----|-----|
| `gin`, `echo`, `chi`, `fiber`, `gorilla/mux` | Web frameworks |
| `cobra` + `viper` | CLI + config |
| `urfave/cli` | Simpler CLI |
| `zap`, `zerolog` | Fast logging (slog now in stdlib) |
| `pgx`, `sqlx`, `ent`, `gorm`, `sqlc` | DB / ORM |
| `tonic`, `grpc-go` | gRPC |
| `goquery` | jQuery-like HTML scraping |
| `testify`, `gomega` | Test assertion libs |
| `mock`, `mockery` | Mock generation |
| `bubbletea` + `lipgloss` + `bubbles` | TUI (Charm) |
| `viper`, `koanf` | Config |

## Idioms

- **Errors as values**: return `(T, error)`; check immediately, no exceptions.
- **Wrap errors**: `fmt.Errorf("doing X: %w", err)` then `errors.Is`/`errors.As`.
- **Defer cleanups**: `defer f.Close()` right after open.
- **Goroutines + channels**: `go fn()`, communicate via `chan T`, signal done with `chan struct{}`.
- **`select { case ... }`** for multi-channel.
- **Context propagation**: first param to long-running funcs is `ctx context.Context`.
- **Small interfaces**: `io.Reader`, `io.Writer`, `error`, etc. Define interfaces at consumer, not producer.
- **Composition over inheritance**: embed structs.
- **Zero values are useful**: `var m sync.Mutex` is ready to use; `var s []int` is nil but appendable.
- **Capital = exported, lowercase = package-private**.

## Common gotchas

- **`for x := range slice`**: `x` is a value copy. Take `&slice[i]` if you need a pointer.
- **Loop variable in goroutines** (pre-1.22): `for _, v := range items { go f(v) }` — pre-1.22 you'd `v := v` first. 1.22+ each iter has its own `v`.
- **Nil interface ≠ nil concrete**: `var p *T; var i interface{} = p; i != nil` (it carries the type).
- **Map iteration order is randomized** — don't rely on insertion order.
- **Channel deadlocks**: send on unbuffered chan without receiver blocks forever.
- **Goroutine leaks**: always plan how a goroutine exits (context cancel, done chan).
- **`copy(dst, src)`** uses `len(dst)` and `len(src)`, takes the min.
- **JSON tags**: `json:"name,omitempty"` — easy to forget.

## Project layout (common convention)

```
.
├── go.mod
├── go.sum
├── cmd/
│   └── server/main.go
├── internal/             # private to this module
│   ├── api/
│   ├── store/
│   └── domain/
├── pkg/                  # public reusable (only if truly reusable)
└── api/openapi.yaml
```

## Cross-references
- Go runtime / scheduler → [07_Runtime_Environment/topics](../../07_Runtime_Environment/topics/INDEX.md)
- Go for networking tools → [Network/13_Network_Application/languages](../../Network/13_Network_Application/languages/INDEX.md)
