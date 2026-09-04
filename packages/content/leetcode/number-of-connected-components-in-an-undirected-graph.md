---
id: number-of-connected-components-in-an-undirected-graph
title: 'Number of Connected Components In An Undirected Graph'
leetcode: https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/
neetcode: https://neetcode.io/problems/count-connected-components?list=neetcode150
difficulty: Medium
family: 'Graphs'
order: 10
lists: [blind75, neetcode150]
patterns: [union-find, graph-dfs]
---

## Prompt

Given n nodes and undirected edges, count the connected components.

## Why

Start with n components; each union of two different roots reduces the count by one. Or
run DFS from every unvisited node and count how many starts you needed.

## Why not

- topological-sort: Undirected graphs have no topological order.
- graph-bfs: Also fine — any traversal counts components — but union-find avoids building adjacency
  lists.
- tree-bfs: The input is a general graph, not a tree.

## Complexity

O(n + e) time, O(n) space.
