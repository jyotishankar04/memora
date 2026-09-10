import { apiFetch, apiFetchRaw } from "@/lib/auth";

export interface PlanAssignment {
  id: string;
  userId: string | null;
  planId: string;
  status: "active" | "expired" | "cancelled" | "superseded";
  source: "admin_manual" | "signup_default" | "referral_reward" | "coupon_redemption" | "payment";
  startsAt: string;
  endsAt: string | null;
  reason: string | null;
}

export interface AssignmentListItem extends PlanAssignment {
  userEmail: string | null;
  userName: string | null;
  planKey: string | null;
  planName: string | null;
}

export interface AssignPlanInput {
  planId: string;
  endsAt?: string | null;
  reason?: string;
  amountMinor?: number;
  couponRedemptionId?: string;
  referralConversionId?: string;
}

export interface Transaction {
  id: string;
  userId: string | null;
  planId: string | null;
  type: string;
  status: "pending" | "succeeded" | "failed" | "refunded" | "cancelled";
  amountMinor: number;
  currency: string;
  provider: string | null;
  occurredAt: string;
}

export interface ListParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

function toQueryString(params: object): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function assignPlanToUser(userId: string, input: AssignPlanInput) {
  return apiFetch<{ assignment: PlanAssignment; transaction: Transaction }>(`/admin/billing/users/${userId}/assign-plan`, {
    method: "POST",
    body: input,
  });
}

export async function cancelAssignment(id: string): Promise<PlanAssignment> {
  return apiFetch<PlanAssignment>(`/admin/billing/assignments/${id}/cancel`, { method: "PATCH" });
}

export async function listUserAssignments(userId: string): Promise<PlanAssignment[]> {
  return apiFetch<PlanAssignment[]>(`/admin/billing/users/${userId}/assignments`);
}

export async function listAssignments(params: ListParams & { status?: PlanAssignment["status"] } = {}): Promise<PaginatedResult<AssignmentListItem>> {
  const { data, meta } = await apiFetchRaw<AssignmentListItem[]>(`/admin/billing/assignments${toQueryString(params)}`);
  return { items: data, page: (meta.page as number) ?? 1, limit: (meta.limit as number) ?? 20, total: (meta.total as number) ?? data.length };
}

export async function listTransactions(
  params: ListParams & { status?: Transaction["status"]; userId?: string } = {},
): Promise<PaginatedResult<Transaction>> {
  const { data, meta } = await apiFetchRaw<Transaction[]>(`/admin/billing/transactions${toQueryString(params)}`);
  return { items: data, page: (meta.page as number) ?? 1, limit: (meta.limit as number) ?? 20, total: (meta.total as number) ?? data.length };
}

export interface RevenueRollup {
  byDay: { date: string; totalMinor: number; count: number }[];
  byPlan: { planId: string | null; totalMinor: number; count: number }[];
}

export async function getRevenue(days: number): Promise<RevenueRollup> {
  return apiFetch<RevenueRollup>(`/admin/billing/revenue?days=${days}`);
}
