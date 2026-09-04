---
id: two-sum-ii-input-array-is-sorted
title: 'Two Sum II Input Array Is Sorted'
leetcode: https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/
neetcode: https://neetcode.io/problems/two-integer-sum-ii?list=neetcode150
difficulty: Medium
family: 'Two Pointers'
order: 1
lists: [neetcode150]
patterns: [two-pointers]
pinnedDistractors: [hash-map]
---

## Prompt

Given a sorted array and a target, return the 1-based positions of two numbers that sum
to the target.

## Why

Start pointers at both ends. If the sum is too small only moving the left pointer right
can increase it; if too big only moving the right pointer left can decrease it. Each
step eliminates one candidate, so it finishes in one pass.

## Why not

- hash-map: Works but uses O(n) space; the sorted order lets two pointers do it in O(1).
- binary-search: Searching for the complement of each element is O(n log n); two pointers is O(n).
- sliding-window: The pair is not contiguous; the window idea does not apply.

## Complexity

O(n) time, O(1) space.
