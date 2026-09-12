import { apiFetch } from "@/lib/auth";

export type PlanLimitType =
  | "memory_count"
  | "ai_monthly_queries"
  | "ai_monthly_vision_queries"
  | "storage_mb"
  | "collection_count";

export interface Plan {
  id: string;
  key: string;
  name: string;
  description: string | null;
  priceMinor: number;
  currency: string;
  billingInterval: "monthly" | "yearly" | "one_time";
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
  features: Record<string, boolean>;
}

export interface PlanAssignment {
  id: string;
  planId: string;
  status: string;
  source: string;
  startsAt: string;
  endsAt: string | null;
}

// null = unlimited (a limit type the plan doesn't cap at all).
export type PlanLimits = Partial<Record<PlanLimitType, number | null>>;
export type PlanUsage = Partial<Record<PlanLimitType, number>>;

export interface MyPlanSummary {
  plan: Plan;
  assignment: PlanAssignment | null;
  limits: PlanLimits;
  usage: PlanUsage;
}

export interface PublicPlan extends Plan {
  limits: PlanLimits;
}

export async function getMyPlan(): Promise<MyPlanSummary> {
  return apiFetch<MyPlanSummary>("/plans/me");
}

export async function listPublicPlans(): Promise<PublicPlan[]> {
  return apiFetch<PublicPlan[]>("/plans");
}

export const PLAN_LIMIT_LABEL: Record<PlanLimitType, string> = {
  memory_count: "Memories",
  ai_monthly_queries: "Ask SaveForLatter queries / month",
  ai_monthly_vision_queries: "Vision analysis / month",
  storage_mb: "Storage",
  collection_count: "Collections",
};

export function formatLimitValue(limitType: PlanLimitType, value: number): string {
  if (limitType === "storage_mb") {
    return value >= 1024 ? `${(value / 1024).toFixed(1)} GB` : `${value} MB`;
  }
  return value.toLocaleString();
}

export function formatPriceMinor(priceMinor: number, currency: string): string {
  if (priceMinor === 0) return "Free";
  const symbol = currency === "usd" ? "$" : currency === "inr" ? "₹" : currency.toUpperCase() + " ";
  return `${symbol}${(priceMinor / 100).toLocaleString()}`;
}

const LIMIT_ORDER: PlanLimitType[] = [
  "memory_count",
  "ai_monthly_queries",
  "ai_monthly_vision_queries",
  "storage_mb",
  "collection_count",
];

/**
 * Turns a plan's real, admin-editable limits into pricing-page bullet copy
 * ("Unlimited memories", "20 Ask SaveForLatter queries / month", ...) —
 * used instead of a hand-written per-plan feature list so the marketing
 * pricing table can never drift out of sync with what's actually enforced.
 */
export function planLimitBullets(limits: PlanLimits): string[] {
  return LIMIT_ORDER.filter((t) => t in limits).map((t) => {
    const value = limits[t];
    const amount = value == null ? "Unlimited" : formatLimitValue(t, value);
    return `${amount} ${PLAN_LIMIT_LABEL[t].toLowerCase()}`;
  });
}
