---
id: merge-two-sorted-lists
title: 'Merge Two Sorted Lists'
leetcode: https://leetcode.com/problems/merge-two-sorted-lists/
neetcode: https://neetcode.io/problems/merge-two-sorted-linked-lists?list=neetcode150
difficulty: Easy
family: 'Linked List'
order: 1
lists: [blind75, neetcode150]
patterns: [linked-list, two-pointers]
---

## Prompt

Merge two sorted linked lists into one sorted list by splicing their nodes.

## Why

Keep a dummy head and a tail pointer. Repeatedly attach whichever list's head is smaller
and advance that list. When one runs out, attach the rest of the other.

## Why not

- heap: A heap is for merging many lists; with two, comparing heads directly is simpler and
  O(1) per step.
- sorting: Both inputs are sorted; re-sorting wastes that.
- fast-slow-pointers: No midpoint or cycle is involved.

## Complexity

O(n + m) time, O(1) space.
