---
title: Ruby — language profile
layer: 08_User_Applications
section: languages
tags: [ruby, rubygems, bundler, rails, rbenv]
updated: 2026-05-20
---

# Ruby — language profile

> Friendly, dynamic, object-oriented. Most prominent in web (Rails), DevOps
> (Chef/Puppet legacy, Fastlane), scripting. Ruby 3.x added Ractors and YJIT.

## Toolchain

| Command | Purpose |
|---------|---------|
| `ruby script.rb` | Run a script |
| `ruby -e 'puts 1+1'` | Inline |
| `irb` | REPL |
| `pry` | Enhanced REPL (`gem install pry`) |
| `rbenv` / `chruby` / `rvm` / `asdf` / `mise` | Version managers |
| `gem install foo` | Install a gem |
| `gem update` / `gem uninstall foo` / `gem list` | Manage |
| `gem env` | Show paths |
| `bundle init` | Create Gemfile |
| `bundle add foo` | Add gem to Gemfile |
| `bundle install` | Install per Gemfile |
| `bundle update` | Update within Gemfile constraints |
| `bundle exec rails s` | Run within bundler context |
| `rake` | Task runner (akin to Make) |
| `ruby -wc script.rb` | Syntax check |
| `rubocop` | Linter / formatter |
| `standardrb` | Opinionated wrapper around Rubocop |
| `solargraph` | LSP for editors |
| `tapioca` | RBI sigs for Sorbet |

## Frameworks

| Framework | Use |
|-----------|-----|
| Rails | The web framework |
| Sinatra | Microframework |
| Hanami | Modular alternative |
| Roda / Rack | Low-level Rack apps |
| Grape | API DSL |
| Sidekiq / GoodJob | Background jobs |
| Hotwire (Turbo + Stimulus) | Reactive HTML over the wire |
| Rspec / Minitest | Testing |
| FactoryBot | Test fixtures |
| Capybara + Selenium / Cuprite | Browser tests |
| Standard / Rubocop | Lint/format |
| YJIT | Built-in JIT (3.1+; default since 3.3) |
| Sorbet / RBS | Static types |

## Stdlib essentials

| Module | When |
|--------|------|
| `String`, `Array`, `Hash`, `Range`, `Symbol` | Core types |
| `Enumerable` (`map`, `select`, `reduce`, `each_with_object`, `group_by`, `partition`) | Functional iteration |
| `File`, `Dir`, `Pathname`, `IO` | Files |
| `Process`, `Open3` | Subprocess |
| `JSON`, `YAML`, `CSV` | Serialization |
| `Net::HTTP`, `URI` | HTTP |
| `Date`, `DateTime`, `Time` | Time |
| `Logger` | Logging |
| `Set`, `OpenStruct`, `Struct` | Misc data |
| `Thread`, `Mutex`, `Queue`, `ConditionVariable`, `Fiber`, `Ractor` | Concurrency |
| `RbConfig` | Compiled config |
| `Marshal` | Native serialization (don't accept untrusted!) |

## Idioms

- **Blocks** everywhere — `array.each { |x| ... }`, `do |x| ... end` for multi-line.
- **Implicit return** of the last expression.
- **`unless`** = `if !`. **`until`** = `while !`.
- **Truthy**: only `nil` and `false` are falsy; `0`, `""`, `[]` are truthy.
- **`?` predicate / `!` mutating** convention: `empty?`, `sort!`.
- **`each` over `for`** — for loops leak variable scope.
- **`map.with_index`**, **`each_with_object`** for accumulating.
- **`Hash` literal**: `{ a: 1, b: 2 }` (symbol keys) vs `{ "a" => 1 }` (string keys).
- **Keyword args** preferred over positional after several args.
- **`Comparable` + `<=>`** to get all comparison ops for free.
- **`Enumerable` + `each` + `<=>`** = batteries.

## Common gotchas

- **`.dup` vs `.clone`** — `clone` copies frozen state and singleton methods; `dup` does not.
- **Mutating in-place** vs creating new: `sort` returns new array, `sort!` mutates.
- **`return` inside a lambda** returns from the lambda; `return` inside a proc returns from the enclosing method.
- **`==` vs `eql?` vs `equal?`** — `eql?` is type-strict, `equal?` is identity.
- **`||=`** is *not* a value assignment if defined-with-`false`/`nil` — it actually checks for falsy.
- **Symbol GC** is a thing in modern Ruby; old worry of leaking symbols mostly gone.
- **GIL (GVL)** — true parallelism only with `Ractor` (experimental) or process fork.

## Rails quick map

| Command | Purpose |
|---------|---------|
| `rails new app` | New app |
| `rails new app --api -d postgresql` | API-only with Postgres |
| `bin/rails s` | Server |
| `bin/rails c` | Console (production-safe with `sandbox`) |
| `bin/rails routes` | List routes |
| `bin/rails db:create / migrate / rollback / seed` | DB lifecycle |
| `bin/rails g model User name:string` | Generator |
| `bin/rails test` | Minitest (or `bundle exec rspec` for RSpec) |
| `bin/rails credentials:edit` | Edit encrypted credentials |
| `bin/rails about` | Stack info |

## Cross-references
- Ruby/JRuby/TruffleRuby internals → [07_Runtime_Environment/topics](../../07_Runtime_Environment/topics/INDEX.md)
- DevOps tools that use Ruby → cross-cutting [topics/](../topics/INDEX.md)
