# Issues, fixes and open actions

Every issue found during the build-out, what caused it, and whether it is closed.
Open items are marked **OPEN**.

---

## A. Open / actionable

### A-1 — Analytics site ID is a placeholder **OPEN**
**File:** `index.html` (`SITE_ID` in the analytics loader)

The Buddystat snippet supplied was `data-site-id="a1b2c3d4e5f6"`, which looks like a
placeholder and was never verified against a real Buddystat property.

This mattered because the live tenant config has `trackUrlParams: true`, and a captured
request confirmed the full query string is POSTed to `app.buddystat.com/api/track`:

```json
{ "site_id":"a1b2c3d4e5f6", "hostname":"gnrs.gr", "pathname":"/",
  "querystring":"?utm_source=leaktest&email=secret@example.com", ... }
```

Any email/token placed in a URL would have left the site. **Mitigated** by gating the loader
on an empty `SITE_ID` constant, so the script is never injected. Verified in production:
zero analytics requests, `window.buddystat === undefined`, no CSP errors.

**To close:** issue a real site ID, set it in `SITE_ID`, recompute the CSP hash (below),
and update [SEO-GEO.md](SEO-GEO.md)/[SECURITY.md](SECURITY.md) accordingly.

> **CSP hash coupling:** the loader is an inline script authorised by a `sha256` in
> `public/_headers`. Editing it *will* silently break analytics. Recompute with:
>
> ```bash
> python3 - <<'PY'
> import re, hashlib, base64
> h = open('index.html').read()
> for attrs, body in re.findall(r'<script(?![^>]*\bsrc=)([^>]*)>(.*?)</script>', h, re.S):
>     if 'ld+json' not in attrs:
>         print('sha256-' + base64.b64encode(hashlib.sha256(body.encode()).digest()).decode())
> PY
> ```

### A-2 — Contact form not connected **CLOSED**
**Files:** `src/lib/crm.ts`, `src/components/sections/Contact.tsx`, `functions/api/contact.ts`

The form posts to the same-origin Pages
Function `/api/contact`, which validates and length-caps every field, rejects cross-origin
`Origin`s, requires a Cloudflare Turnstile token, and creates or updates a CRM contact
tagged `venture_source = "GNRS"`.

**Requires:** `HUBSPOT_ACCESS_TOKEN`, `TURNSTILE_SECRET` and `TURNSTILE_HOSTNAMES` — see
[DEPLOYMENT.md](DEPLOYMENT.md#environment-variables). The Turnstile widget must also have
`gnrs.gr` and `gnrs-personal-portfolio.pages.dev` registered in Hostname Management.

### A-4 — Form breaks on hostnames not registered on the Turnstile widget **OPEN**
**Files:** `src/components/TurnstileWidget.tsx`, `docs/DEPLOYMENT.md`

Turnstile rejects unregistered hostnames client-side with `110200` ("Domain not
authorized"); the form then shows "Human verification could not load". This matches the
server, which fails closed with `403`. Local `127.0.0.1` always hits this unless the host
is temporarily registered on the widget or the always-pass test keys are used.

**To close:** confirm the hostname list covers production and preview URLs.

### A-3 — Privacy Policy mentions HubSpot before it ships **CLOSED**
**File:** `src/components/LegalModal.tsx:33`

The copy says submissions are stored in "a customer relationship management system
(HubSpot)". Accurate now that A-2 has landed.

---

## B. Environment constraints

### B-1 — Cannot edit DNS with the available credentials **OPEN (external)**
The Wrangler OAuth token for this machine has `pages:write` and `zone:read` only — no
`dns:edit`. Domain attachment therefore had to be completed by the owner in the Cloudflare
dashboard. See [DEPLOYMENT.md](DEPLOYMENT.md). Not a defect, just a hard limit worth
recording so nobody re-tries API-based DNS changes.

---

## C. Closed — issues found and fixed

### C-1 — Site crashed without env vars (white screen)
**Symptom:** the SDK threw on load because its URL was missing; the whole React tree unmounted.
**Cause:** the client was created at module import with an `undefined` URL.
**Fix:** lazy factory when it was still in use; resolved entirely once the form moved to the
same-origin CRM endpoint (A-2).

### C-2 — Logo was broken in production
**Symptom:** broken image in navbar/footer.
**Cause:** both components referenced `/logo_gnrs.png`, which was never in the repo.
**Fix:** point at `/logo.webp`, plus intrinsic `width`/`height` to clear `unsized-images`.

### C-3 — Main-thread saturation from animated blurs
**Symptom:** poor/mobile-inconsistent Lighthouse, 4.3 s Style & Layout during scroll, 60→tens of fps.
**Cause:** three `filter: blur(120px)` blobs animating `transform` continuously.
**Fix:** static blobs. Style & Layout 4.3 s → 1.2 s.

### C-4 — Layout shifts from the typewriter
**Symptom:** 15 layout shifts, CLS drift.
**Cause:** per-character text swap reflowed the hero headline every 40–80 ms.
**Fix:** rotate whole phrases on a timer; CLS now 0.

### C-5 — Render-blocking webfonts
**Symptom:** FCP/LCP penalty, ~900 ms wasted.
**Cause:** blocking Google Fonts `<link>` in `index.html`.
**Fix:** self-hosted variable fonts via `@fontsource-variable/*`; `<link>` removed.

### C-6 — `content-visibility` experiment made things worse
**Symptom:** TBT rose from ~900 ms to ~1.8 s.
**Fix:** reverted. Recorded here because the change looked reasonable and was re-tried
once; the measurements said otherwise.

### C-7 — ARD manifest parsed as HTML
**Symptom:** PageSpeed Agentic Browsing `Malformed JSON ... Unexpected token '<'`.
**Cause:** `/.well-known/ard.json` fell through to the SPA rewrite.
**Fix:** real manifest in `public/.well-known/`, plus an explicit `Content-Type` in `_headers`.

### C-8 — "Missing H1" that wasn't
**Symptom:** reported twice by an SEO tool.
**Cause:** the `<h1>` was correct in React but the served HTML only had an empty `#root` —
no crawler could see it. Moving the element *within* React (first attempted fix) could not
work.
**Fix:** `scripts/prerender.mjs` injects SSR markup at build time. Also discovered and fixed
`fetchPriority`, which React 18 does not serialise.

### C-9 — Stale asset served after redeploy
**Symptom:** `profile.webp` stayed at 16,938 bytes across deploys; new crop never appeared.
**Cause:** Cloudflare edge cache keyed on the unchanged filename.
**Fix:** renamed to `portrait.webp` / `portrait-256.webp`. Rule of thumb in
[README.md](../README.md#deploy).

### C-10 — Analytics loader silently dead behind CSP
**Symptom:** none visible; analytics simply never ran.
**Cause:** the inline loader's `sha256` in `_headers` was hand-pasted. It was correct at the
time, but any future edit desynchronises it with no error.
**Fix:** hash recomputed from source, dist and the deployed policy and confirmed identical;
procedure documented in A-1.

---

## D. Rejected findings

### D-1 — "CSP hash unusable due to base64 `=` padding" (reported HIGH)
An automated reviewer claimed the trailing `=` in the `sha256-…=` policy token made the hash
unmatchable, blocking analytics.

**Disproven.** Recomputed the digest from `index.html` and `dist/index.html`; both produce
exactly the string in the policy. Confirmed in production: `window.buddystat` was an object,
`script.js` → `tracking-config` → `track` all fired, 2 JSON-LD blocks present, **no CSP
violations**. Base64 padding is valid inside a CSP hash-source.

The underlying fragility (hand-maintained hash) was real and is now documented as A-1.

### D-2 — ARD entries using URL fragments
Raised as a validity concern (`https://gnrs.gr/#expertise` as an entry `url`). Fragments are
valid URLs; left as-is. Revisit if a registry rejects them.
