<p align="center">
  <img src="./public/readme-logo.webp" alt="GNRS" width="420" />
</p>

# gnrs.gr — Ilias Giannaros (GNRS)

**[gnrs.gr](https://gnrs.gr)** — the personal portfolio and services site of a headless
full-stack developer, built as a production-grade static-first React application on
Cloudflare's edge.

Not a template with a form: server-side prerendering for crawlers, a JSON-LD knowledge
graph, a hardened CSP, a Turnstile-protected contact endpoint that writes to HubSpot CRM,
and a documented security/SEO/deployment trail in [`docs/`](docs/).

| | |
|---|---|
| **Live** | https://gnrs.gr |
| **Stack** | Vite 7 · React 18 · TypeScript (strict) · Tailwind CSS 3 · Framer Motion |
| **Runtime** | Cloudflare Pages + Pages Functions (edge, no origin server) |
| **Integrations** | HubSpot CRM · Cloudflare Turnstile |
| **Quality** | Lighthouse 100 A11y / BP / SEO · typecheck + lint clean |

### What is interesting here

- **Static-first, still dynamic** — `scripts/prerender.mjs` renders the real `App` to HTML
  after the Vite build, so non-JS crawlers see full content while React hydrates normally.
- **Edge contact pipeline** — [`functions/api/contact.ts`](functions/api/contact.ts) runs at
  the edge: same-origin check → validation → Turnstile Siteverify → HubSpot create/update,
  with secrets never leaving the server and both upstream calls time-boxed.
- **Security as design** — strict CSP with a hashed inline loader, no `unsafe-inline` for
  scripts, fail-closed third-party gating. Findings and rejected false positives are
  recorded in [SECURITY.md](docs/SECURITY.md).
- **Discoverability for humans and agents** — JSON-LD graph from a single typed source of
  truth, `llms.txt`, and an ARD manifest for agentic browsing.
- **Performance discipline** — the work log records measured changes (Layout 4.3 s → 1.2 s,
  CLS 0), not intentions.

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
functions/api/contact.ts # Pages Function: Turnstile gate → HubSpot CRM
public/                  # static passthrough (icons, llms.txt, ARD, robots, _headers)
scripts/prerender.mjs    # post-build SSR → dist/index.html
src/
  components/            # Navbar, Footer, Background, Reveal, SectionHeading,
                         # LegalModal, TurnstileWidget
  components/sections/   # Hero, About, Expertise, Skills, Projects, Experience,
                         # Testimonials, Contact
  data/                  # content + schema.ts (structured-data source of truth)
  hooks/useTypewriter.ts # rotating headline
  lib/crm.ts             # typed client for POST /api/contact
  lib/turnstile.ts       # public sitekey + action constants
```

## Contact form

`POST /api/contact` is a Cloudflare Pages Function, not a third-party form action:

1. Same-origin check on the `Origin` header.
2. Field validation and length caps (shared limits with the form).
3. Cloudflare Turnstile Siteverify — fails closed, rejects a wrong action or hostname.
4. HubSpot CRM v3 — creates the contact, or updates the existing record by email on `409`.

The Private App token never reaches the browser; the endpoint returns `201`/`200`/`400`/`403`/`413`/`500`/`502`.

Set these as Cloudflare Pages secrets — see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md#environment-variables):

| Variable | Required | Purpose |
|---|---|---|
| `HUBSPOT_ACCESS_TOKEN` | Yes | HubSpot Private App token (secret). |
| `TURNSTILE_SECRET` | Yes | Turnstile widget secret (secret). |
| `TURNSTILE_HOSTNAMES` | Yes | Comma-separated Siteverify hostname allowlist. |
| `HUBSPOT_OWNER_ID` | No | Overrides the default contact owner. |

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
