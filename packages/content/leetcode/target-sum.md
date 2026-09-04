---
id: target-sum
title: 'Target Sum'
leetcode: https://leetcode.com/problems/target-sum/
neetcode: https://neetcode.io/problems/target-sum?list=neetcode150
difficulty: Medium
family: '2-D Dynamic Programming'
order: 4
lists: [neetcode150]
patterns: [knapsack]
---

## Prompt

Assign + or − to each number so the expression equals a target; count the assignments.

## Why

Let P be the positive subset: P − (total − P) = target gives P = (total + target)/2.
Count subsets with that sum via 0/1 knapsack counting.

## Why not

- backtracking: Trying every sign assignment is O(2ⁿ); the sum is bounded so DP is polynomial.
- dp-2d: After the subset-sum reduction, a 1-D array over sums suffices.
- bit-manipulation: Signs are choices, not bits to manipulate.

## Complexity

O(n · sum) time, O(sum) space.
