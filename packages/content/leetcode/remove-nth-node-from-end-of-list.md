---
id: remove-nth-node-from-end-of-list
title: 'Remove Nth Node From End of List'
leetcode: https://leetcode.com/problems/remove-nth-node-from-end-of-list/
neetcode: https://neetcode.io/problems/remove-node-from-end-of-linked-list?list=neetcode150
difficulty: Medium
family: 'Linked List'
order: 4
lists: [blind75, neetcode150]
patterns: [fast-slow-pointers]
---

## Prompt

Remove the n-th node from the end of a singly linked list in one pass.

## Why

Send a lead pointer n steps ahead, then advance lead and trail together until lead hits
the end. Trail now sits just before the target. A dummy head handles removing the first
node.

## Why not

- linked-list: The removal is trivial; the trick is locating the node in one pass, which the gap
  pointers do.
- stack: Pushing everything to pop n nodes works but needs O(n) space.
- hash-map: Storing index → node is O(n) space for a problem solvable with two pointers.

## Complexity

O(n) time, O(1) space.
