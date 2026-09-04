---
id: binary-tree-maximum-path-sum
title: 'Binary Tree Maximum Path Sum'
leetcode: https://leetcode.com/problems/binary-tree-maximum-path-sum/
neetcode: https://neetcode.io/problems/binary-tree-maximum-path-sum?list=neetcode150
difficulty: Hard
family: 'Trees'
order: 13
lists: [blind75, neetcode150]
patterns: [tree-dfs]
---

## Prompt

Find the maximum sum of any path in a binary tree, where a path connects nodes via
parent-child edges and need not pass through the root.

## Why

Post-order: each node returns the best downward path starting at it (value + max(0, best
child gain)). Meanwhile, the best path through the node is value + left gain + right
gain; track the global max of that.

## Why not

- dp-2d: The recurrence is over subtrees, which is one-dimensional recursion on a tree, not a
  grid.
- tree-bfs: Path sums need bottom-up combination of children, not level order.
- kadane: Kadane is the array analogue; on a tree the "extend or restart" happens per child in
  the recursion.

## Complexity

O(n) time, O(h) space.
