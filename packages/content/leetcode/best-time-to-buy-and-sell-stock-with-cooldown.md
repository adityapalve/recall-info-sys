---
id: best-time-to-buy-and-sell-stock-with-cooldown
title: 'Best Time to Buy And Sell Stock With Cooldown'
leetcode: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/
neetcode: https://neetcode.io/problems/buy-and-sell-crypto-with-cooldown?list=neetcode150
difficulty: Medium
family: '2-D Dynamic Programming'
order: 2
lists: [neetcode150]
patterns: [dp-2d]
---

## Prompt

Maximise profit trading a stock any number of times when you must wait one day after
selling before buying again.

## Why

A state machine DP: at each day track the best value while holding, while just sold
(cooling), and while free to buy. Each state depends on the previous day's states, so
the "2-D" is (day × state).

## Why not

- sliding-window: The cooldown makes the min-so-far window trick insufficient.
- greedy: Selling on every rise ignores the forced idle day.
- kadane: Profit is not a single contiguous sum once transactions can repeat.

## Complexity

O(n) time, O(1) space.
