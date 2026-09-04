---
id: house-robber
title: 'House Robber'
leetcode: https://leetcode.com/problems/house-robber/
neetcode: https://neetcode.io/problems/house-robber?list=neetcode150
difficulty: Medium
family: '1-D Dynamic Programming'
order: 2
lists: [blind75, neetcode150]
patterns: [dp-1d]
---

## Prompt

Given amounts in a row of houses where you cannot rob two adjacent ones, maximise the
total robbed.

## Why

Best up to house i is max(skip it: best up to i−1, rob it: value[i] + best up to i−2).
Only two running values are needed.

## Why not

- greedy: Picking the largest house first can block two neighbours that together pay more.
- sliding-window: Chosen houses are not contiguous; adjacency is forbidden, not required.
- backtracking: Trying all subsets is exponential when the recurrence is linear.

## Complexity

O(n) time, O(1) space.
