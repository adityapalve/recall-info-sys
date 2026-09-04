---
id: contains-duplicate
title: 'Contains Duplicate'
leetcode: https://leetcode.com/problems/contains-duplicate/
neetcode: https://neetcode.io/problems/duplicate-integer?list=neetcode150
difficulty: Easy
family: 'Arrays & Hashing'
order: 0
lists: [blind75, neetcode150]
patterns: [hash-map]
---

## Prompt

Given an integer array, decide whether any value appears at least twice.

## Why

The only question per element is "have I seen this before?" — a set answers that in
O(1). Insert as you scan; the first hit is the answer.

## Why not

- sorting: Works (sort, then check neighbours) but costs O(n log n); a set does it in one O(n)
  pass.
- two-pointers: Two pointers need sorted input; the array is unsorted and you only need membership.
- prefix-sum: Nothing is being summed; the question is "have I seen this value before?".

## Complexity

O(n) time, O(n) space.
