"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getMyPlan, listPublicPlans, formatLimitValue, formatPriceMinor, PLAN_LIMIT_LABEL, type PlanLimitType } from "@/lib/plans";
import { createCheckoutSession } from "@/lib/billing";
import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/auth";
import { QueryErrorState } from "@/components/query-error-state";

const LIMIT_ORDER: PlanLimitType[] = [
  "memory_count",
  "ai_monthly_queries",
  "ai_monthly_vision_queries",
  "storage_mb",
  "collection_count",
  "public_share_count",
];

type BillingInterval = "monthly" | "semi_annual" | "yearly";

const BILLING_INTERVAL_CONFIG: Record<BillingInterval, { label: string; discount?: string }> = {
  monthly: { label: "Monthly" },
  semi_annual: { label: "Semi-Annual", discount: "15% Off" },
  yearly: { label: "Annual", discount: "20% Off" },
};

export default function BillingSettingsPage() {
  const [selectedInterval, setSelectedInterval] = useState<BillingInterval>("monthly");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["plans", "me"],
    queryFn: getMyPlan,
  });

  const { data: allPlans } = useQuery({
    queryKey: ["plans", "public"],
    queryFn: listPublicPlans,
  });

  const checkoutMutation = useMutation({
    mutationFn: (planKey: string) => createCheckoutSession(planKey),
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: (err) => {
      const message = err instanceof ApiError && err.status === 503 ? "Billing isn't set up yet" : "Couldn't start checkout";
      toast.add({ title: message, type: "error" });
    },
  });

  const upgradeTargets = (allPlans ?? []).filter((p) => p.key !== data?.plan.key && !p.isDefault && p.billingInterval === selectedInterval);

  return (
    <div className="space-y-6 max-w-3xl text-xs font-semibold">

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
          </div>

          {/* Billing Interval Tabs with Discount Badges */}
          <div className="space-y-4">
            <div className="flex gap-2 bg-muted/30 p-1 rounded-lg w-fit">
              {(["monthly", "semi_annual", "yearly"] as const).map((interval) => {
                const config = BILLING_INTERVAL_CONFIG[interval];
                const isActive = selectedInterval === interval;
                return (
                  <button
                    key={interval}
                    onClick={() => setSelectedInterval(interval)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-semibold text-sm ${
                      isActive
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{config.label}</span>
                    {config.discount && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isActive
                          ? "bg-green-500/20 text-green-600"
                          : "bg-green-500/10 text-green-600"
                      }`}>
                        {config.discount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Upgrade Plans Grid */}
            {upgradeTargets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upgradeTargets.map((plan) => (
                  <div key={plan.id} className="p-4 border border-border/60 bg-card rounded-lg space-y-3 hover:border-border hover:shadow-sm transition-all">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{plan.name}</h4>
                      <p className="text-[11px] text-muted-foreground mt-1">{plan.description || "Upgrade your experience"}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-foreground">
                        {formatPriceMinor(plan.priceMinor, plan.currency)}
                        {plan.priceMinor > 0 && (
                          <span className="text-xs font-semibold text-muted-foreground ml-2">
                            {selectedInterval === "monthly" ? "/ month" : selectedInterval === "semi_annual" ? "/ 6 months" : "/ year"}
                          </span>
                        )}
                      </div>
                      {plan.priceMinor > 0 && selectedInterval !== "monthly" && (
                        <p className="text-[10px] text-green-600 font-semibold">
                          💰 {selectedInterval === "semi_annual" ? "Save 15%" : "Save 20%"} compared to monthly
                        </p>
                      )}
                    </div>

                    <Button
                      disabled={checkoutMutation.isPending}
                      onClick={() => checkoutMutation.mutate(plan.key)}
                      className="w-full h-9 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90"
                    >
                      {checkoutMutation.isPending ? "Redirecting…" : `Upgrade to ${plan.name}`}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border border-border/60 bg-muted/10 rounded-lg text-center">
                <p className="text-[10px] text-muted-foreground">You're already on the best {BILLING_INTERVAL_CONFIG[selectedInterval].label.toLowerCase()} plan available</p>
              </div>
            )}
          </div>

          <div className="p-4 border border-border/60 bg-muted/15 rounded-xl space-y-2 text-[10px] text-muted-foreground font-semibold">
            <h5 className="text-foreground font-bold">Pro features include:</h5>
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
