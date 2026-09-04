---
id: construct-binary-tree-from-preorder-and-inorder-traversal
title: 'Construct Binary Tree From Preorder And Inorder Traversal'
leetcode: https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
neetcode: https://neetcode.io/problems/binary-tree-from-preorder-and-inorder-traversal?list=neetcode150
difficulty: Medium
family: 'Trees'
order: 12
lists: [blind75, neetcode150]
patterns: [tree-dfs]
---

## Prompt

Rebuild a binary tree from its preorder and inorder traversal sequences.

## Why

Preorder's first element is the root. Find it in inorder: everything to its left is the
left subtree, everything to its right the right subtree. Recurse on the corresponding
slices; a value → inorder index map makes each split O(1).

## Why not

- backtracking: The construction is deterministic; no alternatives are tried.
- tree-bfs: Preorder and inorder are depth-first sequences; level order is not involved.
- bst-property: Values need not be ordered; positions in the traversals define the structure.

## Complexity

O(n) time with the index map, O(n) space.
