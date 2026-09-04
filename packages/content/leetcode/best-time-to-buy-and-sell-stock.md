---
id: best-time-to-buy-and-sell-stock
title: 'Best Time to Buy And Sell Stock'
leetcode: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
neetcode: https://neetcode.io/problems/buy-and-sell-crypto?list=neetcode150
difficulty: Easy
family: 'Sliding Window'
order: 0
lists: [blind75, neetcode150]
patterns: [sliding-window, kadane]
---

## Prompt

Given daily prices, find the maximum profit from buying on one day and selling on a
later day.

## Why

Sweep left to right keeping the lowest price seen so far (the window's left edge). At
each day the best profit selling today is price − min; track the maximum. Equivalently,
Kadane on the daily differences.

## Why not

- two-pointers: Close, but the left pointer only ever jumps to a new minimum; it is really a window
  tracking the min so far.
- dp-1d: A dp array works but the state collapses to "min price so far" — no table needed.
- greedy: Picking the global max minus global min ignores that the sell must come after the buy.

## Complexity

O(n) time, O(1) space.
