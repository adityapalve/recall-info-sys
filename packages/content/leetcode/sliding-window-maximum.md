---
id: sliding-window-maximum
title: 'Sliding Window Maximum'
leetcode: https://leetcode.com/problems/sliding-window-maximum/
neetcode: https://neetcode.io/problems/sliding-window-maximum?list=neetcode150
difficulty: Hard
family: 'Sliding Window'
order: 5
lists: [neetcode150]
patterns: [monotonic-stack, sliding-window]
pinnedDistractors: [heap]
---

## Prompt

Given an array and a window size k, return the maximum of every contiguous window of
size k.

## Why

Keep a deque of indices whose values are decreasing. A new element pops everything
smaller from the back (they can never be the max again), and the front is evicted when
it falls out of the window. The front is always the current max.

## Why not

- heap: A max-heap with lazy deletion works in O(n log k) but the deque gives O(n).
- prefix-sum: Max does not decompose over ranges the way sums do.
- two-pointers: Two pointers alone cannot recover the max after the old max leaves the window.

## Complexity

O(n) time, O(k) space.
