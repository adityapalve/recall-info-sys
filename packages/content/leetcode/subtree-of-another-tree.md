---
id: subtree-of-another-tree
title: 'Subtree of Another Tree'
leetcode: https://leetcode.com/problems/subtree-of-another-tree/
neetcode: https://neetcode.io/problems/subtree-of-a-binary-tree?list=neetcode150
difficulty: Easy
family: 'Trees'
order: 5
lists: [blind75, neetcode150]
patterns: [tree-dfs]
---

## Prompt

Decide whether one binary tree appears as a subtree (a node and all its descendants) of
another.

## Why

At each node of the big tree, run a same-tree check against the small tree; if it fails,
try the left and right children. Composition of two recursions.

## Why not

- string-manipulation: Serialising both trees and doing substring search works but needs careful null markers
  and a linear matcher.
- hash-map: Hashing subtrees is an optimisation; the baseline is recursive comparison at each
  node.
- tree-bfs: Level order gives no way to compare subtree shapes.

## Complexity

O(n · m) time, O(h) space.
