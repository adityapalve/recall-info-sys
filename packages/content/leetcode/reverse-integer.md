---
id: reverse-integer
title: 'Reverse Integer'
leetcode: https://leetcode.com/problems/reverse-integer/
neetcode: https://neetcode.io/problems/reverse-integer?list=neetcode150
difficulty: Medium
family: 'Bit Manipulation'
order: 6
lists: [neetcode150]
patterns: [math]
---

## Prompt

Reverse the digits of a signed 32-bit integer, returning 0 if the result would overflow.

## Why

Peel digits with % 10 and / 10, building the result as result·10 + digit. Before each
step check whether result would exceed the 32-bit bound.

## Why not

- string-manipulation: Reversing the string form works but overflow detection is the actual difficulty.
- bit-manipulation: The digits are base 10; bit reversal is a different operation.
- stack: Popping digits is a metaphor; a modulo loop does it without a stack.

## Complexity

O(log n) time, O(1) space.
