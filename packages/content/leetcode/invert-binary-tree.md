---
id: invert-binary-tree
title: 'Invert Binary Tree'
leetcode: https://leetcode.com/problems/invert-binary-tree/
neetcode: https://neetcode.io/problems/invert-a-binary-tree?list=neetcode150
difficulty: Easy
family: 'Trees'
order: 0
lists: [blind75, neetcode150]
patterns: [tree-dfs]
---

## Prompt

Mirror a binary tree by swapping the left and right children of every node.

## Why

Swap the two children of the current node, then recurse into each. The base case is
null. Every node is visited once.

## Why not

- tree-bfs: Also works — swap children level by level — but recursion is the more natural fit and
  both are O(n).
- backtracking: Nothing is undone; every node is transformed exactly once.
- bst-property: The tree need not be a BST, and inversion breaks ordering anyway.

## Complexity

O(n) time, O(h) space for recursion.
