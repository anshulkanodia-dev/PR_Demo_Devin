#!/usr/bin/env bash
# Trigger a Devin Review run on a PR from the API.
#
# Requirements (see docs/DEMO_GUIDE.md):
#   - DEVIN_API_KEY must belong to a *service user*, not a personal access token.
#   - That service user needs the UseReviewManual permission on the org (or the
#     enterprise, if you use the /v3/enterprise/pr-reviews endpoint).
#   - DEVIN_ORG_ID must be the org that owns the repo.
#
# A 404 means the org/repo is not connected, the service user is not a member of
# the org, or UseReviewManual is missing. A 401 means the token is invalid.
#
# Usage:
#   DEVIN_API_KEY=... DEVIN_ORG_ID=org-... ./scripts/trigger-review.sh <pr-url>
#   DEVIN_SCOPE=enterprise DEVIN_API_KEY=... ./scripts/trigger-review.sh <pr-url>

set -euo pipefail

PR_URL="${1:-}"
BASE_URL="${DEVIN_BASE_URL:-https://api.devin.ai}"
SCOPE="${DEVIN_SCOPE:-organization}"

if [[ -z "$PR_URL" ]]; then
  echo "usage: $0 <pr-url>" >&2
  exit 2
fi

if [[ -z "${DEVIN_API_KEY:-}" ]]; then
  echo "DEVIN_API_KEY is not set" >&2
  exit 2
fi

if [[ "$SCOPE" == "enterprise" ]]; then
  ENDPOINT="$BASE_URL/v3/enterprise/pr-reviews"
else
  if [[ -z "${DEVIN_ORG_ID:-}" ]]; then
    echo "DEVIN_ORG_ID is not set (required for organization scope)" >&2
    exit 2
  fi
  ENDPOINT="$BASE_URL/v3/organizations/$DEVIN_ORG_ID/pr-reviews"
fi

curl --fail-with-body -sS -X POST "$ENDPOINT" \
  -H "Authorization: Bearer $DEVIN_API_KEY" \
  -H 'Content-Type: application/json' \
  -d "{\"pr_url\": \"$PR_URL\"}"
