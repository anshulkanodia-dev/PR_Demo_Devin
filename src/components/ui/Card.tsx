import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type CardTone = 'default' | 'inverse';
export type CardSize = 'md' | 'lg' | 'sm';

const SIZES: Record<CardSize, string> = {
  md: 'gap-6 rounded-lg p-8',
  lg: 'gap-6 rounded-xl px-6 py-7 sm:p-8',
  sm: 'gap-2 rounded-lg p-5 md:px-7 md:py-6',
};

type CardProps = {
  children: ReactNode;
  highlighted?: boolean;
  tone?: CardTone;
  size?: CardSize;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'children'>;

function borderAndSurface(tone: CardTone, highlighted: boolean) {
  if (tone === 'inverse') return 'border-inverse bg-inverse text-on-primary shadow-popular';
  return cn('bg-surface', highlighted ? 'border-primary shadow-lg shadow-primary/10' : 'border-line');
}

export function Card({ children, highlighted = false, tone = 'default', size = 'md', className, ...rest }: CardProps) {
  return (
    <div className={cn('flex flex-col border', SIZES[size], borderAndSurface(tone, highlighted), className)} {...rest}>
      {children}
    </div>
  );
}
