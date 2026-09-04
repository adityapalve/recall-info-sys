---
id: detect-squares
title: 'Detect Squares'
leetcode: https://leetcode.com/problems/detect-squares/
neetcode: https://neetcode.io/problems/count-squares?list=neetcode150
difficulty: Medium
family: 'Math & Geometry'
order: 7
lists: [neetcode150]
patterns: [hash-map]
---

## Prompt

Design a structure that stores points and, for a query point, counts axis-aligned
squares it forms with three stored points.

## Why

Keep a count map of points. For a query (x, y), consider every stored point (x2, y2) on
a diagonal (|x−x2| = |y−y2| ≠ 0); the other two corners are (x, y2) and (x2, y).
Multiply the three counts and sum.

## Why not

- matrix: Points are sparse coordinates, not a dense grid.
- backtracking: No search; the third and fourth points are determined by the first two.
- sorting: Lookups by exact coordinate are what matters, not order.

## Complexity

O(n) per query, O(n) space.
