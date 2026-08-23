"use client";

import React from "react";
import { ArrowDown, ArrowRight, Sparkles, Globe, Video, Image, Code } from "lucide-react";

const examples = [
  { type: "Website", icon: Globe, color: "text-blue-500 bg-blue-500/10 border-blue-500/20", tags: ["Design", "SaaS", "Inspiration"] },
  { type: "Video", icon: Video, color: "text-red-500 bg-red-500/10 border-red-500/20", tags: ["AI", "Tutorial", "Education"] },
  { type: "Screenshot", icon: Image, color: "text-purple-500 bg-purple-500/10 border-purple-500/20", tags: ["Dashboard", "UI", "Reference"] },
  { type: "GitHub repo", icon: Code, color: "text-foreground bg-foreground/10 border-foreground/20", tags: ["React", "Open Source", "Development"] },
];

const structuredTags = ["SaaS", "Landing Page", "Design Inspiration", "Pricing", "Product Design"];

export default function UnderstandingSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-background overflow-hidden border-t border-border/20">
      
      {/* Subtle blue accent background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[130px] dark:opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.06) 0%, rgba(20,71,230,0) 70%)"
        }}
      />

      <div className="mx-auto max-w-6xl px-6 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            AUTOMATICALLY ORGANIZED
          </span>
          <h2 className="mt-6 text-balance font-medium text-4xl leading-[1.25] tracking-tight text-foreground sm:text-5xl">
            You save it. Memora understands it.
          </h2>
          <p className="mt-4 text-balance text-muted-foreground text-base md:text-lg">
            No folders to create. No tags to maintain. Memora automatically understands what each memory is about.
          </p>
        </div>

        {/* Visual representation (Double Bordered Card) */}
        <div className="max-w-3xl mx-auto rounded-[2rem] border border-border/45 bg-muted/75 p-1.5 shadow-xs mb-16">
          <div className="p-8 rounded-[1.8rem] border border-border/75 bg-card backdrop-blur-md">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
              
              {/* Source card: Website preview */}
              <div className="w-full md:w-5/12 rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
                <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col gap-3">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-border" />
                    <div className="h-2 w-2 rounded-full bg-border" />
                    <div className="h-2 w-2 rounded-full bg-border" />
                  </div>
                  <div className="h-24 w-full bg-muted/65 rounded-lg border border-border/30 flex flex-col justify-center items-center p-3 relative overflow-hidden">
                    <Globe className="h-8 w-8 text-muted-foreground/45 mb-1" />
                    <span className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">SaaS Landing Page</span>
                    <span className="text-[8px] text-muted-foreground/60 mt-0.5 font-mono">stripe.com/billing</span>
                    
                    {/* Mock card layout details */}
                    <div className="absolute bottom-1 right-2 left-2 h-1.5 bg-border/20 rounded" />
                    <div className="absolute bottom-3 right-6 left-6 h-1 bg-border/20 rounded" />
                  </div>
                </div>
              </div>

              {/* Transform Arrow */}
              <div className="flex flex-col items-center justify-center text-primary font-medium text-xs">
                <div className="flex items-center gap-1 text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/10 shadow-xs animate-pulse">
                  <Sparkles className="h-3.5 w-3.5 fill-current" />
                  <span>Memora understands</span>
                </div>
                
                {/* Desktop arrow */}
                <ArrowRight className="hidden md:block h-6 w-6 mt-3 text-primary stroke-[1.5]" />
                
                {/* Mobile arrow */}
                <ArrowDown className="block md:hidden h-6 w-6 mt-3 text-primary stroke-[1.5]" />
              </div>

              {/* Destination card: Structured details */}
              <div className="w-full md:w-5/12 rounded-xl border border-primary/20 bg-muted/75 p-1 shadow-md">
                <div className="p-5 rounded-lg border border-primary/25 bg-card">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-5 w-5 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                      <Sparkles className="h-3 w-3 fill-current" />
                    </div>
                    <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">Structured Context</span>
                  </div>
                  
                  {/* List of tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {structuredTags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-primary/5 text-primary border border-primary/15 px-2.5 py-1 rounded-md text-[10px] font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
                    <span className="text-[9px] font-medium text-muted-foreground uppercase">AI Summary</span>
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-mono">100% indexed</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5 leading-normal">
                    SaaS landing page detailing billing features, custom pricing structures, and visual layouts.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Small examples grid (Double Bordered Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {examples.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65"
              >
                <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 rounded-lg border ${item.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{item.type}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {item.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="bg-muted text-muted-foreground border border-border/40 px-1.5 py-0.5 rounded text-[9px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
