---
id: rotting-oranges
title: 'Rotting Oranges'
leetcode: https://leetcode.com/problems/rotting-oranges/
neetcode: https://neetcode.io/problems/rotting-fruit?list=neetcode150
difficulty: Medium
family: 'Graphs'
order: 4
lists: [neetcode150]
patterns: [graph-bfs]
---

## Prompt

Fresh oranges rot when adjacent to a rotten one each minute. Find how many minutes until
none are fresh, or −1 if impossible.

## Why

Seed a queue with all rotten oranges, then BFS level by level; each level is one minute.
At the end, any remaining fresh orange means the answer is −1.

## Why not

- graph-dfs: DFS cannot model simultaneous spreading; minutes are BFS levels.
- union-find: Connectivity alone does not give the time to rot.
- dp-2d: Rot spreads in all directions, so there is no directional recurrence.

## Complexity

O(m · n) time, O(m · n) space.
