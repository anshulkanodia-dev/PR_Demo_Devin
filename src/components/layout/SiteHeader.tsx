'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';
import { NAV_LINKS } from './nav';

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const desktop = window.matchMedia('(min-width: 768px)');
    const onResize = () => desktop.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onResize);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5 md:h-[72px] md:px-6">
        <Logo />
        <nav aria-label="Main" className="hidden gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={cn('text-[15px] font-medium hover:text-ink', pathname === link.href ? 'text-ink' : 'text-ink-muted')}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-5 md:flex">
          <Link href="#" className="text-[15px] font-medium text-ink-muted hover:text-ink">
            Sign in
          </Link>
          <Button size="sm">Start free</Button>
        </div>
        <button
          ref={menuButton}
          type="button"
          className="grid h-10 w-10 place-items-center rounded-md border border-line md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="flex flex-col gap-1 border-t border-line px-6 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className="rounded-md px-2 py-3 font-medium text-ink hover:bg-canvas" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Button fullWidth className="mt-2">
            Start free
          </Button>
        </nav>
      )}
    </header>
  );
}
