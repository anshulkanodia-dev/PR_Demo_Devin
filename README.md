# PR_Demo_Devin

A sandbox repository for demoing Devin to clients. It covers two areas:

- **Devin PR features:** Devin Review (auto-review, bug catcher, security scan, auto-fix),
  stacked PRs, automations, PR authorship, drafts/merge/revert and the review API.
- **Figma-to-code:** Devin implements a Figma design inside this repo's existing web UI,
  reusing its components and design tokens.

## Demo guides

| Guide | What it covers |
| --- | --- |
| [`docs/DEMO_GUIDE.md`](docs/DEMO_GUIDE.md) | PR features, one section per client question, with the setting to open or prompt to run |
| [`docs/FIGMA_DEMO.md`](docs/FIGMA_DEMO.md) | Figma-to-code: Figma links, the prompt to paste into Devin, and a talk track |
| [`docs/HOSTING.md`](docs/HOSTING.md) | Viewing the pricing page locally or on GitHub Pages |

## Quick start

Requires Node 20+. There are no dependencies to install.

```bash
npm start        # http://localhost:3000 (use PORT=4000 npm start for another port)
npm run lint
npm test
```

| URL | Page |
| --- | --- |
| <http://localhost:3000/pricing> | Pricing page built from the Figma design (static) |
| <http://localhost:3000/> | Task Board, backed by the `/tasks` API |

## What's in the repo

A deliberately small task tracker, layered so that a change can be split into a stack, plus a
dependency-free web UI:

```
src/store.js          in-memory persistence
src/service.js        validation and business rules
src/http.js           HTTP transport (API routes + static pages)
src/static.js         page routes (PAGES) and safe static file serving
src/cli.js            command-line consumer
public/index.html     Task Board page
public/pricing.html   pricing page
public/ui/components  shared Button, Card, Badge
public/ui/styles      design tokens (mirroring the Figma variables) and base styles
public/ui/pages       page-specific code and styles
test/                 node:test suites
```

## Files that Devin reads

| File | Used by |
| --- | --- |
| `AGENTS.md` | Devin sessions: setup, branch/PR conventions, web UI rules, automation rules |
| `REVIEW.md` | Devin Review: review focus, conventions, ignore list |
| `CONTRIBUTING.md` | Devin Review (default instruction-file glob) |
| `.github/CODEOWNERS` | Code-owner shield in the Devin Review reviewer sidebar |
| `.github/pull_request_template.md` | PR descriptions |
| `.github/workflows/ci.yml` | Lint and tests on every PR (per-layer readiness dots on stacked PRs) |
| `.github/workflows/pages.yml` | Manual GitHub Pages deploy of the pricing page |
| `scripts/trigger-review.sh` | `POST /v3/organizations/{org_id}/pr-reviews` example |

## Source documentation

- https://docs.devin.ai/work-with-devin/devin-review
- https://docs.devin.ai/work-with-devin/stacked-prs
- https://docs.devin.ai/use-cases/gallery/figma-design-implementation
