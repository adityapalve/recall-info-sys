---
id: combination-sum
title: 'Combination Sum'
leetcode: https://leetcode.com/problems/combination-sum/
neetcode: https://neetcode.io/problems/combination-target-sum?list=neetcode150
difficulty: Medium
family: 'Backtracking'
order: 1
lists: [blind75, neetcode150]
patterns: [backtracking]
---

## Prompt

Given distinct candidate numbers and a target, list all unique combinations (with reuse
allowed) that sum to the target.

## Why

Recurse with a start index and remaining target. At each step either take the current
candidate again (stay at the same index) or move on. Enforcing non-decreasing index
order prevents duplicate orderings.

## Why not

- knapsack: Knapsack DP counts or optimises; here every combination must be listed explicitly.
- greedy: Taking the largest coin first misses combinations.
- two-pointers: No sorted pair structure gives multi-element combinations.

## Complexity

Exponential in the worst case; O(target/min) recursion depth.
