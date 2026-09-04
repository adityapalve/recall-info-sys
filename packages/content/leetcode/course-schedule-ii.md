---
id: course-schedule-ii
title: 'Course Schedule II'
leetcode: https://leetcode.com/problems/course-schedule-ii/
neetcode: https://neetcode.io/problems/course-schedule-ii?list=neetcode150
difficulty: Medium
family: 'Graphs'
order: 8
lists: [neetcode150]
patterns: [topological-sort]
---

## Prompt

Given course prerequisites, return an order in which all courses can be taken, or an
empty list if impossible.

## Why

Kahn's algorithm: compute in-degrees, queue the zero-in-degree nodes, and emit them as
you pop, decrementing their neighbours. The output is the order; if it is shorter than
the course count, a cycle exists.

## Why not

- graph-dfs: DFS post-order reversed is topological sort; plain DFS without that framing gives no
  valid order.
- graph-bfs: BFS without in-degree tracking does not respect prerequisites.
- union-find: Directed dependencies are not a symmetric connectivity question.

## Complexity

O(V + E) time, O(V + E) space.
