import { classNames, escapeHtml } from '../lib/html.js';

// Matches the Figma "Badge" component. tone is 'primary' or 'success'.
export function Badge({ label, tone = 'primary' }) {
  return `<span class="${classNames('badge', tone !== 'primary' && `badge--${tone}`)}">${escapeHtml(label)}</span>`;
}
