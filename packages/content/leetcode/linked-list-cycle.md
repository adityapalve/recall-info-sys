---
id: linked-list-cycle
title: 'Linked List Cycle'
leetcode: https://leetcode.com/problems/linked-list-cycle/
neetcode: https://neetcode.io/problems/linked-list-cycle-detection?list=neetcode150
difficulty: Easy
family: 'Linked List'
order: 2
lists: [blind75, neetcode150]
patterns: [fast-slow-pointers]
pinnedDistractors: [hash-map]
---

## Prompt

Given a linked list, determine whether it contains a cycle.

## Why

Advance one pointer by one node and another by two. In a cycle the fast pointer laps the
slow one and they meet; in a straight list the fast pointer reaches null.

## Why not

- hash-map: A visited set works but uses O(n) space; Floyd's two pointers need none.
- linked-list: No pointer rewiring is needed, just traversal at two speeds.
- two-pointers: The pointers move at different speeds, which is the specific fast/slow technique.

## Complexity

O(n) time, O(1) space.
