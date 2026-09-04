---
id: last-stone-weight
title: 'Last Stone Weight'
leetcode: https://leetcode.com/problems/last-stone-weight/
neetcode: https://neetcode.io/problems/last-stone-weight?list=neetcode150
difficulty: Easy
family: 'Heap / Priority Queue'
order: 1
lists: [neetcode150]
patterns: [heap]
---

## Prompt

Repeatedly take the two heaviest stones, smash them (the difference survives, if any),
and return the final stone weight or 0.

## Why

Each round needs the two current maxima from a set that changes. A max-heap gives them
in O(log n), and pushing back the remainder keeps the structure consistent.

## Why not

- sorting: Sorting once is not enough — the result of each smash must be re-inserted in order.
- greedy: The rule "always smash the two heaviest" is given; the data structure that supports it
  efficiently is the heap.
- two-pointers: The array changes on every step, so static pointers cannot track the two largest.

## Complexity

O(n log n) time, O(n) space.
