---
id: kth-largest-element-in-an-array
title: 'Kth Largest Element In An Array'
leetcode: https://leetcode.com/problems/kth-largest-element-in-an-array/
neetcode: https://neetcode.io/problems/kth-largest-element-in-an-array?list=neetcode150
difficulty: Medium
family: 'Heap / Priority Queue'
order: 3
lists: [neetcode150]
patterns: [top-k]
---

## Prompt

Find the k-th largest element in an unsorted array without fully sorting it.

## Why

A min-heap bounded to k elements ends with the k-th largest at its root. Alternatively,
quickselect partitions around a pivot and recurses into only the side containing index
n−k.

## Why not

- sorting: Correct at O(n log n) but the heap is O(n log k) and quickselect is O(n) on average.
- binary-search: The array is unsorted; binary search on the value range with counting is possible but
  roundabout.
- bucket-sort: Only viable when the value range is small; the general answer is a heap or
  quickselect.

## Complexity

O(n log k) time with a heap; O(n) average with quickselect.
