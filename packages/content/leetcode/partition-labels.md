---
id: partition-labels
title: 'Partition Labels'
leetcode: https://leetcode.com/problems/partition-labels/
neetcode: https://neetcode.io/problems/partition-labels?list=neetcode150
difficulty: Medium
family: 'Greedy'
order: 6
lists: [neetcode150]
patterns: [greedy, two-pointers]
---

## Prompt

Split a string into as many parts as possible so that each letter appears in at most one
part, and return the part sizes.

## Why

Precompute each letter's last index. Sweep, extending the current part's end to the max
last-index seen; when the sweep reaches that end, close the part.

## Why not

- hash-map: Recording last positions is the setup; the partitioning is the greedy sweep.
- intervals: You could build intervals per character and merge them, which is the same greedy idea
  with more steps.
- sliding-window: Partitions are decided by last-occurrence, not a window invariant.

## Complexity

O(n) time, O(26) space.
