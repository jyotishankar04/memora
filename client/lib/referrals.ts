import { apiFetch } from "@/lib/auth";
import { storeReferralCode } from "@/lib/referral-storage";

export { getStoredReferralCode } from "@/lib/referral-storage";

export interface MyReferralStats {
  code: { id: string; code: string; rewardCreditsAmount: number; clickCount: number };
  appliedCount: number;
  convertedCount: number;
}

/** Called once on mount by components/referral-capture.tsx when ?ref=CODE is present. */
export function captureReferralCode(code: string): void {
  storeReferralCode(code);
  void trackReferralClick(code);
}

/** Best-effort — a failed beacon shouldn't affect the visit in any way. */
async function trackReferralClick(code: string): Promise<void> {
  try {
    await apiFetch("/referrals/track-click", { method: "POST", body: { code } });
  } catch {
    // ignored
  }
}

/** The signed-in user's own referral code + funnel stats. */
export async function getMyReferralStats(): Promise<MyReferralStats> {
  return apiFetch<MyReferralStats>("/referrals/me");
}
