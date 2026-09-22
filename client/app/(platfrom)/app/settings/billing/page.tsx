"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle01Icon as CheckCircle } from "@hugeicons/core-free-icons";
import { getMyPlan, formatLimitValue, PLAN_LIMIT_LABEL, type PlanLimitType } from "@/lib/plans";
import { QueryErrorState } from "@/components/query-error-state";
import { SupportProjectCard } from "@/components/support-project-card";

const LIMIT_ORDER: PlanLimitType[] = [
  "memory_count",
  "ai_monthly_queries",
  "ai_monthly_vision_queries",
  "storage_mb",
  "collection_count",
  "public_share_count",
];

export default function BillingSettingsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["plans", "me"],
    queryFn: getMyPlan,
  });

  return (
    <div className="space-y-6 max-w-3xl text-xs font-semibold">

      <div className="space-y-1 pb-4 border-b border-border/25">
        <h3 className="text-sm font-bold text-foreground">Billing</h3>
        <p className="text-[10px] text-muted-foreground">SaveForLatter is free and open source — every feature, no limits, nothing to buy.</p>
      </div>

      {isError ? (
        <QueryErrorState onRetry={() => refetch()} />
      ) : isLoading || !data ? (
        <p className="text-xs text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-4">

          <div className="p-5 border border-border bg-card rounded-xl space-y-4 text-xs font-semibold">
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Your Plan</span>
              <span className="flex items-center gap-1 text-[9px] font-mono font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded">
                <HugeiconsIcon icon={CheckCircle} strokeWidth={2.25} className="h-3 w-3" />
                {data.plan.name.toUpperCase()} · UNLIMITED
              </span>
            </div>

            <div className="space-y-3">
              {LIMIT_ORDER.filter((limitType) => limitType in data.limits).map((limitType) => {
                const used = data.usage[limitType] ?? 0;
                return (
                  <div key={limitType} className="flex items-center justify-between text-[10px]">
                    <span className="text-foreground">{PLAN_LIMIT_LABEL[limitType]}</span>
                    <span className="text-muted-foreground font-mono">
                      {formatLimitValue(limitType, used)} used · Unlimited
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 border border-border/60 bg-muted/15 rounded-xl space-y-1 text-[10px] text-muted-foreground font-semibold leading-relaxed">
            <p>This product is open source and free for everyone — there&apos;s no paid tier and nothing to upgrade to.</p>
          </div>

          <SupportProjectCard />

        </div>
      )}
    </div>
  );
}
