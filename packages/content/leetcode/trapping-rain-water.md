---
id: trapping-rain-water
title: 'Trapping Rain Water'
leetcode: https://leetcode.com/problems/trapping-rain-water/
neetcode: https://neetcode.io/problems/trapping-rain-water?list=neetcode150
difficulty: Hard
family: 'Two Pointers'
order: 4
lists: [neetcode150]
patterns: [two-pointers, monotonic-stack]
pinnedDistractors: [sliding-window]
---

## Prompt

Given bar heights, compute the total water trapped between bars after rain.

## Why

Water above i is min(maxLeft, maxRight) − height[i]. With pointers at both ends,
whichever side has the smaller running max is bounded by that max regardless of what
lies between, so you can settle that cell and move inward. A monotonic stack that fills
basins as taller bars arrive is the classic alternative.

## Why not

- sliding-window: Water at i depends on the global max to the left and right, not on a local window.
- prefix-sum: Prefix maxima (not sums) from both sides do work in O(n) space; two pointers gets it
  to O(1).
- dp-1d: The two-array solution is DP-ish, but the interview-expected technique is the
  converging pointers or a stack.

## Complexity

O(n) time, O(1) space with two pointers; O(n) space with the stack.
