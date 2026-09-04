---
id: search-in-rotated-sorted-array
title: 'Search In Rotated Sorted Array'
leetcode: https://leetcode.com/problems/search-in-rotated-sorted-array/
neetcode: https://neetcode.io/problems/find-target-in-rotated-sorted-array?list=neetcode150
difficulty: Medium
family: 'Binary Search'
order: 4
lists: [blind75, neetcode150]
patterns: [binary-search]
---

## Prompt

A sorted array has been rotated at an unknown pivot. Find the index of a target in
logarithmic time.

## Why

At any mid, at least one of the two halves is properly sorted. Check whether the target
lies within that sorted half using its endpoints; if so search there, otherwise search
the other half.

## Why not

- two-pointers: A linear scan is O(n); the rotated structure still supports halving.
- hash-map: O(n) to build, so it cannot beat a linear scan, let alone log n.
- sorting: Re-sorting loses the original indices you need to return.

## Complexity

O(log n) time, O(1) space.
