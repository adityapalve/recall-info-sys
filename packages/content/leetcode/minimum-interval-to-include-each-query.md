---
id: minimum-interval-to-include-each-query
title: 'Minimum Interval to Include Each Query'
leetcode: https://leetcode.com/problems/minimum-interval-to-include-each-query/
neetcode: https://neetcode.io/problems/minimum-interval-including-query?list=neetcode150
difficulty: Hard
family: 'Intervals'
order: 5
lists: [neetcode150]
patterns: [intervals, heap]
---

## Prompt

For each query point, find the size of the smallest interval containing it, or −1.

## Why

Sort intervals by start and queries ascending. Sweep queries, pushing every interval
that has started into a min-heap keyed by size; pop intervals whose end is before the
query. The heap top is the answer for that query.

## Why not

- binary-search: Finds intervals starting before a query but not the smallest one containing it.
- dp-1d: No recurrence between queries.
- union-find: Intervals are not being merged.

## Complexity

O((n + q) log n) time, O(n) space.
