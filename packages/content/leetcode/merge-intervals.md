---
id: merge-intervals
title: 'Merge Intervals'
leetcode: https://leetcode.com/problems/merge-intervals/
neetcode: https://neetcode.io/problems/merge-intervals?list=neetcode150
difficulty: Medium
family: 'Intervals'
order: 1
lists: [blind75, neetcode150]
patterns: [intervals]
---

## Prompt

Merge all overlapping intervals in a list.

## Why

Sort by start. Sweep, and if the current interval starts before the last merged one
ends, extend that end; otherwise start a new merged interval.

## Why not

- heap: Sorting once suffices; there is no dynamic min extraction.
- union-find: Overlap is transitive along sorted starts, so a linear merge replaces set unions.
- sliding-window: Intervals are ranges in value, not positions in an array.

## Complexity

O(n log n) time, O(n) space.
