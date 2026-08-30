# 15 — AI / ML (Cross-cutting)

> Machine learning sits mostly at the runtime + application layers but pulls
> hard on CPU/GPU/accelerator hardware below and the network above. This
> layer collects models, training, inference, agents, and tooling.

## At a glance

| Field | Value |
|-------|-------|
| Spans | 02 (accelerators), 06–08 (runtimes/apps), 13 (APIs) |
| Description | Models, training, inference, agents, evaluation, safety |
| Languages | Python (dominant), C++/CUDA (kernels), Rust (infra), JS/TS (apps) |
| Subdomains | Classical ML, deep learning, LLMs, embeddings/RAG, agents, RL, MLOps |

## What lives here

- **Classical ML** — linear/logistic regression, trees, GBDTs, SVMs, k-NN, clustering
- **Deep learning** — MLP, CNN, RNN, Transformer, diffusion, mixture-of-experts
- **LLMs** — open & closed models, prompting, fine-tuning, alignment
- **Embeddings & vector search** — RAG patterns, hybrid retrieval
- **Agents** — tool use, planning, MCP-style protocols
- **Reinforcement learning** — value/policy methods, RLHF, DPO, PPO
- **Computer vision, speech, multimodal**
- **MLOps** — datasets, training, eval, deploy, observability, governance
- **Hardware** — NVIDIA/AMD/Intel GPUs, TPUs, Apple Neural Engine, NPUs
- **AI safety & policy** — capability evals, jailbreaks, red-teaming, governance

## Sub-sections

- [references/](references/INDEX.md) — papers, books, courses, benchmarks
- [lessons/](lessons/INDEX.md) — from scratch nets to fine-tuning to agents
- [languages/](languages/INDEX.md) — frameworks & DSLs
- [man_pages/](man_pages/INDEX.md) — `nvidia-smi`, `torchrun`, `huggingface-cli`, `ollama`
- [topics/](topics/INDEX.md) — architectures, training, alignment, RAG, agents
- [protocols/](protocols/INDEX.md) — API specs, MCP, model serving, formats

## Cross-references
- Accelerator hardware → [02_CPU/topics](../02_CPU/topics/INDEX.md) + GPU/NPU notes
- Inference runtimes & serving → [07_Runtime_Environment](../07_Runtime_Environment/)
- AI-enabled apps → [08_User_Applications](../08_User_Applications/)
- Model API endpoints → [13_Network_Application](../Network/13_Network_Application/)
- Prompt injection, model abuse → [14_Security/topics](../14_Security/topics/INDEX.md)
