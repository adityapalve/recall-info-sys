---
id: cheapest-flights-within-k-stops
title: 'Cheapest Flights Within K Stops'
leetcode: https://leetcode.com/problems/cheapest-flights-within-k-stops/
neetcode: https://neetcode.io/problems/cheapest-flight-path?list=neetcode150
difficulty: Medium
family: 'Advanced Graphs'
order: 5
lists: [neetcode150]
patterns: [bellman-ford]
---

## Prompt

Given flights with prices, find the cheapest route from src to dst using at most k
stops.

## Why

Run k+1 rounds of edge relaxation, each round reading from a snapshot of the previous
round's distances so a single round adds at most one edge. After k+1 rounds the distance
to dst is the cheapest path with ≤ k stops.

## Why not

- dijkstra: Plain Dijkstra ignores the stop limit; the cheapest path may use too many hops.
- graph-bfs: Edges have costs, so BFS levels give hop counts but not the cheapest route.
- dp-2d: Bellman-Ford with k rounds is a DP over (stops, node), but the named algorithm is the
  recognised solution.

## Complexity

O(k · E) time, O(V) space.
