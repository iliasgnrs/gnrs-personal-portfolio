# Deployment — Cloudflare Pages

## Current setup

| Item | Value |
|---|---|
| Cloudflare account | `Iliasgnrs@gmail.com's Account` (`b72dfed9d933eb6005417b8237655a2a`) |
| Pages project | `gnrs-personal-portfolio` |
| Production branch | `main` |
| Build output | `dist/` (`pages_build_output_dir` in `wrangler.jsonc`) |
| Production alias | https://gnrs-personal-portfolio.pages.dev |
| Custom domains | `gnrs.gr`, `www.gnrs.gr` |
| Git integration | **none** — deploys are manual via Wrangler |

## Build and deploy

```bash
npm ci
npm run build            # vite build && node scripts/prerender.mjs
npx wrangler pages deploy dist \
  --project-name gnrs-personal-portfolio \
  --branch main \
  --commit-dirty=true
```

Wrangler reads OAuth credentials from `~/.wrangler/config/default.toml`. If `$HOME`
is overridden in your shell, pass it explicitly (`HOME=$HOME npx wrangler ...`) so the
credentials are found.

### Verifying a deploy

Per-deployment URLs (`https://<hash>.gnrs-personal-portfolio.pages.dev`) are sent with
`x-robots-tag: noindex` by Cloudflare. **This is expected** and is not a config error. Test
SEO against the production alias or `gnrs.gr`, otherwise Lighthouse reports SEO 69 instead
of 100.

```bash
curl -sI  https://gnrs.gr/ | grep -i x-robots        # should print nothing
curl -s   https://gnrs.gr/ | grep -c '<h1'           # should be 1
curl -s   https://gnrs.gr/.well-known/ard.json | head -c 60
```

## DNS

The custom domains are attached but the DNS records live in the `gnrs.gr` zone and **must be
edited in the dashboard** — the OAuth token on this machine has `zone:read` only, so
`wrangler` and the API both refuse DNS writes.

In **Cloudflare dashboard → gnrs.gr → DNS → Records**:

1. Delete the apex `A`/`AAAA` records that point at the legacy WordPress host.
2. `CNAME  @  →  gnrs-personal-portfolio.pages.dev` (proxied).
3. `CNAME  www →  gnrs-personal-portfolio.pages.dev` (proxied).
4. **Caching → Purge Everything.**

`gnrs.gr` is delegated to Cloudflare nameservers (`naomi.ns.cloudflare.com`,
`luke.ns.cloudflare.com`), so certificates issue automatically once the records resolve.

## Caching

- `/assets/*` — immutable, content-hashed filenames.
- Static images in `public/` — **7 days by filename**. Replacing an image without changing
  its name will keep serving the old file from edge cache. Rename it or purge.

## Environment variables

Set under **Pages project → Settings → Environment variables** (build scope):

| Variable | Required | Notes |
|---|---|---|
| `VITE_HUBSPOT_ENDPOINT` | No | Contact form is inert until set. See [ISSUES.md](ISSUES.md#a-2). |

The analytics site ID is **not** an env var — it is a constant in `index.html`, currently
empty on purpose ([ISSUES.md A-1](ISSUES.md#a-1--analytics-site-id-is-a-placeholder-open)).

## Headers

All security headers live in `public/_headers` and are copied into `dist/` by Vite:

- CSP: `default-src 'self'`, `script-src` restricted to `'self'` + a `sha256` for the inline
  analytics loader + `app.buddystat.com`, `frame-ancestors 'none'`, `object-src 'none'`.
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `X-Frame-Options: DENY`, `Permissions-Policy` denying geo/mic/camera/payment.
- Explicit `Content-Type` for `llms.txt`, `robots.txt`, `sitemap.xml`, `site.webmanifest`
  and `/.well-known/ard.json` so none of them fall through to the SPA rewrite.
