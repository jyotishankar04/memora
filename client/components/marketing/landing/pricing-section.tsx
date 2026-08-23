"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for casual saving and organization.",
    features: [
      "Save up to 150 items / month",
      "Web interface access",
      "Standard text keyword search",
      "Clean reader view for articles",
      "Sync across 2 devices",
    ],
    cta: "Start for free",
    href: "/auth/signup",
    popular: false,
  },
  {
    name: "Pro",
    price: "$8",
    billing: "/ month",
    description: "For creators, developers, and researchers seeking a real second brain.",
    features: [
      "Unlimited items & storage",
      "Chrome/Firefox Extension & Mobile Apps",
      "AI Auto-Summarization & Auto-Tagging",
      "Image OCR & PDF search indexing",
      "Video audio transcriptions",
      "Ask Memora (Natural Language AI Querying)",
      "Priority customer support",
    ],
    cta: "Upgrade to Pro",
    href: "/auth/signup?plan=pro",
    popular: true,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative w-full py-20 md:py-28 bg-background border-t border-border/20">
      
      {/* Glow backgrounds */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-40 blur-[130px]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.06) 0%, rgba(20,71,230,0) 70%)"
        }}
      />

      <div className="mx-auto max-w-6xl px-6 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            PRICING
          </span>
          <h2 className="mt-6 font-medium text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
            Simple, transparent pricing.
          </h2>
          <p className="mt-4 text-muted-foreground text-base">
            Start completely free. Upgrade to unlock powerful AI features when you need them.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "rounded-[2rem] p-8 bg-card border flex flex-col justify-between transition-all duration-300 relative shadow-sm hover:shadow-md",
                plan.popular 
                  ? "border-primary/45 bg-radial from-primary/5 via-card to-card shadow-[0_20px_50px_rgba(20,71,230,0.08)]" 
                  : "border-border/60"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 right-8 text-[10px] font-bold tracking-widest text-primary-foreground bg-primary px-3 py-1 rounded-full uppercase shadow-[0_2px_10px_rgba(20,71,230,0.3)]">
                  RECOMMENDED
                </span>
              )}

              <div>
                <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mt-2">{plan.description}</p>
                
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">{plan.price}</span>
                  {plan.billing && <span className="text-sm text-muted-foreground">{plan.billing}</span>}
                </div>

                <div className="h-px bg-border/40 my-6" />

                <ul className="space-y-3.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-xs/relaxed text-foreground/80">
                      <div className={cn(
                        "h-4 w-4 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                        plan.popular ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        <Check className="h-3 w-3 stroke-[2.5]" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href={plan.href}
                  className={cn(
                    buttonVariants({ variant: plan.popular ? "default" : "outline", size: "default" }),
                    "w-full h-11 rounded-full flex items-center justify-center font-medium gap-1 text-sm transition-all duration-200",
                    plan.popular 
                      ? "bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm" 
                      : "hover:bg-muted"
                  )}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
