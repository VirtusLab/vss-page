---
order: 4
title: Structured concurrency
tagline: "Concurrent work starts and ends inside a scope, like an ordinary block."
---

Ox runs concurrent work inside a scope. The scope does not finish until every
fork inside it finishes, and if one fork fails, the others are interrupted and
the error reaches the caller. Threads cannot outlive the code that started them,
so leaks and lost errors stop being a category of bug.

Fetching a user and their orders at the same time is a scope with two forks, and
once the scope ends you hold two ordinary values.
