import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 text-lg font-bold text-ink">
      <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-on-primary" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      Taskly
    </Link>
  );
}
