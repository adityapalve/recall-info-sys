---
id: house-robber-ii
title: 'House Robber II'
leetcode: https://leetcode.com/problems/house-robber-ii/
neetcode: https://neetcode.io/problems/house-robber-ii?list=neetcode150
difficulty: Medium
family: '1-D Dynamic Programming'
order: 3
lists: [blind75, neetcode150]
patterns: [dp-1d]
---

## Prompt

Same as House Robber, but the houses form a circle so the first and last are adjacent.

## Why

The first and last house cannot both be robbed, so the answer is the max of two linear
problems: houses 0..n−2 and houses 1..n−1.

## Why not

- greedy: Same issue as the linear version, plus the wrap-around.
- graph-dfs: The circle is a constraint, not a graph to traverse.
- dp-2d: You do not need a second dimension; run the 1-D solution twice.

## Complexity

O(n) time, O(1) space.
