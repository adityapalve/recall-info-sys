---
id: product-of-array-except-self
title: 'Product of Array Except Self'
leetcode: https://leetcode.com/problems/product-of-array-except-self/
neetcode: https://neetcode.io/problems/products-of-array-discluding-self?list=neetcode150
difficulty: Medium
family: 'Arrays & Hashing'
order: 6
lists: [blind75, neetcode150]
patterns: [prefix-sum]
---

## Prompt

Given an integer array, return an array where each position holds the product of every
other element, without using division.

## Why

The product of everything except i is (product of the prefix before i) × (product of the
suffix after i). Build prefix products left to right into the output, then sweep right
to left carrying a running suffix product and multiply it in.

## Why not

- math: Dividing the total product by each element breaks on zeros, and division is
  disallowed.
- hash-map: No lookups are needed; the answer at i depends on position, not on which values exist.
- dp-1d: Close in spirit, but the specific trick is two directional running products, i.e.
  prefix and suffix products.

## Complexity

O(n) time, O(1) extra space beyond the output.
