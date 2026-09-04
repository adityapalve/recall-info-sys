---
id: reconstruct-itinerary
title: 'Reconstruct Itinerary'
leetcode: https://leetcode.com/problems/reconstruct-itinerary/
neetcode: https://neetcode.io/problems/reconstruct-flight-path?list=neetcode150
difficulty: Hard
family: 'Advanced Graphs'
order: 1
lists: [neetcode150]
patterns: [eulerian-path]
---

## Prompt

Given airline tickets as directed edges, reconstruct the itinerary from JFK that uses
every ticket exactly once, choosing the lexically smallest when there is a choice.

## Why

Using every edge exactly once is an Eulerian path. Hierholzer's algorithm: DFS greedily
taking the smallest unused edge, and append each airport to the route when it has no
edges left. Reversing that post-order gives the itinerary.

## Why not

- backtracking: Trying tickets in lexical order with backtracking works but can be exponential;
  Hierholzer is linear.
- graph-dfs: Plain DFS can get stuck at a dead end and skip unused edges; the post-order insertion
  is what makes it Eulerian.
- topological-sort: The graph has cycles (round trips), so no topological order exists.

## Complexity

O(E log E) time, O(E) space.
