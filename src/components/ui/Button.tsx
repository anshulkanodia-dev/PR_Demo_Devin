import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'inverse' | 'outline-inverse';
export type ButtonSize = 'md' | 'base' | 'sm';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary/90',
  secondary: 'border border-line bg-surface text-ink hover:bg-canvas',
  inverse: 'bg-surface text-primary hover:bg-primary-subtle',
  'outline-inverse': 'border border-on-primary/35 text-on-primary hover:bg-on-primary/10',
};

const SIZES: Record<ButtonSize, string> = {
  md: 'h-12 px-6 text-base',
  base: 'h-11 px-5 text-[15px]',
  sm: 'h-10 px-4 text-sm',
};

type CommonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
};

type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined };

type LinkButtonProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'> & { href: string };

export type ButtonProps = NativeButtonProps | LinkButtonProps;

export function buttonClasses({ variant = 'primary', size = 'md', fullWidth = false, className }: Omit<CommonProps, 'children'>) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className,
  );
}

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { children, variant, size, fullWidth, className, href, ...anchor } = props;
    return (
      <Link href={href} {...anchor} className={buttonClasses({ variant, size, fullWidth, className })}>
        {children}
      </Link>
    );
  }

  const { children, variant, size, fullWidth, className, type = 'button', ...button } = props;
  return (
    <button type={type} {...button} className={buttonClasses({ variant, size, fullWidth, className })}>
      {children}
    </button>
  );
}
