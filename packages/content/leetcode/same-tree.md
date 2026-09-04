---
id: same-tree
title: 'Same Tree'
leetcode: https://leetcode.com/problems/same-tree/
neetcode: https://neetcode.io/problems/same-binary-tree?list=neetcode150
difficulty: Easy
family: 'Trees'
order: 4
lists: [blind75, neetcode150]
patterns: [tree-dfs]
---

## Prompt

Given two binary trees, decide whether they are structurally identical with equal
values.

## Why

Two trees are the same if both are null, or both are non-null with equal values and the
same left subtrees and the same right subtrees. That definition is the recursion.

## Why not

- tree-bfs: A paired queue works too, but recursion mirrors the definition directly.
- hash-map: Serialising to compare is possible but indirect and ambiguous without null markers.
- bst-property: The trees are not assumed to be BSTs.

## Complexity

O(n) time, O(h) space.
