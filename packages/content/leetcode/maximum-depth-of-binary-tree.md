---
id: maximum-depth-of-binary-tree
title: 'Maximum Depth of Binary Tree'
leetcode: https://leetcode.com/problems/maximum-depth-of-binary-tree/
neetcode: https://neetcode.io/problems/depth-of-binary-tree?list=neetcode150
difficulty: Easy
family: 'Trees'
order: 1
lists: [blind75, neetcode150]
patterns: [tree-dfs]
---

## Prompt

Return the number of nodes on the longest root-to-leaf path of a binary tree.

## Why

The depth of a node is 1 plus the larger of its children's depths; a null subtree has
depth 0. Post-order recursion computes this bottom-up.

## Why not

- tree-bfs: Counting levels with a queue is valid; recursion expresses "1 + max of children" more
  directly.
- graph-dfs: A tree has no cycles or visited set; plain recursion suffices.
- dp-1d: The subtree recurrence is DP-like, but on a tree it is just post-order recursion.

## Complexity

O(n) time, O(h) space.
