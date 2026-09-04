---
id: task-scheduler
title: 'Task Scheduler'
leetcode: https://leetcode.com/problems/task-scheduler/
neetcode: https://neetcode.io/problems/task-scheduling?list=neetcode150
difficulty: Medium
family: 'Heap / Priority Queue'
order: 4
lists: [neetcode150]
patterns: [heap, greedy]
---

## Prompt

Given tasks with a cooldown n between identical tasks, find the minimum time to run them
all, idling when necessary.

## Why

Always run the most frequent remaining task that is off cooldown. A max-heap of counts
gives the most frequent; a queue holds tasks that are cooling down with their release
time. (A counting formula based on the max frequency is the closed-form shortcut.)

## Why not

- sorting: One sort does not model the cooldown as counts change over time.
- sliding-window: The cooldown is a constraint on scheduling, not a contiguous range in an array.
- dp-1d: The state space (counts of each task) is far too large; the greedy-by-frequency
  argument avoids it.

## Complexity

O(T · log 26) time, O(26) space.
