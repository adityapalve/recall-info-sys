---
id: word-break
title: 'Word Break'
leetcode: https://leetcode.com/problems/word-break/
neetcode: https://neetcode.io/problems/word-break?list=neetcode150
difficulty: Medium
family: '1-D Dynamic Programming'
order: 9
lists: [blind75, neetcode150]
patterns: [dp-1d]
---

## Prompt

Decide whether a string can be split into a sequence of words from a given dictionary.

## Why

dp[i] is true if the prefix of length i can be segmented: for some j < i, dp[j] is true
and s[j..i) is a word. dp[0] is true.

## Why not

- trie: A trie speeds up prefix lookups but the segmentation decision is the DP.
- backtracking: Exponential without memoisation on inputs like "aaaa…b".
- sliding-window: Word boundaries are not a window invariant.

## Complexity

O(n² · L) time, O(n) space.
