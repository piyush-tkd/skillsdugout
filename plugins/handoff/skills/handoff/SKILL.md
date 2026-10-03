---
name: handoff
description: Write a handoff file when the user says "handoff", "wrap up", "I'm out of context", or is switching tasks, so a fresh session can continue without re-explaining.
---

# Handoff

Compress the current session into one file a fresh session can act on immediately.

## Steps

1. Write `HANDOFF.md` in the project root (overwrite any existing one).
2. Use exactly the sections below. Skip a section only if it is truly empty.
3. Keep it under 60 lines. Facts and paths only; no narrative.
4. Reply with one line: the file path and the single next action.

## Template

```markdown
# Handoff — <YYYY-MM-DD> — <task in 5–8 words>

## Goal
<one sentence: what done looks like>

## State
- Done: <completed items, with file paths>
- In progress: <item, exact file and function>
- Not started: <remaining items>

## Decisions
- <decision> — <one-line reason>

## Open questions
- <question> — <who decides>

## Gotchas
- <thing that broke or misled; how it was resolved>

## Next action
<one concrete step the next session should take first>

## Verify
<command or check that proves the work is correct>
```

## Rules

- Record decisions the user made, not suggestions they did not adopt.
- Reference files by path; never paste large code blocks.
- Mark anything unverified as `(unverified)`.
- Do not include secrets, tokens, or personal data.

## Resuming

When a session starts and `HANDOFF.md` exists, and the user says "continue", "resume" or "pick up": read it first, confirm the next action in one line, then do it.
