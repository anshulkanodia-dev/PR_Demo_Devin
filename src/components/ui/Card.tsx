import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type CardProps = {
  children: ReactNode;
  highlighted?: boolean;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'children'>;

export function Card({ children, highlighted = false, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 rounded-lg border bg-surface p-8',
        highlighted ? 'border-primary shadow-lg shadow-primary/10' : 'border-line',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
