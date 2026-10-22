import type { Metadata } from 'next';
import { ComparisonTable, CUSTOMER_LOGOS, FAQS, PricingPlans } from '@/components/pricing';
import { Badge, Button, Card } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Pricing · Taskly',
  description: 'Simple pricing that grows with your team. Start free and upgrade when you’re ready.',
};

const SECTION = 'px-5 pb-14 md:px-6 md:pb-24';
const SECTION_HEADING = 'text-[30px] font-extrabold leading-[38px] tracking-[-0.03em] text-ink md:text-[40px] md:leading-[48px]';

export default function PricingPage() {
  return (
    <>
      <PricingPlans
        intro={
          <>
            <p className="inline-flex h-8 items-center gap-2 rounded-full border border-primary-ring bg-surface pl-1.5 pr-3.5 shadow-xs">
              <Badge size="sm">New</Badge>
              <span className="text-[13px] font-medium leading-4 text-ink-muted">Annual plans now save 20%</span>
            </p>
            <h1 className="max-w-[820px] text-[38px] font-extrabold leading-[44px] tracking-[-0.035em] text-ink md:text-[60px] md:leading-[68px]">
              Simple pricing that <span className="text-primary">grows with your team</span>
            </h1>
            <p className="max-w-[640px] text-base leading-[25px] text-ink-muted md:text-[19px] md:leading-[30px]">
              Start free and upgrade when you’re ready. Every plan includes unlimited tasks, real-time sync and a
              14-day Pro trial.
            </p>
          </>
        }
      />

      <section aria-label="Customers" className={SECTION}>
        <div className="mx-auto flex max-w-content flex-col items-center gap-5 md:gap-7">
          <p className="text-sm font-medium leading-[17px] text-ink-subtle">Trusted by 4,000+ product teams</p>
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-5 md:gap-x-[72px]">
            {CUSTOMER_LOGOS.map((name) => (
              <li key={name} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-[22px] rounded-sm bg-ink-ghost" />
                <span className="text-lg font-extrabold leading-[22px] tracking-[-0.02em] text-ink-faint md:text-[22px] md:leading-[27px]">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="compare" className={SECTION}>
        <div className="mx-auto flex max-w-content flex-col gap-7 md:gap-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 id="compare" className={SECTION_HEADING}>
              Compare plans
            </h2>
            <p className="text-[15px] leading-[23px] text-ink-muted md:text-[17px] md:leading-[26px]">Every feature, side by side.</p>
          </div>
          <ComparisonTable />
          <p className="text-center text-[13px] leading-4 text-ink-subtle md:hidden">Swipe to compare all plans →</p>
        </div>
      </section>

      <section aria-labelledby="faq" className={SECTION}>
        <div className="mx-auto flex max-w-content flex-col gap-7 md:gap-10">
          <h2 id="faq" className={`${SECTION_HEADING} text-center`}>
            Frequently asked questions
          </h2>
          <dl className="grid gap-3 md:grid-cols-2 md:gap-5">
            {FAQS.map((faq) => (
              <Card key={faq.question} size="sm" className="transition-colors hover:border-primary-ring">
                <dt className="text-[17px] font-semibold leading-[26px] text-ink">{faq.question}</dt>
                <dd className="text-[15px] leading-6 text-ink-muted">{faq.answer}</dd>
              </Card>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="cta" className="px-5 pb-12 md:px-6 md:pb-24">
        <div className="mx-auto flex max-w-content flex-col gap-7 rounded-[24px] bg-primary px-6 py-9 text-center md:flex-row md:items-center md:justify-between md:rounded-2xl md:p-16 md:text-left">
          <div>
            <h2 id="cta" className="text-[28px] font-extrabold leading-[34px] tracking-[-0.03em] text-on-primary md:text-[36px] md:leading-[44px]">
              Ready to move faster?
            </h2>
            <p className="pt-2 text-[17px] leading-[26px] text-primary-soft">
              Join thousands of teams planning their work in Taskly.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button href="#" variant="inverse" size="base">
              Start free trial
            </Button>
            <Button href="#" variant="outline-inverse" size="base">
              Talk to sales
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
