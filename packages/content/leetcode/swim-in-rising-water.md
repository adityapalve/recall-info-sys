---
id: swim-in-rising-water
title: 'Swim In Rising Water'
leetcode: https://leetcode.com/problems/swim-in-rising-water/
neetcode: https://neetcode.io/problems/swim-in-rising-water?list=neetcode150
difficulty: Hard
family: 'Advanced Graphs'
order: 3
lists: [neetcode150]
patterns: [dijkstra, binary-search-on-answer]
---

## Prompt

In an elevation grid you can move to a neighbour once the water level is at least the
max of both cells. Find the minimum time to reach the bottom-right from the top-left.

## Why

You want the path minimising the maximum elevation on it — a minimax shortest path.
Dijkstra where the "distance" is max(so far, cell) solves it; or binary search the
answer and BFS to test reachability under that level.

## Why not

- graph-bfs: Cells have varying elevations, so unit-step BFS does not find the minimum "max along
  path".
- dp-2d: Paths can move in all four directions, breaking a grid recurrence.
- graph-dfs: Without a priority order, DFS explores paths in the wrong order for a minimax
  objective.

## Complexity

O(n² log n) time, O(n²) space.
