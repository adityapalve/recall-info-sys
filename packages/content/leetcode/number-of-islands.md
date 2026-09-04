---
id: number-of-islands
title: 'Number of Islands'
leetcode: https://leetcode.com/problems/number-of-islands/
neetcode: https://neetcode.io/problems/count-number-of-islands?list=neetcode150
difficulty: Medium
family: 'Graphs'
order: 0
lists: [blind75, neetcode150]
patterns: [graph-dfs, union-find]
---

## Prompt

Given a grid of land and water cells, count the connected regions of land
(4-directional).

## Why

Scan the grid. Each unvisited land cell starts a new island: flood-fill it (DFS or BFS)
marking every reachable land cell so it is not counted again. Union-find over cells is
the alternative.

## Why not

- backtracking: Cells are never un-visited; once counted, a cell stays claimed.
- matrix: It is a grid, but the operation is connectivity, not index manipulation.
- dp-2d: Connectivity is not a local recurrence; a region can wrap around.

## Complexity

O(m · n) time, O(m · n) space worst case.
