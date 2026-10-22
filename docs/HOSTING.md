# Hosting the pricing page

The pricing page (`public/pricing.html`) is fully static, so it can be hosted on
GitHub Pages. The Task Board page (`public/index.html`) calls the `/tasks` API, so it
only works when the Node server is running (locally).

## Option A: run locally (everything works)

Requires Node 20+. There are no dependencies to install.

```bash
git clone https://github.com/anshulkanodia-dev/PR_Demo_Devin.git
cd PR_Demo_Devin
npm start        # PORT=4000 npm start for another port
```

Then open:

- Pricing page: <http://localhost:3000/pricing>
- Task Board: <http://localhost:3000/>

Stop the server with `Ctrl+C`.

To check the mobile layout, open Chrome DevTools (`F12`), click the device toolbar
icon (`Ctrl+Shift+M`) and pick a 375px device such as iPhone SE, or set the width
to 768px for tablet.

## Option B: GitHub Pages (shareable link)

The workflow in `.github/workflows/pages.yml` runs lint and tests, copies the pricing
page and its assets into a site and deploys it. The site's landing page is the
pricing page.

One-time setup (repo admin):

1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.

Deploy: open **Actions → Pages → Run workflow** and run it on `main`. Run it again whenever
you want to publish newer changes. To deploy on every push instead, add `push: branches: [main]`
under `on:` in the workflow.

The site is published at:

<https://anshulkanodia-dev.github.io/PR_Demo_Devin/>

(`/PR_Demo_Devin/pricing` also works.) The deploy job's summary links to it.

Note: GitHub Pages sites are public, even if the repository were private.

## Checking the implementation against Figma

Open the hosted (or local) page next to the Figma frames:

| Figma frame | Compare with |
| --- | --- |
| [Desktop](https://www.figma.com/design/Gz6OAIvvHSLsHt7t4jTBPS?node-id=15-36) | the page at full width, Monthly selected |
| [Desktop, annual](https://www.figma.com/design/Gz6OAIvvHSLsHt7t4jTBPS?node-id=16-36) | after clicking **Annual** (Pro shows $23) |
| [Mobile](https://www.figma.com/design/Gz6OAIvvHSLsHt7t4jTBPS?node-id=17-36) | DevTools device toolbar at 375px |

Things to try: switch Monthly/Annual by clicking it or using the arrow keys, open the
mobile menu, and scroll the comparison table sideways on mobile.
