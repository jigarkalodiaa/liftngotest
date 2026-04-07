#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);

function readArg(name) {
  const direct = args.find((arg) => arg.startsWith(`--${name}=`));
  if (direct) return direct.split('=').slice(1).join('=').trim();
  const idx = args.indexOf(`--${name}`);
  if (idx >= 0 && args[idx + 1]) return args[idx + 1].trim();
  return '';
}

const rawUrl = readArg('url') || process.env.NGROK_URL || '';
const force = args.includes('--force');
const noBackup = args.includes('--no-backup');
if (!rawUrl) {
  console.error('Missing ngrok URL. Use: npm run env:ngrok -- --url https://xxxx.ngrok-free.app');
  process.exit(1);
}

const normalized = rawUrl.replace(/\/+$/, '');
if (!/^https:\/\//i.test(normalized)) {
  console.error('Invalid ngrok URL: must start with https://');
  process.exit(1);
}
const hostOnly = normalized.replace(/^https?:\/\//i, '');

const root = process.cwd();
const envNgrokPath = path.join(root, '.env.ngrok');
const envLocalPath = path.join(root, '.env.local');

if (!fs.existsSync(envNgrokPath)) {
  console.error('Missing .env.ngrok template. Create it first.');
  process.exit(1);
}

const template = fs.readFileSync(envNgrokPath, 'utf8');
const output = template
  .replaceAll('https://YOUR_NGROK_URL', normalized)
  .replaceAll('YOUR_NGROK_URL', hostOnly);
if (fs.existsSync(envLocalPath) && !force) {
  console.error('Refusing to overwrite existing .env.local.');
  console.error('Re-run with --force to overwrite (a backup will be created).');
  process.exit(1);
}
if (fs.existsSync(envLocalPath) && force && !noBackup) {
  const backupPath = path.join(root, `.env.local.backup.${Date.now()}`);
  fs.copyFileSync(envLocalPath, backupPath);
  console.log(`Backed up existing .env.local to ${path.basename(backupPath)}`);
}
fs.writeFileSync(envLocalPath, output, 'utf8');

console.log(`Updated .env.local with ngrok URL: ${normalized}`);
console.log('Restart your Next.js dev server to apply env changes.');
