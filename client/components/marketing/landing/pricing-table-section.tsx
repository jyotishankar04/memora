"use client";

import React from "react";
import Link from "next/link";
import { Box, CheckCircle, Gem, type LucideIcon, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period?: string;
  isRecommended: boolean;
  icon: LucideIcon;
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
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-20 bg-background border-t border-border/20">
      <h2 className="text-balance text-center font-medium text-4xl tracking-[-0.04em] sm:text-[2.75rem] text-foreground">
        Plans & Pricing
      </h2>
      <p className="mt-2 text-balance text-center text-lg text-muted-foreground -tracking-[0.01em] sm:mt-4 sm:text-2xl">
        Flexible pricing designed to grow with you ready
      </p>

      <div className="mt-12 grid grid-cols-1 gap-1 rounded-xl border bg-muted/40 p-1 sm:mt-16 sm:grid-cols-2 md:mt-15 md:grid-cols-3 border-border/50">
        {pricingPlans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>
    </section>
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
        <plan.icon className="mb-5 text-primary h-6 w-6 stroke-[2]" />
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
          render={<Link href={plan.href} />}
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
              <CheckCircle className="size-4 shrink-0 text-primary mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
