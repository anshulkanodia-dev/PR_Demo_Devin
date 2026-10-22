import { cn } from '@/lib/cn';
import { CheckCircleGlyph } from './icons';
import { COMPARISON, PLANS, type ComparisonValue } from './plans';

const PRO_COLUMN = PLANS.findIndex((plan) => plan.highlighted);

function Value({ value }: { value: ComparisonValue }) {
  if (value === true) return <CheckCircleGlyph role="img" aria-label="Included" className="mx-auto text-primary" />;
  if (value === false)
    return (
      <span className="font-semibold text-ink-ghost">
        <span aria-hidden="true">—</span>
        <span className="sr-only">Not included</span>
      </span>
    );
  return <>{value}</>;
}

export function ComparisonTable() {
  return (
    <div
      role="region"
      aria-label="Plan comparison"
      tabIndex={0}
      className="overflow-x-auto max-md:rounded-lg max-md:border max-md:border-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <table className="w-full min-w-[520px] table-fixed border-separate border-spacing-0 whitespace-nowrap text-sm text-ink-body md:text-[15px]">
        <colgroup>
          <col className="w-[30%]" />
          <col className="w-[20.8%]" />
          <col className="w-[23.1%]" />
          <col />
        </colgroup>
        <thead>
          <tr className="h-14 text-sm font-bold md:h-[72px] md:text-base">
            <th scope="col" className="border-b border-line pl-4 pr-3 text-left text-ink md:px-6">
              <span className="md:hidden">Plans</span>
              <span className="max-md:hidden">Compare features</span>
            </th>
            {PLANS.map((plan, index) => (
              <th
                key={plan.id}
                scope="col"
                className={cn(
                  'border-b border-line px-3 text-center md:px-6',
                  index === PRO_COLUMN ? 'rounded-t-lg bg-primary-tint text-primary' : 'text-ink',
                )}
              >
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        {COMPARISON.map((group) => (
          <tbody key={group.title}>
            <tr className="h-12">
              <th
                scope="rowgroup"
                className="border-b border-line-subtle bg-canvas pl-4 pr-3 text-left text-[13px] md:px-6 font-bold uppercase tracking-[0.06em] text-ink-subtle"
              >
                {group.title}
              </th>
              {PLANS.map((plan, index) => (
                <td
                  key={plan.id}
                  className={cn('border-b border-line-subtle', index === PRO_COLUMN ? 'bg-primary-subtle' : 'bg-canvas')}
                />
              ))}
            </tr>
            {group.rows.map((row) => (
              <tr key={row.feature} className="h-[52px] md:h-14">
                <th scope="row" className="border-b border-line-subtle pl-4 pr-3 text-left font-normal md:px-6">
                  {row.feature}
                </th>
                {row.values.map((value, index) => (
                  <td
                    key={PLANS[index].id}
                    className={cn('border-b border-line-subtle px-3 text-center md:px-6', index === PRO_COLUMN && 'bg-primary-tint')}
                  >
                    <Value value={value} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
