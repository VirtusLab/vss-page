#!/bin/zsh
# One image through the Codex CLI's image tool, from the repo root:
#   scripts/art/gen.sh <asset> <WxH> [prompt-file]
# Writes scripts/art/gen/<asset>/<asset>.png (git-ignored) for finish.py. The prompt is theme.md
# followed by prompts/<asset>.md; sizes: benefits, divider, codebar 1536x1024; hero, icons 1024x1024.
set -e
A=$(cd "$(dirname "$0")" && pwd)
name=$1; size=$2; pf=${3:-$A/prompts/$name.md}; D=$A/gen/$name
mkdir -p "$D"
codex exec --skip-git-repo-check -C "$D" --sandbox workspace-write -- "Use your image generation tool to create ONE image of size $size and save it in the current directory as $name.png. Do nothing else.

$(cat "$A/theme.md")

$(cat "$pf")" > "$D/log.txt" 2>&1
ls -la "$D/$name.png"
