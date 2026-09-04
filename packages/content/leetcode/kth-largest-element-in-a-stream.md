---
id: kth-largest-element-in-a-stream
title: 'Kth Largest Element In a Stream'
leetcode: https://leetcode.com/problems/kth-largest-element-in-a-stream/
neetcode: https://neetcode.io/problems/kth-largest-integer-in-a-stream?list=neetcode150
difficulty: Easy
family: 'Heap / Priority Queue'
order: 0
lists: [neetcode150]
patterns: [top-k]
---

## Prompt

Design a class that is initialised with a stream of numbers and k, and after each new
number returns the k-th largest so far.

## Why

Keep a min-heap of the k largest values seen. Its root is the k-th largest. On add, push
and, if the heap exceeds k, pop the minimum.

## Why not

- sorting: Re-sorting on every add is O(n log n) per call; the heap does it in O(log k).
- heap: A full heap of everything wastes space; the point is bounding it to size k.
- binary-search: Inserting into a sorted array is O(n) per add because of shifting.

## Complexity

O(log k) per add, O(k) space.
