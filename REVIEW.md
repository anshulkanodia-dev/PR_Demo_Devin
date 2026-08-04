# Review Guidelines

Devin Review ingests this file automatically (`**/REVIEW.md`) and uses it as context
for every review on this repository.

## Critical areas

- `src/auth/` — any change to token parsing, comparison, or session handling must be
  reviewed for auth bypass and timing attacks.
- `src/http.js` — request handlers must validate and coerce all untrusted input before
  it reaches the service layer.
- `.github/workflows/` — workflow changes must not expose `secrets.*` to
  `pull_request_target` or to steps that run untrusted PR code.

## Conventions

- ES modules only; no CommonJS `require`.
- Every exported function needs at least one test in `test/`.
- Never log request bodies, tokens, or anything derived from a secret.
- Errors surfaced to HTTP clients must not include stack traces.
- No new runtime dependencies without a note in the PR description explaining why.

## Ignore

- `docs/**` is prose only — skip style nits there.
- `package-lock.json` can be skipped unless dependency versions changed.

## Performance

- Flag O(n) scans over the task store inside request handlers.
- Flag any work done per-request that could be hoisted to module scope.
