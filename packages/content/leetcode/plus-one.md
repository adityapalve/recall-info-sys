---
id: plus-one
title: 'Plus One'
leetcode: https://leetcode.com/problems/plus-one/
neetcode: https://neetcode.io/problems/plus-one?list=neetcode150
difficulty: Easy
family: 'Math & Geometry'
order: 4
lists: [neetcode150]
patterns: [math]
---

## Prompt

Given a large integer as an array of digits, add one to it.

## Why

Walk from the last digit: if it is less than 9, increment and stop; otherwise set it to
0 and continue. If you fall off the front, prepend a 1.

## Why not

- string-manipulation: Converting to a string or int risks overflow for long inputs.
- stack: The carry propagates from the end; a reverse loop needs no stack.
- linked-list: The digits are an array, not a list.

## Complexity

O(n) time, O(1) extra space.
