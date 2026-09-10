---
order: 2
title: Type safety
tagline: "Illegal states stay unrepresentable, checked by the compiler instead of by tests."
---

Scala 3 gives you enums for closed sets of cases, opaque types for values that
cannot be mixed up, and givens for passing context without threading it through
every signature by hand. The compiler checks that every case is handled, so a
class of runtime errors cannot happen.

An opaque UserId is an ordinary Int at runtime and a separate type at compile
time, so passing an order id where a user id belongs does not compile.
