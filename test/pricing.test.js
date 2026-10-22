import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PLANS,
  formatPrice,
  nextBilling,
  renderBillingToggle,
  renderCompareTable,
  renderPlanCard,
  renderPricingPage,
} from '../public/ui/pages/pricing.js';

const plan = (id) => PLANS.find((p) => p.id === id);

test('formatPrice shows monthly, annual and custom prices', () => {
  assert.equal(formatPrice(plan('pro'), 'monthly'), '$29');
  assert.equal(formatPrice(plan('pro'), 'annual'), '$23');
  assert.equal(formatPrice(plan('starter'), 'annual'), '$0');
  assert.equal(formatPrice(plan('enterprise'), 'monthly'), 'Custom');
});

test('renderPlanCard highlights Pro with the inverse card and badge', () => {
  const html = renderPlanCard(plan('pro'), 'annual');
  assert.match(html, /card--inverse/);
  assert.match(html, /Most popular/);
  assert.match(html, /billed \$276 yearly/);
  assert.match(html, /btn--primary btn--full/);
  assert.doesNotMatch(renderPlanCard(plan('starter'), 'monthly'), /card--inverse|Most popular/);
});

test('renderPlanCard escapes feature text and omits period for custom pricing', () => {
  const html = renderPlanCard(plan('enterprise'), 'monthly');
  assert.match(html, /SSO &amp; SCIM/);
  assert.doesNotMatch(html, /\/ month/);
});

test('renderBillingToggle marks the selected option for assistive tech', () => {
  const html = renderBillingToggle('annual');
  assert.match(html, /role="radiogroup"/);
  assert.match(html, /data-billing="annual" aria-checked="true" tabindex="0"/);
  assert.match(html, /data-billing="monthly" aria-checked="false" tabindex="-1"/);
});

test('nextBilling cycles with arrow keys and ignores other keys', () => {
  assert.equal(nextBilling('monthly', 'ArrowRight'), 'annual');
  assert.equal(nextBilling('annual', 'ArrowRight'), 'monthly');
  assert.equal(nextBilling('monthly', 'ArrowLeft'), 'annual');
  assert.equal(nextBilling('monthly', 'Enter'), 'monthly');
});

test('renderCompareTable renders groups, ticks and dashes', () => {
  const html = renderCompareTable();
  for (const group of ['Usage', 'Features', 'Support']) assert.match(html, new RegExp(`>${group}<`));
  assert.match(html, /aria-label="Included"/);
  assert.match(html, /aria-label="Not included"/);
  assert.match(html, /99\.9%/);
});

test('renderPricingPage includes every section in monthly mode by default', () => {
  const html = renderPricingPage();
  for (const text of ['Simple pricing that', 'Compare plans', 'Frequently asked questions', 'Ready to move faster?']) {
    assert.ok(html.includes(text), text);
  }
  assert.match(html, /data-price="pro">\$29</);
});

test('renderPricingPage includes a collapsed mobile menu', () => {
  const html = renderPricingPage();
  assert.match(html, /class="nav__menu"[^>]*aria-expanded="false" aria-controls="mobile-menu"/);
  assert.match(html, /<nav class="nav__panel" id="mobile-menu" aria-label="Mobile" hidden>/);
  assert.doesNotMatch(html, /cta__ghost/);
});
