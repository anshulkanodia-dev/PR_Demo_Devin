// In-memory persistence layer for tasks. Bottom layer of the demo stack.

let nextId = 1;
const tasks = new Map();

export function reset() {
  nextId = 1;
  tasks.clear();
}

export function insert({ title, owner, done = false, tags = [] }) {
  const task = { id: nextId++, title, owner, done, tags: [...tags] };
  tasks.set(task.id, task);
  return clone(task);
}

function clone(task) {
  return { ...task, tags: [...task.tags] };
}

export function get(id) {
  const task = tasks.get(id);
  return task ? clone(task) : null;
}

export function list({ owner, tag } = {}) {
  let all = [...tasks.values()].map(clone);
  if (owner) all = all.filter((task) => task.owner === owner);
  if (tag) all = all.filter((task) => task.tags.includes(tag));
  return all;
}

export function update(id, patch) {
  const task = tasks.get(id);
  if (!task) return null;
  const updated = { ...task, ...patch, id: task.id };
  updated.tags = [...(patch.tags ?? task.tags)];
  tasks.set(id, updated);
  return clone(updated);
}

export function remove(id) {
  return tasks.delete(id);
}
