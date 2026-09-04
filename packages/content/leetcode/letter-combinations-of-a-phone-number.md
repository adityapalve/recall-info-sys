---
id: letter-combinations-of-a-phone-number
title: 'Letter Combinations of a Phone Number'
leetcode: https://leetcode.com/problems/letter-combinations-of-a-phone-number/
neetcode: https://neetcode.io/problems/combinations-of-a-phone-number?list=neetcode150
difficulty: Medium
family: 'Backtracking'
order: 8
lists: [neetcode150]
patterns: [backtracking]
---

## Prompt

Given a string of digits 2–9, return every letter string they could represent on a phone
keypad.

## Why

Recurse one digit at a time, appending each of its letters and recursing on the next
digit. The leaves are the answers. It is the cartesian product done recursively.

## Why not

- hash-map: The digit → letters map is input data, not the algorithm.
- dp-1d: There is nothing to optimise; all combinations are required.
- trie: No dictionary is being matched.

## Complexity

O(4ⁿ · n) time and output.
