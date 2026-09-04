---
id: non-overlapping-intervals
title: 'Non Overlapping Intervals'
leetcode: https://leetcode.com/problems/non-overlapping-intervals/
neetcode: https://neetcode.io/problems/non-overlapping-intervals?list=neetcode150
difficulty: Medium
family: 'Intervals'
order: 2
lists: [blind75, neetcode150]
patterns: [intervals, greedy]
---

## Prompt

Find the minimum number of intervals to remove so that the rest do not overlap.

## Why

Sort by end time. Keep an interval if it starts at or after the last kept end; otherwise
remove it. Keeping the earliest-ending interval leaves the most room for the rest.

## Why not

- dp-1d: Weighted interval scheduling needs DP; with equal weights the greedy by end time is
  optimal.
- heap: A sort by end time is all the ordering required.
- backtracking: Exponential; the greedy is provably optimal.

## Complexity

O(n log n) time, O(1) extra space.
