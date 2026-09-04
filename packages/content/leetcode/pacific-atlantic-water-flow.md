---
id: pacific-atlantic-water-flow
title: 'Pacific Atlantic Water Flow'
leetcode: https://leetcode.com/problems/pacific-atlantic-water-flow/
neetcode: https://neetcode.io/problems/pacific-atlantic-water-flow?list=neetcode150
difficulty: Medium
family: 'Graphs'
order: 5
lists: [blind75, neetcode150]
patterns: [graph-dfs]
---

## Prompt

Given a height grid bordered by two oceans, find the cells from which water can flow to
both oceans moving only to equal or lower neighbours.

## Why

Instead of asking "can this cell reach the ocean", flip it: from each ocean's border
cells, climb to equal-or-higher neighbours and mark everything reachable. Cells marked
by both searches are the answer.

## Why not

- dp-2d: Flow can go in any direction, breaking any single-pass recurrence.
- graph-bfs: Also valid — the key insight is the reverse search from the oceans, not DFS vs BFS.
- union-find: Directional (height-based) reachability is not a symmetric relation.

## Complexity

O(m · n) time, O(m · n) space.
