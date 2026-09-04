---
id: subsets
title: 'Subsets'
leetcode: https://leetcode.com/problems/subsets/
neetcode: https://neetcode.io/problems/subsets?list=neetcode150
difficulty: Medium
family: 'Backtracking'
order: 0
lists: [neetcode150]
patterns: [backtracking, bit-manipulation]
---

## Prompt

Given an array of distinct integers, return every possible subset.

## Why

For each element decide include or exclude, recursing on the rest and recording the
current selection at each leaf. Equivalently, iterate bitmasks 0..2ⁿ−1 and take the
elements whose bits are set.

## Why not

- dp-1d: There is no optimal substructure to exploit; every subset must be produced.
- graph-dfs: The recursion tree is not a graph with shared nodes; there is no visited set.
- hash-map: Nothing is looked up; the work is enumeration.

## Complexity

O(n · 2ⁿ) time and output.
