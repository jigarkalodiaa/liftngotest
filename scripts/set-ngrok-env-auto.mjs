#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);

async function main() {
  const response = await fetch('http://127.0.0.1:4040/api/tunnels');
  if (!response.ok) {
    throw new Error(`Failed to reach ngrok local API: HTTP ${response.status}`);
  }

  const data = await response.json();
  const tunnels = Array.isArray(data?.tunnels) ? data.tunnels : [];
  const httpsTunnel = tunnels.find((t) => t?.public_url?.startsWith('https://'));
  if (!httpsTunnel?.public_url) {
    throw new Error('No HTTPS ngrok tunnel found. Run: ngrok http 3001');
  }

  const passthrough = ['scripts/set-ngrok-env.mjs', '--url', httpsTunnel.public_url, ...args];
  const result = spawnSync(process.execPath, passthrough, { stdio: 'inherit' });
  process.exit(result.status ?? 1);
}

main().catch((error) => {
  console.error('Unable to auto-sync ngrok URL from local API.');
  console.error(error instanceof Error ? error.message : String(error));
  console.error('Make sure ngrok is running: ngrok http 3001');
  process.exit(1);
});
