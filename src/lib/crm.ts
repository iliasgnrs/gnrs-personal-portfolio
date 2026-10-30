export interface ContactPayload {
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
}

const HUBSPOT_ENDPOINT = import.meta.env.VITE_HUBSPOT_ENDPOINT as
  string | undefined;

/** True once the HubSpot form/submit endpoint is configured at build time. */
export const isCrmConfigured = Boolean(HUBSPOT_ENDPOINT);

/**
 * Forwards a contact submission to HubSpot through the Pages Function at
 * VITE_HUBSPOT_ENDPOINT. Returns an error when the CRM is not configured yet,
 * so the form reports failure instead of silently dropping the message.
 * TODO(hubspot): point VITE_HUBSPOT_ENDPOINT at functions/api/contact.ts.
 */
export async function submitToCrm(payload: ContactPayload): Promise<unknown> {
  if (!HUBSPOT_ENDPOINT) return new Error("CRM endpoint not configured.");

  try {
    const res = await fetch(HUBSPOT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok ? null : new Error(`CRM responded ${res.status}`);
  } catch (err) {
    return err;
  }
}
