# AI / ML — Manual Pages / Tools

## Dedicated man page references

| Topic | File |
|-------|------|
| ML tools | [ml_tools.md](ml_tools.md) — nvidia-smi, nvtop, tensorboard, huggingface-cli |

---

## GPU / hardware monitoring
| Command | Purpose |
|---------|---------|
| `nvidia-smi` | NVIDIA GPU status + utilization |
| `nvidia-smi dmon` / `pmon` | Continuous monitoring |
| `nvtop` | TUI GPU monitor |
| `rocm-smi` | AMD GPU equivalent |
| `intel_gpu_top` | Intel GPU monitor |
| `tegrastats` | NVIDIA Jetson |
| `powermetrics --samplers gpu_power` | macOS Apple Silicon GPU |

## CUDA & friends
| Command | Purpose |
|---------|---------|
| `nvcc` | NVIDIA CUDA compiler |
| `cuda-gdb` | CUDA debugger |
| `nsys` (Nsight Systems) | System-wide profiler |
| `ncu` (Nsight Compute) | Kernel-level profiler |
| `cupti` | CUDA Profiling Tools Interface |

## PyTorch
| Command | Purpose |
|---------|---------|
| `python -m torch.utils.collect_env` | Env summary for bug reports |
| `torchrun` | Distributed launcher (replaces `torch.distributed.launch`) |
| `torch-tb-profiler` | TensorBoard profiler plugin |

## HuggingFace
| Command | Purpose |
|---------|---------|
| `huggingface-cli login` | Auth |
| `huggingface-cli download model/repo` | Download |
| `huggingface-cli scan-cache` | Disk usage |
| `accelerate config` / `accelerate launch` | Distributed convenience |

## Local LLM runners
| Command | Purpose |
|---------|---------|
| `ollama run llama3` | Pull + chat |
| `ollama serve` | Local API |
| `llama.cpp` (`llama-server`, `llama-cli`) | C++ runner with quantization |
| `vllm` (`vllm serve`) | High-throughput server |
| `lmstudio` / `jan` | Desktop apps |

## Eval / fine-tune
| Command | Purpose |
|---------|---------|
| `lm-eval` (lm-evaluation-harness) | Benchmarks (MMLU etc.) |
| `axolotl preprocess / train` | Fine-tune convenience |
| `unsloth` | Memory-efficient fine-tuning |
| `trl` CLI | RLHF / DPO via HuggingFace |

## Vector DB CLIs
| Command | Purpose |
|---------|---------|
| `qdrant`, `weaviate`, `milvus`, `chromadb` | Run/operate vector DBs |
| `psql` + `pgvector` | Postgres vector ops |

## MLOps
| Command | Purpose |
|---------|---------|
| `mlflow ui` / `mlflow run` | Experiments + serving |
| `wandb login` / `wandb sync` | W&B CLI |
| `dvc init` / `dvc pull` / `dvc push` | Data versioning |

## Model formats
- **Safetensors** — preferred binary format (no pickle, mmap-friendly)
- **GGUF** — llama.cpp quantized format
- **ONNX** — open exchange
- **Core ML (.mlpackage)** — Apple
- **TFLite** / **TensorRT engines** / **OpenVINO IR**
