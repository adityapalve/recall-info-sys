---
id: valid-parentheses
title: 'Valid Parentheses'
leetcode: https://leetcode.com/problems/valid-parentheses/
neetcode: https://neetcode.io/problems/validate-parentheses?list=neetcode150
difficulty: Easy
family: 'Stack'
order: 0
lists: [blind75, neetcode150]
patterns: [stack]
---

## Prompt

Given a string of brackets of three kinds, decide whether every bracket is closed by the
matching kind in the correct order.

## Why

The most recently opened bracket must be the first closed — that is exactly a stack.
Push openers; on a closer, pop and compare kinds. Valid iff no mismatch and the stack
ends empty.

## Why not

- two-pointers: Matching from both ends fails on inputs like "()[]" where the outer characters are not
  a pair.
- hash-map: A map from closer to opener is a helper; the nesting itself needs LIFO.
- backtracking: Nothing is being generated; this is validation of a given string in one pass.

## Complexity

O(n) time, O(n) space.
