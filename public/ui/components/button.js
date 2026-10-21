import { classNames, escapeHtml } from '../lib/html.js';

// Matches the Figma "Button" component: variant is 'primary' or 'secondary'.
export function Button({ label, variant = 'primary', fullWidth = false, action, type = 'button' }) {
  const className = classNames('btn', `btn--${variant}`, fullWidth && 'btn--full');
  const data = action ? ` data-action="${escapeHtml(action)}"` : '';
  return `<button type="${escapeHtml(type)}" class="${className}"${data}>${escapeHtml(label)}</button>`;
}
