---
id: n-queens
title: 'N Queens'
leetcode: https://leetcode.com/problems/n-queens/
neetcode: https://neetcode.io/problems/n-queens?list=neetcode150
difficulty: Hard
family: 'Backtracking'
order: 9
lists: [neetcode150]
patterns: [backtracking]
---

## Prompt

Place n queens on an n×n board so none attack each other, and return all distinct
arrangements.

## Why

Place one queen per row. Track occupied columns and both diagonal families (row−col and
row+col) in sets so each placement check is O(1); recurse to the next row and remove the
queen on return.

## Why not

- dp-2d: Board states do not overlap usefully; there is no memoisable substructure.
- graph-dfs: No graph; the search space is placements row by row with undo.
- bit-manipulation: Bitmasks accelerate conflict checks but the search is still backtracking.

## Complexity

O(n!) time, O(n) space besides output.
