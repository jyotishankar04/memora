"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getMyPlan, formatLimitValue, formatPriceMinor, PLAN_LIMIT_LABEL, type PlanLimitType } from "@/lib/plans";
import { QueryErrorState } from "@/components/query-error-state";

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
    <div className="space-y-6 max-w-md text-xs font-semibold">

      <div className="space-y-1 pb-4 border-b border-border/25">
        <h3 className="text-sm font-bold text-foreground">Billing</h3>
        <p className="text-[10px] text-muted-foreground">Manage your workspace pricing models.</p>
      </div>

      {isError ? (
        <QueryErrorState onRetry={() => refetch()} />
      ) : isLoading || !data ? (
        <p className="text-xs text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-4">

          {/* Active plan details */}
          <div className="p-5 border border-border bg-card rounded-xl space-y-4 text-xs font-semibold">
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Active Plan</span>
              <span className="text-[9px] font-mono font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded">
                {data.plan.name.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3">
              {LIMIT_ORDER.filter((limitType) => limitType in data.limits).map((limitType) => {
                const limit = data.limits[limitType];
                const used = data.usage[limitType] ?? 0;
                const unlimited = limit == null;
                const pct = unlimited ? 0 : Math.min(100, Math.round((used / Math.max(limit, 1)) * 100));
                return (
                  <div key={limitType} className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-foreground">{PLAN_LIMIT_LABEL[limitType]}</span>
                      <span className="text-muted-foreground font-mono">
                        {formatLimitValue(limitType, used)} / {unlimited ? "Unlimited" : formatLimitValue(limitType, limit)}
                      </span>
                    </div>
                    {!unlimited && (
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={pct >= 100 ? "h-full bg-destructive" : "h-full bg-primary"}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!data.plan.isDefault || data.plan.priceMinor === 0 ? (
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {formatPriceMinor(data.plan.priceMinor, data.plan.currency)}
                {data.plan.priceMinor > 0 ? ` / ${data.plan.billingInterval}` : ""}
                {data.assignment?.endsAt && ` · Until ${new Date(data.assignment.endsAt).toLocaleDateString()}`}
              </p>
            ) : null}

            <Button disabled title="Coming soon" className="w-full h-9 rounded-full bg-primary text-white font-bold text-[10px] opacity-60 cursor-not-allowed">
              Upgrade — Coming soon
            </Button>
          </div>

          <div className="p-4 border border-border/60 bg-muted/15 rounded-xl space-y-2 text-[10px] text-muted-foreground font-semibold">
            <h5 className="text-foreground">Pro features include:</h5>
            <ul className="list-disc pl-4 space-y-1">
              <li>Unlimited memory index slots</li>
              <li>Custom collections organization</li>
              <li>Full Ask SaveForLatter semantic chat queries</li>
              <li>Web browser and smartphone plugins auto-sync</li>
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}
