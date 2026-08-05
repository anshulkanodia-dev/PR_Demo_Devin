import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { reset } from '../src/store.js';
import { createApp } from '../src/http.js';

async function withServer(run) {
  reset();
  const server = createApp();
  server.listen(0);
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await run(base);
  } finally {
    server.close();
    await once(server, 'close');
  }
}

test('POST /tasks creates a task', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'write docs', owner: 'anshul' }),
    });
    assert.equal(res.status, 201);
    assert.equal((await res.json()).title, 'write docs');
  });
});

test('POST /tasks rejects invalid input with 400', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: '', owner: 'anshul' }),
    });
    assert.equal(res.status, 400);
    assert.equal((await res.json()).error, 'title is required');
  });
});

test('GET /tasks filters by owner and done', async () => {
  await withServer(async (base) => {
    const create = (title, owner) =>
      fetch(`${base}/tasks`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title, owner }),
      }).then((r) => r.json());

    const mine = await create('a', 'anshul');
    await create('b', 'devin');
    await fetch(`${base}/tasks/${mine.id}/complete`, { method: 'POST' });

    const done = await fetch(`${base}/tasks?done=true`).then((r) => r.json());
    assert.deepEqual(done.map((t) => t.id), [mine.id]);

    const theirs = await fetch(`${base}/tasks?owner=devin`).then((r) => r.json());
    assert.deepEqual(theirs.map((t) => t.title), ['b']);
  });
});

test('GET /tasks/:id returns 404 for unknown ids', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/tasks/999`);
    assert.equal(res.status, 404);
  });
});

test('DELETE /tasks/:id returns 204 then 404', async () => {
  await withServer(async (base) => {
    const task = await fetch(`${base}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'a', owner: 'anshul' }),
    }).then((r) => r.json());

    assert.equal((await fetch(`${base}/tasks/${task.id}`, { method: 'DELETE' })).status, 204);
    assert.equal((await fetch(`${base}/tasks/${task.id}`, { method: 'DELETE' })).status, 404);
  });
});

test('unknown routes return 404', async () => {
  await withServer(async (base) => {
    assert.equal((await fetch(`${base}/nope`)).status, 404);
  });
});

test('GET /tasks/search filters by title and honours limit', async () => {
  await withServer(async (base) => {
    const create = (title) =>
      fetch(`${base}/tasks`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title, owner: 'anshul' }),
      }).then((r) => r.json());

    await create('write docs');
    await create('write tests');
    await create('ship it');

    const all = await fetch(`${base}/tasks/search?q=write`).then((r) => r.json());
    assert.deepEqual(all.map((t) => t.title), ['write docs', 'write tests']);

    const limited = await fetch(`${base}/tasks/search?q=write&limit=1`).then((r) => r.json());
    assert.deepEqual(limited.map((t) => t.title), ['write docs']);
  });
});

test('GET /tasks/search rejects a missing q and a bad limit', async () => {
  await withServer(async (base) => {
    assert.equal((await fetch(`${base}/tasks/search`)).status, 400);
    assert.equal((await fetch(`${base}/tasks/search?q=`)).status, 400);
    assert.equal((await fetch(`${base}/tasks/search?q=a&limit=abc`)).status, 400);
    assert.equal((await fetch(`${base}/tasks/search?q=a&limit=0`)).status, 400);
    assert.equal((await fetch(`${base}/tasks/search?q=a&limit=1000`)).status, 400);
  });
});
