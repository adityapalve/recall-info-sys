---
id: min-stack
title: 'Min Stack'
leetcode: https://leetcode.com/problems/min-stack/
neetcode: https://neetcode.io/problems/minimum-stack?list=neetcode150
difficulty: Medium
family: 'Stack'
order: 1
lists: [neetcode150]
patterns: [stack]
---

## Prompt

Design a stack that supports push, pop, top, and retrieving the minimum, all in constant
time.

## Why

Keep a second stack that records the minimum as of each push (min of new value and
previous min). Popping both stacks together keeps them in sync, so the current min is
always on top of the auxiliary stack.

## Why not

- heap: A heap gives the min but cannot pop in stack order in O(1).
- hash-map: Maps do not track ordering, and the min changes as elements leave.
- sorting: Re-sorting on every operation is O(n log n) per call; the target is O(1).

## Complexity

O(1) per operation, O(n) space.
