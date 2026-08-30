---
title: "Filesystem Commands"
layer: 05_OS_Kernel
section: man_pages
tags: [mount, umount, df, du, stat, lsof, fuser, inotifywait, filesystem, vfs, man-section-1, man-section-8]
updated: 2026-05-21
---

# Filesystem Commands

> Tools for mounting, inspecting, and monitoring filesystems and open files.
> Covers man sections 1 (user) and 8 (admin).

---

## mount / umount — attach and detach filesystems

### Synopsis

```
mount [-t type] [-o options] device mountpoint
umount [-f] [-l] mountpoint|device
```

### Description

`mount` attaches a filesystem to the directory tree. Without arguments, lists
currently mounted filesystems. `umount` detaches.

### Key Options

| Flag | Purpose |
|------|---------|
| `-t ext4` / `-t xfs` / `-t nfs` | Specify filesystem type |
| `-o ro` | Read-only |
| `-o rw,noatime,discard` | Read-write, skip atime updates, TRIM |
| `-o loop` | Loop mount (ISO images, disk images) |
| `-o bind` | Bind mount (directory to another location) |
| `-a` | Mount all entries in `/etc/fstab` |
| `--make-shared` / `--make-private` | Mount propagation (containers) |
| `-l` (umount) | Lazy unmount — detach now, clean up when idle |
| `-f` (umount) | Force unmount (NFS, hung mounts) |

### `/etc/fstab` format

```
# <device>          <mountpoint>  <type>  <options>           <dump> <fsck>
UUID=abcd-1234      /             ext4    defaults,noatime    0      1
/dev/sdb1           /data         xfs     defaults,discard    0      2
//server/share      /mnt/smb      cifs    credentials=/etc/s  0      0
tmpfs               /tmp          tmpfs   size=4G,nodev       0      0
```

### Examples

```bash
# Mount a USB drive
sudo mount /dev/sdb1 /mnt/usb

# Bind mount (useful in containers/chroots)
sudo mount --bind /home/user/data /var/app/data

# Loop mount an ISO
sudo mount -o loop ubuntu.iso /mnt/iso

# Lazy unmount a stuck NFS mount
sudo umount -l /mnt/nfs

# Show all mounts in tree form
findmnt --real
```

---

## df — disk free space

### Synopsis

```
df [-h] [-T] [-i] [path…]
```

### Description

Reports filesystem disk space usage. Shows total, used, available, and use
percentage for each mounted filesystem.

### Key Options

| Flag | Purpose |
|------|---------|
| `-h` | Human-readable (GiB, MiB) |
| `-T` | Show filesystem type column |
| `-i` | Show inode usage instead of blocks |
| `-x tmpfs` | Exclude a filesystem type |
| `--total` | Grand total at bottom |

### Examples

```bash
# Human-readable with types, exclude tmpfs
df -hT -x tmpfs -x devtmpfs

# Check inode usage (ext4 can run out of inodes before space)
df -ih
```

---

## du — disk usage by directory

### Synopsis

```
du [-sh] [-d depth] [--exclude=pattern] [path…]
```

### Description

Estimates file/directory space usage. Walks the directory tree and sums file
sizes.

### Key Options

| Flag | Purpose |
|------|---------|
| `-s` | Summary (total only) |
| `-h` | Human-readable |
| `-d 1` | Max depth 1 (immediate children) |
| `-a` | Include files, not just directories |
| `--exclude='*.log'` | Skip matching files |
| `-c` | Grand total |
| `--apparent-size` | Logical size (vs. allocated blocks) |

### Examples

```bash
# Top 10 largest directories under /var
du -h --max-depth=1 /var | sort -rh | head -10

# Disk usage of current directory, depth 2
du -hd 2 .

# Exclude node_modules
du -sh --exclude='node_modules' ~/projects/*
```

---

## stat — display file/inode information

### Synopsis

```
stat [options] file…
```

### Description

Shows detailed file metadata: inode number, size, block count, permissions
(octal and symbolic), timestamps (access, modify, change, birth), device,
and link count.

### Examples

```bash
# Default format
stat /etc/passwd
#   File: /etc/passwd
#   Size: 2847       Blocks: 8       IO Block: 4096   regular file
# Device: 803h/2051d Inode: 524289   Links: 1
# Access: (0644/-rw-r--r--)  Uid: (0/root)   Gid: (0/root)
# Access: 2026-05-20 10:00:00
# Modify: 2026-05-18 14:30:00
# Change: 2026-05-18 14:30:00
#  Birth: 2026-01-01 00:00:00

# Custom format: just permissions and owner
stat -c '%A %U:%G %n' /etc/passwd
# -rw-r--r-- root:root /etc/passwd

# Filesystem info (not file info)
stat -f /home
```

---

## lsof — list open files

### Synopsis

```
lsof [-i] [-p pid] [-u user] [+D dir] [filename]
```

### Description

Lists open files — and on Unix, everything is a file: regular files, dirs,
sockets, pipes, devices. Indispensable for debugging "address already in use"
and "who has this file open" problems.

### Key Options

| Flag | Purpose |
|------|---------|
| `-i :8080` | Network files on port 8080 |
| `-i TCP` | All TCP connections |
| `-p 1234` | Files opened by PID 1234 |
| `-u deploy` | Files opened by user "deploy" |
| `+D /var/log` | All files under a directory (recursive) |
| `-c nginx` | Files opened by command name |
| `-t` | Terse — PIDs only (for scripting) |

### Examples

```bash
# Who is listening on port 443?
sudo lsof -i :443

# All files open by PID 5678
lsof -p 5678

# Find the process that has a deleted file still open
lsof +L1

# Kill whatever is holding port 3000
kill $(lsof -ti :3000)
```

---

## fuser — identify processes using a file/mount

### Synopsis

```
fuser [-v] [-m] [-k] [-signal] name…
```

### Description

Shows PIDs using a file, directory, or mount point. With `-k`, kills them.
Useful before `umount` to find who's blocking.

### Examples

```bash
# Who is using /mnt/usb?
fuser -vm /mnt/usb

# Kill all processes using a mount (before umount)
fuser -km /mnt/usb

# Who has /var/log/syslog open?
fuser -v /var/log/syslog
```

---

## inotifywait — watch filesystem events

### Synopsis

```
inotifywait [-mrq] [-e events] [--format fmt] path…
```

### Description

Part of `inotify-tools`. Blocks until a filesystem event occurs on the
watched path, then prints it. With `-m` (monitor), runs continuously.

### Event types

| Event | Fires when |
|-------|-----------|
| `create` | File/dir created |
| `delete` | File/dir deleted |
| `modify` | File modified |
| `move` | File moved (renamed) |
| `attrib` | Metadata changed (perms, owner, timestamps) |
| `close_write` | File closed after writing |
| `open` | File opened |
| `access` | File read |

### Examples

```bash
# Watch a directory for new files (recursive, quiet)
inotifywait -mrq -e create /var/spool/incoming/

# Trigger a build on any .rs file change
inotifywait -mrq -e close_write --include '\.rs$' src/ | while read dir event file; do
  echo "Changed: $dir$file — rebuilding..."
  cargo build
done

# One-shot: wait for a specific file to be modified
inotifywait -e modify config.yaml && systemctl reload myapp
```

---

## Cross-links

- Process commands → [process_commands.md](process_commands.md)
- Memory commands → [memory_commands.md](memory_commands.md)
- Device commands → [../../04_Device_Drivers/man_pages/INDEX.md](../../04_Device_Drivers/man_pages/INDEX.md)
- OS Kernel topics → [../topics/INDEX.md](../topics/INDEX.md)
