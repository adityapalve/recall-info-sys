---
id: coin-change-ii
title: 'Coin Change II'
leetcode: https://leetcode.com/problems/coin-change-ii/
neetcode: https://neetcode.io/problems/coin-change-ii?list=neetcode150
difficulty: Medium
family: '2-D Dynamic Programming'
order: 3
lists: [neetcode150]
patterns: [knapsack]
---

## Prompt

Count the number of combinations of coins (unlimited supply) that make a given amount.

## Why

Unbounded knapsack counting: for each coin in turn, for each amount upward, dp[a] +=
dp[a − coin]. Processing coins in the outer loop ensures each combination is counted
once regardless of order.

## Why not

- backtracking: Counting combinations by enumeration is exponential.
- dp-1d: It is a 1-D array in practice, but the loop order (coins outside, amounts inside) is
  what makes it count combinations rather than permutations — the knapsack discipline.
- math: No closed form for arbitrary denominations.

## Complexity

O(amount · coins) time, O(amount) space.
