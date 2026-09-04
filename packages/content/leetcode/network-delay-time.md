---
id: network-delay-time
title: 'Network Delay Time'
leetcode: https://leetcode.com/problems/network-delay-time/
neetcode: https://neetcode.io/problems/network-delay-time?list=neetcode150
difficulty: Medium
family: 'Advanced Graphs'
order: 0
lists: [neetcode150]
patterns: [dijkstra]
---

## Prompt

Given weighted directed edges and a source, find the time for a signal to reach every
node, or −1 if some node is unreachable.

## Why

All weights are non-negative, so Dijkstra with a min-heap gives the shortest time to
each node. The answer is the largest of those distances, provided every node was
reached.

## Why not

- graph-bfs: Edges have different weights, so BFS levels do not correspond to travel time.
- bellman-ford: Correct but O(V · E); with non-negative weights Dijkstra is faster.
- mst: A spanning tree minimises total edge cost, not the time to reach each node.

## Complexity

O(E log V) time, O(V + E) space.
