---
id: evaluate-reverse-polish-notation
title: 'Evaluate Reverse Polish Notation'
leetcode: https://leetcode.com/problems/evaluate-reverse-polish-notation/
neetcode: https://neetcode.io/problems/evaluate-reverse-polish-notation?list=neetcode150
difficulty: Medium
family: 'Stack'
order: 2
lists: [neetcode150]
patterns: [stack]
---

## Prompt

Given tokens of an arithmetic expression in postfix (reverse Polish) notation, evaluate
it.

## Why

In postfix, an operator applies to the two most recent operands — LIFO again. Push
numbers; on an operator pop two, apply (mind the order for − and ÷), push the result.
One value remains at the end.

## Why not

- tree-dfs: Building an expression tree and evaluating it works but is a detour; postfix is
  already tree-free.
- two-pointers: Operands and operators are interleaved with no positional symmetry to exploit.
- math: The arithmetic is trivial; the structure problem is operand ordering, which the stack
  solves.

## Complexity

O(n) time, O(n) space.
