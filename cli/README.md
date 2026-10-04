# skillsdugout

Install skills from [Skills Dugout](https://www.skillsdugout.ai) into Claude Code, Cursor, Codex or GitHub Copilot with one command.

```
npx skillsdugout list
npx skillsdugout add handoff --app cursor
```

## Commands

| Command | What it does |
|---|---|
| `list` | Shows the skills in the lineup |
| `add <skill...>` | Installs one or more skills |
| `remove <skill...>` | Uninstalls them |

## Options

| Option | Meaning |
|---|---|
| `--app <app>` | `claude-code`, `cursor`, `codex` or `copilot`. If left out, it uses the app it finds on your computer, or asks. |
| `--project` | Installs into the current project instead of for you in every project |
| `--force` | Replaces a skill that is already installed |

## Where skills go

| App | For you | For one project (`--project`) |
|---|---|---|
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Cursor | `~/.cursor/skills/` | `.cursor/skills/` |
| Codex | `~/.codex/skills/` | `.codex/skills/` |
| GitHub Copilot | `~/.copilot/skills/` | `.github/skills/` |

Claude apps (web, desktop, mobile) install from a zip: download it from the skill's page on skillsdugout.ai and upload it under Customize > Skills.

In Claude Code you can also install skills as plugins: `/plugin marketplace add piyush-tkd/skillsdugout`, then `/plugin install <skill>@skillsdugout`.

## What it does on your computer

Downloads the skill's zip from this repository's latest GitHub release and unpacks it into the folder above. It never runs anything from the download, sends no data anywhere, and has no dependencies.

MIT licensed.
