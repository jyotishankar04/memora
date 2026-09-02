"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GlobeIcon as Globe, Video01Icon as Video, ChefHatIcon as ChefHat, Image01Icon as Image, FileTextIcon as FileText, StickyNote01Icon as StickyNote } from "@hugeicons/core-free-icons";

const items = [
  {
    title: "Websites",
    desc: "Save inspiration for later.",
    icon: Globe,
    color: "bg-blue-500/10 text-blue-600 border-blue-500/10",
    visual: (
      <div className="space-y-1.5 w-full">
        <div className="flex gap-1 items-center pb-2 border-b border-border/30">
          <div className="h-1.5 w-1.5 rounded-full bg-border" />
          <div className="h-1.5 w-1.5 rounded-full bg-border" />
          <div className="text-[7px] text-muted-foreground ml-1">stripe.com</div>
        </div>
        <div className="h-3 w-3/4 bg-muted rounded" />
        <div className="h-2 w-full bg-muted/60 rounded" />
      </div>
    ),
  },
  {
    title: "Videos",
    desc: "Keep the parts worth coming back to.",
    icon: Video,
    color: "bg-red-500/10 text-red-600 border-red-500/10",
    visual: (
      <div className="relative w-full aspect-video bg-muted rounded-lg border border-border/30 overflow-hidden flex items-center justify-center">
        <div className="h-6 w-6 rounded-full bg-background flex items-center justify-center shadow-xs">
          <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[7px] border-l-red-500 border-b-[4px] border-b-transparent ml-0.5" />
        </div>
        <div className="absolute bottom-1 right-1 text-[7px] font-mono bg-black/60 text-white px-1 rounded">12:34</div>
      </div>
    ),
  },
  {
    title: "Recipes",
    desc: "Save the recipe, skip the life story.",
    icon: ChefHat,
    color: "bg-orange-500/10 text-orange-600 border-orange-500/10",
    visual: (
      <div className="space-y-1.5 w-full">
        <div className="h-2 w-2/3 bg-orange-500/30 rounded" />
        <div className="space-y-1">
          <div className="h-1.5 w-full bg-muted/60 rounded" />
          <div className="h-1.5 w-[85%] bg-muted/60 rounded" />
          <div className="h-1.5 w-[70%] bg-muted/60 rounded" />
        </div>
      </div>
    ),
  },
  {
    title: "Screenshots",
    desc: "Turn visual references into searchable memories.",
    icon: Image,
    color: "bg-purple-500/10 text-purple-600 border-purple-500/10",
    visual: (
      <div className="relative w-full h-16 bg-gradient-to-tr from-purple-100 to-indigo-100 dark:from-purple-950/40 dark:to-indigo-950/40 rounded-lg border border-border/30 overflow-hidden flex items-center justify-center p-2">
        <div className="w-full h-full border border-dashed border-primary/20 rounded flex flex-col items-center justify-center text-[7px] text-primary/70 font-semibold gap-1 uppercase">
          <span>OCR Scanned</span>
          <div className="h-1 w-1/2 bg-primary/25 rounded" />
        </div>
      </div>
    ),
  },
  {
    title: "Articles",
    desc: "Keep the ideas, not just the URL.",
    icon: FileText,
    color: "bg-amber-500/10 text-amber-600 border-amber-500/10",
    visual: (
      <div className="space-y-1.5 w-full">
        <div className="h-2 w-1/3 bg-primary/30 rounded" />
        <div className="h-3 w-5/6 bg-muted rounded" />
        <div className="space-y-1">
          <div className="h-1.5 w-full bg-muted/60 rounded" />
          <div className="h-1.5 w-[90%] bg-muted/60 rounded" />
        </div>
      </div>
    ),
  },
  {
    title: "Notes",
    desc: "Capture the thought before it disappears.",
    icon: StickyNote,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/10",
    visual: (
      <div className="p-2 border border-yellow-500/20 bg-yellow-500/5 dark:bg-yellow-500/2.5 rounded-lg flex flex-col gap-1.5">
        <span className="text-[7px] font-bold text-yellow-600 tracking-wider uppercase">Quick Memo</span>
        <div className="h-2 w-3/4 bg-yellow-500/10 rounded" />
        <div className="h-1.5 w-full bg-yellow-500/10 rounded" />
      </div>
    ),
  },
];

export default function ContentTypesSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-background overflow-hidden border-t border-border/20">
      
      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[130px] dark:opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.06) 0%, rgba(20,71,230,0) 70%)"
        }}
      />

      <div className="mx-auto max-w-6xl px-6 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            BUILT FOR EVERYTHING
          </span>
          <h2 className="mt-6 text-balance font-medium text-4xl leading-[1.25] tracking-tight text-foreground sm:text-5xl">
            However you discover it, SaveForLatter remembers.
          </h2>
          <p className="mt-4 text-balance text-muted-foreground text-base md:text-lg">
            Every format is formatted, indexed, and semantic-search optimized automatically.
          </p>

          {/* Inline colored-pill sentence, mymind-style */}
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 text-sm text-muted-foreground">
            <span>All your</span>
            {items.map((item, idx) => (
              <span
                key={item.title}
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${item.color}`}
              >
                {item.title.toLowerCase()}
              </span>
            ))}
            <span>in one searchable place.</span>
          </p>
        </div>

        {/* Asymmetrical Cards Grid (Double Bordered Cards!) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65 hover:border-primary/20 transition-all duration-300"
              >
                <div className="p-6 rounded-xl border border-border/75 bg-card flex flex-col group">
                  <div>
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-2 rounded-xl border ${item.color}`}>
                        <HugeiconsIcon icon={Icon} strokeWidth={2.25} className="h-4.5 w-4.5" />
                      </div>
                      <span className="text-[10px] text-muted-foreground/60 tracking-widest font-bold font-mono">
                        TYPE_0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Styled card visual container */}
                  <div className="mt-6 p-4 rounded-xl border border-border/40 bg-background/50 flex items-center justify-center min-h-[100px]">
                    {item.visual}
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
