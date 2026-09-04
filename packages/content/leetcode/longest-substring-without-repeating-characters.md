---
id: longest-substring-without-repeating-characters
title: 'Longest Substring Without Repeating Characters'
leetcode: https://leetcode.com/problems/longest-substring-without-repeating-characters/
neetcode: https://neetcode.io/problems/longest-substring-without-duplicates?list=neetcode150
difficulty: Medium
family: 'Sliding Window'
order: 1
lists: [blind75, neetcode150]
patterns: [sliding-window]
---

## Prompt

Given a string, find the length of the longest substring with no repeated characters.

## Why

Grow the right edge one character at a time. When the new character is already in the
window, advance the left edge past its previous occurrence. The window is always
duplicate-free, so its size is a candidate answer.

## Why not

- hash-map: A set of seen characters is part of the solution, but the technique that makes it
  linear is the moving window.
- two-pointers: The pointers move in the same direction and define a contiguous range — that is what
  "sliding window" names.
- dp-1d: You could define dp[i] but it needs the last-seen index anyway, which is the window.

## Complexity

O(n) time, O(min(n, alphabet)) space.
