---
id: graph-valid-tree
title: 'Graph Valid Tree'
leetcode: https://leetcode.com/problems/graph-valid-tree/
neetcode: https://neetcode.io/problems/valid-tree?list=neetcode150
difficulty: Medium
family: 'Graphs'
order: 9
lists: [blind75, neetcode150]
patterns: [union-find, graph-dfs]
---

## Prompt

Given n nodes and a list of undirected edges, decide whether they form a valid tree.

## Why

A tree on n nodes has exactly n−1 edges and is connected. Union-find: if any edge joins
two already-connected nodes there is a cycle; at the end check a single component. Or
DFS from node 0 with a parent parameter and count visited nodes.

## Why not

- topological-sort: The graph is undirected; there is no direction to order by.
- tree-dfs: You are testing whether it is a tree; you cannot assume tree recursion applies.
- dijkstra: No weights or shortest paths are involved.

## Complexity

O(n · α(n)) time, O(n) space.
