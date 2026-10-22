#!/usr/bin/env node
// Dependency-free lint: syntax-checks every source file so CI stays fast and
// installable in an offline sandbox.
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOTS = ['src', 'test', 'scripts', 'public'];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else if (path.endsWith('.js') || path.endsWith('.mjs')) out.push(path);
  }
  return out;
}

const files = ROOTS.filter((root) => {
  try {
    return statSync(root).isDirectory();
  } catch {
    return false;
  }
}).flatMap(walk);

let failed = false;
for (const file of files) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (error) {
    failed = true;
    process.stderr.write(`${file}\n${error.stderr}\n`);
  }
}

console.log(`checked ${files.length} file(s)`);
process.exit(failed ? 1 : 0);
