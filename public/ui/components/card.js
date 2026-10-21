import { classNames } from '../lib/html.js';

// Surface container. `children` is trusted HTML built from other components.
// inverse renders the dark surface used for the highlighted pricing plan.
export function Card({ children = '', highlighted = false, inverse = false, className = '' }) {
  const classes = classNames('card', highlighted && 'card--highlighted', inverse && 'card--inverse', className);
  return `<div class="${classes}">${children}</div>`;
}
