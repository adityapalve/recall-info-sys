---
id: binary-search
title: 'Binary Search'
leetcode: https://leetcode.com/problems/binary-search/
neetcode: https://neetcode.io/problems/binary-search?list=neetcode150
difficulty: Easy
family: 'Binary Search'
order: 0
lists: [neetcode150]
patterns: [binary-search]
---

## Prompt

Given a sorted integer array and a target, return the index of the target or −1, in
logarithmic time.

## Why

Compare the target with the middle element and discard the half that cannot contain it.
Keep lo/hi bounds carefully (lo ≤ hi, mid = lo + (hi − lo)/2) and the loop terminates in
log n steps.

## Why not

- two-pointers: Two pointers scan linearly; the sorted order allows halving the range each step.
- hash-map: Building a map is O(n) up front, defeating the point of a sorted array.
- sorting: The input is already sorted; the work is exploiting that, not producing it.

## Complexity

O(log n) time, O(1) space.
