---
name: project-memory
description: "Use when adding to, editing or expanding any CLAUDE.md file, when a service or folder gained behaviour its notes do not mention, when a claim in a CLAUDE.md turned out to be wrong, when a router file is about to grow, or when something feels worth recording 'for context'."
---

# Updating a CLAUDE.md (project memory)

## Overview

The CLAUDE.md files in the working directory and every folder above it load at session start. A
CLAUDE.md in a subfolder loads only when Claude reads files in that subfolder. So a line at the repo
root is paid for by every session, including ones that never touch that area; the same line in a
subfolder costs nothing until it is relevant.

One exception: anything pulled in with an `@import` loads wherever the importing file loads. Moving
detail into a nested file saves nothing if the root still imports it.

Two questions, in order — most notes die at the first:

1. Would a reader act differently because of this note?
2. Which is the deepest file that covers every case it applies to?

## When to use

- A change made a documented claim wrong
- A service or folder gained behaviour its notes do not mention
- A folder has durable, non-obvious rules that someone working there needs and that are not written
  anywhere
- The convenient file to edit is a router, or the repo root

**When NOT to use — write nothing when:**

- Opening the file says the same thing; headers and named tests are already read
- It restates structure — a package list, an endpoint table `grep` answers
- It is a plan, a status, or intended work; that belongs in a ticket
- It narrates how something got built

**A note nobody acts on is not free.** It costs tokens and dilutes the rest.

## Quick reference

The **deepest** file covering every case the note applies to, and no more.

| True of… | Goes in |
|---|---|
| every service and subproject | the repo-root CLAUDE.md |
| one service, all of it | that service's CLAUDE.md |
| one package or workflow folder | that folder's CLAUDE.md — create it if the note earns it |
| one file or method | a comment in that file |
| one kind of file wherever it lives (tests, migrations) | a path-scoped rule in `.claude/rules/` |

**A router lists its children, never its grandchildren** — plus one pointer row.

## Common mistakes

| Mistake | Instead |
|---|---|
| Writing to the root because it is already open | Deepest governing file, plus a pointer row |
| Notes for a folder you did not read | Read the file headers first |
| Listing endpoints or classes | Name only the ones with a trap in them |
| Importing a nested file from the root | Let it load on demand |

## Red flags — stop

- The file you are about to edit is the one already open
- The note is going in a router because that is where you are
- You have not read the target folder's file headers
- Writing because you were told to, not because a reader would act

---

# Reference

## Why the depth rule matters

In one monorepo, moving detail down into nested files took the always-loaded chain from 816 lines
to 388. The largest single file went from 1,715 lines to 182 plus seven nested files, with nothing
lost — each detail now loads only where it applies.

## Correcting something already written

Replace the wrong claim with the current, verified one. Version control keeps the history.

Keep a one-line "used to be X, now Y" note next to the claim only when people or code may still be
acting on the old belief — a changed default, a removed endpoint, a renamed flag. Otherwise the next
reader cannot tell a stable fact from one that just changed, and will trust a stale cache, script or
habit.

## What a leaf file carries

1. A one-line scope blockquote with an upward pointer
2. What it is, in plain terms — port and database if a service
3. The domain as a pipeline, not a class inventory
4. Known gotchas, each naming the exact broken mechanism
5. "Used to be true and is not" corrections, where people may still rely on the old claim
6. Build and run commands scoped to that module

A verified **"there is no X"** line is often the most useful thing in a leaf file — "There is no
`/auth/register`", "There is no delete". It forecloses a plausible wrong assumption rather than only
stating the true one. Write one only when it is checked and someone would otherwise assume X exists.

## Plans after they ship

A document that describes the future becomes wrong the day the thing ships — it now claims the work
is outstanding. Delete it, archive it, or rewrite it as present-tense documentation, following the
repo's policy. Present-tense operational documents — runbooks, cheatsheets, contracts — matter
**more** after shipping. Never leave a dangling link: a link to nothing teaches the next person less
than a sentence saying where the document went.

## Worked example

A nightly reminder job is added to `scheduling-service`, living there rather than in the shared
worker service because its data is in the `scheduling` schema.

| Where | What goes there |
|---|---|
| Root CLAUDE.md | Nothing. One job in one service changes nothing true of the whole repo |
| `services/scheduling-service/CLAUDE.md` | Why it lives here, since the next person will otherwise move it; and that `NotificationClient` is optional, so a local stack sends no emails |
| `ReminderScheduler.java` | Why 07:00 and not hourly. One file, one comment |
