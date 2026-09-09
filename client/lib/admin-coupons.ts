import { apiFetch, apiFetchRaw } from "@/lib/auth";

export interface Coupon {
  id: string;
  code: string;
  label: string | null;
  discountType: "percentage" | "fixed_amount";
  discountValue: number;
  applicablePlanId: string | null;
  maxRedemptions: number | null;
  maxRedemptionsPerUser: number;
  redemptionCount: number;
  startsAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
}

export interface CouponRedemption {
  id: string;
  couponId: string;
  userId: string | null;
  status: "applied" | "converted" | "expired" | "revoked";
  appliedAt: string;
  convertedAt: string | null;
  discountAmountMinor: number | null;
}

export interface CreateCouponInput {
  code: string;
  label?: string;
  discountType: Coupon["discountType"];
  discountValue: number;
  applicablePlanId?: string | null;
  maxRedemptions?: number | null;
  maxRedemptionsPerUser?: number;
  startsAt?: string | null;
  expiresAt?: string | null;
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

export async function listCoupons(params: { page?: number; limit?: number } = {}) {
  const { data, meta } = await apiFetchRaw<Coupon[]>(`/admin/coupons${toQueryString(params)}`);
  return { items: data, page: (meta.page as number) ?? 1, limit: (meta.limit as number) ?? 20, total: (meta.total as number) ?? data.length };
}

export async function createCoupon(input: CreateCouponInput): Promise<Coupon> {
  return apiFetch<Coupon>("/admin/coupons", { method: "POST", body: input });
}

export async function updateCoupon(id: string, input: Partial<CreateCouponInput>): Promise<Coupon> {
  return apiFetch<Coupon>(`/admin/coupons/${id}`, { method: "PATCH", body: input });
}

export async function getCouponRedemptions(id: string, params: { page?: number; limit?: number } = {}) {
  const { data, meta } = await apiFetchRaw<CouponRedemption[]>(`/admin/coupons/${id}/redemptions${toQueryString(params)}`);
  return {
    items: data,
    page: (meta.page as number) ?? 1,
    limit: (meta.limit as number) ?? 20,
    appliedCount: (meta.appliedCount as number) ?? 0,
    convertedCount: (meta.convertedCount as number) ?? 0,
  };
}
