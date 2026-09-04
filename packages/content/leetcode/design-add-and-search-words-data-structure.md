---
id: design-add-and-search-words-data-structure
title: 'Design Add And Search Words Data Structure'
leetcode: https://leetcode.com/problems/design-add-and-search-words-data-structure/
neetcode: https://neetcode.io/problems/design-word-search-data-structure?list=neetcode150
difficulty: Medium
family: 'Tries'
order: 1
lists: [blind75, neetcode150]
patterns: [trie, backtracking]
---

## Prompt

Design a structure that stores words and answers search queries where "." matches any
single letter.

## Why

Store words in a trie. Search normally on letters; on a ".", branch into every child
recursively. The trie prunes branches that cannot match early.

## Why not

- hash-map: A wildcard cannot be looked up by key; you would scan every word.
- string-manipulation: Regex-style matching per word is O(N · L) per query.
- tree-dfs: It is a DFS over the trie, but the "try every child on a dot" branching is the
  backtracking element.

## Complexity

O(L) for exact search, up to O(26^dots · L) with wildcards.
