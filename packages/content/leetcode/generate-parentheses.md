---
id: generate-parentheses
title: 'Generate Parentheses'
leetcode: https://leetcode.com/problems/generate-parentheses/
neetcode: https://neetcode.io/problems/generate-parentheses?list=neetcode150
difficulty: Medium
family: 'Backtracking'
order: 5
lists: [neetcode150]
patterns: [backtracking]
---

## Prompt

Generate every well-formed string of n pairs of parentheses.

## Why

Append "(" while opens < n; append ")" while closes < opens. Those two rules guarantee
every completed string is valid, so no post-validation is needed.

## Why not

- stack: A stack validates a given string; generating all valid strings needs recursion with
  pruning.
- dp-1d: Catalan-style DP can build the set but is harder to reason about than direct
  construction.
- string-manipulation: String building is incidental; the constraint pruning is the technique.

## Complexity

O(Catalan(n)) output, O(n) recursion depth.
