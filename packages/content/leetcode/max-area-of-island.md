---
id: max-area-of-island
title: 'Max Area of Island'
leetcode: https://leetcode.com/problems/max-area-of-island/
neetcode: https://neetcode.io/problems/max-area-of-island?list=neetcode150
difficulty: Medium
family: 'Graphs'
order: 1
lists: [neetcode150]
patterns: [graph-dfs]
---

## Prompt

Given a grid of land and water cells, find the size of the largest connected land
region.

## Why

Flood-fill each unvisited land cell, having the DFS return 1 plus the sizes from its
four neighbours. Track the maximum across starts.

## Why not

- dp-2d: Region size is not a local recurrence.
- graph-bfs: Works equally well; DFS returning the size of the fill is the more compact recursion.
- sliding-window: Islands are not rectangular ranges.

## Complexity

O(m · n) time, O(m · n) space worst case.
