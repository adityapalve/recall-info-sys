---
id: time-based-key-value-store
title: 'Time Based Key Value Store'
leetcode: https://leetcode.com/problems/time-based-key-value-store/
neetcode: https://neetcode.io/problems/time-based-key-value-store?list=neetcode150
difficulty: Medium
family: 'Binary Search'
order: 5
lists: [neetcode150]
patterns: [binary-search, hash-map]
---

## Prompt

Design a key-value store where each set carries a timestamp and get(key, t) returns the
value set at the largest timestamp ≤ t.

## Why

Timestamps for a key arrive in increasing order, so each key's history is a sorted list.
Store key → list of (timestamp, value) and binary search for the rightmost timestamp ≤
t.

## Why not

- hash-linked-list: There is no eviction or recency ordering; timestamps only ever increase.
- heap: Lookups need "largest timestamp ≤ t", which a heap cannot answer without draining.
- trie: Keys are looked up exactly, not by prefix.

## Complexity

O(1) set, O(log n) get, O(n) space.
