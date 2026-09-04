---
id: merge-triplets-to-form-target-triplet
title: 'Merge Triplets to Form Target Triplet'
leetcode: https://leetcode.com/problems/merge-triplets-to-form-target-triplet/
neetcode: https://neetcode.io/problems/merge-triplets-to-form-target?list=neetcode150
difficulty: Medium
family: 'Greedy'
order: 5
lists: [neetcode150]
patterns: [greedy]
---

## Prompt

You can combine triplets by taking the element-wise max. Decide whether the target
triplet can be formed from a given list.

## Why

Any triplet with a component exceeding the target can never be used. Among the rest,
taking all of them is safe; the target is reachable iff each of its three components
appears in some usable triplet.

## Why not

- backtracking: Trying subsets of triplets is exponential; a filter-and-check suffices.
- dp-1d: No recurrence over positions.
- hash-map: You need component-wise comparison, not exact lookup.

## Complexity

O(n) time, O(1) space.
