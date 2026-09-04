---
id: maximum-subarray
title: 'Maximum Subarray'
leetcode: https://leetcode.com/problems/maximum-subarray/
neetcode: https://neetcode.io/problems/maximum-subarray?list=neetcode150
difficulty: Medium
family: 'Greedy'
order: 0
lists: [blind75, neetcode150]
patterns: [kadane, dp-1d]
---

## Prompt

Find the contiguous subarray with the largest sum.

## Why

Best sum ending at i is nums[i] + max(0, best ending at i−1): extend the previous run if
it helps, otherwise restart. Track the overall maximum.

## Why not

- prefix-sum: Prefix sums plus a running minimum also work but Kadane is the direct O(1)-space form.
- sliding-window: There is no shrink condition; negative sums are dropped by restarting, not by moving a
  left pointer.
- two-pointers: No sorted structure; the optimum is found by extend-or-restart.

## Complexity

O(n) time, O(1) space.
