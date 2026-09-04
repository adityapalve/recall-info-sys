---
id: gas-station
title: 'Gas Station'
leetcode: https://leetcode.com/problems/gas-station/
neetcode: https://neetcode.io/problems/gas-station?list=neetcode150
difficulty: Medium
family: 'Greedy'
order: 3
lists: [neetcode150]
patterns: [greedy]
---

## Prompt

Stations around a circle each provide gas and cost gas to reach the next. Find the
starting station from which you can complete the loop, or −1.

## Why

If total gas ≥ total cost a solution exists. Scan once keeping a running tank; whenever
it goes negative, the start must be after this station, so reset the tank and set the
candidate start to the next index.

## Why not

- prefix-sum: Prefix sums of gas−cost help see it, but the single-pass reset rule is the technique.
- dp-1d: No overlapping subproblems; a linear scan with a reset settles it.
- two-pointers: A circular route is not a pair search.

## Complexity

O(n) time, O(1) space.
