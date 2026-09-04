---
id: permutation-in-string
title: 'Permutation In String'
leetcode: https://leetcode.com/problems/permutation-in-string/
neetcode: https://neetcode.io/problems/permutation-string?list=neetcode150
difficulty: Medium
family: 'Sliding Window'
order: 3
lists: [neetcode150]
patterns: [sliding-window]
---

## Prompt

Given two strings, decide whether any rearrangement of the first appears as a substring
of the second.

## Why

A permutation is a substring with identical character counts. Keep a window of exactly
the pattern's length; on each shift add the entering character and remove the leaving
one, tracking how many of the 26 counts match.

## Why not

- backtracking: Generating all permutations of the pattern is factorial; you only need a count
  comparison.
- hash-map: Counting is the tool, but the point is that a fixed-size window slides so each step is
  O(1).
- two-pointers: The window has a fixed width equal to the pattern; that is the sliding-window special
  case.

## Complexity

O(n) time, O(26) space.
