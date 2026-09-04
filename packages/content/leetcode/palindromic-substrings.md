---
id: palindromic-substrings
title: 'Palindromic Substrings'
leetcode: https://leetcode.com/problems/palindromic-substrings/
neetcode: https://neetcode.io/problems/palindromic-substrings?list=neetcode150
difficulty: Medium
family: '1-D Dynamic Programming'
order: 5
lists: [blind75, neetcode150]
patterns: [expand-around-center, dp-2d]
---

## Prompt

Count how many substrings of a string are palindromes.

## Why

Expand from each of the 2n−1 centers; every successful expansion step is one more
palindrome. Sum the steps.

## Why not

- hash-map: Substrings are not looked up; each must be tested for symmetry.
- sliding-window: No window invariant characterises palindromes.
- backtracking: Nothing is partitioned or chosen; you count.

## Complexity

O(n²) time, O(1) space.
