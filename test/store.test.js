import test from 'node:test';
import assert from 'node:assert/strict';
import { reset, insert, get, list, update, remove, count } from '../src/store.js';

test('insert assigns incrementing ids', () => {
  reset();
  const first = insert({ title: 'write docs', owner: 'anshul' });
  const second = insert({ title: 'record demo', owner: 'anshul' });
  assert.equal(first.id, 1);
  assert.equal(second.id, 2);
});

test('get returns a copy, not the stored object', () => {
  reset();
  const created = insert({ title: 'write docs', owner: 'anshul' });
  const fetched = get(created.id);
  fetched.title = 'mutated';
  assert.equal(get(created.id).title, 'write docs');
});

test('list filters by owner', () => {
  reset();
  insert({ title: 'a', owner: 'anshul' });
  insert({ title: 'b', owner: 'devin' });
  assert.deepEqual(list({ owner: 'devin' }).map((t) => t.title), ['b']);
  assert.equal(list().length, 2);
});

test('update merges patches and preserves the id', () => {
  reset();
  const created = insert({ title: 'a', owner: 'anshul' });
  const updated = update(created.id, { done: true, id: 99 });
  assert.equal(updated.id, created.id);
  assert.equal(updated.done, true);
});

test('remove deletes the task', () => {
  reset();
  const created = insert({ title: 'a', owner: 'anshul' });
  assert.equal(remove(created.id), true);
  assert.equal(get(created.id), null);
});

test('count reflects the owner filter', () => {
  reset();
  insert({ title: 'a', owner: 'anshul' });
  insert({ title: 'b', owner: 'devin' });
  assert.equal(count(), 2);
  assert.equal(count({ owner: 'devin' }), 1);
});
