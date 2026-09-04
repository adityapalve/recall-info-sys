---
id: lowest-common-ancestor-of-a-binary-search-tree
title: 'Lowest Common Ancestor of a Binary Search Tree'
leetcode: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/
neetcode: https://neetcode.io/problems/lowest-common-ancestor-in-binary-search-tree?list=neetcode150
difficulty: Medium
family: 'Trees'
order: 6
lists: [blind75, neetcode150]
patterns: [bst-property]
---

## Prompt

Find the lowest common ancestor of two nodes in a binary search tree.

## Why

From the root, if both targets are smaller go left, if both are larger go right;
otherwise the current node splits them and is the LCA. No backtracking needed.

## Why not

- tree-dfs: The general-tree LCA recursion works but ignores the ordering that lets you walk
  straight down.
- hash-map: Recording parent pointers is unnecessary when the BST tells you which way to go.
- tree-bfs: Level order says nothing about ancestry.

## Complexity

O(h) time, O(1) space iteratively.
