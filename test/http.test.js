import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { reset } from '../src/store.js';
import { createApp } from '../src/http.js';

const SECRET = 'test-secret';

async function withServer(run) {
  reset();
  const previous = process.env.API_SECRET;
  process.env.API_SECRET = SECRET;
  const server = createApp();
  server.listen(0);
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;

  const call = (path, init = {}) =>
    fetch(`${base}${path}`, {
      ...init,
      headers: { authorization: `Bearer ${SECRET}`, ...init.headers },
    });

  const post = (path, body) =>
    call(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

  try {
    await run({ base, call, post });
  } finally {
    server.close();
    await once(server, 'close');
    if (previous === undefined) delete process.env.API_SECRET;
    else process.env.API_SECRET = previous;
  }
}

test('requests without a valid token are rejected', async () => {
  await withServer(async ({ base, call }) => {
    assert.equal((await fetch(`${base}/tasks`)).status, 401);
    assert.equal((await fetch(`${base}/tasks`, { headers: { authorization: 'Bearer nope' } })).status, 401);
    assert.equal((await call('/tasks')).status, 200);
  });
});

test('POST /tasks creates a task', async () => {
  await withServer(async ({ post }) => {
    const res = await post('/tasks', { title: 'write docs', owner: 'anshul' });
    assert.equal(res.status, 201);
    assert.equal((await res.json()).title, 'write docs');
  });
});

test('POST /tasks rejects invalid input with 400', async () => {
  await withServer(async ({ post }) => {
    const res = await post('/tasks', { title: '', owner: 'anshul' });
    assert.equal(res.status, 400);
    assert.equal((await res.json()).error, 'title is required');
  });
});

test('GET /tasks filters by owner and done', async () => {
  await withServer(async ({ call, post }) => {
    const create = (title, owner) => post('/tasks', { title, owner }).then((r) => r.json());

    const mine = await create('a', 'anshul');
    await create('b', 'devin');
    await post(`/tasks/${mine.id}/complete`);

    const done = await call('/tasks?done=true').then((r) => r.json());
    assert.deepEqual(done.map((t) => t.id), [mine.id]);

    const theirs = await call('/tasks?owner=devin').then((r) => r.json());
    assert.deepEqual(theirs.map((t) => t.title), ['b']);
  });
});

test('GET /tasks validates limit and applies it', async () => {
  await withServer(async ({ call, post }) => {
    await post('/tasks', { title: 'a', owner: 'anshul' });
    await post('/tasks', { title: 'b', owner: 'anshul' });

    assert.equal((await call('/tasks?limit=1').then((r) => r.json())).length, 1);
    for (const bad of ['abc', '0', '-1', '101', '1.5']) {
      const res = await call(`/tasks?limit=${bad}`);
      assert.equal(res.status, 400, `limit=${bad} should be rejected`);
    }
  });
});

test('GET /tasks/:id returns 404 for unknown ids', async () => {
  await withServer(async ({ call }) => {
    assert.equal((await call('/tasks/999')).status, 404);
  });
});

test('DELETE /tasks/:id returns 204 then 404', async () => {
  await withServer(async ({ call, post }) => {
    const task = await post('/tasks', { title: 'a', owner: 'anshul' }).then((r) => r.json());
    assert.equal((await call(`/tasks/${task.id}`, { method: 'DELETE' })).status, 204);
    assert.equal((await call(`/tasks/${task.id}`, { method: 'DELETE' })).status, 404);
  });
});

test('unknown routes return 404', async () => {
  await withServer(async ({ call }) => {
    assert.equal((await call('/nope')).status, 404);
  });
});
