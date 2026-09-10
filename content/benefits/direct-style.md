---
order: 1
title: Direct style
tagline: "Control flow is plain and reads top to bottom, and coding agents write it well."
---

There are no effect wrappers to lift into and no combinators to learn. Functions
return values, errors are thrown or returned, and if, for and try work the way
they do everywhere else. Coding agents write this style well, because it looks
like the code they have seen most.

A call made with sttp hands back the response body, which you pass to the next
function without unwrapping anything first.
