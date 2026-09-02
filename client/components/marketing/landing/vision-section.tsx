"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon as Sparkles, PlaneIcon as Plane, FileTextIcon as FileText, Video01Icon as Video, Image01Icon as ImageIcon, GlobeIcon as Globe } from "@hugeicons/core-free-icons";

export default function VisionSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-background overflow-hidden border-t border-border/20">
      
      {/* Background large glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full pointer-events-none opacity-30 blur-[150px] dark:opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.08) 0%, rgba(20,71,230,0) 70%)"
        }}
      />

      <div className="mx-auto max-w-6xl px-6 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            MORE THAN BOOKMARKS
          </span>
          <h2 className="mt-6 text-balance font-medium text-4xl leading-[1.25] tracking-tight text-foreground sm:text-5xl">
            It's not a library. It's your memory.
          </h2>
          <p className="mt-4 text-balance text-muted-foreground text-base md:text-lg">
            Bookmarks store links. Notes store words. SaveForLatter connects everything you discover into a living, searchable memory.
          </p>
        </div>

        {/* Immersive Vision Chart Visual (Double Bordered Card!) */}
        <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-border/45 bg-muted/75 p-1.5 shadow-xs">
          <div className="p-6 md:p-10 rounded-[2.3rem] border border-border/75 bg-card backdrop-blur-md">
            
            <div className="text-center mb-10">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                YOUR MEMORY
              </span>
              <div className="flex justify-center gap-6 mt-4 text-xs font-medium text-muted-foreground">
                <span className="hover:text-foreground transition-colors cursor-default">Ideas</span>
                <span className="text-border/60">&middot;</span>
                <span className="hover:text-foreground transition-colors cursor-default">Research</span>
                <span className="text-border/60">&middot;</span>
                <span className="hover:text-foreground transition-colors cursor-default">Inspiration</span>
              </div>
            </div>

            {/* Interactive Mind Map representation with connecting lines */}
            <div className="relative min-h-[300px] flex items-center justify-center select-none">
              
              {/* SVG Connecting Paths */}
              <div className="absolute inset-0">
                <svg className="w-full h-full" viewBox="0 0 600 300" fill="none">
                  <defs>
                    <linearGradient id="vis-grad-l-v" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1447E6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#1447E6" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  
                  {/* Connection lines */}
                  <path d="M180,60 L180,130" stroke="#1447E6" strokeOpacity="0.3" strokeWidth="1.5" />
                  <path d="M420,60 L420,130" stroke="#1447E6" strokeOpacity="0.3" strokeWidth="1.5" />
                  <path d="M180,60 H420" stroke="#1447E6" strokeOpacity="0.2" strokeWidth="1.5" />
                  <path d="M180,60 L300,140" stroke="url(#vis-grad-l-v)" strokeWidth="1.5" strokeDasharray="3,3" />
                  <path d="M420,60 L300,140" stroke="url(#vis-grad-l-v)" strokeWidth="1.5" strokeDasharray="3,3" />
                  <path d="M300,170 L200,240" stroke="url(#vis-grad-l-v)" strokeWidth="1.5" strokeDasharray="3,3" />
                  <path d="M300,170 L400,240" stroke="url(#vis-grad-l-v)" strokeWidth="1.5" strokeDasharray="3,3" />
                </svg>
              </div>

              {/* Tree Nodes Layer */}
              <div className="absolute inset-0 flex flex-col justify-between items-center py-4 z-10">
                
                {/* Row 1 (Inputs) (Double Bordered Cards!) */}
                <div className="w-full flex justify-around max-w-lg">
                  <div className="rounded-lg border border-border/45 bg-muted/75 p-0.5 shadow-xs">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 border border-border/75 bg-card rounded-md">
                      <HugeiconsIcon icon={Globe} strokeWidth={2.25} className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-[11px] font-medium text-foreground">Website</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border/45 bg-muted/75 p-0.5 shadow-xs">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 border border-border/75 bg-card rounded-md">
                      <HugeiconsIcon icon={Video} strokeWidth={2.25} className="h-3.5 w-3.5 text-red-500" />
                      <span className="text-[11px] font-medium text-foreground">Video</span>
                    </div>
                  </div>
                </div>

                {/* Row 2 (Unified Concept) */}
                <div className="rounded-2xl border border-primary/20 bg-muted/75 p-0.5 shadow-md">
                  <div className="flex items-center gap-2 px-5 py-2.5 border border-primary/35 bg-card rounded-xl">
                    <HugeiconsIcon icon={Plane} strokeWidth={2.25} className="h-4.5 w-4.5 text-primary fill-current/10" />
                    <span className="text-xs font-bold text-foreground">Japan Trip</span>
                  </div>
                </div>

                {/* Row 3 (Outputs/Connected nodes) */}
                <div className="w-full flex justify-around max-w-lg">
                  <div className="rounded-lg border border-border/45 bg-muted/75 p-0.5 shadow-xs">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 border border-border/75 bg-card rounded-md">
                      <HugeiconsIcon icon={ImageIcon} strokeWidth={2.25} className="h-3.5 w-3.5 text-foreground" />
                      <span className="text-[11px] font-medium text-foreground">Screenshot</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border/45 bg-muted/75 p-0.5 shadow-xs">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 border border-border/75 bg-card rounded-md">
                      <HugeiconsIcon icon={FileText} strokeWidth={2.25} className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-[11px] font-medium text-foreground">Article</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
