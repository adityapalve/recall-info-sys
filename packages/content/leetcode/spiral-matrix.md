---
id: spiral-matrix
title: 'Spiral Matrix'
leetcode: https://leetcode.com/problems/spiral-matrix/
neetcode: https://neetcode.io/problems/spiral-matrix?list=neetcode150
difficulty: Medium
family: 'Math & Geometry'
order: 1
lists: [blind75, neetcode150]
patterns: [matrix]
---

## Prompt

Return all elements of a matrix in spiral order.

## Why

Keep four boundaries (top, bottom, left, right). Walk the top row, then the right
column, then the bottom row, then the left column, shrinking the corresponding boundary
after each, and stop when they cross.

## Why not

- graph-dfs: The path is fixed; no exploration or visited set is required.
- backtracking: Nothing is undone.
- two-pointers: Four boundaries shrink, which is the matrix-boundary idiom.

## Complexity

O(m · n) time, O(1) extra space.
