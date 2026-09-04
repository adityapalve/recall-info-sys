---
id: minimum-window-substring
title: 'Minimum Window Substring'
leetcode: https://leetcode.com/problems/minimum-window-substring/
neetcode: https://neetcode.io/problems/minimum-window-with-characters?list=neetcode150
difficulty: Hard
family: 'Sliding Window'
order: 4
lists: [blind75, neetcode150]
patterns: [sliding-window]
---

## Prompt

Given strings s and t, find the shortest substring of s that contains every character of
t with multiplicity.

## Why

Expand the right edge until the window covers t (track "characters still needed" as a
single counter). Then shrink from the left while it still covers, recording the
smallest. Each pointer moves at most n steps.

## Why not

- two-pointers: Right idea, wrong name: two same-direction pointers bounding a contiguous range is the
  sliding window.
- hash-map: Counts are needed, but the count map alone does not tell you where the smallest window
  is.
- dp-2d: No overlapping subproblems over two sequences; the window scan is linear.

## Complexity

O(n + m) time, O(alphabet) space.
