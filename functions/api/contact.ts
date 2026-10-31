/**
 * Cloudflare Pages Function — contact form → HubSpot.
 *
 * Port of the proven integration from the `scalepath` and `agrivate-bloom`
 * projects: creates a CRM contact with `venture_source = "GNRS"` (the label
 * already configured in the portal) and assigns it to the HubSpot owner. If a
 * contact with that email already exists, the existing record is updated
 * instead of failing with a 409.
 *
 * The Private App access token lives in the Pages secret
 * `HUBSPOT_ACCESS_TOKEN` and never reaches the browser. Same-origin only: the
 * endpoint is called from the site's own form, so a cross-site `Origin` is
 * rejected before anything is written to the CRM.
 *
 * Every request must also pass a Cloudflare Turnstile check against
 * https://challenges.cloudflare.com/turnstile/v0/siteverify, which must report
 * success for the expected action and an approved frontend hostname. The widget
 * secret lives in `TURNSTILE_SECRET`; `TURNSTILE_HOSTNAMES` is the allowlist.
 * Verification fails closed — missing configuration denies the request.
 *
 * Endpoint: POST /api/contact
 */

interface ContactEnv {
  HUBSPOT_ACCESS_TOKEN: string;
  HUBSPOT_OWNER_ID?: string;
  TURNSTILE_SECRET?: string;
  /** Comma-separated hostname allowlist; a leading dot means suffix match. */
  TURNSTILE_HOSTNAMES?: string;
}

interface ContactContext {
  request: Request;
  env: ContactEnv;
}

interface ContactInput {
  full_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const HUBSPOT_CONTACTS_URL = 'https://api.hubapi.com/crm/v3/objects/contacts';
const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const VENTURE_SOURCE = 'GNRS';
const DEFAULT_HUBSPOT_OWNER_ID = '96939195';
/** Must match TURNSTILE_ACTION in src/lib/turnstile.ts. */
const TURNSTILE_ACTION = 'contact';
const TURNSTILE_TOKEN_MAX = 2048;
const SITEVERIFY_TIMEOUT_MS = 10_000;
const HUBSPOT_TIMEOUT_MS = 10_000;
const MAX_BODY_BYTES = 20_000;

/** Keep in sync with the `maxLength` attributes in Contact.tsx. */
const LIMITS = {
  full_name: 120,
  email: 254,
  phone: 40,
  subject: 200,
  message: 4000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

type ParseResult = { ok: true; value: ContactInput } | { ok: false; error: string };

function parseContactInput(body: Record<string, unknown>): ParseResult {
  // A non-string value counts as absent, so nothing exotic reaches the CRM.
  const values = {} as Record<keyof typeof LIMITS, string>;
  for (const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    const raw = body[key];
    values[key] = typeof raw === 'string' ? raw.trim() : '';
    if (values[key].length > LIMITS[key]) {
      return { ok: false, error: `Field "${key}" exceeds ${LIMITS[key]} characters.` };
    }
  }

  const { full_name, email, subject, message } = values;
  if (!full_name || !email || !subject || !message) {
    return { ok: false, error: 'full_name, email, subject and message are required.' };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: 'Please provide a valid email address.' };
  }

  return {
    ok: true,
    value: {
      full_name,
      email,
      subject,
      message,
      phone: values.phone || undefined,
    },
  };
}

function buildProperties(
  input: ContactInput,
  opts: { ventureSource: string; ownerId?: string },
): Record<string, string> {
  const [firstname = '', ...lastParts] = input.full_name.split(/\s+/);
  const properties: Record<string, string> = {
    email: input.email.toLowerCase(),
    firstname,
    // HubSpot has no standard "subject" property; prefix it to the message body.
    message: `Subject: ${input.subject}\n\n${input.message}`,
    venture_source: opts.ventureSource,
  };

  if (lastParts.length > 0) properties.lastname = lastParts.join(' ');
  if (input.phone) properties.phone = input.phone;
  if (opts.ownerId) properties.hubspot_owner_id = opts.ownerId;

  return properties;
}

function timeoutSignal(): AbortSignal {
  return AbortSignal.timeout(HUBSPOT_TIMEOUT_MS);
}

async function submitContact(
  input: ContactInput,
  token: string,
  ownerId: string,
): Promise<{ ok: true; created: boolean } | { ok: false; status: number; detail: string }> {
  const headers = authHeaders(token);
  const body = JSON.stringify({
    properties: buildProperties(input, { ventureSource: VENTURE_SOURCE, ownerId }),
  });

  const createRes = await fetch(HUBSPOT_CONTACTS_URL, {
    method: 'POST',
    headers,
    body,
    signal: timeoutSignal(),
  });

  if (createRes.ok) return { ok: true, created: true };

  // Existing contact (409 CONFLICT) → look it up by email and update instead.
  if (createRes.status === 409) {
    const lookupRes = await fetch(
      `${HUBSPOT_CONTACTS_URL}/${encodeURIComponent(input.email.toLowerCase())}?idProperty=email`,
      { headers, signal: timeoutSignal() },
    );

    if (lookupRes.ok) {
      const record = (await lookupRes.json()) as { id?: string };
      if (record.id) {
        const updateRes = await fetch(`${HUBSPOT_CONTACTS_URL}/${record.id}`, {
          method: 'PATCH',
          headers,
          body,
          signal: timeoutSignal(),
        });

        if (updateRes.ok) return { ok: true, created: false };
        return { ok: false, status: updateRes.status, detail: await updateRes.text() };
      }
    }
  }

  return { ok: false, status: createRes.status, detail: await createRes.text() };
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin');
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

function parseHostnames(raw: string | undefined): string[] {
  return (raw ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

function hostnameAllowed(hostname: string, allowed: string[]): boolean {
  const host = hostname.toLowerCase();
  return allowed.some((entry) =>
    entry.startsWith('.') ? host.endsWith(entry) : host === entry,
  );
}

interface SiteverifyResult {
  success?: boolean;
  action?: string;
  hostname?: string;
  'error-codes'?: string[];
}

/**
 * Fails closed: missing configuration, network error, non-2xx, malformed body,
 * wrong action or unapproved hostname are all rejections. Returns a
 * machine-readable reason on failure, or `null` on success.
 */
async function verifyTurnstile(
  env: ContactEnv,
  token: unknown,
  clientIp: string | null,
): Promise<string | null> {
  const allowed = parseHostnames(env.TURNSTILE_HOSTNAMES);

  if (!env.TURNSTILE_SECRET || allowed.length === 0) {
    console.error(
      '[contact] Turnstile is not configured (TURNSTILE_SECRET / TURNSTILE_HOSTNAMES); denying request.',
    );
    return 'config';
  }
  if (typeof token !== 'string' || token.length === 0 || token.length > TURNSTILE_TOKEN_MAX) {
    return 'missing-token';
  }

  const form = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token });
  if (clientIp) form.set('remoteip', clientIp);

  let result: SiteverifyResult;
  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(SITEVERIFY_TIMEOUT_MS),
    });
    if (!res.ok) return `http-${res.status}`;
    result = (await res.json()) as SiteverifyResult;
  } catch (err) {
    console.error('[contact] Turnstile Siteverify failed', err);
    return 'network';
  }

  if (result.success !== true) return `rejected:${(result['error-codes'] ?? []).join(',')}`;
  if (result.action !== TURNSTILE_ACTION) return 'action-mismatch';
  if (!result.hostname || !hostnameAllowed(result.hostname, allowed)) return 'hostname-mismatch';
  return null;
}

export const onRequestPost = async (context: ContactContext): Promise<Response> => {
  const { request, env } = context;

  if (!isSameOrigin(request)) {
    return json({ error: 'Cross-origin submissions are not accepted.' }, 403);
  }
  if (!env.HUBSPOT_ACCESS_TOKEN) {
    console.error('[contact] HUBSPOT_ACCESS_TOKEN is not configured.');
    return json({ error: 'HubSpot is not configured.' }, 500);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ error: 'Request body is too large.' }, 413);
  }

  let body: Record<string, unknown>;
  try {
    const parsedJson: unknown = JSON.parse(raw);
    if (parsedJson === null || typeof parsedJson !== 'object') {
      return json({ error: 'Invalid JSON body.' }, 400);
    }
    body = parsedJson as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const parsed = parseContactInput(body);
  if (!parsed.ok) {
    return json({ error: parsed.error }, 400);
  }

  // Gate after validation so malformed input never reaches Siteverify, but
  // before anything is written to the CRM.
  const rejection = await verifyTurnstile(
    env,
    body['cf-turnstile-response'],
    request.headers.get('cf-connecting-ip'),
  );
  if (rejection) {
    console.warn('[contact] Turnstile rejected the request:', rejection);
    return json({ error: 'Human verification failed. Please reload and try again.' }, 403);
  }

  const ownerId = env.HUBSPOT_OWNER_ID || DEFAULT_HUBSPOT_OWNER_ID;

  try {
    const result = await submitContact(parsed.value, env.HUBSPOT_ACCESS_TOKEN, ownerId);
    if (!result.ok) {
      // Server-side only: the upstream body can leak internal ids.
      console.error('[contact] HubSpot rejected the submission', result.status, result.detail);
      return json(
        { error: "We couldn't save your message right now. Please try again shortly." },
        502,
      );
    }
    return json({ ok: true, created: result.created }, result.created ? 201 : 200);
  } catch (err) {
    console.error('[contact] HubSpot request failed', err);
    return json({ error: "We couldn't save your message right now. Please try again shortly." }, 502);
  }
};
