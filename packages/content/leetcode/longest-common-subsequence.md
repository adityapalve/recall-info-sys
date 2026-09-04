---
id: longest-common-subsequence
title: 'Longest Common Subsequence'
leetcode: https://leetcode.com/problems/longest-common-subsequence/
neetcode: https://neetcode.io/problems/longest-common-subsequence?list=neetcode150
difficulty: Medium
family: '2-D Dynamic Programming'
order: 1
lists: [blind75, neetcode150]
patterns: [dp-2d]
---

## Prompt

Find the length of the longest subsequence common to two strings.

## Why

dp[i][j] over prefixes: if the characters match, 1 + dp[i−1][j−1]; otherwise
max(dp[i−1][j], dp[i][j−1]). Fill the table; the corner is the answer.

## Why not

- two-pointers: Skipping characters greedily misses longer alignments.
- sliding-window: Subsequences are not contiguous.
- dp-1d: Two strings need two indices; the table is inherently 2-D (rolling rows reduce space,
  not dimensions).

## Complexity

O(m · n) time, O(min(m, n)) space with rolling rows.
