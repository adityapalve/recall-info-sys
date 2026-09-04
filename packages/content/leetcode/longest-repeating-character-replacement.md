---
id: longest-repeating-character-replacement
title: 'Longest Repeating Character Replacement'
leetcode: https://leetcode.com/problems/longest-repeating-character-replacement/
neetcode: https://neetcode.io/problems/longest-repeating-substring-with-replacement?list=neetcode150
difficulty: Medium
family: 'Sliding Window'
order: 2
lists: [blind75, neetcode150]
patterns: [sliding-window]
---

## Prompt

Given a string and k, find the longest substring you can make uniform by changing at
most k characters.

## Why

A window is valid when (window length − count of its most frequent letter) ≤ k. Expand
right; when invalid, shift left. The max-frequency count never needs to decrease for
correctness, which keeps the update O(1).

## Why not

- dp-2d: A table over (position, replacements left) is O(n·k) and unnecessary.
- greedy: Deciding which letter to keep greedily fails; the window handles it via the max-
  frequency count.
- binary-search-on-answer: Binary searching the length with a window check works but adds a log factor for
  nothing.

## Complexity

O(n) time, O(26) space.
