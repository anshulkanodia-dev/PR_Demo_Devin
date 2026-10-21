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

async function refresh() {
  const tasks = await api('/tasks');
  document.getElementById('summary').innerHTML = renderSummary(tasks);
  document.getElementById('tasks').innerHTML = renderTaskList(tasks);
}

async function onAction(action) {
  if (action === 'seed') {
    for (const task of SAMPLE_TASKS) {
      await api('/tasks', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(task),
      });
    }
  } else if (action.startsWith('complete:')) {
    await api(`/tasks/${action.split(':')[1]}/complete`, { method: 'POST' });
  }
  await refresh();
}

if (typeof document !== 'undefined') {
  document.getElementById('header-actions').innerHTML = Button({ label: 'Add sample tasks', action: 'seed' });
  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (target) onAction(target.dataset.action);
  });
  refresh();
}
