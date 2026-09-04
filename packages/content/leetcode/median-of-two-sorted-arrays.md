---
id: median-of-two-sorted-arrays
title: 'Median of Two Sorted Arrays'
leetcode: https://leetcode.com/problems/median-of-two-sorted-arrays/
neetcode: https://neetcode.io/problems/median-of-two-sorted-arrays?list=neetcode150
difficulty: Hard
family: 'Binary Search'
order: 6
lists: [neetcode150]
patterns: [binary-search]
---

## Prompt

Given two sorted arrays, find the median of their combined elements in O(log(m+n)) time.

## Why

Binary search a cut in the shorter array; the cut in the longer array is then determined
so that the left halves together hold half the elements. The cut is correct when every
left element ≤ every right element across both arrays; adjust the cut based on which
side violates.

## Why not

- two-pointers: Merging up to the middle is O(m + n); the required bound is logarithmic.
- two-heaps: That is for a stream; here both inputs are already sorted, so you can bisect a
  partition.
- sorting: Concatenating and sorting is O((m+n) log(m+n)) and ignores the given order.

## Complexity

O(log min(m, n)) time, O(1) space.
