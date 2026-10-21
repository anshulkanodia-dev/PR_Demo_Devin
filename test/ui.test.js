import test from 'node:test';
import assert from 'node:assert/strict';
import { Badge, Button, Card } from '../public/ui/components/index.js';
import { classNames, escapeHtml } from '../public/ui/lib/html.js';
import { missingSamples, renderSummary, renderTask, renderTaskList } from '../public/ui/pages/tasks.js';

test('escapeHtml escapes markup characters', () => {
  assert.equal(escapeHtml('<a href="x">&\'</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;');
});

test('classNames drops falsy values', () => {
  assert.equal(classNames('a', false, null, 'b'), 'a b');
});

test('Button renders variant, width and action', () => {
  assert.equal(
    Button({ label: 'Go', variant: 'secondary', fullWidth: true, action: 'seed' }),
    '<button type="button" class="btn btn--secondary btn--full" data-action="seed">Go</button>',
  );
  assert.match(Button({ label: '<b>' }), /class="btn btn--primary">&lt;b&gt;</);
});

test('Card renders highlighted modifier', () => {
  assert.equal(Card({ children: 'x' }), '<div class="card">x</div>');
  assert.equal(Card({ children: 'x', highlighted: true }), '<div class="card card--highlighted">x</div>');
});

test('Badge renders tone modifier', () => {
  assert.equal(Badge({ label: 'Pro' }), '<span class="badge">Pro</span>');
  assert.equal(Badge({ label: 'Done', tone: 'success' }), '<span class="badge badge--success">Done</span>');
});

test('renderSummary counts total, open and done', () => {
  const html = renderSummary([{ done: true }, { done: false }, { done: false }]);
  assert.deepEqual([...html.matchAll(/stat__value">(\d+)</g)].map((m) => m[1]), ['3', '2', '1']);
});

test('renderTask escapes user content', () => {
  const html = renderTask({ id: 1, title: '<script>', owner: 'a', tags: ['x'], done: false });
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /data-action="complete:1"/);
});

test('renderTaskList shows empty state', () => {
  assert.match(renderTaskList([]), /No tasks yet/);
});

test('Card and Badge escape class values', () => {
  assert.equal(Card({ className: '"><img src=x>' }), '<div class="card &quot;&gt;&lt;img src=x&gt;"></div>');
  assert.doesNotMatch(Badge({ label: 'x', tone: '"><b>' }), /<b>/);
});

test('missingSamples skips samples already on the board', () => {
  const all = missingSamples([]);
  assert.equal(all.length, 3);
  const rest = missingSamples([{ id: 1, title: all[0].title, done: false }]);
  assert.deepEqual(rest.map((task) => task.title), all.slice(1).map((task) => task.title));
  assert.equal(missingSamples(all).length, 0);
});
