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

Set under **Pages project → Settings → Environment variables**:

| Variable | Scope | Required | Notes |
|---|---|---|---|
| `HUBSPOT_ACCESS_TOKEN` | Production + Preview | Yes | HubSpot Private App token (`pat-…`). Read only by [`functions/api/contact.ts`](../functions/api/contact.ts). Mark it as a **secret**. |
| `HUBSPOT_OWNER_ID` | Production + Preview | No | Overrides the default owner `96939195`. |
| `TURNSTILE_SECRET` | Production + Preview | Yes | Turnstile widget secret. Verification **fails closed**: without it every submission is rejected with `403`. |
| `TURNSTILE_HOSTNAMES` | Production + Preview | Yes | Comma-separated allowlist of the `hostname` values Siteverify may report — `gnrs.gr,www.gnrs.gr,gnrs-personal-portfolio.pages.dev`. A leading dot means suffix match. |

The contact form posts to the same-origin Pages Function `/api/contact` — no build
variable is needed.

### Turnstile widget setup

The public sitekey is `0x4AAAAAAC_tuej3ARR5QYzO` ([`src/lib/turnstile.ts`](../src/lib/turnstile.ts)),
and the widget is rendered with `action = "contact"`, which Siteverify re-checks.

In **Cloudflare dashboard → Turnstile → the GNRS widget → Hostname Management**, the
hostnames must be registered, otherwise the widget fails client-side with error
`110200` ("Domain not authorized"):

- `gnrs.gr` (append i.e. also covers `www.gnrs.gr`)
- `gnrs-personal-portfolio.pages.dev` — covers preview URLs (`<hash>.gnrs-personal-portfolio.pages.dev`)

`TURNSTILE_HOSTNAMES` must list the same hosts; keep the two in sync.

Local development against `http://127.0.0.1` / `localhost` triggers `110200` unless those
hostnames are temporarily added to the widget, or the always-pass test keys are used
(`sitekey 1x00000000000000000000AA` with secret `1x0000000000000000000000000000000AA`).

### HubSpot setup

The Pages Function writes a CRM contact with these properties:

| HubSpot property | Source |
|---|---|
| `email`, `firstname`, `lastname` | Full Name / Email fields |
| `phone` | Phone field (optional) |
| `message` | `Subject: <subject>` followed by the message body |
| `venture_source` | Hardcoded `Web Dev` (allowed option of the existing custom property) |
| `hubspot_owner_id` | `HUBSPOT_OWNER_ID` or `96939195` |

Submitting an email that already exists updates the existing contact (`PATCH`)
instead of creating a duplicate.

`venture_source` is a dropdown property, so the value must be one of the options
configured in the portal (`ScalePath`, `Agrivate`, `Buddystat`, `Menuvi`, `Web Dev`).
HubSpot rejects the whole submission with `INVALID_OPTION` otherwise; the constant is
`VENTURE_SOURCE` in [`functions/api/contact.ts`](../functions/api/contact.ts).

Local development:

```bash
# .dev.vars (git-ignored)
HUBSPOT_ACCESS_TOKEN="pat-..."
HUBSPOT_OWNER_ID="96939195"
TURNSTILE_SECRET="0x..."
TURNSTILE_HOSTNAMES="localhost,127.0.0.1"

npx wrangler pages dev dist --compatibility-date=2026-08-01
```

Response codes: `201` created, `200` updated, `400` invalid input, `403` cross-origin
or failed human verification (including missing Turnstile configuration), `413` body too
large, `500` HubSpot token missing, `502` HubSpot rejected or timed out.

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
