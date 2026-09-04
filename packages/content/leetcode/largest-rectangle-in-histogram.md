---
id: largest-rectangle-in-histogram
title: 'Largest Rectangle In Histogram'
leetcode: https://leetcode.com/problems/largest-rectangle-in-histogram/
neetcode: https://neetcode.io/problems/largest-rectangle-in-histogram?list=neetcode150
difficulty: Hard
family: 'Stack'
order: 5
lists: [neetcode150]
patterns: [monotonic-stack]
---

## Prompt

Given bar heights of width 1, find the largest rectangle that fits entirely under the
histogram.

## Why

A bar's rectangle extends until the nearest shorter bar on each side. Maintain a stack
of increasing heights; when a shorter bar arrives, pop taller ones — each popped bar now
knows its right boundary (current index) and left boundary (new stack top), so its area
is settled.

## Why not

- two-pointers: The best rectangle is bounded by the nearest shorter bar on each side, which
  converging pointers cannot find.
- dp-1d: You can precompute left/right boundaries in arrays, but that precomputation is itself
  the monotonic stack.
- binary-search: Heights are not sorted; nothing to bisect.

## Complexity

O(n) time, O(n) space.
