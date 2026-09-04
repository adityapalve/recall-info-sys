---
id: subsets-ii
title: 'Subsets II'
leetcode: https://leetcode.com/problems/subsets-ii/
neetcode: https://neetcode.io/problems/subsets-ii?list=neetcode150
difficulty: Medium
family: 'Backtracking'
order: 4
lists: [neetcode150]
patterns: [backtracking, sorting]
---

## Prompt

Given integers that may repeat, return every unique subset.

## Why

Sort so duplicates are adjacent. During backtracking, at each level skip an element
equal to its predecessor unless the predecessor was just taken; that yields each
multiset subset once.

## Why not

- hash-map: A set of sorted tuples deduplicates but costs hashing; sorting plus skip is the
  intended trick.
- bit-manipulation: Bitmask enumeration produces duplicates when values repeat.
- dp-1d: Enumeration, not optimisation.

## Complexity

O(n · 2ⁿ) time and output.
