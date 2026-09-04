---
id: add-two-numbers
title: 'Add Two Numbers'
leetcode: https://leetcode.com/problems/add-two-numbers/
neetcode: https://neetcode.io/problems/add-two-numbers?list=neetcode150
difficulty: Medium
family: 'Linked List'
order: 6
lists: [neetcode150]
patterns: [linked-list, math]
---

## Prompt

Two non-negative integers are stored as linked lists with digits in reverse order.
Return their sum as a linked list.

## Why

Walk both lists together adding digit + digit + carry, emit sum % 10, carry sum / 10.
Keep going while either list or the carry remains.

## Why not

- stack: Digits are already least-significant first, so no reversal via a stack is needed.
- string-manipulation: Converting to strings or integers risks overflow and misses the point of digit-by-
  digit carry.
- two-pointers: You walk two lists in lockstep, but the technique is carry propagation, not converging
  indices.

## Complexity

O(max(n, m)) time, O(max(n, m)) space for the output.
