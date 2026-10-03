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

## Add a skill

1. `plugins/<name>/.claude-plugin/plugin.json`
2. `plugins/<name>/skills/<name>/SKILL.md`
3. Add an entry to `.claude-plugin/marketplace.json`
4. `claude plugin validate .`
5. Bump `version` on every change

Site: https://skillsdugout.ai
