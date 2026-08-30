---
title: Java — language profile
layer: 08_User_Applications
section: languages
tags: [java, jdk, maven, gradle, jvm]
updated: 2026-05-20
---

# Java — language profile

> Multi-platform JVM language. Long-term-support releases: 8 (legacy), 11, 17,
> 21, 25. Modern Java (17+) is concise, capable, and worth using.

## JDK toolchain

| Command | Purpose |
|---------|---------|
| `java -version` | Active JVM version |
| `javac --release 21 X.java` | Compile to a specific bytecode target |
| `java X` / `java -jar app.jar` | Run a class or jar |
| `java X.java` | Source-launcher mode (single-file scripts, JEP 330) |
| `jar cf app.jar -C classes .` | Build a jar |
| `jdeps app.jar` | Dep analyzer |
| `jdeprscan app.jar` | Deprecated-API scanner |
| `jcmd <pid> <cmd>` | Diagnostic commands |
| `jstack <pid>` / `jmap` / `jstat` | Thread dump / heap / GC stats |
| `jshell` | REPL |
| `jlink` | Create custom JRE |
| `jpackage` | Native installer |
| `sdkman` (`sdk install java 21-tem`) | Multi-JDK manager (community) |

## JVMs (pick one)

| Distribution | Notes |
|--------------|-------|
| Eclipse Temurin (Adoptium) | Default community choice |
| Amazon Corretto | AWS-supported LTS |
| Azul Zulu / Prime | Free + commercial (Zing) |
| Oracle OpenJDK | Reference |
| GraalVM | Native-image AOT compile, polyglot |
| BellSoft Liberica | Tiny / NIK variants |
| IBM Semeru (OpenJ9) | Alt JVM |

## Build tools

| Tool | Use |
|------|-----|
| `mvn` | Maven (`pom.xml`); `mvn test`, `mvn package`, `mvn install` |
| `gradle` / `./gradlew` | Gradle (Groovy/Kotlin DSL); `gradle build`, `gradle bootRun` |
| `bazel`, `pants` | Monorepo |
| `sbt` | Scala-first, also Java |

Common Maven commands: `compile`, `test-compile`, `test`, `package`, `verify`,
`install`, `deploy`, `clean`, `dependency:tree`, `versions:display-dependency-updates`.

Gradle: `tasks`, `build`, `test`, `dependencies`, `wrapper --gradle-version 8.x`.

## Stdlib essentials

| Package | When |
|---------|------|
| `java.util.{List, Map, Set, ArrayList, HashMap, HashSet, LinkedList, ArrayDeque}` | Collections |
| `java.util.stream` | Streams API (`.stream().map(...).collect(...)`) |
| `java.util.concurrent` | `ExecutorService`, `CompletableFuture`, `BlockingQueue`, `AtomicInteger`, `ReentrantLock` |
| `java.util.function` | `Function`, `Predicate`, `Supplier`, `Consumer`, `BiFunction` |
| `java.io` / `java.nio.file` | Files (`Path`, `Files.readString`, `Files.list`) |
| `java.net.http.HttpClient` | Modern HTTP (since 11) |
| `java.time` | Dates (`Instant`, `LocalDate`, `Duration`, `ZonedDateTime`) |
| `java.util.regex` | Regex |
| `java.security`, `javax.crypto` | Crypto |
| `java.lang.reflect` | Reflection |
| `java.util.logging` | Built-in logger (use SLF4J facade instead in apps) |

## Frameworks

| Framework | Use |
|-----------|-----|
| Spring Boot | Default for enterprise web; auto-config, starters |
| Quarkus | GraalVM-friendly, fast startup |
| Micronaut | Compile-time DI |
| Helidon | Cloud-native |
| Ktor (Kotlin) | Lightweight server |
| Dropwizard | Lightweight, opinionated |
| Vert.x | Reactive |
| Jakarta EE | Enterprise spec implementations (Payara, WildFly, Open Liberty) |

## Testing & quality

| Tool | Use |
|------|-----|
| JUnit 5 (`org.junit.jupiter`) | De-facto unit test |
| TestNG | Alternative |
| AssertJ | Fluent assertions |
| Mockito | Mocking |
| Testcontainers | Integration with real containers |
| JMH | Microbenchmarks |
| Pitest | Mutation testing |
| Spotless / google-java-format / Palantir Java Format | Format |
| Checkstyle / PMD / SpotBugs / ErrorProne | Lint / static analysis |
| SonarQube / Sonar Cloud | Quality dashboard |

## Modern features (a quick map)

| Feature | Since |
|---------|-------|
| Lambdas + Streams | 8 |
| `Optional` | 8 |
| `var` local-type inference | 10 |
| `HttpClient` | 11 |
| Switch expressions, `enhanced for` | 14 |
| Records, sealed classes, pattern matching `instanceof` | 16 / 17 |
| Pattern matching for `switch` | 21 |
| Virtual threads (Project Loom) | 21 |
| `java.lang.foreign` (FFM) | 22 |
| Unnamed classes + `void main()` for scripts | preview/21+ |
| Structured concurrency (preview) | 21+ |
| Scoped values (preview) | 21+ |
| String templates (preview, paused) | 21+ |

## Idioms

- **Records** for immutable value carriers: `record Point(int x, int y) {}`
- **Sealed types** to model closed hierarchies + exhaustive `switch`.
- **`var`** for local inference (still type-safe).
- **`Optional`** at return sites, never as a field or parameter.
- **Streams** for declarative pipelines (`.filter`, `.map`, `.collect(toList())`).
- **`try-with-resources`** for `AutoCloseable`.
- **Virtual threads** (`Thread.ofVirtual().start(...)` or `Executors.newVirtualThreadPerTaskExecutor()`) for I/O-bound concurrency.
- **`record` patterns** + `switch` for ADT-style dispatch (Java 21+).

## Common gotchas

- **`==` vs `.equals()`** for objects (especially `Integer.valueOf(127) == Integer.valueOf(127)` true, `128 == 128` false due to cache).
- **Mutable fields in records** if you put a `List<>` inside — wrap in `List.copyOf(...)` in compact ctor.
- **`null` handling** — use `Optional`, `@Nullable` (JSpecify), or `Objects.requireNonNull`.
- **Checked exceptions** — propagate carefully or wrap in unchecked.
- **`Stream`s are one-shot** — re-create if needed.
- **`ZonedDateTime` vs `OffsetDateTime` vs `Instant`** — pick deliberately.
- **`String.format`** is allocation-heavy; consider `StringBuilder` for loops.
- **Reflection** is slow; use `MethodHandles` or AOT codegen where possible.

## Cross-references
- JVM internals → [07_Runtime_Environment/topics](../../07_Runtime_Environment/topics/INDEX.md)
- Kotlin profile → [kotlin.md](kotlin.md)
