---
id: meeting-rooms-ii
title: 'Meeting Rooms II'
leetcode: https://leetcode.com/problems/meeting-rooms-ii/
neetcode: https://neetcode.io/problems/meeting-schedule-ii?list=neetcode150
difficulty: Medium
family: 'Intervals'
order: 4
lists: [blind75, neetcode150]
patterns: [intervals, heap]
---

## Prompt

Given meeting intervals, find the minimum number of rooms needed.

## Why

The answer is the maximum number of simultaneous meetings. Sort starts and ends
separately and sweep two pointers counting active meetings; or sort by start and keep a
min-heap of end times, reusing a room when the earliest end ≤ the next start.

## Why not

- dp-1d: No recurrence; the max overlap is a sweep quantity.
- union-find: Overlap chains do not determine room count; simultaneous overlap does.
- binary-search: Nothing is being searched for.

## Complexity

O(n log n) time, O(n) space.
