# PR_Demo_Devin

A sandbox repository for demoing Devin to clients. It covers two areas:

- **Devin PR features:** Devin Review (auto-review, bug catcher, security scan, auto-fix),
  stacked PRs, automations, PR authorship, drafts/merge/revert and the review API.
- **Figma-to-code:** Devin implements a Figma design inside this repo's existing web UI,
  reusing its components and design tokens. The repo is in the **"before" state**: the app
  exists, the pricing page does not. Devin builds it live at `src/app/pricing/page.tsx`.

## Demo guides

| Guide | What it covers |
| --- | --- |
| [`docs/DEMO_GUIDE.md`](docs/DEMO_GUIDE.md) | PR features, one section per client question, with the setting to open or prompt to run |
| [`docs/FIGMA_DEMO.md`](docs/FIGMA_DEMO.md) | Figma-to-code: the docs prompt with this repo's Figma file, pre-demo checklist, reset steps |

## Quick start

Requires Node 20+.

```bash
npm install
npm run dev        # web app at http://localhost:3000
npm run api        # task API at http://localhost:4000 (used by the PR-features demo)
npm run lint
npm run typecheck
npm test
npm run build
```

| URL | Page |
| --- | --- |
| <http://localhost:3000/> | Taskly home page (the app as it is today) |
| <http://localhost:3000/pricing> | 404 until Devin implements it from Figma |

## What's in the repo

```
src/app/                  Next.js App Router routes (layout.tsx, page.tsx, globals.css)
src/components/ui/        shared Button, Card, Badge (Tailwind)
src/components/layout/    SiteHeader (with mobile menu), SiteFooter, Logo
tailwind.config.ts        design tokens, mirroring the Figma "Tokens" variables
src/store.js              task API: in-memory persistence
src/service.js            task API: validation and business rules
src/http.js               task API: HTTP transport
test/                     node:test suites for the task API
```

Stack: Next.js 15, React 19, TypeScript, Tailwind CSS 3.

## Files that Devin reads

| File | Used by |
| --- | --- |
| `AGENTS.md` | Devin sessions: setup, branch/PR conventions, web UI rules, automation rules |
| `REVIEW.md` | Devin Review: review focus, conventions, ignore list |
| `CONTRIBUTING.md` | Devin Review (default instruction-file glob) |
| `.github/CODEOWNERS` | Code-owner shield in the Devin Review reviewer sidebar |
| `.github/pull_request_template.md` | PR descriptions |
| `.github/workflows/ci.yml` | Lint, type check, tests and build on every PR |
| `scripts/trigger-review.sh` | `POST /v3/organizations/{org_id}/pr-reviews` example |

## Source documentation

- https://docs.devin.ai/work-with-devin/devin-review
- https://docs.devin.ai/work-with-devin/stacked-prs
- https://docs.devin.ai/use-cases/gallery/figma-design-implementation
