---
id: min-cost-climbing-stairs
title: 'Min Cost Climbing Stairs'
leetcode: https://leetcode.com/problems/min-cost-climbing-stairs/
neetcode: https://neetcode.io/problems/min-cost-climbing-stairs?list=neetcode150
difficulty: Easy
family: '1-D Dynamic Programming'
order: 1
lists: [neetcode150]
patterns: [dp-1d]
---

## Prompt

Each stair has a cost paid when you step on it; you can start at step 0 or 1 and climb 1
or 2 steps. Find the minimum cost to reach the top.

## Why

Minimum cost to stand on step i is cost[i] + min(best of i−1, best of i−2). The top is
min of the last two.

## Why not

- greedy: Taking the cheaper next step locally can force an expensive step later.
- dijkstra: It is a shortest path on a line, but the linear recurrence is far simpler than a heap.
- prefix-sum: Costs are not additive over a range; you skip steps.

## Complexity

O(n) time, O(1) space.
