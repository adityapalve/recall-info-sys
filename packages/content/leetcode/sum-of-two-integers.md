---
id: sum-of-two-integers
title: 'Sum of Two Integers'
leetcode: https://leetcode.com/problems/sum-of-two-integers/
neetcode: https://neetcode.io/problems/sum-of-two-integers?list=neetcode150
difficulty: Medium
family: 'Bit Manipulation'
order: 5
lists: [blind75, neetcode150]
patterns: [bit-manipulation]
---

## Prompt

Add two integers without using the + or − operators.

## Why

XOR gives the sum without carries; AND shifted left gives the carries. Repeat with those
two until the carry is zero (mask to 32 bits in languages with unbounded ints).

## Why not

- math: The whole point is doing addition without + or −.
- string-manipulation: Binary strings would just simulate what the bit ops do directly.
- dp-1d: No recurrence over inputs.

## Complexity

O(32) time, O(1) space.
