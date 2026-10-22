# AGENTS.md

Conventions for Devin (and any other coding agent) working in this repository.

## Setup

No dependencies to install. Node 20+ is required.

```bash
npm run lint
npm test
```

Both commands must pass before opening or updating a PR.

## Branches and PRs

- Branch naming: `devin/<unix-timestamp>-<short-description>`.
- Base branch is `main`. Never push directly to `main`.
- PR titles: imperative mood, no ticket prefix (e.g. "Add owner filter to task list").
- PR descriptions follow `.github/pull_request_template.md`.
- Split work into a stack when a change has clear ordered layers (storage → service →
  transport). Keep it a single PR otherwise.

## Code style

- ES modules, 2-space indent, single quotes, semicolons.
- Prefer pure functions; keep I/O at the edges (`src/http.js`, `src/cli.js`).
- No new runtime dependencies without justification in the PR description.

## Web UI

- Pages live in `public/` and are served by `src/static.js` (register new routes in `PAGES`).
- Shared components: `public/ui/components/` (`Button`, `Card`, `Badge`). Reuse them; don't
  restyle them per page.
- Design tokens: `public/ui/styles/tokens.css`. Names mirror the Figma variables
  (`color/primary` -> `--color-primary`). Never hard-code a colour that has a token.
- Page-specific code: `public/ui/pages/<page>.js` and `<page>.css`. Keep render helpers pure and
  exported so they can be unit-tested in `test/ui.test.js`.
- Run locally: `npm start` (or `PORT=4000 npm start`), then open `http://localhost:3000/` and
  `http://localhost:3000/pricing`.

## Automations

- Issue comments starting with `/devin` are the agreed trigger phrase for GitHub-issue
  automations against this repo. See `docs/DEMO_GUIDE.md`.
- Automations must ignore pushes authored by `devin-ai-integration[bot]` to avoid
  `synchronize` loops.
