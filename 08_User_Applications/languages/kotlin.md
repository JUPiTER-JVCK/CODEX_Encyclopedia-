---
title: Kotlin — language profile
layer: 08_User_Applications
section: languages
tags: [kotlin, kotlinc, gradle, android, ktor]
updated: 2026-05-20
---

# Kotlin — language profile

> JetBrains' multi-platform language. Primary use: Android (first-class) and
> JVM server. Other targets: Kotlin/JS, Kotlin/Native, Kotlin Multiplatform.

## Toolchain

| Command | Purpose |
|---------|---------|
| `kotlinc src.kt -include-runtime -d app.jar` | Compile to JVM jar |
| `kotlin app.jar` | Run |
| `kotlinc-jvm`, `kotlinc-native`, `kotlinc-js` | Per-target compilers |
| `kotlin -script script.kts` | Kotlin script |
| `gradle build` / `./gradlew assembleDebug` | Build (Android) |
| `kotlin -version` | Compiler version |

## Build (Gradle)

```kotlin
plugins {
    kotlin("jvm") version "2.1.0"
    application
}

dependencies {
    implementation("io.ktor:ktor-server-core:3.0.0")
    testImplementation(kotlin("test"))
}

application { mainClass.set("com.example.MainKt") }
```

## Tooling

| Tool | Use |
|------|-----|
| `ktlint` / `ktfmt` | Format / lint |
| `detekt` | Static analysis |
| `JUnit 5` + `kotlin.test` | Testing |
| `MockK` | Idiomatic Kotlin mocks |
| `kotlinx.coroutines-test` | Test coroutines |
| `dokka` | Docs |
| Android Studio / IntelliJ | IDE |

## Coroutines (the killer feature)

```kotlin
suspend fun load(id: String): User = withContext(Dispatchers.IO) {
    api.fetch(id)
}

coroutineScope {
    val a = async { load("1") }
    val b = async { load("2") }
    println(a.await().name + b.await().name)
}
```

| Concept | API |
|---------|-----|
| Launch a coroutine | `launch { ... }` / `async { ... }.await()` |
| Suspend function | `suspend fun ...` |
| Structured concurrency | `coroutineScope { ... }`, `supervisorScope { ... }` |
| Dispatchers | `Dispatchers.Default / IO / Main / Unconfined` |
| Cancellation | Cooperative; check `isActive` or call suspending fns |
| Flow | Cold async stream — `flow { emit(x) }.collect { ... }` |
| Channels | `Channel<T>()` for hot streams |

## Stdlib essentials

| API | Use |
|-----|-----|
| `List`, `Map`, `Set` + `mutable*` variants | Collections (immutable by default) |
| `listOf`, `mapOf`, `setOf` | Builders |
| Scope functions | `let`, `run`, `with`, `apply`, `also` |
| Collection ops | `map`, `filter`, `fold`, `reduce`, `groupBy`, `associate`, `zip`, `chunked`, `windowed` |
| Sequences | `asSequence()` for lazy pipelines |
| `Result<T>` | Built-in success/failure |
| `Pair`, `Triple` | Lightweight tuples |
| Strings | Templates `"$x"` `"${a.b}"`, multi-line `"""..."""`.trimIndent() |
| `runCatching { ... }` | Convert throws to `Result` |
| `requireNotNull`, `checkNotNull`, `error`, `require`, `check` | Contract assertions |

## Idioms

- **Data classes**: `data class User(val id: String, val name: String)` — auto equals/hashCode/copy/destructuring.
- **Sealed classes / interfaces**: ADTs + exhaustive `when`.
- **`when`** expression as a value-yielding switch on steroids.
- **Extension functions**: `fun String.shout() = this.uppercase() + "!"`
- **Null safety**: `val x: String?` requires `?.` / `!!` / `?:`.
- **Default + named args**: `fun greet(name: String, loud: Boolean = false)` — no overloading needed.
- **`object`** keyword for singletons; `companion object` for static-like.
- **Inline functions** + reified generics for zero-cost abstractions.
- **Lambda with receiver** for DSLs: `html { body { p { +"hi" } } }`.

## Common gotchas

- **Platform types** when calling Java APIs — annotate with `@Nullable`/`@NotNull` or check.
- **`!!`** crashes on null — usually wrong choice; prefer `?:` with default.
- **Sequence vs Iterable** — `Sequence` is lazy, `Iterable` is eager. Pick deliberately.
- **`object`** in tests can leak state across tests.
- **`Companion`** generates a static inner class — affects reflection.
- **Coroutine scope leaks** — always tie scopes to lifecycles (Android `viewModelScope` etc.).

## Android-specific

| Tool / lib | Use |
|-----------|-----|
| Jetpack Compose | Modern declarative UI |
| Android Gradle Plugin | `com.android.application` / `library` |
| `adb` | Android Debug Bridge |
| Compose Multiplatform | iOS/Desktop/Web from one codebase |
| KSP | Faster annotation processing (replaces kapt) |
| Hilt / Koin | DI |
| Room | SQLite ORM |
| Retrofit + OkHttp | HTTP |
| WorkManager | Background tasks |

## Cross-references
- Java profile → [java.md](java.md)
- JVM internals → [07_Runtime_Environment/topics](../../07_Runtime_Environment/topics/INDEX.md)
