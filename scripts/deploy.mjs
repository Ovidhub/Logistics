// One-command deploy: rebuild the frontend and upload it + the PHP API over SSH.
//
//   npm run deploy
//
// Reads server details from .deploy.json (gitignored). It does NOT touch the
// server's api/config.php, the database, or admin passwords — those are set up
// once. Safe to run repeatedly after code changes.

import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, existsSync, cpSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cfgPath = join(root, '.deploy.json');
const stage = join(root, '.deploy_stage');

if (!existsSync(cfgPath)) {
  console.error('Missing .deploy.json — copy .deploy.example.json to .deploy.json and fill in your server details.');
  process.exit(1);
}

const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
const key = cfg.key.replace(/^~/, homedir());
const remote = `${cfg.user}@${cfg.host}`;
const sshArgs = ['-i', key, '-p', String(cfg.port), '-o', 'IdentitiesOnly=yes', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=30'];

const step = (msg) => console.log(`\n>> ${msg}`);
const cleanup = () => { try { rmSync(stage, { recursive: true, force: true }); } catch {} };

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd: root, ...opts });
  if (r.status !== 0) {
    console.error(`FAILED: ${cmd} ${args.join(' ')}`);
    cleanup();
    process.exit(r.status || 1);
  }
}

// Stream a local `tar` archive of srcDir into a remote command over ssh.
function tarUpload(srcDir, remoteCmd) {
  return new Promise((resolve, reject) => {
    const tar = spawn('tar', ['czf', '-', '-C', srcDir, '.'], { stdio: ['ignore', 'pipe', 'inherit'] });
    const ssh = spawn('ssh', [...sshArgs, remote, remoteCmd], { stdio: ['pipe', 'inherit', 'inherit'] });
    tar.on('error', reject);
    ssh.on('error', reject);
    tar.stdout.pipe(ssh.stdin);
    ssh.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ssh exited ${code}`))));
  });
}

try {
  step('building frontend (npm run build)');
  run('npm', ['run', 'build'], { shell: process.platform === 'win32' });

  step('staging api/ (excluding config.php and *.sqlite)');
  rmSync(stage, { recursive: true, force: true });
  cpSync(join(root, 'api'), join(stage, 'api'), {
    recursive: true,
    filter: (src) => {
      const b = basename(src);
      return b !== 'config.php' && !b.endsWith('.sqlite');
    },
  });

  step('uploading api/ (your server config.php is left untouched)');
  await tarUpload(join(stage, 'api'), `mkdir -p ${cfg.docroot}/api && tar xzf - -C ${cfg.docroot}/api`);

  step('uploading frontend (replacing assets/)');
  await tarUpload(join(root, 'dist'), `rm -rf ${cfg.docroot}/assets && tar xzf - -C ${cfg.docroot}`);

  console.log('\n✅ Deploy complete.');
} catch (err) {
  console.error(`\nDeploy failed: ${err.message}`);
  process.exitCode = 1;
} finally {
  cleanup();
}
