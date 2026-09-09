import { apiFetch, apiFetchRaw } from "@/lib/auth";

export interface ReferralCode {
  id: string;
  code: string;
  type: "user" | "admin_issued";
  ownerUserId: string | null;
  rewardCreditsAmount: number;
  clickCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface ReferralConversion {
  id: string;
  referralCodeId: string;
  referredUserId: string | null;
  stage: "applied" | "converted";
  appliedAt: string;
  convertedAt: string | null;
}

export interface CreateReferralCodeInput {
  code: string;
  ownerUserId?: string | null;
  rewardCreditsAmount: number;
  isActive?: boolean;
}

function toQueryString(params: object): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function listReferralCodes(params: { page?: number; limit?: number } = {}) {
  const { data, meta } = await apiFetchRaw<ReferralCode[]>(`/admin/referrals/codes${toQueryString(params)}`);
  return { items: data, page: (meta.page as number) ?? 1, limit: (meta.limit as number) ?? 20, total: (meta.total as number) ?? data.length };
}

export async function createReferralCode(input: CreateReferralCodeInput): Promise<ReferralCode> {
  return apiFetch<ReferralCode>("/admin/referrals/codes", { method: "POST", body: input });
}

export async function updateReferralCode(
  id: string,
  input: Partial<Pick<CreateReferralCodeInput, "rewardCreditsAmount" | "isActive">>,
): Promise<ReferralCode> {
  return apiFetch<ReferralCode>(`/admin/referrals/codes/${id}`, { method: "PATCH", body: input });
}

export async function getReferralCodeConversions(id: string, params: { page?: number; limit?: number } = {}) {
  const { data, meta } = await apiFetchRaw<ReferralConversion[]>(`/admin/referrals/codes/${id}/conversions${toQueryString(params)}`);
  return {
    items: data,
    page: (meta.page as number) ?? 1,
    limit: (meta.limit as number) ?? 20,
    appliedCount: (meta.appliedCount as number) ?? 0,
    convertedCount: (meta.convertedCount as number) ?? 0,
  };
}
