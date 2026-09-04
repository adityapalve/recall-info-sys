---
id: word-search-ii
title: 'Word Search II'
leetcode: https://leetcode.com/problems/word-search-ii/
neetcode: https://neetcode.io/problems/search-for-word-ii?list=neetcode150
difficulty: Hard
family: 'Tries'
order: 2
lists: [blind75, neetcode150]
patterns: [trie, backtracking]
---

## Prompt

Given a grid of letters and a list of words, return every word that can be traced
through adjacent cells.

## Why

Insert all words into a trie, then DFS from each cell while walking the trie in step.
Stop when the trie has no child for the next letter; record a word when you reach a
terminal node. Removing found words from the trie keeps later searches fast.

## Why not

- backtracking: Running the single-word search per word repeats the grid work; the trie lets one DFS
  check all words at once.
- hash-map: Prefix pruning is what makes this tractable, and a set of words cannot prune partial
  paths.
- graph-bfs: Word paths follow specific sequences and must not reuse cells, which requires DFS with
  undo.

## Complexity

O(m · n · 4^L) worst case, O(total characters) space.
