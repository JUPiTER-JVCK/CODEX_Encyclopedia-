---
title: Embedded C — language profile
layer: 18_Embedded_Systems
section: languages
tags: [embedded-c, freestanding, no-libc, misra, baremetal]
updated: 2026-05-20
---

# Embedded C — language profile

> C as used in firmware, kernels, and bare-metal: **freestanding**, often
> `nostdlib`, with linker scripts, register peeks/pokes, ISRs, and a tight
> control over allocation, alignment, and ABI. See [c.md](../../08_User_Applications/languages/c.md)
> for the host-side C baseline; this file is the embedded-specific delta.

## Compile flags (cross + freestanding)

```sh
arm-none-eabi-gcc \
    -mcpu=cortex-m4 -mfpu=fpv4-sp-d16 -mfloat-abi=hard -mthumb \
    -std=c11 -ffreestanding -fno-builtin -fno-common \
    -Os -ffunction-sections -fdata-sections \
    -Wall -Wextra -Wpedantic -Wshadow -Wconversion \
    -g3 -gdwarf-4 \
    -MMD -MP \
    -T linker.ld \
    -Wl,--gc-sections -Wl,-Map=app.map \
    -nostartfiles -nostdlib \
    -o app.elf src/*.c startup.S
```

Key flags:
- `-ffreestanding -fno-builtin` — don't assume hosted libc (no `printf` magic)
- `-mcpu=cortex-mN` / `-march=rv32imac` — target arch
- `-mthumb` — Thumb-2 (default for Cortex-M)
- `-Os` / `-Oz` — size optimization
- `-ffunction-sections -fdata-sections -Wl,--gc-sections` — drop unused symbols
- `-T linker.ld` — linker script (memory map)
- `-nostartfiles` — no implicit `crt0.S`
- `-nostdlib` — no implicit libc/libm/libgcc

After link, generate flash artifact:
```sh
arm-none-eabi-objcopy -O binary app.elf app.bin    # raw
arm-none-eabi-objcopy -O ihex   app.elf app.hex    # Intel hex
arm-none-eabi-size app.elf                          # text/data/bss totals
```

## Linker script anatomy (Cortex-M)

```ld
MEMORY {
    FLASH (rx)  : ORIGIN = 0x08000000, LENGTH = 256K
    RAM   (rwx) : ORIGIN = 0x20000000, LENGTH = 64K
}

ENTRY(Reset_Handler)

SECTIONS {
    .vectors  : { KEEP(*(.isr_vector)) } > FLASH
    .text     : { *(.text*) *(.rodata*) } > FLASH
    .ARM.exidx: { *(.ARM.exidx*) } > FLASH
    _sidata   = LOADADDR(.data);
    .data     : { _sdata = .; *(.data*) _edata = .; } > RAM AT> FLASH
    .bss      : { _sbss  = .; *(.bss*)  _ebss  = .; } > RAM
    _estack   = ORIGIN(RAM) + LENGTH(RAM);
}
```

Vectors table (first entry = initial SP, second = `Reset_Handler`):

```c
extern uint32_t _estack;
void Reset_Handler(void);
void Default_Handler(void) { for (;;) {} }

__attribute__((section(".isr_vector"), used))
void (* const g_vectors[])(void) = {
    (void(*)(void))(&_estack),     // initial SP
    Reset_Handler,                 // reset vector
    Default_Handler,               // NMI
    Default_Handler,               // HardFault
    // ...
};
```

`Reset_Handler` copies `.data` from flash to RAM, zeros `.bss`, calls `main()`.

## Register access (memory-mapped peripherals)

```c
#include <stdint.h>

#define REG(addr)   (*(volatile uint32_t *)(addr))

#define RCC_AHB2ENR REG(0x4002104C)
#define GPIOA_MODER REG(0x48000000)
#define GPIOA_ODR   REG(0x48000014)

static inline void led_on(void) {
    RCC_AHB2ENR |=  (1U << 0);              // enable GPIOA clock
    GPIOA_MODER &= ~(0x3U << (5 * 2));      // clear mode bits
    GPIOA_MODER |=  (0x1U << (5 * 2));      // set output mode
    GPIOA_ODR   |=  (1U << 5);              // drive PA5 high
}
```

Always `volatile` for MMIO. Use vendor headers (`stm32f4xx.h`, `nrf.h`, `pico/regs/...`) when available — they encode all this.

## ISR (interrupt service routine)

```c
void TIM2_IRQHandler(void) {
    TIM2_SR &= ~TIM_SR_UIF;          // clear update flag
    g_tick_count++;                  // shared with main — declare volatile
}
```

- ISR names usually come from the startup vector table (vendor-defined).
- Keep ISRs **short** — defer to a flag or queue.
- Use `volatile` for variables shared with ISRs.
- Use `__atomic_*` / `<stdatomic.h>` for safe shared access.
- Beware of priority inversion; configure NVIC priorities deliberately.

## RTOS-friendly patterns

- **Static allocation only** — no `malloc` in hot paths (or at all in safety-critical).
- **Lock-free queues / ring buffers** for ISR ↔ task communication.
- **Watchdog feeding** in the lowest-priority task or main loop.
- **Tickless idle** + `WFI` / `WFE` in idle hook for power savings.
- **Stack-overflow detection** — fill stacks with magic pattern, check on context switch.

## Common compile-time tricks

```c
/* compile-time assertion */
_Static_assert(sizeof(uint32_t) == 4, "uint32_t must be 4 bytes");

/* alignment */
typedef struct __attribute__((aligned(8))) { uint64_t a; uint32_t b; } S;

/* packing (network buffers, on-wire structs) */
typedef struct __attribute__((packed)) { uint8_t a; uint32_t b; } Pkt;

/* placement in section */
__attribute__((section(".ramfunc"))) void hot_isr(void) { ... }

/* weak symbol so user can override the default */
__attribute__((weak)) void hard_fault_handler(void) { for(;;) {} }

/* tell linker to keep even if unreferenced */
__attribute__((used)) static const char build_id[] = "v1.2.3";
```

## MISRA C (high-assurance subset)

- No dynamic memory after init
- All `if` must have braces; all `switch` must have `default`
- No recursion
- Single `return` per function (relaxed in MISRA C:2012)
- Explicit casts at narrowing conversions
- Use `<stdint.h>` typedefs only (`uint8_t`, `int32_t`, ...), not raw `int`/`long`
- No `goto` (relaxed: forward goto for cleanup OK)
- All function declarations in prototype scope

Tooling: `cppcheck --addon=misra`, PRQA QA-C, LDRA Testbed, Polyspace.

## Footprint discipline

- **Watch the .map file** (`-Wl,-Map=app.map`) for unexpected pulls (`malloc`, `printf` family).
- **`-Wl,--print-memory-usage`** for at-build summary.
- **Tiny `printf` replacements**: `mpaland/printf`, `eyalroz/printf`, custom integer-only.
- **Avoid `float printf`** unless you actually need it.
- **`-flto`** can shrink significantly.
- **`__attribute__((noinline))`** on cold paths to prevent code-size blowup.

## Toolchain

| Tool | Purpose |
|------|---------|
| `arm-none-eabi-gcc/binutils/gdb` | ARM bare-metal |
| `riscv64-unknown-elf-gcc/...` | RISC-V bare-metal |
| `xtensa-esp32-elf-gcc` | ESP32 |
| `clang --target=arm-none-eabi -mcpu=...` | LLVM alternative |
| `openocd` / `pyocd` / `probe-rs` / `JLinkExe` | Programming + GDB server |
| `qemu-system-arm` / `renode` / `wokwi` | Simulation |
| `Ozone` (Segger) | Visual debugger |
| `Tracealyzer` / `SystemView` (Segger) | RTOS-aware trace |
| `ITM` / `SWO` printf | Non-intrusive debug print |
| `cmake`/`west`/`idf.py` | Build system frontends |

## See also
- Host-side C → [../../08_User_Applications/languages/c.md](../../08_User_Applications/languages/c.md)
- Firmware boot flow → [../../03_Firmware_BIOS/topics](../../03_Firmware_BIOS/topics/INDEX.md)
- Kernel C dialect → [../../05_OS_Kernel/languages](../../05_OS_Kernel/languages/INDEX.md)
- Embedded Rust → [embedded_rust.md](embedded_rust.md)
- ARM Cortex-M ASM → [../../02_CPU/languages/arm64_asm.md](../../02_CPU/languages/arm64_asm.md) (note: M-class uses Thumb-2, A-class uses AArch64)
