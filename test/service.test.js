import test from 'node:test';
import assert from 'node:assert/strict';
import { reset } from '../src/store.js';
import {
  ValidationError,
  NotFoundError,
  createTask,
  getTask,
  listTasks,
  completeTask,
  renameTask,
  retagTask,
  deleteTask,
} from '../src/service.js';

test('createTask trims and stores the task', () => {
  reset();
  const task = createTask({ title: '  write docs  ', owner: ' anshul ' });
  assert.equal(task.title, 'write docs');
  assert.equal(task.owner, 'anshul');
  assert.equal(task.done, false);
});

test('createTask rejects blank fields', () => {
  reset();
  assert.throws(() => createTask({ title: '   ', owner: 'anshul' }), ValidationError);
  assert.throws(() => createTask({ title: 'a', owner: '' }), ValidationError);
});

test('createTask rejects overlong titles', () => {
  reset();
  assert.throws(
    () => createTask({ title: 'x'.repeat(121), owner: 'anshul' }),
    ValidationError,
  );
});

test('getTask throws NotFoundError for unknown ids', () => {
  reset();
  assert.throws(() => getTask(404), NotFoundError);
});

test('listTasks filters by owner and done state', () => {
  reset();
  const mine = createTask({ title: 'a', owner: 'anshul' });
  createTask({ title: 'b', owner: 'devin' });
  completeTask(mine.id);
  assert.deepEqual(listTasks({ done: true }).map((t) => t.id), [mine.id]);
  assert.deepEqual(listTasks({ owner: 'devin' }).map((t) => t.title), ['b']);
});

test('renameTask validates and updates', () => {
  reset();
  const task = createTask({ title: 'a', owner: 'anshul' });
  assert.equal(renameTask(task.id, ' b ').title, 'b');
  assert.throws(() => renameTask(task.id, ''), ValidationError);
});

test('deleteTask removes the task once', () => {
  reset();
  const task = createTask({ title: 'a', owner: 'anshul' });
  deleteTask(task.id);
  assert.throws(() => deleteTask(task.id), NotFoundError);
});

test('createTask lowercases and de-duplicates tags', () => {
  reset();
  const task = createTask({ title: 'a', owner: 'anshul', tags: ['Demo', 'demo', 'infra'] });
  assert.deepEqual(task.tags, ['demo', 'infra']);
});

test('createTask rejects malformed tags', () => {
  reset();
  assert.throws(
    () => createTask({ title: 'a', owner: 'anshul', tags: ['not a tag'] }),
    ValidationError,
  );
});

test('createTask rejects more than five tags', () => {
  reset();
  assert.throws(
    () => createTask({ title: 'a', owner: 'anshul', tags: ['a', 'b', 'c', 'd', 'e', 'f'] }),
    ValidationError,
  );
});

test('listTasks filters by tag case-insensitively', () => {
  reset();
  createTask({ title: 'a', owner: 'anshul', tags: ['demo'] });
  createTask({ title: 'b', owner: 'anshul', tags: ['infra'] });
  assert.deepEqual(listTasks({ tag: 'DEMO' }).map((t) => t.title), ['a']);
});

test('retagTask replaces the tag set', () => {
  reset();
  const task = createTask({ title: 'a', owner: 'anshul', tags: ['demo'] });
  assert.deepEqual(retagTask(task.id, ['infra']).tags, ['infra']);
});

test('retagTask throws for a missing task', () => {
  reset();
  assert.throws(() => retagTask(404, ['demo']), NotFoundError);
});
