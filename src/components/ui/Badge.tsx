import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone = 'primary' | 'success' | 'neutral';

const TONES: Record<BadgeTone, string> = {
  primary: 'bg-primary-subtle text-primary',
  success: 'bg-success-subtle text-success',
  neutral: 'bg-canvas text-ink-muted',
};

export function Badge({ children, tone = 'primary' }: { children: ReactNode; tone?: BadgeTone }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', TONES[tone])}>
      {children}
    </span>
  );
}
