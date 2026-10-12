---
description: Apply changes from an updated Claude Design handoff bundle in claude-design/ to the existing site
allowed-tools: Bash(git diff:*), Bash(npm run build), Bash(npm run lint), Read, Edit, Write, Grep, Glob
---

# Apply design bundle changes

The Claude Design handoff bundle lives in `claude-design/` and is committed to git.
It was just overwritten with a newer export using `sync-design.sh`. Bring the existing
implementation in line with what changed, and nothing else.

## What changed in the bundle

!`git diff --stat -- claude-design/`

!`git diff -- claude-design/`

## Steps

1. If the diff above is empty, stop and tell me the bundle has not changed
   (I may need to overwrite `claude-design/` with the new export first).
2. Summarize each design change in plain terms (layout, tokens, copy,
   components, new or removed sections). Ignore noise such as reformatting,
   reordered attributes or regenerated IDs.
3. For each change, find the component(s) that implement that part of the
   design. Map design values to existing tokens, Tailwind classes or CSS
   variables instead of hard-coding raw values from the HTML.
4. Show me the change list and the files you plan to touch, then implement.
5. Run the build and lint and fix anything broken.

## Rules

- Change only what the bundle diff calls for. Do not refactor, rename,
  restructure or clean up unrelated code.
- Do not edit `content/site.yaml`, it is purposefully out of sync with the design version.
- Do not edit anything inside `claude-design/`.

## When done

List each design change and where it was implemented, plus anything you
skipped or need me to decide.