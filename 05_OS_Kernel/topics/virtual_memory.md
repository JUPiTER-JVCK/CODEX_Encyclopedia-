---
title: "Virtual Memory"
layer: 05_OS_Kernel
section: topics
tags: [topic, virtual-memory, paging, tlb, mmap, huge-pages, aslr, linux]
updated: 2026-05-21
---

# Virtual Memory

---

## Overview

Virtual memory gives each process the illusion of a large, private address
space. The MMU (Memory Management Unit) translates virtual addresses to
physical addresses using page tables maintained by the kernel.

```
  Address space layout (x86-64 Linux, 48-bit VA):
  
  0xFFFFFFFFFFFFFFFF ┐
  0xFFFF800000000000 │  Kernel space (128 TiB)
  0xFFFF7FFFFFFFFFFF │
        ...          │  Hole (non-canonical)
  0x00007FFFFFFFFFFF │
  0x00007FFF00000000 │  Stack (grows down)
  0x00007F0000000000 │  mmap region (shared libs, anonymous)
        ...          │
  0x0000000010000000 │  Heap (grows up via brk)
  0x0000000000601000 │  BSS / Data
  0x0000000000400000 │  Text (code, read-only)
  0x0000000000000000 ┘
```

---

## Page Tables

On x86-64, the kernel uses 4-level (or 5-level with LA57) paging:

```
  Virtual address breakdown (48-bit, 4-level):
  Bits 47-39: PML4 index (512 entries)
  Bits 38-30: PDP  index (512 entries)
  Bits 29-21: PD   index (512 entries)
  Bits 20-12: PT   index (512 entries)
  Bits 11-0:  Page offset (4096 bytes)
  
  PML4 → PDP → PD → PT → Physical Page
  
  Each table entry (PTE): 8 bytes
  ┌────────────────────────────────────────────────────────────┐
  │ Reserved │ Physical Page Frame Number (PFN) │ Flags        │
  │          │ (bits 51-12)                     │ (bits 11-0)  │
  └────────────────────────────────────────────────────────────┘
  
  Key flags:
  P    = Present (1 = mapped)
  R/W  = Writable (0 = read-only)
  U/S  = User accessible (0 = kernel only)
  A    = Accessed (set by MMU on read)
  D    = Dirty (set by MMU on write)
  G    = Global (don't flush from TLB on CR3 reload — kernel pages)
  NX   = No-execute (prevent code execution from data pages)
```

---

## TLB — Translation Lookaside Buffer

The TLB is a hardware cache of recent VA→PA translations (typically
64–2048 entries). A TLB miss requires a page table walk (4 memory
accesses for 4-level paging).

```
  TLB lookup flow:
  
  VA ──▶ TLB? ──hit──▶ PA ──▶ Cache ──▶ DRAM (if miss)
              │
              miss
              │
         Page walk (4 memory reads)
              │
         PTE found? ──▶ update TLB ──▶ PA
              │
              no
              │
         Page fault → kernel handler:
           - Not present: demand paging (load from disk/zero)
           - Write to RO: CoW or SIGSEGV
           - User accessing kernel: SIGSEGV
```

### TLB Invalidation

Changing page table entries requires TLB shootdowns:

```c
// After modifying a PTE:
flush_tlb_page(vma, addr);     // Single page
flush_tlb_mm(mm);              // Entire address space
// SMP: invlpg instruction + IPI to all CPUs sharing the mm
```

---

## mmap — Memory Mapped Files

```c
// Map a file into address space:
int fd = open("data.bin", O_RDONLY);
void *addr = mmap(NULL,           // Let kernel choose address
                  4096,           // Length
                  PROT_READ,      // Permissions
                  MAP_PRIVATE,    // Private copy (CoW)
                  fd, 0);         // File, offset 0
// Now addr[0..4095] mirrors data.bin bytes 0..4095

// Anonymous (no file — used for heap, stack):
void *heap = mmap(NULL, 4096, PROT_READ|PROT_WRITE,
                  MAP_PRIVATE|MAP_ANONYMOUS, -1, 0);
munmap(addr, 4096);
```

### mmap Flags

| Flag | Meaning |
|------|---------|
| MAP_PRIVATE | Copy-on-Write — changes don't affect file |
| MAP_SHARED | Write-through to underlying file |
| MAP_ANONYMOUS | No file backing (fd = -1) |
| MAP_FIXED | Force specific address (dangerous) |
| MAP_HUGETLB | Use huge pages for this mapping |
| MAP_POPULATE | Pre-fault all pages (avoid demand-paging latency) |

---

## Copy-on-Write (CoW)

```
  fork() creates a child sharing parent's pages — all marked read-only:
  
  Parent (PID 100)         Child (PID 101)
  ┌──────────────┐         ┌──────────────┐
  │ VA→PA: 0x1000│────────▶│ VA→PA: 0x1000│ (same physical page)
  │  flags: RO   │         │  flags: RO   │
  └──────────────┘         └──────────────┘
  
  Child writes to 0x1000:
  → Page fault (write to RO page)
  → Kernel allocates new physical page 0x2000
  → Copies content from 0x1000 to 0x2000
  → Updates child's PTE: VA→PA: 0x2000, RW
  → Child continues from faulting instruction
```

---

## Huge Pages

Standard pages = 4 KiB. Huge pages = 2 MiB (or 1 GiB on x86-64).
Fewer TLB entries needed for same working set → fewer TLB misses.

```bash
# Check huge page support:
grep Huge /proc/meminfo
# HugePages_Total: 512
# HugePages_Free:  500
# Hugepagesize:    2048 kB

# Allocate huge pages:
echo 512 > /proc/sys/vm/nr_hugepages

# Use in application (mmap):
void *p = mmap(NULL, 2*1024*1024, PROT_READ|PROT_WRITE,
               MAP_PRIVATE|MAP_ANONYMOUS|MAP_HUGETLB, -1, 0);

# Transparent Huge Pages (THP) — automatic:
echo always > /sys/kernel/mm/transparent_hugepage/enabled
# Kernel automatically promotes 4K pages to 2M where beneficial
```

---

## ASLR — Address Space Layout Randomization

ASLR randomizes base addresses of stack, heap, and mmap regions to
make exploitation harder:

```bash
# Check ASLR level:
cat /proc/sys/kernel/randomize_va_space
# 0 = disabled, 1 = partial, 2 = full (default)

# Entropy:
# x86-64: stack 28 bits, mmap 28 bits, heap 13 bits
# Each process: different layout

# Disable for debugging:
echo 0 > /proc/sys/kernel/randomize_va_space
# Or per-process:
setarch $(uname -m) -R ./my_program
```

---

## Key Terms

| Term | Definition |
|------|-----------|
| MMU | Memory Management Unit — hardware VA→PA translation |
| PTE | Page Table Entry — maps one virtual page to physical frame |
| PFN | Page Frame Number — physical page address / 4096 |
| TLB | Translation Lookaside Buffer — hardware cache of VA→PA |
| Page fault | Exception when accessed page not in TLB or RAM |
| Demand paging | Pages loaded from storage only when first accessed |
| CoW | Copy-on-Write — shared pages copied on first write |
| mmap | System call mapping file or anonymous memory into VA space |
| Huge pages | 2 MiB (or 1 GiB) pages — reduce TLB pressure |
| ASLR | Address Space Layout Randomization — exploit mitigation |

---

## See Also

- Kernel lab exercises → [../lessons/kernel_labs.md](../lessons/kernel_labs.md)
- Memory commands → [../man_pages/memory_commands.md](../man_pages/memory_commands.md)
- POSIX syscalls (mmap, mprotect) → [../protocols/posix_syscalls.md](../protocols/posix_syscalls.md)
