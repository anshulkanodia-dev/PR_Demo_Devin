// Validation and business rules over the store. Middle layer of the demo stack.
import * as store from './store.js';

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(id) {
    super(`task ${id} not found`);
    this.name = 'NotFoundError';
  }
}

const MAX_TITLE_LENGTH = 120;

function requireString(value, field) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ValidationError(`${field} is required`);
  }
  return value.trim();
}

export function createTask({ title, owner }) {
  const cleanTitle = requireString(title, 'title');
  const cleanOwner = requireString(owner, 'owner');
  if (cleanTitle.length > MAX_TITLE_LENGTH) {
    throw new ValidationError(`title must be at most ${MAX_TITLE_LENGTH} characters`);
  }
  return store.insert({ title: cleanTitle, owner: cleanOwner });
}

export function getTask(id) {
  const task = store.get(id);
  if (!task) throw new NotFoundError(id);
  return task;
}

export function listTasks({ owner, done } = {}) {
  const tasks = store.list({ owner });
  if (done === undefined) return tasks;
  return tasks.filter((task) => task.done === done);
}

export function completeTask(id) {
  const task = store.update(id, { done: true });
  if (!task) throw new NotFoundError(id);
  return task;
}

export function renameTask(id, title) {
  const cleanTitle = requireString(title, 'title');
  if (cleanTitle.length > MAX_TITLE_LENGTH) {
    throw new ValidationError(`title must be at most ${MAX_TITLE_LENGTH} characters`);
  }
  const task = store.update(id, { title: cleanTitle });
  if (!task) throw new NotFoundError(id);
  return task;
}

export function searchTasks({ q, limit }) {
  const tasks = store.list();
  const matches = tasks.filter((task) => task.title.includes(q));
  return matches.slice(0, limit);
}

export function deleteTask(id) {
  if (!store.remove(id)) throw new NotFoundError(id);
}
