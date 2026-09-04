---
id: longest-consecutive-sequence
title: 'Longest Consecutive Sequence'
leetcode: https://leetcode.com/problems/longest-consecutive-sequence/
neetcode: https://neetcode.io/problems/longest-consecutive-sequence?list=neetcode150
difficulty: Medium
family: 'Arrays & Hashing'
order: 8
lists: [blind75, neetcode150]
patterns: [hash-map]
pinnedDistractors: [sorting]
---

## Prompt

Given an unsorted integer array, find the length of the longest run of consecutive
integers present, in O(n) time.

## Why

Put everything in a set. A number starts a run only if x−1 is absent; from each such
start, count upward while x+1 is present. Each element is visited at most twice, so the
whole thing is linear.

## Why not

- sorting: Sort-then-scan is correct but O(n log n); the problem asks for O(n).
- union-find: You could union each x with x+1, but a set gives the same components with less
  machinery.
- dp-1d: The values are unordered and unbounded, so there is no index to build a table over.

## Complexity

O(n) time, O(n) space.
