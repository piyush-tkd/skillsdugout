---
name: commit-messages
description: "Use when writing or amending a commit message, when naming a new branch, when a change is ready to commit, or when a message or branch name would carry no type prefix or an empty scope."
---

# Writing a commit message

## Overview

Based on [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/):
`type(scope): description`.

Two **house conventions** go beyond the spec, which makes the scope optional and says nothing about
branches:

- The scope is required. It is one of exactly two things — the ticket, or the area of the codebase.
- Branches take the same three parts: `type/scope/description-in-kebab-case`.

The description says what is now true, not what was done.

If the repository documents its own commit convention, that convention wins. Use this skill for
whatever it leaves open.

## The ticket

- Use the ticket already given for the task, if there is one.
- If the repository requires a ticket and none was given, ask once.
- Otherwise use an area scope.
- Never infer a ticket from the branch, the diff, or a nearby commit, and never invent one.

| Situation | Commit | Branch |
|---|---|---|
| Ticket `ABC-400` given | `feat(ABC-400): invoices retry on timeout` | `feat/ABC-400/invoice-retry-on-timeout` |
| No ticket | `feat(checkout): tax comes from the address` | `feat/checkout/tax-from-address` |

A formatting-only change is still `style(scope):`, with no body.

## Quick reference

| Element | Rule |
|---|---|
| Type | `feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert` |
| Ticket scope | The tracker key, uppercase, with its number: `ABC-400` |
| Area scope | Lowercase kebab: `checkout` `auth` `devops` `nav` |
| Scope | Never empty. Never both a ticket and an area |
| Description | Lowercase, present tense, the new state, ≤ 100 chars |
| Breaking | `!` before the colon, plus a `BREAKING CHANGE:` footer when the migration needs explaining |
| Body | Optional. Only when it carries content — see below |
| Trailers | None by default, including AI co-author trailers. Add one only when the user or repo asks for it |

## Common mistakes

| Mistake | Instead |
|---|---|
| `Fix search combining filters with OR` | `fix(ABC-481): search requires all selected filters` |
| `ABC-33: wire retry scheduler` | `chore(ABC-33): retry scheduler backs off` |
| `DEVOPS: derived checks` | `chore(devops): derived checks for the conventions` |
| `feat: add saved cards` | `feat(checkout): saved cards appear at checkout` |
| `feat(ABC-NNN): …` | Use the given ticket, or an area scope |
| Branch `ABC-372-qa` | `fix/ABC-372/qa-config` |

## Red flags — stop

- No type, or a type with an empty scope
- A bare `ABC-400:` or `DEVOPS:` with no type
- `NNN`, `XXX`, or a ticket key nobody gave you
- A description opening with a capital or an imperative verb ("add", "fix", "update")
- A trailer nobody asked for
- A branch missing its type segment, or with the ticket glued on by a dash

Passing `commitlint` is not evidence. Check what the repo's config actually enforces before
treating a pass as proof of anything.

---

# Reference

## Choosing the scope

| Situation | Scope | Example |
|---|---|---|
| A ticket exists | The key, uppercase, with its number | `fix(ABC-446): document types reconcile` |
| No ticket | The area, lowercase kebab-case | `chore(devops): derived checks for the conventions` |

The branch name is not evidence — branches get reused. A log full of `ABC-NNN:` placeholders or
misspelt keys is what filling the slot instead of checking produces.

Prefer an area scope that already exists in `git log`. `docs` is both a type and an area: when
documentation changes, the type carries it and the scope names the subject — `docs(billing): …`,
not `docs(docs): …`.

## Types

`feat` a new capability; `fix` a bug fix; `docs` documentation only (incl. `CLAUDE.md`); `style`
formatting, no behaviour change; `refactor` same behaviour, different shape; `perf` a measured speed
or memory change; `test` tests only; `build` build tool, dependencies, Dockerfile, packaging; `ci`
pipelines, hooks, CI scripts; `chore` anything else with no product effect; `revert` undoing a
commit, naming it in the body.

## Breaking changes

```
feat(ABC-400)!: order payload drops the type column

BREAKING CHANGE: order.type is gone. Clients read attributes instead.
```

Always use the `!` — it is what a reader scanning `git log --oneline` sees. Add the footer when the
migration needs explaining. `BREAKING-CHANGE` is a synonym; the token must be uppercase.

## The body, when there is one

Up to four parts, in this order. Each is optional; include only the ones that add something, and
never invent one.

1. **Why** — the problem this solves. A number helps when there is a real one.
2. **What was rejected** — the obvious alternative, if a reader would otherwise ask why not.
3. **What it costs** — who or what is affected.
4. **What is still not fixed** — a known limitation, stated rather than hidden.

## Correcting yourself

Open plainly and do not bury it — for example "Corrects the previous commit, which claimed X was
unused by every caller. It is not." That habit is what makes the rest of the log trustworthy.

## Branch naming

`type/scope/description-in-kebab-case`, the same three parts as the commit:
`feat/ABC-400/invoice-retry-on-timeout`, `chore/devops/repo-guardrails`. If a branch-name hook
exists, check its pattern accepts both ticket and area scopes before relying on it.

## Smart Commits (Jira) — optional

Only when the repo is linked to Jira and the user has asked for it. Smart Commits change the ticket:
`#comment` posts a comment, `#time 2h` logs work, and transition commands such as `#resolve` move
the ticket through its workflow, depending on how that workflow is configured. They are actions, not
formatting — never add one by default.
