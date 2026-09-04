---
id: word-search
title: 'Word Search'
leetcode: https://leetcode.com/problems/word-search/
neetcode: https://neetcode.io/problems/search-for-word?list=neetcode150
difficulty: Medium
family: 'Backtracking'
order: 6
lists: [blind75, neetcode150]
patterns: [backtracking]
---

## Prompt

Given a grid of letters and a word, decide whether the word can be traced through
adjacent cells without reusing a cell.

## Why

From every cell matching the first letter, DFS to neighbours matching the next letter,
marking the cell in use and restoring it when the branch fails. The restore step is what
makes it backtracking rather than plain DFS.

## Why not

- graph-dfs: It is DFS on a grid, but the defining feature is un-marking cells on return so other
  paths can reuse them.
- trie: A trie pays off for many words at once; for a single word it adds nothing.
- graph-bfs: BFS finds shortest paths; a word path must follow a specific character sequence, which
  needs depth-first with backtracking.

## Complexity

O(m · n · 4^L) time, O(L) space.
