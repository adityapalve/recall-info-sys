---
id: min-cost-to-connect-all-points
title: 'Min Cost to Connect All Points'
leetcode: https://leetcode.com/problems/min-cost-to-connect-all-points/
neetcode: https://neetcode.io/problems/min-cost-to-connect-points?list=neetcode150
difficulty: Medium
family: 'Advanced Graphs'
order: 2
lists: [neetcode150]
patterns: [mst]
---

## Prompt

Given points on a plane where connecting two costs their Manhattan distance, find the
minimum total cost to connect all points.

## Why

This is a minimum spanning tree over a complete graph. Prim's algorithm with a min-heap
of candidate edges from the tree is natural for dense graphs; Kruskal with union-find
over all n² edges is the alternative.

## Why not

- dijkstra: Shortest paths from one point do not minimise the total cost of connecting all of
  them.
- greedy: Kruskal is greedy, but the recognisable technique is MST via union-find or Prim.
- graph-bfs: The graph is complete and weighted; there are no unit steps.

## Complexity

O(n² log n) time, O(n²) space with Kruskal; O(n²) with array-based Prim.
