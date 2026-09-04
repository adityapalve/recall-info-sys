---
id: top-k-frequent-elements
title: 'Top K Frequent Elements'
leetcode: https://leetcode.com/problems/top-k-frequent-elements/
neetcode: https://neetcode.io/problems/top-k-elements-in-list?list=neetcode150
difficulty: Medium
family: 'Arrays & Hashing'
order: 4
lists: [blind75, neetcode150]
patterns: [bucket-sort, top-k]
---

## Prompt

Given an integer array and k, return the k values that occur most often.

## Why

After counting, frequencies are bounded by n, so you can bucket values by frequency
(index = count) and walk the buckets from the top until you have k. That is O(n). A
size-k min-heap over the counts is the more general O(n log k) alternative.

## Why not

- sorting: Sorting by frequency is O(n log n); both the heap and bucket approaches beat that.
- hash-map: Counting is only the first step — a map alone does not give you the k largest counts.
- sliding-window: Frequencies are global over the array; no contiguous window is involved.

## Complexity

O(n) time and space with buckets; O(n log k) with a heap.
