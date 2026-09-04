---
id: clone-graph
title: 'Clone Graph'
leetcode: https://leetcode.com/problems/clone-graph/
neetcode: https://neetcode.io/problems/clone-graph?list=neetcode150
difficulty: Medium
family: 'Graphs'
order: 2
lists: [blind75, neetcode150]
patterns: [graph-dfs, hash-map]
---

## Prompt

Return a deep copy of a connected undirected graph given a reference to one node.

## Why

Traverse with DFS or BFS keeping a map from original node to its clone. When you reach a
node, create the clone if absent and wire its neighbours by cloning each recursively.
The map both deduplicates and handles cycles.

## Why not

- tree-dfs: Graphs have cycles and shared neighbours; without a visited map you loop forever.
- union-find: No connectivity questions; every node must be copied.
- topological-sort: The graph is undirected and may be cyclic.

## Complexity

O(V + E) time, O(V) space.
