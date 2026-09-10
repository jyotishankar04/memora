"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { BoxIcon as Box, CheckmarkCircle01Icon as CheckCircle, GemIcon as Gem, CrownIcon as Crown } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { listPublicPlans, formatPriceMinor, planLimitBullets, type PublicPlan } from "@/lib/plans";

// Keyed by the plan's stable `key` (never renamed, unlike `name`) — falls
// back to Crown for any plan an admin creates later that isn't one of these.
const PLAN_ICON: Record<string, IconSvgElement> = {
  free: Box,
  plus: Gem,
};

export default function PricingTableSection() {
  const { data: plans, isLoading, isError } = useQuery({
    queryKey: ["plans", "public"],
    queryFn: listPublicPlans,
  });

  // The middle tier of 3+ gets the "Most Popular" badge — the classic
  // pricing-psychology nudge away from both Free and the top tier. Fewer
  // than 3 active plans and nothing gets badged rather than guessing.
  const recommendedIndex = plans && plans.length >= 3 ? Math.floor((plans.length - 1) / 2) : -1;

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-20 border-t border-border/20">
      <h2 className="text-balance text-center font-medium text-4xl tracking-[-0.04em] sm:text-[2.75rem] text-foreground">
        Plans & Pricing
      </h2>
      <p className="mt-2 text-balance text-center text-lg text-muted-foreground tracking-[-0.01em] sm:mt-4 sm:text-2xl">
        Flexible pricing designed to grow with you
      </p>

      {isError && (
        <p className="mt-12 text-center text-sm text-destructive">Couldn&apos;t load pricing right now — please try again shortly.</p>
      )}

      {isLoading && (
        <div className="mt-12 grid grid-cols-1 gap-1 rounded-xl border bg-muted/40 p-1 sm:mt-16 sm:grid-cols-2 md:mt-15 md:grid-cols-3 border-border/50">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-background border-border/50 p-6 space-y-4">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-32 mt-4" />
              <Skeleton className="h-10 w-full rounded-full mt-6" />
            </div>
          ))}
        </div>
      )}

      {plans && plans.length > 0 && (
        <div className="mt-12 grid grid-cols-1 gap-1 rounded-xl border bg-muted/40 p-1 sm:mt-16 sm:grid-cols-2 md:mt-15 md:grid-cols-3 border-border/50">
          {plans.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} isRecommended={i === recommendedIndex} />
          ))}
        </div>
      )}
    </section>
  );
}

const PlanCard = ({ plan, isRecommended }: { plan: PublicPlan; isRecommended: boolean }) => {
  const icon = PLAN_ICON[plan.key] ?? Crown;
  const isFree = plan.priceMinor === 0;
  const period = plan.billingInterval === "monthly" ? "/ month" : plan.billingInterval === "yearly" ? "/ year" : undefined;
  const bullets = planLimitBullets(plan.limits);

  return (
    <div className="relative rounded-lg border bg-background border-border/50 flex flex-col justify-between h-full hover:border-primary/20 transition-colors duration-300 shadow-xs">
      {isRecommended && (
        <Badge className="absolute top-3.5 right-3 bg-primary text-primary-foreground hover:bg-primary/90 z-20">
          Most Popular
        </Badge>
      )}
      <div className="rounded-t-lg border-b border-dashed border-border/80 p-6 flex-1">
        <HugeiconsIcon icon={icon} strokeWidth={2.25} className="mb-5 text-primary h-6 w-6 stroke-[2]" />
        <div className="flex items-center gap-1">
          <h3 className="font-medium text-2xl tracking-tight text-foreground">{plan.name}</h3>
        </div>
        {plan.description && <p className="my-2 text-muted-foreground text-sm leading-relaxed">{plan.description}</p>}
      </div>
      <div className="px-6 pt-5 pb-10 flex flex-col justify-end">
        <div className="flex items-baseline gap-1">
          <span className="font-semibold text-4xl text-foreground">{formatPriceMinor(plan.priceMinor, plan.currency)}</span>
          {!isFree && period && <span className="text-muted-foreground text-sm font-medium">{period}</span>}
        </div>
        <p className="mt-1 text-muted-foreground text-xs tracking-normal">
          {isFree ? "free forever" : period ? "billed monthly" : "one-time"}
        </p>
        <Button
          render={<Link href={`/auth/signup?plan=${plan.key}`} />}
          nativeButton={false}
          className="my-6 w-full h-10 rounded-full font-medium"
          size="lg"
          variant={isRecommended ? "default" : "outline"}
        >
          {isFree ? "Start Free" : `Get ${plan.name}`}
        </Button>
        <ul className="mt-4 space-y-2.5">
          {bullets.map((bullet) => (
            <li className="flex items-start gap-2 text-xs text-foreground/80" key={bullet}>
              <HugeiconsIcon icon={CheckCircle} strokeWidth={2.25} className="size-4 shrink-0 text-primary mt-0.5" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
