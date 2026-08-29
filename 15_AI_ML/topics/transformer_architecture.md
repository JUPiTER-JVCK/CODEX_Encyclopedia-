---
title: "Transformer Architecture"
layer: 15_AI_ML
section: topics
tags: [topic, transformer, attention, llm, mha, kv-cache, moe, scaling]
updated: 2026-05-21
---

# Transformer Architecture

---

## Overview

The Transformer (Vaswani et al., 2017, "Attention Is All You Need") replaced
RNNs/LSTMs with attention mechanisms, enabling massive parallelism during
training and becoming the foundation of modern LLMs, vision models, and
multimodal systems.

---

## Architecture: Encoder-Decoder

```
  Full Transformer (original, e.g. for translation):
  
  Input tokens                    Output tokens (shifted right)
       │                                   │
  ┌────▼────────────────────────┐    ┌────▼─────────────────────────┐
  │        Encoder              │    │         Decoder              │
  │  (N=6 identical layers)     │    │  (N=6 identical layers)      │
  │                             │    │                              │
  │  Input Embedding            │    │  Output Embedding            │
  │  + Positional Encoding      │    │  + Positional Encoding       │
  │         │                   │    │         │                    │
  │  ┌──────▼──────┐            │    │  ┌──────▼──────┐            │
  │  │ Multi-Head  │            │    │  │  Masked MHA │ (causal)   │
  │  │ Self-Attn   │            │    │  └──────┬──────┘            │
  │  └──────┬──────┘            │    │         │                    │
  │  Add & Norm                 │    │  Add & Norm                  │
  │         │                   │    │         │                    │
  │  ┌──────▼──────┐            │◀───│  ┌──────▼──────┐            │
  │  │  Feed Fwd   │            │    │  │ Cross-Attn  │ (Q=dec,    │
  │  │  Network    │            │    │  │   MHA       │  K,V=enc)  │
  │  └──────┬──────┘            │    │  └──────┬──────┘            │
  │  Add & Norm                 │    │  Add & Norm                  │
  │    (× N layers)             │    │         │                    │
  └─────────────────────────────┘    │  ┌──────▼──────┐            │
                                     │  │  Feed Fwd   │            │
                                     │  └──────┬──────┘            │
                                     │  Add & Norm                  │
                                     │    (× N layers)              │
                                     └──────────────────────────────┘
                                                    │
                                           Linear + Softmax
                                                    │
                                           Output probabilities
```

Modern LLMs (GPT, Llama, Mistral) use **decoder-only** transformers —
no cross-attention, just causal self-attention + FFN.

---

## Multi-Head Attention (MHA)

```
  Multi-Head Attention with h heads:
  
  Input X ──▶ Wq ──▶ Q        (batch, seq_len, d_model)
           └▶ Wk ──▶ K
           └▶ Wv ──▶ V
  
  Split into h heads: each head sees d_k = d_model / h dimensions
  
  For each head i:
    head_i = softmax( Q_i · K_i^T / √d_k ) · V_i
  
  Concat(head_1, ..., head_h) · W_o → output
  
  Intuition: each head can learn to attend to different
  relationships (syntax, coreference, long-range dependencies)

  Complexity: O(seq_len² · d_model) — quadratic in sequence length!
```

---

## Positional Encoding

Since attention has no inherent notion of order, position is injected:

### Sinusoidal (original paper)

```
  PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
  PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
  
  Properties:
  - Each position has a unique encoding
  - Relative positions have constant offset in frequency space
  - Extrapolates to longer sequences than seen in training
```

### Rotary Position Embedding (RoPE)

Used in Llama, Mistral, Gemma:

```
  Instead of adding position to Q/K, rotate Q and K vectors
  by angle θ·pos before computing attention scores.
  
  Benefit: Relative position information naturally encoded in
  dot product Q·K — model can generalize to longer contexts
  with frequency scaling (YaRN, NTK-aware interpolation).
```

---

## Feed-Forward Network (FFN)

Each transformer layer contains a 2-layer MLP applied position-wise:

```python
class FFN(nn.Module):
    def __init__(self, d_model, d_ff):
        super().__init__()
        self.w1 = nn.Linear(d_model, d_ff)    # d_ff ≈ 4 × d_model
        self.w2 = nn.Linear(d_ff, d_model)

    def forward(self, x):
        return self.w2(F.gelu(self.w1(x)))     # GELU activation

# SwiGLU variant (Llama, PaLM):
class SwiGLU(nn.Module):
    def forward(self, x):
        gate = F.silu(self.w_gate(x))          # Sigmoid-weighted linear
        return self.w2(gate * self.w1(x))      # Gated activation
```

---

## KV Cache

During inference (autoregressive generation), past keys and values
are cached to avoid recomputation:

```
  Without KV cache:
  Token 1: compute K1,V1
  Token 2: compute K1,V1,K2,V2  ← recomputes K1,V1!
  Token n: compute K1..Kn, V1..Vn  ← O(n²) total compute

  With KV cache:
  Token 1: compute K1,V1, cache (K1,V1)
  Token 2: compute K2,V2 only, concat with cache → attend over 2 tokens
  Token n: compute Kn,Vn only, concat → O(n) compute per new token!

  Memory cost: 2 × n_layers × d_model × seq_len × precision
  For Llama-70B (4-bit), 4096 tokens: ~4 GB of KV cache
```

### Grouped Query Attention (GQA) / Multi-Query Attention (MQA)

Reduce KV cache memory by sharing K,V across multiple query heads:

```
  MHA:  Q=32 heads, K=32 heads, V=32 heads → full cache
  GQA:  Q=32 heads, K=8 heads, V=8 heads   → 4× cache reduction
  MQA:  Q=32 heads, K=1 head,  V=1 head    → 32× cache reduction
  
  Used by: Llama 2 (MHA), Mistral (GQA), Llama 3 (GQA)
```

---

## Mixture of Experts (MoE)

Replace the FFN with multiple "expert" networks, activating only a
subset per token (sparse activation):

```
  MoE layer:
  
  Token x ──▶ Router (softmax) ──▶ top-k gate scores
                                        │
                    ┌────────────────────┼────────────────┐
                    │                   │                │
              Expert 1             Expert 7          Expert k
              (FFN)                (FFN)             (FFN)
                    │                   │                │
                    └────────────────────┴────────────────┘
                                   (weighted sum)
  
  Total params: d_model × n_experts × d_ff
  Active params per token: d_model × k × d_ff  (k usually 2)
  
  Benefit: 8 experts × FFN params, but only 2 activate per token
  → Same compute as dense, but 8× parameters → better quality
  
  Models: Mixtral 8×7B, DeepSeek-V2, Grok-1, GPT-4 (rumored)
```

---

## Scaling Laws

```
  Chinchilla scaling law (Hoffmann et al., 2022):
  
  Optimal compute split:
  N (params) ≈ tokens / 20
  
  For 1e23 FLOPs (e.g., ~3 months on 512 A100s):
    Optimal model: ~10B params trained on ~200B tokens
  
  Key insight: many models were overtrained (too large, too few tokens)
  Llama 2 7B: 2T tokens — "over-trained" but ideal for inference
  
  Compute: C ≈ 6 × N × D  (FLOPs per forward + backward)
  where N = parameters, D = training tokens
```

---

## Key Terms

| Term | Definition |
|------|-----------|
| Attention | Weighted sum of values, where weights are query-key similarity |
| Self-attention | Q, K, V all derived from the same input sequence |
| Causal masking | Upper-triangle mask ensuring token i only attends to ≤ i |
| MHA | Multi-Head Attention — parallel attention heads |
| FFN | Feed-Forward Network — 2-layer MLP per position |
| Layer norm | Normalize activations per position (pre-norm: before attn/ffn) |
| RoPE | Rotary Position Embedding — relative position via rotation |
| KV cache | Cached keys/values for efficient autoregressive generation |
| GQA | Grouped Query Attention — shared K/V across query head groups |
| MoE | Mixture of Experts — sparse FFN with per-token routing |

---

## See Also

- AI/ML lab exercises → [../lessons/ml_labs.md](../lessons/ml_labs.md)
- ML tools → [../man_pages/ml_tools.md](../man_pages/ml_tools.md)
- Algorithm complexity → [../../17_Algorithms_DSA/lessons/dsa_labs.md](../../17_Algorithms_DSA/lessons/dsa_labs.md)
