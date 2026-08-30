---
title: Canonical 100-problem study list
layer: 17_Algorithms_DSA
section: topics
tags: [leetcode, blind75, neetcode, study-plan]
updated: 2026-05-20
authoritative_source: ../references/100_leetcode_problems.pdf
---

# Canonical 100-problem study list (pattern-first companion)

> The **authoritative PDF-derived list** now lives in [100_must_do.md](100_must_do.md)
> — extracted from `references/100_leetcode_problems.pdf` with all 100 problems
> mapped to their LeetCode numbers and titles.
>
> This file is the **pattern-first companion**. Use it to walk through the
> same problem space organized by *recurring solution patterns* (Blind 75 /
> NeetCode 150 progression) rather than by topic. Many of the buckets below
> overlap with the PDF's sections — the two views reinforce each other.

## How to use

1. Open the anchor PDF and treat its order as authoritative.
2. Tick off each problem in the matching pattern bucket below.
3. After each bucket, write one paragraph in `lessons/notes_<bucket>.md` about
   what the bucket's recurring trick is — that's how patterns stick.

## Pattern buckets (covers ~95 % of medium interview problems)

### Arrays & Hashing
- Two Sum (1)
- Contains Duplicate (217)
- Valid Anagram (242)
- Group Anagrams (49)
- Top K Frequent Elements (347)
- Product of Array Except Self (238)
- Longest Consecutive Sequence (128)
- Encode and Decode Strings (271)

### Two Pointers
- Valid Palindrome (125)
- Two Sum II — Input Array Is Sorted (167)
- 3Sum (15)
- Container With Most Water (11)
- Trapping Rain Water (42)

### Sliding Window
- Best Time to Buy and Sell Stock (121)
- Longest Substring Without Repeating Characters (3)
- Longest Repeating Character Replacement (424)
- Permutation in String (567)
- Minimum Window Substring (76)
- Sliding Window Maximum (239)

### Stack
- Valid Parentheses (20)
- Min Stack (155)
- Evaluate Reverse Polish Notation (150)
- Generate Parentheses (22)
- Daily Temperatures (739)
- Car Fleet (853)
- Largest Rectangle in Histogram (84)

### Binary Search
- Binary Search (704)
- Search a 2D Matrix (74)
- Koko Eating Bananas (875)
- Find Minimum in Rotated Sorted Array (153)
- Search in Rotated Sorted Array (33)
- Time Based Key-Value Store (981)
- Median of Two Sorted Arrays (4)

### Linked List
- Reverse Linked List (206)
- Merge Two Sorted Lists (21)
- Reorder List (143)
- Remove Nth Node From End of List (19)
- Copy List with Random Pointer (138)
- Add Two Numbers (2)
- Linked List Cycle (141)
- Find the Duplicate Number (287)
- LRU Cache (146)
- Merge K Sorted Lists (23)
- Reverse Nodes in K-Group (25)

### Trees
- Invert Binary Tree (226)
- Maximum Depth of Binary Tree (104)
- Diameter of Binary Tree (543)
- Balanced Binary Tree (110)
- Same Tree (100)
- Subtree of Another Tree (572)
- Lowest Common Ancestor of a BST (235)
- Binary Tree Level Order Traversal (102)
- Binary Tree Right Side View (199)
- Count Good Nodes in Binary Tree (1448)
- Validate Binary Search Tree (98)
- Kth Smallest Element in a BST (230)
- Construct Binary Tree from Preorder and Inorder Traversal (105)
- Binary Tree Maximum Path Sum (124)
- Serialize and Deserialize Binary Tree (297)

### Tries
- Implement Trie (208)
- Design Add and Search Words (211)
- Word Search II (212)

### Heap / Priority Queue
- Kth Largest Element in a Stream (703)
- Last Stone Weight (1046)
- K Closest Points to Origin (973)
- Kth Largest Element in an Array (215)
- Task Scheduler (621)
- Design Twitter (355)
- Find Median from Data Stream (295)

### Backtracking
- Subsets (78)
- Combination Sum (39)
- Permutations (46)
- Subsets II (90)
- Combination Sum II (40)
- Word Search (79)
- Palindrome Partitioning (131)
- Letter Combinations of a Phone Number (17)
- N-Queens (51)

### Graphs
- Number of Islands (200)
- Clone Graph (133)
- Max Area of Island (695)
- Pacific Atlantic Water Flow (417)
- Surrounded Regions (130)
- Rotting Oranges (994)
- Walls and Gates (286)
- Course Schedule (207)
- Course Schedule II (210)
- Redundant Connection (684)
- Number of Connected Components in an Undirected Graph (323)
- Graph Valid Tree (261)
- Word Ladder (127)

### Advanced Graphs
- Reconstruct Itinerary (332)
- Min Cost to Connect All Points (1584)
- Network Delay Time (743)
- Swim in Rising Water (778)
- Alien Dictionary (269)
- Cheapest Flights Within K Stops (787)

### 1-D Dynamic Programming
- Climbing Stairs (70)
- Min Cost Climbing Stairs (746)
- House Robber (198)
- House Robber II (213)
- Longest Palindromic Substring (5)
- Palindromic Substrings (647)
- Decode Ways (91)
- Coin Change (322)
- Maximum Product Subarray (152)
- Word Break (139)
- Longest Increasing Subsequence (300)
- Partition Equal Subset Sum (416)

### 2-D Dynamic Programming
- Unique Paths (62)
- Longest Common Subsequence (1143)
- Best Time to Buy and Sell Stock with Cooldown (309)
- Coin Change II (518)
- Target Sum (494)
- Interleaving String (97)
- Longest Increasing Path in a Matrix (329)
- Distinct Subsequences (115)
- Edit Distance (72)
- Burst Balloons (312)
- Regular Expression Matching (10)

### Greedy
- Maximum Subarray (53)
- Jump Game (55)
- Jump Game II (45)
- Gas Station (134)
- Hand of Straights (846)
- Merge Triplets to Form Target Triplet (1899)
- Partition Labels (763)
- Valid Parenthesis String (678)

### Intervals
- Insert Interval (57)
- Merge Intervals (56)
- Non-overlapping Intervals (435)
- Meeting Rooms (252)
- Meeting Rooms II (253)
- Minimum Interval to Include Each Query (1851)

### Math & Geometry
- Rotate Image (48)
- Spiral Matrix (54)
- Set Matrix Zeroes (73)
- Happy Number (202)
- Plus One (66)
- Pow(x, n) (50)
- Multiply Strings (43)
- Detect Squares (2013)

### Bit Manipulation
- Single Number (136)
- Number of 1 Bits (191)
- Counting Bits (338)
- Reverse Bits (190)
- Missing Number (268)
- Sum of Two Integers (371)
- Reverse Integer (7)

## Recovery: when the PDF is decoded
- Install poppler (`brew install poppler` — needs `sudo chown -R mb_pro /usr/local/share/man/man8` first)
- Re-read the PDF with the Read tool
- Reconcile against this list; mark any that aren't in the PDF and any in the PDF not above
- Promote each *that is in the user's PDF* to a `solutions/<id>_<slug>.md` file with explanation + code

## Cross-link
- Pattern-by-pattern study path → [lessons/INDEX.md](../lessons/INDEX.md)
- Language-specific notes → [languages/INDEX.md](../languages/INDEX.md)
