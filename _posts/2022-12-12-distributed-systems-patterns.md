---
layout: post
title: 'Distributed Systems Concepts and Idioms'
archived: true
---

# Idempotence

Idempotence is a mathematics/computer science property that states an operation must yield the same result when applied any number of times - or simply: `f(x) = f(f(x))`.

This is an important property in distributed systems, because communication between nodes typically use a request-response pattern. In this pattern, node A will send a request to node B, which in turn will reply with a response. However in certain cases, node A will never receive a response from node B. These cases may be intermittent, such as a network fault, or permanent, such as a computer crash or code bug.

To account for intermittent failures, node A can retry requests a few times in hopes for a successful response. However, a retry is unsafe if the operation is not idempotent. This because if node B has not replied to node A, then node A does not know whether the operation was successful or not. In the event that the operation was successful but the response was dropped, subsequent requests may change the intended state.

Consistency Patterns

Consistency vs Availability

Sharding

Skew

Two-Phase Commits

Quorums

Inversion of Control

Critical Path

Hermeticity
