---
id: longest-increasing-path-in-a-matrix
title: 'Longest Increasing Path In a Matrix'
leetcode: https://leetcode.com/problems/longest-increasing-path-in-a-matrix/
neetcode: https://neetcode.io/problems/longest-increasing-path-in-matrix?list=neetcode150
difficulty: Hard
family: '2-D Dynamic Programming'
order: 6
lists: [neetcode150]
patterns: [dp-2d, graph-dfs]
---

## Prompt

Find the length of the longest path in a matrix that moves to adjacent cells with
strictly increasing values.

## Why

Because values strictly increase, the move graph is acyclic and a cell's answer depends
only on larger neighbours. DFS from each cell with memoisation: best(cell) = 1 + max
best over larger neighbours.

## Why not

- graph-bfs: BFS gives shortest paths; you want the longest strictly increasing one.
- topological-sort: Works (the increasing relation is a DAG) but memoised DFS is the same thing with less
  setup.
- backtracking: Cells are never un-visited; strict increase guarantees no cycles, so plain memoisation
  suffices.

## Complexity

O(m · n) time, O(m · n) space.
