# Skills Dugout

Curated Claude skills, ready to be called in.

## Install (Claude Code)

```
/plugin marketplace add piyush-tkd/skillsdugout
/plugin install handoff@skillsdugout
```

## Install (Cursor, Codex, GitHub Copilot, or Claude Code without plugins)

```
npx skillsdugout list
npx skillsdugout add handoff --app cursor
```

See [`cli/`](cli/) for options.

## Roster

| Skill | What it does |
|---|---|
| handoff | Writes a compact handoff file so the next session continues without re-explaining |
| comment-hygiene | Keeps code comments brief, factual and self-contained without changing behavior |
| analyse-parallel-bugs | Triages several reported problems at once and finds how many real causes there are |
| bug-ticket | Turns a bug into a self-contained ticket developers can build from and QA can sign off against |
| test-scenarios | Writes short, runnable test scenarios with setup, action, expected result and status |
| commit-messages | Writes Conventional Commits messages and matching branch names |
| project-memory | Puts each CLAUDE.md note in the deepest file it applies to |
| diagrams-from-spec | House rules for Archify diagrams generated from a committed spec (requires [Archify](https://github.com/tt-a1i/archify), MIT) |
| changelog-why | Writes changelog entries that say what changed for the reader and why |

## Add a skill

```
scripts/new-skill.sh <name> "<one-line description>"
```

1. Write `plugins/<name>/skills/<name>/SKILL.md` (the script starts it from `templates/skill/`).
2. `claude plugin validate .`
3. Commit and push, then tag a release (`git tag vX.Y.Z && git push origin vX.Y.Z`) to publish the zip.
4. Bump `version` in the skill's `plugin.json` whenever it changes.

Site: https://skillsdugout.ai
