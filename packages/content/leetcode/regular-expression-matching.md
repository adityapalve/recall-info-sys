---
id: regular-expression-matching
title: 'Regular Expression Matching'
leetcode: https://leetcode.com/problems/regular-expression-matching/
neetcode: https://neetcode.io/problems/regular-expression-matching?list=neetcode150
difficulty: Hard
family: '2-D Dynamic Programming'
order: 10
lists: [neetcode150]
patterns: [dp-2d]
---

## Prompt

Implement matching for a pattern with "." (any character) and "*" (zero or more of the
preceding element) that must cover the whole string.

## Why

dp[i][j] means s[..i) matches p[..j). For "x*": either use zero of x (dp[i][j−2]) or, if
s[i−1] matches x, consume one character (dp[i−1][j]). Otherwise match one character
directly.

## Why not

- backtracking: Correct but exponential on patterns like "a*a*a*…"; memoisation makes it the DP.
- two-pointers: A linear scan cannot decide how many characters a "*" should absorb.
- string-manipulation: No library regex; the matching logic itself is the problem.

## Complexity

O(m · n) time, O(m · n) space.
