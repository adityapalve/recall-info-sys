---
id: valid-palindrome
title: 'Valid Palindrome'
leetcode: https://leetcode.com/problems/valid-palindrome/
neetcode: https://neetcode.io/problems/is-palindrome?list=neetcode150
difficulty: Easy
family: 'Two Pointers'
order: 0
lists: [blind75, neetcode150]
patterns: [two-pointers]
---

## Prompt

Given a string, decide whether it reads the same forwards and backwards after ignoring
non-alphanumerics and case.

## Why

Palindromes are symmetric about the middle, so compare from both ends: advance the left
pointer past junk, retreat the right past junk, compare, and move inward until they
cross.

## Why not

- stack: Pushing the first half and popping against the second works but costs O(n) space for a
  problem that needs none.
- string-manipulation: Cleaning the string then comparing to its reverse is fine but allocates; converging
  pointers do it in place.
- hash-map: Character counts cannot tell "abc cba" from "acb bca"; order matters.

## Complexity

O(n) time, O(1) space.
