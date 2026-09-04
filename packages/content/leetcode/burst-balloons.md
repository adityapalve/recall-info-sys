---
id: burst-balloons
title: 'Burst Balloons'
leetcode: https://leetcode.com/problems/burst-balloons/
neetcode: https://neetcode.io/problems/burst-balloons?list=neetcode150
difficulty: Hard
family: '2-D Dynamic Programming'
order: 9
lists: [neetcode150]
patterns: [dp-2d]
---

## Prompt

Bursting a balloon earns the product of it and its two neighbours. Find the maximum
coins from bursting them all.

## Why

Think in reverse: choose which balloon is burst last in a range (i, j) — its neighbours
are then the fixed boundaries i and j. dp[i][j] = max over k of dp[i][k] + dp[k][j] +
nums[i]·nums[k]·nums[j], with padding 1s at both ends.

## Why not

- greedy: Bursting the smallest first is a known trap; neighbours change after every burst.
- backtracking: Trying every burst order is O(n!).
- dp-1d: The dependency is on a range (i, j), which needs two indices — interval DP.

## Complexity

O(n³) time, O(n²) space.
