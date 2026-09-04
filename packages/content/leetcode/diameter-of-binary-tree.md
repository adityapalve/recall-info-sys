---
id: diameter-of-binary-tree
title: 'Diameter of Binary Tree'
leetcode: https://leetcode.com/problems/diameter-of-binary-tree/
neetcode: https://neetcode.io/problems/binary-tree-diameter?list=neetcode150
difficulty: Easy
family: 'Trees'
order: 2
lists: [neetcode150]
patterns: [tree-dfs]
---

## Prompt

Find the length in edges of the longest path between any two nodes in a binary tree.

## Why

At each node the longest path through it is leftHeight + rightHeight. Compute heights
post-order and update a global maximum as you return each height; the answer falls out
of the same traversal.

## Why not

- tree-bfs: Level order does not give path lengths through arbitrary nodes.
- graph-bfs: The double-BFS trick for tree diameter works but is heavier than one recursive pass.
- backtracking: No choices are made or undone; a single post-order pass computes everything.

## Complexity

O(n) time, O(h) space.
