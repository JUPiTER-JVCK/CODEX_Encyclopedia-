---
title: Logic Gates Explained
layer: 00d_Digital_Circuits
section: topics
tags: [logic-gates, boolean, truth-tables, combinational]
updated: 2026-05-20
source_image: ../../_assets/logic_gates_explained.png
v1_source: v1 collection — Math/Logic/Data › Logic › Boolean logic gates (HTML)
---

# Logic Gates Explained

> Canonical truth tables for the 8 basic Boolean gates, recreated from the
> "Logic Gates Explained" reference image. Together with their CMOS
> implementations these are the atomic units of every digital design above
> this layer.

## Unary gates

### YES (buffer)

```
       ┌─┐
   A ──│ ▷──── Y
       └─┘
```

| A | Y |
|---|---|
| 0 | 0 |
| 1 | 1 |

`Y = A`. A buffer is logically the identity, but electrically restores drive strength.

### NO (NOT / inverter)

```
       ┌─┐
   A ──│ ▷──○── Y
       └─┘
```

| A | Y |
|---|---|
| 0 | 1 |
| 1 | 0 |

`Y = ¬A`.

## Binary gates

### AND

```
   A ─┐
       ▷── Y
   B ─┘
```

| A | B | Y |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

`Y = A · B`. Output is 1 only when *all* inputs are 1.

### OR

```
   A ─┐
       ▷)─ Y
   B ─┘
```

| A | B | Y |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

`Y = A + B`. Output is 1 if *any* input is 1.

### XOR (exclusive OR)

| A | B | Y |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

`Y = A ⊕ B = A·¬B + ¬A·B`. Output is 1 if inputs differ. The arithmetic
bit-add primitive (carry handled separately).

### NAND

| A | B | Y |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

`Y = ¬(A · B)`. **Functionally complete** — any Boolean function can be built
from NAND alone. Reason: invert + AND + OR can all be derived from NAND.

### NOR

| A | B | Y |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 0 |

`Y = ¬(A + B)`. Also functionally complete on its own.

### XNOR (equivalence)

| A | B | Y |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

`Y = ¬(A ⊕ B)`. Output is 1 if inputs are equal — useful for comparators.

## Algebraic identities (Boolean algebra)

| Identity | Form |
|----------|------|
| Identity | A + 0 = A ; A · 1 = A |
| Null | A + 1 = 1 ; A · 0 = 0 |
| Idempotent | A + A = A ; A · A = A |
| Complement | A + ¬A = 1 ; A · ¬A = 0 |
| Double negation | ¬¬A = A |
| Commutative | A + B = B + A ; A · B = B · A |
| Associative | (A+B)+C = A+(B+C) ; (A·B)·C = A·(B·C) |
| Distributive | A·(B+C) = A·B + A·C ; A+(B·C) = (A+B)·(A+C) |
| **De Morgan I** | ¬(A · B) = ¬A + ¬B |
| **De Morgan II** | ¬(A + B) = ¬A · ¬B |
| Absorption | A + A·B = A ; A · (A+B) = A |
| Consensus | A·B + ¬A·C + B·C = A·B + ¬A·C |

## CMOS implementation note

Every gate above is built from complementary pairs of NMOS and PMOS transistors
(see [00b_Devices/topics](../../00b_Devices/topics/INDEX.md)):

- **NMOS pulldown network** to GND
- **PMOS pullup network** to VDD
- Series PMOS / parallel NMOS = NAND
- Parallel PMOS / series NMOS = NOR

XOR/XNOR are more expensive (8 transistors) so synthesis tools often build
them as AND-OR-INVERT combinations.

## Functional completeness — what you actually need

Any Boolean function can be built using only:
- `{AND, OR, NOT}` (the textbook set), **or**
- `{NAND}` alone, **or**
- `{NOR}` alone

That's why NAND/NOR are the most common standard-cell library primitives.

## Cross-references

- Transistor-level construction → [00b_Devices/topics](../../00b_Devices/topics/INDEX.md) (CMOS section)
- Built into adders / multiplexers → [topics/INDEX.md](INDEX.md) (combinational logic)
- Synthesized from HDL → [languages/INDEX.md](../languages/INDEX.md)
- Migrated from the v1 *Boolean logic gates* HTML reference; the truth
  tables above are the full transcription, so the original is not needed
- Source image: `_assets/logic_gates_explained.png` (drop the image here)
