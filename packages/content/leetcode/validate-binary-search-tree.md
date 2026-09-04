---
id: validate-binary-search-tree
title: 'Validate Binary Search Tree'
leetcode: https://leetcode.com/problems/validate-binary-search-tree/
neetcode: https://neetcode.io/problems/valid-binary-search-tree?list=neetcode150
difficulty: Medium
family: 'Trees'
order: 10
lists: [blind75, neetcode150]
patterns: [bst-property, tree-dfs]
---

## Prompt

Decide whether a binary tree satisfies the BST property: every node is greater than all
in its left subtree and smaller than all in its right.

## Why

Checking only immediate children is the classic wrong answer. Recurse with an allowed
(low, high) range that tightens as you descend; or do an in-order traversal and confirm
the values are strictly increasing.

## Why not

- tree-bfs: Level order cannot see the global bounds each subtree must respect.
- binary-search: Nothing is being searched for; the structure itself is being checked.
- hash-map: Values are not looked up; the constraint is ordering across the whole subtree.

## Complexity

O(n) time, O(h) space.
