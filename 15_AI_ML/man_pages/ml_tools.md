---
title: "AI/ML Tools Reference"
layer: 15_AI_ML
section: man_pages
tags: [nvidia-smi, nvtop, tensorboard, huggingface-cli, gpu, ml, man-section-1]
updated: 2026-05-21
---

# AI/ML Tools Reference

> Practical reference for GPU monitoring, model management, training
> visualization, and ML workflow tools.

---

## nvidia-smi --- NVIDIA System Management Interface

### Synopsis

```
nvidia-smi [query] [options]
nvidia-smi dmon [-i gpu] [-d delay] [-s fields]
nvidia-smi pmon [-i gpu] [-d delay]
nvidia-smi --query-gpu=FIELDS --format=csv
```

### Description

Monitors and manages NVIDIA GPUs. Shows utilization, memory, temperature,
power, running processes, and driver/CUDA versions. Essential for ML
workload monitoring and debugging OOM errors.

### Default output anatomy

```
  $ nvidia-smi
  +-----------------------------------------------------------------------+
  | NVIDIA-SMI 560.35.03    Driver Version: 560.35.03   CUDA Version: 12.6|
  |-------------------------------+----------------------+----------------+
  | GPU  Name          Persistence | Bus-Id        Disp.A| Volatile Uncorr.|
  | Fan  Temp   Perf   Pwr:Usage/ |          Memory-Usage| GPU-Util Compute|
  |      Cap    ECC                |                      |          M.I.G. |
  |===============================+======================+================|
  |   0  NVIDIA RTX 4090    On    | 00000000:01:00.0 Off |              0  |
  | 34%   48C    P2    120W / 450W| 18432MiB / 24564MiB  |   85%  Default |
  +-------------------------------+----------------------+----------------+
  │     │      │   │        │       │            │           │
  │     │      │   │        │       │            │           └── GPU utilization
  │     │      │   │        │       │            └── Total VRAM
  │     │      │   │        │       └── Used VRAM
  │     │      │   │        └── Power cap
  │     │      │   └── Current power draw
  │     │      └── Performance state (P0=max, P8=idle)
  │     └── Temperature
  └── Fan speed

  +-----------------------------------------------------------------------+
  | Processes:                                                            |
  | GPU   PID   Type   Process name                        GPU Memory    |
  |   0  12345   C    python train.py                       18000MiB     |
  +-----------------------------------------------------------------------+
```

### Key query fields

| Field | Description |
|-------|-------------|
| `gpu_name` | GPU model |
| `temperature.gpu` | Core temperature (C) |
| `utilization.gpu` | GPU compute utilization (%) |
| `utilization.memory` | Memory controller utilization (%) |
| `memory.used` / `memory.total` | VRAM usage |
| `power.draw` / `power.limit` | Power consumption |
| `clocks.current.graphics` | GPU clock (MHz) |
| `pcie.link.gen.current` | PCIe generation |
| `pcie.link.width.current` | PCIe lanes |

### Examples

```bash
# One-shot status
nvidia-smi

# Continuous monitoring (1-second refresh)
nvidia-smi dmon -d 1
# gpu  pwr  temp  sm  mem  enc  dec  mclk  pclk
#   0  120   48   85   42    0    0  9001  2520

# Per-process monitoring
nvidia-smi pmon -d 1
# gpu  pid   type  sm  mem  enc  dec  command
#   0  12345   C   85   42    0    0  python

# CSV query for scripting
nvidia-smi --query-gpu=name,temperature.gpu,utilization.gpu,memory.used \
  --format=csv,noheader,nounits
# NVIDIA RTX 4090, 48, 85, 18432

# Loop: watch for OOM
watch -n 1 nvidia-smi --query-gpu=memory.used,memory.total \
  --format=csv,noheader

# Set power limit (reduce for thermals)
sudo nvidia-smi -pl 300    # 300W limit

# Set persistence mode (faster subsequent queries)
sudo nvidia-smi -pm 1
```

---

## nvtop --- GPU process monitor TUI

### Synopsis

```
nvtop [-d delay] [-s sort_field] [-p pid]
```

### Description

`htop`-like TUI for GPU monitoring. Shows per-process GPU/memory utilization
with live bar charts. Supports NVIDIA, AMD, Intel, and Apple Silicon GPUs.

### Display layout

```
  ┌─GPU 0: RTX 4090──────────────────────────────────┐
  │ GPU [████████████████████░░░░░]  85%  48°C  120W │
  │ MEM [████████████████░░░░░░░░░]  75% 18.0/24.0G  │
  │ ENC [░░░░░░░░░░░░░░░░░░░░░░░░]   0%              │
  │ DEC [░░░░░░░░░░░░░░░░░░░░░░░░]   0%              │
  └───────────────────────────────────────────────────┘
  PID    USER   GPU  MEM   Command
  12345  user   85%  18G   python train.py
  12400  user    2%   1G   python eval.py
```

### Examples

```bash
# Launch (auto-detects GPUs)
nvtop

# 500ms refresh
nvtop -d 500

# Filter to specific PID
nvtop -p 12345
```

---

## tensorboard --- training visualization

### Synopsis

```
tensorboard --logdir=PATH [--port PORT] [--bind_all]
tensorboard dev upload --logdir PATH --name "experiment"
```

### Description

Web-based visualization toolkit from TensorFlow, now used by PyTorch,
JAX, and most ML frameworks. Displays training metrics (loss, accuracy),
model graphs, embeddings, images, histograms, and profiling data.

### Log directory structure

```
  runs/
  ├── experiment_01/
  │   ├── events.out.tfevents.1716307200.hostname
  │   └── events.out.tfevents.1716307800.hostname
  ├── experiment_02/
  │   └── events.out.tfevents.1716310000.hostname
  └── hparams/
      └── events.out.tfevents.1716312000.hostname
  
  TensorBoard reads all subdirectories — each becomes a "run"
  in the UI, enabling side-by-side comparison.
```

### PyTorch integration

```python
from torch.utils.tensorboard import SummaryWriter

writer = SummaryWriter("runs/experiment_01")
for epoch in range(100):
    loss = train_one_epoch()
    writer.add_scalar("Loss/train", loss, epoch)
    writer.add_scalar("LR", scheduler.get_last_lr()[0], epoch)
writer.close()
```

### Examples

```bash
# Launch on default port 6006
tensorboard --logdir=runs/

# Custom port, accessible from network
tensorboard --logdir=runs/ --port 8080 --bind_all

# Compare specific runs
tensorboard --logdir=run1:runs/exp1,run2:runs/exp2

# Upload to TensorBoard.dev (public)
tensorboard dev upload --logdir runs/ --name "MNIST experiment"
```

---

## huggingface-cli --- Hugging Face Hub CLI

### Synopsis

```
huggingface-cli login
huggingface-cli download REPO [files...] [--local-dir PATH]
huggingface-cli upload REPO PATH [--repo-type model|dataset|space]
huggingface-cli scan-cache
huggingface-cli delete-cache
```

### Description

Official CLI for the Hugging Face Hub. Download models/datasets, manage
authentication, inspect the local cache, and upload artifacts.

### Cache structure

```
  ~/.cache/huggingface/hub/
  ├── models--meta-llama--Meta-Llama-3-8B/
  │   ├── refs/
  │   │   └── main → commit hash
  │   ├── snapshots/
  │   │   └── abc123def.../
  │   │       ├── config.json
  │   │       ├── tokenizer.json
  │   │       └── model-00001-of-00004.safetensors
  │   └── blobs/
  │       └── sha256-xxxx... (content-addressed storage)
  └── models--sentence-transformers--all-MiniLM-L6-v2/
      └── ...
  
  Blobs are shared across snapshots (deduplication).
  Total cache size can grow to hundreds of GB for large models.
```

### Examples

```bash
# Login (stores token in ~/.cache/huggingface/token)
huggingface-cli login

# Download a model
huggingface-cli download meta-llama/Meta-Llama-3-8B \
  --local-dir ./llama3-8b

# Download specific files
huggingface-cli download meta-llama/Meta-Llama-3-8B \
  config.json tokenizer.json

# Check disk usage
huggingface-cli scan-cache
# REPO ID                          REPO TYPE  SIZE     NB FILES  LAST_ACCESSED
# meta-llama/Meta-Llama-3-8B       model      15.0G   8         2 hours ago
# sentence-transformers/all-Mini... model      90.9M   10        1 day ago

# Clean up old revisions
huggingface-cli delete-cache

# Upload a model
huggingface-cli upload my-org/my-model ./model_output \
  --repo-type model
```

---

## Cross-links

- GPU device drivers -> [../../04_Device_Drivers/man_pages/device_commands.md](../../04_Device_Drivers/man_pages/device_commands.md)
- CPU profiling (perf) -> [../../02_CPU/man_pages/cpu_inspection.md](../../02_CPU/man_pages/cpu_inspection.md)
- Container tools -> [../../07_Runtime_Environment/man_pages/container_commands.md](../../07_Runtime_Environment/man_pages/container_commands.md)
- Python runtime -> [../../07_Runtime_Environment/man_pages/INDEX.md](../../07_Runtime_Environment/man_pages/INDEX.md)
