import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import PricingPage from '@/app/pricing/page';
import { BillingToggle, billingForKey, ComparisonTable, PLANS, planPrice, PricingCard, PricingPlans } from '@/components/pricing';
import { CheckCircleGlyph, CheckGlyph, PlanGlyph } from '@/components/pricing/icons';
import { Badge, buttonClasses, Card } from '@/components/ui';

const [free, pro, enterprise] = PLANS;

test('planPrice returns the monthly and annual Pro prices', () => {
  assert.deepEqual(planPrice(pro, 'monthly'), { amount: '$29', period: '/ month', note: 'per user, billed monthly' });
  assert.deepEqual(planPrice(pro, 'annual'), { amount: '$23', period: '/ month', note: 'per user, billed $276 yearly' });
  assert.equal(planPrice(free, 'annual').amount, '$0');
  assert.equal(planPrice(enterprise, 'monthly').amount, 'Custom');
});

test('billingForKey moves between options with arrow keys and wraps', () => {
  assert.equal(billingForKey('monthly', 'ArrowRight'), 'annual');
  assert.equal(billingForKey('annual', 'ArrowRight'), 'monthly');
  assert.equal(billingForKey('monthly', 'ArrowLeft'), 'annual');
  assert.equal(billingForKey('annual', 'ArrowUp'), 'monthly');
  assert.equal(billingForKey('monthly', 'Enter'), undefined);
});

test('PricingPlans renders the three plans and a keyboard-accessible billing toggle', () => {
  const html = renderToStaticMarkup(<PricingPlans intro={<h1>Pricing</h1>} />);
  assert.match(html, /role="radiogroup"/);
  assert.match(html, /role="radio" aria-checked="true"[^>]*>Monthly/);
  for (const plan of PLANS) assert.match(html, new RegExp(`id="plan-${plan.id}"`));
  assert.match(html, /Most popular/);
  assert.match(html, /\$29/);
});

test('PricingPlans shows annual Pro pricing when started on annual billing', () => {
  const html = renderToStaticMarkup(<PricingPlans intro={null} initialBilling="annual" />);
  assert.match(html, /\$23/);
  assert.match(html, /billed \$276 yearly/);
});

test('ComparisonTable is a scrollable, labelled table with every plan column', () => {
  const html = renderToStaticMarkup(<ComparisonTable />);
  assert.match(html, /role="region" aria-label="Plan comparison"/);
  assert.match(html, /overflow-x-auto/);
  assert.match(html, /<table/);
  for (const plan of PLANS) assert.match(html, new RegExp(`<th scope="col"[^>]*>${plan.name}</th>`));
  assert.match(html, /Not included/);
});

test('PricingPage renders the hero, comparison, FAQ and CTA sections', () => {
  const html = renderToStaticMarkup(<PricingPage />);
  assert.match(html, /Simple pricing that/);
  assert.match(html, /Compare plans/);
  assert.match(html, /Frequently asked questions/);
  assert.match(html, /Ready to move faster\?/);
});

test('PricingCard renders the dark Pro card with its badge and primary CTA', () => {
  const html = renderToStaticMarkup(<PricingCard plan={pro} billing="monthly" />);
  assert.match(html, /bg-inverse/);
  assert.match(html, /★ Most popular/);
  assert.match(html, /Start free trial/);
  for (const feature of pro.features) assert.ok(html.includes(feature.replace('&', '&amp;')), feature);
});

test('PricingCard renders Enterprise as a custom price without a period', () => {
  const html = renderToStaticMarkup(<PricingCard plan={enterprise} billing="annual" />);
  assert.match(html, />Custom</);
  assert.doesNotMatch(html, /\/ month/);
  assert.doesNotMatch(html, /Most popular/);
});

test('BillingToggle marks the selected option and keeps only it in the tab order', () => {
  const html = renderToStaticMarkup(<BillingToggle value="annual" onChange={() => {}} />);
  assert.match(html, /aria-checked="false" tabindex="-1"[^>]*>Monthly/);
  assert.match(html, /aria-checked="true" tabindex="0"/);
  assert.match(html, /Save 20%/);
});

test('Pricing glyphs render decorative SVGs that inherit the text colour', () => {
  for (const icon of ['free', 'pro', 'enterprise'] as const) {
    const html = renderToStaticMarkup(<PlanGlyph icon={icon} />);
    assert.match(html, /aria-hidden="true"/);
    assert.match(html, /stroke="currentColor"/);
  }
  assert.match(renderToStaticMarkup(<CheckGlyph />), /viewBox="0 0 12 12"/);
  assert.match(renderToStaticMarkup(<CheckCircleGlyph />), /fill-primary-subtle/);
});

test('Card, Badge and Button expose the inverse and solid variants used by the pricing page', () => {
  assert.match(renderToStaticMarkup(<Card tone="inverse">x</Card>), /bg-inverse/);
  assert.match(renderToStaticMarkup(<Card size="sm">x</Card>), /p-5/);
  assert.match(renderToStaticMarkup(<Badge tone="solid">x</Badge>), /bg-primary/);
  assert.match(buttonClasses({ variant: 'inverse', size: 'base' }), /bg-surface/);
  assert.match(buttonClasses({ variant: 'outline-inverse' }), /border/);
});
