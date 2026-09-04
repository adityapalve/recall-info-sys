---
id: missing-number
title: 'Missing Number'
leetcode: https://leetcode.com/problems/missing-number/
neetcode: https://neetcode.io/problems/missing-number?list=neetcode150
difficulty: Easy
family: 'Bit Manipulation'
order: 4
lists: [blind75, neetcode150]
patterns: [bit-manipulation, math]
---

## Prompt

An array holds n distinct numbers from 0..n with one missing. Find the missing number.

## Why

XOR every index 0..n with every value; pairs cancel and the missing number remains.
Equivalently, subtract the array sum from n(n+1)/2.

## Why not

- hash-map: A set finds it but uses O(n) space.
- sorting: Sorting then scanning is O(n log n).
- binary-search: Only works if the array were sorted, and even then sorting costs more than a linear
  pass.

## Complexity

O(n) time, O(1) space.
