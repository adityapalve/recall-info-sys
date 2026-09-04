---
id: number-of-1-bits
title: 'Number of 1 Bits'
leetcode: https://leetcode.com/problems/number-of-1-bits/
neetcode: https://neetcode.io/problems/number-of-one-bits?list=neetcode150
difficulty: Easy
family: 'Bit Manipulation'
order: 1
lists: [blind75, neetcode150]
patterns: [bit-manipulation]
---

## Prompt

Count how many bits are set to 1 in a 32-bit integer.

## Why

n & (n − 1) clears the lowest set bit. Loop until n is zero, counting iterations — one
per set bit.

## Why not

- math: Repeated division by 2 works but is the same idea expressed less directly.
- dp-1d: A table of popcounts is the next problem; for one number a loop is enough.
- string-manipulation: Converting to a binary string and counting is slow and misses the point.

## Complexity

O(number of set bits) time, O(1) space.
