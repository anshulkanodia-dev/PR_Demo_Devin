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
  deleteTask,
  searchTasks,
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

test('searchTasks matches on title', () => {
  reset();
  createTask({ title: 'write docs', owner: 'anshul' });
  createTask({ title: 'record demo', owner: 'devin' });
  createTask({ title: 'write tests', owner: 'devin' });
  const found = searchTasks({ q: 'write', limit: 3 });
  assert.equal(found.length, 2);
});
