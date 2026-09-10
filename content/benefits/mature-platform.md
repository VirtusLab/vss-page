---
order: 3
title: Mature platform
tagline: "The JVM sits underneath, and every Java library is a normal dependency."
---

Scala runs on the JVM, with decades of work behind its garbage collectors,
profilers and deployment tooling. Java libraries are called directly, with plain
method calls and no bindings or wrappers. Virtual threads make blocking cheap,
so blocking Java APIs fit in without extra machinery.

You call a JDBC driver, a Kafka client or an in-house Java SDK from Scala, using
the types it already declares.
