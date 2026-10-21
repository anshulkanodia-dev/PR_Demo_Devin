import { classNames } from '../lib/html.js';

// Surface container. `children` is trusted HTML built from other components.
export function Card({ children = '', highlighted = false, className = '' }) {
  return `<div class="${classNames('card', highlighted && 'card--highlighted', className)}">${children}</div>`;
}
