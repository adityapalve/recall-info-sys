---
id: implement-trie-prefix-tree
title: 'Implement Trie Prefix Tree'
leetcode: https://leetcode.com/problems/implement-trie-prefix-tree/
neetcode: https://neetcode.io/problems/implement-prefix-tree?list=neetcode150
difficulty: Medium
family: 'Tries'
order: 0
lists: [blind75, neetcode150]
patterns: [trie]
---

## Prompt

Implement insert, exact search, and prefix search for a set of lowercase words.

## Why

Each node maps a character to a child, plus an end-of-word flag. Insert walks or creates
one node per character; search walks and checks the flag; startsWith walks and succeeds
if the path exists.

## Why not

- hash-map: A set answers exact search but startsWith would need a scan or a second structure of
  all prefixes.
- sorting: A sorted list with binary search gives prefix queries in O(log n · L) but inserts are
  O(n).
- tree-dfs: No traversal of an existing tree; the structure is built and probed character by
  character.

## Complexity

O(L) per operation, O(total characters) space.
