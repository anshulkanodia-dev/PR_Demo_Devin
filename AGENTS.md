# AGENTS.md

Conventions for Devin (and any other coding agent) working in this repository.

## Setup

Node 20+ is required.

```bash
npm install
npm run lint
npm run typecheck
npm test
```

All three checks must pass before opening or updating a PR.

## Branches and PRs

- Branch naming: `devin/<unix-timestamp>-<short-description>`.
- Base branch is `main`. Never push directly to `main`.
- PR titles: imperative mood, no ticket prefix (e.g. "Add owner filter to task list").
- PR descriptions follow `.github/pull_request_template.md`.
- Split work into a stack when a change has clear ordered layers (storage → service →
  transport). Keep it a single PR otherwise.

## Code style

- ES modules, 2-space indent, single quotes, semicolons.
- Prefer pure functions; keep I/O at the edges (`src/http.js`).
- No new runtime dependencies without justification in the PR description.

## Web UI

- Next.js (App Router) + React + TypeScript + Tailwind CSS. Routes live in `src/app/`
  (`src/app/<route>/page.tsx`).
- Shared UI components: `src/components/ui/` (`Button`, `Card`, `Badge`). Reuse them; extend them
  with a new prop or variant rather than restyling them per page.
- Layout: `src/components/layout/` (`SiteHeader`, `SiteFooter`) is rendered by `src/app/layout.tsx`
  on every page.
- Design tokens: `tailwind.config.ts`, mirroring the Figma "Tokens" variables. Use the token
  classes (`bg-primary`, `text-ink-muted`, `border-line`, ...) and the default spacing scale; never
  hard-code a colour. Add missing tokens to `tailwind.config.ts`.
- Run locally: `npm run dev`, then open `http://localhost:3000/`.

## Automations

- Issue comments starting with `/devin` are the agreed trigger phrase for GitHub-issue
  automations against this repo. See `docs/DEMO_GUIDE.md`.
- Automations must ignore pushes authored by `devin-ai-integration[bot]` to avoid
  `synchronize` loops.
