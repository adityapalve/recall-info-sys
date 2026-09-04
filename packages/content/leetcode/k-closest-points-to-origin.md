---
id: k-closest-points-to-origin
title: 'K Closest Points to Origin'
leetcode: https://leetcode.com/problems/k-closest-points-to-origin/
neetcode: https://neetcode.io/problems/k-closest-points-to-origin?list=neetcode150
difficulty: Medium
family: 'Heap / Priority Queue'
order: 2
lists: [neetcode150]
patterns: [top-k]
---

## Prompt

Given points on a plane and k, return the k points closest to the origin.

## Why

Maintain a max-heap of size k keyed by squared distance. Push each point; if the heap
grows past k, pop the farthest. What remains are the k closest. (Quickselect achieves
average O(n).)

## Why not

- sorting: Sort by distance is O(n log n); a size-k heap is O(n log k), and quickselect is O(n)
  average.
- binary-search-on-answer: Bisecting a radius and counting points works but is clumsier than the heap.
- graph-bfs: No graph; distances are direct computations.

## Complexity

O(n log k) time, O(k) space.
