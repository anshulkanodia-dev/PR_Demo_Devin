// In-memory persistence layer for tasks. Bottom layer of the demo stack.

let nextId = 1;
const tasks = new Map();

export function reset() {
  nextId = 1;
  tasks.clear();
}

export function insert({ title, owner, done = false }) {
  const task = { id: nextId++, title, owner, done };
  tasks.set(task.id, task);
  return { ...task };
}

export function get(id) {
  const task = tasks.get(id);
  return task ? { ...task } : null;
}

export function list({ owner } = {}) {
  const all = [...tasks.values()].map((task) => ({ ...task }));
  return owner ? all.filter((task) => task.owner === owner) : all;
}

export function update(id, patch) {
  const task = tasks.get(id);
  if (!task) return null;
  const updated = { ...task, ...patch, id: task.id };
  tasks.set(id, updated);
  return { ...updated };
}

export function remove(id) {
  return tasks.delete(id);
}
