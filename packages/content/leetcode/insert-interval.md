---
id: insert-interval
title: 'Insert Interval'
leetcode: https://leetcode.com/problems/insert-interval/
neetcode: https://neetcode.io/problems/insert-new-interval?list=neetcode150
difficulty: Medium
family: 'Intervals'
order: 0
lists: [blind75, neetcode150]
patterns: [intervals]
---

## Prompt

Given non-overlapping intervals sorted by start, insert a new interval and merge any
overlaps.

## Why

Walk the list: copy intervals that end before the new one starts; merge every interval
that overlaps into the new one by extending its bounds; then copy the rest.

## Why not

- binary-search: Finds where to insert but you still have to merge overlaps linearly.
- heap: The input is already sorted; no priority queue needed.
- two-pointers: A single sweep with three phases (before, overlapping, after) is the intervals idiom.

## Complexity

O(n) time, O(n) space.
