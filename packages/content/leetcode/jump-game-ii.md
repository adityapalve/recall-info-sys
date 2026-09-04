---
id: jump-game-ii
title: 'Jump Game II'
leetcode: https://leetcode.com/problems/jump-game-ii/
neetcode: https://neetcode.io/problems/jump-game-ii?list=neetcode150
difficulty: Medium
family: 'Greedy'
order: 2
lists: [neetcode150]
patterns: [greedy]
---

## Prompt

Same setup as Jump Game; find the minimum number of jumps to reach the last index.

## Why

Treat the current jump's reachable range as a level. Scan it, tracking the farthest
index any position can reach; when you hit the end of the level, one jump is spent and
the next level ends at that farthest point.

## Why not

- dp-1d: dp over positions is O(n²); the level-by-level greedy is O(n).
- graph-bfs: The greedy is a BFS in disguise — each "level" is the range reachable with one more
  jump — but no queue is needed.
- binary-search: Nothing is sorted.

## Complexity

O(n) time, O(1) space.
