---
id: redundant-connection
title: 'Redundant Connection'
leetcode: https://leetcode.com/problems/redundant-connection/
neetcode: https://neetcode.io/problems/redundant-connection?list=neetcode150
difficulty: Medium
family: 'Graphs'
order: 11
lists: [neetcode150]
patterns: [union-find]
---

## Prompt

A tree had one extra edge added. Given the edges, return the one that can be removed to
restore a tree (the last such in input order).

## Why

Process edges in order, unioning their endpoints. The first edge whose endpoints already
share a root closes a cycle — and because there is exactly one extra edge, that edge is
the answer.

## Why not

- graph-dfs: Re-running DFS after each edge to look for a cycle is O(n²); union-find detects it as
  edges arrive.
- topological-sort: The graph is undirected.
- mst: No weights; you want the specific edge that closed a cycle, not a minimum tree.

## Complexity

O(n · α(n)) time, O(n) space.
