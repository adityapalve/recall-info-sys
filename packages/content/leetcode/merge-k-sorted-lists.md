---
id: merge-k-sorted-lists
title: 'Merge K Sorted Lists'
leetcode: https://leetcode.com/problems/merge-k-sorted-lists/
neetcode: https://neetcode.io/problems/merge-k-sorted-linked-lists?list=neetcode150
difficulty: Hard
family: 'Linked List'
order: 9
lists: [blind75, neetcode150]
patterns: [heap, linked-list]
---

## Prompt

Merge k sorted linked lists into one sorted list.

## Why

Keep a min-heap of the current head of each list. Pop the smallest, append it, and push
that list's next node. Each of the N nodes passes through a heap of size k. (Pairwise
divide-and-conquer merging achieves the same bound.)

## Why not

- two-pointers: Two pointers merge two lists; with k lists you need to find the min head among k each
  step.
- sorting: Collecting all nodes and sorting is O(N log N), worse than O(N log k).
- top-k: You want the single minimum among k heads repeatedly, not the k largest overall.

## Complexity

O(N log k) time, O(k) space.
