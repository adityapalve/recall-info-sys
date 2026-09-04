---
id: jump-game
title: 'Jump Game'
leetcode: https://leetcode.com/problems/jump-game/
neetcode: https://neetcode.io/problems/jump-game?list=neetcode150
difficulty: Medium
family: 'Greedy'
order: 1
lists: [blind75, neetcode150]
patterns: [greedy, dp-1d]
---

## Prompt

Each position holds the maximum jump length from there. Decide whether you can reach the
last index from the first.

## Why

Sweep left to right tracking the farthest index reachable so far. If the current index
exceeds that reach you are stuck; if the reach covers the end you win.

## Why not

- dp-1d: dp[i] = reachable works in O(n²), but the greedy farthest-reach scan is O(n).
- backtracking: Exploring every jump sequence is exponential.
- graph-bfs: Reachability here has a simple monotone structure that a single pass captures.

## Complexity

O(n) time, O(1) space.
