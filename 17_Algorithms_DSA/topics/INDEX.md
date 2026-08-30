# Algorithms & DSA — Topics

> Companion to [canonical_lists.md](canonical_lists.md). Pattern cheatsheet.

## Complexity (Big-O)
- **O(1)** — hash lookup, array index
- **O(log n)** — binary search, balanced tree op
- **O(n)** — linear scan
- **O(n log n)** — comparison sort, divide-and-conquer
- **O(n²)** — nested loops, naive sort
- **O(n³)** — Floyd-Warshall, matrix multiply (naive)
- **O(2ⁿ)** — subsets, naive recursion
- **O(n!)** — permutations
- **Amortized** — dynamic array push = O(1) amortized
- **Space-time tradeoff** — memoization, hash maps

## Data structures
- **Array, dynamic array, string**
- **Linked list** — singly/doubly/circular; sentinel nodes
- **Stack, queue, deque, monotonic stack/queue**
- **Hash map / set** — open addressing vs chaining; load factor
- **Heap / priority queue** — binary heap, d-ary, Fibonacci (theoretical)
- **Tree** — BST, AVL, Red-Black, B/B+, segment tree, Fenwick (BIT)
- **Trie** — prefix tree; suffix tree/array
- **Union-Find (DSU)** — path compression + union by rank/size
- **Graph** — adjacency list / matrix; weighted; directed
- **Bloom filter, Cuckoo filter, HyperLogLog** — approximate
- **Skip list** — probabilistic balanced
- **Disjoint set** = union-find synonym

## Sorting
- **Comparison** — merge sort, quicksort (intro/quick3), heapsort, Timsort (Python/Java)
- **Linear-time** — counting sort, radix sort, bucket sort
- **Stable vs unstable**
- **In-place vs not**

## Searching
- **Linear**, **binary**, **ternary**, **exponential**, **interpolation**
- **Binary search on the answer** (parametric search) — a power pattern

## Two-pointer / sliding window patterns
- Fixed-size window
- Variable window (shrink while condition violated)
- Fast/slow pointers (cycle detection — Floyd)
- Opposite-end pointers (Two Sum II, 3Sum)

## Recursion & backtracking
- Decision tree: include/exclude, pick-next
- Pruning: early return on infeasible
- Permutations vs combinations vs subsets

## Dynamic programming
- **Recipe**: state, transition, base, order
- **Top-down (memo)** vs **bottom-up (tabulation)**
- **Space optimization** — keep only last row(s)
- **Common patterns** — knapsack 0/1, unbounded, LIS, LCS, edit distance, partition, interval, bitmask DP, tree DP, digit DP

## Greedy
- Local optimum → global; prove with exchange argument
- Often paired with sorting

## Graph algorithms
- **Traversal** — BFS, DFS (iterative + recursive)
- **Shortest path** — Dijkstra (positive weights), Bellman-Ford (neg ok), Floyd-Warshall (all pairs), 0-1 BFS, A*
- **MST** — Kruskal (with DSU), Prim
- **Topological sort** — Kahn's BFS, DFS post-order
- **SCC** — Tarjan, Kosaraju
- **Bridges / articulation points** — Tarjan
- **Max flow** — Ford-Fulkerson / Edmonds-Karp / Dinic
- **Bipartite matching** — Hungarian, Hopcroft-Karp
- **Eulerian path** — Hierholzer

## Bit manipulation
- `x & (x-1)` clears lowest set bit
- `x & -x` isolates lowest set bit
- Popcount, parity
- Bitmask DP
- XOR tricks (Single Number, swap without temp)

## Strings
- KMP / Z-function for pattern matching
- Rabin-Karp (rolling hash)
- Aho-Corasick (multi-pattern)
- Manacher's (longest palindrome)
- Suffix array / suffix automaton

## Math / number theory
- GCD/LCM, Euclidean
- Sieve of Eratosthenes; segmented sieve
- Modular exponentiation, modular inverse
- Combinatorics — nCr mod p
- Matrix exponentiation (Fibonacci in O(log n))
- FFT/NTT (advanced)

## Interview workflow
1. **Clarify** — input range, constraints, output format, edge cases
2. **Examples** — work 1–2 by hand
3. **Brute force** — state it, note O(...)
4. **Optimize** — pattern match, ID DS that gives better complexity
5. **Code** — clean, named vars, test as you go
6. **Test** — example + edge cases (empty, single, max)
7. **Complexity** — time & space, clearly stated
