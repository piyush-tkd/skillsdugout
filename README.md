# Skills Dugout

Curated Claude skills, ready to be called in.

## Install (Claude Code)

```
/plugin marketplace add piyush-tkd/skillsdugout
/plugin install handoff@skillsdugout
```

## Roster

| Skill | What it does |
|---|---|
| handoff | Writes a compact handoff file so the next session continues without re-explaining |
| comment-hygiene | Keeps code comments brief, factual and self-contained without changing behavior |

## Add a skill

```
scripts/new-skill.sh <name> "<one-line description>"
```

1. Write `plugins/<name>/skills/<name>/SKILL.md` (the script starts it from `templates/skill/`).
2. `claude plugin validate .`
3. Commit and push, then tag a release (`git tag vX.Y.Z && git push origin vX.Y.Z`) to publish the zip.
4. Bump `version` in the skill's `plugin.json` whenever it changes.

Site: https://skillsdugout.ai
