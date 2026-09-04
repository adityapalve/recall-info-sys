---
id: interleaving-string
title: 'Interleaving String'
leetcode: https://leetcode.com/problems/interleaving-string/
neetcode: https://neetcode.io/problems/interleaving-string?list=neetcode150
difficulty: Medium
family: '2-D Dynamic Programming'
order: 5
lists: [neetcode150]
patterns: [dp-2d]
---

## Prompt

Decide whether a string is formed by interleaving two others while preserving each one's
order.

## Why

dp[i][j] is true if the first i+j characters can be formed from i of s1 and j of s2:
true if dp[i−1][j] and s1[i−1] matches, or dp[i][j−1] and s2[j−1] matches.

## Why not

- two-pointers: Greedily matching from whichever string fits fails when both fit and only one leads to
  success.
- backtracking: Exponential without memoisation; the memoised version is the 2-D table.
- sliding-window: Not a contiguous-range property.

## Complexity

O(m · n) time, O(n) space.
