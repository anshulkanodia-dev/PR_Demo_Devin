'use client';

import { useRef, type KeyboardEvent } from 'react';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/cn';
import { BILLING_OPTIONS, billingForKey, type Billing } from './plans';

type BillingToggleProps = {
  value: Billing;
  onChange: (value: Billing) => void;
};

export function BillingToggle({ value, onChange }: BillingToggleProps) {
  const options = useRef<Partial<Record<Billing, HTMLButtonElement | null>>>({});

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = billingForKey(value, event.key);
    if (!next) return;
    event.preventDefault();
    onChange(next);
    options.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Billing period"
      onKeyDown={onKeyDown}
      className="inline-flex rounded-full bg-toggle-track p-1"
    >
      {BILLING_OPTIONS.map((option) => {
        const checked = option.value === value;
        return (
          <button
            key={option.value}
            ref={(node) => {
              options.current[option.value] = node;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors sm:px-5 sm:text-[15px]',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              checked ? 'bg-surface text-ink shadow-thumb' : 'text-ink-muted hover:text-ink',
            )}
          >
            {option.label}
            {option.badge && (
              <Badge tone="success" size="sm" bold>
                {option.badge}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}
