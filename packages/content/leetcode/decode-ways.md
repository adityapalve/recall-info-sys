---
id: decode-ways
title: 'Decode Ways'
leetcode: https://leetcode.com/problems/decode-ways/
neetcode: https://neetcode.io/problems/decode-ways?list=neetcode150
difficulty: Medium
family: '1-D Dynamic Programming'
order: 6
lists: [blind75, neetcode150]
patterns: [dp-1d]
---

## Prompt

A digit string encodes letters (1→A … 26→Z). Count the number of ways to decode it.

## Why

Ways to decode from position i = (ways from i+1 if s[i] ≠ "0") + (ways from i+2 if
s[i..i+1] is 10–26). Same shape as climbing stairs with validity conditions.

## Why not

- backtracking: Enumerating decodings is exponential; only the count is needed.
- greedy: No local choice is safe; both one- and two-digit reads must be counted.
- string-manipulation: The parsing is trivial; the recurrence over positions is the substance.

## Complexity

O(n) time, O(1) space.
