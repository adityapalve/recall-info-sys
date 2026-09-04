---
id: search-a-2d-matrix
title: 'Search a 2D Matrix'
leetcode: https://leetcode.com/problems/search-a-2d-matrix/
neetcode: https://neetcode.io/problems/search-2d-matrix?list=neetcode150
difficulty: Medium
family: 'Binary Search'
order: 1
lists: [neetcode150]
patterns: [binary-search]
---

## Prompt

Given a matrix whose rows are sorted and where each row starts after the previous row
ends, decide whether a target is present.

## Why

The matrix is a single sorted array in disguise: index k maps to row k / cols and column
k % cols. Run ordinary binary search over 0..m·n−1 with that mapping.

## Why not

- matrix: No in-place manipulation; the grid is just a sorted list that has been wrapped into
  rows.
- graph-bfs: There is no adjacency to explore; the sorted structure gives a direct search.
- two-pointers: The staircase walk from a corner is O(m + n); treating the matrix as one sorted array
  is O(log mn).

## Complexity

O(log(m·n)) time, O(1) space.
