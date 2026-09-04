---
id: single-number
title: 'Single Number'
leetcode: https://leetcode.com/problems/single-number/
neetcode: https://neetcode.io/problems/single-number?list=neetcode150
difficulty: Easy
family: 'Bit Manipulation'
order: 0
lists: [neetcode150]
patterns: [bit-manipulation]
---

## Prompt

Every number in an array appears twice except one. Find it in linear time with constant
space.

## Why

XOR is associative, commutative, and x ^ x = 0. XOR-ing the whole array cancels every
pair and leaves the single number.

## Why not

- hash-map: A count map works but uses O(n) space; XOR needs none.
- sorting: Sorting to find the unpaired element is O(n log n).
- math: Twice-the-set-sum minus the array sum works but still needs the set.

## Complexity

O(n) time, O(1) space.
