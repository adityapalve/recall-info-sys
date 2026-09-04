---
id: surrounded-regions
title: 'Surrounded Regions'
leetcode: https://leetcode.com/problems/surrounded-regions/
neetcode: https://neetcode.io/problems/surrounded-regions?list=neetcode150
difficulty: Medium
family: 'Graphs'
order: 6
lists: [neetcode150]
patterns: [graph-dfs]
---

## Prompt

In a grid of X and O, flip every O region that is fully enclosed by X (regions touching
the border survive).

## Why

Any O connected to the border cannot be captured. DFS from every border O and mark those
safe; then flip all other O to X and restore the safe ones.

## Why not

- union-find: Works by unioning border cells with a virtual node, but the border-first DFS is
  simpler.
- dp-2d: Enclosure is a global property, not a local recurrence.
- backtracking: Nothing is undone; cells are marked permanently.

## Complexity

O(m · n) time, O(m · n) space.
