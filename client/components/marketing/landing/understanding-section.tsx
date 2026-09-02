"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon as ArrowDown, ArrowRight01Icon as ArrowRight, SparklesIcon as Sparkles, GlobeIcon as Globe, Target02Icon as Target, ListViewIcon as ListView, Tag01Icon as Tag, GitCompareIcon as GitCompare, Search01Icon as Search } from "@hugeicons/core-free-icons";
import { StackedCards, type StackedCard } from "@/components/ui/stacked-cards";
import { ParallaxGlow } from "@/components/ui/parallax-glow";

const structuredTags = ["Home Decor", "Kitchen", "Renovation", "Budget Tips", "Before & After"];

const pipelineStages: StackedCard[] = [
  {
    title: "Classify",
    description: "Figures out what it's looking at — a recipe, a design reference, a receipt, a task.",
    className: "bg-blue-600 text-white",
    config: { y: -20, rotate: -15 },
    visual: <HugeiconsIcon icon={Target} strokeWidth={1.75} className="h-9 w-9 opacity-80" />,
  },
  {
    title: "Extract",
    description: "Pulls out the useful details — ingredients, code, a due date — into structured fields.",
    className: "bg-slate-800 text-white",
    config: { y: 20, rotate: 8 },
    visual: <HugeiconsIcon icon={ListView} strokeWidth={1.75} className="h-9 w-9 opacity-80" />,
  },
  {
    title: "Tag & summarize",
    description: "Writes a short summary and adds tags automatically, so you never have to.",
    className: "bg-indigo-600 text-white",
    config: { y: -80, rotate: -5 },
    visual: <HugeiconsIcon icon={Tag} strokeWidth={1.75} className="h-9 w-9 opacity-80" />,
  },
  {
    title: "Connect",
    description: "Groups it with similar things you've saved before, no folders required.",
    className: "bg-emerald-600 text-white",
    config: { y: 20, rotate: 12 },
    visual: <HugeiconsIcon icon={GitCompare} strokeWidth={1.75} className="h-9 w-9 opacity-80" />,
  },
  {
    title: "Index",
    description: "Makes it instantly searchable by meaning, not just by the words you typed.",
    className: "bg-neutral-900 text-white",
    config: { y: 20, rotate: -5 },
    visual: <HugeiconsIcon icon={Search} strokeWidth={1.75} className="h-9 w-9 opacity-80" />,
  },
];

export default function UnderstandingSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-background overflow-hidden border-t border-border/20">
      
      {/* Subtle blue accent background glow */}
      <ParallaxGlow className="w-[600px] h-[500px] opacity-20 blur-[130px] dark:opacity-5" />

      <div className="mx-auto max-w-6xl px-6 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            AUTOMATICALLY ORGANIZED
          </span>
          <h2 className="mt-6 text-balance font-medium text-4xl leading-[1.25] tracking-tight text-foreground sm:text-5xl">
            You save it. SaveForLatter understands it.
          </h2>
          <p className="mt-4 text-balance text-muted-foreground text-base md:text-lg">
            No folders to create. No tags to maintain. SaveForLatter automatically understands what each memory is about.
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
                    <HugeiconsIcon icon={Globe} strokeWidth={2.25} className="h-8 w-8 text-muted-foreground/45 mb-1" />
                    <span className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">Kitchen Remodel Ideas</span>
                    <span className="text-[8px] text-muted-foreground/60 mt-0.5 font-mono">houzz.com/kitchens</span>
                    
                    {/* Mock card layout details */}
                    <div className="absolute bottom-1 right-2 left-2 h-1.5 bg-border/20 rounded" />
                    <div className="absolute bottom-3 right-6 left-6 h-1 bg-border/20 rounded" />
                  </div>
                </div>
              </div>

              {/* Transform Arrow */}
              <div className="flex flex-col items-center justify-center text-primary font-medium text-xs">
                <div className="flex items-center gap-1 text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/10 shadow-xs animate-pulse">
                  <HugeiconsIcon icon={Sparkles} strokeWidth={2.25} className="h-3.5 w-3.5 fill-current" />
                  <span>SaveForLatter understands</span>
                </div>
                
                {/* Desktop arrow */}
                <HugeiconsIcon icon={ArrowRight} strokeWidth={2.25} className="hidden md:block h-6 w-6 mt-3 text-primary stroke-[1.5]" />
                
                {/* Mobile arrow */}
                <HugeiconsIcon icon={ArrowDown} strokeWidth={2.25} className="block md:hidden h-6 w-6 mt-3 text-primary stroke-[1.5]" />
              </div>

              {/* Destination card: Structured details */}
              <div className="w-full md:w-5/12 rounded-xl border border-primary/20 bg-muted/75 p-1 shadow-md">
                <div className="p-5 rounded-lg border border-primary/25 bg-card">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-5 w-5 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                      <HugeiconsIcon icon={Sparkles} strokeWidth={2.25} className="h-3 w-3 fill-current" />
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
                    Before-and-after kitchen remodel with a budget breakdown and paint color picks.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Five stages of understanding, fanned out — click one to expand */}
        <div>
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Every memory goes through the same five steps
          </p>
          <StackedCards cards={pipelineStages} />
        </div>

      </div>
    </section>
  );
}
