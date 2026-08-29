---
title: "POSIX Syscalls — Protocol Reference"
layer: 05_OS_Kernel
section: protocols
tags: [protocol, posix, syscall, linux, kernel, api]
updated: 2026-05-21
---

# POSIX Syscalls — Protocol Reference

---

## Overview

System calls (syscalls) are the kernel/userspace interface — the only way
userspace processes can request privileged kernel services. On x86-64 Linux,
a syscall is invoked via the `syscall` instruction; the kernel identifies
the requested service by a number in `rax`.

```
  User/Kernel boundary:
  
  ┌───────────────────────────────────────────────────────┐
  │  User space (ring 3)                                  │
  │                                                       │
  │  Application → libc wrapper (e.g. write()) → syscall │
  └───────────────────────────────────────────────────────┘
                          │
              ┌───── syscall instruction ─────┐
              │    (rax=syscall#, args in      │
              │     rdi, rsi, rdx, r10, r8, r9)│
              └────────────────────────────────┘
                          │
  ┌───────────────────────────────────────────────────────┐
  │  Kernel space (ring 0)                                │
  │                                                       │
  │  sys_call_table[rax] → sys_write() → return value    │
  └───────────────────────────────────────────────────────┘
```

---

## Syscall Categories

### Process Management

| Syscall | #(x86-64) | Description |
|---------|-----------|-------------|
| fork | 57 | Clone current process (copy-on-write) |
| execve | 59 | Replace process image with new program |
| exit / exit_group | 60/231 | Terminate process / all threads |
| wait4 / waitpid | 61/7 | Collect child exit status |
| clone | 56 | Create thread/process with fine-grained sharing |
| getpid / getppid | 39/110 | Get process IDs |
| kill | 62 | Send signal to process |
| rt_sigaction | 13 | Register signal handler |
| prctl | 157 | Process control (name, seccomp, etc.) |

### Memory Management

| Syscall | # | Description |
|---------|---|-------------|
| mmap | 9 | Map file or anonymous memory into address space |
| munmap | 11 | Remove mapping |
| mprotect | 10 | Change page permissions |
| brk | 12 | Extend heap segment |
| madvise | 28 | Advise kernel on memory use (MADV_FREE, etc.) |
| mlock / munlock | 149/150 | Pin pages in RAM (prevent swap) |

### File Descriptors

| Syscall | # | Description |
|---------|---|-------------|
| open / openat | 2/257 | Open file, return fd |
| read | 0 | Read bytes from fd into buffer |
| write | 1 | Write buffer bytes to fd |
| close | 3 | Release file descriptor |
| lseek | 8 | Reposition read/write offset |
| stat / fstat | 4/5 | Get file metadata |
| dup / dup2 | 32/33 | Duplicate file descriptor |
| fcntl | 72 | File descriptor control (flags, locks) |
| ioctl | 16 | Device-specific control |
| select / poll / epoll | various | I/O multiplexing |

### Networking

| Syscall | # | Description |
|---------|---|-------------|
| socket | 41 | Create socket (domain, type, protocol) |
| bind | 49 | Assign address to socket |
| listen | 50 | Mark socket as passive (server) |
| accept / accept4 | 43/288 | Accept incoming connection |
| connect | 42 | Initiate connection |
| send / sendto | 44/45 | Send data |
| recv / recvfrom | 45/47 | Receive data |
| setsockopt | 54 | Set socket options (SO_REUSEADDR, etc.) |
| getaddrinfo | — | Implemented in libc via NSS, not a syscall |

### Filesystem

| Syscall | # | Description |
|---------|---|-------------|
| mkdir / rmdir | 83/84 | Create/remove directory |
| unlink / unlinkat | 87/263 | Remove file name (delete if last link) |
| rename / renameat2 | 82/316 | Rename/move file (atomic on same FS) |
| link / symlink | 86/88 | Create hard/symbolic link |
| chmod / chown | 90/92 | Change permissions/ownership |
| mount / umount2 | 165/166 | Mount/unmount filesystem |
| sync / fsync / fdatasync | 162/74/75 | Flush data to storage |

---

## Calling Convention (x86-64 Linux)

```
  Argument registers (first 6 args):
  rdi = arg1 (e.g., fd for read/write)
  rsi = arg2 (e.g., buf pointer)
  rdx = arg3 (e.g., count)
  r10 = arg4
  r8  = arg5
  r9  = arg6

  Syscall number: rax
  Return value:   rax (negative = errno negated, e.g., -ENOENT = -2)
  
  Preserved: rbx, rbp, r12, r13, r14, r15 (callee-saved)
  Clobbered: rcx, r11 (used by syscall instruction itself)

  Example: write(1, "hi\n", 3)
  mov rax, 1     ; SYS_write
  mov rdi, 1     ; fd = stdout
  lea rsi, [msg] ; buf
  mov rdx, 3     ; count
  syscall
```

---

## Error Handling

```c
// libc wraps syscalls and sets errno:
ssize_t n = read(fd, buf, size);
if (n < 0) {
    // errno is set to POSIX error code (EACCES, ENOENT, etc.)
    perror("read");     // prints: "read: No such file or directory"
    // or:
    fprintf(stderr, "Error: %s\n", strerror(errno));
}

// Common errno values:
// ENOENT (2)  — No such file or directory
// EACCES (13) — Permission denied
// EAGAIN (11) — Resource temporarily unavailable (would block)
// EINVAL (22) — Invalid argument
// EBADF (9)   — Bad file descriptor
// ENOMEM (12) — Out of memory
```

---

## Tracing Syscalls

```bash
# Trace all syscalls of a process:
strace ls /tmp

# Summary by syscall frequency:
strace -c ls /tmp

# Trace specific syscalls:
strace -e trace=open,read,write cat /etc/hostname

# Attach to running process:
strace -p <pid>

# Kernel-side (eBPF): trace with bpftrace
bpftrace -e 'tracepoint:syscalls:sys_enter_open { printf("%s\n", str(args->filename)); }'
```

---

## POSIX Standards

| Standard | Key additions |
|----------|--------------|
| POSIX.1-1988 | Base API: files, processes, I/O |
| POSIX.1b-1993 | Real-time: signals, timers, shared memory |
| POSIX.1c-1995 | Threads: pthreads API |
| POSIX.1-2008 | Merged above, added getaddrinfo, strnlen, etc. |
| POSIX.1-2017 | Current base standard |

---

## See Also

- Kernel lab exercises → [../lessons/kernel_labs.md](../lessons/kernel_labs.md)
- Kernel tracing tools → [../man_pages/tracing_commands.md](../man_pages/tracing_commands.md)
- Process management → [../man_pages/process_commands.md](../man_pages/process_commands.md)
