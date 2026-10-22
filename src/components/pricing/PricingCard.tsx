import { Badge, Button, Card } from '@/components/ui';
import { cn } from '@/lib/cn';
import { CheckGlyph, PlanGlyph } from './icons';
import { planPrice, type Billing, type Plan } from './plans';

export function PricingCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const inverse = Boolean(plan.highlighted);
  const price = planPrice(plan, billing);
  const custom = price.period === undefined;

  return (
    <Card
      tone={inverse ? 'inverse' : 'default'}
      size="lg"
      aria-labelledby={`plan-${plan.id}`}
      className={cn('h-full transition duration-200 hover:-translate-y-1', inverse ? 'hover:shadow-popular' : 'shadow-xs hover:shadow-lg')}
    >
      <div className="flex items-center justify-between">
        <span className={cn('grid size-11 place-items-center rounded-tile', inverse ? 'bg-primary text-on-primary' : 'bg-primary-subtle text-primary')}>
          <PlanGlyph icon={plan.icon} />
        </span>
        {plan.highlighted && (
          <Badge tone="solid" size="lg" bold>
            ★ Most popular
          </Badge>
        )}
      </div>

      <div>
        <h3 id={`plan-${plan.id}`} className={cn('text-xl font-bold leading-7', inverse ? 'text-on-primary' : 'text-ink')}>
          {plan.name}
        </h3>
        <p className={cn('pt-1 text-[15px] leading-[22px]', inverse ? 'text-inverse-ink' : 'text-ink-muted')}>{plan.description}</p>
      </div>

      <div aria-live="polite">
        <p className="flex items-end gap-1.5">
          <span
            className={cn(
              'font-extrabold tracking-[-0.04em]',
              custom ? 'text-[44px] leading-[50px] md:leading-[56px]' : 'text-[46px] leading-[50px] md:text-[52px] md:leading-[56px]',
              inverse ? 'text-on-primary' : 'text-ink',
            )}
          >
            {price.amount}
          </span>
          {price.period && (
            <span className={cn('pb-1.5 text-[15px] leading-6', inverse ? 'text-inverse-muted' : 'text-ink-subtle')}>
              {price.period}
            </span>
          )}
        </p>
        <p className={cn('pt-1.5 text-[13px] leading-4', inverse ? 'text-inverse-muted' : 'text-ink-subtle')}>{price.note}</p>
      </div>

      <Button href={plan.cta.href} variant={plan.cta.variant} size="base" fullWidth>
        {plan.cta.label}
      </Button>

      <hr className={inverse ? 'border-inverse-line' : 'border-line'} />

      <p className={cn('text-[13px] font-semibold uppercase leading-4 tracking-[0.06em]', inverse ? 'text-inverse-muted' : 'text-ink-subtle')}>
        {plan.featuresTitle}
      </p>

      <ul className="flex flex-col gap-3.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <span className={cn('grid size-5 shrink-0 place-items-center rounded-full', inverse ? 'bg-primary text-on-primary' : 'bg-primary-subtle text-primary')}>
              <CheckGlyph />
            </span>
            <span className={cn('text-[15px] leading-[22px]', inverse ? 'text-inverse-ink' : 'text-ink-body')}>{feature}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
