---
id: counting-bits
title: 'Counting Bits'
leetcode: https://leetcode.com/problems/counting-bits/
neetcode: https://neetcode.io/problems/counting-bits?list=neetcode150
difficulty: Easy
family: 'Bit Manipulation'
order: 2
lists: [blind75, neetcode150]
patterns: [bit-manipulation, dp-1d]
---

## Prompt

For every number from 0 to n, return the number of 1 bits.

## Why

bits(i) = bits(i >> 1) + (i & 1): shifting right drops the lowest bit, and the dropped
bit adds one if set. Fill left to right.

## Why not

- math: Computing each popcount from scratch is O(n log n); the recurrence is linear.
- hash-map: No lookups; the answer for i derives from a smaller i.
- prefix-sum: Not a running sum over the array.

## Complexity

O(n) time, O(n) space for the output.
