---
id: permutations
title: 'Permutations'
leetcode: https://leetcode.com/problems/permutations/
neetcode: https://neetcode.io/problems/permutations?list=neetcode150
difficulty: Medium
family: 'Backtracking'
order: 3
lists: [neetcode150]
patterns: [backtracking]
---

## Prompt

Return all orderings of a list of distinct integers.

## Why

Build the permutation one position at a time, choosing any unused element, recursing,
then un-choosing. Swapping in place (fix position i, swap with each j ≥ i) avoids a used
set.

## Why not

- dp-1d: No overlapping subproblems; every arrangement is distinct output.
- heap: Ordering by priority is unrelated to enumeration.
- bit-manipulation: A used-mask helps track choices, but the algorithm is still recursive backtracking.

## Complexity

O(n · n!) time and output.
