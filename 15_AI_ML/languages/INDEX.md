# AI / ML — Languages

## Core
| Language | Where |
|----------|-------|
| Python | Dominant — training, inference orchestration, eval, agents |
| C++ | Performance kernels, inference engines (llama.cpp, ggml, ONNX Runtime) |
| CUDA C++ | NVIDIA GPU kernels |
| HIP / ROCm | AMD GPU kernels |
| Metal Shading Language | Apple GPU/MPS kernels |
| Triton | OpenAI's GPU kernel DSL (Python) |
| Mojo | Modular's Python-superset (early) |
| Rust | Serving infra, embeddings DBs, candle (HuggingFace) |
| Julia | Scientific ML (Flux.jl, MLJ.jl) |
| JS / TS | Browser inference (TF.js, transformers.js), app glue |

## Python frameworks
| Framework | Notes |
|-----------|-------|
| PyTorch | Default research + production |
| JAX | Functional, XLA-compiled; Flax, Haiku, Equinox on top |
| TensorFlow / Keras | Still significant in industry |
| scikit-learn | Classical ML |
| XGBoost / LightGBM / CatBoost | GBDTs |
| HuggingFace Transformers / Diffusers / Datasets / Accelerate | The ecosystem |
| Lightning / PyTorch Lightning | Training loop wrapper |
| FastAI | High-level on top of PyTorch |
| Ray / Ray Train / Ray Serve | Distributed |
| DeepSpeed / Megatron-LM / FSDP | Large-scale training |
| vLLM / TGI / sglang / TensorRT-LLM | High-throughput inference |
| llama.cpp / ggml | CPU/Metal/CUDA quantized inference (C++) |
| MLX | Apple Silicon framework |

## LLM tooling
| Tool | Purpose |
|------|---------|
| LangChain / LlamaIndex | Orchestration, RAG |
| Haystack | RAG + production search |
| Instructor / Pydantic AI | Typed LLM outputs |
| DSPy | Programmatic prompting |
| LiteLLM | Multi-provider proxy |
| OpenRouter / Together / Replicate / Fireworks | Model marketplaces |
| Ollama / LM Studio / Jan | Local model runners |

## Agents & MCP
- Anthropic Claude SDK, OpenAI Agents SDK
- Model Context Protocol (MCP) — open standard for tool/context exposure
- LangGraph, CrewAI, AutoGen — multi-agent frameworks

## Data / ETL
- pandas / polars / Spark / DuckDB
- Apache Arrow / Parquet
- LakeFS / DVC / Pachyderm (versioning)

## Tracking
- W&B, MLflow, Aim, Neptune, Comet

## Vector DBs & search
- Postgres + pgvector, Qdrant, Weaviate, Milvus, Chroma, Pinecone, FAISS
- BM25 / OpenSearch / Elasticsearch (lexical)
