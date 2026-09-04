---
id: find-median-from-data-stream
title: 'Find Median From Data Stream'
leetcode: https://leetcode.com/problems/find-median-from-data-stream/
neetcode: https://neetcode.io/problems/find-median-in-a-data-stream?list=neetcode150
difficulty: Hard
family: 'Heap / Priority Queue'
order: 6
lists: [blind75, neetcode150]
patterns: [two-heaps]
---

## Prompt

Design a structure supporting adding numbers and returning the median of everything
added so far.

## Why

Keep a max-heap of the lower half and a min-heap of the upper half, balanced to differ
by at most one in size. The median is a root or the average of both roots. Each add is a
push plus a possible rebalance.

## Why not

- heap: A single heap gives only the min or the max, not the middle.
- sorting: Sorting after every insert is O(n log n) per operation.
- binary-search: Binary insertion into a sorted list finds the position in O(log n) but the shift is
  O(n).

## Complexity

O(log n) add, O(1) median, O(n) space.
