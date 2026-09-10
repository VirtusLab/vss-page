---
order: 4
title: Structured concurrency
tagline: "Making concurrency more comprehensible and harder to get wrong."
---

With structured concurrency, the syntactical structure of the code defines the
lifetime of threads. This allows for more local reasoning, ensuring proper
resource cleanup, no "action-at-a-distance", or thread leaks.

A solution that was born in Python, form the basis of safe coroutine usage in 
Kotlin, is now available for Scala & Java.