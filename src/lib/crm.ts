export interface ContactPayload {
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  /** Cloudflare Turnstile token from the widget's hidden form field. */
  "cf-turnstile-response": string;
}

/** Same-origin Pages Function (functions/api/contact.ts) — no build var needed. */
const HUBSPOT_ENDPOINT = "/api/contact";

/** True once the HubSpot endpoint is configured at build time. */
export const isCrmConfigured = Boolean(HUBSPOT_ENDPOINT);

/**
 * Forwards a contact submission to HubSpot through the Pages Function at
 * /api/contact, which keeps the Private App token server-side and tags the
 * contact with the GNRS label.
 */
export async function submitToCrm(payload: ContactPayload): Promise<unknown> {
  try {
    const res = await fetch(HUBSPOT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) return null;

    // Surface the endpoint's message when it is a plain error string; never
    // render an arbitrary upstream payload.
    const body = (await res.json().catch(() => null)) as { error?: unknown } | null;
    const message =
      typeof body?.error === "string" && body.error.length <= 200
        ? body.error
        : `CRM responded ${res.status}`;
    return new Error(message);
  } catch (err) {
    return err;
  }
}
