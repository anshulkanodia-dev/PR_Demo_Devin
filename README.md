# PR_Demo_Devin

A sandbox repository for demoing Devin's PR features end to end: Devin Review
(auto-review, bug catcher, security scan, auto-fix), stacked PRs, automations, PR
authorship, drafts/merge/revert, and the review API.

**Start here: [`docs/DEMO_GUIDE.md`](docs/DEMO_GUIDE.md)** — one section per question
from the source Q&A doc, with the exact setting to open or prompt to run.

**Figma-to-code demo:** [`docs/FIGMA_DEMO.md`](docs/FIGMA_DEMO.md). To view the pricing page locally
or on GitHub Pages, see [`docs/HOSTING.md`](docs/HOSTING.md).

## The app

A deliberately tiny task tracker, layered so that a change can be split into a stack:

```
src/store.js    in-memory persistence
src/service.js  validation and business rules
src/http.js     HTTP transport
src/cli.js      command-line consumer
```

```bash
npm run lint
npm test
```

No dependencies; Node 20+.

## Repo files that Devin reads

| File | Used by |
| --- | --- |
| `REVIEW.md` | Devin Review — review focus, conventions, ignore list |
| `AGENTS.md` | Devin sessions — setup, branch/PR conventions, automation rules |
| `CONTRIBUTING.md` | Devin Review (default instruction-file glob) |
| `.github/CODEOWNERS` | Code-owner shield in the Devin Review reviewer sidebar |
| `.github/pull_request_template.md` | PR descriptions |
| `.github/workflows/ci.yml` | Per-layer readiness dots on stacked PRs |
| `scripts/trigger-review.sh` | `POST /v3/organizations/{org_id}/pr-reviews` example |

## Source documentation

- https://docs.devin.ai/work-with-devin/devin-review
- https://docs.devin.ai/work-with-devin/stacked-prs
- https://docs.google.com/document/d/1iCb3vlLMh28MQokOjmEc_4_EvFhPxrMFqBGycwz6994/edit
