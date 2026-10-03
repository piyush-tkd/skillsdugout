---
name: changelog-why
description: "Use when a change alters what someone using the product sees, can do or must do and needs a changelog entry, when an entry's reason restates its title, or when a change feels too small to write up."
---

# Writing a changelog entry

## Overview

A changelog is read by people deciding whether a change affects them. The title says what is now
true; the **why** is the part that earns the page its place. If the project already has a changelog
format, keep it and apply these rules inside it. If it has none, use
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## When to use

**Reader impact decides.** Write an entry when someone using or operating the product will see a
difference, gain something, or need to act. That includes an internal change — a new required env
var, a changed script flag, a dropped runtime version — when readers must do something about it.

Write none when no reader would notice or act: refactors, tests, formatting, internal tooling,
CI tweaks.

**One entry per ticket or user-visible change, not per commit.**

## Quick reference

| Part | Rule |
|---|---|
| Section | Keep a Changelog: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security` |
| Title | What is now true, in the user's words |
| Why | Required. The reason said out loud — the symptom somebody hit, or what they can now do |
| Reference | Ticket or PR id, if there is one |
| Placement | Under `[Unreleased]` until it ships. Move it under a version only when that version is released |
| Version and date | Whatever the release process stamps; never invent a version number or a release date |

Shape for Keep a Changelog:

```markdown
## [Unreleased]

### Fixed
- Failed payments now show the provider's reason. Before, every failure read
  "Payment declined", so support could not tell a blocked card from an expired one. (ABC-412)
```

## Evidence

- State only what is known. Do not invent user complaints, adoption, time saved or measured
  improvements.
- "Support could not tell a blocked card from an expired one" needs a ticket, a report or a reading
  of the old behaviour behind it. If the reason is an expectation, word it as one: "so support can
  tell…".
- Merged is not released. Do not write "now live" or "rolled out" for something still unreleased.

## Common mistakes

| Mistake | Instead |
|---|---|
| The why repeats the title | Name the symptom somebody hit, or what they can now do |
| One entry per commit | One per ticket or user-visible change |
| An entry for a refactor or a test | Write none |
| Describing the code change | Describe what the reader sees or must do |
| Claiming an outcome nobody measured | State the behaviour; leave out the claim |

Good why: "The partner could not parse our reply, so every failure looked identical from their
console." Bad why: "The response format was fixed."

Another good one: "You open this page when something is already going wrong, and it was at its
least readable exactly then — the switch you came to flip sat sixth of nine columns in a grid that
scrolled sideways on a laptop."

## Red flags — stop

- A deadline is the reason there is no entry
- The why could be guessed from the title
- An entry nobody would read and act on
- A section name that the changelog does not already use
- A benefit stated as fact with nothing behind it
