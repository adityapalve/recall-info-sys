---
id: serialize-and-deserialize-binary-tree
title: 'Serialize And Deserialize Binary Tree'
leetcode: https://leetcode.com/problems/serialize-and-deserialize-binary-tree/
neetcode: https://neetcode.io/problems/serialize-and-deserialize-binary-tree?list=neetcode150
difficulty: Hard
family: 'Trees'
order: 14
lists: [blind75, neetcode150]
patterns: [tree-dfs]
---

## Prompt

Design functions to convert a binary tree to a string and back so that the original
structure is recovered exactly.

## Why

Preorder traversal emitting a marker for null makes the sequence unambiguous.
Deserialise by consuming tokens in the same order: read a token, build the node, recurse
left, recurse right.

## Why not

- tree-bfs: Level-order serialisation is a valid alternative; preorder with null markers is
  simpler to write recursively.
- string-manipulation: Formatting is incidental; the structural idea is a traversal with explicit null
  markers.
- hash-map: No lookups; the tree is reconstructed purely from sequence order.

## Complexity

O(n) time, O(n) space.
