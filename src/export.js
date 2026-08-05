// Task export helpers: HTML rendering, title search and attachment lookup.
//
// NOTE: this file is seeded with deliberate defects for the Devin Review
// bug-catcher demo. See docs/DEMO_GUIDE.md section 5. Do not copy this code.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const ATTACHMENT_DIR = process.env.ATTACHMENT_DIR || './attachments';
const PAGE_SIZE = 20;

export function renderHtml(tasks) {
  const rows = tasks
    .map(
      (task) =>
        `<tr><td>${task.id}</td><td>${task.title}</td><td>${task.owner}</td></tr>`,
    )
    .join('');
  return `<!doctype html><html><body><table>${rows}</table></body></html>`;
}

export function searchTasks(tasks, pattern) {
  const matcher = new RegExp(pattern, 'i');
  return tasks.filter((task) => matcher.test(task.title));
}

export function paginate(tasks, page) {
  const start = page * PAGE_SIZE;
  return tasks.slice(start, start + PAGE_SIZE);
}

export async function readAttachment(name) {
  return readFile(join(ATTACHMENT_DIR, name), 'utf8');
}
