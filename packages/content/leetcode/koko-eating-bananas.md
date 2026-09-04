---
id: koko-eating-bananas
title: 'Koko Eating Bananas'
leetcode: https://leetcode.com/problems/koko-eating-bananas/
neetcode: https://neetcode.io/problems/eating-bananas?list=neetcode150
difficulty: Medium
family: 'Binary Search'
order: 2
lists: [neetcode150]
patterns: [binary-search-on-answer]
---

## Prompt

Given pile sizes and h hours, find the smallest eating speed k such that every pile can
be finished, one pile per hour, within h hours.

## Why

If speed k works, any faster speed also works — feasibility is monotonic. Binary search
k between 1 and the largest pile; for each guess, sum ceil(pile / k) and compare with h.

## Why not

- binary-search: Nothing in the input is sorted; the sortedness is in the answer space (feasibility is
  monotonic in speed).
- greedy: No greedy choice of piles helps; every pile must be finished regardless.
- heap: Pulling the largest pile repeatedly does not model the "one pile per hour" rule.

## Complexity

O(n log M) time where M is the max pile, O(1) space.
