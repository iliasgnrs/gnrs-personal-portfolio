# Security model and audit

Audit performed 2026-10-30 against the working tree and the live site before the first
commit. Scope: sensitive-data leakage, injection/XSS, CSP, supply chain, build scripts and
deploy hygiene.

**Result: no secrets or sensitive data leak.** One real HIGH-severity data-flow issue was
found and fixed; one reported HIGH was investigated and rejected.

---

## Findings

| # | Severity | Location | Issue | Status |
|---|---|---|---|---|
| 1 | 🟠 HIGH | `index.html` (analytics loader) | Placeholder Buddystat ID was live and POSTed full query strings to an unverified tenant | **Fixed** |
| 2 | 🟡 MEDIUM | `src/components/LegalModal.tsx:33–37` | Privacy Policy described a removed storage backend and an inaccurate replay posture | **Fixed** |

### Finding 1 — analytics data egress

The supplied snippet used `data-site-id="a1b2c3d4e5f6"`, never verified against a real
Buddystat property. The live tenant config has `trackUrlParams: true`, and a captured
request confirmed the full query string is transmitted:

```json
{ "site_id":"a1b2c3d4e5f6", "hostname":"gnrs.gr", "pathname":"/",
  "querystring":"?utm_source=leaktest&email=secret@example.com", ... }
```

Any token, email or reset key appearing in a URL would have left the site.

**Fix:** the loader is gated on an empty `SITE_ID` constant and returns before injecting the
script. Verified in production: zero requests to `app.buddystat.com`,
`window.buddystat === undefined`, no CSP console errors.

**Residual risk:** none while inert. Re-enabling requires a verified site ID
([ISSUES.md A-1](ISSUES.md#a-1--analytics-site-id-is-a-placeholder-open)).

### Finding 2 — inaccurate privacy disclosures

The policy claimed submissions were "stored securely in a database with row-level security
enabled" (that backend is gone) and described session replay in terms that did not match the
tenant config (`sessionReplay: false`).

**Fix:** copy updated to describe the HubSpot destination and the actual analytics
behaviour. Note this now slightly leads implementation — see
[ISSUES.md A-3](ISSUES.md#a-3--privacy-policy-mentions-hubspot-before-it-ships-open).

---

## Rejected finding

An automated reviewer reported **HIGH**: the CSP `sha256` hash for the inline loader was
"unmatchable" because of base64 `=` padding, allegedly blocking analytics.

**Disproven empirically:**

- Recomputed the digest from `index.html` and `dist/index.html` — both equal the policy
  string, including the `=`.
- Production browser check: `window.buddystat` present, requests to `script.js`,
  `tracking-config` and `track` all fired, 2 JSON-LD blocks present, no CSP violations.

Base64 padding is valid in a CSP hash-source. The *underlying* fragility (a hand-maintained
hash that silently desynchronises) was real and is documented with a recompute procedure.

---

## Controls in place

### Content Security Policy (`public/_headers`)

```
default-src 'self'
script-src  'self' 'sha256-vI8u9MekuJcLO8B3MvT+ECOr1rGCKisQ12UQh/P7DD0=' https://app.buddystat.com
style-src   'self' 'unsafe-inline'
font-src    'self'
img-src     'self' data:
connect-src 'self' https://app.buddystat.com
frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'
```

`style-src 'unsafe-inline'` is required by Framer Motion's inline `style` attributes and is
not a script-execution path. `script-src` has **no** `'unsafe-inline'`.

Alongside: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
`X-Frame-Options: DENY`, `Permissions-Policy` denying geolocation/microphone/camera/payment.

### Application

- No `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function` or `document.write`.
- Contact payload goes through `fetch(JSON)` only — no HTML sink.
- External links use `rel="noopener noreferrer"`.
- `src/lib/crm.ts` fails closed when unconfigured rather than silently dropping submissions.

### Build pipeline

`scripts/prerender.mjs` takes no user input, reads a fixed path, writes back in place, has no
`exec`/network use, never listens on a port, and aborts on missing anchors.

### Artifacts

- No source maps shipped (`build.sourcemap` unset, no `sourceMappingURL`).
- No `VITE_*` variable names in the bundle.
- Images carry no EXIF/XMP/IPTC creator data.
- `wrangler.jsonc` contains no account/zone IDs or tokens; `.wrangler/` is git-ignored.

---

## Data-flow summary

| Data | Destination | Leaves the browser? |
|---|---|---|
| Contact form fields | `/api/contact` → HubSpot (when configured) | Yes, when A-2 is closed |
| Page views / device / path | Buddystat | **No** — loader inert (A-1) |
| Visitor identifier | `localStorage` (Buddystat, when enabled) | With page views only |

Public by design: name, `ilias@gnrs.gr`, LinkedIn/GitHub URLs, location. No phone number,
no address beyond city level.

---

## Verification commands

```bash
npm audit --omit=dev                                  # expect: 0 vulnerabilities
find dist -name '*.map'                               # expect: none
grep -rn 'VITE_' dist/assets/*.js                     # expect: none
curl -sI https://gnrs.gr/ | grep -i content-security  # CSP present
curl -s  https://gnrs.gr/.well-known/ard.json | head  # valid JSON, not HTML
```

## Known gaps (accepted)

- No HSTS header. Cloudflare Pages serves HTTPS only and redirects, but adding `Strict-Transport-Security`
  is worth considering once you are confident no subdomain needs plain HTTP.
- No CSP `report-to`/`report-uri`, so violations are invisible unless you watch the console.
- `style-src 'unsafe-inline'` remains, inherent to the styling approach.
