---
id: hand-of-straights
title: 'Hand of Straights'
leetcode: https://leetcode.com/problems/hand-of-straights/
neetcode: https://neetcode.io/problems/hand-of-straights?list=neetcode150
difficulty: Medium
family: 'Greedy'
order: 4
lists: [neetcode150]
patterns: [greedy, hash-map]
---

## Prompt

Decide whether a hand of cards can be split into groups of a given size where each group
is consecutive values.

## Why

The smallest remaining card must start a group. Count values, repeatedly take the
minimum and try to consume min, min+1, … , min+size−1 from the counts; failure anywhere
means impossible.

## Why not

- sorting: Sorting alone does not tell you how to consume cards into groups; you need counts and
  a smallest-first rule.
- backtracking: Trying every grouping is exponential.
- sliding-window: Groups are formed by value, not by array position.

## Complexity

O(n log n) time, O(n) space.
