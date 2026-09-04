---
id: balanced-binary-tree
title: 'Balanced Binary Tree'
leetcode: https://leetcode.com/problems/balanced-binary-tree/
neetcode: https://neetcode.io/problems/balanced-binary-tree?list=neetcode150
difficulty: Easy
family: 'Trees'
order: 3
lists: [neetcode150]
patterns: [tree-dfs]
---

## Prompt

Decide whether a binary tree is height-balanced: at every node the two subtree heights
differ by at most one.

## Why

Return each subtree's height post-order, but propagate a sentinel (e.g. −1) as soon as
any node is unbalanced. That keeps the whole check to one pass instead of recomputing
heights at every node.

## Why not

- tree-bfs: Balance depends on subtree heights, which come from bottom-up recursion, not level
  order.
- bst-property: Balance is about heights, not value ordering.
- graph-dfs: No visited set or cycles; it is straightforward tree recursion.

## Complexity

O(n) time, O(h) space.
