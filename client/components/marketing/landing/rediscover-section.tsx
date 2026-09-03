"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon as Sparkles, GlobeIcon as Globe, FileTextIcon as FileText, Video01Icon as Video, Clock01Icon as Clock } from "@hugeicons/core-free-icons";
import { ParallaxGlow } from "@/components/ui/parallax-glow";

const oldMemories = [
  { type: "Website", title: "houzz.com/kitchen-remodel", icon: Globe, color: "text-blue-500 bg-blue-500/10", excerpt: "Budget-friendly kitchen upgrades that still feel high-end." },
  { type: "Article", title: "Best Paint Colors for 2026", icon: FileText, color: "text-amber-500 bg-amber-500/10", excerpt: "Warm neutrals and earthy tones are trending this year." },
  { type: "Website", title: "wayfair.com/lighting", icon: Globe, color: "text-foreground bg-foreground/10", excerpt: "Pendant lights and lamps that instantly warm up a room." },
  { type: "Video", title: "IKEA Shelving Hacks", icon: Video, color: "text-red-500 bg-red-500/10", excerpt: "Simple mods to make basic shelves look custom-built." },
];

export default function RediscoverSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-background overflow-hidden border-t border-border/20">
      
      {/* Background soft glow */}
      <ParallaxGlow className="w-[600px] h-[500px] opacity-20 blur-[130px] dark:opacity-5" />

      <div className="mx-auto max-w-6xl px-6 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            REDISCOVER
          </span>
          <h2 className="mt-6 text-balance font-medium text-4xl leading-[1.25] tracking-tight text-foreground sm:text-5xl">
            Some of your best ideas are already in your memory.
          </h2>
          <p className="mt-4 text-balance text-muted-foreground text-base md:text-lg">
            You saved it for a reason. SaveForLatter brings old discoveries back when they become useful again.
          </p>
        </div>

        {/* Visual: Horizontal Collection with Timeline Label */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Timeline header */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground tracking-widest uppercase">
              <HugeiconsIcon icon={Clock} strokeWidth={2.25} className="h-4 w-4 text-primary" />
              <span>6 months ago</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-border/80 to-transparent" />
          </div>

          {/* Cards list (Double Bordered Cards!) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {oldMemories.map((mem, idx) => {
              const Icon = mem.icon;
              return (
                <div 
                  key={idx}
                  className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full group">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`p-1.5 rounded-lg ${mem.color}`}>
                          <HugeiconsIcon icon={Icon} strokeWidth={2.25} className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          {mem.type}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        {mem.title}
                      </h4>

                      <p className="text-[10px]/relaxed text-muted-foreground mt-2">
                        {mem.excerpt}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-border/20 flex items-center justify-between text-[9px] font-mono text-muted-foreground">
                      <span>Saved Mar 2026</span>
                      <span className="text-primary/70 font-semibold group-hover:underline">View Memory</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI suggestion banner */}
          <div className="relative p-5 rounded-2xl border border-primary/20 bg-primary/5 max-w-2xl mx-auto text-center space-y-2">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(20,71,230,0.2)]">
              <HugeiconsIcon icon={Sparkles} strokeWidth={2.25} className="h-4.5 w-4.5 fill-current" />
            </div>
            
            <h4 className="text-sm font-semibold text-foreground">
              ✦ You might find these useful now.
            </h4>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              You saved these while exploring <span className="font-semibold text-foreground">home renovation</span>.
              <br />
              <span className="text-primary font-medium">3 of them relate directly</span> to your recent searches for "kitchen ideas" and "paint colors".
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
