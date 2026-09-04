---
id: encode-and-decode-strings
title: 'Encode and Decode Strings'
leetcode: https://leetcode.com/problems/encode-and-decode-strings/
neetcode: https://neetcode.io/problems/string-encode-and-decode?list=neetcode150
difficulty: Medium
family: 'Arrays & Hashing'
order: 5
lists: [blind75, neetcode150]
patterns: [string-manipulation]
---

## Prompt

Design a way to turn a list of arbitrary strings into a single string and back again,
without any delimiter character being off-limits.

## Why

Prefix each string with its length and a terminator (e.g. "5#hello"). The decoder reads
the number, skips the terminator, and takes exactly that many characters, so the content
can contain anything — including the terminator.

## Why not

- hash-map: Nothing needs looking up; the challenge is a reversible serialisation that survives
  any characters.
- stack: There is no nesting to match; you read the stream left to right.
- two-pointers: You do not compare positions — you need a framing scheme so the decoder knows where
  each string ends.

## Complexity

O(total length) time, O(total length) space.
