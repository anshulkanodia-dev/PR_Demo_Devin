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

## Automations

- Issue comments starting with `/devin` are the agreed trigger phrase for GitHub-issue
  automations against this repo. See `docs/DEMO_GUIDE.md`.
- Automations must ignore pushes authored by `devin-ai-integration[bot]` to avoid
  `synchronize` loops.
