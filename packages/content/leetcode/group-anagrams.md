---
id: group-anagrams
title: 'Group Anagrams'
leetcode: https://leetcode.com/problems/group-anagrams/
neetcode: https://neetcode.io/problems/anagram-groups?list=neetcode150
difficulty: Medium
family: 'Arrays & Hashing'
order: 3
lists: [blind75, neetcode150]
patterns: [hash-map]
---

## Prompt

Given a list of words, group together the ones that are anagrams of each other.

## Why

Every anagram class has a canonical signature: its sorted characters, or its 26-letter
count vector. Map signature → list of words and every word lands in its group in one
pass.

## Why not

- sorting: Sorting each word gives a key, but the grouping still needs a map; sorting the whole
  list does not bring anagrams together on its own.
- trie: A trie matches prefixes, not permutations; "eat" and "tea" share no prefix.
- backtracking: Generating permutations of each word to find matches is exponential and unnecessary.

## Complexity

O(n · k) time with the count signature (O(n · k log k) with sorting), O(n · k) space.
