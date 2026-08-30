---
title: "AI / ML — Interactive Labs"
layer: 15_AI_ML
section: lessons
tags: [lesson, ai, ml, pytorch, mnist, attention, onnx, lab, quiz, hands-on]
updated: 2026-05-21
---

# AI / ML — Interactive Labs

---

## Module 1: PyTorch MNIST Classifier

### Objective

Build, train, and evaluate a convolutional neural network on MNIST,
understanding the full training loop and evaluation metrics.

### Prerequisites

```bash
pip install torch torchvision matplotlib
```

### Lab Steps

1. Load and explore MNIST:
```python
import torch
import torchvision
import torchvision.transforms as transforms

transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,))  # MNIST mean/std
])

train_ds = torchvision.datasets.MNIST('./data', train=True,
                                       download=True, transform=transform)
test_ds  = torchvision.datasets.MNIST('./data', train=False,
                                       download=True, transform=transform)

train_loader = torch.utils.data.DataLoader(train_ds, batch_size=64, shuffle=True)
test_loader  = torch.utils.data.DataLoader(test_ds,  batch_size=1000)

print(f"Train: {len(train_ds)}, Test: {len(test_ds)}")
print(f"Image shape: {train_ds[0][0].shape}")  # [1, 28, 28]
```

2. Define the model:
```python
import torch.nn as nn
import torch.nn.functional as F

class ConvNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 32, 3, 1)   # 1-channel → 32 filters, 3x3
        self.conv2 = nn.Conv2d(32, 64, 3, 1)  # 32 → 64 filters
        self.dropout1 = nn.Dropout(0.25)
        self.dropout2 = nn.Dropout(0.5)
        self.fc1 = nn.Linear(9216, 128)
        self.fc2 = nn.Linear(128, 10)

    def forward(self, x):
        x = F.relu(self.conv1(x))
        x = F.relu(self.conv2(x))
        x = F.max_pool2d(x, 2)
        x = self.dropout1(x)
        x = torch.flatten(x, 1)
        x = F.relu(self.fc1(x))
        x = self.dropout2(x)
        return self.fc2(x)

model = ConvNet()
print(f"Parameters: {sum(p.numel() for p in model.parameters()):,}")
```

3. Training loop:
```python
import torch.optim as optim

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
optimizer = optim.Adam(model.parameters(), lr=1e-3)
criterion = nn.CrossEntropyLoss()

def train_epoch(model, loader, optimizer):
    model.train()
    total_loss = 0
    for batch_idx, (data, target) in enumerate(loader):
        data, target = data.to(device), target.to(device)
        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    return total_loss / len(loader)

def evaluate(model, loader):
    model.eval()
    correct = 0
    with torch.no_grad():
        for data, target in loader:
            data, target = data.to(device), target.to(device)
            output = model(data)
            correct += (output.argmax(1) == target).sum().item()
    return correct / len(loader.dataset)

for epoch in range(5):
    loss = train_epoch(model, train_loader, optimizer)
    acc  = evaluate(model, test_loader)
    print(f"Epoch {epoch+1}: loss={loss:.4f}, test_acc={acc:.4f}")

# Expected: ~99% accuracy after 5 epochs
```

4. Save and inspect:
```python
torch.save(model.state_dict(), 'mnist_cnn.pt')

# Inspect weights
for name, param in model.named_parameters():
    print(f"{name:30s}: {param.shape}, mean={param.data.mean():.4f}")
```

```
  ConvNet architecture:
  Input [1,28,28]
      │
  conv1 [32,3,3] → ReLU → [32,26,26]
      │
  conv2 [64,3,3] → ReLU → [64,24,24]
      │
  MaxPool2d(2) → [64,12,12] → flatten → [9216]
      │
  fc1 [128] → ReLU → Dropout
      │
  fc2 [10] → CrossEntropyLoss
```

### Knowledge Check

**Q1**: What does `optimizer.zero_grad()` do and why is it needed?

> **A1**: PyTorch accumulates gradients in `.grad` tensors by default.
> Without zeroing, gradients from the previous batch add to the current
> batch's gradients — the update becomes a sum over all past batches,
> not just the current one. Zero_grad resets `.grad` to zero before
> each backward pass.

**Q2**: What is the role of Dropout during training vs inference?

> **A2**: During training, Dropout randomly zeros neurons with probability p,
> forcing the network to learn redundant representations and preventing
> co-adaptation (overfitting). During `model.eval()`, Dropout is disabled
> — all neurons are active and outputs are scaled appropriately.

---

## Module 2: Attention Visualization

### Objective

Implement scaled dot-product attention from scratch, visualize attention
weights, and understand how transformers select relevant tokens.

### Lab Steps

1. Implement scaled dot-product attention:
```python
import torch
import torch.nn.functional as F
import matplotlib.pyplot as plt
import seaborn as sns

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q, K, V: [batch, heads, seq_len, d_k]
    Returns: output [batch, heads, seq_len, d_v], weights [batch, heads, seq, seq]
    """
    d_k = Q.size(-1)
    # Attention scores: how much each query attends to each key
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    weights = F.softmax(scores, dim=-1)
    output = torch.matmul(weights, V)
    return output, weights

# Example: sentence "The cat sat on the mat"
tokens = ["The", "cat", "sat", "on", "the", "mat"]
seq_len = len(tokens)
d_k = 8

# Random Q, K, V for demonstration
torch.manual_seed(42)
Q = torch.randn(1, 1, seq_len, d_k)
K = torch.randn(1, 1, seq_len, d_k)
V = torch.randn(1, 1, seq_len, d_k)

output, weights = scaled_dot_product_attention(Q, K, V)
print(f"Output shape: {output.shape}")
print(f"Weights shape: {weights.shape}")
```

2. Visualize attention weights:
```python
attn = weights.squeeze().detach().numpy()

plt.figure(figsize=(8, 6))
sns.heatmap(attn, xticklabels=tokens, yticklabels=tokens,
            cmap='Blues', annot=True, fmt='.2f')
plt.title("Attention weights (query → key)")
plt.ylabel("Query (attender)")
plt.xlabel("Key (attended to)")
plt.tight_layout()
plt.savefig("attention_heatmap.png")
plt.show()
```

3. Causal (masked) attention — for decoder self-attention:
```python
# Create causal mask: token i can only attend to tokens 0..i
causal_mask = torch.tril(torch.ones(seq_len, seq_len)).unsqueeze(0).unsqueeze(0)
output_causal, weights_causal = scaled_dot_product_attention(Q, K, V, mask=causal_mask)

# Compare: without mask (bidirectional) vs with mask (causal)
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
sns.heatmap(weights.squeeze().detach().numpy(), ax=ax1,
            xticklabels=tokens, yticklabels=tokens, cmap='Blues')
ax1.set_title("Bidirectional (encoder)")
sns.heatmap(weights_causal.squeeze().detach().numpy(), ax=ax2,
            xticklabels=tokens, yticklabels=tokens, cmap='Blues')
ax2.set_title("Causal (decoder)")
plt.savefig("attention_comparison.png")
```

```
  Attention score computation:
  
  Q · Kᵀ           Scores         Softmax       Weights
  ┌────────┐      ┌────────┐      ┌────────┐    ┌────────┐
  │Q[0]·K⊤│  /√d  │ 2.1    │  →   │ 0.42   │ ×V │output  │
  │Q[1]·K⊤│  ──▸  │-0.3    │  →   │ 0.20   │  = │        │
  │Q[2]·K⊤│      │ 1.7    │      │ 0.38   │    │        │
  └────────┘      └────────┘      └────────┘    └────────┘
```

### Knowledge Check

**Q1**: Why divide by √d_k in scaled dot-product attention?

> **A1**: When d_k is large, dot products grow in magnitude (variance scales
> with d_k). Large values push softmax into saturation regions where
> gradients become extremely small. Dividing by √d_k normalizes the scores
> to unit variance, keeping softmax in a reasonable operating range.

**Q2**: What is the difference between self-attention and cross-attention?

> **A2**: In self-attention, Q, K, and V all come from the same sequence
> — each token attends to other tokens in the same sequence.
> In cross-attention (encoder-decoder), Q comes from the decoder and K, V
> come from the encoder — the decoder learns which encoder positions are
> relevant for generating each output token.

---

## Module 3: ONNX Export and Inference

### Objective

Export a trained PyTorch model to ONNX format, validate the export,
and run inference using ONNX Runtime.

### Lab Steps

1. Export to ONNX:
```python
import torch
import torch.onnx

# Load the trained model from Module 1
model.eval()

# Dummy input matching the model's expected shape
dummy_input = torch.randn(1, 1, 28, 28)

# Export
torch.onnx.export(
    model,
    dummy_input,
    "mnist_cnn.onnx",
    input_names=["image"],
    output_names=["logits"],
    dynamic_axes={"image": {0: "batch_size"}, "logits": {0: "batch_size"}},
    opset_version=17,
    verbose=False
)
print("Exported to mnist_cnn.onnx")
```

2. Validate ONNX model:
```bash
pip install onnx onnxruntime
```
```python
import onnx

model_proto = onnx.load("mnist_cnn.onnx")
onnx.checker.check_model(model_proto)
print(f"ONNX model valid: {len(model_proto.graph.node)} nodes")
print(f"Inputs: {[i.name for i in model_proto.graph.input]}")
print(f"Outputs: {[o.name for o in model_proto.graph.output]}")
```

3. Run inference with ONNX Runtime:
```python
import onnxruntime as ort
import numpy as np

# Create inference session
session = ort.InferenceSession("mnist_cnn.onnx")
input_name  = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name

# Run on test image
sample_img, sample_label = test_ds[0]
input_arr = sample_img.unsqueeze(0).numpy()  # [1, 1, 28, 28]

logits = session.run([output_name], {input_name: input_arr})[0]
pred = np.argmax(logits, axis=1)[0]
print(f"True label: {sample_label}, Predicted: {pred}")
```

4. Compare PyTorch vs ONNX Runtime outputs:
```python
with torch.no_grad():
    pt_out = model(sample_img.unsqueeze(0)).numpy()

ort_out = session.run([output_name], {input_name: input_arr})[0]

max_diff = np.abs(pt_out - ort_out).max()
print(f"Max output difference: {max_diff:.2e}")
# Should be < 1e-5 (numerical precision only)
```

### Review Flashcards

| Term | Definition |
|------|-----------|
| CNN | Convolutional Neural Network — learns local spatial features |
| Gradient | Partial derivative of loss w.r.t. each parameter |
| Backpropagation | Chain rule applied to compute gradients layer by layer |
| Learning rate | Step size for parameter updates (too high = diverge, too low = slow) |
| Overfitting | Model memorizes training data, generalizes poorly |
| Dropout | Regularization: randomly zero neurons during training |
| ONNX | Open Neural Network Exchange — cross-framework model format |
| ONNX Runtime | High-performance inference engine for ONNX models |
| Attention | Mechanism for dynamic, content-based token weighting |
| Softmax | Normalizes logits to probability distribution |

### Challenge

> Fine-tune a pretrained BERT model (from HuggingFace) on the SST-2
> sentiment dataset. Export to ONNX, quantize to INT8 with ONNX Runtime
> quantization tools, and measure the speedup vs FP32 on CPU.
> Target: < 10ms inference latency per sentence.

---

## Cross-links

- ML tools → [../man_pages/ml_tools.md](../man_pages/ml_tools.md)
- GPU hardware → [../../02_CPU/man_pages/cpu_inspection.md](../../02_CPU/man_pages/cpu_inspection.md)
- Transformer architecture → [../topics/transformer_architecture.md](../topics/transformer_architecture.md)
