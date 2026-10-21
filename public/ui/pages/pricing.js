// Pricing page, implemented from the Figma "Pricing Section" frames.
import { Badge, Button, Card } from '../components/index.js';
import { escapeHtml } from '../lib/html.js';

export const BILLING = ['monthly', 'annual'];

export const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For individuals getting organised.',
    price: { monthly: 0, annual: 0 },
    note: { monthly: 'Free forever', annual: 'Free forever' },
    cta: { label: 'Get started', variant: 'secondary' },
    includes: 'What’s included',
    features: ['Up to 3 projects', '1 GB storage', 'Basic task boards', 'Community support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing teams that ship weekly.',
    price: { monthly: 29, annual: 23 },
    note: { monthly: 'per user, billed monthly', annual: 'per user, billed $276 yearly' },
    cta: { label: 'Start free trial', variant: 'primary' },
    includes: 'Everything in Starter, plus',
    features: ['Unlimited projects', '100 GB storage', 'Advanced analytics', 'Roles & permissions', 'Priority email support'],
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For organisations with advanced needs.',
    price: { monthly: null, annual: null },
    note: { monthly: 'Volume pricing available', annual: 'Volume pricing available' },
    cta: { label: 'Contact sales', variant: 'secondary' },
    includes: 'Everything in Pro, plus',
    features: ['Everything in Pro', 'SSO & SCIM provisioning', 'Audit logs', 'Dedicated success manager', '99.9% uptime SLA'],
  },
];

export const COMPARE = [
  { group: 'Usage', rows: [['Projects', '3', 'Unlimited', 'Unlimited'], ['Storage', '1 GB', '100 GB', 'Unlimited'], ['Team members', '1', 'Up to 50', 'Unlimited']] },
  {
    group: 'Features',
    rows: [
      ['Task boards & lists', true, true, true],
      ['Advanced analytics', false, true, true],
      ['Roles & permissions', false, true, true],
      ['SSO & SCIM', false, false, true],
      ['Audit logs', false, false, true],
    ],
  },
  {
    group: 'Support',
    rows: [
      ['Community support', true, true, true],
      ['Priority email', false, true, true],
      ['Dedicated manager', false, false, true],
      ['Uptime SLA', false, '99.5%', '99.9%'],
    ],
  },
];

export const FAQ = [
  ['Can I change plans later?', 'Yes. Upgrade or downgrade at any time and we’ll prorate the difference on your next invoice.'],
  ['Is there a free trial for Pro?', 'Every Pro plan starts with a 14-day free trial. No credit card required.'],
  ['How does annual billing work?', 'Pay once a year and save 20% compared with monthly billing. Cancel anytime.'],
  ['Do you offer discounts for nonprofits?', 'Yes, registered nonprofits and schools get 50% off Pro. Contact our team to apply.'],
];

const CHECK_ICON = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 6.2l2.3 2.3 4.7-4.9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const PLAN_ICONS = {
  starter: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/>',
  pro: '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
  enterprise: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5"/>',
};

export function formatPrice(plan, billing) {
  const amount = plan.price[billing];
  return amount === null ? 'Custom' : `$${amount}`;
}

function planIcon(id) {
  return `<span class="plan__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PLAN_ICONS[id]}</svg></span>`;
}

export function renderPlanCard(plan, billing) {
  const price = formatPrice(plan, billing);
  const custom = plan.price[billing] === null;
  const features = plan.features
    .map((feature) => `<li class="plan__feature"><span class="plan__check">${CHECK_ICON}</span>${escapeHtml(feature)}</li>`)
    .join('');
  const children = `
    <div class="plan__top">${planIcon(plan.id)}${plan.highlighted ? Badge({ label: '★ Most popular', tone: 'solid' }) : ''}</div>
    <div><h3 class="plan__name">${escapeHtml(plan.name)}</h3><p class="plan__desc">${escapeHtml(plan.description)}</p></div>
    <div>
      <p class="plan__price"><span class="plan__amount${custom ? ' plan__amount--custom' : ''}" data-price="${plan.id}">${price}</span>${custom ? '' : '<span class="plan__period">/ month</span>'}</p>
      <p class="plan__note" data-note="${plan.id}">${escapeHtml(plan.note[billing])}</p>
    </div>
    ${Button({ label: plan.cta.label, variant: plan.cta.variant, fullWidth: true })}
    <hr class="plan__divider" />
    <p class="plan__includes">${escapeHtml(plan.includes)}</p>
    <ul class="plan__features">${features}</ul>`;
  return Card({ children, inverse: plan.highlighted, className: `plan${plan.highlighted ? ' plan--highlighted' : ''}` });
}

export function renderBillingToggle(billing) {
  const option = (value, label, extra = '') => {
    const checked = value === billing;
    return `<button type="button" role="radio" class="toggle__option" data-billing="${value}" aria-checked="${checked}" tabindex="${checked ? 0 : -1}">${label}${extra}</button>`;
  };
  return `<div class="toggle" role="radiogroup" aria-label="Billing period">${option('monthly', 'Monthly')}${option('annual', 'Annual', ` ${Badge({ label: 'Save 20%', tone: 'success' })}`)}</div>`;
}

function compareCell(value, pro) {
  const cls = pro ? ' class="compare__pro"' : '';
  if (value === true) return `<td${cls}><span class="compare__tick" aria-label="Included">${CHECK_ICON}</span></td>`;
  if (value === false) return `<td${cls}><span class="compare__dash" aria-label="Not included">—</span></td>`;
  return `<td${cls}>${escapeHtml(value)}</td>`;
}

export function renderCompareTable() {
  const head = '<thead><tr><th scope="col">Compare features</th><th scope="col">Starter</th><th scope="col" class="compare__pro">Pro</th><th scope="col">Enterprise</th></tr></thead>';
  const body = COMPARE.map(({ group, rows }) => {
    const heading = `<tr class="compare__group"><th scope="rowgroup" colspan="2">${escapeHtml(group)}</th><td class="compare__pro"></td><td></td></tr>`;
    const cells = rows.map(([label, ...values]) => `<tr><th scope="row">${escapeHtml(label)}</th>${values.map((v, i) => compareCell(v, i === 1)).join('')}</tr>`);
    return heading + cells.join('');
  }).join('');
  return `<div class="compare__scroll"><table class="compare">${head}<tbody>${body}</tbody></table></div><p class="compare__hint">Swipe to compare all plans →</p>`;
}

export function renderPricingPage(billing = 'monthly') {
  const logos = ['Northwind', 'Lumen', 'Brightside', 'Orbit', 'Fieldnote'].map((name) => `<span class="logos__item"><i></i>${name}</span>`).join('');
  const faq = FAQ.map(([q, a]) => `<div class="faq__item"><h3>${escapeHtml(q)}</h3><p>${escapeHtml(a)}</p></div>`).join('');
  return `
  <header class="nav">
    <a class="nav__logo" href="/"><span class="nav__mark">${CHECK_ICON}</span>Taskly</a>
    <nav class="nav__links" aria-label="Main"><a href="#">Product</a><a href="/pricing" aria-current="page">Pricing</a><a href="#">Customers</a><a href="#">Docs</a></nav>
    <div class="nav__actions"><a href="#">Sign in</a>${Button({ label: 'Start free', size: 'sm' })}</div>
    <button type="button" class="nav__menu" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    <nav class="nav__panel" id="mobile-menu" aria-label="Mobile" hidden><a href="#">Product</a><a href="/pricing" aria-current="page">Pricing</a><a href="#">Customers</a><a href="#">Docs</a><a href="#">Sign in</a>${Button({ label: 'Start free', fullWidth: true })}</nav>
  </header>
  <main>
    <section class="hero">
      <p class="hero__pill"><span>New</span>Annual plans now save 20%</p>
      <h1>Simple pricing that <em>grows with your team</em></h1>
      <p class="hero__sub">Start free and upgrade when you’re ready. Every plan includes unlimited tasks, real-time sync and a 14-day Pro trial.</p>
      <div id="billing-toggle">${renderBillingToggle(billing)}</div>
    </section>
    <section class="plans" id="plans" aria-label="Plans">${PLANS.map((plan) => renderPlanCard(plan, billing)).join('')}</section>
    <section class="logos"><p>Trusted by 4,000+ product teams</p><div class="logos__row">${logos}</div></section>
    <section class="section"><div class="section__head"><h2>Compare plans</h2><p>Every feature, side by side.</p></div>${renderCompareTable()}</section>
    <section class="section"><div class="section__head"><h2>Frequently asked questions</h2></div><div class="faq">${faq}</div></section>
    <section class="cta"><div><h2>Ready to move faster?</h2><p>Join thousands of teams planning their work in Taskly.</p></div><div class="cta__actions">${Button({ label: 'Start free trial', variant: 'inverse' })}${Button({ label: 'Talk to sales', variant: 'ghost-inverse' })}</div></section>
  </main>
  <footer class="footer"><span>© 2026 Taskly, Inc.</span><span>Privacy · Terms · Status</span></footer>`;
}

export function nextBilling(current, key) {
  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[key];
  if (!step) return current;
  return BILLING[(BILLING.indexOf(current) + step + BILLING.length) % BILLING.length];
}

function mount(root) {
  let billing = 'monthly';
  root.innerHTML = renderPricingPage(billing);
  const setBilling = (value, focus = false) => {
    billing = value;
    root.querySelector('#billing-toggle').innerHTML = renderBillingToggle(billing);
    root.querySelector('#plans').innerHTML = PLANS.map((plan) => renderPlanCard(plan, billing)).join('');
    if (focus) root.querySelector(`[data-billing="${billing}"]`).focus();
  };
  const menuButton = root.querySelector('.nav__menu');
  const menu = root.querySelector('#mobile-menu');
  const setMenu = (open) => {
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  root.addEventListener('click', (event) => {
    const option = event.target.closest('[data-billing]');
    if (option) setBilling(option.dataset.billing, true);
    if (event.target.closest('.nav__menu')) setMenu(menu.hidden);
  });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      setMenu(false);
      menuButton.focus();
      return;
    }
    if (!event.target.closest('[role="radiogroup"]')) return;
    const value = nextBilling(billing, event.key);
    if (value !== billing) {
      event.preventDefault();
      setBilling(value, true);
    }
  });
}

if (typeof document !== 'undefined') mount(document.getElementById('pricing'));
