---
id: car-fleet
title: 'Car Fleet'
leetcode: https://leetcode.com/problems/car-fleet/
neetcode: https://neetcode.io/problems/car-fleet?list=neetcode150
difficulty: Medium
family: 'Stack'
order: 4
lists: [neetcode150]
patterns: [monotonic-stack, sorting]
---

## Prompt

Cars start at different positions on a road and drive at different speeds toward a
target, forming fleets when one catches another. Count how many fleets arrive.

## Why

Sort cars by starting position, nearest the target first. Compute each car's solo
arrival time. Walking from the front, a car that would arrive earlier than the fleet
ahead is absorbed; otherwise it starts a new fleet. A stack of arrival times captures
that: push if slower than the top.

## Why not

- greedy: The sort-and-compare-times step is greedy-flavoured, but the recognisable technique is
  the stack of arrival times.
- intervals: Cars are points with speeds, not ranges; nothing overlaps.
- heap: You need the order by starting position, not repeated min extraction.

## Complexity

O(n log n) time, O(n) space.
