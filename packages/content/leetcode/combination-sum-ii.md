---
id: combination-sum-ii
title: 'Combination Sum II'
leetcode: https://leetcode.com/problems/combination-sum-ii/
neetcode: https://neetcode.io/problems/combination-target-sum-ii?list=neetcode150
difficulty: Medium
family: 'Backtracking'
order: 2
lists: [neetcode150]
patterns: [backtracking, sorting]
---

## Prompt

Given candidates that may repeat and a target, list all unique combinations (each
element used at most once) summing to the target.

## Why

Sort, then backtrack advancing the index each pick. At a given recursion level, skip a
candidate equal to the previous one at that level, which removes duplicate combinations
without a set.

## Why not

- knapsack: DP counts ways; the problem asks for the combinations themselves.
- hash-map: Deduplicating output with a set of tuples works but the skip-duplicates rule in the
  sorted array is cleaner.
- greedy: No greedy order produces all valid combinations.

## Complexity

O(2ⁿ) worst case, O(n) recursion depth.
