---
id: kth-smallest-element-in-a-bst
title: 'Kth Smallest Element In a Bst'
leetcode: https://leetcode.com/problems/kth-smallest-element-in-a-bst/
neetcode: https://neetcode.io/problems/kth-smallest-integer-in-bst?list=neetcode150
difficulty: Medium
family: 'Trees'
order: 11
lists: [blind75, neetcode150]
patterns: [bst-property]
---

## Prompt

Find the k-th smallest value in a binary search tree.

## Why

In-order traversal of a BST visits values in ascending order. Traverse iteratively with
a stack and stop at the k-th visited node.

## Why not

- heap: Collecting values into a heap ignores that the BST already orders them.
- tree-bfs: Level order is unrelated to value order.
- sorting: Extracting and sorting all values is O(n log n); in-order gives sorted order for free.

## Complexity

O(h + k) time, O(h) space.
