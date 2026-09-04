---
id: lru-cache
title: 'LRU Cache'
leetcode: https://leetcode.com/problems/lru-cache/
neetcode: https://neetcode.io/problems/lru-cache?list=neetcode150
difficulty: Medium
family: 'Linked List'
order: 8
lists: [neetcode150]
patterns: [hash-linked-list]
---

## Prompt

Design a cache with a fixed capacity supporting get and put in O(1), evicting the least
recently used key when full.

## Why

Pair a hash map (key → node) with a doubly linked list in recency order. A get or put
moves the node to the front in O(1) because you have both neighbours; eviction pops the
tail.

## Why not

- hash-map: A map gives O(1) lookup but cannot tell you which key is least recently used.
- heap: A heap keyed by last-use time makes "touch" O(log n) and needs decrease-key; the
  target is O(1).
- linked-list: A list alone gives recency order but O(n) lookup.

## Complexity

O(1) per operation, O(capacity) space.
