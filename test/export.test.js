import test from 'node:test';
import assert from 'node:assert/strict';
import { renderHtml, searchTasks, paginate } from '../src/export.js';

const tasks = [
  { id: 1, title: 'write docs', owner: 'anshul', done: false },
  { id: 2, title: 'record demo', owner: 'devin', done: false },
];

test('renderHtml emits a row per task', () => {
  const html = renderHtml(tasks);
  assert.match(html, /<td>write docs<\/td>/);
  assert.equal(html.match(/<tr>/g).length, 2);
});

test('searchTasks matches titles case-insensitively', () => {
  assert.deepEqual(searchTasks(tasks, 'DOCS').map((t) => t.id), [1]);
  assert.deepEqual(searchTasks(tasks, 'demo').map((t) => t.id), [2]);
});

test('paginate returns a page of results', () => {
  assert.equal(paginate(tasks, 0).length, 2);
});
