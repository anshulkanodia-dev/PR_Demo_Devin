# Contributing

This repository is a sandbox for demonstrating Devin's PR workflows. It is intentionally
small so that diffs stay readable during a live demo.

## Local checks

```bash
npm run lint   # syntax check of src/, test/, scripts/
npm test       # node:test suite
```

## Layout

| Path                  | Purpose                                              |
| --------------------- | ---------------------------------------------------- |
| `src/store.js`        | In-memory persistence (bottom layer)                  |
| `src/service.js`      | Validation and business rules                         |
| `src/http.js`         | HTTP transport                                        |
| `docs/DEMO_GUIDE.md`  | Step-by-step demo script for every Devin PR feature   |
| `scripts/`            | Lint helper and the Devin Review API trigger example  |

## Review expectations

Reviewers (human or Devin) follow `REVIEW.md`. Agents additionally follow `AGENTS.md`.
