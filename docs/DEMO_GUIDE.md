# Devin PR Feature Demo Guide

Every section maps to one question from the source Q&A doc, and says exactly what to
click or prompt in this repository. Setup steps that must be done once are marked
**(one-time)**.

Source docs: [Devin Review](https://docs.devin.ai/work-with-devin/devin-review) ·
[Stacked PRs](https://docs.devin.ai/work-with-devin/stacked-prs)

---

## Seeded PRs

| PR | Role in the demo |
| --- | --- |
| [#12](https://github.com/anshulkanodia-dev/PR_Demo_Devin/pull/12) | Stack layer 1 — reset to the scaffold state (merged) |
| [#13](https://github.com/anshulkanodia-dev/PR_Demo_Devin/pull/13) | Stack layer 2 — service layer (merged) |
| [#14](https://github.com/anshulkanodia-dev/PR_Demo_Devin/pull/14) | Stack layer 3 — HTTP transport (merged) |
| [#16](https://github.com/anshulkanodia-dev/PR_Demo_Devin/pull/16) | Deliberately defective — bug catcher, security scan, auto-fix. Based on #14's branch but **not** in the stack, which is itself worth showing. Do not merge. |

Stack #15 grouped PRs #12 → #13 → #14; it has been merged bottom-up, so a fresh stack
needs to be created before demoing the stack UI again (see section 4).

To reset the repo for another run: revert `main` to the scaffold commit, close the open
fixture PR, delete the stale branches, then recreate the layers and the fixture.

---

## 0. One-time repository setup

| Step | Where | Why |
| --- | --- | --- |
| Install the Devin **GitHub App** on `anshulkanodia-dev` with this repo selected, with Contents, Pull Requests, Commit Statuses and Issues write | GitHub org settings | PAT connections are read-only: no comments, reviews, merges or auto-fix |
| Add `anshulkanodia-dev/PR_Demo_Devin` under **Settings → Review → Repositories** | [app.devin.ai/settings/review](https://app.devin.ai/settings/review) | Enables auto-review on every PR here |
| Set your personal trigger under **Settings → Preferences → Devin Review** | [app.devin.ai/settings/preferences](https://app.devin.ai/settings/preferences) | Demonstrates self-enrollment; most permissive of repo/user mode wins |
| Enable branch protection on `main` requiring the `check` CI job | GitHub repo settings | Makes per-layer readiness dots in the stack panel meaningful |
| Turn on **Auto-fix** (Settings → Customization → Pull requests → Responding to bots → allow `devin-ai-integration[bot]`) | [app.devin.ai/customization](https://app.devin.ai/customization) | Lets Devin propose fixes for its own findings |

The repo already ships the pieces Devin Review reads on its own: `REVIEW.md`,
`AGENTS.md`, `CONTRIBUTING.md`, `.github/CODEOWNERS`,
`.github/pull_request_template.md`, and a CI workflow that can be made to fail on demand.

---

## 1. Update a PR title/description, fix CI, conflicts, and review comments

**Demo:**

1. Open a PR from this repo (any of the seeded ones).
2. In a Devin session, prompt with the PR URL explicitly:
   > Update the title and description of `<pr-url>` to match the changes, then make CI
   > pass and resolve any merge conflicts and review comments.
3. Break CI on purpose first so there is something to fix: on the PR branch, change an
   assertion in `test/store.test.js` (e.g. expect `first.id` to be `2`) and push. The
   `check` job fails, Devin sees the failure and fixes it.
4. Create a conflict on purpose: edit the same line of
   `docs/demo/conflict-playground.md` on both `main` and the PR branch. Devin resolves
   it in-session.
5. Leave a review comment on the PR and ask Devin to address it in the same session.

**Talking points:** the session must be attached to the PR head branch and have push
access; iterate in the same session; codify repeated workflows in a Playbook or in
`AGENTS.md` / `REVIEW.md` (both already present here).

---

## 2. Auto-review, trigger modes, cost control

**Demo:**

1. Show **Settings → Review → Repositories** with this repo added, and switch its
   trigger mode between **Auto review** and **On PR creation**.
2. Open a draft PR — no review runs. Mark it ready — the review fires.
3. Push a commit: with **Auto review** a new review runs; with **On PR creation** it
   does not.
4. Open the three-dot menu on the Devin Review page and toggle auto-review off for that
   single PR — this is the workaround for noisy `master merge` / bulk-sync PRs, since
   there is no title-based exclusion.
5. Show the consumption pill (XS…XL) in the PR header and hover it for exact ACUs and
   the number of review jobs.
6. Show **Settings → Review → Auto-review limits** and set a per-PR spend cap; once
   reached, auto-review pauses for that PR but manual review still works.

**Oversized diffs:** if a review reports the diff exceeds the analysis size limit,
split the work — which is exactly what the stack in section 4 shows.

---

## 3. Trigger a review from the API (and why you get a 404)

```bash
DEVIN_API_KEY=<service-user-token> DEVIN_ORG_ID=<org-id> \
  ./scripts/trigger-review.sh https://github.com/anshulkanodia-dev/PR_Demo_Devin/pull/<n>
```

- Use a **service user** token, not a personal PAT.
- The service user needs **UseReviewManual** on the org (or the enterprise, for
  `POST /v3/enterprise/pr-reviews`; pass `DEVIN_SCOPE=enterprise`).
- **404** → org/repo not connected, service user not in the org, or permission missing.
  **401** → token missing/invalid/expired.
- Demo the failure first with a PAT, then succeed with the service user: that contrast
  is the whole answer.

---

## 4. Stacked PRs

The seeded stack in this repo is three layers, bottom-up:

1. **service layer** (`src/service.js`) — validation and business rules over the store.
2. **HTTP transport** (`src/http.js`) — routes on top of the service.
3. **CLI** (`src/cli.js`) — a second consumer of the same service.

**Demo:**

- Open the bottom PR in Devin Review and show the **stack panel**: every member ordered
  bottom-to-top with per-layer readiness dots (green = actually mergeable, red = failing
  CI or conflicts, orange = blocked by a layer below).
- Show that each PR diffs only against the layer below it, so reviews and the bug
  catcher see one focused change.
- Show the merge button label — merging a layer lands it *and* every open layer below
  it atomically, then GitHub retargets the rest onto `main`.
- Ask Devin in-session to *add a follow-up PR to the top of the stack*, to *report stack
  status*, or to *unstack* (the PRs become independent again; merged layers stay merged).

**Constraints to state:** GitHub.com only (not GHES/GitLab), 2–100 PRs per stack, and
stacked PRs cannot be merged through GitHub's regular merge flow.

---

## 5. Bug catcher, security scanning, auto-fix

A dedicated PR seeds findings on purpose — a token comparison that leaks timing, a
hardcoded fallback secret, an unvalidated `limit` used for slicing, and an error handler
that returns a stack trace to the client.

**Demo:**

1. Open that PR in Devin Review and walk the Analysis sidebar: **Bugs** (severe vs
   non-severe), **Flags** (investigate vs informational), **Security** (critical vs
   warning, with CWE ids).
2. Point at `REVIEW.md` — the `src/auth/` and `src/http.js` rules are why the scanner
   focuses there.
3. Mark a finding resolved and show it dim and sort to the bottom.
4. With auto-fix enabled, apply a suggested fix and show the commit landing as the
   Devin bot.
5. Show **Settings → Review → Post as PR comments** toggles (bugs, security, flags,
   CI check) and the resulting GitHub comments/status check.

---

## 6. Automations on issues and PRs, without runaway runs

**Demo (configure in Settings → Automations):**

- **Issue comment** trigger with a `starts_with "/devin"` condition — open an issue from
  `.github/ISSUE_TEMPLATE/devin-task.md` and comment `/devin add a DELETE route`.
- **PR opened / ready_for_review** trigger rather than all PR events, to avoid firing on
  every `synchronize`.
- Loop protection: add an invocation limit, and a condition ignoring pushes authored by
  `devin-ai-integration[bot]` — otherwise an automation that pushes to the PR retriggers
  itself.
- Filtering sync PRs: there is no built-in title exclusion; use a `title does not
  contain "master merge"` condition where the payload supports it.

---

## 7. PR authorship

- **Settings → "Open PRs as"**: `devin` (always the bot), `user` (the requester if their
  Git account is linked, else the bot), `user_only` (strictly the user; fails when not
  linked, and automations/service users fall back to the bot).
- Demo by flipping the setting and opening a trivial PR from this repo under each mode.
- For Slack-triggered sessions, the Slack user must be linked to the right Devin/Git
  user or the PR is authored by the bot.
- Wrong co-author lines come from the prompt or repo convention — `AGENTS.md` here
  intentionally does not add co-authors.

---

## 8. Drafts, merging, reverting, merging several PRs

- **Drafts:** enable "Open pull requests as drafts" as a personal preference or the
  org-level "Always open PRs as drafts" setting; from the Devin Review merge bar,
  convert to draft or mark ready.
- **Merge / auto-merge:** use the merge bar (merge, close, toggle auto-merge). Requires
  the GitHub App connection.
- **Revert:** prompt `Create a revert PR for <pr-url>`.
- **Several PRs at once:** stacked PRs merge together ("Merge {count}"). Unrelated PRs
  have no bulk merge — merge one at a time, or create an integration branch, merge each
  into it, and open one PR.

---

## 9. Billing and refunds

- Review usage is a separate **Review** line in **Settings → Consumption**, with
  per-user and per-repo breakdowns; for Enterprise it does not count against per-org
  session ACU limits.
- Disabling "Post as PR comments" does not stop already-queued jobs — remove the repo
  from Settings → Review and disable user enrollment to stop future ones.
- No self-service refunds: collect the time range, affected PRs/sessions, the settings
  in force at the time, and dashboard screenshots, then contact support@cognition.ai.

---

## 10. Non-GitHub providers, and audit records

- **GitLab:** configure the webhook, otherwise mentions and MR events rely on polling
  (up to daily for self-managed). Write actions on Self-Managed GitLab need the GitLab
  App.
- **Bitbucket / Azure DevOps:** no Devin Review diff analysis, bug catcher, or chat.
  Bitbucket PR creation needs a service account with workspace read/write; review
  comments are limited.
- **Audit:** no signed third-party record. Use enterprise audit logs, Git commit
  signing, and your own webhook → SIEM pipeline.

---

## 11. Repository selector shows unexpected repos

Check, in order: the GitHub App installation's repository selection, whether Devin's
repo list has re-synced, and (enterprise) **Enterprise Settings → Repository
Permissions** delegation. A repo that is visible but not clonable/writable means the App
is missing Contents / Pull Requests / Commit Statuses / Issues permissions.

---

## 12. Figma, dependency questions, upgrades

Prompt patterns to demo against any PR in this repo:

- `Compare the UI in <pr-url> against <figma-link> and fix the differences.`
- `Which files depend on src/store.js in <pr-url>?`
- `Research upgrading to Node 22, run the test suite, and report the risks before changing anything.`
