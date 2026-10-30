# Progress log

Chronological record of work on the gnrs.gr portfolio. Newest entries last.

---

## 2026-10-30 — Production launch

### 1. Project scaffolding cleanup
The initial import still carried leftover template metadata from the scaffolding tool.

- Removed the generator's config directory and prompt file.
- Replaced both template OG/Twitter image URLs in `index.html`.
- Renamed the package from `vite-react-typescript-starter` to `gnrs-personal-portfolio`
  (lockfile synced).

### 2. Branding
- Added `public/logo.webp` (2000×1000) and `public/favicon.webp` (1080×1080, real alpha).
- Navbar and Footer previously referenced `/logo_gnrs.png`, **which never existed** in the
  repo — the logo was broken. Pointed both at `/logo.webp`.
- Generated `og-image.webp` (1200×630) from the brand logo for social previews.

### 3. Cloudflare Pages
- Created the Pages project, added `wrangler.jsonc`.
- Attached `gnrs.gr` and `www.gnrs.gr`; DNS cutover done by the owner in the dashboard
  (the available OAuth token is `zone:read` only — see ISSUES B-1).

### 4. Contact backend consolidation
The contact form originally wrote to a hosted Postgres table with row-level security, which
meant a second vendor, a client-side SDK and a public CSP `connect-src` exception for a single
form.

- Removed the hosted database client, its schema migrations, and the stale CSP entry.
- The form now routes through `src/lib/crm.ts`; it is intentionally inert so a submission
  fails loudly rather than vanishing, until the CRM endpoint lands (see 2026-10-31).
- Side effect: the bundle dropped from 456 kB to 330 kB once the SDK was no longer eagerly
  imported.

### 5. Performance work
Baseline was Lighthouse 80 / FCP 2.9 s / LCP 3.4 s. Changes, in order of impact:

| Change | Effect |
|---|---|
| Made the animated `blur()` background blobs static | Style & Layout 4.3 s → 1.2 s |
| Removed `background-position` animation on the gradient headline | eliminated full-viewport repaint per frame |
| Replaced the per-character typewriter with phrase rotation | 15 layout shifts → 0 (CLS 0) |
| Self-hosted Inter + Space Grotesk (fontsource) | removed render-blocking Google Fonts request |
| Deferred the analytics loader to `load` | out of the critical path |
| Vite 5 → 7, code splitting into react / motion / app chunks | better caching |
| Deleted dead CSS classes, keyframes, unused component export | smaller CSS |

Final: PageSpeed **98 desktop / 84+ mobile** reported by the owner. Accessibility,
Best Practices and SEO all at 100.

### 6. SEO and GEO
- Shortened title to 45 chars and description to 146 chars.
- Added geo meta, canonical, `max-image-preview:large`, web manifest, sitemap, robots.
- Explicit `Allow` entries for AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot,
  PerplexityBot, Google-Extended, CCBot).
- `src/data/schema.ts` is the single source of truth for a 5-node JSON-LD graph
  (Person, ProfessionalService, WebSite, ProfilePage, ItemList) plus a 4-question FAQPage,
  emitted statically into `index.html`.
- `public/llms.txt` summarises identity, services, expertise, projects and experience.

### 7. ARD manifest (Agentic Browsing 3/4 → 4/4)
PageSpeed fetched `/.well-known/ard.json`, got the SPA fallback HTML and failed to parse it.

- Added `public/.well-known/ard.json` per ARD v0.91 (`{ "entries": [...] }`, with the
  required `identifier`, `displayName`, `type`, `url` plus `representativeQueries`).
- Forced `Content-Type: application/json` in `_headers` so it can never fall through to
  the SPA again.

### 8. Missing H1 — the real cause
Reported twice as "missing H1". The `<h1>` existed in React but the **served HTML contained
zero headings** because `index.html` shipped an empty `<div id="root"></div>`; React renders
everything client-side, so non-JS crawlers saw nothing.

Fix: `scripts/prerender.mjs` runs after `vite build`, `renderToString()`s the real `App` and
injects it into `dist/index.html`. Verified: 1 `h1`, 7 `h2`, 55 `h3` in raw HTML, hydration
clean (no console errors).

A `<noscript><h1>` was rejected — JS users would then get two H1s.

### 9. Profile picture
Added the avatar in `Hero` with gradient ring, glow and online dot. Two corrections:

- The supplied 800×800 source is already square, so `object-position` had no effect and the
  face read tiny at 112 px. Pre-cropped to a bust framing instead.
- Cloudflare kept serving a stale `profile.webp`, so the asset was renamed to
  `portrait.webp` / `portrait-256.webp`.

### 10. Security audit
See [SECURITY.md](SECURITY.md). One real HIGH finding (placeholder analytics ID sending full
query strings to an unverified tenant) — fixed by gating the loader. One reported HIGH
CSP-hash finding was **disproven** and rejected.

---

## Verification snapshots

| Check | Result |
|---|---|
| `npm run typecheck` | clean |
| `npm run lint` | clean |
| `npm run build` | clean, ~100 kB prerendered HTML |
| `npm audit --omit=dev` | 0 vulnerabilities |
| Lighthouse (gnrs.gr) | A11y 100 · BP 100 · SEO 100 |
| PageSpeed (owner-run) | Desktop 98 · Mobile 84+ |
| Raw HTML `curl` | 1 h1, 2 JSON-LD blocks, no analytics egress |
