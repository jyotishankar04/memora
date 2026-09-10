// FormSubmit needs no account — the target address is embedded right in the
// URL. On the very first real submission it emails that address a one-time
// confirmation link; until that's clicked, submissions are accepted but not
// forwarded.
const FORMSUBMIT_EMAIL = process.env.NEXT_PUBLIC_FORMSUBMIT_EMAIL;
const FORMSUBMIT_ENDPOINT = FORMSUBMIT_EMAIL ? `https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}` : undefined;

/** Posts arbitrary fields to FormSubmit. Returns true only on a genuine, confirmed success. */
export async function submitWaitlist(fields: Record<string, string>): Promise<boolean> {
  if (!FORMSUBMIT_ENDPOINT) return false;

  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.set(key, value);

  const res = await fetch(FORMSUBMIT_ENDPOINT, {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
  });

  // FormSubmit can return HTTP 200 with `success: "false"` in the body —
  // e.g. while the target address is still pending its one-time activation
  // click — so the body, not just the status, decides this.
  const data: { success?: string | boolean } = await res.json().catch(() => ({}));
  return res.ok && (data.success === true || data.success === "true");
}
