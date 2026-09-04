---
id: reverse-nodes-in-k-group
title: 'Reverse Nodes In K Group'
leetcode: https://leetcode.com/problems/reverse-nodes-in-k-group/
neetcode: https://neetcode.io/problems/reverse-nodes-in-k-group?list=neetcode150
difficulty: Hard
family: 'Linked List'
order: 10
lists: [neetcode150]
patterns: [linked-list]
---

## Prompt

Reverse every consecutive group of k nodes in a linked list; a final group shorter than
k stays as is.

## Why

For each group, first confirm k nodes exist, then reverse that segment with the standard
three-pointer loop and reconnect its new tail to the following group. A dummy head keeps
the first group uniform.

## Why not

- stack: Pushing k nodes then popping works but the in-place reversal needs no extra space.
- fast-slow-pointers: You count k ahead, but the substance is reversing and re-splicing segments.
- backtracking: Nothing is searched; the operation is deterministic pointer surgery.

## Complexity

O(n) time, O(1) space.
