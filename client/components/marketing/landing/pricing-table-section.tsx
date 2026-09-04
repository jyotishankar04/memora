"use client";

import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { BoxIcon as Box, CheckmarkCircle01Icon as CheckCircle, GemIcon as Gem, UsersIcon as Users } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ctaHref } from "@/lib/showcase";
import { BETA_MODE } from "@/lib/beta";
import { SquigglyText } from "@/components/ui/squiggly-text";
import { Rocket01Icon as Rocket } from "@hugeicons/core-free-icons";

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period?: string;
  isRecommended: boolean;
  icon: IconSvgElement;
  features: string[];
  cta: string;
  href: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    description: "Perfect for building your personal memory vault.",
    price: "₹0",
    isRecommended: false,
    icon: Box,
    features: [
      "500 memories",
      "Browser extension",
      "Basic search",
      "Collections",
      "AI organization",
    ],
    cta: "Start Free",
    href: "/auth/signup",
  },
  {
    name: "Pro",
    description: "Ideal for power users who want a true second brain.",
    price: "₹499",
    period: "/ month",
    isRecommended: true,
    icon: Gem,
    features: [
      "Unlimited memories",
      "Semantic search",
      "Ask SaveForLatter AI",
      "AI summaries",
      "Related memories",
      "Video & screenshot intelligence",
    ],
    cta: "Get Pro",
    href: "/auth/signup?plan=pro",
  },
  {
    name: "Team",
    description: "Best for growing teams and collaborative research.",
    price: "₹1,999",
    period: "/ month",
    isRecommended: false,
    icon: Users,
    features: [
      "Everything in Pro",
      "Team workspace (up to 5 users)",
      "Collaborative collections",
      "Shared notes & thoughts",
      "API access & webhooks",
    ],
    cta: "Get Team",
    href: "/auth/signup?plan=team",
  },
];

export default function PricingTableSection() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-20 border-t border-border/20">
      <h2 className="text-balance text-center font-medium text-4xl tracking-[-0.04em] sm:text-[2.75rem] text-foreground">
        Plans & Pricing
      </h2>
      <p className="mt-2 text-balance text-center text-lg text-muted-foreground tracking-[-0.01em] sm:mt-4 sm:text-2xl">
        Flexible pricing designed to grow with you ready
      </p>

      {BETA_MODE ? <PricingBetaPlaceholder /> : (
        <div className="mt-12 grid grid-cols-1 gap-1 rounded-xl border bg-muted/40 p-1 sm:mt-16 sm:grid-cols-2 md:mt-15 md:grid-cols-3 border-border/50">
          {pricingPlans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      )}
    </section>
  );
}

function PricingBetaPlaceholder() {
  return (
    <div className="mt-12 sm:mt-16 md:mt-15 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border/60 bg-muted/20 py-16 px-6 text-center">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
        <div className="w-10 h-10 flex items-center justify-center">
          <HugeiconsIcon icon={Rocket} strokeWidth={2.25} className="h-5 w-5 text-primary" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground">
        Pricing is <SquigglyText scale={[3, 6]} stepDuration={90} className="text-primary">still being built</SquigglyText>
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        We&apos;re in beta and finalizing plans. Join the waitlist and we&apos;ll let you know the moment pricing goes live.
      </p>
    </div>
  );
}

const PlanCard = ({ plan }: { plan: PricingPlan }) => {
  return (
    <div className="relative rounded-lg border bg-background border-border/50 flex flex-col justify-between h-full hover:border-primary/20 transition-colors duration-300 shadow-xs">
      {plan.isRecommended && (
        <Badge className="absolute top-3.5 right-3 bg-primary text-primary-foreground hover:bg-primary/90 z-20">
          Most Popular
        </Badge>
      )}
      <div className="rounded-t-lg border-b border-dashed border-border/80 p-6 flex-1">
        <HugeiconsIcon icon={plan.icon} strokeWidth={2.25} className="mb-5 text-primary h-6 w-6 stroke-[2]" />
        <div className="flex items-center gap-1">
          <h3 className="font-medium text-2xl tracking-tight text-foreground">{plan.name}</h3>
        </div>
        <p className="my-2 text-muted-foreground text-sm leading-relaxed">{plan.description}</p>
      </div>
      <div className="px-6 pt-5 pb-10 flex flex-col justify-end">
        <div className="flex items-baseline gap-1">
          <span className="font-semibold text-4xl text-foreground">
            {plan.price}
          </span>
          {plan.period && (
            <span className="text-muted-foreground text-sm font-medium">
              {plan.period}
            </span>
          )}
        </div>
        <p className="mt-1 text-muted-foreground text-xs tracking-normal">
          {plan.period ? "billed monthly" : "free forever"}
        </p>
        <Button
          render={<Link href={ctaHref(plan.href)} />}
          nativeButton={false}
          className="my-6 w-full h-10 rounded-full font-medium"
          size="lg"
          variant={plan.isRecommended ? "default" : "outline"}
        >
          {plan.cta}
        </Button>
        <ul className="mt-4 space-y-2.5">
          {plan.features.map((feature) => (
            <li className="flex items-start gap-2 text-xs text-foreground/80" key={feature}>
              <HugeiconsIcon icon={CheckCircle} strokeWidth={2.25} className="size-4 shrink-0 text-primary mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
