/**
 * Cloudflare Turnstile widget configuration.
 *
 * The sitekey is public by design — it ships in HTML and only identifies the
 * widget. Its paired secret is `TURNSTILE_SECRET`, used server-side only by
 * `functions/api/contact.ts`.
 */

export const TURNSTILE_SITE_KEY = "0x4AAAAAAC_tuej3ARR5QYzO";

/** Stamped into the token by the widget and re-checked at Siteverify. */
export const TURNSTILE_ACTION = "contact";

export const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
