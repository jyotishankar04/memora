import { apiFetch } from "@/lib/auth";
import type { Plan, PlanLimitType, PlanLimits } from "@/lib/plans";

export interface AdminPlan extends Plan {
  limits: PlanLimits;
}

export interface PlanLimitInput {
  limitType: PlanLimitType;
  limitValue: number | null;
}

export interface UpsertPlanInput {
  key?: string; // only sent on create — the server rejects it on update
  name: string;
  description?: string;
  priceMinor: number;
  currency?: string;
  billingInterval?: Plan["billingInterval"];
  isActive?: boolean;
  isDefault?: boolean;
  sortOrder?: number;
  limits?: PlanLimitInput[];
}

export async function listAdminPlans(): Promise<AdminPlan[]> {
  return apiFetch<AdminPlan[]>("/admin/plans");
}

export async function createPlan(input: UpsertPlanInput): Promise<AdminPlan> {
  return apiFetch<AdminPlan>("/admin/plans", { method: "POST", body: input });
}

export async function updatePlan(id: string, input: Partial<UpsertPlanInput>): Promise<AdminPlan> {
  return apiFetch<AdminPlan>(`/admin/plans/${id}`, { method: "PATCH", body: input });
}
