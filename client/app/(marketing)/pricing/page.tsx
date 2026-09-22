"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/marketing/navbar";
import MainFooter from "@/components/marketing/landing/main-footer";
import PricingTableSection from "@/components/marketing/landing/pricing-table-section";
import { listPublicPlans } from "@/lib/plans";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle01Icon as CheckCircle } from "@hugeicons/core-free-icons";

type BillingInterval = "monthly" | "semi_annual" | "yearly";

const FEATURE_LIST = [
  { key: "memory_count", label: "Memory Count Limit" },
  { key: "ai_monthly_queries", label: "AI Queries / Month" },
  { key: "ai_monthly_vision_queries", label: "Vision Queries / Month" },
  { key: "storage_mb", label: "Storage" },
  { key: "collection_count", label: "Collections" },
  { key: "public_share_count", label: "Public Shares" },
  { key: "batchOperations", label: "Batch Operations" },
  { key: "importExport", label: "Import/Export" },
  { key: "calendarSync", label: "Calendar Sync" },
  { key: "browserExtension", label: "Browser Extension" },
  { key: "advancedSearch", label: "Advanced Search" },
  { key: "vault", label: "Secure Vault" },
  { key: "emailCampaigns", label: "Email Campaigns" },
  { key: "dataExport", label: "Data Export" },
  { key: "aiEventDetection", label: "AI Event Detection" },
];

const BILLING_INTERVAL_CONFIG: Record<BillingInterval, { label: string; discount?: string }> = {
  monthly: { label: "Monthly" },
  semi_annual: { label: "Semi-Annual", discount: "15% Off" },
  yearly: { label: "Annual", discount: "20% Off" },
};

export default function PricingPage() {
  const [selectedInterval, setSelectedInterval] = useState<BillingInterval>("monthly");

  const { data: allPlans } = useQuery({
    queryKey: ["plans", "public"],
    queryFn: listPublicPlans,
  });

  const plans = allPlans?.filter(p => p.billingInterval === selectedInterval).sort((a, b) => {
    const order = { free: 0, plus: 1, pro: 2 };
    const aOrder = order[a.key as keyof typeof order] ?? 999;
    const bOrder = order[b.key as keyof typeof order] ?? 999;
    return aOrder - bOrder;
  }) || [];

  const formatLimit = (value: number | null) => {
    if (value === null) return "Unlimited";
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/[0.03] via-background to-background text-foreground font-sans">
      <Navbar />

      <main className="flex-1 pt-20">
        <PricingTableSection />

        {/* Comparison Table Section */}
        {plans.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 py-20">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                Compare Plans
              </span>
              <h2 className="mt-6 font-medium text-4xl tracking-tight text-foreground sm:text-5xl">
                Compare our plans
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Explore the differences and find the perfect fit for your needs
              </p>
            </div>

            {/* Billing Interval Tabs */}
            <div className="flex justify-center mb-8">
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
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Feature</th>
                    {plans.map((plan) => (
                      <th key={plan.id} className="text-center py-4 px-4 font-semibold text-foreground">
                        <div className="text-lg">{plan.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {plan.priceMinor === 0 ? (
                            <span>Free</span>
                          ) : (
                            <>
                              <div className="font-bold text-foreground">${(plan.priceMinor / 100).toFixed(2)}</div>
                              <div className="text-xs">
                                {selectedInterval === "monthly" ? "/ month" : selectedInterval === "semi_annual" ? "/ 6 months" : "/ year"}
                              </div>
                            </>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_LIST.map((feature, idx) => (
                    <tr key={feature.key} className={`border-b border-border/50 ${idx % 2 === 0 ? "bg-muted/20" : ""}`}>
                      <td className="py-4 px-4 font-medium text-foreground text-sm">{feature.label}</td>
                      {plans.map((plan) => {
                        let hasFeature = false;
                        // Annotated rather than left to evolve from `null`: the
                        // limit keys are optional, so each read is number |
                        // null | undefined and formatLimit takes number | null.
                        let value: number | null = null;

                        // Check plan limits
                        if (feature.key === "memory_count" && "memory_count" in plan.limits) {
                          value = plan.limits.memory_count ?? null;
                          hasFeature = value !== null;
                        } else if (feature.key === "ai_monthly_queries" && "ai_monthly_queries" in plan.limits) {
                          value = plan.limits.ai_monthly_queries ?? null;
                          hasFeature = value !== null;
                        } else if (feature.key === "ai_monthly_vision_queries" && "ai_monthly_vision_queries" in plan.limits) {
                          value = plan.limits.ai_monthly_vision_queries ?? null;
                          hasFeature = value !== null;
                        } else if (feature.key === "storage_mb" && "storage_mb" in plan.limits) {
                          value = plan.limits.storage_mb ?? null;
                          hasFeature = value !== null;
                        } else if (feature.key === "collection_count" && "collection_count" in plan.limits) {
                          value = plan.limits.collection_count ?? null;
                          hasFeature = value !== null;
                        } else if (feature.key === "public_share_count" && "public_share_count" in plan.limits) {
                          value = plan.limits.public_share_count ?? null;
                          hasFeature = value !== null;
                        } else if (feature.key in (plan.features || {})) {
                          hasFeature = (plan.features as Record<string, boolean>)[feature.key] === true;
                        }

                        return (
                          <td key={plan.id} className="py-4 px-4 text-center">
                            {hasFeature ? (
                              <div className="flex items-center justify-center gap-2">
                                <HugeiconsIcon icon={CheckCircle} strokeWidth={2.25} className="h-5 w-5 text-green-600" />
                                {value !== null && <span className="font-semibold text-sm text-foreground">{formatLimit(value)}</span>}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CTA Section */}
            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">Ready to upgrade?</p>
              <a
                href="/auth/signup"
                className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors"
              >
                Get Started
              </a>
            </div>
          </section>
        )}
      </main>

      <MainFooter />
    </div>
  );
}
