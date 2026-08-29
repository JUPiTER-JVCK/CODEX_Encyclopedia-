---
title: 100 Must Do LeetCode Problems
layer: 17_Algorithms_DSA
section: topics
tags: [leetcode, must-do-100, bosscoder, interview-prep]
updated: 2026-05-20
source_pdf: ../references/100_leetcode_problems.pdf
source: Bosscoder Academy — "100 Must Do LeetCode Problems"
---

# 100 Must Do LeetCode Problems

> Authoritative transcription from `references/100_leetcode_problems.pdf`
> (Bosscoder Academy, 36 pages, image-rendered problem statements extracted
> via `pdftoppm` + multimodal Read).
>
> Each entry below carries:
> - The PDF's section + position
> - A short description (paraphrased from the PDF)
> - The matching **LeetCode problem number + title** (best-effort match
>   from the description)
>
> The pattern map / Blind 75-style progression is in
> [canonical_lists.md](canonical_lists.md) as the study-order companion.

---

## 1. ARRAYS

| # | Description | LeetCode # · Title |
|---|---|---|
| 1 | Return array where answer[i] = product of all elements except nums[i] | **238**. Product of Array Except Self |
| 2 | Move all 0's to the end, in-place, preserving relative order | **283**. Move Zeroes |
| 3 | Stock prices; max profit from a single buy/sell | **121**. Best Time to Buy and Sell Stock |
| 4 | Next lexicographic permutation, in-place, constant extra memory | **31**. Next Permutation |
| 5 | Two indices summing to target | **1**. Two Sum |
| 6 | Container with most water (two heights, max area) | **11**. Container With Most Water |
| 7 | Sort 0s/1s/2s (red/white/blue), in-place — Dutch national flag | **75**. Sort Colors |
| 8 | Minimum length subarray with sum ≥ target | **209**. Minimum Size Subarray Sum |
| 9 | Merge two sorted arrays nums1 + nums2 into nums1 in-place | **88**. Merge Sorted Array |

## 2. STRINGS

| # | Description | LeetCode # · Title |
|---|---|---|
| 1 | Reverse a string in-place with O(1) extra memory | **344**. Reverse String |
| 2 | Find all start indices of p's anagrams in s | **438**. Find All Anagrams in a String |
| 3 | Minimum window substring of s containing all characters of t | **76**. Minimum Window Substring |
| 4 | At most k character replacements to maximize repeating substring | **424**. Longest Repeating Character Replacement |
| 5 | Group anagrams together | **49**. Group Anagrams |
| 6 | Roman numeral to integer | **13**. Roman to Integer |
| 7 | Sort string by decreasing character frequency | **451**. Sort Characters By Frequency |
| 8 | Minimum parentheses removals to make string valid | **1249**. Minimum Remove to Make Valid Parentheses |
| 9 | Permutation in string — does s2 contain a permutation of s1 | **567**. Permutation in String |

## 3. SEARCHING AND SORTING ALGORITHMS

| # | Description | LeetCode # · Title |
|---|---|---|
| 1 | Binary search target in sorted array, O(log n) | **704**. Binary Search |
| 2 | Kth smallest in row+column sorted n×n matrix | **378**. Kth Smallest Element in a Sorted Matrix |
| 3 | Median of two sorted arrays, O(log(m+n)) | **4**. Median of Two Sorted Arrays |
| 4 | Kth largest element in array, O(n) time | **215**. Kth Largest Element in an Array |

## 4. RECURSION

| # | Description | LeetCode # · Title |
|---|---|---|
| 1 | Generate all well-formed parentheses for n pairs | **22**. Generate Parentheses |
| 2 | All possible subsets (power set) of unique-element array | **78**. Subsets |
| 3 | All permutations of distinct integers | **46**. Permutations |
| 4 | Partition s so every substring is a palindrome | **131**. Palindrome Partitioning |
| 5 | Combination sum II — each candidate used at most once | **40**. Combination Sum II |
| 6 | Remove all linked list nodes equal to val | **203**. Remove Linked List Elements |
| 7 | Different ways to add parentheses around expression | **241**. Different Ways to Add Parentheses |

## 5. HASHING

| # | Description | LeetCode # · Title |
|---|---|---|
| 1 | Two Sum (hash-map version, single pass) | **1**. Two Sum |
| 2 | First missing positive in O(n) / O(1) | **41**. First Missing Positive |
| 3 | Design an LRU cache | **146**. LRU Cache |
| 4 | Count arithmetic triplets where j>i, k>j, nums[j]-nums[i]==diff==nums[k]-nums[j] | **2367**. Number of Arithmetic Triplets |

## 6. MATRICES AND MULTIDIMENSIONAL ARRAYS

| # | Description | LeetCode # · Title |
|---|---|---|
| 1 | Return matrix elements in spiral order | **54**. Spiral Matrix |
| 2 | Word search in m×n character grid (DFS) | **79**. Word Search |
| 3 | Validate a partially filled 9×9 Sudoku board | **36**. Valid Sudoku |
| 4 | Rotate n×n image 90° clockwise, in-place | **48**. Rotate Image |
| 5 | Search for target in row+column-sorted matrix | **240**. Search a 2D Matrix II |
| 6 | If element is 0, zero out its entire row + column, in-place | **73**. Set Matrix Zeroes |
| 7 | 01 Matrix — distance of nearest 0 for each cell | **542**. 01 Matrix |

## 7. LINKED LIST

| # | Description | LeetCode # · Title |
|---|---|---|
| 1 | Reverse a singly linked list | **206**. Reverse Linked List |
| 2 | Rotate list to the right by k places | **61**. Rotate List |
| 3 | Detect a cycle in a linked list | **141**. Linked List Cycle |
| 4 | Merge two sorted linked lists | **21**. Merge Two Sorted Lists |
| 5 | Remove the nth node from end of list | **19**. Remove Nth Node From End of List |
| 6 | Reorder list: L0→Ln→L1→Ln-1→L2→Ln-2→... | **143**. Reorder List |
| 7 | Intersection node of two singly linked lists | **160**. Intersection of Two Linked Lists |
| 8 | Reverse nodes in k-group (no value changes) | **25**. Reverse Nodes in k-Group |
| 9 | Palindrome linked list | **234**. Palindrome Linked List |
| 10 | Flatten binary tree to linked list (pre-order, right child = next) | **114**. Flatten Binary Tree to Linked List |

## 8. BIT MANIPULATION & MATH CONCEPTS

| # | Description | LeetCode # · Title |
|---|---|---|
| 1 | Missing number from 0..n in array | **268**. Missing Number |
| 2 | Count number of 1 bits for every i in 0..n | **338**. Counting Bits |
| 3 | Single number — every other element appears twice | **136**. Single Number |
| 4 | Intersection of two arrays (preserve multiplicity) | **350**. Intersection of Two Arrays II |
| 5 | Find the missing letter added when shuffling s into t | **389**. Find the Difference |

## 9. STACKS AND QUEUES

| # | Description | LeetCode # · Title |
|---|---|---|
| 1 | Implement a queue using two stacks | **232**. Implement Queue using Stacks |
| 2 | Implement a stack using two queues | **225**. Implement Stack using Queues |
| 3 | Daily temperatures — days until warmer | **739**. Daily Temperatures |
| 4 | Largest rectangle in histogram | **84**. Largest Rectangle in Histogram |
| 5 | Trapping rain water | **42**. Trapping Rain Water |
| 6 | Valid parentheses | **20**. Valid Parentheses |
| 7 | Design Circular Queue (Ring Buffer) | **622**. Design Circular Queue |
| 8 | Sliding window maximum | **239**. Sliding Window Maximum |
| 9 | Min Stack — push/pop/top/getMin all O(1) | **155**. Min Stack |
| 10 | Rotting oranges (BFS on grid) | **994**. Rotting Oranges |

## 10. TREES & BINARY SEARCH TREES

| # | Description | LeetCode # · Title |
|---|---|---|
| 1 | Maximum depth of a binary tree | **104**. Maximum Depth of Binary Tree |
| 2 | Invert a binary tree | **226**. Invert Binary Tree |
| 3 | Binary tree maximum path sum | **124**. Binary Tree Maximum Path Sum |
| 4 | Same tree — structurally identical with same values | **100**. Same Tree |
| 5 | Binary tree level order traversal | **102**. Binary Tree Level Order Traversal |
| 6 | Lowest common ancestor of a binary tree | **236**. Lowest Common Ancestor of a Binary Tree |
| 7 | Construct binary tree from preorder + inorder | **105**. Construct Binary Tree from Preorder and Inorder Traversal |
| 8 | Binary tree right side view | **199**. Binary Tree Right Side View |
| 9 | Validate Binary Search Tree | **98**. Validate Binary Search Tree |
| 10 | Kth smallest element in a BST | **230**. Kth Smallest Element in a BST |
| 11 | Binary tree zigzag level order traversal | **103**. Binary Tree Zigzag Level Order Traversal |
| 12 | Balanced binary tree (height-balanced) | **110**. Balanced Binary Tree |

## 11. TRIES

| # | Description | LeetCode # · Title |
|---|---|---|
| 1 | Implement a Trie (prefix tree) | **208**. Implement Trie (Prefix Tree) |
| 2 | Add and search word (with `.` wildcard) | **211**. Design Add and Search Words Data Structure |
| 3 | Maximum XOR of two numbers in array | **421**. Maximum XOR of Two Numbers in an Array |
| 4 | Word Break — can s be segmented from wordDict | **139**. Word Break |
| 5 | Word Search II — find all words on m×n board | **212**. Word Search II |

## 12. HEAPS

| # | Description | LeetCode # · Title |
|---|---|---|
| 1 | Merge k sorted linked lists | **23**. Merge k Sorted Lists |
| 2 | Top K frequent elements | **347**. Top K Frequent Elements |
| 3 | Reorganize string — no two adjacent same chars | **767**. Reorganize String |
| 4 | Find median from data stream (MedianFinder) | **295**. Find Median from Data Stream |

## 13. GRAPHS

| # | Description | LeetCode # · Title |
|---|---|---|
| 1 | Number of islands (1=land, 0=water; 4-direction connectivity) | **200**. Number of Islands |
| 2 | Is graph bipartite? | **785**. Is Graph Bipartite? |
| 3 | Flood fill (image starting from sr, sc) | **733**. Flood Fill |
| 4 | Longest increasing path in a matrix | **329**. Longest Increasing Path in a Matrix |
| 5 | Cheapest flights within K stops | **787**. Cheapest Flights Within K Stops |
| 6 | Number of provinces (connected city groups via isConnected) | **547**. Number of Provinces |

## 14. DYNAMIC PROGRAMMING AND GREEDY

| # | Description | LeetCode # · Title |
|---|---|---|
| 1 | Maximum product subarray | **152**. Maximum Product Subarray |
| 2 | Longest increasing subsequence | **300**. Longest Increasing Subsequence |
| 3 | Edit distance (insert/delete/replace) | **72**. Edit Distance |
| 4 | Coin change — fewest coins to make amount | **322**. Coin Change |
| 5 | Partition equal subset sum | **416**. Partition Equal Subset Sum |
| 6 | Longest common subsequence | **1143**. Longest Common Subsequence |
| 7 | Unique paths in m×n grid (down/right only) | **62**. Unique Paths |
| 8 | Word Break (DP variant) | **139**. Word Break |

---

## Totals

| Section | Count |
|---------|------:|
| 1. Arrays | 9 |
| 2. Strings | 9 |
| 3. Searching & Sorting | 4 |
| 4. Recursion | 7 |
| 5. Hashing | 4 |
| 6. Matrices & Multidim Arrays | 7 |
| 7. Linked List | 10 |
| 8. Bit Manipulation & Math | 5 |
| 9. Stacks & Queues | 10 |
| 10. Trees & BSTs | 12 |
| 11. Tries | 5 |
| 12. Heaps | 4 |
| 13. Graphs | 6 |
| 14. DP & Greedy | 8 |
| **Total** | **100** ✓ |

## Notes on the matching

- The PDF text contains only the descriptions and a "Practice" button image
  per problem — no LeetCode numbers or titles are printed. The number/title
  column above is a best-effort mapping by description.
- Where the description is generic (e.g. "Two Sum" appears under both Arrays
  and Hashing), the same LeetCode # is reused.
- The "Bit Manipulation" section title in the PDF is actually
  *"8. BIT MANIPULATION & MATH CONCEPTS"* — the `pdftotext` extraction split
  "CONCEPTS" onto its own line, which is why the v2.1 canonical_lists draft
  had it as a separate "CONCEPTS" sub-bucket. Corrected here.
- Section 14 in the PDF is *"14. DYNAMIC PROGRAMMING AND GREEDY"*, not just
  *"GREEDY"* as the earlier `pdftotext` indentation suggested.

## How to use this list

1. Open the PDF (`references/100_leetcode_problems.pdf`) side-by-side with
   this file. Click the "Practice" link in the PDF to open the LeetCode page.
2. Solve in your preferred language (see [languages/INDEX.md](../languages/INDEX.md)).
3. Track your status however you like — a `solutions/` folder with one file
   per problem is the natural next step (queued for v2.3 per the plan).
4. The Blind 75 / NeetCode 150 progression in
   [canonical_lists.md](canonical_lists.md) gives a complementary
   *pattern-first* path through largely the same set of problems.

## Cross-link
- Pattern catalog + complexity cheatsheet → [topics/INDEX.md](INDEX.md)
- Language picker for interviews → [languages/INDEX.md](../languages/INDEX.md)
- Local CLI tooling for practice → [man_pages/INDEX.md](../man_pages/INDEX.md)
