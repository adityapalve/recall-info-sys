---
id: design-twitter
title: 'Design Twitter'
leetcode: https://leetcode.com/problems/design-twitter/
neetcode: https://neetcode.io/problems/design-twitter-feed?list=neetcode150
difficulty: Medium
family: 'Heap / Priority Queue'
order: 5
lists: [neetcode150]
patterns: [heap, hash-map]
---

## Prompt

Design a simplified Twitter: post tweets, follow and unfollow users, and fetch the 10
most recent tweets from a user and everyone they follow.

## Why

Store each user's tweets as a list with a global timestamp, and follows as a set. The
feed is a k-way merge of the followees' tweet lists: push each list's latest into a max-
heap by time, pop, and push that list's next until you have 10.

## Why not

- sorting: Sorting all tweets of all followees per request is O(N log N); a k-way merge only
  touches what it needs.
- hash-linked-list: There is no eviction or recency reordering of keys.
- tree-bfs: The follow graph is not traversed; only direct followees matter.

## Complexity

O(k log k) per feed for k followees, O(total tweets) space.
