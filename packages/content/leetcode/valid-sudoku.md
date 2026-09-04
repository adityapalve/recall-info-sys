---
id: valid-sudoku
title: 'Valid Sudoku'
leetcode: https://leetcode.com/problems/valid-sudoku/
neetcode: https://neetcode.io/problems/valid-sudoku?list=neetcode150
difficulty: Medium
family: 'Arrays & Hashing'
order: 7
lists: [neetcode150]
patterns: [hash-map]
---

## Prompt

Given a 9×9 board partially filled with digits, decide whether no row, column, or 3×3
box contains a repeated digit.

## Why

Each cell belongs to one row, one column, and one box (row/3, col/3). Keep a set of seen
digits for each of the 27 units and reject on the first repeat. One pass over 81 cells.

## Why not

- backtracking: You are validating a partially filled board, not solving it; no search is needed.
- matrix: Index arithmetic maps cells to boxes, but the actual check is "seen this digit
  already?" — a set problem.
- bit-manipulation: A 9-bit mask per row/column/box is a valid micro-optimisation of the same set idea,
  not a different approach.

## Complexity

O(1) — the board is fixed size — 81 cells, 27 sets.
