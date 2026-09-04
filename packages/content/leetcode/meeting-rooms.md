---
id: meeting-rooms
title: 'Meeting Rooms'
leetcode: https://leetcode.com/problems/meeting-rooms/
neetcode: https://neetcode.io/problems/meeting-schedule?list=neetcode150
difficulty: Easy
family: 'Intervals'
order: 3
lists: [blind75, neetcode150]
patterns: [intervals]
---

## Prompt

Given meeting time intervals, decide whether one person could attend all of them.

## Why

Sort by start. If any meeting starts before the previous one ends, two overlap.

## Why not

- hash-map: Times are continuous ranges; a map cannot detect overlap.
- heap: Unnecessary — a single sorted pass finds any overlap.
- two-pointers: A sweep over one sorted list is enough.

## Complexity

O(n log n) time, O(1) extra space.
