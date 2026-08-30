# Algorithms & DSA — Languages (pick one)

## Quick recommendation
| Goal | Pick |
|------|------|
| Get hired (most companies) | **Python** |
| FAANG-style + system design | **Python** or **Java** |
| Competitive programming | **C++** (STL is unbeatable) |
| Big Tech systems roles | **Go** or **C++** |
| Personal preference + speed | whichever you can code without thinking |

## Python — what you actually need
```python
from collections import Counter, defaultdict, deque, OrderedDict
from heapq import heappush, heappop, heapify, nlargest, nsmallest
from bisect import bisect_left, bisect_right, insort
from functools import lru_cache, cache, reduce, cmp_to_key
from itertools import combinations, permutations, product, accumulate, chain, groupby
from math import inf, gcd, lcm, isqrt, comb, perm
from typing import List, Dict, Optional
```

- `dict` is ordered (3.7+)
- `set` literals: `{1,2,3}`
- f-strings + walrus operator (`:=`)
- `sorted(...)` stable, `lambda x: (x[0], -x[1])` for compound keys
- `nonlocal` for closure mutation
- For DFS recursion past depth ~1000: `sys.setrecursionlimit(10**6)`

## C++ — what you actually need
```cpp
#include <bits/stdc++.h>          // catch-all (GCC)
using namespace std;
using ll = long long;
using vi = vector<int>;
```

- `unordered_map` / `unordered_set` for O(1) avg
- `map` / `set` for ordered (lower_bound, upper_bound)
- `priority_queue<int, vector<int>, greater<>>` for min-heap
- `gcc-specific`: `__builtin_popcount`, `__builtin_clz`, `__lg`
- `auto& [k, v] : map` structured bindings
- `ios_base::sync_with_stdio(false); cin.tie(nullptr);` for fast I/O

## Java — what you actually need
```java
import java.util.*;
import java.util.stream.*;
```

- `ArrayList` / `LinkedList` / `ArrayDeque` (NOT `Stack` — it's synchronized)
- `HashMap` / `LinkedHashMap` / `TreeMap`
- `PriorityQueue` (min-heap by default)
- `int[]` is faster than `Integer[]` for primitives
- `String.toCharArray()` for char ops

## Go — what you actually need
- `container/heap` + `container/list` (less ergonomic than C++/Python)
- `sort.Slice` for inline sort
- `map[K]V` zero value is nil — careful
- No generics in old code; modern code uses Go 1.18+ generics
- Verbose but very readable; few "gotchas"

## Other
- **Rust** — best for the discipline, slower in interview clock
- **Kotlin** — Java with less noise
- **JavaScript / TypeScript** — fine on LC, less common in interviews outside web
- **Swift** — fine but small interview audience

## Cross-link
- Runtime characteristics → [07_Runtime_Environment/topics](../../07_Runtime_Environment/topics/INDEX.md)
- Why CPython is slow → [02_CPU/topics](../../02_CPU/topics/INDEX.md) + GIL note in [07](../../07_Runtime_Environment/)
