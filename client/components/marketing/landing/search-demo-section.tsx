"use client";

import React from "react";
import { Search, Globe, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const exampleSearches = [
  "that React tutorial I saved",
  "websites for my SaaS inspiration",
  "everything I saved about AI agents",
  "that screenshot with the dashboard",
  "articles about PostgreSQL",
];

const results = [
  {
    type: "WEBSITE",
    domain: "stripe.com",
    title: "SaaS landing inspiration",
    description: "Stripe's clean product layouts, interactive visual cards, and responsive headers.",
    active: false,
  },
  {
    type: "WEBSITE",
    domain: "linear.app",
    title: "Pricing UI inspiration",
    description: "Sleek tier listings with subtle blue gradients and a toggle for annual billing.",
    active: true, // highlighted card
  },
  {
    type: "WEBSITE",
    domain: "tailwindui.com",
    title: "Dashboard inspiration",
    description: "Sidebar navigation components, clean tables, and metric grid designs.",
    active: false,
  },
];

export default function SearchDemoSection() {
  const [selectedSearch, setSelectedSearch] = React.useState(1); // default active query

  return (
    <section className="relative w-full py-20 md:py-28 bg-background overflow-hidden border-t border-border/20">
      
      {/* Subtle blue accent background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[130px] dark:opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.08) 0%, rgba(20,71,230,0) 70%)"
        }}
      />

      <div className="mx-auto max-w-6xl px-6 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            SEARCH YOUR MEMORY
          </span>
          <h2 className="mt-6 text-balance font-medium text-4xl leading-[1.25] tracking-tight text-foreground sm:text-5xl">
            You don't need to remember where you saved it.
          </h2>
          <p className="mt-4 text-balance text-muted-foreground text-base md:text-lg">
            Just describe what you're looking for. Memora understands the meaning behind your memories, not just the words.
          </p>
        </div>

        {/* Search App Interface Wrapper */}
        <div className="mx-auto max-w-4xl rounded-2xl border border-border/60 bg-card shadow-[0_16px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.2)] overflow-hidden">
          
          {/* Mock App Header / Tab Bar */}
          <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-border" />
              <div className="h-2.5 w-2.5 rounded-full bg-border" />
              <div className="h-2.5 w-2.5 rounded-full bg-border" />
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
              MEMORA WEB APP v1.0
            </div>
            <div className="w-10" />
          </div>

          {/* Actual Search Box Component */}
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Search Input Container */}
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-primary stroke-[2.5]" />
              <div className="w-full text-sm md:text-base bg-background text-foreground border border-border rounded-xl pl-12 pr-4 py-3.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                <span>that SaaS website with the </span>
                <span className="text-primary font-semibold underline decoration-primary/45 decoration-2 underline-offset-4">
                  blue pricing section
                </span>
                <span> I liked</span>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground tracking-wide">
                12 memories found
              </span>
              <div className="h-px flex-1 bg-border/40 mx-4" />
            </div>

            {/* Grid of Results (Double Bordered Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "rounded-xl border p-1 transition-all duration-300",
                    result.active 
                      ? "border-primary/30 bg-primary/5 shadow-xs" 
                      : "border-border/45 bg-muted/75"
                  )}
                >
                  <div
                    className={cn(
                      "p-4 rounded-lg border bg-card flex flex-col justify-between h-full transition-all duration-300 relative group",
                      result.active 
                        ? "border-primary/40 shadow-xs" 
                        : "border-border/75 hover:border-primary/30"
                    )}
                  >
                    {result.active && (
                      <div className="absolute top-3.5 right-4 h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}

                    <div>
                      {/* Card Category Header */}
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground tracking-wider uppercase mb-3">
                        <Globe className="h-3 w-3 text-muted-foreground/80" />
                        <span>{result.type}</span>
                        <span className="text-border/60">&middot;</span>
                        <span className="normal-case font-medium">{result.domain}</span>
                      </div>

                      <h4 className={cn(
                        "text-sm font-semibold transition-colors",
                        result.active ? "text-primary" : "text-foreground group-hover:text-primary"
                      )}>
                        {result.title}
                      </h4>

                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        {result.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/20">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {result.domain}/pricing
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Reasoning explanation box (Double Bordered as well!) */}
            <div className="rounded-xl border border-primary/25 bg-muted/50 p-1">
              <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5 flex items-start gap-3">
                <div className="h-5 w-5 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="h-3 w-3 fill-current" />
                </div>
                <p className="text-xs text-muted-foreground leading-normal">
                  <span className="font-semibold text-foreground mr-1">Memora found these because they match:</span>
                  <span className="inline-flex gap-1.5 flex-wrap mt-1 md:mt-0">
                    {["SaaS", "Landing pages", "Pricing", "Blue UI"].map((tag, idx) => (
                      <span 
                        key={idx}
                        className="bg-primary/10 text-primary border border-primary/10 px-2 py-0.5 rounded-md text-[10px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Example Search pills below interface */}
        <div className="mt-12 text-center">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Try searching for
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            {exampleSearches.map((term, idx) => (
              <button
                key={idx}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-border/80 bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-200"
              >
                "{term}"
              </button>
            ))}
          </div>
        </div>

        {/* Section Ending Centered */}
        <div className="mt-20 text-center">
          <p className="text-xl md:text-2xl font-medium tracking-tight text-foreground/90">
            Search less. <span className="text-primary font-semibold">Remember more.</span>
          </p>
        </div>

      </div>
    </section>
  );
}
