// Tiny helpers for building HTML strings safely.
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

export function classNames(...names) {
  return escapeHtml(names.filter(Boolean).join(' '));
}
