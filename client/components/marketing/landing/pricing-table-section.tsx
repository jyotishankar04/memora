"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle01Icon as CheckCircle, Rocket01Icon as Rocket } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { listPublicPlans, planLimitBullets, type PublicPlan } from "@/lib/plans";
import { ctaHref } from "@/lib/showcase";

export default function PricingTableSection() {
  const { data: allPlans, isLoading, isError } = useQuery({
    queryKey: ["plans", "public"],
    queryFn: listPublicPlans,
  });

  const plan = allPlans?.[0];

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-20 border-t border-border/20">
      <h2 className="text-balance text-center font-medium text-4xl tracking-[-0.04em] sm:text-[2.75rem] text-foreground">
        Free, no catch
      </h2>
      <p className="mt-2 text-balance text-center text-lg text-muted-foreground tracking-[-0.01em] sm:mt-4 sm:text-2xl">
        Open source and free for everyone — every feature, no limits, nothing to buy.
      </p>

      {isError && (
        <p className="mt-12 text-center text-sm text-destructive">Couldn&apos;t load pricing right now — please try again shortly.</p>
      )}

      {isLoading && (
        <div className="mt-12 max-w-md mx-auto rounded-lg border bg-background border-border/50 p-6 space-y-4">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-32 mt-4" />
          <Skeleton className="h-10 w-full rounded-full mt-6" />
        </div>
      )}

      {plan && <PlanCard plan={plan} />}
    </section>
  );
}

const PlanCard = ({ plan }: { plan: PublicPlan }) => {
  const bullets = planLimitBullets(plan.limits);

  return (
    <div className="relative mt-12 max-w-md mx-auto rounded-lg border bg-background border-border/50 flex flex-col justify-between shadow-xs">
      <div className="rounded-t-lg border-b border-dashed border-border/80 p-6">
        <HugeiconsIcon icon={Rocket} strokeWidth={2.25} className="mb-5 text-primary h-6 w-6 stroke-[2]" />
        <div className="flex items-center gap-1">
          <h3 className="font-medium text-2xl tracking-tight text-foreground">{plan.name}</h3>
        </div>
        {plan.description && <p className="my-2 text-muted-foreground text-sm leading-relaxed">{plan.description}</p>}
      </div>
      <div className="px-6 pt-5 pb-10 flex flex-col justify-end">
        <div className="flex items-baseline gap-1">
          <span className="font-semibold text-4xl text-foreground">$0</span>
        </div>
        <p className="mt-1 text-muted-foreground text-xs tracking-normal">free forever</p>
        <Button
          render={<Link href={ctaHref("/auth/signup")} />}
          nativeButton={false}
          className="my-6 w-full h-10 rounded-full font-medium"
          size="lg"
        >
          Start Free
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
