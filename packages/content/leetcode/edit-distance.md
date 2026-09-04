---
id: edit-distance
title: 'Edit Distance'
leetcode: https://leetcode.com/problems/edit-distance/
neetcode: https://neetcode.io/problems/edit-distance?list=neetcode150
difficulty: Medium
family: '2-D Dynamic Programming'
order: 8
lists: [neetcode150]
patterns: [dp-2d]
---

## Prompt

Find the minimum number of single-character insertions, deletions, or replacements to
turn one string into another.

## Why

dp[i][j] over prefixes: if the last characters match, dp[i−1][j−1]; otherwise 1 +
min(delete dp[i−1][j], insert dp[i][j−1], replace dp[i−1][j−1]).

## Why not

- greedy: Local edits do not guarantee a global minimum.
- two-pointers: Aligning by scanning cannot account for insert/delete choices optimally.
- backtracking: Exponential without a table.

## Complexity

O(m · n) time, O(n) space.
