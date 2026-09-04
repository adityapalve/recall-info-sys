---
id: longest-increasing-subsequence
title: 'Longest Increasing Subsequence'
leetcode: https://leetcode.com/problems/longest-increasing-subsequence/
neetcode: https://neetcode.io/problems/longest-increasing-subsequence?list=neetcode150
difficulty: Medium
family: '1-D Dynamic Programming'
order: 10
lists: [blind75, neetcode150]
patterns: [dp-1d, binary-search]
---

## Prompt

Find the length of the longest strictly increasing subsequence of an integer array.

## Why

dp[i] = 1 + max dp[j] over j < i with nums[j] < nums[i], which is O(n²). The O(n log n)
version keeps a list of the smallest tail for each length and binary-searches where each
number goes.

## Why not

- sliding-window: A subsequence need not be contiguous.
- greedy: Extending whenever possible misses that a smaller later value may enable a longer
  chain.
- two-pointers: No sorted pair structure applies to subsequences.

## Complexity

O(n²) time with DP; O(n log n) with patience sorting.
