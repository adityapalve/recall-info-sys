---
id: find-the-duplicate-number
title: 'Find The Duplicate Number'
leetcode: https://leetcode.com/problems/find-the-duplicate-number/
neetcode: https://neetcode.io/problems/find-duplicate-integer?list=neetcode150
difficulty: Medium
family: 'Linked List'
order: 7
lists: [neetcode150]
patterns: [fast-slow-pointers]
pinnedDistractors: [hash-map]
---

## Prompt

An array of n+1 integers in 1..n contains one repeated value. Find it without modifying
the array and in constant space.

## Why

Treat each value as a pointer to an index: i → nums[i]. Because some index is pointed at
twice, this functional graph has a cycle whose entry is the duplicate. Floyd's algorithm
finds the meeting point, then a second pointer from the start finds the entry.

## Why not

- hash-map: A set finds it easily but the problem forbids extra space.
- sorting: Sorting finds adjacent duplicates but the array must not be modified.
- binary-search-on-answer: Counting elements ≤ mid per guess works in O(n log n) without extra space, but the
  O(n) answer is cycle detection.

## Complexity

O(n) time, O(1) space.
