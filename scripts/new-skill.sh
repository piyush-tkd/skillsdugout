#!/bin/sh
# Create a new skill from the template and register it in the marketplace.
# Usage: scripts/new-skill.sh <name> "<one-line description>"
set -e
name="$1"; desc="$2"
case "$name" in ''|*[!a-z0-9-]*) echo "Name must be lowercase letters, numbers and hyphens."; exit 1;; esac
[ -n "$desc" ] || { echo "Give a one-line description in quotes."; exit 1; }
dir="plugins/$name"
[ -e "$dir" ] && { echo "$dir already exists."; exit 1; }
mkdir -p "$dir/.claude-plugin" "$dir/skills/$name"
sed "s/SKILL_NAME/$name/g; s/SKILL_DESCRIPTION/$(printf '%s' "$desc" | sed 's/[\/&]/\\&/g')/g" templates/skill/.claude-plugin/plugin.json > "$dir/.claude-plugin/plugin.json"
sed "s/SKILL_NAME/$name/g; s/SKILL_DESCRIPTION/$(printf '%s' "$desc" | sed 's/[\/&]/\\&/g')/g" templates/skill/skills/SKILL_NAME/SKILL.md > "$dir/skills/$name/SKILL.md"
python3 - "$name" "$desc" <<'PY'
import json, sys
p = '.claude-plugin/marketplace.json'
m = json.load(open(p))
m['plugins'].append({'name': sys.argv[1], 'source': f'./plugins/{sys.argv[1]}', 'description': sys.argv[2]})
json.dump(m, open(p, 'w'), indent=2); open(p, 'a').write('\n')
PY
echo "Created $dir. Next: write $dir/skills/$name/SKILL.md, run 'claude plugin validate .', commit, then tag a release."
