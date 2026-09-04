---
id: maximum-product-subarray
title: 'Maximum Product Subarray'
leetcode: https://leetcode.com/problems/maximum-product-subarray/
neetcode: https://neetcode.io/problems/maximum-product-subarray?list=neetcode150
difficulty: Medium
family: '1-D Dynamic Programming'
order: 8
lists: [blind75, neetcode150]
patterns: [kadane, dp-1d]
---

## Prompt

Find the contiguous subarray of an integer array with the largest product.

## Why

Kadane with a twist: a negative number turns the smallest product into the largest, so
track both the max and min product ending at each position and swap them when the
current number is negative.

## Why not

- prefix-sum: Prefix products break on zeros and cannot handle sign flips cleanly.
- sliding-window: No monotone property lets you shrink a window when the product drops.
- greedy: A negative number can be the best thing to keep if another negative follows.

## Complexity

O(n) time, O(1) space.
