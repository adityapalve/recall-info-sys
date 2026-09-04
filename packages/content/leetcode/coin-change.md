---
id: coin-change
title: 'Coin Change'
leetcode: https://leetcode.com/problems/coin-change/
neetcode: https://neetcode.io/problems/coin-change?list=neetcode150
difficulty: Medium
family: '1-D Dynamic Programming'
order: 7
lists: [blind75, neetcode150]
patterns: [knapsack, dp-1d]
---

## Prompt

Given coin denominations and an amount, find the fewest coins that make the amount, or
−1.

## Why

Unbounded knapsack: dp[a] = 1 + min over coins of dp[a − coin]. Fill amounts from 0
upward; unreachable amounts stay at infinity.

## Why not

- greedy: Taking the largest coin first fails for denominations like {1, 3, 4} making 6.
- graph-bfs: BFS over amounts works (each coin is an edge) but is just the DP with a queue.
- backtracking: Exponential without memoisation; the memoised version is the DP.

## Complexity

O(amount · coins) time, O(amount) space.
