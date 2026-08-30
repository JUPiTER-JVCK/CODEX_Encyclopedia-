---
title: "Embedded Systems — Interactive Labs"
layer: 18_Embedded_Systems
section: lessons
tags: [lesson, embedded, bare-metal, rtos, uart, i2c, lab, quiz, hands-on]
updated: 2026-05-21
---

# Embedded Systems — Interactive Labs

---

## Module 1: Bare-Metal LED Blink (STM32)

### Objective

Blink an LED on an STM32F4 without any HAL or OS — directly writing
to GPIO registers, understanding the clock enable → configure → toggle cycle.

### Prerequisites

- STM32F4-Discovery board (or similar Cortex-M4 MCU)
- ARM GCC toolchain: `arm-none-eabi-gcc`
- OpenOCD or ST-Link utility

### Lab Steps

1. Minimal startup code (startup.c):
```c
// Vector table entry point
extern int main(void);
void Reset_Handler(void) __attribute__((naked));

void Reset_Handler(void) {
    // Zero BSS, copy data from flash to RAM
    extern uint32_t _sbss, _ebss, _sdata, _edata, _sidata;
    uint32_t *bss = &_sbss;
    while (bss < &_ebss) *bss++ = 0;
    uint32_t *dst = &_sdata, *src = &_sidata;
    while (dst < &_edata) *dst++ = *src++;
    main();
    while (1);
}

// Minimal vector table (just reset vector)
__attribute__((section(".vectors")))
void (*const vectors[])(void) = {
    (void(*)(void))0x20020000,  // Initial stack pointer (128KB SRAM)
    Reset_Handler,
};
```

2. Main application — blink LED (PD12 on F4-Discovery):
```c
// main.c
#include <stdint.h>

// STM32F4 register addresses
#define RCC_AHB1ENR  (*((volatile uint32_t*)0x40023830))
#define GPIOD_MODER  (*((volatile uint32_t*)0x40020C00))
#define GPIOD_ODR    (*((volatile uint32_t*)0x40020C14))

#define RCC_GPIOD_EN (1 << 3)   // AHB1ENR bit 3
#define LED_PIN      12

static void delay(uint32_t count) {
    while (count--) __asm("nop");
}

int main(void) {
    // 1. Enable GPIOD clock
    RCC_AHB1ENR |= RCC_GPIOD_EN;

    // 2. Configure PD12 as output (MODER bits 25:24 = 01)
    GPIOD_MODER &= ~(3U << (LED_PIN * 2));  // Clear
    GPIOD_MODER |=  (1U << (LED_PIN * 2));  // Set to output

    // 3. Toggle LED forever
    while (1) {
        GPIOD_ODR ^= (1U << LED_PIN);
        delay(500000);
    }
}
```

3. Linker script (stm32f4.ld):
```ld
MEMORY {
    FLASH (rx)  : ORIGIN = 0x08000000, LENGTH = 1024K
    SRAM  (rwx) : ORIGIN = 0x20000000, LENGTH = 128K
}
SECTIONS {
    .vectors 0x08000000 : { *(.vectors) } > FLASH
    .text    : { *(.text*) } > FLASH
    .data    : { _sdata = .; *(.data*) _edata = .; } > SRAM AT > FLASH
    .bss     : { _sbss = .; *(.bss*) _ebss = .; } > SRAM
}
```

4. Build and flash:
```bash
arm-none-eabi-gcc -mcpu=cortex-m4 -mthumb -O2 -nostdlib \
    -T stm32f4.ld startup.c main.c -o blink.elf

arm-none-eabi-objcopy -O binary blink.elf blink.bin

# Flash with OpenOCD:
openocd -f interface/stlink.cfg -f target/stm32f4x.cfg \
    -c "program blink.bin 0x08000000 verify reset exit"
```

```
  Bare-metal GPIO setup sequence:
  
  1. Enable clock to peripheral
     RCC_AHB1ENR |= (1 << GPIOD_bit)
         │
  2. Configure pin direction (MODER register)
     MODER[25:24] = 01 (output)
         │
  3. Set output value (ODR register)
     ODR bit 12 = 0 or 1
         │
  4. Toggle with XOR
     ODR ^= (1 << 12)
```

### Knowledge Check

**Q1**: Why must the GPIO clock be enabled before accessing GPIO registers?

> **A1**: STM32 peripherals default to clock-gated (off) to save power.
> Writing to a GPIO register before enabling its clock in RCC_AHB1ENR
> either has no effect or causes a bus fault. The peripheral is only
> addressable once the clock is running.

**Q2**: What is the difference between ODR and BSRR for GPIO output?

> **A2**: ODR (Output Data Register) is a read-write register — modifying
> one bit requires a read-modify-write, which is not atomic. BSRR (Bit Set/
> Reset Register) is write-only: writing the upper half clears bits, lower
> half sets bits — each operation is atomic (single write), safe from
> interrupts that could corrupt an ODR read-modify-write.

---

## Module 2: FreeRTOS Task Management

### Objective

Create multiple FreeRTOS tasks with different priorities, use a
binary semaphore for synchronization, and observe scheduling with UART.

### Lab Steps

1. Task creation and UART output:
```c
#include "FreeRTOS.h"
#include "task.h"
#include "semphr.h"
#include <stdio.h>  // Assumes UART-backed printf

SemaphoreHandle_t xSemaphore;

void vHighPriorityTask(void *pvParam) {
    for (;;) {
        // Wait for semaphore (given by ISR or other task)
        if (xSemaphoreTake(xSemaphore, portMAX_DELAY) == pdTRUE) {
            printf("[HP] Processing event at tick %lu\r\n", xTaskGetTickCount());
        }
    }
}

void vLowPriorityTask(void *pvParam) {
    for (;;) {
        printf("[LP] Tick: %lu\r\n", xTaskGetTickCount());
        vTaskDelay(pdMS_TO_TICKS(500));   // Yield for 500ms
    }
}

void vPeriodicTask(void *pvParam) {
    TickType_t xLastWake = xTaskGetTickCount();
    for (;;) {
        vTaskDelayUntil(&xLastWake, pdMS_TO_TICKS(1000));
        printf("[PER] 1s event — giving semaphore\r\n");
        xSemaphoreGive(xSemaphore);
    }
}

int main(void) {
    xSemaphore = xSemaphoreCreateBinary();

    xTaskCreate(vHighPriorityTask, "HP",  256, NULL, 3, NULL);
    xTaskCreate(vLowPriorityTask,  "LP",  256, NULL, 1, NULL);
    xTaskCreate(vPeriodicTask,     "PER", 256, NULL, 2, NULL);

    vTaskStartScheduler();
    for (;;);  // Should never reach here
}
```

2. Task state inspection with CLI:
```c
// Add FreeRTOS+CLI or use vTaskList():
void vMonitorTask(void *pvParam) {
    char buf[512];
    for (;;) {
        vTaskList(buf);
        printf("\r\nTask Name       State  Pri   Stack  Num\r\n");
        printf("%-40s\r\n", buf);
        vTaskDelay(pdMS_TO_TICKS(5000));
    }
}
// Output shows: task name, state (R/B/S), priority, stack watermark, ID
```

```
  FreeRTOS scheduler (preemptive, priority-based):
  
  Priority 3 (HP): ████░░░░░░░░░░░░░░░░░░░░████░░  (runs when semaphore given)
  Priority 2 (PER):░░░░░░░░░░░░░░░░░░░░████░░░░░░  (runs every 1000ms tick)
  Priority 1 (LP): ░░░░████░░░░████░░░░░░░░░░████  (fills idle time)
                   ────────────────────────────── time
```

### Knowledge Check

**Q1**: What happens if a high-priority task never blocks?

> **A1**: It starves all lower-priority tasks indefinitely. FreeRTOS is
> strictly priority-preemptive — the highest-priority ready task always
> runs. Tasks must call vTaskDelay, xSemaphoreTake, xQueueReceive, or
> similar blocking calls to yield CPU to lower-priority tasks.

---

## Module 3: UART Communication and I2C Sensor Read

### Objective

Read temperature from an I2C sensor (e.g., BME280), transmit readings
over UART, and parse the protocol manually with a logic analyzer.

### Lab Steps

1. UART echo (bare-metal, polling):
```c
#define USART2_SR   (*((volatile uint32_t*)0x40004400))
#define USART2_DR   (*((volatile uint32_t*)0x40004404))
#define USART2_BRR  (*((volatile uint32_t*)0x40004408))
#define USART2_CR1  (*((volatile uint32_t*)0x4000440C))

void uart_init(uint32_t baud) {
    // Enable clock, configure PA2 (TX), PA3 (RX) — omitted for brevity
    USART2_BRR = 16000000 / baud;  // Assumes 16 MHz clock
    USART2_CR1 = (1<<13) | (1<<3) | (1<<2);  // Enable USART, TX, RX
}

void uart_send(char c) {
    while (!(USART2_SR & (1<<7)));  // Wait for TX empty
    USART2_DR = c;
}

char uart_recv(void) {
    while (!(USART2_SR & (1<<5)));  // Wait for RXNE
    return USART2_DR;
}
```

2. I2C BME280 temperature read (HAL-level for clarity):
```c
#include "stm32f4xx_hal.h"

#define BME280_ADDR  0x76  // SDO pulled low
#define REG_TEMP_MSB 0xFA
#define REG_CALIB00  0x88

I2C_HandleTypeDef hi2c1;

// Read raw temperature and apply compensation
int32_t bme280_read_temperature(void) {
    uint8_t data[3];
    HAL_I2C_Mem_Read(&hi2c1, BME280_ADDR << 1, REG_TEMP_MSB, 1, data, 3, 100);
    int32_t adc_T = ((int32_t)data[0] << 12) |
                    ((int32_t)data[1] <<  4) |
                    ((int32_t)data[2] >>  4);

    // Apply BME280 compensation formula (simplified):
    // Real implementation reads calibration coefficients from 0x88-0x9F
    // Returns temperature in 0.01°C units
    return adc_T;  // Simplified; real code applies t_fine formula
}
```

3. Logic analyzer protocol decode:
```
  I2C transaction (BME280 read, 7-bit address):

  SDA: ─┐S┌─0─0─1─1─0─1─1─0┐A┌─1─1─1─1─1─0─1─0┐A┌─data─┐A P─
  SCL: ─┘ └─────────────────┘ └─────────────────┘ └──────┘ │ ─

  S = Start (SDA falls while SCL high)
  0x76 << 1 = 0xEC (7-bit addr), bit 0 = 0 (write)
  Register 0xFA = temp MSB
  A = ACK (SDA low during 9th clock)
  P = Stop (SDA rises while SCL high)
  
  Second transaction (read phase):
  SDA: ─┐S┌─0─0─1─1─0─1─1─1┐A┌─data─┐A P─
        │   addr 0x76, R/W=1         
```

### Review Flashcards

| Term | Definition |
|------|-----------|
| Bare-metal | No OS — direct register access, deterministic, minimal overhead |
| GPIO | General Purpose I/O — configurable digital input or output pin |
| MODER | STM32 GPIO mode register (input/output/alternate function/analog) |
| RTOS | Real-Time OS — deterministic scheduling, often priority-preemptive |
| Semaphore | Synchronization primitive — binary (mutex-like) or counting |
| vTaskDelay | FreeRTOS: block task for N ticks, yields CPU |
| UART | Universal Async Receiver-Transmitter — serial, no clock line |
| I2C | 2-wire serial bus (SDA + SCL) — multi-device, addressed |
| SPI | 4-wire serial bus (MOSI/MISO/SCK/CS) — fast, full-duplex |
| Logic analyzer | Tool that captures and decodes digital signal timings |

### Challenge

> Implement a FreeRTOS-based data logger: read BME280 temperature and
> humidity via I2C every second, buffer readings in a queue, and drain
> the queue to UART in a separate low-priority task. Add a third task
> that toggles an LED every time the queue overflows. Measure worst-case
> interrupt-to-task latency with a GPIO toggle and oscilloscope.

---

## Cross-links

- Embedded tools → [../man_pages/embedded_tools.md](../man_pages/embedded_tools.md)
- I2C & SPI protocols → [../protocols/i2c_spi.md](../protocols/i2c_spi.md)
- UART protocol → [../protocols/uart.md](../protocols/uart.md)
- Device driver model → [../../04_Device_Drivers/topics/driver_model.md](../../04_Device_Drivers/topics/driver_model.md)
