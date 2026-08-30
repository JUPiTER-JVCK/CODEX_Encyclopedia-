---
title: "Algorithms & DSA — Interactive Labs"
layer: 17_Algorithms_DSA
section: lessons
tags: [lesson, algorithms, dsa, big-o, binary-search, graph, dp, lab, quiz, hands-on]
updated: 2026-05-21
---

# Algorithms & DSA — Interactive Labs

---

## Module 1: Big-O Measurement

### Objective

Empirically measure algorithm runtime to verify Big-O complexity
predictions, understanding the constant-factor difference between classes.

### Lab Steps

1. Measure linear vs quadratic growth:
```python
import time
import random
import matplotlib.pyplot as plt

def linear_search(arr, target):
    for i, x in enumerate(arr):
        if x == target:
            return i
    return -1

def bubble_sort(arr):
    n = len(arr)
    arr = arr[:]
    for i in range(n):
        for j in range(n - i - 1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

sizes = [100, 500, 1000, 2000, 5000]
linear_times = []
quadratic_times = []

for n in sizes:
    arr = list(range(n))
    random.shuffle(arr)
    target = arr[-1]

    t0 = time.perf_counter()
    for _ in range(100):
        linear_search(arr, target)
    linear_times.append((time.perf_counter() - t0) / 100)

    t0 = time.perf_counter()
    bubble_sort(arr)
    quadratic_times.append(time.perf_counter() - t0)

plt.loglog(sizes, linear_times, 'b-o', label='O(n) linear search')
plt.loglog(sizes, quadratic_times, 'r-o', label='O(n²) bubble sort')
plt.xlabel('Input size n')
plt.ylabel('Time (seconds)')
plt.title('Big-O empirical verification (log-log plot)')
plt.legend()
plt.grid(True)
plt.savefig('big_o_comparison.png')
print("Slope on log-log plot ≈ Big-O exponent")
```

2. Verify O(n log n) sorting:
```python
import math

sort_times = []
for n in sizes:
    arr = list(range(n))
    random.shuffle(arr)
    t0 = time.perf_counter()
    sorted(arr)  # Python's Timsort: O(n log n)
    sort_times.append(time.perf_counter() - t0)

# Compare measured time to n*log(n) model
for n, t in zip(sizes, sort_times):
    predicted = n * math.log2(n)
    print(f"n={n:5d}: t={t*1e6:.1f}µs, n·log₂n={predicted:.0f}, ratio={t*1e6/predicted:.4f}")
# ratio should be roughly constant (same O class)
```

```
  Big-O complexity chart:
  ┌────────────┬────────────┬──────────────────────────────┐
  │ Class      │ n=1000     │ Example algorithms           │
  ├────────────┼────────────┼──────────────────────────────┤
  │ O(1)       │ 1          │ Hash lookup, array index     │
  │ O(log n)   │ 10         │ Binary search, BST lookup    │
  │ O(n)       │ 1,000      │ Linear search, array scan    │
  │ O(n log n) │ 10,000     │ Merge sort, Timsort, heapsort│
  │ O(n²)      │ 1,000,000  │ Bubble sort, naive string    │
  │ O(2ⁿ)      │ 10^301     │ Naive subset enumeration     │
  └────────────┴────────────┴──────────────────────────────┘
```

### Knowledge Check

**Q1**: Binary search is O(log n). What does that mean concretely for n=1,000,000?

> **A1**: log₂(1,000,000) ≈ 20. So binary search finds any element in a
> million-item sorted list in at most 20 comparisons. Linear search might
> need up to 1,000,000. This is the practical power of logarithmic complexity.

**Q2**: Why is amortized O(1) different from worst-case O(1)?

> **A2**: A dynamic array (Python list) append is O(1) amortized: most
> appends are O(1), but occasionally the array doubles in size (O(n) copy).
> Amortized analysis spreads the occasional expensive operation over many
> cheap ones. The total cost of n appends is O(n), so cost per operation
> averages O(1) even though individual operations can be O(n).

---

## Module 2: Binary Search and Sorted Structures

### Objective

Implement binary search and apply it to a real problem: searching in
rotated sorted arrays and finding insertion positions.

### Lab Steps

1. Classic binary search with invariant analysis:
```python
def binary_search(arr, target):
    """
    Invariant: target is in arr[lo..hi] if it exists.
    Returns index of target, or -1 if not found.
    """
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2  # Avoids integer overflow vs (lo+hi)//2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

# Test
arr = list(range(0, 100, 2))  # [0, 2, 4, ..., 98]
print(binary_search(arr, 42))   # 21
print(binary_search(arr, 43))   # -1

# Verify all elements
for x in arr:
    assert binary_search(arr, x) != -1, f"Miss: {x}"
print("All elements found correctly")
```

2. Find insertion position (bisect):
```python
import bisect

arr = [1, 3, 5, 7, 9]
# Where would 6 go to keep sorted?
pos = bisect.bisect_left(arr, 6)
print(f"Insert 6 at index {pos}: {arr[:pos] + [6] + arr[pos:]}")

# Implement bisect_left manually:
def bisect_left(arr, target):
    lo, hi = 0, len(arr)
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo
```

3. Search in rotated sorted array:
```python
def search_rotated(arr, target):
    """
    [4,5,6,7,0,1,2] was originally sorted, then rotated.
    One half is always sorted — binary search on that half.
    """
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        if arr[lo] <= arr[mid]:  # Left half is sorted
            if arr[lo] <= target < arr[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:  # Right half is sorted
            if arr[mid] < target <= arr[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1

tests = [
    ([4,5,6,7,0,1,2], 0, 4),
    ([4,5,6,7,0,1,2], 3, -1),
    ([1], 0, -1),
]
for arr, target, expected in tests:
    result = search_rotated(arr, target)
    status = "✓" if result == expected else "✗"
    print(f"{status} search_rotated({arr}, {target}) = {result} (expected {expected})")
```

---

## Module 3: Graph Traversal and Dynamic Programming

### Objective

Implement BFS and DFS on a graph, then solve the classic knapsack
problem with dynamic programming, tracing the DP table.

### Lab Steps

1. Build a graph and run BFS:
```python
from collections import deque, defaultdict

class Graph:
    def __init__(self):
        self.adj = defaultdict(list)

    def add_edge(self, u, v):
        self.adj[u].append(v)
        self.adj[v].append(u)  # Undirected

    def bfs(self, start):
        """Returns BFS traversal order and parent map (for path reconstruction)."""
        visited = {start}
        parent = {start: None}
        queue = deque([start])
        order = []
        while queue:
            node = queue.popleft()
            order.append(node)
            for neighbor in sorted(self.adj[node]):
                if neighbor not in visited:
                    visited.add(neighbor)
                    parent[neighbor] = node
                    queue.append(neighbor)
        return order, parent

    def dfs(self, start, visited=None):
        """Returns DFS traversal order (recursive)."""
        if visited is None:
            visited = set()
        visited.add(start)
        result = [start]
        for neighbor in sorted(self.adj[start]):
            if neighbor not in visited:
                result.extend(self.dfs(neighbor, visited))
        return result

g = Graph()
edges = [(1,2),(1,3),(2,4),(2,5),(3,6),(4,7)]
for u, v in edges:
    g.add_edge(u, v)

bfs_order, parents = g.bfs(1)
print(f"BFS from 1: {bfs_order}")

dfs_order = g.dfs(1)
print(f"DFS from 1: {dfs_order}")

# Reconstruct shortest path from BFS tree
def path(parent, target):
    p = []
    while target is not None:
        p.append(target)
        target = parent[target]
    return p[::-1]

print(f"Shortest path 1→7: {path(parents, 7)}")
```

2. Knapsack with DP — trace the table:
```python
def knapsack(weights, values, capacity):
    """
    0/1 knapsack: can take each item at most once.
    dp[i][w] = max value using first i items with capacity w.
    """
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacity + 1):
            # Don't take item i
            dp[i][w] = dp[i-1][w]
            # Take item i (if it fits)
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w],
                               dp[i-1][w - weights[i-1]] + values[i-1])

    # Backtrack to find which items were taken
    items_taken = []
    w = capacity
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i-1][w]:
            items_taken.append(i - 1)
            w -= weights[i - 1]

    return dp[n][capacity], list(reversed(items_taken))

weights = [2, 3, 4, 5]
values  = [3, 4, 5, 6]
capacity = 8
max_val, taken = knapsack(weights, values, capacity)
print(f"Max value: {max_val}")
print(f"Items taken: {taken} → weights={[weights[i] for i in taken]}, values={[values[i] for i in taken]}")
```

```
  Knapsack DP table (capacity=8, items: w=[2,3,4,5] v=[3,4,5,6]):
  
       cap: 0  1  2  3  4  5  6  7  8
  item 0:   0  0  0  0  0  0  0  0  0
  item 1:   0  0  3  3  3  3  3  3  3
  item 2:   0  0  3  4  4  7  7  7  7
  item 3:   0  0  3  4  5  7  8  9  9
  item 4:   0  0  3  4  5  7  8  9  9
                                    ↑ answer=9
```

### Review Flashcards

| Term | Definition |
|------|-----------|
| Big-O | Upper bound on algorithm's growth rate as n → ∞ |
| Amortized O(1) | Average O(1) over sequence of operations, not worst-case |
| Binary search | O(log n) search on sorted array using divide-and-conquer |
| BFS | Breadth-First Search — visits level by level, finds shortest path |
| DFS | Depth-First Search — goes deep first, uses stack/recursion |
| Memoization | Cache subproblem results to avoid recomputation (top-down DP) |
| Tabulation | Build DP table bottom-up from base cases |
| 0/1 Knapsack | Take each item at most once — O(n·W) DP solution |
| Invariant | Property that holds at every iteration of a loop |
| Optimal substructure | Optimal solution contains optimal solutions to subproblems |

### Challenge

> Implement Dijkstra's shortest path algorithm with a priority queue.
> Generate a random weighted graph with 1000 nodes and 5000 edges.
> Compare runtime against Bellman-Ford. Introduce a negative-weight
> edge — observe Dijkstra's failure and Bellman-Ford's correct result.
> Plot runtime vs graph density.

---

## Cross-links

- Kernel scheduler (fair-queue algorithms) → [../../05_OS_Kernel/topics/INDEX.md](../../05_OS_Kernel/topics/INDEX.md)
- ML model complexity → [../../15_AI_ML/lessons/ml_labs.md](../../15_AI_ML/lessons/ml_labs.md)
- Network routing algorithms → [../../Network/11_Network_Internet/protocols/INDEX.md](../../Network/11_Network_Internet/protocols/INDEX.md)
