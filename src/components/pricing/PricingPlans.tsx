'use client';

import { useState, type ReactNode } from 'react';
import { BillingToggle } from './BillingToggle';
import { PricingCard } from './PricingCard';
import { PLANS, type Billing } from './plans';

/** Hero (with the billing toggle) and plan cards, which share the billing state. */
export function PricingPlans({ intro, initialBilling = 'monthly' }: { intro: ReactNode; initialBilling?: Billing }) {
  const [billing, setBilling] = useState<Billing>(initialBilling);

  return (
    <>
      <section className="bg-gradient-to-b from-primary-tint to-surface px-5 pb-10 pt-12 md:px-6 md:pb-16 md:pt-20">
        <div className="mx-auto flex max-w-content flex-col items-center gap-5 text-center md:gap-6">
          {intro}
          <div className="pt-2 md:pt-4">
            <BillingToggle value={billing} onChange={setBilling} />
          </div>
        </div>
      </section>

      <section aria-label="Plans" className="px-5 pb-14 md:px-6 md:pb-24">
        <ul className="mx-auto grid max-w-content gap-5 md:gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <li key={plan.id}>
              <PricingCard plan={plan} billing={billing} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
