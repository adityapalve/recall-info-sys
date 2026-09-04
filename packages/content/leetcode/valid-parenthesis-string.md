---
id: valid-parenthesis-string
title: 'Valid Parenthesis String'
leetcode: https://leetcode.com/problems/valid-parenthesis-string/
neetcode: https://neetcode.io/problems/valid-parenthesis-string?list=neetcode150
difficulty: Medium
family: 'Greedy'
order: 7
lists: [neetcode150]
patterns: [greedy]
---

## Prompt

A string of "(", ")" and "_" where "_" can be "(", ")" or empty. Decide whether it can
be a valid parenthesis string.

## Why

Track the range of possible open-bracket counts as [lo, hi]. "(" increments both, ")"
decrements both, "*" widens it. Clamp lo at 0; if hi goes negative it is invalid; valid
at the end iff lo is 0.

## Why not

- stack: Stacks handle fixed brackets; the wildcard creates branching a stack cannot represent.
- backtracking: Trying each wildcard as (, ), or empty is exponential.
- dp-2d: dp[i][open] works in O(n²) but the two-counter greedy is linear.

## Complexity

O(n) time, O(1) space.
