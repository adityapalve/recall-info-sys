---
id: course-schedule
title: 'Course Schedule'
leetcode: https://leetcode.com/problems/course-schedule/
neetcode: https://neetcode.io/problems/course-schedule?list=neetcode150
difficulty: Medium
family: 'Graphs'
order: 7
lists: [blind75, neetcode150]
patterns: [topological-sort]
---

## Prompt

Given course prerequisites as directed pairs, decide whether all courses can be
completed (the graph is acyclic).

## Why

A valid order exists iff the graph has no cycle. Use Kahn's algorithm: repeatedly remove
nodes with in-degree zero; if you cannot remove every node, there is a cycle. DFS with
visiting/visited colours is the equivalent alternative.

## Why not

- graph-dfs: Plain DFS with a visited set cannot distinguish a back edge (cycle) from a cross edge;
  you need the three-colour or in-degree method.
- union-find: Union-find is for undirected connectivity; prerequisite edges are directed.
- graph-bfs: BFS by itself does not detect directed cycles; Kahn's algorithm adds in-degree
  bookkeeping.

## Complexity

O(V + E) time, O(V + E) space.
