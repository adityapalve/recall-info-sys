---
id: partition-equal-subset-sum
title: 'Partition Equal Subset Sum'
leetcode: https://leetcode.com/problems/partition-equal-subset-sum/
neetcode: https://neetcode.io/problems/partition-equal-subset-sum?list=neetcode150
difficulty: Medium
family: '1-D Dynamic Programming'
order: 11
lists: [neetcode150]
patterns: [knapsack]
---

## Prompt

Decide whether an array can be split into two subsets with equal sum.

## Why

Equivalent to reaching total/2 with a 0/1 knapsack. Keep a set (or boolean array) of
reachable sums; for each number, add it to every reachable sum, iterating sums downward
so each item is used once.

## Why not

- backtracking: Exponential subsets; the sum is bounded so a DP over sums is far cheaper.
- greedy: Assigning large items first does not guarantee equal halves.
- two-pointers: Subsets are not contiguous or sorted pairs.

## Complexity

O(n · sum) time, O(sum) space.
