---
id: count-good-nodes-in-binary-tree
title: 'Count Good Nodes In Binary Tree'
leetcode: https://leetcode.com/problems/count-good-nodes-in-binary-tree/
neetcode: https://neetcode.io/problems/count-good-nodes-in-binary-tree?list=neetcode150
difficulty: Medium
family: 'Trees'
order: 9
lists: [neetcode150]
patterns: [tree-dfs]
---

## Prompt

A node is "good" if no node on the path from the root to it has a larger value. Count
the good nodes.

## Why

Recurse carrying the maximum value seen on the current path. A node is good if its value
≥ that maximum; pass max(current max, value) downward.

## Why not

- tree-bfs: Each node needs the max along its own root path, which is natural to carry down in
  recursion.
- bst-property: The tree is arbitrary; no ordering is assumed.
- monotonic-stack: Path maxima are tracked by recursion, not by a stack of array indices.

## Complexity

O(n) time, O(h) space.
