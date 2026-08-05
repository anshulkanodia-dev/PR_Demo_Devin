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

test('GET /tasks filters by tag', async () => {
  await withServer(async (base) => {
    const create = (title, tags) =>
      fetch(`${base}/tasks`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title, owner: 'anshul', tags }),
      }).then((r) => r.json());

    await create('a', ['demo']);
    await create('b', ['infra']);

    const tagged = await fetch(`${base}/tasks?tag=demo`).then((r) => r.json());
    assert.deepEqual(tagged.map((t) => t.title), ['a']);
  });
});

test('PUT /tasks/:id/tags replaces the tag set', async () => {
  await withServer(async (base) => {
    const task = await fetch(`${base}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'a', owner: 'anshul', tags: ['demo'] }),
    }).then((r) => r.json());

    const res = await fetch(`${base}/tasks/${task.id}/tags`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ tags: ['infra', 'infra'] }),
    });
    assert.equal(res.status, 200);
    assert.deepEqual((await res.json()).tags, ['infra']);
  });
});

test('PUT /tasks/:id/tags rejects malformed tags with 400', async () => {
  await withServer(async (base) => {
    const task = await fetch(`${base}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'a', owner: 'anshul' }),
    }).then((r) => r.json());

    const res = await fetch(`${base}/tasks/${task.id}/tags`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ tags: ['NOT VALID'] }),
    });
    assert.equal(res.status, 400);
  });
});
