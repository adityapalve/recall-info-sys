---
id: container-with-most-water
title: 'Container With Most Water'
leetcode: https://leetcode.com/problems/container-with-most-water/
neetcode: https://neetcode.io/problems/max-water-container?list=neetcode150
difficulty: Medium
family: 'Two Pointers'
order: 3
lists: [blind75, neetcode150]
patterns: [two-pointers]
---

## Prompt

Given bar heights, pick two bars that together with the x-axis hold the most water
(width × the shorter height).

## Why

Start with the widest container. Moving the taller side inward can never help because
the shorter side bounds the area, so always move the shorter pointer. This discards only
pairs that cannot beat the current best.

## Why not

- monotonic-stack: That solves "next taller bar" questions; here you need the best pair, not neighbours.
- sliding-window: The best pair can be far apart; there is no contiguous-window property to maintain.
- greedy: The pointer rule is greedy-flavoured, but the recognisable technique is converging
  pointers on the two ends.

## Complexity

O(n) time, O(1) space.
