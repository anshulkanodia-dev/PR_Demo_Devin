// Task board page. Reference implementation for pages built from the shared components.
import { Badge, Button, Card } from '../components/index.js';
import { escapeHtml } from '../lib/html.js';

const SAMPLE_TASKS = [
  { title: 'Review pricing copy', owner: 'priya', tags: ['marketing'] },
  { title: 'Ship billing toggle', owner: 'devin', tags: ['frontend', 'billing'] },
  { title: 'Rotate API keys', owner: 'sam', tags: ['security'] },
];

export function renderSummary(tasks) {
  const done = tasks.filter((task) => task.done).length;
  const stats = [
    { label: 'Total', value: tasks.length },
    { label: 'Open', value: tasks.length - done },
    { label: 'Done', value: done },
  ];
  return stats
    .map(({ label, value }) =>
      Card({ children: `<p class="muted">${label}</p><p class="stat__value">${value}</p>` }),
    )
    .join('');
}

export function renderTask(task) {
  const tags = (task.tags ?? []).map((tag) => Badge({ label: tag })).join('');
  const status = task.done
    ? Badge({ label: 'Done', tone: 'success' })
    : Button({ label: 'Complete', variant: 'secondary', action: `complete:${task.id}` });
  return `<li class="task">
    <div class="stack" style="gap: var(--space-1)">
      <strong>${escapeHtml(task.title)}</strong>
      <div class="task__meta"><span class="muted">@${escapeHtml(task.owner)}</span>${tags}</div>
    </div>
    ${status}
  </li>`;
}

export function renderTaskList(tasks) {
  if (tasks.length === 0) {
    return Card({
      children: `<p class="muted">No tasks yet.</p>${Button({ label: 'Add sample tasks', action: 'seed' })}`,
    });
  }
  return Card({ children: `<ul class="task-list">${tasks.map(renderTask).join('')}</ul>` });
}

async function api(path, options) {
  const res = await fetch(path, options);
  if (!res.ok) throw new Error(`${path} failed with ${res.status}`);
  return res.status === 204 ? null : res.json();
}

export function missingSamples(tasks) {
  const titles = new Set(tasks.map((task) => task.title));
  return SAMPLE_TASKS.filter((task) => !titles.has(task.title));
}

async function refresh(error = '', retry = '') {
  const tasks = await api('/tasks');
  const retryButton = retry ? ` ${Button({ label: 'Retry', variant: 'secondary', action: retry })}` : '';
  const notice = error ? `<p class="task-error" role="alert">${escapeHtml(error)}${retryButton}</p>` : '';
  document.getElementById('summary').innerHTML = renderSummary(tasks);
  document.getElementById('tasks').innerHTML = notice + renderTaskList(tasks);
}

// Creates only the samples that are not on the board yet, so retries never duplicate them.
async function seed() {
  for (const task of missingSamples(await api('/tasks'))) {
    await api('/tasks', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(task),
    });
  }
}

let busy = false;

async function onAction(action) {
  if (busy) return;
  busy = true;
  let error = '';
  let retry = '';
  try {
    if (action === 'seed') await seed();
    else if (action.startsWith('complete:')) {
      await api(`/tasks/${action.split(':')[1]}/complete`, { method: 'POST' });
    }
  } catch (err) {
    error = `Something went wrong: ${err.message}`;
    retry = action;
  } finally {
    busy = false;
    await refresh(error, retry);
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (target) onAction(target.dataset.action);
  });
  refresh();
}
