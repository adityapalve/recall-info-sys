---
id: reorder-list
title: 'Reorder List'
leetcode: https://leetcode.com/problems/reorder-list/
neetcode: https://neetcode.io/problems/reorder-linked-list?list=neetcode150
difficulty: Medium
family: 'Linked List'
order: 3
lists: [blind75, neetcode150]
patterns: [fast-slow-pointers, linked-list]
---

## Prompt

Rearrange a linked list so the nodes alternate first, last, second, second-to-last, and
so on, in place.

## Why

Find the middle with fast/slow pointers, reverse the second half, then merge the two
halves alternately. Three standard list operations composed.

## Why not

- stack: Pushing all nodes to access them from the back works but costs O(n) space.
- two-pointers: You cannot walk backwards in a singly linked list, so the "right pointer" has to be
  manufactured by reversing.
- heap: No ordering by value; the interleaving is positional.

## Complexity

O(n) time, O(1) space.
