import type { PlanIcon } from './icons';
import type { ButtonVariant } from '@/components/ui';

export type Billing = 'monthly' | 'annual';

export type PlanPrice = { amount: string; period?: string; note: string };

export type Plan = {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  description: string;
  icon: PlanIcon;
  price: Record<Billing, PlanPrice>;
  cta: { label: string; href: string; variant: ButtonVariant };
  featuresTitle: string;
  features: string[];
  highlighted?: boolean;
};

export const BILLING_OPTIONS: Array<{ value: Billing; label: string; badge?: string }> = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annual', label: 'Annual', badge: 'Save 20%' },
];

const FREE_PRICE: PlanPrice = { amount: '$0', period: '/ month', note: 'Free forever' };
const ENTERPRISE_PRICE: PlanPrice = { amount: 'Custom', note: 'Volume pricing available' };

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'For individuals getting organised.',
    icon: 'free',
    price: { monthly: FREE_PRICE, annual: FREE_PRICE },
    cta: { label: 'Get started', href: '#', variant: 'secondary' },
    featuresTitle: 'What’s included',
    features: ['Up to 3 projects', '1 GB storage', 'Basic task boards', 'Community support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing teams that ship weekly.',
    icon: 'pro',
    price: {
      monthly: { amount: '$29', period: '/ month', note: 'per user, billed monthly' },
      annual: { amount: '$23', period: '/ month', note: 'per user, billed $276 yearly' },
    },
    cta: { label: 'Start free trial', href: '#', variant: 'primary' },
    featuresTitle: 'Everything in Free, plus',
    features: ['Unlimited projects', '100 GB storage', 'Advanced analytics', 'Roles & permissions', 'Priority email support'],
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For organisations with advanced needs.',
    icon: 'enterprise',
    price: { monthly: ENTERPRISE_PRICE, annual: ENTERPRISE_PRICE },
    cta: { label: 'Contact sales', href: '#', variant: 'secondary' },
    featuresTitle: 'Everything in Pro, plus',
    features: ['Everything in Pro', 'SSO & SCIM provisioning', 'Audit logs', 'Dedicated success manager', '99.9% uptime SLA'],
  },
];

/** `true` renders a check, `false` a dash, a string renders as text. */
export type ComparisonValue = boolean | string;

export type ComparisonGroup = {
  title: string;
  rows: Array<{ feature: string; values: [ComparisonValue, ComparisonValue, ComparisonValue] }>;
};

export const COMPARISON: ComparisonGroup[] = [
  {
    title: 'Usage',
    rows: [
      { feature: 'Projects', values: ['3', 'Unlimited', 'Unlimited'] },
      { feature: 'Storage', values: ['1 GB', '100 GB', 'Unlimited'] },
      { feature: 'Team members', values: ['1', 'Up to 50', 'Unlimited'] },
    ],
  },
  {
    title: 'Features',
    rows: [
      { feature: 'Task boards & lists', values: [true, true, true] },
      { feature: 'Advanced analytics', values: [false, true, true] },
      { feature: 'Roles & permissions', values: [false, true, true] },
      { feature: 'SSO & SCIM', values: [false, false, true] },
      { feature: 'Audit logs', values: [false, false, true] },
    ],
  },
  {
    title: 'Support',
    rows: [
      { feature: 'Community support', values: [true, true, true] },
      { feature: 'Priority email', values: [false, true, true] },
      { feature: 'Dedicated manager', values: [false, false, true] },
      { feature: 'Uptime SLA', values: [false, '99.5%', '99.9%'] },
    ],
  },
];

export const CUSTOMER_LOGOS = ['Northwind', 'Lumen', 'Brightside', 'Orbit', 'Fieldnote'];

export const FAQS = [
  {
    question: 'Can I change plans later?',
    answer: 'Yes. Upgrade or downgrade at any time and we’ll prorate the difference on your next invoice.',
  },
  {
    question: 'Is there a free trial for Pro?',
    answer: 'Every Pro plan starts with a 14-day free trial. No credit card required.',
  },
  {
    question: 'How does annual billing work?',
    answer: 'Pay once a year and save 20% compared with monthly billing. Cancel anytime.',
  },
  {
    question: 'Do you offer discounts for nonprofits?',
    answer: 'Yes, registered nonprofits and schools get 50% off Pro. Contact our team to apply.',
  },
];

export function planPrice(plan: Plan, billing: Billing): PlanPrice {
  return plan.price[billing];
}

/** Next billing option for a radiogroup arrow key, wrapping at both ends; `undefined` for other keys. */
export function billingForKey(current: Billing, key: string): Billing | undefined {
  const step = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 0;
  if (step === 0) return undefined;
  const index = BILLING_OPTIONS.findIndex((option) => option.value === current);
  return BILLING_OPTIONS[(index + step + BILLING_OPTIONS.length) % BILLING_OPTIONS.length].value;
}
