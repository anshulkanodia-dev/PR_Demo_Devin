# Figma-to-code demo

Use case: <https://docs.devin.ai/use-cases/gallery/figma-design-implementation>

Devin implements an approved Figma design inside this repo's existing UI. It reuses the shared
components and tokens, checks the result in a browser at three widths, runs the checks and opens
a PR for human review.

## Before the demo

1. Check that the Figma MCP integration is connected and authorised for the org, and that the
   file below opens.
2. Start a Devin session on `main`, which must include the web UI scaffold.
3. Keep the finished run (the pricing PR) open in a tab as a backup.

## Assets

| What | Link |
| --- | --- |
| Figma file | <https://www.figma.com/design/Gz6OAIvvHSLsHt7t4jTBPS> |
| Desktop frame (1440) | <https://www.figma.com/design/Gz6OAIvvHSLsHt7t4jTBPS?node-id=15-36> |
| Desktop, annual state | <https://www.figma.com/design/Gz6OAIvvHSLsHt7t4jTBPS?node-id=16-36> |
| Mobile frame (375) | <https://www.figma.com/design/Gz6OAIvvHSLsHt7t4jTBPS?node-id=17-36> |
| Components page | `Button`, `Badge`, `Feature Item`, `Billing Toggle`, `Pricing Card` + `Tokens` variables |

## Prompt to paste into Devin

```text
Implement the pricing page from this Figma design in anshulkanodia-dev/PR_Demo_Devin:

Desktop: https://www.figma.com/design/Gz6OAIvvHSLsHt7t4jTBPS?node-id=15-36
Annual state: https://www.figma.com/design/Gz6OAIvvHSLsHt7t4jTBPS?node-id=16-36
Mobile: https://www.figma.com/design/Gz6OAIvvHSLsHt7t4jTBPS?node-id=17-36

Requirements:
- Serve it at /pricing: add the route to PAGES in src/static.js, the page to public/pricing.html,
  and the code to public/ui/pages/pricing.js + pricing.css.
- Reuse Button, Card and Badge from public/ui/components/ and the tokens in
  public/ui/styles/tokens.css. Extend a shared component only if the design needs a new variant.
- The Monthly/Annual toggle must work and be keyboard accessible. Annual shows Pro at $23/month.
- Responsive at 1440, 768 and 375px, following the Implementation Notes frame in Figma.
- Export pure render helpers and add tests in test/pricing.test.js.
- Run the server (see AGENTS.md "Web UI"), screenshot /pricing at 1440/768/375, compare with the
  Figma frames and fix differences before opening the PR.
- npm run lint and npm test must pass. Open a PR with the screenshots in the description.
```

## Talk track while Devin works

- Devin reads the frames, variables and components through the Figma MCP, not from a screenshot.
- It reads `AGENTS.md` and the existing components before writing any code.
- It builds the page, checks it in a browser at each breakpoint and iterates on differences.
- It runs lint and tests and opens a PR that the team reviews as usual.

If the live run takes longer than the slot allows, switch to the finished pricing PR.
