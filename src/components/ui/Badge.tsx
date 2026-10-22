import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone = 'primary' | 'success' | 'neutral' | 'solid';
export type BadgeSize = 'sm' | 'md' | 'lg';

const TONES: Record<BadgeTone, string> = {
  primary: 'bg-primary-subtle text-primary',
  success: 'bg-success-subtle text-success-strong',
  neutral: 'bg-canvas text-ink-muted',
  solid: 'bg-primary text-on-primary',
};

const SIZES: Record<BadgeSize, string> = {
  sm: 'h-[22px] px-2',
  md: 'px-3 py-1',
  lg: 'h-7 px-3',
};

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  size?: BadgeSize;
  bold?: boolean;
};

export function Badge({ children, tone = 'primary', size = 'md', bold = false }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full text-xs',
        bold ? 'font-bold' : 'font-semibold',
        TONES[tone],
        SIZES[size],
      )}
    >
      {children}
    </span>
  );
}
