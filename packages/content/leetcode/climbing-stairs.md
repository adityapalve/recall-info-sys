---
id: climbing-stairs
title: 'Climbing Stairs'
leetcode: https://leetcode.com/problems/climbing-stairs/
neetcode: https://neetcode.io/problems/climbing-stairs?list=neetcode150
difficulty: Easy
family: '1-D Dynamic Programming'
order: 0
lists: [blind75, neetcode150]
patterns: [dp-1d]
---

## Prompt

You climb a staircase taking 1 or 2 steps at a time. Count the distinct ways to reach
the top of n steps.

## Why

The ways to reach step i equal the ways to reach i−1 plus the ways to reach i−2. Keep
just the last two values.

## Why not

- backtracking: Enumerating every sequence of steps is exponential; only the count is needed.
- math: A closed form exists (Fibonacci), but the recognisable technique is the recurrence.
- greedy: There is no choice to optimise; you are counting ways.

## Complexity

O(n) time, O(1) space.
