---
id: walls-and-gates
title: 'Walls And Gates'
leetcode: https://leetcode.com/problems/walls-and-gates/
neetcode: https://neetcode.io/problems/islands-and-treasure?list=neetcode150
difficulty: Medium
family: 'Graphs'
order: 3
lists: [neetcode150]
patterns: [graph-bfs]
---

## Prompt

In a grid with walls, gates, and empty rooms, fill each room with its distance to the
nearest gate.

## Why

Start BFS from every gate simultaneously (all gates in the initial queue). The first
time BFS reaches a room, that is its nearest-gate distance. Multi-source BFS solves all
rooms in one pass.

## Why not

- graph-dfs: DFS from each gate can revisit cells with worse distances; BFS assigns each cell its
  true shortest distance once.
- dijkstra: All edges cost 1, so plain BFS suffices.
- dp-2d: Distances depend on paths that can go in any direction, not a monotone recurrence.

## Complexity

O(m · n) time, O(m · n) space.
