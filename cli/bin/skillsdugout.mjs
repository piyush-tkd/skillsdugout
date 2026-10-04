#!/usr/bin/env node
// skillsdugout: install skills from the Skills Dugout lineup into an AI app's skills folder.
// No dependencies. Downloads the skill's release zip from GitHub and unpacks it with node:zlib.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import readline from 'node:readline/promises';

const REPO = 'piyush-tkd/skillsdugout';
const SITE = 'https://www.skillsdugout.ai';
const HOME = os.homedir();
// Where each app reads skills from: for you (all projects), and for one project (run inside it with --project).
const APPS = {
  'claude-code': { name: 'Claude Code', user: path.join(HOME, '.claude', 'skills'), project: '.claude/skills', marker: path.join(HOME, '.claude') },
  cursor: { name: 'Cursor', user: path.join(HOME, '.cursor', 'skills'), project: '.cursor/skills', marker: path.join(HOME, '.cursor') },
  codex: { name: 'Codex', user: path.join(HOME, '.codex', 'skills'), project: '.codex/skills', marker: path.join(HOME, '.codex') },
  copilot: { name: 'GitHub Copilot', user: path.join(HOME, '.copilot', 'skills'), project: '.github/skills', marker: path.join(HOME, '.copilot') },
};
const ALIASES = { claude: 'claude-code', 'github-copilot': 'copilot' };

const HELP = `skillsdugout — install AI skills from ${SITE}

Usage
  npx skillsdugout list                         Show the skills in the lineup
  npx skillsdugout add <skill> [options]        Install a skill
  npx skillsdugout remove <skill> [options]     Uninstall a skill

Options
  --app <app>     claude-code | cursor | codex | copilot  (asked if not given)
  --project       Install into the current project instead of for you everywhere
  --force         Replace a skill that is already installed

Examples
  npx skillsdugout add handoff --app cursor
  npx skillsdugout add commit-messages --app copilot --project

Claude apps (web, desktop, mobile): download the zip from the skill's page on
${SITE} and upload it under Customize > Skills.`;

const out = (s = '') => process.stdout.write(s + '\n');
const fail = (s) => { process.stderr.write(`skillsdugout: ${s}\n`); process.exit(1); };

function parseArgs(argv) {
  const a = { _: [], app: undefined, project: false, force: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i];
    if (v === '--app') a.app = argv[++i];
    else if (v.startsWith('--app=')) a.app = v.slice(6);
    else if (v === '--project') a.project = true;
    else if (v === '--force') a.force = true;
    else if (v === '-h' || v === '--help') a.help = true;
    else if (v.startsWith('-')) fail(`unknown option ${v}`);
    else a._.push(v);
  }
  return a;
}

async function get(url) {
  const r = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'skillsdugout-cli' } });
  if (!r.ok) throw Object.assign(new Error(`${r.status} for ${url}`), { status: r.status });
  return r;
}

async function lineup() {
  const r = await get(`https://raw.githubusercontent.com/${REPO}/main/.claude-plugin/marketplace.json`);
  return (await r.json()).plugins.map((p) => ({ name: p.name, description: p.description }));
}

// Minimal zip reader: central directory, then stored or deflated entries.
function unzip(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error('not a zip file');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const files = [];
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('bad zip directory');
    const method = buf.readUInt16LE(p + 10), size = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28), extraLen = buf.readUInt16LE(p + 30), commentLen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    p += 46 + nameLen + extraLen + commentLen;
    if (name.endsWith('/')) continue;
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const raw = buf.subarray(start, start + size);
    const data = method === 0 ? raw : method === 8 ? zlib.inflateRawSync(raw) : null;
    if (!data) throw new Error(`unsupported compression in ${name}`);
    files.push({ name, data });
  }
  return files;
}

async function pickApp(given) {
  if (given) {
    const id = ALIASES[given] ?? given;
    if (id === 'claude-apps') fail(`Claude apps install from a zip: download it from ${SITE} and upload it under Customize > Skills.`);
    if (!APPS[id]) fail(`unknown app "${given}". Use one of: ${Object.keys(APPS).join(', ')}`);
    return id;
  }
  const found = Object.keys(APPS).filter((id) => fs.existsSync(APPS[id].marker));
  const choices = found.length ? found : Object.keys(APPS);
  if (choices.length === 1) return choices[0];
  if (!process.stdin.isTTY) fail(`choose an app with --app (${choices.join(', ')})`);
  out(found.length ? 'Found these apps on this computer:' : 'Which app should it go into?');
  choices.forEach((id, i) => out(`  ${i + 1}. ${APPS[id].name}`));
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question(`Install into [1-${choices.length}]: `)).trim();
  rl.close();
  const id = choices[Number(answer) - 1];
  if (!id) fail('no app chosen');
  return id;
}

const target = (app, project) => (project ? path.resolve(APPS[app].project) : APPS[app].user);
const validName = (s) => /^[a-z0-9][a-z0-9-]{0,63}$/.test(s);

async function add(names, opts) {
  if (!names.length) fail('name a skill, for example: npx skillsdugout add handoff');
  const app = await pickApp(opts.app);
  const dir = target(app, opts.project);
  const done = [];
  for (const name of names) {
    if (!validName(name)) fail(`"${name}" is not a skill name`);
    const dest = path.join(dir, name);
    if (fs.existsSync(dest) && !opts.force) { out(`/${name} is already installed in ${dest}. Use --force to replace it.`); continue; }
    let zip;
    try {
      zip = Buffer.from(await (await get(`https://github.com/${REPO}/releases/latest/download/skillsdugout-${name}.zip`)).arrayBuffer());
    } catch (e) {
      if (e.status === 404) fail(`no skill called "${name}". See the lineup with: npx skillsdugout list`);
      throw e;
    }
    const files = unzip(zip);
    for (const f of files) {
      // Only files inside the skill's own folder; nothing that could escape it.
      const rel = path.normalize(f.name);
      if (!rel.startsWith(name + path.sep) || rel.includes('..') || path.isAbsolute(rel)) fail(`unexpected file in the download: ${f.name}`);
    }
    if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
    for (const f of files) {
      const to = path.join(dir, path.normalize(f.name));
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.writeFileSync(to, f.data);
    }
    out(`Installed /${name} for ${APPS[app].name} in ${dest}`);
    done.push(name);
  }
  if (!done.length) return;
  out(`\nStart a new ${APPS[app].name} session and ask for the skill by name.`);
  if (app === 'copilot') out('In VS Code, turn on the chat.useAgentSkills setting if skills do not show up.');
  out(`Details and examples: ${SITE}/skills/${done[0]}`);
}

async function remove(names, opts) {
  if (!names.length) fail('name a skill to remove');
  const app = await pickApp(opts.app);
  for (const name of names) {
    if (!validName(name)) fail(`"${name}" is not a skill name`);
    const dest = path.join(target(app, opts.project), name);
    if (!fs.existsSync(dest)) { out(`/${name} is not installed in ${dest}`); continue; }
    fs.rmSync(dest, { recursive: true, force: true });
    out(`Removed /${name} from ${dest}`);
  }
}

async function main() {
  const a = parseArgs(process.argv.slice(2));
  const [cmd, ...rest] = a._;
  if (a.help || !cmd || cmd === 'help') return out(HELP);
  if (cmd === 'list' || cmd === 'ls') {
    const skills = await lineup();
    const w = Math.max(...skills.map((s) => s.name.length));
    for (const s of skills) out(`${s.name.padEnd(w)}  ${s.description}`);
    return out(`\nInstall one with: npx skillsdugout add <skill> --app <app>`);
  }
  if (cmd === 'add' || cmd === 'install' || cmd === 'i') return add(rest, a);
  if (cmd === 'remove' || cmd === 'rm' || cmd === 'uninstall') return remove(rest, a);
  if (cmd === '--version' || cmd === 'version') return out(JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url))).version);
  fail(`unknown command "${cmd}". Run: npx skillsdugout --help`);
}

main().catch((e) => fail(e.message));
