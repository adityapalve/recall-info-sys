---
id: two-sum
title: 'Two Sum'
leetcode: https://leetcode.com/problems/two-sum/
neetcode: https://neetcode.io/problems/two-integer-sum?list=neetcode150
difficulty: Easy
family: 'Arrays & Hashing'
order: 2
lists: [blind75, neetcode150]
patterns: [hash-map]
pinnedDistractors: [two-pointers]
---

## Prompt

Given an unsorted array and a target, return the indices of the two numbers that add up
to the target.

## Why

For each x you want to know whether target − x has already appeared and where. A map
from value to index answers that in O(1), so one pass suffices. Insert after checking to
avoid pairing an element with itself.

## Why not

- two-pointers: Two pointers require a sorted array, and sorting destroys the original indices you
  must return.
- sorting: Same problem: after sorting you lose the indices unless you carry them along, and it
  is O(n log n) anyway.
- binary-search: Searching for target − x per element is O(n log n) and also needs sorted input.

## Complexity

O(n) time, O(n) space.
