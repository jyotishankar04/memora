import { useQuery } from "@tanstack/react-query";
import { getMyPlan, formatLimitValue, PLAN_LIMIT_LABEL, type PlanLimitType } from "@/lib/plans";

export const myPlanQueryKey = ["plans", "me"];

// Shared across every button/form that needs to know "can the user still do
// this" before they click — one query, cached and deduped by React Query,
// so mounting this in several places (capture, collections, ask) doesn't
// mean several network requests.
export function useMyPlanQuery() {
  return useQuery({ queryKey: myPlanQueryKey, queryFn: getMyPlan });
}

export interface PlanLimitStatus {
  loading: boolean;
  limit: number | null; // null = unlimited on the current plan
  used: number;
  isUnlimited: boolean;
  isAtLimit: boolean;
  remaining: number | null;
  planName: string | null;
  label: string;
  /** Ready-to-render copy: "You've reached your Free plan's Memories limit (100)." */
  message: string | null;
}

export function usePlanLimit(limitType: PlanLimitType): PlanLimitStatus {
  const { data, isLoading } = useMyPlanQuery();

  const limit = data?.limits[limitType] ?? null;
  const used = data?.usage[limitType] ?? 0;
  const isUnlimited = Boolean(data) && limit == null;
  const isAtLimit = Boolean(data) && !isUnlimited && limit != null && used >= limit;
  const label = PLAN_LIMIT_LABEL[limitType];

  return {
    loading: isLoading,
    limit,
    used,
    isUnlimited,
    isAtLimit,
    remaining: isUnlimited || limit == null ? null : Math.max(0, limit - used),
    planName: data?.plan.name ?? null,
    label,
    message:
      isAtLimit && data && limit != null
        ? `You've reached your ${data.plan.name} plan's ${label} limit (${formatLimitValue(limitType, limit)}).`
        : null,
  };
}

export interface PlanFeatureStatus {
  loading: boolean;
  enabled: boolean;
  planName: string | null;
}

/** Boolean counterpart to usePlanLimit — for admin-configured on/off perks (plans.features), not countable quotas. */
export function usePlanFeature(key: string): PlanFeatureStatus {
  const { data, isLoading } = useMyPlanQuery();

  return {
    loading: isLoading,
    enabled: Boolean(data?.plan.features?.[key]),
    planName: data?.plan.name ?? null,
  };
}
