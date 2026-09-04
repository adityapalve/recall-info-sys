---
id: daily-temperatures
title: 'Daily Temperatures'
leetcode: https://leetcode.com/problems/daily-temperatures/
neetcode: https://neetcode.io/problems/daily-temperatures?list=neetcode150
difficulty: Medium
family: 'Stack'
order: 3
lists: [neetcode150]
patterns: [monotonic-stack]
pinnedDistractors: [stack]
---

## Prompt

Given daily temperatures, for each day report how many days until a warmer temperature
(0 if never).

## Why

Scan left to right with a stack of indices whose temperatures are decreasing. When today
is warmer than the index on top, that index has found its answer — pop it and record the
distance. Each index enters and leaves the stack once.

## Why not

- stack: A plain stack is the data structure, but the technique is keeping it monotonic so each
  element is pushed and popped once.
- sliding-window: The next warmer day can be arbitrarily far away; no fixed or shrinking window applies.
- heap: A heap keyed by temperature finds a warmer day but not the nearest one to the right.

## Complexity

O(n) time, O(n) space.
