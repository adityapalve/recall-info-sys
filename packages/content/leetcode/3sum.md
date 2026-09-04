---
id: 3sum
title: '3Sum'
leetcode: https://leetcode.com/problems/3sum/
neetcode: https://neetcode.io/problems/three-integer-sum?list=neetcode150
difficulty: Medium
family: 'Two Pointers'
order: 2
lists: [blind75, neetcode150]
patterns: [two-pointers]
pinnedDistractors: [hash-map]
---

## Prompt

Given an integer array, return every unique triplet that sums to zero.

## Why

Sort. Fix the first element, then the remaining task is the sorted two-sum: two pointers
from both ends of the rest of the array. Skip duplicate values at every level so each
triplet appears once.

## Why not

- hash-map: A set can find pairs for each fixed element, but deduplicating triplets without
  sorting gets messy.
- backtracking: Enumerating all triples is O(n³); the sorted two-pointer scan is O(n²).
- binary-search: Searching for −(a+b) per pair is O(n² log n), slower than the two-pointer sweep.

## Complexity

O(n²) time, O(1) extra space (ignoring sort and output).
