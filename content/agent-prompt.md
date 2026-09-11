---
title: Start a project with your coding agent
note: Paste this prompt into Claude Code, Codex or any other coding agent. It installs the Scala skill and generates a VSS project with Adopt Tapir.
copyLabel: Copy prompt
copiedLabel: Copied!
---
Set up a new Scala project using the VirtusLab Scala Stack (VSS): direct-style Scala 3 running on Java 25, with virtual threads and Ox for concurrency, no effect systems. The stack is described at https://vss.virtuslab.com/llms.txt

1. Install the direct-style-scala skill from https://github.com/VirtusLab/scala-skill, following the README for the tool you run in, and load it before writing any Scala.

2. Ask me for the project name and group id if I have not given them, then generate the project with Adopt Tapir:

   curl -X POST https://adopt-tapir.softwaremill.com/api/v1/starter.zip \
     -H 'Content-Type: application/json' \
     -d '{"projectName":"PROJECT","groupId":"GROUP","stack":"OxStack","implementation":"Netty","addDocumentation":true,"addMetrics":false,"json":"Jsoniter","scalaVersion":"Scala3","builder":"ScalaCli"}' \
     -o starter.zip && unzip starter.zip

   Keep these settings: the Ox stack with the Netty sync server (direct style), Swagger UI documentation on, jsoniter-scala for JSON, Scala 3, Scala CLI as the build tool.

3. Add `//> using jvm 25` to the generated .scala file, run `scala-cli compile .` to confirm it builds, then `scala-cli run .` and check that http://localhost:8080/docs serves the Swagger UI.

4. Summarise the project layout and how to add an endpoint.
