---
id: binary-tree-level-order-traversal
title: 'Binary Tree Level Order Traversal'
leetcode: https://leetcode.com/problems/binary-tree-level-order-traversal/
neetcode: https://neetcode.io/problems/level-order-traversal-of-binary-tree?list=neetcode150
difficulty: Medium
family: 'Trees'
order: 7
lists: [blind75, neetcode150]
patterns: [tree-bfs]
---

## Prompt

Return the values of a binary tree grouped by level, top to bottom.

## Why

Use a queue. Record its size at the start of each round; process exactly that many
nodes, enqueueing their children. Each round is one level.

## Why not

- tree-dfs: DFS with a depth parameter can bucket nodes by level, but BFS produces levels
  natively.
- graph-bfs: Same algorithm, but on a tree there is no visited set to keep.
- heap: No priority ordering; nodes are processed in insertion order.

## Complexity

O(n) time, O(w) space for the widest level.
