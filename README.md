# gnrs.gr — Ilias Giannaros (GNRS) portfolio

Single-page portfolio and services site for **Ilias Giannaros (GNRS)**, a headless
full-stack developer based in Kalamaria, Thessaloniki, Greece.

- **Live:** https://gnrs.gr
- **Hosting:** Cloudflare Pages (project `gnrs-personal-portfolio`)
- **Stack:** Vite 7 · React 18 · TypeScript · Tailwind CSS 3 · Framer Motion

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # vite build + prerender → dist/
npm run preview    # serve dist/
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

## Deploy

The site is deployed manually with Wrangler (no Git integration on the Pages project):

```bash
npm run build
npx wrangler pages deploy dist \
  --project-name gnrs-personal-portfolio --branch main --commit-dirty=true
```

Production alias: `gnrs-personal-portfolio.pages.dev`. Custom domains `gnrs.gr` and
`www.gnrs.gr` are attached to the project.

> **Cache note:** Cloudflare caches `public/` assets by filename. When replacing an
> image, change its filename (e.g. `profile.webp` → `portrait.webp`) or purge the
> cache, otherwise stale files keep being served.

## Structure

```
index.html               # head: meta, JSON-LD, CSP-hashed analytics loader
public/                  # static passthrough (icons, llms.txt, ARD, robots, _headers)
scripts/prerender.mjs    # post-build SSR → dist/index.html
src/
  components/            # Navbar, Footer, Background, Reveal, SectionHeading, LegalModal
  components/sections/   # Hero, About, Expertise, Skills, Projects, Experience,
                         # Testimonials, Contact
  data/                  # content + schema.ts (structured-data source of truth)
  hooks/useTypewriter.ts # rotating headline
  lib/crm.ts             # HubSpot hand-off (inert until configured)
```

## Configuration

Set as Cloudflare Pages build variables (all optional at runtime):

| Variable | Purpose |
|---|---|
| `VITE_HUBSPOT_ENDPOINT` | Contact-form endpoint. Unset → form reports failure instead of silently dropping mail. |

The Buddystat analytics site ID lives in `index.html` as a `SITE_ID` constant and is
**deliberately empty** — see [docs/ISSUES.md](docs/ISSUES.md#a-1).

## Documentation

| Doc | Contents |
|---|---|
| [docs/PROGRESS.md](docs/PROGRESS.md) | Chronological work log |
| [docs/ISSUES.md](docs/ISSUES.md) | Known issues, fixes, and open actions |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Cloudflare Pages + DNS runbook |
| [docs/SEO-GEO.md](docs/SEO-GEO.md) | Search and AI-discoverability setup |
| [docs/SECURITY.md](docs/SECURITY.md) | Security model and audit results |
