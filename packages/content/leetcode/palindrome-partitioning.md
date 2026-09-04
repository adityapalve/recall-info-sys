---
id: palindrome-partitioning
title: 'Palindrome Partitioning'
leetcode: https://leetcode.com/problems/palindrome-partitioning/
neetcode: https://neetcode.io/problems/palindrome-partitioning?list=neetcode150
difficulty: Medium
family: 'Backtracking'
order: 7
lists: [neetcode150]
patterns: [backtracking]
---

## Prompt

Split a string into substrings so that every piece is a palindrome, and return all such
partitions.

## Why

From the current position, try every end index whose substring is a palindrome, recurse
on the rest, and undo. Optionally precompute palindromicity with DP to make each check
O(1).

## Why not

- dp-2d: A table of palindromic substrings speeds up the check, but the partitions themselves
  still need enumeration.
- expand-around-center: That finds palindromes; it does not produce partitions.
- two-pointers: Palindrome checking is a helper, not the structure of the solution.

## Complexity

O(n · 2ⁿ) worst case.
