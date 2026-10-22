import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import HomePage from '@/app/page';
import { Logo } from '@/components/layout/Logo';
import { NAV_LINKS } from '@/components/layout/nav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Badge, Button, buttonClasses, Card } from '@/components/ui';
import { cn } from '@/lib/cn';

test('cn joins truthy classes only', () => {
  assert.equal(cn('a', false, null, undefined, 'b'), 'a b');
});

test('buttonClasses maps variant, size and fullWidth to token classes', () => {
  const classes = buttonClasses({ variant: 'secondary', size: 'sm', fullWidth: true });
  assert.match(classes, /border-line/);
  assert.match(classes, /h-10/);
  assert.match(classes, /w-full/);
});

test('Button renders a native button with type="button" by default', () => {
  const html = renderToStaticMarkup(<Button aria-label="Go">Go</Button>);
  assert.match(html, /^<button type="button" aria-label="Go"/);
  assert.match(html, /bg-primary/);
});

test('Button with href renders a link and forwards anchor attributes', () => {
  const html = renderToStaticMarkup(
    <Button href="/pricing" aria-label="View plans" target="_blank">
      Plans
    </Button>,
  );
  assert.match(html, /^<a /);
  assert.match(html, /href="\/pricing"/);
  assert.match(html, /aria-label="View plans"/);
  assert.match(html, /target="_blank"/);
});

test('Card switches border token when highlighted', () => {
  assert.match(renderToStaticMarkup(<Card>x</Card>), /border-line/);
  assert.match(renderToStaticMarkup(<Card highlighted>x</Card>), /border-primary/);
});

test('Badge applies the tone classes', () => {
  assert.match(renderToStaticMarkup(<Badge tone="success">Saved</Badge>), /bg-success-subtle/);
});

test('Logo links home', () => {
  assert.match(renderToStaticMarkup(<Logo />), /href="\/"[^>]*>.*Taskly/);
});

test('SiteHeader renders every nav link and a collapsed mobile menu button', () => {
  const html = renderToStaticMarkup(<SiteHeader />);
  for (const link of NAV_LINKS) assert.ok(html.includes(`>${link.label}</a>`), link.label);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /aria-controls="mobile-menu"/);
});

test('SiteFooter renders the copyright', () => {
  assert.match(renderToStaticMarkup(<SiteFooter />), /Taskly, Inc\./);
});

test('HomePage links to /pricing and renders three feature cards', () => {
  const html = renderToStaticMarkup(<HomePage />);
  assert.match(html, /href="\/pricing"/);
  assert.equal(html.match(/<h3/g)?.length, 3);
});
