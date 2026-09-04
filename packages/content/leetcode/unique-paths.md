---
id: unique-paths
title: 'Unique Paths'
leetcode: https://leetcode.com/problems/unique-paths/
neetcode: https://neetcode.io/problems/count-paths?list=neetcode150
difficulty: Medium
family: '2-D Dynamic Programming'
order: 0
lists: [blind75, neetcode150]
patterns: [dp-2d]
---

## Prompt

Count the paths from the top-left to the bottom-right of an m×n grid moving only right
or down.

## Why

Paths to a cell = paths to the cell above + paths to the cell on the left. Fill row by
row; a single rolling row suffices.

## Why not

- backtracking: Enumerating paths is exponential; the count has a local recurrence.
- graph-bfs: You count paths, not shortest distances.
- math: A binomial coefficient works, but the recognisable technique is the grid recurrence.

## Complexity

O(m · n) time, O(n) space.
