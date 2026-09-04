---
id: binary-tree-right-side-view
title: 'Binary Tree Right Side View'
leetcode: https://leetcode.com/problems/binary-tree-right-side-view/
neetcode: https://neetcode.io/problems/binary-tree-right-side-view?list=neetcode150
difficulty: Medium
family: 'Trees'
order: 8
lists: [neetcode150]
patterns: [tree-bfs]
---

## Prompt

Return the values visible when looking at a binary tree from the right: the last node of
each level.

## Why

Level-order traversal; for each level, take the last node dequeued. Note this is not
"always go right" — a deeper left node can be visible when the right side is shorter.

## Why not

- tree-dfs: Right-first DFS recording the first node at each depth also works; BFS makes "last in
  level" explicit.
- bst-property: Values are irrelevant; only position matters.
- monotonic-stack: No next-greater relationship is involved.

## Complexity

O(n) time, O(w) space.
