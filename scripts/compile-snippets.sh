#!/usr/bin/env bash
# Compiles every snippet shown on the page, so the page can never show code that does not build.
set -euo pipefail

cd "$(dirname "$0")/.."

for f in snippets/*.scala; do
  if ! output=$(scala-cli compile --server=false "$f" 2>&1); then
    echo "FAIL $f"
    echo "$output"
    exit 1
  fi
  echo "PASS $f"
done
