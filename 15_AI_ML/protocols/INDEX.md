# AI / ML — Protocols & Specs

## Model context / tool-use protocols
| Spec | Owner | Purpose |
|------|-------|---------|
| MCP (Model Context Protocol) | Anthropic + community | Standard for exposing tools/resources/prompts to LLMs |
| OpenAI Tool Calling | OpenAI | Function calls schema in chat completions |
| Anthropic Tool Use | Anthropic | Tool definitions + tool_use / tool_result blocks |
| Gemini Function Calling | Google | Similar pattern |
| OpenAI Assistants API | OpenAI | Threaded assistants with tools + files |

## Inference / serving APIs (de facto wire compat)
| API | Purpose |
|-----|---------|
| OpenAI Chat Completions | The most widely-cloned schema |
| OpenAI Embeddings | Standard embedding API shape |
| Anthropic Messages | System + user + assistant turns |
| Google Gemini REST | Similar request shape |
| HuggingFace Inference Endpoints / TGI | Open-source serving |
| vLLM OpenAI-compatible server | Self-hostable, OAI-compatible |
| OpenAI Responses API | Newer unified response API |

## Model & tensor exchange formats
| Format | Owner | Notes |
|--------|-------|-------|
| Safetensors | HuggingFace | Safe (no pickle), mmap, fast |
| GGUF | llama.cpp | Quantized model bundle |
| ONNX | LFAI | Cross-framework graph IR |
| Core ML (.mlpackage) | Apple | iOS/macOS on-device |
| TFLite | Google | Mobile/edge |
| TensorRT engine | NVIDIA | Compiled for specific GPUs |
| OpenVINO IR | Intel | CPU/iGPU/NPU |
| MLX format | Apple | Apple Silicon native |

## Dataset / metadata
| Spec | Purpose |
|------|---------|
| HuggingFace `datasets` schema | Common dataset format |
| Croissant | W3C dataset metadata |
| TFRecord | TensorFlow record format |
| Parquet / Arrow | Columnar storage (cross-link [data](../../Network/12_Network_Transport/) and tooling) |

## Eval / harness specs
| Tool | Schema |
|------|--------|
| lm-evaluation-harness | YAML task definitions |
| HELM | Stanford eval framework |
| BIG-bench | Google benchmark format |
| Promptfoo / LangSmith | YAML/JSON test cases |

## Vector index APIs
- pgvector SQL extension
- Qdrant / Weaviate / Milvus / Pinecone REST + gRPC

## Cross-link
- LLMs served over HTTP/JSON → [13_Network_Application](../../Network/13_Network_Application/)
- Prompt injection treated as security topic → [14_Security/topics](../../14_Security/topics/INDEX.md)
- Hardware accelerators feed the runtime → [02_CPU](../../02_CPU/) + GPU/NPU notes
