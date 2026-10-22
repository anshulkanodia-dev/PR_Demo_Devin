# Figma-to-code demo

Live demo of [Figma design implementation](https://docs.devin.ai/use-cases/gallery/figma-design-implementation):
Devin reads a Figma frame, reuses this repo's components and Tailwind tokens, builds the page,
checks it in a browser at three viewports and opens a PR with screenshots.

The repo is in the **before** state: the Taskly app exists (`/`), the pricing page does not
(`/pricing` returns 404).

## Figma file

- File: https://www.figma.com/design/Gz6OAIvvHSLsHt7t4jTBPS
- Page **Marketing**, frame **Pricing Section** (1440px desktop). The same page also has
  **Pricing Section / Annual** (toggle on Annual, Pro at $23) and **Pricing Section / Mobile** (375px).
- Page **Components**: `Button`, `Badge`, `Feature Item`, `Billing Toggle`, `Pricing Card`, and the
  `Tokens` variable collection.

## What Devin will find in the repo

| The prompt says | Where it is |
| --- | --- |
| "Use our Tailwind config in `tailwind.config.ts`" | `tailwind.config.ts`: Figma colour and radius variables as Tailwind tokens. The dark Pro-card colours are deliberately missing, so Devin has to add them. |
| "Reuse the existing `Card` and `Button` components from `src/components/ui/`" | `src/components/ui/Button.tsx`, `Card.tsx` (plus `Badge.tsx`) |
| "a new route at `src/app/pricing/page.tsx`" | Does not exist yet. The nav already links to `/pricing`. |
| "spin up the dev server" | `npm run dev` → http://localhost:3000 |
| Checks before the PR | `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` (also run by CI) |

## The prompt

This is the prompt from the docs page, with only the Figma URL changed. Paste it into a new Devin
session with this repo selected.

```text
Implement the pricing page from this Figma file:
https://www.figma.com/design/Gz6OAIvvHSLsHt7t4jTBPS

Focus on the "Pricing Section" frame on the "Marketing" page. It has:
- A heading + subheading block
- 3 pricing tier cards (Free, Pro, Enterprise) with feature lists
- A comparison table below the cards
- Mobile layout: cards stack vertically, table becomes scrollable

Use our Tailwind config in tailwind.config.ts for colors and spacing.
Reuse the existing Card and Button components from src/components/ui/.
The page should be a new route at src/app/pricing/page.tsx.

After implementing, spin up the dev server and verify the result:
- Take full-page screenshots at desktop (1440px), tablet (768px),
  and mobile (375px) viewports
- Record a screen recording scrolling through the page and
  interacting with hover states
- Share the screenshots and recording with me in the session
- Attach them to the PR so reviewers can see the visual result
- Do not open the PR until the implementation matches the Figma design
```

## Before the call

1. Figma is connected for the org (Settings → MCP / Integrations → Figma, OAuth) and the
   account can open the file above.
2. `main` is in the before state: `src/app/pricing/` does not exist and `/pricing` is a 404.
3. Optional: run `npm install && npm run dev` locally to show "the app today" at
   http://localhost:3000.
4. Have a finished run ready as a backup (a previous session and its PR) in case the live run is slow.

## During the demo

| Script stage | What to point at in the session |
| --- | --- |
| 1. Read design | Devin calls the Figma MCP tools on the "Pricing Section" frame: layout, text, variables |
| 2. Read codebase | Devin opens `tailwind.config.ts`, `src/components/ui/`, `src/app/layout.tsx`, `AGENTS.md` |
| 3. Implement | New `src/app/pricing/page.tsx`; reuses `Card`/`Button`; adds the missing dark-card tokens |
| 4. Validate | `npm run dev`, screenshots at 1440 / 768 / 375, recording, comparison with Figma |
| 5. Deliver | Lint, type check, tests, build; PR with the screenshots; Devin Review on the PR |

## Resetting after a demo

Close the demo PR without merging (or delete its branch). `main` stays in the before state.
If a run was merged by mistake, revert that PR's merge commit.
