---
title: Embedded Rust — language profile
layer: 18_Embedded_Systems
section: languages
tags: [embedded-rust, no_std, embassy, rtic, hal, embedded-hal]
updated: 2026-05-20
---

# Embedded Rust — language profile

> Memory-safe firmware: `no_std`, async-friendly via Embassy, interrupt-driven
> via RTIC. Single toolchain (`rustup` + cross-compile target) and Cargo for
> dependencies. See [rust.md](../../08_User_Applications/languages/rust.md) for
> the host-side baseline; this file is the embedded delta.

## Targets

| Triple | Use |
|--------|-----|
| `thumbv6m-none-eabi` | Cortex-M0, M0+ |
| `thumbv7m-none-eabi` | Cortex-M3 |
| `thumbv7em-none-eabi` | Cortex-M4 (no FPU) |
| `thumbv7em-none-eabihf` | Cortex-M4F (hard-float) |
| `thumbv8m.base-none-eabi` | Cortex-M23 |
| `thumbv8m.main-none-eabihf` | Cortex-M33/M55/M85 (FPU) |
| `riscv32imac-unknown-none-elf` | RV32IMAC bare-metal (ESP32-C3 etc.) |
| `riscv32imc-unknown-none-elf` | RV32IMC |
| `riscv32imafc-unknown-none-elf` | RV32IMAFC |
| `xtensa-esp32-none-elf` | ESP32 (via espressif fork; needs `espup`) |
| `aarch64-unknown-none-softfloat` | Bare-metal AArch64 (e.g. RPi 4) |

Install: `rustup target add thumbv7em-none-eabihf`

## Cargo.toml essentials

```toml
[package]
name = "fw"
edition = "2021"

[dependencies]
cortex-m            = "0.7"
cortex-m-rt         = "0.7"
panic-halt          = "0.2"
embedded-hal        = "1.0"
embedded-hal-async  = "1.0"
defmt               = "0.3"
defmt-rtt           = "0.4"

# Pick ONE HAL for your chip:
stm32f4xx-hal       = { version = "0.21", features = ["stm32f411"] }
# rp2040-hal        = "0.10"
# nrf52840-hal      = "0.18"
# esp-hal           = "0.21"

[profile.release]
opt-level = "s"      # or "z" for max size
lto       = "fat"
codegen-units = 1
debug     = true     # keep symbols for defmt + backtrace
overflow-checks = false
```

`.cargo/config.toml`:

```toml
[build]
target = "thumbv7em-none-eabihf"

[target.thumbv7em-none-eabihf]
runner = "probe-rs run --chip STM32F411CEUx"
rustflags = [
  "-C", "link-arg=-Tlink.x",        # cortex-m-rt linker script
  "-C", "link-arg=-Tdefmt.x",       # defmt log sections
]

[env]
DEFMT_LOG = "info"
```

## Minimal `no_std` app

```rust
#![no_std]
#![no_main]

use cortex_m_rt::entry;
use panic_halt as _;       // panic = busy-loop
use defmt_rtt as _;        // RTT transport for defmt logs

#[entry]
fn main() -> ! {
    defmt::info!("hello, embedded rust!");
    loop {
        cortex_m::asm::wfi();
    }
}
```

Run: `cargo run` (uses `probe-rs run` as the runner).

## HAL ecosystem

| Crate | Use |
|-------|-----|
| `embedded-hal` 1.0 | Trait set for portable drivers (digital, SPI, I²C, ADC, ...) |
| `embedded-hal-async` | Async variants of the above |
| `embedded-io` / `embedded-io-async` | Read/Write traits for `no_std` |
| `cortex-m` / `cortex-m-rt` | ARM Cortex-M peripheral access + runtime |
| `riscv` / `riscv-rt` | RISC-V counterpart |
| `<chip>-pac` | Peripheral access crate (svd2rust-generated) |
| `<chip>-hal` | High-level HAL built on the pac |
| `<chip>-bsp` | Board-support crate (named pins, button helpers) |

Common HALs: `stm32f4xx-hal`, `stm32h7xx-hal`, `nrf52840-hal`, `rp2040-hal`,
`rp235x-hal`, `esp-hal` (esp32, esp32-c3, c6, h2, s3 via Espressif fork),
`atsamd-hal`.

## Runtimes

| Framework | Style |
|-----------|-------|
| **Embassy** | Async-first; `async fn main()`-style; executors per priority |
| **RTIC** | Real-Time Interrupt-driven Concurrency; static analysis of resources |
| **Tock** | Multi-app embedded OS, capsule architecture |
| **Hubris** | Oxide's component-based microkernel |
| `cortex-m-rt` (bare) | No runtime — write your own main loop |

Embassy snippet:

```rust
#![no_std]
#![no_main]

use embassy_executor::Spawner;
use embassy_time::{Duration, Timer};
use embassy_stm32::gpio::{Level, Output, Speed};
use defmt_rtt as _;
use panic_probe as _;

#[embassy_executor::main]
async fn main(_spawner: Spawner) {
    let p = embassy_stm32::init(Default::default());
    let mut led = Output::new(p.PC13, Level::High, Speed::Low);
    loop {
        led.toggle();
        Timer::after(Duration::from_millis(500)).await;
    }
}
```

RTIC sketch:

```rust
#[rtic::app(device = stm32f4xx_pac, peripherals = true, dispatchers = [SPI1])]
mod app {
    use rtic_monotonics::systick::*;

    #[shared] struct Shared { counter: u32 }
    #[local]  struct Local  { led: gpio::PC13<Output> }

    #[init]
    fn init(cx: init::Context) -> (Shared, Local) {
        // ... clock + GPIO init ...
        Systick::start(cx.core.SYST, 84_000_000, rtic_monotonics::create_systick_token!());
        tick::spawn().ok();
        (Shared { counter: 0 }, Local { led })
    }

    #[task(shared = [counter])]
    async fn tick(mut cx: tick::Context) {
        loop {
            cx.shared.counter.lock(|n| *n += 1);
            Systick::delay(500.millis()).await;
        }
    }
}
```

## Tooling

| Tool | Use |
|------|-----|
| `probe-rs` (`cargo install probe-rs --features cli`) | Probe driver + GDB server + RTT viewer |
| `cargo flash --chip XYZ` | Just flash the binary |
| `cargo embed` | Flash + RTT in one |
| `cargo size --release` | Code size summary |
| `cargo bloat --release --crates` | What's making it big |
| `defmt` + `defmt-rtt` + `defmt-print` | Efficient `printf` over RTT |
| `cargo binutils` | `cargo objdump`, `cargo nm`, `cargo readobj`, `cargo size` |
| `svd2rust` | Generate `*-pac` crate from a vendor SVD |
| `wokwi-cli` / Renode | Simulation |

## Defmt logging

```rust
defmt::info!("counter = {}, name = {}", n, name);
defmt::error!("error: {=u32:x}", code);
```

`defmt` formatting + framing happens host-side; embedded sends compact binary
frames over RTT, ITM, USB, UART, etc. Massively cheaper than `core::fmt`.

## Patterns

- **`#![no_std]`** + `#![no_main]` for firmware; provide your own `#[panic_handler]` or use `panic-halt` / `panic-probe` / `panic-reset`.
- **Take peripherals once** at boot (`Peripherals::take()` returns `Option<>`); pass owned types into drivers.
- **Zero-cost typestate**: pin modes / DMA states encoded in types — invalid transitions don't compile.
- **`Send`/`Sync` + critical sections** for ISR/main sharing; `cortex_m::interrupt::free`, `critical-section` crate.
- **Async > polling loops** with Embassy — power-friendly via WFI in idle.
- **`#[link_section = ".ramfunc"]`** to place hot functions in RAM.
- **`MaybeUninit`** for buffers that DMA fills.

## Common gotchas

- **`std` is not available** — use `core` (and `alloc` if you bring an allocator).
- **No `Vec`/`String`** without `alloc` — use `heapless::Vec` / `heapless::String` with compile-time capacity.
- **`Box::leak`** to obtain `'static` references from heap (rarely needed).
- **Panic strategy**: configure `[profile.*]` `panic = "abort"`; choose a `panic-*` crate.
- **LLVM intrinsics** sometimes missing for unusual targets (`rustflags = ["-C", "link-arg=-lgcc"]` workaround).
- **Linking errors** for missing `__aeabi_memcpy` etc. — pull in `cortex-m-rt`'s defaults or `compiler_builtins`.
- **Stack overflow** silently corrupts; use `flip-link` linker to put stack at the bottom + cause hard fault on overflow.
- **HAL versioning** is fast-moving; pin specific minor versions and read changelogs.

## See also
- Host-side Rust → [../../08_User_Applications/languages/rust.md](../../08_User_Applications/languages/rust.md)
- Embedded C → [embedded_c.md](embedded_c.md)
- Firmware / boot → [../../03_Firmware_BIOS/](../../03_Firmware_BIOS/)
- ARM Cortex-M ASM (Thumb-2) → context in [../../02_CPU/languages/arm64_asm.md](../../02_CPU/languages/arm64_asm.md) (Thumb-2 differs; future split possible)
