---
id: multiply-strings
title: 'Multiply Strings'
leetcode: https://leetcode.com/problems/multiply-strings/
neetcode: https://neetcode.io/problems/multiply-strings?list=neetcode150
difficulty: Medium
family: 'Math & Geometry'
order: 6
lists: [neetcode150]
patterns: [string-manipulation, math]
---

## Prompt

Multiply two non-negative integers given as strings without converting them to numbers
directly.

## Why

Schoolbook multiplication: digit i of one number times digit j of the other contributes
to position i+j+1 of the result. Accumulate into an int array, then propagate carries
and strip leading zeros.

## Why not

- dp-2d: The digit-product grid looks like a table but there is no optimisation recurrence.
- bit-manipulation: Digits are base 10; bit tricks do not apply.
- stack: Carries propagate in a fixed direction; an array suffices.

## Complexity

O(m · n) time, O(m + n) space.
