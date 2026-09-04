---
id: reverse-linked-list
title: 'Reverse Linked List'
leetcode: https://leetcode.com/problems/reverse-linked-list/
neetcode: https://neetcode.io/problems/reverse-a-linked-list?list=neetcode150
difficulty: Easy
family: 'Linked List'
order: 0
lists: [blind75, neetcode150]
patterns: [linked-list]
---

## Prompt

Reverse a singly linked list and return the new head.

## Why

Walk the list with prev/curr, and at each node save next, point curr.next at prev, then
advance both. The recursive form does the same from the tail back.

## Why not

- stack: Pushing all nodes and re-linking works but uses O(n) space where three pointers
  suffice.
- two-pointers: Array-style index pointers do not exist in a list; the work is rewiring next pointers.
- fast-slow-pointers: No cycle or midpoint is being found; every node is simply re-pointed.

## Complexity

O(n) time, O(1) space iteratively.
