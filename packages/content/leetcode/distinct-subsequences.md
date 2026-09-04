---
id: distinct-subsequences
title: 'Distinct Subsequences'
leetcode: https://leetcode.com/problems/distinct-subsequences/
neetcode: https://neetcode.io/problems/count-subsequences?list=neetcode150
difficulty: Hard
family: '2-D Dynamic Programming'
order: 7
lists: [neetcode150]
patterns: [dp-2d]
---

## Prompt

Count how many distinct subsequences of s equal t.

## Why

dp[i][j] = ways to form t[..j) from s[..i): always inherit dp[i−1][j] (skip s[i−1]); if
the characters match, also add dp[i−1][j−1].

## Why not

- backtracking: Counting matches by enumeration is exponential.
- two-pointers: A greedy scan finds one occurrence, not the number of them.
- hash-map: Positions matter; counts of characters do not determine subsequence counts.

## Complexity

O(m · n) time, O(n) space.
