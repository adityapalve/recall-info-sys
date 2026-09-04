---
id: set-matrix-zeroes
title: 'Set Matrix Zeroes'
leetcode: https://leetcode.com/problems/set-matrix-zeroes/
neetcode: https://neetcode.io/problems/set-zeroes-in-matrix?list=neetcode150
difficulty: Medium
family: 'Math & Geometry'
order: 2
lists: [blind75, neetcode150]
patterns: [matrix]
---

## Prompt

If any cell of a matrix is 0, set its entire row and column to 0, in place with constant
space.

## Why

Use the first row and first column as flags for which rows and columns must be zeroed,
with one extra variable for the first column itself. Scan to set flags, then apply them
from the bottom-right so flags are not overwritten early.

## Why not

- hash-map: Sets of zero rows and columns work but use O(m + n) space; the first row/column can
  store that.
- graph-dfs: No connectivity; zeros affect entire rows and columns.
- dp-2d: No recurrence.

## Complexity

O(m · n) time, O(1) space.
