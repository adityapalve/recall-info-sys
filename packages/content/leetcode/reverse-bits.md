---
id: reverse-bits
title: 'Reverse Bits'
leetcode: https://leetcode.com/problems/reverse-bits/
neetcode: https://neetcode.io/problems/reverse-bits?list=neetcode150
difficulty: Easy
family: 'Bit Manipulation'
order: 3
lists: [blind75, neetcode150]
patterns: [bit-manipulation]
---

## Prompt

Reverse the bits of a 32-bit unsigned integer.

## Why

For each of 32 iterations, shift the result left by one, add the lowest bit of the
input, and shift the input right.

## Why not

- string-manipulation: Reversing a binary string works but allocates and is slower.
- math: Pure arithmetic reversal is clumsier than shifting bits.
- two-pointers: Swapping bit positions from both ends is possible but the shift loop is simpler.

## Complexity

O(32) time, O(1) space.
