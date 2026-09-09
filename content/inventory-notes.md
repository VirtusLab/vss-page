# Inventory notes (Task 1)

Working notes from compiling `content/components.yaml`. Not part of the site content — for Adam to review.

## Bootzooka dependency check

Checked `https://raw.githubusercontent.com/softwaremill/bootzooka/master/build.sbt` (no separate `project/Dependencies.scala`). SoftwareMill/VirtusLab dependencies found:

- `com.softwaremill.sttp.client4` (sttp) — already in components.yaml
- `com.softwaremill.sttp.tapir` (tapir) — already in components.yaml
- `com.softwaremill.ox` (ox) — already in components.yaml
- `com.softwaremill.quicklens` — not in components.yaml
- `com.softwaremill.macwire` — not in components.yaml

Magnolia and Chimney (both mentioned as candidates in the brief) are **not** dependencies of Bootzooka. Note: Chimney is not a SoftwareMill/VirtusLab project at all — it's owned by `scalalandio`, not `softwaremill` or `VirtusLab`.

## Top-starred Scala repos scan

Via `curl -s "https://api.github.com/orgs/<org>/repos?per_page=100&sort=stars"` (paginated), filtered to `language == "Scala"`, non-archived.

**softwaremill** top 15 by stars: elasticmq (2928), sttp (1505, in inventory), tapir (1471, in inventory), macwire (1314), quicklens (852), magnolia (801), ox (522, in inventory), retry (360), kmq (341), realworld-tapir-zio (175), chimp (102, in inventory), sttp-ai (101, in inventory), sbt-softwaremill (72), livestub (56), sttp-model (45).

**VirtusLab** top 15 by stars: scala-cli (643, in inventory), besom (177, in inventory), orca (157, in inventory), iskra (142), unicorn (112), scala-yaml (106), avocADO (93), Inkuire (92), cellar (88, in inventory), pretty-stacktraces (56), akka-serialization-helper (32), scala-steward-repos (27), scg-cli (26), beholder (26), ide-probe (25).

## Proposed additions (candidates for Adam to accept or reject)

- **macwire** — https://github.com/softwaremill/macwire — compile-time DI library; used directly by Bootzooka.
- **quicklens** — https://github.com/softwaremill/quicklens — case-class update helper; used directly by Bootzooka.
- **magnolia** — https://github.com/softwaremill/magnolia — generic typeclass derivation; foundational for several SoftwareMill libraries (not a direct Bootzooka dependency).
- **elasticmq** — https://github.com/softwaremill/elasticmq — SoftwareMill's most-starred Scala repo; SQS-compatible in-memory message queue.
- **scala-yaml** — https://github.com/VirtusLab/scala-yaml — pure-Scala YAML parser, used internally by Scala CLI.
- **avocADO** — https://github.com/VirtusLab/avocADO — safe compile-time parallelization of for-comprehensions for Scala 3.

Not proposed: **Chimney** (candidate named in the brief) — it's owned by `scalalandio`, not `softwaremill`/`VirtusLab`, so it falls outside the org scan and isn't a Bootzooka dependency either.
