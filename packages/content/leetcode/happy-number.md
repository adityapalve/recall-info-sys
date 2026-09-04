---
id: happy-number
title: 'Happy Number'
leetcode: https://leetcode.com/problems/happy-number/
neetcode: https://neetcode.io/problems/non-cyclical-number?list=neetcode150
difficulty: Easy
family: 'Math & Geometry'
order: 3
lists: [neetcode150]
patterns: [fast-slow-pointers, hash-map]
---

## Prompt

Repeatedly replace a number by the sum of the squares of its digits. Decide whether it
reaches 1 or loops forever.

## Why

The sequence is a walk in a functional graph, so it either reaches 1 or enters a cycle.
Detect the cycle with a set of seen values, or with fast/slow pointers to avoid extra
space.

## Why not

- hash-map: A visited set works and is the obvious answer; Floyd's cycle detection removes the
  space cost.
- math: Digit-sum arithmetic is the step function; the question is whether iterating it loops.
- dp-1d: No recurrence over indices; the sequence is a functional iteration.

## Complexity

O(log n) per step, O(1) space with Floyd.
