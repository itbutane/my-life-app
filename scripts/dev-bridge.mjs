#!/usr/bin/env node
/**
 * Local dev bridge for my-life-app (DEV ONLY).
 * Run on your computer: DEV_BRIDGE_TOKEN=yourtoken node scripts/dev-bridge.mjs
 * Phone and computer must be on same network. Enter shown LAN URL + token in Home > پل توسعه.
 * Security: token required, whitelisted commands only. Do NOT expose to internet.
 */
import http from 'node:http';
import { exec } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.DEV_BRIDGE_PORT || 8787);
const TOKEN = process.env.DEV_BRIDGE_TOKEN || 'dev-token-change-me';

const COMMANDS = {
  typecheck: { cmd: 'npx tsc --noEmit --pretty false', cwd: ROOT },
  'export-web': { cmd: 'CI=1 npx expo export --platform web --output-dir /tmp/my-life-web --clear', cwd: ROOT },
  status: { cmd: 'git status --short || echo "no git"', cwd: ROOT },
};

function json(res, code, obj) {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-dev-token',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  });
  res.end(JSON.stringify(obj));
}

function run(name) {
  const entry = COMMANDS[name];
  if (!entry) return Promise.resolve({ ok: false, code: 400, out: `Unknown command: ${name}` });
  return new Promise((resolve) => {
    exec(entry.cmd, { cwd: entry.cwd, timeout: 10 * 60 * 1000, maxBuffer: 5 * 1024 * 1024 }, (err, stdout, stderr) => {
      const out = [stdout, stderr].filter(Boolean).join('\n').slice(-20000);
      resolve({ ok: !err, code: err ? (err.code ?? 1) : 0, out: out || '(no output)' });
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 204, {});
  if (req.url === '/health') return json(res, 200, { ok: true, commands: Object.keys(COMMANDS) });
  const token = req.headers['x-dev-token'];
  if (token !== TOKEN) return json(res, 401, { ok: false, error: 'unauthorized' });
  if (req.method === 'GET' && req.url === '/commands') return json(res, 200, { ok: true, commands: Object.keys(COMMANDS) });
  if (req.method === 'POST' && req.url === '/run') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { name } = JSON.parse(body || '{}');
        const result = await run(name);
        json(res, 200, result);
      } catch (e) {
        json(res, 400, { ok: false, error: String(e) });
      }
    });
    return;
  }
  json(res, 404, { ok: false, error: 'not found' });
});

server.listen(PORT, '0.0.0.0', () => {
  const nets = os.networkInterfaces();
  const addrs = [];
  for (const infos of Object.values(nets)) for (const i of infos || []) if (i.family === 'IPv4' && !i.internal) addrs.push(i.address);
  console.log(`[dev-bridge] listening on 0.0.0.0:${PORT}`);
  console.log(`[dev-bridge] token: ${TOKEN}`);
  console.log(`[dev-bridge] LAN URLs: ${addrs.map(a => `http://${a}:${PORT}`).join(', ') || '(none)'}`);
  console.log(`[dev-bridge] commands: ${Object.keys(COMMANDS).join(', ')}`);
});
