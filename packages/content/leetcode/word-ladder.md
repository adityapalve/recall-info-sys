---
id: word-ladder
title: 'Word Ladder'
leetcode: https://leetcode.com/problems/word-ladder/
neetcode: https://neetcode.io/problems/word-ladder?list=neetcode150
difficulty: Hard
family: 'Graphs'
order: 12
lists: [neetcode150]
patterns: [graph-bfs]
---

## Prompt

Given a start word, an end word, and a dictionary, find the length of the shortest
sequence of one-letter changes from start to end using dictionary words.

## Why

Words are nodes and one-letter differences are edges; the ladder length is the shortest
path, so BFS. Generate neighbours by wildcarding each position (e.g. "h*t") and grouping
dictionary words by pattern so each expansion is fast.

## Why not

- graph-dfs: DFS finds a path but not the shortest; the ladder length is a shortest-path question.
- backtracking: Exploring all transformation sequences is exponential; BFS finds the minimum directly.
- trie: A trie helps prefix search, not one-letter-different neighbours.

## Complexity

O(N · L²) time, O(N · L) space.
