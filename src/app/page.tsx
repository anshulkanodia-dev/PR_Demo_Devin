import { Badge, Button, Card } from '@/components/ui';

const FEATURES = [
  {
    title: 'Boards that stay in sync',
    body: 'Every change shows up for the whole team in real time, on web and mobile.',
  },
  {
    title: 'Plans you can trust',
    body: 'Owners, due dates and tags keep every project clear without extra meetings.',
  },
  {
    title: 'Insights when you need them',
    body: 'See what shipped, what slipped and where the team is spending its time.',
  },
];

export default function HomePage() {
  return (
    <>
      <section className="bg-gradient-to-b from-canvas to-surface">
        <div className="mx-auto flex max-w-content flex-col items-center gap-6 px-6 pb-20 pt-24 text-center">
          <Badge>New: real-time sync for every board</Badge>
          <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight md:text-6xl">
            Plan, track and ship work <span className="text-primary">with your team</span>
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-ink-muted">
            Taskly brings every task, owner and deadline into one place, so your team spends less time
            chasing updates and more time shipping.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button>Start free</Button>
            <Button variant="secondary" href="/pricing">
              See pricing
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="features" className="mx-auto max-w-content px-6 pb-24">
        <h2 id="features" className="sr-only">
          Features
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="leading-7 text-ink-muted">{feature.body}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
