// Pure localStorage read/write, deliberately with no dependency on lib/auth
// (which needs getStoredReferralCode for getProviderLoginUrl) — lib/referrals.ts
// depends on lib/auth for apiFetch, so this file is what breaks that cycle.

const STORAGE_KEY = "saveforlatter:referral-code";
const ATTRIBUTION_WINDOW_MS = 30 * 24 * 60 * 60 * 1000; // 30 days — matches the server's REFERRAL_CODE_COOKIE window

interface StoredReferral {
  code: string;
  expiresAt: number;
}

/** First-touch attribution: an existing stored code is never overwritten. */
export function storeReferralCode(code: string): void {
  if (typeof window === "undefined" || !code || getStoredReferralCode()) return;
  const entry: StoredReferral = { code, expiresAt: Date.now() + ATTRIBUTION_WINDOW_MS };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
}

export function getStoredReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as StoredReferral;
    if (entry.expiresAt < Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return entry.code;
  } catch {
    return null;
  }
}
