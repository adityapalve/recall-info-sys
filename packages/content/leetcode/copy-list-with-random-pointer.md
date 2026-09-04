---
id: copy-list-with-random-pointer
title: 'Copy List With Random Pointer'
leetcode: https://leetcode.com/problems/copy-list-with-random-pointer/
neetcode: https://neetcode.io/problems/copy-linked-list-with-random-pointer?list=neetcode150
difficulty: Medium
family: 'Linked List'
order: 5
lists: [neetcode150]
patterns: [hash-map, linked-list]
---

## Prompt

Deep-copy a linked list whose nodes each also have a random pointer to any node or null.

## Why

Random pointers may point forward, so copy in two passes: first create every clone and
record old → new in a map; second, set each clone's next and random by looking up the
originals' targets. (The interleaving trick puts each clone right after its original to
avoid the map.)

## Why not

- graph-dfs: Treating nodes as a graph and cloning recursively works, but it is really the same old
  → new map with recursion overhead.
- fast-slow-pointers: No cycle detection or midpoint; every node is copied.
- stack: Nothing needs LIFO ordering.

## Complexity

O(n) time, O(n) space (O(1) with interleaving).
