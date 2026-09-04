---
id: alien-dictionary
title: 'Alien Dictionary'
leetcode: https://leetcode.com/problems/alien-dictionary/
neetcode: https://neetcode.io/problems/foreign-dictionary?list=neetcode150
difficulty: Hard
family: 'Advanced Graphs'
order: 4
lists: [blind75, neetcode150]
patterns: [topological-sort]
---

## Prompt

Given words sorted in an unknown alphabet, deduce a valid letter order, or report that
none exists.

## Why

Each adjacent pair of words gives one constraint: the first differing letter of the
earlier word comes before the other. Build that directed graph and topologically sort
it; a cycle or an invalid prefix case means no order.

## Why not

- sorting: You are deducing the ordering itself; ordinary sorting assumes you already know it.
- trie: A trie stores the words but does not extract letter precedence.
- graph-dfs: The order must respect directed constraints, which is the topological-sort framing of
  DFS.

## Complexity

O(total characters) time, O(alphabet) space.
