import type { SVGProps } from 'react';

export type PlanIcon = 'free' | 'pro' | 'enterprise';

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'>;

const STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const PLAN_PATHS: Record<PlanIcon, string> = {
  free: 'M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z',
  pro: 'M13 2L4 14H11L10 22L19 10H12L13 2Z',
  enterprise: 'M3 21H5M5 21H9M5 21V7L12 3L19 7V21M9 21H15M9 21V16H15V21M15 21H19M19 21H21M9 10H9.01M15 10H15.01',
};

export function PlanGlyph({ icon, ...props }: IconProps & { icon: PlanIcon }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" {...props}>
      <path d={PLAN_PATHS[icon]} {...STROKE} />
    </svg>
  );
}

export function CheckGlyph(props: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" {...props}>
      <path d="M2.5 6.2L4.8 8.5L9.5 3.6" {...STROKE} />
    </svg>
  );
}

export function CheckCircleGlyph(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" {...props}>
      <circle cx="10" cy="10" r="10" className="fill-primary-subtle" />
      <path d="M6 10.3L8.6 12.9L14 7.4" {...STROKE} />
    </svg>
  );
}
