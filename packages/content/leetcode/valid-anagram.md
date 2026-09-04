---
id: valid-anagram
title: 'Valid Anagram'
leetcode: https://leetcode.com/problems/valid-anagram/
neetcode: https://neetcode.io/problems/is-anagram?list=neetcode150
difficulty: Easy
family: 'Arrays & Hashing'
order: 1
lists: [blind75, neetcode150]
patterns: [hash-map]
---

## Prompt

Given two strings, decide whether one is a rearrangement of the other.

## Why

Two strings are anagrams exactly when every character appears the same number of times
in each. Count characters in one, decrement with the other, and check nothing is left
over (a 26-slot array works for lowercase).

## Why not

- sorting: Valid — sort both and compare — but O(n log n) versus O(n) for counting characters.
- two-pointers: There is no ordering to exploit; the strings can be in any character order.
- bit-manipulation: XOR tricks cannot distinguish counts ("aab" vs "abb" collide).

## Complexity

O(n) time, O(1) space for a fixed alphabet.
