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
const MAX_TAGS = 5;
const TAG_PATTERN = /^[a-z0-9-]{1,20}$/;

function requireString(value, field) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ValidationError(`${field} is required`);
  }
  return value.trim();
}

function normaliseTags(tags) {
  if (tags === undefined) return [];
  if (!Array.isArray(tags)) throw new ValidationError('tags must be an array');
  const clean = [...new Set(tags.map((tag) => requireString(tag, 'tag').toLowerCase()))];
  if (clean.length > MAX_TAGS) {
    throw new ValidationError(`a task may have at most ${MAX_TAGS} tags`);
  }
  for (const tag of clean) {
    if (!TAG_PATTERN.test(tag)) {
      throw new ValidationError(`invalid tag: ${tag}`);
    }
  }
  return clean;
}

export function createTask({ title, owner, tags }) {
  const cleanTitle = requireString(title, 'title');
  const cleanOwner = requireString(owner, 'owner');
  if (cleanTitle.length > MAX_TITLE_LENGTH) {
    throw new ValidationError(`title must be at most ${MAX_TITLE_LENGTH} characters`);
  }
  return store.insert({ title: cleanTitle, owner: cleanOwner, tags: normaliseTags(tags) });
}

export function getTask(id) {
  const task = store.get(id);
  if (!task) throw new NotFoundError(id);
  return task;
}

export function listTasks({ owner, done, tag } = {}) {
  const tasks = store.list({
    owner,
    tag: tag === undefined ? undefined : normaliseTags([tag])[0],
  });
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

export function retagTask(id, tags) {
  if (tags === undefined) throw new ValidationError('tags is required');
  const task = store.update(id, { tags: normaliseTags(tags) });
  if (!task) throw new NotFoundError(id);
  return task;
}

export function deleteTask(id) {
  if (!store.remove(id)) throw new NotFoundError(id);
}
