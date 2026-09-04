---
id: powx-n
title: 'Pow(x, n)'
leetcode: https://leetcode.com/problems/powx-n/
neetcode: https://neetcode.io/problems/pow-x-n?list=neetcode150
difficulty: Medium
family: 'Math & Geometry'
order: 5
lists: [neetcode150]
patterns: [math]
---

## Prompt

Compute x raised to the integer power n, handling negative exponents.

## Why

Fast exponentiation: xⁿ = (x²)^(n/2), times x if n is odd. Handle negative n by
inverting the result. Each step halves n.

## Why not

- dp-1d: Memoising powers is unnecessary; halving the exponent is direct.
- bit-manipulation: Reading the exponent's bits is one implementation of the same fast-power idea.
- binary-search: Nothing is searched; the exponent is halved to reduce work.

## Complexity

O(log n) time, O(1) space iteratively.
