# SEO and GEO (AI discoverability)

How the site is made findable by search engines and by AI answer engines, and how to
change each piece safely.

## Search basics

| Signal | Where | Value |
|---|---|---|
| Title | `index.html` | `Ilias Giannaros (GNRS) — Full-Stack Developer` (45 chars) |
| Meta description | `index.html` | 146 chars |
| Canonical | `index.html` | `https://gnrs.gr/` |
| H1 | rendered by `Hero` | exactly one, prerendered into the HTML |
| Heading outline | — | 1 × h1, 7 × h2, 55 × h3 |
| Robots | `public/robots.txt` | allow all + explicit AI crawlers |
| Sitemap | `public/sitemap.xml` | single URL |
| Manifest | `public/site.webmanifest` | PWA metadata |

## Prerendering (why it matters)

`index.html` ships `<div id="root"></div>`; React renders client-side. Without prerendering,
crawlers that do not execute JS see **no headings and no content at all**.

`scripts/prerender.mjs` runs as part of `npm run build`:

1. Starts Vite in middleware mode (never listens on a port).
2. `renderToString(<App />)`.
3. Injects the markup into `dist/index.html`.
4. Fails the build if the `<div id="root"></div>` anchor is missing or the output has no
   `<h1>`.

The client hydrates over the markup normally. Verified with zero console errors.

**If you add routes**, this prerenderer produces a single page only — it does not emit
per-route files. Extend it or move to a proper SSG at that point.

## Structured data (JSON-LD)

`src/data/schema.ts` is the single source of truth. It exports:

- `homeGraph` — a `@graph` of `Person`, `ProfessionalService`, `WebSite`, `ProfilePage`
  and `ItemList` (7 projects), cross-linked by `@id`.
- `faqGraph` — a 4-question `FAQPage`.

Both are **statically embedded** in `index.html` so non-JS crawlers see them. Because the
file is TypeScript, regenerating the embedded copy is a manual step: edit `schema.ts`, then
re-emit the two `<script type="application/ld+json">` blocks in `index.html`.

Facts to keep in sync when editing:

- `Person.image` → `/portrait.webp` (avatar).
- `ProfessionalService.image` → `/logo.webp` (brand).
- `address` — Kalamaria, Thessaloniki, GR.
- `sameAs` — LinkedIn, GitHub.

> Note: JSON-LD blocks are **not** listed in the CSP `script-src` hash set. `application/ld+json`
> is data, not executable script, so CSP does not block it (confirmed in production: all
> blocks parse and are present).

## GEO — AI answer engines

| Artifact | Purpose |
|---|---|
| `public/llms.txt` | Plain-text summary: identity, services, expertise, projects with links, experience, citation notes. Linked from `<head>` via `<link rel="alternate" type="text/plain">`. |
| `public/.well-known/ard.json` | [ARD v0.91](https://agenticresourcediscovery.org/spec/) manifest, `{ "entries": [...] }`, 3 entries. Also advertised with `<link rel="ard">`. |
| `robots.txt` | Explicit `Allow:` for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Google-Extended, Applebot-Extended, CCBot. |

ARD entry requirements (per spec): `identifier` (URN form `urn:air:<domain>:…`),
`displayName`, `type`, and exactly one of `url`/`data`; `representativeQueries` (2–5) is
strongly recommended as the semantic discovery signal.

**Critical:** any file under `public/.well-known/` must have an explicit `Content-Type` in
`public/_headers`. Without it, the SPA rewrite serves `index.html` and consumers fail with
`Unexpected token '<'` — exactly the bug that scored Agentic Browsing 3/4.

## Scores

| Tool | Result |
|---|---|
| Lighthouse SEO | 100 (test the **production** alias — preview URLs are `noindex`) |
| Lighthouse Accessibility | 100 |
| PageSpeed (desktop) | 98 |
| Agentic Browsing | 4/4 |

## Social preview

`og-image.webp` is 1200×630, generated from the brand logo. Some platforms prefer
PNG/JPEG for unfurls; generate a PNG variant if previews render blank anywhere.

`twitter:site` / `twitter:creator` are set to `@iliasgnrs` — **verify this is the real
handle**.
