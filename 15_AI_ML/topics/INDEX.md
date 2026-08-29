
## Dedicated Topic Deep Dives

| File | Covers |
|------|--------|
| [Transformer Architecture](./transformer_architecture.md) | MHA, KV cache, MoE, scaling laws, RoPE |

# AI / ML — Topics

## Classical ML
- **Linear / logistic regression**, regularization (L1, L2, elastic net)
- **Decision trees, Random Forest, GBDT** (XGBoost, LightGBM, CatBoost)
- **SVM**, kernel methods
- **Clustering** — k-means, DBSCAN, hierarchical
- **Dimensionality reduction** — PCA, t-SNE, UMAP
- **Bayesian** — naive Bayes, Gaussian processes, MCMC

## Deep learning
- **Activations** — ReLU/GELU/SiLU/Swish/Mish, sigmoid, softmax.
- **Optimizers** — SGD, Adam/AdamW, Adafactor, Lion, Schedule-Free.
- **Regularization** — dropout, weight decay, label smoothing, cutmix, mixup.
- **Normalization** — BatchNorm, LayerNorm, RMSNorm, GroupNorm.
- **Initialization** — Xavier, Kaiming, μP scaling.
- **Architectures** — MLP, CNN (ResNet, ConvNeXt), RNN/LSTM/GRU, Transformer, Mamba (SSM), MoE.

## Transformers / LLMs
- **Self-attention, multi-head, KV-cache, MQA/GQA, attention sinks**
- **Positional encoding** — sinusoidal, RoPE, ALiBi, NoPE
- **Activation / normalization variants** — SwiGLU, RMSNorm, pre-norm vs post-norm
- **Decoding** — greedy, beam, top-k/top-p, temperature, min-p, speculative decoding, lookahead
- **Long context** — ring attention, FlashAttention, sliding window, sparse attention
- **MoE** — gating, expert routing, sparsity
- **Tokenization** — BPE, SentencePiece, Unigram, Tiktoken

## Training
- **Datasets** — curation, dedup (MinHash/LSH), filtering, contamination
- **Pretraining** — next-token prediction, masked LM, replaced-token detection
- **SFT** — supervised fine-tuning
- **Preference** — RLHF (PPO), DPO, KTO, ORPO, IPO, SimPO
- **PEFT** — LoRA / QLoRA / DoRA / adapters / prefix tuning
- **Distributed** — DP, DDP, FSDP, ZeRO 1/2/3, Pipeline, Tensor, Sequence parallelism
- **Mixed precision** — fp16, bf16, fp8
- **Scaling laws** — Kaplan, Chinchilla, recent works

## Diffusion & generative
- **DDPM/DDIM** noise schedules
- **Latent diffusion (Stable Diffusion family)**
- **Classifier-free guidance**
- **ControlNet / IP-Adapter / LoRA for diffusion**
- **Image-to-video, video-to-video** (newer)

## Multimodal
- **CLIP-style contrastive learning**
- **VLMs** — vision-language models (LLaVA, BLIP-2, GPT-4V/o, Gemini, Claude vision)
- **Speech** — Whisper, Conformer; TTS (XTTS, OpenVoice, Tortoise, ElevenLabs-style)
- **Audio** — Codec models (EnCodec, SoundStream)

## Inference & serving
- **Quantization** — INT8/INT4 (AWQ, GPTQ, bitsandbytes, GGUF k-quants)
- **KV cache management** — paged attention (vLLM), continuous batching
- **Speculative decoding**, **Medusa heads**, **EAGLE**
- **Batching strategies** — static, dynamic, continuous
- **TensorRT-LLM, ONNX Runtime, OpenVINO** optimizations

## RAG & retrieval
- **Chunking strategies** — fixed, semantic, parent-child
- **Embedding models** — text-embedding-3, BGE, E5, GTE
- **Vector indices** — IVF, HNSW, ScaNN, FAISS variants
- **Hybrid search** — dense + BM25 (RRF), cross-encoders for rerank
- **Long-context vs RAG** tradeoffs

## Agents
- **ReAct, Reflexion, Tree-of-Thoughts**
- **Tool use** — function calling, MCP
- **Planning** — task decomposition, sub-agents, multi-agent orchestration
- **Memory** — episodic, semantic, scratchpad
- **Evaluation** — task success, safety, cost, latency

## RL
- **MDPs**, value/policy iteration
- **Tabular Q-learning, SARSA**
- **DQN, Double DQN, Dueling**
- **Policy gradients** — REINFORCE, A2C/A3C, PPO, GRPO
- **Model-based** — Dyna, MuZero
- **Offline RL** — CQL, IQL

## Evaluation
- **Benchmarks** (see references)
- **LLM-as-judge** — pitfalls, position bias, length bias
- **Pairwise comparison & Elo** (Chatbot Arena)
- **Eval as code** — Promptfoo, LangSmith, Ragas

## Safety & alignment
- **Capability evals**, **dangerous capability evals**
- **Jailbreaks & prompt injection** (cross-link [14_Security](../../14_Security/topics/INDEX.md))
- **Constitutional AI**, **RLHF**, **rule-based reward models**
- **Watermarking** for model outputs
- **Privacy** — differential privacy, federated learning, membership inference

## MLOps
- **Experiment tracking, model registry, lineage**
- **Data versioning, validation (Great Expectations / Pandera)**
- **Feature stores** — Feast, Tecton
- **Drift detection** — input drift, prediction drift, label drift
- **Model observability** — Arize, WhyLabs, Fiddler
