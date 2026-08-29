
## Dedicated Lesson Modules

| File | Covers |
|------|--------|
| [AI/ML — Interactive Labs](./ml_labs.md) | PyTorch MNIST, attention visualization, ONNX export |

# AI / ML — Lessons

## Foundations
1. **Linear algebra refresher** — vectors, matrices, eigenvalues, SVD, autograd intuition.
2. **Calc + probability** — gradients, chain rule, Bayes, expectation, entropy.
3. **From scratch ML** — implement linear/logistic regression, KNN, k-means without sklearn.
4. **Karpathy "Zero to Hero"** — micrograd → makemore → minBPE → nanoGPT, in order.

## Deep learning
5. **PyTorch fundamentals** — tensors, autograd, nn.Module, datasets, training loop.
6. **CNN on CIFAR-10 / MNIST** — beat a baseline; understand overfitting.
7. **RNN/LSTM/GRU** — character-level language model.
8. **Transformer from scratch** — re-derive attention; train a tiny LM.
9. **Diffusion model** — implement a DDPM on a toy dataset.

## LLMs
10. **Tokenization** — BPE / SentencePiece / tiktoken; understand subwords.
11. **Run a local model** — Ollama / llama.cpp / vLLM with Llama 3 / Mistral / Qwen.
12. **Fine-tune** — LoRA / QLoRA on a small dataset; TRL / Axolotl / Unsloth.
13. **Preference tuning** — DPO on a small preference dataset.
14. **Evaluation** — MMLU subset + a custom eval suite for your use case.

## Prompting & agents
15. **Prompt engineering** — system/user/assistant, few-shot, role-play, chain-of-thought.
16. **Function / tool calling** — OpenAI-style tools, Anthropic tool use, schemas.
17. **RAG** — embeddings + vector store + retriever + reranker + LLM.
18. **Hybrid retrieval** — BM25 + dense; reciprocal rank fusion.
19. **Agent loop** — ReAct/Reflexion; observe → think → act; budget control.
20. **MCP servers** — write a Model Context Protocol server; expose tools to a model.

## Computer vision / multimodal
21. **CLIP basics** — image-text embedding; zero-shot classification.
22. **Vision Transformer** — fine-tune ViT for a custom task.
23. **Detection / segmentation** — YOLO / SAM / Mask R-CNN walkthrough.

## RL
24. **Tabular RL** — Q-learning on FrozenLake / Taxi.
25. **DQN** on CartPole / Atari (small game).
26. **PPO** with stable-baselines3.

## MLOps & deployment
27. **Experiment tracking** — Weights & Biases / MLflow / Aim.
28. **Data versioning** — DVC / lakeFS.
29. **Serve a model** — TorchServe / vLLM / Triton; benchmark throughput & latency.
30. **Quantization** — INT8/INT4 with bitsandbytes/AWQ/GPTQ; measure quality loss.
31. **Deploy on-device** — Core ML / ONNX Runtime / llama.cpp / MLC LLM.

## Safety & evals (cross-link [14_Security](../../14_Security/))
32. **Red-team your prompt** — jailbreaks, prompt injection in tool outputs.
33. **Eval harness** — write graded prompts; track regressions across model upgrades.
