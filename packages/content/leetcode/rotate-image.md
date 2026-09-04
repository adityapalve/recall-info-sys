---
id: rotate-image
title: 'Rotate Image'
leetcode: https://leetcode.com/problems/rotate-image/
neetcode: https://neetcode.io/problems/rotate-matrix?list=neetcode150
difficulty: Medium
family: 'Math & Geometry'
order: 0
lists: [blind75, neetcode150]
patterns: [matrix]
---

## Prompt

Rotate an n×n matrix 90° clockwise in place.

## Why

Transpose (swap [i][j] with [j][i]) then reverse each row. Or rotate four cells at a
time layer by layer. Both avoid an extra matrix.

## Why not

- graph-dfs: No traversal; every cell moves to a computed position.
- two-pointers: The layer-by-layer swap uses index arithmetic, not converging pointers.
- dp-2d: No recurrence; it is a fixed permutation of cells.

## Complexity

O(n²) time, O(1) space.
