---
id: find-minimum-in-rotated-sorted-array
title: 'Find Minimum In Rotated Sorted Array'
leetcode: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
neetcode: https://neetcode.io/problems/find-minimum-in-rotated-sorted-array?list=neetcode150
difficulty: Medium
family: 'Binary Search'
order: 3
lists: [blind75, neetcode150]
patterns: [binary-search]
---

## Prompt

A sorted array has been rotated at an unknown pivot. Find its minimum element in
logarithmic time.

## Why

Compare mid with the right end. If mid > right, the minimum is to the right of mid;
otherwise it is at mid or to the left. Either way half the range is eliminated, and the
loop converges on the pivot.

## Why not

- sorting: Sorting is O(n log n) and throws away the structure you are supposed to exploit.
- two-pointers: Converging pointers do not halve the range; you would still scan linearly.
- binary-search-on-answer: You are searching positions in a partially sorted array, not guessing a numeric answer
  and testing feasibility.

## Complexity

O(log n) time, O(1) space.
