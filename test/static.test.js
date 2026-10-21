import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from '../src/http.js';
import { resolveStatic, readStatic } from '../src/static.js';

async function withServer(run) {
  const server = createApp();
  server.listen(0);
  await once(server, 'listening');
  try {
    await run(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
    await once(server, 'close');
  }
}

test('resolveStatic maps pages and ui assets', () => {
  assert.match(resolveStatic('/'), /public\/index\.html$/);
  assert.match(resolveStatic('/ui/styles/tokens.css'), /public\/ui\/styles\/tokens\.css$/);
  assert.equal(resolveStatic('/tasks'), null);
});

test('resolveStatic rejects traversal and unknown types', () => {
  assert.equal(resolveStatic('/ui/../../package.json'), null);
  assert.equal(resolveStatic('/ui/%2e%2e/%2e%2e/package.json'), null);
  assert.equal(resolveStatic('/ui/notes.txt'), null);
});

test('readStatic returns null for missing files', async () => {
  assert.equal(await readStatic('/ui/missing.css'), null);
});

test('GET / serves the task board page', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type'), /text\/html/);
    assert.match(await res.text(), /Task board/);
  });
});

test('GET /ui/... serves css with the right content type', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/ui/styles/tokens.css`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type'), /text\/css/);
    assert.equal((await fetch(`${base}/ui/missing.css`)).status, 404);
  });
});

test('GET /pricing serves the pricing page', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/pricing`);
    assert.equal(res.status, 200);
    assert.match(await res.text(), /pricing\.js/);
  });
});
