import { classNames, escapeHtml } from '../lib/html.js';

// Matches the Figma "Button" component.
// variant: 'primary' | 'secondary' | 'inverse' | 'ghost-inverse' (the last two sit on primary-coloured surfaces).
// size: 'md' | 'sm'.
export function Button({ label, variant = 'primary', size = 'md', fullWidth = false, action, type = 'button' }) {
  const className = classNames('btn', `btn--${variant}`, size !== 'md' && `btn--${size}`, fullWidth && 'btn--full');
  const data = action ? ` data-action="${escapeHtml(action)}"` : '';
  return `<button type="${escapeHtml(type)}" class="${className}"${data}>${escapeHtml(label)}</button>`;
}
