---
id: longest-palindromic-substring
title: 'Longest Palindromic Substring'
leetcode: https://leetcode.com/problems/longest-palindromic-substring/
neetcode: https://neetcode.io/problems/longest-palindromic-substring?list=neetcode150
difficulty: Medium
family: '1-D Dynamic Programming'
order: 4
lists: [blind75, neetcode150]
patterns: [expand-around-center, dp-2d]
---

## Prompt

Find the longest substring of a string that is a palindrome.

## Why

Every palindrome is symmetric around a center — a character or a gap between two. For
each of the 2n−1 centers, expand outward while the ends match and record the longest.

## Why not

- dp-2d: A table of dp[i][j] works but is O(n²) space; expanding from centers is O(1) space at
  the same time.
- sliding-window: Palindromes are not maintained by a growing/shrinking window.
- two-pointers: Two pointers converging from the ends only checks the whole string.

## Complexity

O(n²) time, O(1) space.
